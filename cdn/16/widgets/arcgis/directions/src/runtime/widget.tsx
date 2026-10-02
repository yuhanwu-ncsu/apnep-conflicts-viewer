/** @jsx jsx */
import { React, jsx, css, type AllWidgetProps, UtilityManager, getAppStore, hooks, MutableStoreManager, ReactRedux, type IMState, ServiceManager, type ResourceSessions } from 'jimu-core'
import { type JimuMapView, JimuMapViewComponent } from 'jimu-arcgis'
import { defaultMessages as jimuUIMessages, Paper, WidgetPlaceholder } from 'jimu-ui'
import 'arcgis-map-components'
import RouteLayer from 'esri/layers/RouteLayer'
import PointBarrier from "esri/rest/support/PointBarrier"
import PolylineBarrier from "esri/rest/support/PolylineBarrier"
import PolygonBarrier from "esri/rest/support/PolygonBarrier"

import type { IMConfig } from '../config'
import { getDefaultOrgUnit, convertSearchConfigToJSAPISearchProperties, getUrlOfUseUtility, getAddressFromSources } from '../utils'
import defaultMessages from './translations/default'
import WidgetIcon from '../../icon.svg'
import UtilsAlert from './components/utils-alert'
import {
  applyDataActionToLayer,
  getSaveVisibilityConfig,
  getValidStopCount,
  setOutputDssNotReady,
  setOutputDssUnloadedAndSetLayer,
  solveRouteIfPossible
} from './runtime-utils'

const { useEffect, useState, useRef, useCallback, useMemo } = React
const DIRECTIONS_ACTION_BUTTON_SELECTOR = 'calcite-button.esri-directions__add-stop-button, calcite-button.esri-directions__edit-route-button'
const DIRECTIONS_ACTION_BUTTON_BG = 'var(--sys-color-action)'
const DIRECTIONS_ACTION_BUTTON_TEXT = 'var(--sys-color-action-text)'

