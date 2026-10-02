/** @jsx jsx */

import * as reactiveUtils from '@arcgis/core/core/reactiveUtils'
import type Layer from '@arcgis/core/layers/Layer'
import type OrientedImageryLayer from '@arcgis/core/layers/OrientedImageryLayer'
import type MapView from '@arcgis/core/views/MapView'
import type SceneView from '@arcgis/core/views/SceneView'
import OrientedImageryViewer from '@arcgis/core/widgets/OrientedImageryViewer'
import { CalciteButton, CalciteOption, CalciteSelect, CalciteTooltip } from 'calcite-components'
import { JimuMapViewComponent, type JimuMapView } from 'jimu-arcgis'
import {
  WidgetState,
  type WidgetVersionManager,
  appActions,
  utils as jimuUtils,
  jsx,
  type AllWidgetProps,
  type IMState
} from 'jimu-core'
import { memo, type MemoExoticComponent, useCallback, useEffect, useMemo, useState } from 'react'
import type {
  IMConfig,
  IMConfigKey,
  OiLayerInstance,
  OiViewerVisibleElement,
  OiViewerWithVisibleElements
} from '../config'
import { getCalciteBasicTheme } from '../utils/style-utils'
import { removeLoadedOiElements } from '../utils/utils'
import defaultI18nMessages from './translations/default'
import { Paper } from 'jimu-ui'
import { visibleElementToConfigMap } from './constants'
import { versionManager } from '../version-manager'

interface ExtraProps {
  locale: string
}

interface ExbWidgetStatics {
  versionManager?: WidgetVersionManager
  mapExtraStateProps?: (state: IMState, ownProps: AllWidgetProps<any>) => any
}

export type ExbMemoWidget<T extends (...args: any[]) => any> = MemoExoticComponent<T> & ExbWidgetStatics