const Widget = (props: AllWidgetProps<IMConfig>) => {
  const { config, id } = props
  const { searchConfig, routeConfig } = config
  const useMapWidgetId = props.useMapWidgetIds?.[0]
  const [jimuMapView, setJimuMapView] = useState<JimuMapView>(null)
  const sessionsRef = useRef<ResourceSessions>(null)
  const [utilitiesChangedFlag, setUtilitiesChangedFlag] = useState(Math.random())
  const containerRef = useRef<HTMLDivElement>(null)
  const componentDirectionsRef = useRef<HTMLArcgisDirectionsElement>(null)
  const refreshDirectionsForActionRef = useRef<(() => Promise<boolean>) | null>(null)
  const unwatchLastRouteRef = useRef<(() => void)>(null)
  const directionsButtonObserverRef = useRef<MutationObserver>(null)
  const prevLastRouteRef = useRef<__esri.RouteLayerSolveResult>(null)
  const translate = hooks.useTranslation(defaultMessages, jimuUIMessages)
  const defaultSearchHint = useMemo(() => translate('findAddressOrPlace'), [translate])
  const [isReadyToRender, setIsReadyToRender] = useState<boolean>(false)
  const resourceSessions = ReactRedux.useSelector((state: IMState) => {
    return state.resourceSessions
  })

  const onActiveMapViewChange = useCallback(activeView => {
    setJimuMapView(activeView)
  }, [])

  const getCurrentLayer = useCallback((): __esri.RouteLayer => {
    return componentDirectionsRef.current?.layer
  }, [])

  const loadDirectionsIfNeeded = useCallback(async () => {
    await componentDirectionsRef.current?.componentOnReady()
  }, [])

  const waitForDirectionsReady = useCallback(async (
    timeoutMs = 10000,
    options: { refreshOnError?: boolean } = {}
  ): Promise<boolean> => {
    const startTime = Date.now()
    let hasRefreshedOnError = false

    while (Date.now() - startTime < timeoutMs) {
      const directionsElement = componentDirectionsRef.current
      if (!directionsElement) {
        return false
      }

      await directionsElement.componentOnReady()
      if (directionsElement.state === 'ready') {
        return true
      }

      if (options.refreshOnError && directionsElement.state === 'error' && !hasRefreshedOnError) {
        hasRefreshedOnError = true
        const refreshed = await refreshDirectionsForActionRef.current?.()
        if (!refreshed) {
          return false
        }
        continue
      }

      await new Promise(resolve => {
        window.setTimeout(resolve, 100)
      })
    }

    return false
  }, [])

  const getDirections = useCallback(async (): Promise<__esri.RouteLayerSolveResult> => {
    const directionsElement = componentDirectionsRef.current
    if (!directionsElement) {
      throw new Error('Directions component is not available')
    }
    const isReady = await waitForDirectionsReady()
    if (!isReady) {
      throw new Error('Directions component is not ready')
    }
    return await directionsElement.getDirections()
  }, [waitForDirectionsReady])

  const updateFromDataAction = useCallback(async () => {
    if (!isReadyToRender || !props.mutableStateProps) {
      return
    }
    const layer = getCurrentLayer()
    if (!layer) {
      return
    }

    const appliedDataAction = await applyDataActionToLayer({
      layer,
      mutableStateProps: props.mutableStateProps,
      searchConfig,
      resolveAddress: getAddressFromSources
    })
    if (appliedDataAction) {
      MutableStoreManager.getInstance().updateStateValue(props.widgetId, appliedDataAction, null)
      return
    }

    await loadDirectionsIfNeeded()
    const isDirectionsReady = await waitForDirectionsReady(10000, { refreshOnError: true })
    if (!isDirectionsReady) {
      return
    }
    await solveRouteIfPossible({
      layer,
      getDirections
    })
  }, [getCurrentLayer, getDirections, isReadyToRender, loadDirectionsIfNeeded, props.mutableStateProps, props.widgetId, searchConfig, waitForDirectionsReady])

  useEffect(() => {
    function helper () {
      if (useMapWidgetId && routeConfig?.useUtility && searchConfig?.dataConfig?.length > 0) {
        const utilities = getAppStore().getState().appConfig?.utilities
        const isAnySearchUtilReady = searchConfig.dataConfig.some(searchDataConfig => {
          return !!searchDataConfig.useDataSource || utilities[searchDataConfig.useUtility.utilityId]
        })
        const isUtilReady = !!(utilities && utilities[routeConfig.useUtility.utilityId] && isAnySearchUtilReady)
        setIsReadyToRender(!!(routeConfig && isUtilReady))
      } else {
        setIsReadyToRender(false)
      }
    }
    helper()
  }, [useMapWidgetId, routeConfig?.useUtility, searchConfig?.dataConfig, routeConfig, props?.useUtilities])

  useEffect(() => {
    updateFromDataAction()
  })

  useEffect(() => {
    checkUtilityAccount()

    async function checkUtilityAccount () {
      if (sessionsRef.current === resourceSessions || !props?.useUtilities) {
        return
      }

      const prevResourceSessions = sessionsRef.current
      sessionsRef.current = resourceSessions

      const utilUrls = props?.useUtilities?.map(useUtility => {
        return UtilityManager.getInstance().getUtilityJson(useUtility.utilityId)?.url
      })
      const serverInfos = await Promise.all(utilUrls.map(utilUrl => {
        return ServiceManager.getInstance().fetchArcGISServerInfo(utilUrl)
      }))
      const urlSet = new Set<string>()
      for (let i = 0; i < utilUrls.length; i++) {
        urlSet.add(serverInfos[i]?.owningSystemUrl || utilUrls[i])
      }
      const urls = [...urlSet]
      const resourceSessionsKeys = Object.keys(resourceSessions || {})

      for (const url of urls) {
        // Owning system url exact match, `url` here is the owning system url
        if (resourceSessions[url] && resourceSessions[url] !== prevResourceSessions?.[url]) {
          setUtilitiesChangedFlag(Math.random())
          return
        }
        for (const resourceUrl of resourceSessionsKeys) {
          // The resource url is part of the full util url
          if (url.includes(resourceUrl) && resourceSessions[resourceUrl] !== prevResourceSessions?.[resourceUrl]) {
            setUtilitiesChangedFlag(Math.random())
            return
          }
        }
      }
    }
  }, [props?.useUtilities, resourceSessions])

  useEffect(() => {
    refreshDirectionsForActionRef.current = refreshDirectionsComponentForAction

    if (isReadyToRender && jimuMapView?.view && containerRef.current) {
      updateDirectionsWidget()
    } else {
      destroyDirectionsWidget()
    }

    function disconnectDirectionsButtonObserver () {
      directionsButtonObserverRef.current?.disconnect()
      directionsButtonObserverRef.current = null
    }

    function applyDirectionsActionButtonTokens (root: ShadowRoot) {
      root.querySelectorAll<HTMLElement>(DIRECTIONS_ACTION_BUTTON_SELECTOR).forEach(button => {
        button.style.setProperty('--calcite-button-background-color', DIRECTIONS_ACTION_BUTTON_BG)
        button.style.setProperty('--calcite-button-text-color', DIRECTIONS_ACTION_BUTTON_TEXT)
      })
    }

    function observeDirectionsActionButtons (directionsEle: HTMLArcgisDirectionsElement) {
      disconnectDirectionsButtonObserver()
      const shadowRoot = directionsEle.shadowRoot
      if (!shadowRoot) {
        return
      }

      applyDirectionsActionButtonTokens(shadowRoot)
      directionsButtonObserverRef.current = new MutationObserver(() => {
        applyDirectionsActionButtonTokens(shadowRoot)
      })
      directionsButtonObserverRef.current.observe(shadowRoot, {
        childList: true,
        subtree: true
      })
    }

    async function createDirectionsElement (layer: __esri.RouteLayer) {
      const searchProperties = await convertSearchConfigToJSAPISearchProperties(searchConfig, defaultSearchHint)
      const saveVisibilityConfig = getSaveVisibilityConfig(config?.enableRouteSaving)
      const directionsEle = document.createElement('arcgis-directions')
      directionsEle.id = `${id}-directions`
      directionsEle.className = 'directions-container'
      directionsEle.autoDestroyDisabled = true
      directionsEle.view = jimuMapView?.view
      directionsEle.searchProperties = searchProperties
      directionsEle.unit = config?.unit ?? getDefaultOrgUnit()
      directionsEle.hideLayerDetails = saveVisibilityConfig.hideLayerDetails
      directionsEle.hideSaveAsButton = saveVisibilityConfig.hideSaveAsButton
      directionsEle.hideSaveButton = saveVisibilityConfig.hideSaveButton

      if (containerRef.current) {
        containerRef.current.innerHTML = ''
        containerRef.current.appendChild(directionsEle)
      }
      componentDirectionsRef.current = directionsEle
      await componentDirectionsRef.current.componentOnReady()
      observeDirectionsActionButtons(directionsEle)
      directionsEle.layer = layer
      return directionsEle
    }

    async function updateDirectionsWidget (isClearTriggered?: boolean) {
      destroyDirectionsWidget()
      await jimuMapView?.view?.when()
      const rawRouteServiceUrl = getUrlOfUseUtility(routeConfig?.useUtility)
      // const routeServiceUrl = proxyUtils.getWhetherUseProxy() ? proxyUtils.getProxyUrl(rawRouteServiceUrl) || rawRouteServiceUrl : rawRouteServiceUrl
      const routeServiceUrl = rawRouteServiceUrl
      const barrierLayers = await getBarrierLayers()

      const routeTitle = `${props.label} - ${translate('route')}`
      const newRouteLayer = new RouteLayer({
        id,
        url: routeServiceUrl,
        title: routeTitle,
        pointBarriers: barrierLayers?.points,
        polylineBarriers: barrierLayers?.polylines,
        polygonBarriers: barrierLayers?.polygons
      })
      if (typeof config.showRuntimeLayers === 'boolean' && !config.showRuntimeLayers) {
        newRouteLayer.listMode = 'hide'
      }

      try {
        await newRouteLayer.load()
      } catch (error) {
        console.warn('Failed to load route layer.', error)
      }
      const prevRouteLayer = jimuMapView?.view?.map?.findLayerById(id)
      if (prevRouteLayer) {
        jimuMapView?.view?.map?.remove(prevRouteLayer)
      }
      jimuMapView?.view?.map?.add(newRouteLayer)
      await createDirectionsElement(newRouteLayer)

      // Get start/end point from the action for widget-controller scenario
      updateFromDataAction()

      setOutputDssNotReady(id)
      watchLastRoute()
      setPresetStops(isClearTriggered)
    }

    async function refreshDirectionsComponentForAction (): Promise<boolean> {
      const currentLayer = getCurrentLayer()
      if (!currentLayer) {
        return false
      }

      destroyDirectionsElement()
      await createDirectionsElement(currentLayer)
      setOutputDssNotReady(id)
      watchLastRoute()
      return true
    }

    function watchLastRoute () {
      const onRouteChanged = () => {
        const lastRoute = componentDirectionsRef.current?.lastRoute
        if (props.autoHeight && containerRef.current) {
          // Add max height to container for auto height style
          containerRef.current.style.maxHeight = '750px'
        }
        if (lastRoute) { // If there is route result, change status of output data sources to unloaded.
          setOutputDssUnloadedAndSetLayer(id, lastRoute)
        } else { // If there isn't route result, change status of output data sources to not_ready.
          setOutputDssNotReady(id)
        }

        // Preserve existing clear behavior for barriers in component mode.
        // Recreate the directions element when route is explicitly cleared.
        const prevLastRoute = prevLastRouteRef.current
        const shouldRefresh = !!prevLastRoute &&
          !lastRoute &&
          getValidStopCount(getCurrentLayer()) < 2
        prevLastRouteRef.current = lastRoute

        if (shouldRefresh) {
          updateDirectionsWidget(true)
        }
      }

      const directionsEle = componentDirectionsRef.current
      if (!directionsEle) {
        return
      }
      const onPropertyChange: EventListener = (event) => {
        const customEvent = event as CustomEvent<{ name: string }>
        if (customEvent?.detail?.name === 'lastRoute') {
          onRouteChanged()
        }
      }
      directionsEle.addEventListener('arcgisPropertyChange', onPropertyChange)
      unwatchLastRouteRef.current = () => {
        directionsEle.removeEventListener('arcgisPropertyChange', onPropertyChange)
      }
    }

    function destroyDirectionsElement () {
      unwatchLastRouteRef.current?.()
      unwatchLastRouteRef.current = null
      disconnectDirectionsButtonObserver()
      prevLastRouteRef.current = null

      if (componentDirectionsRef.current) {
        componentDirectionsRef.current.destroy().catch((error) => {
          console.warn('Failed to destroy directions component.', error)
        })
        componentDirectionsRef.current = null
      }
      if (containerRef.current) {
        containerRef.current.innerHTML = ''
      }
      try {
        // Remove save as popper.
        const saveAsPopper = document.querySelector('calcite-panel.esri-save-layer')?.parentElement
        if (saveAsPopper && saveAsPopper.tagName.toUpperCase() === 'CALCITE-POPOVER') {
          document.body.removeChild(saveAsPopper)
        }
      } catch (e) {}
    }

    function destroyDirectionsWidget () {
      destroyDirectionsElement()

      const prevRouteLayer = jimuMapView?.view?.map?.findLayerById(id)
      if (prevRouteLayer && jimuMapView) {
        jimuMapView.view.map.remove(prevRouteLayer)
      }
    }

    async function getBarrierLayers () {
      if (!jimuMapView) {
        return null
      }
      const barrierJlvIds = routeConfig?.barrierLayers?.[jimuMapView.id]
      if (!barrierJlvIds) {
        return null
      }
      const barrierLayers = {
        points: [],
        polylines: [],
        polygons: [],
      }
      for (const jlvId of barrierJlvIds) {
        const jlv = await jimuMapView.whenJimuLayerViewLoaded(jlvId)
        let ds = jlv.getLayerDataSource()
        const dsId = jlv.layerDataSourceId

        if (!ds) {
          ds = await jimuMapView.getMapDataSource().createDataSourceById(dsId)
        }
        const { records } = await (ds as any).query({ where: '1=1', returnGeometry: true })
        switch (ds.getGeometryType()) {
          case 'esriGeometryPoint': {
            const barriers = records.map(record => {
              return new PointBarrier({ geometry: record.getGeometry() })
            })
            barrierLayers.points.push(...barriers)
            break
          }
          case 'esriGeometryPolyline': {
            const barriers = records.map(record => {
              return new PolylineBarrier({ geometry: record.getGeometry() })
            })
            barrierLayers.polylines.push(...barriers)
            break
          }
          case 'esriGeometryPolygon': {
            const barriers = records.map(record => {
              return new PolygonBarrier({ geometry: record.getGeometry() })
            })
            barrierLayers.polygons.push(...barriers)
            break
          }
          default: {
            break
          }
        }
      }
      return barrierLayers
    }

    async function setPresetStops (isClearTriggered?: boolean) {
      if (isClearTriggered || !routeConfig) {
        return
      }
      if (!routeConfig.presetStart && !routeConfig.presetEnd) {
        return
      }
      const layer = getCurrentLayer()
      if (!layer) {
        return
      }
      if (routeConfig.presetStart) {
        layer.stops.at(0).name = routeConfig.presetStart.name
        layer.stops.at(0).geometry = routeConfig.presetStart.geometry
      }
      if (routeConfig.presetEnd) {
        layer.stops.at(1).name = routeConfig.presetEnd.name
        layer.stops.at(1).geometry = routeConfig.presetEnd.geometry
      }

      await loadDirectionsIfNeeded()
      const isDirectionsReady = await waitForDirectionsReady()
      if (!isDirectionsReady) {
        return
      }
      if (routeConfig.presetStart && routeConfig.presetEnd) {
        await getDirections()
      }
    }

    return () => {
      refreshDirectionsForActionRef.current = null
      destroyDirectionsWidget()
    }
  }, [config?.enableRouteSaving, config?.showRuntimeLayers, config?.unit, defaultSearchHint, getCurrentLayer, getDirections, id, isReadyToRender, jimuMapView, jimuMapView?.view, loadDirectionsIfNeeded, props.autoHeight, props.label, routeConfig, searchConfig, translate, updateFromDataAction, utilitiesChangedFlag, waitForDirectionsReady])

  return (
    <Paper className='widget-directions jimu-widget' variant='flat' shape='none'>
      {
        isReadyToRender
          ?
          <React.Fragment>
            <JimuMapViewComponent useMapWidgetId={useMapWidgetId} onActiveViewChange={onActiveMapViewChange} />
            <div className='directions-ref' ref={containerRef} css={style}></div>
            <UtilsAlert useUtilities={props.useUtilities} ></UtilsAlert>
          </React.Fragment>
          :
          <WidgetPlaceholder widgetId={id} icon={WidgetIcon} name={translate('_widgetLabel')} />
      }
    </Paper>
  )
}

export default Widget

const style = css`
  width: 100% !important;
  height: 100% !important;

  .directions-ref {
    width: 100%;
    height: 100%;
  }

  .directions-container {
    width: 100% !important;
    height: 100% !important;
    overflow: auto;
    --calcite-list-background-color: var(--sys-color-surface-paper);
    --calcite-flow-background-color: var(--sys-color-surface-paper);
    --calcite-autocomplete-input-text-color: var(--sys-color-action-input-field-text);
    --calcite-action-text-color: var(--sys-color-surface-paper-text);
    --calcite-autocomplete-input-background-color: var(--sys-color-action-input-field);
    --calcite-color-text-1: var(--sys-color-surface-paper-text);
    --calcite-block-section-background-color: var(--sys-color-surface-paper);
    --calcite-flow-header-background-color: var(--sys-color-surface-paper);
    --calcite-accordion-background-color: var(--sys-color-surface-paper);
    --calcite-color-text-3: var(--sys-color-surface-paper-text);
    --calcite-flow-header-action-text-color: var(--sys-color-surface-paper-text);
    --calcite-color-foreground-2: var(--sys-color-action-hover);
  }
`