function Widget (props: AllWidgetProps<IMConfig> & ExtraProps) {
  const { state, config, intl } = props
  const [view, setView] = useState<MapView | SceneView | null>(null)
  const [oiViewer, setOiViewer] = useState<OiViewerWithVisibleElements | null>(null)
  const [oiLayers, setOiLayers] = useState<OiLayerInstance[]>([])
  const [viewerEnabled, setViewerEnabled] = useState<boolean>(true)
  const [selectedOiLayer, setSelectedOiLayer] = useState<OiLayerInstance | null>(null)
  const isWidgetError = !view || !oiLayers?.length
  const viewerContainerId = useMemo(() => `oi-viewer-container-${props.id}-${jimuUtils.getUUID()}`, [props.id])

  const removeOiViewer = useCallback(
    (oiViewer: OiViewerWithVisibleElements) => {
      if (oiViewer) {
        const container = document.getElementById(viewerContainerId)
        setOiViewer(null)
        if (container) container.innerHTML = ''
        removeLoadedOiElements(oiViewer)
      }
    },
    [viewerContainerId]
  )

  const initOiViewer = useCallback(
    (view: MapView | SceneView, layer: OrientedImageryLayer = null) => {
      const oiViewerTemp = new OrientedImageryViewer({
        view,
        disabled: false,
        container: viewerContainerId,
        layer
      }) as unknown as OiViewerWithVisibleElements

      oiViewerTemp.visibleElements.header = false
      oiViewerTemp.visibleElements.closeButton = false
      oiViewerTemp.visibleElements.menu = false
      setOiViewer(oiViewerTemp)
    },
    [viewerContainerId]
  )

  const getOiLayers = useCallback((layerList: __esri.ReadonlyCollection<Layer>) => {
    return layerList
      .filter((layer) => layer.type === 'oriented-imagery' && layer.loaded)
      .map((layer) => {
        const id = 'type' in layer.parent && layer.parent.type === 'group' ? `${layer.parent.id}-${layer.id}` : layer.id
        return {
          id: id,
          layer: layer as OrientedImageryLayer
        }
      })
      .toArray()
  }, [])

  const updateSelectedOiLayer = useCallback(
    (layer: OiLayerInstance | null) => {
      setSelectedOiLayer(layer)
      if (layer) {
        props.dispatch(appActions.widgetStatePropChange(props.id, 'oiSelectedLayerId', layer.layer.id))
      } else {
        props.dispatch(appActions.widgetStatePropChange(props.id, 'oiSelectedLayerId', null))
      }
    },
    [props]
  )

  const handleLayerListChange = useCallback(
    (changedView: MapView | SceneView) => {
      const oiLayersTemp = getOiLayers(changedView.map.allLayers)
      let activeLayer = selectedOiLayer

      if (!oiLayersTemp.map((layer) => layer.id).includes(selectedOiLayer?.id)) {
        activeLayer = oiLayersTemp[0]
      }
      if (oiViewer) {
        removeLoadedOiElements(oiViewer)
        updateOiViewerProp(oiViewer, 'view', changedView)
        updateOiViewerProp(oiViewer, 'layer', activeLayer?.layer ?? null)
      } else {
        initOiViewer(changedView, activeLayer?.layer ?? null)
      }
      setOiLayers(oiLayersTemp)
      updateSelectedOiLayer(activeLayer)
    },
    [selectedOiLayer, oiViewer, initOiViewer, getOiLayers, updateSelectedOiLayer]
  )

  useEffect(() => {
    return () => {
      if (oiViewer) {
        updateOiViewerProp(oiViewer, 'disabled', true)
        removeLoadedOiElements(oiViewer)
      }
    }
  }, [oiViewer])

  useEffect(() => {
    if (view) {
      const oiLayerListHandle = reactiveUtils.watch(
        () => view.map?.allLayers?.filter((layer) => layer.type === 'oriented-imagery' && layer.loaded).length,
        () => {
          handleLayerListChange(view)
        }
      )

      return () => {
        oiLayerListHandle.remove()
      }
    }
  }, [view, handleLayerListChange])

  useEffect(() => {
    if (view && (!state || state === WidgetState.Opened)) {
      if (oiViewer) {
        updateOiViewerProp(oiViewer, 'disabled', !viewerEnabled)
      }
    } else if ((isWidgetError || state === WidgetState.Closed) && oiViewer) {
      updateOiViewerProp(oiViewer, 'disabled', true)
    }
  }, [view, state, oiViewer, viewerEnabled, isWidgetError])

  useEffect(() => {
    if (!view) {
      removeOiViewer(oiViewer)
    } else if (
      selectedOiLayer &&
      view &&
      (config.navigateToExtentEnabled || config.navigateToExtentEnabled === undefined)
    ) {
      if (selectedOiLayer?.layer.loaded) {
        view.goTo(selectedOiLayer?.layer.fullExtent)
      } else {
        reactiveUtils
          .once(() => selectedOiLayer?.layer.loaded)
          .then(() => {
            view.goTo(selectedOiLayer?.layer.fullExtent)
          })
      }
    }
  }, [selectedOiLayer, view, oiViewer, removeOiViewer, config.navigateToExtentEnabled])

  useEffect(() => {
    if (oiViewer) {
      updateViewerConfigs(oiViewer, config)
    }
  }, [oiViewer, config])

  useEffect(() => {
    if (!oiViewer) return
    const handle = oiViewer.viewModel.watch('selectedPoint', (event) => {
      const pointEvent = event as __esri.Point
      props.dispatch(appActions.widgetStatePropChange(props.id, 'oiSelectedPoint', pointEvent.toJSON()))
    })
    return () => {
      handle?.remove()
    }
  }, [oiViewer, props])

  useEffect(() => {
    if (!oiViewer) return
    const handle = oiViewer.viewModel.watch('imageLoaded', (event) => {
      props.dispatch(appActions.widgetStatePropChange(props.id, 'oiViewerImageLoaded', event))
    })
    return () => {
      handle?.remove()
    }
  }, [oiViewer, props])

  useEffect(() => {
    if (!oiViewer) return
    const handle = oiViewer.viewModel.watch('currentBestFeatureLocation', (event) => {
      const imageID = event ? event?.attributes?.imageID : null
      props.dispatch(appActions.widgetStatePropChange(props.id, 'oiSelectedImageId', imageID))
    })
    return () => {
      handle?.remove()
    }
  }, [oiViewer, props])

  const updateViewerConfigs = (oiViewer: OiViewerWithVisibleElements, config: IMConfig) => {
    let showViewerActionBar = null
    Object.keys(visibleElementToConfigMap).forEach((visibleElement: OiViewerVisibleElement) => {
      const visibleElementEnabled = visibleElementToConfigMap[visibleElement].some(
        (configKey: IMConfigKey) => config[configKey] ?? false
      )
      oiViewer.visibleElements[visibleElement] = visibleElementEnabled
      if (!showViewerActionBar) showViewerActionBar = visibleElementEnabled
    })
    oiViewer.visibleElements.menu = showViewerActionBar ?? false
    oiViewer.dataCaptureEnabled = config.dataCaptureEnabled
    oiViewer.preloadMedia = config.directionalNavigationEnabled || config.sequentialNavigationEnabled

    return oiViewer
  }

  const nls = (id: keyof typeof defaultI18nMessages) => {
    return intl ? intl.formatMessage({ id: id, defaultMessage: defaultI18nMessages[id] }) : id
  }

  const updateOiViewerProp = (oiViewer: OiViewerWithVisibleElements, prop: string, value: unknown) => {
    const oiViewerTemp = oiViewer
    oiViewerTemp[prop] = value
  }

  const handleActiveLayerChange = (evt: any) => {
    const layerId = evt.target.selectedOption.value
    const selectedLayer = oiLayers.find((layer) => layer.id === layerId)
    updateSelectedOiLayer(selectedLayer)
    updateOiViewerProp(oiViewer, 'layer', selectedLayer.layer)
    removeLoadedOiElements(oiViewer)
  }

  const handleViewerToggle = () => {
    setViewerEnabled((prev) => !prev)
  }

  const onActiveViewChange = (jimuMapView: JimuMapView) => {
    if (jimuMapView) {
      const view = jimuMapView.view
      setView(view)
      handleLayerListChange(view)
    } else {
      setView(null)
      setOiLayers([])
      updateSelectedOiLayer(null)
    }
  }

  const renderViewerToggle = () => {
    if (!oiViewer) return null
    return (
      <div>
        <CalciteButton
          appearance={'solid'}
          kind={'brand'}
          label={nls(viewerEnabled ? 'disableViewer' : 'enableViewer')}
          iconStart={viewerEnabled ? 'view-visible' : 'view-hide'}
          id={`oi-viewer-toggle-${props.id}`}
          onClick={handleViewerToggle}
        />
        <CalciteTooltip
          aria-label={nls(viewerEnabled ? 'disableViewer' : 'enableViewer')}
          id={`oi-viewer-toggle-tooltip-${props.id}`}
          referenceElement={`oi-viewer-toggle-${props.id}`}
        >
          {nls(viewerEnabled ? 'disableViewer' : 'enableViewer')}
        </CalciteTooltip>
      </div>
    )
  }

  const renderViewerContainer = () => {
    return <div className='d-flex flex-grow-1 justify-content-center' id={viewerContainerId} />
  }

  const renderWidgetElements = () => {
    return (
      <div className={`h-100 w-100 flex-column ${isWidgetError ? 'd-none' : 'd-flex'}`}>
        <div className='d-flex'>
          <div className='mr-1'>{renderViewerToggle()}</div>
          <div className='flex-grow-1'>{renderLayerSelector()}</div>
        </div>
        {renderViewerContainer()}
      </div>
    )
  }

  const renderWidgetError = () => {
    if (!isWidgetError) {
      return null
    }
    let errorMessage = nls('defaultError')
    if (!view) {
      errorMessage = nls('noMapSelectedError')
    } else if (!oiLayers?.length) {
      errorMessage = nls('noOiLayersError')
    }
    return (
      <div className='d-flex align-items-center justify-content-center w-100 h-100 px-3 text-center'>
        <div>{errorMessage}</div>
      </div>
    )
  }

  const renderLayerSelector = () => {
    return (
      <CalciteSelect
        label={nls('oiLayerSelector')}
        aria-label={nls('oiLayerSelector')}
        data-select-id='imagery-layer-selector'
        className='mb-1'
        value={selectedOiLayer?.id}
        onCalciteSelectChange={handleActiveLayerChange}
      >
        {oiLayers?.map((layer) => (
          <CalciteOption key={layer.id} value={layer.id} selected={selectedOiLayer.id === layer.id}>
            {layer.layer.title}
          </CalciteOption>
        ))}
      </CalciteSelect>
    )
  }

  return (
    <Paper css={getCalciteBasicTheme()} className='jimu-widget overflow-auto p-2' shape='none'>
      <JimuMapViewComponent useMapWidgetId={props.useMapWidgetIds?.[0]} onActiveViewChange={onActiveViewChange} />
      {renderWidgetElements()}
      {renderWidgetError()}
    </Paper>
  )
}

const MemoizedWidget = memo(Widget) as ExbMemoWidget<typeof Widget>

MemoizedWidget.mapExtraStateProps = (state: IMState, ownProps: AllWidgetProps<IMConfig>): ExtraProps => {
  return {
    locale: state.appContext.locale
  }
}

MemoizedWidget.versionManager = versionManager

export default MemoizedWidget
