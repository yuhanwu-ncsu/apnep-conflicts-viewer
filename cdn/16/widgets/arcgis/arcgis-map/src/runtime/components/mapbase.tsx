/** @jsx jsx */
import {
  React, DataSourceManager, ExtentChangeMessage, DataSourceComponent, portalUrlUtils, type SqlQueryParams, type DataSourceJson,
  getAppStore, MutableStoreManager, type ImmutableObject, type FeatureLayerDataSource, type JSAPILayerMixin, jsx, lodash,
  serviceUrlUtils, observeStore, type ResourceSessions, ServiceManager, type ArcGISSubLayer, type MapDataSource, DataSourceTypes,
  postMessage, PostMessageType, type WebMapDataSource, type WebSceneDataSource, listenToPostMessage, ListenMessageType,
  type ListenMessage, type ChangeExtentListenMessage, type ZoomToListenMessage, type PanToListenMessage, geometryUtils
} from 'jimu-core'
import type { Unsubscribe } from 'redux'
import { type IMConfig, SceneQualityMode } from '../../config'
import { loadArcGISJSAPIModules, MapViewManager, type JimuMapView, zoomToUtils, type DefaultMapInfo, type ZoomToOptions, type MarkerGroup, type UnparsedMapUrlParams } from 'jimu-arcgis'
import type { InitialMapState } from 'jimu-ui/advanced/map'
import { defaultMessages, Icon } from 'jimu-ui'
import {
  getMapBaseRestoreData, restoreMapBase,
  mapPanto, flashFeaturesByQuery, projectGeometries, unionExtentsWithDifferentSpatialReference, filterFeaturesByQuery, processZoomToFeatures,
  getLayersFromDataSourceIds, getJimuMapViewId, isNeedProjectViewpoint, projectViewpoint, isNeedProjectSpatialReference,
  isTwoWidgetsMutuallyExtentChange, isSameLikeViewpoints, getViewpointInstanceFromHistory, updatePersistentMapStateForActiveJimuMapView,
  updateViewUrlParamsForActiveJimuMapView, type ParsedViewUrlParams, getParsedViewUrlParams, getChangedViewpointByViewAndUrlHashParams, layerQueryExtent,
  getDefaultHighlightOptions, parseMarkerGroupUrlParam, updateAriaLabelForViewSurface, updateAriaRoleForViewSurface
} from '../utils'
import { MultiSourceMapContext } from './multisourcemap-context'
import type { MapWidgetProps, ActionRelatedProps } from '../widget'
import type { ActiveToolInfo } from '../layout/layout'
import { type ExBPopupDockPosition, getValidPopupDockPosition, getFinalScaleRangeForView, getFinalLods, isSameLods } from '../../utils'
import mapDefaultMessages from '../translations/default'
import type MapViewConstraints from "@arcgis/core/views/2d/MapViewConstraints.js"

export type NotMeshGeometry = __esri.Point | __esri.Polygon | __esri.Polyline | __esri.Extent | __esri.Multipoint

const Exchange = require('../assets/icons/exchange.svg')

interface Props {
  isMapInVisibleArea: boolean
  widthBreakpoint: string
  mapComponentsLoaded: boolean
  isDefaultMap?: boolean
  baseWidgetProps: MapWidgetProps
  startLoadModules: boolean
  dataSourceId: string
  defaultMapInfo?: DefaultMapInfo
  multiSourceMapDom: HTMLDivElement
  onMutableStatePropsChanged?: (dataSourceId: string, propKey: string, value?: any) => void

  onExtentChanged?: (dataSourceId: string, message: ExtentChangeMessage) => void
  onMapLoaded?: (dataSourceId: string, mapLoadStatus: MapLoadStatus) => void
  onJimuMapViewCreated: (jimuMapView: JimuMapView) => void
  children?: React.ReactNode
  // onShowOnMapDataChanged?: (showOnMapDatasKey: string[]) => void
  onActiveToolInfoChange: (activeToolInfo: ActiveToolInfo) => void
}

interface QueryExtentInfo {
  viewpoint?: __esri.Viewpoint
  useDefaultExtentOfCurrentView?: boolean
  extent: __esri.Extent,
  singlePointGraphic: __esri.Graphic,
  count: number,
  layer: __esri.Layer
}

const DEFAULT_HIGHLIGHT_COLOR = '#00FFFF'
const DEFAULT_HIGHLIGHT_HALO_COLOR = '#00FFFF'

export enum MapLoadStatus {
  Loading = 'LOADING',
  Loadok = 'LOADOK',
  LoadError = 'LOADERROR'
}

export interface HighLightHandle {
  layerId: string
  handle: __esri.Handle
}

export interface State {
  dataSourceId: string
  isBasicModulesLoaded: boolean // true means common modules loaded, not means all need modules loaded
  mapLoadStatus: MapLoadStatus
}

interface MapViewOptions {
  map: __esri.WebMap
  constraints?: MapViewConstraints
  viewpoint?: __esri.Viewpoint
  extent?: __esri.Extent
  center?: __esri.Point
  scale?: number
  zoom?: number
  rotation?: number
}

interface SceneViewOptions {
  map: __esri.WebScene
  viewpoint?: __esri.Viewpoint
  qualityProfile?: 'low' | 'medium' | 'high'
}

type ArcgisComponent = (HTMLArcgisMapElement | HTMLArcgisSceneElement) & {
  dataSourceInfo: MapbaseDataSourceInfo
}

export type MapbaseView = (__esri.MapView | __esri.SceneView) & {
  mapbase: MapBase
  dataSourceInfo: MapbaseDataSourceInfo
  isInCaching: boolean
  lastViewpointToUpdateUrlParams: __esri.Viewpoint
  lastViewpointUrlParamUpdateTimestamp: number
  viewWhenTimestamp: number
  // true means view.interacting set to true at least one time
  watchInteractingHandle: __esri.WatchHandle
  extentWatchHandle: __esri.WatchHandle
  watchLodsHandle: __esri.WatchHandle
  fatalErrorWatchHandle: __esri.WatchHandle
  highLightHandles: { [layerId: string]: __esri.Handle }
  mapBaseViewEventHandles: { [eventName: string]: __esri.Handle }
  stationaryTimerId: NodeJS.Timeout
  // Use extentChangeRelatedWidgetIds to avoid two map widget two-way extent sync
  extentChangeRelatedWidgetIds: string[]
  firstPublishExtentChangeTime: number
  // viewpointHistory used to store all static viewpoints, used for ExtentNavigation
  viewpointHistory: __esri.Viewpoint[]
  viewpointIndex: number
  stationaryCallback?: () => void
  lastZoomToExtentTime: number
  /**
   * message workflow: receive message (time1) -> maybe async -> update view (time2), time1 and time2 maybe different
   * receiveMessageTimeOfLastViewUpdate is time1 of last update view
   */
  receiveMessageTimeOfLastViewUpdate: number
  isMapToolsHidden: boolean
  publishExtentChangeMessage: (stationary: boolean, interactive: boolean) => void
  hideMapTools: () => void
  showMapTools: () => void
  initUrlHashMapOptions: ParsedViewUrlParams
  // persistent map state or the real url params
  runtimeUrlHashParams: UnparsedMapUrlParams

  isViewWhenReady?: boolean
  isPersistentMapStateUsed: boolean

  parseMarkerGroupUrlParam: () => Promise<MarkerGroup[]>

  originalBasemapLODs: __esri.LOD[]
}

/**
 * Consider this case:
 * We are creating mapView1 for dataSource1, the creation process is async and we get the promise1.
 * During the creation process, the props.dataSourceId changed, then promise1 is resolved.
 * We should not execute the callback logic of promise1.then(callback) because the latest expected mapView is mapView2, not mapView1.
 * So we need a way to identify if we should execute callback in every promise.then(callback). We can use MapbaseDataSourceInfo to solve it.
 *
 * MapbaseDataSourceInfo is used to create map view or scene view. Each MapbaseDataSourceInfo has a unique id, the uniqueId is calculated by data source type, data sourceId and itemId.
 * When we need to create mapView1, we need to update this.expectedDataSourceInfo. this.expectedDataSourceInfo always bind to this.props.dataSourceId.
 * We pass this.expectedDataSourceInfo as formal parameter to map creation related functions when we create a mapView.
 * And in the map creation promise.then(callback), we check the dataSourceInfo.uniqueId is changed or not. If changed, we stop the callback logic. If not changed, go head.
 *
 * All data source cases:
 * 1. use default webmap
 * 2. user select a webmap data source
 * 3. user select a webscene data source
 */
export interface MapbaseDataSourceInfo {
  // true for data source case1, false for data source case2 and case3
  isDefaultMap: boolean

  // true for data source case1 and case2, false for data source case3
  isWebMap: boolean

  // format is <webmap or webscene>-dataSourceId-itemId
  // examples:
  // use default webmap: 'webmap-default'
  // user select a webmap data source: 'webmap-dataSource_1-2c8d9a772aa04e5985ac3030dbecb232'
  // user select a webscene data source: 'webscene-dataSource_1-2c8d9a772aa04e5985ac3030dbecb232'
  uniqueId: string

  // null for data source case1, not null for data source case2 and case3
  dataSourceId: string

  jimuMapViewId: string

  dataSourceJson: ImmutableObject<DataSourceJson>
}

/**
 * mapbase.mapCreatingInfo is not null during the async map(MapView/JimuMapView) creation period.
 * When map created, mapbase.mapCreatingInfo is set to null.
 */
export interface MapCreatingInfo {
  dataSourceInfo: MapbaseDataSourceInfo
}

export interface APIModules {
  Geometry: typeof __esri.Geometry
  InitialViewProperties: typeof __esri.InitialViewProperties
  TileLayer: typeof __esri.TileLayer
  Basemap: typeof __esri.Basemap
  MapView: typeof __esri.MapView
  SceneView: typeof __esri.SceneView
  Extent: typeof __esri.Extent
  Viewpoint: typeof __esri.Viewpoint
  PortalItem: typeof __esri.PortalItem
  Portal: typeof __esri.Portal
  WebMap: typeof __esri.WebMap
  WebScene: typeof __esri.WebScene
  Color: typeof __esri.Color
  SpatialReference: typeof __esri.SpatialReference
  Point: typeof __esri.Point
  MapViewConstraints: typeof MapViewConstraints
  reactiveUtils: typeof __esri.reactiveUtils
  // Note, when load and cache more API modules by loadArcGISJSAPIModules method, we should also update getMapBaseRestoreData() method.
}

export interface MapbaseRestoreData extends APIModules {
  state: State

  expectedDataSourceInfo: MapbaseDataSourceInfo
  mapCreatingInfo: MapCreatingInfo
  arcgisComponent: ArcgisComponent
  lastUpdateViewConfig: IMConfig
  mapDs: MapDataSource

  dsManager: DataSourceManager
  isFirstReceiveMessage: boolean
}

const exbQualityProfileKey = '__exbQualityProfile'

export default class MapBase extends React.PureComponent<Props, State> implements APIModules {
  widgetContainer: HTMLDivElement
  arcgisComponent: ArcgisComponent

  // API modules
  Geometry: typeof __esri.Geometry
  InitialViewProperties: typeof __esri.InitialViewProperties
  TileLayer: typeof __esri.TileLayer
  Basemap: typeof __esri.Basemap
  MapView: typeof __esri.MapView
  SceneView: typeof __esri.SceneView
  Extent: typeof __esri.Extent
  Viewpoint: typeof __esri.Viewpoint
  PortalItem: typeof __esri.PortalItem
  Portal: typeof __esri.Portal
  WebMap: typeof __esri.WebMap
  WebScene: typeof __esri.WebScene
  Color: typeof __esri.Color
  SpatialReference: typeof __esri.SpatialReference
  Point: typeof __esri.Point
  MapViewConstraints: typeof MapViewConstraints
  reactiveUtils: __esri.reactiveUtils
  // Note, when load more API modules in loadCommonModules method, we should also update getMapBaseRestoreData() method.

  expectedDataSourceInfo: MapbaseDataSourceInfo
  mapCreatingInfo: MapCreatingInfo // mapCreatingInfo and view are mutually-exclusive
  lastUpdateViewConfig: IMConfig
  mapDs: WebMapDataSource | WebSceneDataSource

  dsManager = DataSourceManager.getInstance()
  isFirstReceiveMessage = true

  __unmount = false
  // true means mapbase.view is restored from MutableStore
  restored: boolean

  createFailedDataSourceIds: { [dsId: string]: boolean }

  resourceSessionsUnsubscribe?: Unsubscribe

  // last user interactive view
  static lastInteractiveView: MapbaseView

  // Record the JimuMapView/Mapbase inited count for the specific jimuMapViewId (mapWidgetId + dataSourceId) at runtime, the key is jimuMapViewId, the value is the JimuMapView/Mapbase inited count.
  // We use runtimeInitedJimuMapViews to identify whether the JimuMapView/Mapbase is initialized for the first time,
  // and replace config.initialMapState with map_state in the url hash during the first initialization.
  static runtimeInitedJimuMapViews: { [jimuMapViewId: string]: number } = {}

  // uniqueId comes from this.expectedDataSourceInfo.uniqueId
  mapViewCreateFailedUniqueIdsInfo: { [uniqueId: string]: boolean }

  postMessageHandles: __esri.Handle[]

  constructor (props) {
    super(props)

    this.debounceUpdateViewUrlParamsAndPersistentMapState = lodash.debounce(() => {
      this.updateViewUrlParamsAndPersistentMapState()
    }, 500)

    this.restored = false
    this.createFailedDataSourceIds = {}
    this.mapViewCreateFailedUniqueIdsInfo = {}

    this.updateExpectedDataSourceInfo()

    const restoreData = this.getRestoreDataFromMS()

    if (restoreData && restoreData.expectedDataSourceInfo.uniqueId === this.expectedDataSourceInfo.uniqueId) {
      restoreMapBase(this, restoreData)
      this.updateRestoreDataToMS(null)
      const view = this.getCurrentView()

      if (view) {
        this.bindMapBaseViewEvent(view)
        view.isInCaching = false
        view.mapbase = this
        this.restored = true
        this.tryFatalErrorRecovery(view)

        if (view.isMapToolsHidden) {
          view.hideMapTools()
        } else {
          view.showMapTools()
        }
      }
    } else {
      this.state = {
        dataSourceId: null,
        isBasicModulesLoaded: false,
        mapLoadStatus: MapLoadStatus.Loading
      }
    }

    this.unsubscribeResourceSessions()

    // observe resource session changes
    this.resourceSessionsUnsubscribe = observeStore(this.onStoreResourceSessionsChange.bind(this), ['resourceSessions'])

    this.listenToPostMessages()
  }

  unsubscribeResourceSessions () {
    if (this.resourceSessionsUnsubscribe) {
      this.resourceSessionsUnsubscribe()
      this.resourceSessionsUnsubscribe = null
    }
  }

  static getDerivedStateFromProps (nextProps: Props, prevState: State) {
    if (nextProps.dataSourceId !== prevState.dataSourceId) {
      return {
        dataSourceId: nextProps.dataSourceId,
        mapLoadStatus: MapLoadStatus.Loading
      }
    } else {
      return null
    }
  }

  render () {
    let useDataSource = null

    if (this.props.baseWidgetProps.useDataSources) {
      useDataSource = this.props.baseWidgetProps.useDataSources.find((item) => item.dataSourceId === this.props.dataSourceId)
    }

    return (
      <div className='w-100 h-100 map-base' style={{ position: 'relative' }} ref={ref => { this.widgetContainer = ref }}>
        {
          (this.state.mapLoadStatus === MapLoadStatus.Loading) &&
          <div className='w-100 h-100 widget-map-background'>
            <div style={{ position: 'absolute', left: '50%', top: '50%' }} className='jimu-secondary-loading' />
          </div>
        }
        {
          (this.state.mapLoadStatus === MapLoadStatus.LoadError) &&
          <div className='w-100 h-100 widget-map-background'>
            {this.getMapSwitchForErrorMap()}
            <div className='w-100 h-100 d-flex justify-content-center align-items-center'>{this.formatMessage('mapFailure')}</div>
          </div>
        }
        {
          !this.props.isDefaultMap &&
          <div style={{ position: 'absolute', display: 'none' }}>
            <DataSourceComponent
              useDataSource={useDataSource}
              onDataSourceCreated={this.onDataSourceCreated}
              onCreateDataSourceFailed={this.onCreateDataSourceFailed}
            />
          </div>
        }
      </div>
    )
  }

  componentDidMount () {
    this.__unmount = false

    if (this.arcgisComponent && !this.arcgisComponent.parentElement) {
      this.widgetContainer.appendChild(this.arcgisComponent)
    }

    if (this.props.startLoadModules) {
      this.loadCommonModules()
    }

    if (this.restored) {
      const view = this.getCurrentView()
      const jimuMapView = this.getJimuMapViewByView(view)

      if (jimuMapView && !jimuMapView.isCached()) {
        jimuMapView.onRestore()
      }
    }
  }

  componentDidUpdate (prevProps: Props) {
    this.tryCreateMapViewWhenDidUpdate(prevProps)
    this.tryHandleUrlParamsChangeWhenDidUpdate(prevProps)
    this.tryUpdateViewpointWhenInitialMapStateChanged(prevProps)
  }

  tryCreateMapViewWhenDidUpdate (prevProps: Props) {
    // update the this.expectedDataSourceInfo by the current props
    this.updateExpectedDataSourceInfo()

    if (!this.state.isBasicModulesLoaded || !this.props.mapComponentsLoaded) {
      return
    }

    const view = this.getCurrentView()

    // TODO: should we check isMapInVisibleArea before this.checkAndHandleIfDataSourceIdPropChange() ?
    // props.isMapInVisibleArea changed
    if (view && prevProps.isMapInVisibleArea !== this.props.isMapInVisibleArea && (this.props.baseWidgetProps.useDataSources && this.props.baseWidgetProps.useDataSources.length === 2)) {
      if (this.props.isMapInVisibleArea) {
        view.isInCaching = false
        this.tryFatalErrorRecovery(view)
      } else {
        view.isInCaching = true
      }
    }

    // the following code is mainly used to check and handle if dataSourceId prop change
    // eslint-disable-next-line no-useless-assignment
    let needCreateNewMapComponent = false

    if (this.arcgisComponent) {
      // this.arcgisComponent created, now need to check if this.arcgisComponent match this.props.dataSourceId or not
      if (this.isArcgisComponentExpected(this.arcgisComponent)) {
        // data source match this.props.dataSourceId, do nothing
        // eslint-disable-next-line no-useless-assignment
        needCreateNewMapComponent = false
        // this.arcgisComponent is the expected arcgis component
        // We call this.tryUpdateCurrentViewByConfigProps() to consume this.props.baseWidgetProps.config change
        this.tryUpdateCurrentViewByConfigProps(false, prevProps)
        // We call this.checkAndHandleMutableStateProps() to consume this.props.baseWidgetProps.mutableStateProps change
        this.checkAndHandleMutableStateProps()
        return
      } else {
        // data source changed, we need to destroy this.arcgisComponent
        needCreateNewMapComponent = true
      }
    } else {
      // this.arcgisComponent not created, we need to check if we are creating the expected arcgis component
      if (this.isCreatingExpectedArcgisComponent()) {
        // We are creating the expected arcgis component, do nothing
        // eslint-disable-next-line no-useless-assignment
        needCreateNewMapComponent = false
        return
      } else {
        const uniqueId = this.expectedDataSourceInfo?.uniqueId

        if (uniqueId && this.mapViewCreateFailedUniqueIdsInfo[uniqueId]) {
          // map view create failed before, don't need to recreate map component
          needCreateNewMapComponent = false
        } else {
          // need to create new map component
          needCreateNewMapComponent = true
        }
      }
    }

    if (needCreateNewMapComponent) {
      this.destroyCurrentArcgisComponent()
      const checkFailedUniqueId = true
      this.cacheLoadModulesAndCreateArcgisComponent(this.expectedDataSourceInfo, checkFailedUniqueId)
    }
  }

  // When user updates map url params manually, we need to update view.viewpoint.
  tryHandleUrlParamsChangeWhenDidUpdate (prevProps: Props) {
    try {
      const view = this.getCurrentView()

      if (!view) {
        return
      }

      // Note, use realRuntimeUrlHashParams here instead of runtimeUrlHashParams because runtimeUrlHashParams maybe persistent map state
      const preRuntimeUrlHashParams = prevProps?.baseWidgetProps?.realRuntimeUrlHashParams
      const currRuntimeUrlHashParams = this.props?.baseWidgetProps?.realRuntimeUrlHashParams

      if (currRuntimeUrlHashParams && currRuntimeUrlHashParams !== preRuntimeUrlHashParams && currRuntimeUrlHashParams.active_datasource_id) {
        const jimuMapView = this.getJimuMapViewByView(view)

        if (jimuMapView && jimuMapView.isActive && jimuMapView.dataSourceId === currRuntimeUrlHashParams.active_datasource_id) {
          // When user move map, it will trigger extent change event, and updateUrlHashParamsForActiveJimuMapView() method will call urlManager.setWidgetUrlParams() to change url params.
          // Then it will trigger componentDidUpdate() because this.props.baseWidgetProps.realRuntimeUrlHashParams changed. For this case, we don't need to handle it to avoid dead loop.
          // So we need to determine the url is changed by user or map self.
          // By test, the duration between urlManager.setWidgetUrlParams() and componentDidUpdate() is about 3~4ms, we use 100ms here for safe.
          const isUrlParamsChangeByMapSelf = view.lastViewpointUrlParamUpdateTimestamp > 0 && (Date.now() - view.lastViewpointUrlParamUpdateTimestamp) <= 100
          const isUrlParamsChangedByUser = !isUrlParamsChangeByMapSelf

          if (isUrlParamsChangedByUser) {
            // console.log('url hash prams changed', Date.now())

            const urlParamViewpointChanged = currRuntimeUrlHashParams.viewpoint && currRuntimeUrlHashParams.viewpoint !== preRuntimeUrlHashParams?.viewpoint
            const urlParamCenterChanged = currRuntimeUrlHashParams.center && currRuntimeUrlHashParams.center !== preRuntimeUrlHashParams?.center
            const urlParamScaleChanged = currRuntimeUrlHashParams.scale && currRuntimeUrlHashParams.scale !== preRuntimeUrlHashParams?.scale
            const urlParamRotationChanged = currRuntimeUrlHashParams.rotation && currRuntimeUrlHashParams.rotation !== preRuntimeUrlHashParams?.rotation
            // currRuntimeUrlHashParams.level maybe 0, so don't use currRuntimeUrlHashParams.level && xxx here
            const urlParamLevelChanged = ('level' in currRuntimeUrlHashParams) && currRuntimeUrlHashParams.level !== preRuntimeUrlHashParams?.level

            if (urlParamViewpointChanged || urlParamCenterChanged || urlParamScaleChanged || urlParamRotationChanged) {
              const changedViewpoint = getChangedViewpointByViewAndUrlHashParams(
                view,
                currRuntimeUrlHashParams,
                urlParamViewpointChanged,
                urlParamCenterChanged,
                urlParamScaleChanged,
                urlParamRotationChanged,
                urlParamLevelChanged,
                this.Viewpoint,
                this.Point,
                this.SpatialReference
              )

              const currViewpoint = view.viewpoint?.clone()

              if (changedViewpoint && !isSameLikeViewpoints(view, changedViewpoint, currViewpoint)) {
                // console.log('update viewpoint by url', Date.now())
                view.viewpoint = changedViewpoint
              }
            }
          }
        }
      }
    } catch (e) {
      console.error('handleUrlParamsChange error', e)
    }
  }

  tryUpdateViewpointWhenInitialMapStateChanged (prevProps: Props) {
    try {
      const view = this.getCurrentView()
      const preInitialMapState = prevProps?.baseWidgetProps?.config?.initialMapState || null
      const initialMapState = this.props?.baseWidgetProps?.config?.initialMapState || null

      if (initialMapState !== preInitialMapState) {
        // initialMapState changed, we need to update map's viewpoint by new initialMapState
        const initialViewPoint = initialMapState?.viewPoint?.asMutable?.({ deep: true })

        // make sure view is ready
        if (view && !view.destroyed && this.state.mapLoadStatus === MapLoadStatus.Loadok && this.Viewpoint) {
          if (initialViewPoint) {
            // change custom initial viewpoint
            const viewpoint = this.Viewpoint.fromJSON(initialViewPoint)

            if (viewpoint) {
              view.goTo(viewpoint)
            }
          } else {
            // switch to 'Default' radio
            const mapViewerInitialViewpoint = (view.map as (__esri.WebMap | __esri.WebScene))?.initialViewProperties?.viewpoint?.clone()

            if (mapViewerInitialViewpoint) {
              view.goTo(mapViewerInitialViewpoint)
            }
          }
        }
      }
    } catch (e) {
      console.error('tryUpdateViewpointWhenInitialMapStateChanged error', e)
    }
  }

  componentWillUnmount () {
    this.__unmount = true

    this.unsubscribeResourceSessions()
    this.releasePostMessageHandles()

    const view = this.getCurrentView()

    if (view) {
      view.mapbase = null
    }

    const widgets = getAppStore().getState().appConfig.widgets

    if (widgets[this.props.baseWidgetProps.id] && widgets[this.props.baseWidgetProps.id].useDataSources === this.props.baseWidgetProps.useDataSources && this.state.mapLoadStatus !== MapLoadStatus.Loading) {
      // JS API limits only 16 canvas with WebGL context on a html page. Caching the map widget (unmount the canvas from the html tree but don't destroy the view) is a workaround.
      // We scroll the page and the map widget is not in the visible area, we need to cache it so we can restore it quickly.
      // We don't destroy the map view here, just cache it to mutable store.
      const restoreData = getMapBaseRestoreData(this)

      if (view) {
        view.isInCaching = true
      }

      this.updateRestoreDataToMS(restoreData)

      if (view) {
        const jimuMapView = this.getJimuMapViewByView(view)

        if (jimuMapView) {
          jimuMapView.onCache()
        }
      }

      if (this.arcgisComponent && this.arcgisComponent.parentElement) {
        this.arcgisComponent.parentElement.removeChild(this.arcgisComponent)
      }
    } else {
      // Destroy the map view
      this.destroyCurrentArcgisComponent()
      this.mapCreatingInfo = null
      this.arcgisComponent = null
      this.mapDs = null
    }
  }

  createDataSourceInfo (dataSourceId: string): MapbaseDataSourceInfo {
    // eslint-disable-next-line no-useless-assignment
    let result: MapbaseDataSourceInfo = null

    const dataSourceJson = this.getDsJsonFromDsId(dataSourceId)

    if (dataSourceJson && dataSourceJson.id) {
      // data source case2 or data source case3
      const type = dataSourceJson.type || ''
      const itemId = dataSourceJson.itemId || ''
      const dataSourceId = dataSourceJson.id
      const jimuMapViewId = this.getJimuMapViewId(dataSourceId)

      if (type === DataSourceTypes.WebScene) {
        // user select a web scene
        result = {
          isDefaultMap: false,
          isWebMap: false,
          uniqueId: `webscene-${dataSourceId}-${itemId}`,
          dataSourceId,
          jimuMapViewId,
          dataSourceJson
        }
      } else {
        // user select a web map
        result = {
          isDefaultMap: false,
          isWebMap: true,
          uniqueId: `webmap-${dataSourceId}-${itemId}`,
          dataSourceId,
          jimuMapViewId,
          dataSourceJson
        }
      }
    } else {
      // data source case1: use default web map
      const dataSourceId = ''
      // TODO: could we use this.getJimuMapViewId('defaultmap') here ?
      const jimuMapViewId = this.getJimuMapViewId(dataSourceId)
      result = {
        isDefaultMap: true,
        isWebMap: true,
        uniqueId: 'webmap-default',
        dataSourceId,
        jimuMapViewId,
        dataSourceJson
      }
    }

    return result
  }

  getJimuMapViewId (dataSourceId: string): string {
    return getJimuMapViewId(this.props.baseWidgetProps.id, dataSourceId)
  }

  getDsJsonFromDsId (dataSourceId: string): ImmutableObject<DataSourceJson> {
    let result: ImmutableObject<DataSourceJson> = null

    if (dataSourceId) {
      result = getAppStore().getState().appConfig.dataSources[dataSourceId]
    }

    if (!result) {
      result = {} as ImmutableObject<DataSourceJson>
    }

    return result
  }

  getCurrentDataSourceJson (): ImmutableObject<DataSourceJson> {
    // when select a web map or web scene in builder, this.props.dataSourceId is not null, the result is like this
    // {
    //   id: "dataSource_5",
    //   type: "WEB_MAP",
    //   sourceLabel: "China Version 1_2",
    //   itemId: "a2c5449c4c624447bf45d48478b25838",
    //   portalUrl: "https://esridevbeijing.maps.arcgis.com",
    // }

    // when use the default web map in builder, this.props.dataSourceId is null, the result is empty object {}
    return this.getDsJsonFromDsId(this.props.dataSourceId)
  }

  updateExpectedDataSourceInfo () {
    this.expectedDataSourceInfo = this.createDataSourceInfo(this.props.dataSourceId)
  }

  isCurrentArcgisComponentExpected (): boolean {
    return this.isArcgisComponentExpected(this.arcgisComponent)
  }

  isArcgisComponentExpected (arcgisComponent: ArcgisComponent): boolean {
    return arcgisComponent && arcgisComponent.dataSourceInfo.uniqueId === this.expectedDataSourceInfo.uniqueId
  }

  isCreatingExpectedArcgisComponent (): boolean {
    return this.mapCreatingInfo && this.isDataSourceInfoExpected(this.mapCreatingInfo.dataSourceInfo)
  }

  isDataSourceInfoExpected (dataSourceInfo: MapbaseDataSourceInfo): boolean {
    return dataSourceInfo && dataSourceInfo.uniqueId === this.expectedDataSourceInfo.uniqueId
  }

  /**
   * Consume this.props.baseWidgetProps.config change
   * @param calledWhenViewCreate true means this method is called when view just created, false means this method is called when config props change
   * @param prevProps
   */
  tryUpdateCurrentViewByConfigProps (calledWhenViewCreate: boolean, prevProps?: Props): void {
    const view = this.getCurrentView()

    if (!view) {
      return
    }

    const config: IMConfig = this.props.baseWidgetProps.config
    const preConfig: IMConfig = this.lastUpdateViewConfig
    this.lastUpdateViewConfig = config

    // update popup options
    const currPopupEnabled = !config.disablePopUp

    // TODO
    if (calledWhenViewCreate) {
      // calledWhenViewCreate is true, means tryUpdateCurrentViewByConfigProps is called when view just created, we just set view.popupEnabled to !config.disablePopUp.
      view.popupEnabled = currPopupEnabled
    } else {
      // calledWhenViewCreate is false, means tryUpdateCurrentViewByConfigProps is called when config props change, we need to handle config.disablePopUp change.

      const prePopupEnabled = !preConfig?.disablePopUp
      const popupEnabled = !config.disablePopUp

      // Both Map widget 'disablePopUp' option and JimuMapView.enableClickOpenPopup() can control 'view.popupEnabled'.
      // We should not use `this.view.popupEnabled !== currPopupEnabled` here because we only want to check if Map widget 'disablePopUp' option changed,
      // so we should use `prePopupEnabled !== currPopupEnabled` here.
      if (prePopupEnabled !== popupEnabled) {
        // config.disablePopUp really changed
        view.popupEnabled = popupEnabled

        if (!popupEnabled) {
          const jimuMapView = this.getJimuMapViewByView(view)

          if (jimuMapView) {
            jimuMapView.closePopup()
          }
        }
      }
    }

    // update popup dock options
    if (!calledWhenViewCreate) {
      if (config.popupDockPosition !== preConfig?.popupDockPosition) {
        // popupDockPosition changed
        const popupElement = this.arcgisComponent?.popupElement

        // TODO
        if (popupElement) {
          // In fact, popupElement is not empty because we create it in createArcgisComponent() method.
          const popupDockPosition = getValidPopupDockPosition(config)
          this.updatePopupDockOptions(popupElement, popupDockPosition)
        }
      }
    }

    // update highlight
    // In fact, this.view.highlightOptions points to defaultHighlightOptions.
    const defaultHighlightOptions: __esri.HighlightOptions = getDefaultHighlightOptions(view)

    if (defaultHighlightOptions) {
      if ((config.selectionHighlightColor !== preConfig?.selectionHighlightColor) || (config.selectionHighlightHaloColor !== preConfig?.selectionHighlightHaloColor)) {
        // highlight info changes
        const highlightOptions = this.createDefaultHighlightOptionsByConfig(config, this.Color)

        // don't replace defaultHighlightOptions with highlightOptions directly, only update defaultHighlightOptions.color and defaultHighlightOptions.haloColor
        defaultHighlightOptions.color = highlightOptions.color
        defaultHighlightOptions.haloColor = highlightOptions.haloColor
      }
    }

    const enableScroll = !config.disableScroll

    // this.view.navigation is empty sometimes, so we need to check it here.
    const navigation = view.navigation

    if (navigation) {
      const actionMap = navigation.actionMap

      if (actionMap) {
        const mouseWheel: 'zoom' | 'none' = enableScroll ? 'zoom' : 'none'

        if (actionMap.mouseWheel !== mouseWheel) {
          actionMap.mouseWheel = mouseWheel
        }
      }

      if (navigation.browserTouchPanEnabled !== enableScroll) {
        navigation.browserTouchPanEnabled = enableScroll
      }
    }

    if (view.ui) {
      view.ui.components = []
    }

    if (this.isSceneView(view)) {
      const sceneView = view as __esri.SceneView
      const viewExbQualityProfile = (sceneView[exbQualityProfileKey] as SceneQualityMode) || SceneQualityMode.auto
      const configSceneQualityMode = config.sceneQualityMode || SceneQualityMode.auto

      if (viewExbQualityProfile !== configSceneQualityMode) {
        sceneView[exbQualityProfileKey] = configSceneQualityMode

        if (configSceneQualityMode === SceneQualityMode.auto) {
          // If sceneQualityMode is 'auto', we should set sceneView.qualityProfile to undefined because undefined means automatic.
          // However, the current API only supports setting automatic (undefined) during initialization. Once SceneView is initialized, automatic (undefined) cannot be set.
          // For automatic, API uses low for iPhone and medium for other devices.
          // sceneView.qualityProfile = undefined
          const iPhoneMatch = /iPhone/i.test(navigator.userAgent)
          sceneView.qualityProfile = iPhoneMatch ? 'low' : 'medium'
        } else {
          // If sceneQualityMode is 'low', 'medium' or 'high', we should set it to sceneView.qualityProfile.
          sceneView.qualityProfile = configSceneQualityMode
        }
      }
    }

    if (view.type === '2d') {
      // try to update mapView.timeZone
      const mapView = view as __esri.MapView
      this.updateMapViewTimeZone(view)

      // For the first componentDidUpdate(), preConfig is always undefined, we need to exclude this case
      if (preConfig) {
        // try to update mapView.constraints.minScale and mapView.constraints.maxScale by config.scaleRange
        const preScaleRange = preConfig?.scaleRange || null
        const scaleRange = config?.scaleRange || null
        const isScaleRangeChanged = scaleRange !== preScaleRange

        // try to update mapView.constraints.lods by config.customLODs
        const preCustomLODs = preConfig?.customLODs || null
        const customLODs = config?.customLODs || null
        const isCustomLODsChanged = customLODs !== preCustomLODs

        if (isScaleRangeChanged || isCustomLODsChanged) {
          // config.scaleRange or config.customLODs changed, update the minScale/maxScale/lods
          this.applyFinalMinMaxScaleLODsFor2dMapView(mapView)
          const constraints = mapView.constraints

          if (constraints) {
            constraints.snapToZoom = this.getFinalSnapToZoomByConfig()
          }
        }
      }
    }

    // check if we should update aria-label
    // eslint-disable-next-line no-useless-assignment
    let shouldUpdateAriaLabel = false
    const ariaLabel = this.props.baseWidgetProps?.a11yLabel || ''

    if (calledWhenViewCreate) {
      shouldUpdateAriaLabel = true
    } else {
      const preAriaLabel = prevProps?.baseWidgetProps?.a11yLabel || ''
      shouldUpdateAriaLabel = ariaLabel !== preAriaLabel
    }

    // eslint-disable-next-line no-useless-assignment
    let shouldUpdateAriaRole = false
    const ariaRole = this.props.baseWidgetProps?.a11yLandmark || ''

    if (calledWhenViewCreate) {
      shouldUpdateAriaRole = true
    } else {
      const preAriaRole = prevProps?.baseWidgetProps?.a11yLandmark || ''
      shouldUpdateAriaRole = ariaRole !== preAriaRole
    }

    if (shouldUpdateAriaLabel) {
      setTimeout(() => {
        // If calledWhenViewCreate is true, JS API will override aria-label to empty after call updateAriaLabelForViewSurface.
        // So we need to call this method in a timer.
        const mapLabel = this.props.baseWidgetProps.intl.formatMessage({ id: '_widgetLabel', defaultMessage: mapDefaultMessages._widgetLabel })
        const finalAriaLabel = ariaLabel || mapLabel
        updateAriaLabelForViewSurface(view, finalAriaLabel)
      }, 100)
    }

    if (shouldUpdateAriaRole) {
      setTimeout(() => {
        updateAriaRoleForViewSurface(view, ariaRole)
      }, 100)
    }
  }

  getFinalSnapToZoomByConfig (): boolean {
    const config = this.props.baseWidgetProps.config
    // If customLODs is not empty and customLODs doesn't have 'lods' property, it means that user check the 'Customize scale list' radio, but doesn't click the 'Modify' button.
    // In this case, we still need to set snapToZoom to true.
    // const snapToZoom: boolean = config?.customLODs?.lods?.length > 0
    const snapToZoom: boolean = !!(config?.customLODs)
    return snapToZoom
  }

  /**
   * This method will try update constraints.minScale/maxScale or constraints.lods
   * case1. This method will calculate and apply the final minScale/maxScale for MapView by config.scaleRange and mapView.constraintsInfo.lods.
   *        If mapView.constraintsInfo.lods exists, we need to make sure the final minScale/maxScale is in range of lods scale range, otherwise JS API will not work as expected.
   * case2. This method will calculate constraints.lods by config.customLODs.
   * @param mapView
   * @returns Return true if the final constraints.minScale/maxScale or constraints.lods changed
   */
  applyFinalMinMaxScaleLODsFor2dMapView (mapView: __esri.MapView): boolean {
    let scaleChanged = false

    if (mapView.type === '2d') {
      const config = this.props?.baseWidgetProps?.config
      // configScaleRange maybe null
      const configScaleRange = config?.scaleRange
      // customLODsObj maybe null
      const customLODsObj = config?.customLODs
      const constraints = mapView.constraints

      if (constraints) {
        if (customLODsObj) {
          // 'Customize scale list' radio is checked
          if (constraints.minScale !== 0) {
            scaleChanged = true
            constraints.minScale = 0
          }

          if (constraints.maxScale !== 0) {
            scaleChanged = true
            constraints.maxScale = 0
          }

          const finalLods = getFinalLods(mapView, config)
          const same = isSameLods(constraints.lods, finalLods)

          if (!same) {
            scaleChanged = true
            constraints.lods = finalLods
          }
        } else {
          // 'Adjust scale range' radio is checked or 'Set scale limits for 2D maps' switch turns off
          if (constraints.lods !== null) {
            scaleChanged = true
            constraints.lods = null
          }

          const finalScaleRange = getFinalScaleRangeForView(mapView, configScaleRange)

          if (finalScaleRange) {
            const {
              finalMinScale,
              finalMaxScale
            } = finalScaleRange

            if (constraints.minScale !== finalMinScale) {
              scaleChanged = true
              constraints.minScale = finalMinScale
            }

            if (constraints.maxScale !== finalMaxScale) {
              scaleChanged = true
              constraints.maxScale = finalMaxScale
            }
          }
        }
      }
    }

    return scaleChanged
  }

  // update dockEnabled and dockOptions for popup element
  updatePopupDockOptions (popupElement: HTMLArcgisPopupElement, popupDockPosition: ExBPopupDockPosition): void {
    if (!popupElement) {
      return
    }

    if (popupDockPosition) {
      // dock popup
      popupElement.dockEnabled = true
      popupElement.dockOptions = {
        breakpoint: false,
        buttonEnabled: true,
        position: () => {
          let finalPosition = popupDockPosition
          const view = this.getCurrentView()

          if (view) {
            if (view.widthBreakpoint === 'xsmall') {
              // mobile layout
              if (['top-left', 'top-center', 'top-right'].includes(popupDockPosition)) {
                finalPosition = 'top-center'
              } else {
                finalPosition = 'bottom-center'
              }
            } else {
              // pc layout
              finalPosition = popupDockPosition
            }
          }

          if (!finalPosition) {
            finalPosition = 'auto'
          }

          return finalPosition
        }
      }
    } else {
      // don't dock popup
      popupElement.dockEnabled = false
      popupElement.dockOptions = {
        // breakpoint: {
        //   width: 544
        // },
        breakpoint: true,
        buttonEnabled: true,
        position: 'auto'
      }
    }
  }

  /**
   * Consume this.props.baseWidgetProps.mutableStateProps change
   */
  checkAndHandleMutableStateProps () {
    const view = this.getCurrentView()

    if (view && this.arcgisComponent && this.props.baseWidgetProps.mutableStateProps) {
      const jimuMapViewId = this.arcgisComponent.dataSourceInfo.jimuMapViewId
      const jimuMapView = MapViewManager.getInstance().getJimuMapViewById(jimuMapViewId)

      if (jimuMapView) {
        jimuMapView.whenJimuMapViewLoaded().then(() => {
          setTimeout(() => {
            // We don't need to check this.view if null or destroyed here, we do it in this.handleAction()
            this.handleAction(this.props.baseWidgetProps.mutableStateProps, view, jimuMapView)
            this.isFirstReceiveMessage = false
          }, this.isFirstReceiveMessage ? 500 : 0)
        })
      }
    }
  }

  isMapView (view: MapbaseView): boolean {
    return view && view.declaredClass === 'esri.views.MapView'
  }

  isSceneView (view: MapbaseView): boolean {
    return view && view.declaredClass === 'esri.views.SceneView'
  }

  diffProps (prevProps: Props) {
    const addedKeys: string[] = []
    const removeKeys: string[] = []
    const updatedKeys: string[] = []

    const currKeys = Object.keys(this.props)
    const prevKeys = Object.keys(prevProps)

    const prevKeysMap: { [key: string]: boolean } = {}
    prevKeys.forEach(key => {
      prevKeysMap[key] = true
    })

    const currKeysMap: { [key: string]: boolean } = {}
    currKeys.forEach(key => {
      currKeysMap[key] = true
    })

    currKeys.forEach(currKey => {
      if (prevKeysMap[currKey]) {
        if (prevProps[currKey] !== this.props[currKey]) {
          updatedKeys.push(currKey)
        }
      } else {
        addedKeys.push(currKey)
      }
    })

    prevKeys.forEach(prevKey => {
      if (!currKeysMap[prevKey]) {
        removeKeys.push(prevKey)
      }
    })

    return {
      addedKeys,
      removeKeys,
      updatedKeys
    }
  }

  async loadCommonModules () {
    const modules = await loadArcGISJSAPIModules([
      'esri/geometry/Extent',
      'esri/Viewpoint',
      'esri/portal/Portal',
      'esri/portal/PortalItem',
      'esri/Color',
      'esri/geometry/SpatialReference',
      'esri/geometry/Point',
      'esri/core/reactiveUtils'
    ]);
    // Note, when load and cache more API modules by loadArcGISJSAPIModules method, we should also update getMapBaseRestoreData() method.

    [
      this.Extent, this.Viewpoint, this.Portal, this.PortalItem, this.Color, this.SpatialReference, this.Point, this.reactiveUtils
    ] = modules

    if (this.__unmount) {
      return
    }

    this.setState({
      isBasicModulesLoaded: true
    })
  }

  async cacheLoadModulesAndCreateArcgisComponent (dataSourceInfo: MapbaseDataSourceInfo, checkFailedUniqueId: boolean): Promise<void> {
    if (this.__unmount || this.isCurrentArcgisComponentExpected() || this.isCreatingExpectedArcgisComponent() || !this.props.mapComponentsLoaded) {
      return
    }

    const uniqueId = dataSourceInfo?.uniqueId

    if (uniqueId) {
      if (checkFailedUniqueId) {
        if (this.mapViewCreateFailedUniqueIdsInfo[uniqueId]) {
          console.log('do not create map because it failed before', uniqueId)
          return
        }
      }

      delete this.mapViewCreateFailedUniqueIdsInfo[uniqueId]
    }

    this.setState({
      mapLoadStatus: MapLoadStatus.Loading
    })

    const mapCreatingInfo: MapCreatingInfo = {
      dataSourceInfo
    }

    this.mapCreatingInfo = mapCreatingInfo
    const dsId = this.props.dataSourceId || ''

    try {
      // If cacheLoadModulesAndCreateMapbaseView is called in onStoreResourceSessionsChange, common modules maybe not loaded yet, we need to check this case.
      const isBasicModulesLoaded = this.state?.isBasicModulesLoaded

      if (!isBasicModulesLoaded) {
        await this.loadCommonModules()
      }

      if (dataSourceInfo.isWebMap) {
        // load modules to create the web map for arcgis-map
        if (!this.WebMap) {
          const modules = await loadArcGISJSAPIModules([
            'esri/geometry/Geometry',
            'esri/webmap/InitialViewProperties',
            'esri/Basemap',
            'esri/layers/TileLayer',
            'esri/WebMap',
            'esri/views/2d/MapViewConstraints',
          ]);
          // Note, when load and cache more API modules by loadArcGISJSAPIModules method, we should also update getMapBaseRestoreData() method.

          [
            this.Geometry, this.InitialViewProperties, this.Basemap, this.TileLayer, this.WebMap, this.MapViewConstraints
          ] = modules
        }
      } else {
        // load modules to create the web scene for arcgis-scene
        if (!this.WebScene) {
          const modules = await loadArcGISJSAPIModules([
            'esri/WebScene'
          ]);
          // Note, when load and cache more API modules by loadArcGISJSAPIModules method, we should also update getMapBaseRestoreData() method.

          [
            this.WebScene
          ] = modules
        }
      }

      if (this.__unmount || this.isCurrentArcgisComponentExpected() || !this.isDataSourceInfoExpected(mapCreatingInfo.dataSourceInfo)) {
        return
      }

      await this.createArcgisComponent(mapCreatingInfo)

      // successfully create map
      if (uniqueId) {
        delete this.mapViewCreateFailedUniqueIdsInfo[uniqueId]
      }
    } catch (e) {
      // create map failed
      console.error('cacheLoadModulesAndCreateMapbaseView error', e)

      if (uniqueId) {
        this.mapViewCreateFailedUniqueIdsInfo[uniqueId] = true
      }

      if (this.mapCreatingInfo === mapCreatingInfo) {
        this.setState({
          mapLoadStatus: MapLoadStatus.LoadError
        }, () => {
          if (this.props.onMapLoaded) {
            this.props.onMapLoaded(dsId, MapLoadStatus.LoadError)
          }
        })
      }
    }

    if (this.mapCreatingInfo === mapCreatingInfo) {
      this.mapCreatingInfo = null
    }
  }

  async createArcgisComponent (mapCreatingInfo: MapCreatingInfo): Promise<void> {
    const dataSourceInfo = mapCreatingInfo.dataSourceInfo

    if (this.__unmount || this.isCurrentArcgisComponentExpected() || !this.isDataSourceInfoExpected(dataSourceInfo) || !this.props.mapComponentsLoaded) {
      return
    }

    const uniqueId = dataSourceInfo.uniqueId

    // get mapViewOptions or sceneViewOptions
    let mapViewOptions: MapViewOptions = null
    let sceneViewOptions: SceneViewOptions = null

    if (dataSourceInfo.isWebMap) {
      // get map view option
      mapViewOptions = this.getMapViewOptionToCreateMapView(dataSourceInfo)
    } else {
      // get scene view option
      sceneViewOptions = this.getSceneViewOptionToCreateSceneView(dataSourceInfo)
    }

    // In 2025.R01, we use await webMapOrWebScene.load() and await webMapOrWebScene.when() before create MapView/SceneView, so we can check webMapOrWebScene.loadStatus here.
    // But in 2025.R02, we can't await webMapOrWebScene.load() and await webMapOrWebScene.when() for performance reason. So `webMapOrWebScene.loadStatus === 'failed'` will always be false.
    // But we don't need to remove the following code because it doesn't create side effect.
    const webMapOrWebScene = (mapViewOptions && mapViewOptions.map) || (sceneViewOptions && sceneViewOptions.map)

    if (!webMapOrWebScene || webMapOrWebScene.loadStatus === 'failed') {
      console.log('webmap load failed, so can\'t create mapbase view,', uniqueId)
      return
    }

    let popupDockPosition: ExBPopupDockPosition
    const config = this.props.baseWidgetProps.config

    if (config) {
      popupDockPosition = getValidPopupDockPosition(config)
    }

    // need to check view again to avoid new MapView() twice, because we use async function to get mapViewOption
    if (this.__unmount || this.isCurrentArcgisComponentExpected() || !this.isDataSourceInfoExpected(dataSourceInfo)) {
      return
    }

    let initUrlHashMapOptions: ParsedViewUrlParams = null
    let isPersistentMapStateUsed = false

    if (this.props.baseWidgetProps.isRunAppMode) {
      initUrlHashMapOptions = this.getMapOptionsByUrlHashParams(dataSourceInfo.isWebMap)

      if (initUrlHashMapOptions) {
        isPersistentMapStateUsed = !!(this.props?.baseWidgetProps?.runtimePersistentMapState)

        const hashViewpoint = initUrlHashMapOptions.viewpoint

        if (mapViewOptions) {
          let zoomMaybeFloat = false

          if (hashViewpoint) {
            mapViewOptions.viewpoint = hashViewpoint
            zoomMaybeFloat = true
          }

          if (initUrlHashMapOptions.center) {
            mapViewOptions.center = initUrlHashMapOptions.center
          }

          // view.scale can override view.viewpoint.scale
          if ('scale' in initUrlHashMapOptions) {
            mapViewOptions.scale = initUrlHashMapOptions.scale
            zoomMaybeFloat = true
          }

          // scale has higher priority than level, ignore level if scale exists
          if (!('scale' in mapViewOptions) && 'level' in initUrlHashMapOptions) {
            mapViewOptions.zoom = initUrlHashMapOptions.level
          }

          if ('rotation' in initUrlHashMapOptions) {
            mapViewOptions.rotation = initUrlHashMapOptions.rotation
            zoomMaybeFloat = true
          }

          const snapToZoomByConfig = this.getFinalSnapToZoomByConfig()

          // snapToZoom priority: custom LOD (snapToZoom = true) > viewpoint/scale/zoom map url params (snapToZoom = false) > default MapViewer view (snapToZoom = true)
          // If snapToZoomByConfig is true, means user uses custom LOD. In this case, we should always set constraints.snapToZoom to true. So we need to check snapToZoomByConfig here.
          if (!snapToZoomByConfig && zoomMaybeFloat && mapViewOptions.constraints) {
            // Note, we must set snapToZoom to false if we can get hashViewpoint, otherwise the final view.scale is different with hashViewpoint.scale,
            // because hashViewpoint.scale comes from a float-zoom map and view.scale comes from a int-zoom map.
            mapViewOptions.constraints.snapToZoom = false
          }
        }

        if (sceneViewOptions) {
          if (hashViewpoint) {
            sceneViewOptions.viewpoint = hashViewpoint
          }
        }
      }
    }

    // If view.map load failed, it doesn't trigger the error callback of view.when(okCallback, errCallback), but the viewPromise keeps pending.
    // So we need to use map.when() to watch map status.
    // If view.map load failed, it triggers the error callback of map.when(okCallback, errCallback), but the mapPromise keeps pending.
    // So we need to wrap map.when() to get the correct promise.
    const { arcgisComponent, mapPromise, viewPromise } = this.rawCreateArcgisComponent(dataSourceInfo, mapViewOptions, sceneViewOptions, popupDockPosition)

    try {
      await Promise.all([mapPromise, viewPromise])
    } catch (e) {
      // create map failed
      console.error('map or view when error', e)
      // map or view load failed, we should destroy the map component
      this.destroyArcgisComponent(arcgisComponent)
      throw e
    }

    if (this.__unmount || this.isCurrentArcgisComponentExpected() || !this.isDataSourceInfoExpected(dataSourceInfo)) {
      // the map component is not expected anymore, we should destroy it
      this.destroyArcgisComponent(arcgisComponent)
      return
    }

    const view = arcgisComponent.view as unknown as MapbaseView

    if (!view) {
      this.destroyArcgisComponent(arcgisComponent)
      throw new Error('arcgis map component view is not available after viewOnReady().')
    }

    const mapShadowRoot = arcgisComponent.shadowRoot

    if (mapShadowRoot) {
      arcgisComponent.style.display = 'contents'
      const mapStyle = document.createElement('style')
      // Only show the focus outline when map is focused by keyboard (not mouse), to avoid the focus outline always exist after click the map.
      // The :focus pseudo-class is activated whenever a DOM element gains focus through any interaction, such as mouse clicks or Tab key navigation.
      // Focusing an element via the Tab key will activate :focus-visible, whereas focusing it via a mouse click will not.
      mapStyle.innerHTML = `
        .esri-view .esri-view-surface:not(:focus-visible):after {
          outline: none !important;
        }

        .arcgis-map-container-ui {
          z-index: unset !important;
          overflow: hidden !important;
        }
      `
      mapShadowRoot.appendChild(mapStyle)
    }

    if (!dataSourceInfo.isWebMap) {
      view[exbQualityProfileKey] = config?.sceneQualityMode
    }

    // add properties and methods for view, but it doesn't update this.view by view
    this.afterCreateView(view, config, initUrlHashMapOptions, isPersistentMapStateUsed)

    if (this.arcgisComponent) {
      this.destroyCurrentArcgisComponent()
      this.arcgisComponent = null
    }

    this.arcgisComponent = arcgisComponent

    // don't set this.mapCreatingInfo to null here, because this.mapCreatingInfo is created in this.cacheLoadModulesAndCreateMapbaseView() method
    // this.mapCreatingInfo = null

    if (this.isReadyToCreateJimuMapView()) {
      this.createJimuMapView()
    }

    this.bindMapBaseViewEvent(view)
    this.tryUpdateCurrentViewByConfigProps(true)
    this.checkAndHandleMutableStateProps()
    this.viewWhen(arcgisComponent)
  }

  getCurrentView (): MapbaseView {
    return this.arcgisComponent?.view as unknown as MapbaseView
  }

  rawCreateArcgisComponent (
    dataSourceInfo: MapbaseDataSourceInfo,
    mapViewOptions: MapViewOptions,
    sceneViewOptions: SceneViewOptions,
    exbPopupDockPosition: ExBPopupDockPosition
  ): {
    arcgisComponent: ArcgisComponent
    mapPromise: Promise<void>
    viewPromise: Promise<void>
  } {
    mapViewOptions = mapViewOptions || {} as MapViewOptions
    sceneViewOptions = sceneViewOptions || {} as SceneViewOptions
    const isWebMap = dataSourceInfo.isWebMap
    const map = isWebMap ? mapViewOptions?.map : sceneViewOptions?.map
    const arcgisComponent = (isWebMap ? this.createMapComponent(mapViewOptions) : this.createSceneComponent(sceneViewOptions)) as ArcgisComponent
    arcgisComponent.dataSourceInfo = dataSourceInfo

    arcgisComponent.classList.add('w-100', 'h-100', 'map-base-view-container')
    arcgisComponent.autoDestroyDisabled = true
    arcgisComponent.hideAttribution = true
    arcgisComponent.popupComponentEnabled = true

    // When user clicks the map, we want to blur the map element to avoid the focus outline.
    arcgisComponent.addEventListener('pointerdown', () => {
      try {
        if (arcgisComponent?.blur) {
          arcgisComponent.blur()
        }
      } catch (e) {
        console.warn('arcgisComponent blur error', e)
      }
    }, false)

    const popupElement = document.createElement('arcgis-popup')
    popupElement.slot = 'popup'
    popupElement.autoDestroyDisabled = true
    popupElement.topLayerDisabled = true
    popupElement.defaultPopupTemplateEnabled = true
    this.updatePopupDockOptions(popupElement, exbPopupDockPosition)
    arcgisComponent.appendChild(popupElement)

    this.widgetContainer.appendChild(arcgisComponent)

    const mapPromise = new Promise<void>((resolve, reject) => {
      map.when(() => {
        resolve()
      }, (err: Error) => {
        console.error('map when error callback', err)
        reject(err)
      })
    })

    const viewPromise = new Promise<void>((resolve, reject) => {
      arcgisComponent.viewOnReady(() => {
        if (arcgisComponent.view) {
          const view = arcgisComponent.view as unknown as MapbaseView
          view.dataSourceInfo = dataSourceInfo
        }

        resolve()
      }, (err: Error) => {
        console.error('view when error callback', err)
        reject(err)
      })
    })

    return {
      arcgisComponent,
      mapPromise,
      viewPromise
    }
  }

  createMapComponent (mapViewOptions: MapViewOptions,) {
    mapViewOptions = mapViewOptions || {} as MapViewOptions
    const mapComponent = document.createElement('arcgis-map')

    if (mapViewOptions.map) {
      mapComponent.map = mapViewOptions.map as unknown as HTMLArcgisMapElement['map']
    }

    if (mapViewOptions.constraints) {
      mapComponent.constraints = mapViewOptions.constraints
    }

    if (mapViewOptions.viewpoint) {
      mapComponent.viewpoint = mapViewOptions.viewpoint as unknown as HTMLArcgisMapElement['viewpoint']
    }

    if (mapViewOptions.extent) {
      mapComponent.extent = mapViewOptions.extent as unknown as HTMLArcgisMapElement['extent']
    }

    if (mapViewOptions.center) {
      mapComponent.center = mapViewOptions.center as unknown as HTMLArcgisMapElement['center']
    }

    if (typeof mapViewOptions.scale === 'number') {
      mapComponent.scale = mapViewOptions.scale
    }

    if (typeof mapViewOptions.zoom === 'number') {
      mapComponent.zoom = mapViewOptions.zoom
    }

    if (typeof mapViewOptions.rotation === 'number') {
      mapComponent.rotation = mapViewOptions.rotation
    }

    return mapComponent
  }

  createSceneComponent (sceneViewOptions: SceneViewOptions) {
    sceneViewOptions = sceneViewOptions || {} as SceneViewOptions
    const sceneComponent = document.createElement('arcgis-scene')

    if (sceneViewOptions.map) {
      sceneComponent.map = sceneViewOptions.map as unknown as HTMLArcgisSceneElement['map']
    }

    if (sceneViewOptions.viewpoint) {
      sceneComponent.viewpoint = sceneViewOptions.viewpoint as unknown as HTMLArcgisSceneElement['viewpoint']
    }

    if (sceneViewOptions.qualityProfile) {
      sceneComponent.qualityProfile = sceneViewOptions.qualityProfile
    }

    return sceneComponent
  }

  afterCreateView (view: MapbaseView, config: IMConfig, initUrlHashMapOptions: ParsedViewUrlParams, isPersistentMapStateUsed: boolean) {
    // by default, view.highlights is an array like this [defaultHighlightOptions, temporaryHighlightOptions]
    const exbDefaultHighlightOptions = this.createDefaultHighlightOptionsByConfig(config, this.Color)

    if (exbDefaultHighlightOptions) {
      const apiDefaultHighlightOptions = getDefaultHighlightOptions(view)

      if (apiDefaultHighlightOptions) {
        // override API's default highlight options by map config
        if (exbDefaultHighlightOptions.color) {
          apiDefaultHighlightOptions.color = exbDefaultHighlightOptions.color
        }

        if (exbDefaultHighlightOptions.haloColor) {
          apiDefaultHighlightOptions.haloColor = exbDefaultHighlightOptions.haloColor
        }
      } else {
        // In fact, it should not go here.
        view.highlights?.unshift(exbDefaultHighlightOptions)
      }
    }

    view.initUrlHashMapOptions = initUrlHashMapOptions
    view.runtimeUrlHashParams = this.props.baseWidgetProps?.runtimeUrlHashParams
    view.isPersistentMapStateUsed = isPersistentMapStateUsed

    const map = view.map as __esri.Map & { thumbnailUrl: string, originalBasemap: __esri.Basemap }

    // set view.map.originalBasemap
    const setOriginalBasemap = () => {
      if (map.originalBasemap) {
        return
      }

      const originalBasemap = map.basemap

      // originalBasemap maybe null, we need to check originalBasemap is null or not
      if (!originalBasemap) {
        return
      }

      if (!originalBasemap.thumbnailUrl) {
        const mapThumbnailUrl = map.thumbnailUrl

        // use map.thumbnailUrl as originalBasemap.thumbnailUrl if originalBasemap.thumbnailUrl is empty
        if (mapThumbnailUrl) {
          originalBasemap.thumbnailUrl = mapThumbnailUrl
        }
      }

      map.originalBasemap = originalBasemap
    }

    if (map.basemap) {
      setOriginalBasemap()
    } else {
      let watchBasemapHandle: __esri.Handle = null

      watchBasemapHandle = this.reactiveUtils.watch(() => map?.basemap, () => {
        // only watch once
        if (watchBasemapHandle) {
          watchBasemapHandle.remove()
        }

        watchBasemapHandle = null

        if (map.basemap) {
          setOriginalBasemap()
        }
      })
    }

    view.mapbase = this
    view.highLightHandles = {}
    view.mapBaseViewEventHandles = {}
    view.extentChangeRelatedWidgetIds = []
    view.publishExtentChangeMessage = function (stationary: boolean, interactive: boolean) {
      try {
        if (view && !view.destroyed) {
          const mapbase = view.mapbase

          if (mapbase && !mapbase.__unmount && mapbase.props && mapbase.props.onExtentChanged) {
            mapbase.publishExtentChangeMessage(view, stationary, interactive)
          }
        }
      } catch (e) {
        console.error('view publish extent change message error', e)
      }
    }

    view.hideMapTools = function () {
      try {
        view.isMapToolsHidden = true

        if (view && !view.destroyed) {
          const mapbase = view.mapbase

          if (mapbase && !mapbase.__unmount && mapbase.props) {
            if (mapbase.props.onActiveToolInfoChange) {
              // set no active tool
              mapbase.props.onActiveToolInfoChange(null)
            }

            const multiSourceMapDom = mapbase.props.multiSourceMapDom

            if (multiSourceMapDom) {
              multiSourceMapDom.classList.add('hide-map-tools-layout')
            }
          }
        }
      } catch (e) {
        console.error('view hide map tools error', e)
      }
    }
    view.viewpointHistory = []
    view.viewpointIndex = -1

    view.showMapTools = function () {
      try {
        view.isMapToolsHidden = false

        if (view && !view.destroyed) {
          const mapbase = view.mapbase

          if (mapbase && !mapbase.__unmount && mapbase.props) {
            const multiSourceMapDom = mapbase.props.multiSourceMapDom

            if (multiSourceMapDom) {
              multiSourceMapDom.classList.remove('hide-map-tools-layout')
            }
          }
        }
      } catch (e) {
        console.error('view show map tools error', e)
      }
    }

    const runtimeUrlHashParams = this.props.baseWidgetProps.runtimeUrlHashParams

    view.parseMarkerGroupUrlParam = function () {
      return parseMarkerGroupUrlParam(runtimeUrlHashParams)
    }
  }

  viewWhen (arcgisComponent: ArcgisComponent) {
    const view = arcgisComponent.view as unknown as MapbaseView
    view.isViewWhenReady = true
    view.originalBasemapLODs = (view as any).constraintsInfo?.lods
    this.initViewTimeZone(view)

    if (view.viewpoint) {
      view.lastViewpointToUpdateUrlParams = view.viewpoint.clone()
    } else {
      view.lastViewpointToUpdateUrlParams = null
    }

    if (view.type === '2d') {
      // mapViewOption.constraints.minScale/maxScale maybe invalid because we can't get the lod information when create mapViewOption.
      // In view.when() callback, we can get the lod information, so we need to call this.applyFinalMinMaxScaleFor2dMapView() by config.scaleRange and mapView.constraintsInfo.lods.
      const scaleChanged = this.applyFinalMinMaxScaleLODsFor2dMapView(view as __esri.MapView)

      if (scaleChanged) {
        // If scaleChanged is true, means view.constraints.minScale/maxScale changed. view.viewpoint doesn't change immediately, we need to get the new viewpoint in a setTimeout callback.
        setTimeout(() => {
          if (view.viewpoint) {
            view.lastViewpointToUpdateUrlParams = view.viewpoint.clone()
          }
        }, 100)
      }
    }

    view.viewWhenTimestamp = Date.now()

    // view.when() is async, we need to check the view is expected or not
    // if the view is not expected again, we don't execute the following logic
    const isViewOk = !view.destroyed && this.isArcgisComponentExpected(arcgisComponent)

    if (!isViewOk) {
      return
    }

    setTimeout(() => {
      if (!view.destroyed) {
        // make sure publish extent-change message at least once
        this.publishExtentChangeMessage(view, true)
      }
    }, 1000)

    view.watchInteractingHandle = this.reactiveUtils.watch(() => view?.interacting, () => {
      if (view.interacting) {
        MapBase.lastInteractiveView = view
        // We must set view.extentChangeRelatedWidgetIds to empty array, because current view is the extent-change source.
        this.setExtentChangeRelatedWidgetIdsForView(view, [])
      }
    })

    // MapView always trigger twice extent change event after view when, about 3ms - 80ms after view when.
    // SceneView always trigger 2-5 times extent change event after view when, about 3 - 5000 ms, depends on data.
    view.extentWatchHandle = this.reactiveUtils.watch(() => view?.extent, (extent: __esri.Extent) => {
      if (!extent) {
        return
      }

      this.publishExtentChangeMessage(view, false)

      if (view.stationaryTimerId) {
        clearTimeout(view.stationaryTimerId)
        view.stationaryTimerId = null
      }

      // We don't use view.watch('stationary', cb) to check if view is static or not, because the behavior of view.stationary is strange.
      // Instead, we use a timeout to check if view is static or not.
      view.stationaryTimerId = setTimeout(() => {
        view.stationaryTimerId = null
        // view is static now

        // We need to publish extent-change message again when view is static.
        this.publishExtentChangeMessage(view, true)

        // Note, make sure we call setExtentChangeRelatedWidgetIdsForView() after publish extent-change message.
        this.setExtentChangeRelatedWidgetIdsForView(view, [])

        setTimeout(() => {
          if (view === MapBase.lastInteractiveView && !view.interacting) {
            MapBase.lastInteractiveView = null
          }
        }, 1000)
      }, 200)
    })

    if (view.type === '2d') {
      // If mapView.constraintsInfo.lods exists, we need to make sure the final minScale/maxScale is in range of lods scale range, otherwise JS API will not work as expected.
      // User maybe change the basemap by basemap tool or Basemap Gallery widget, so we need to watch if lods changed.
      view.watchLodsHandle = this.reactiveUtils.watch(() => (view as any).constraintsInfo?.lods, () => {
        this.applyFinalMinMaxScaleLODsFor2dMapView(view as __esri.MapView)
      })
    }

    if (!view.fatalErrorWatchHandle) {
      view.fatalErrorWatchHandle = this.reactiveUtils.watch(() => view?.fatalError, (error) => {
        if (error) {
          // Don't use this.props.isMapInVisibleArea to check is map visible or not, because mapbase maybe unmounted and this.props.isMapInVisibleArea is still true.
          // It is more safe to
          const shouldRecovery = !view.isInCaching && view.container && view.container.clientWidth > 0 && view.container.clientHeight > 0
          const widgetId = this.props?.baseWidgetProps?.id || ''

          if (shouldRecovery) {
            console.error(`${widgetId} Fatal Error! View has lost its WebGL context. Attempting to recover it because the view is visible.`)
            this.tryFatalErrorRecovery(view)
          } else {
            console.error(`${widgetId} Fatal Error! View has lost its WebGL context. Don't recover it because the view is not visible.`)
          }
        }
      })
    }

    // TODO: maybe we need to move setState() and onMapLoaded() into this.cacheLoadModulesAndCreateMapbaseView() method
    // after view is loaded, send extent change message
    this.setState({ mapLoadStatus: MapLoadStatus.Loadok }, () => {
      this.props.onMapLoaded(this.props.dataSourceId, MapLoadStatus.Loadok)
    })

    // If there is an extent is passed from extentMessage before, don't init extent here as this will publish
    // extentMessage and change other mapWidget's extent.
    if (!this.props.baseWidgetProps?.mutableStateProps?.zoomToFeatureActionValue?.value) {
      // In 2023.R02, it always calls this.goHome(false) here. We keep it for compatibility.
      // In the next release, if we can get viewpoint from url hash, we will use it as map initial viewpoint.
      // For this case (view.initUrlHashViewpoint not empty), we don't call this.goHome(false), because goHome will let the map goto config.initialMapState.
      if (!view.initUrlHashMapOptions) {
        this.goHome(false)
      }
    }

    if (this.isMapView(view)) {
      // snapToZoom: true means integer zoom, false means float zoom
      // We need to set the initial value to true for backward compatibility and keep the same behavior with MapViewer
      // After map inited, we will set snapToZoom to false to get the best synchronization between two map widgets

      // We use setTimeout here to make sure the above this.goHome(false) is done.
      setTimeout(() => {
        // If snapToZoomByConfig is true, means user uses custom LOD. In this case, we should always set constraints.snapToZoom to true. So we need to check snapToZoomByConfig here.
        // If snapToZoomByConfig is false, means user doesn't use custom LOD. In this case, we should set constraints.snapToZoom to false.
        const constraints = (view as __esri.MapView).constraints

        if (constraints) {
          constraints.snapToZoom = this.getFinalSnapToZoomByConfig()
        }
      }, 0)
    }
  }

  publishExtentChangeMessage (view: MapbaseView, stationary: boolean, interactive?: boolean): void {
    if (!view) {
      return
    }

    const nowTime = Date.now()

    if (!view.firstPublishExtentChangeTime) {
      view.firstPublishExtentChangeTime = nowTime
    }

    const extent = view.extent.clone()
    const viewpoint = view.viewpoint.clone()
    const viewpointJson = viewpoint?.toJSON()
    const extentJson = extent?.toJSON()
    const extentMessage = new ExtentChangeMessage(this.props.baseWidgetProps.id, extent, viewpoint, stationary)
    extentMessage.publishTime = nowTime
    extentMessage.interactive = interactive || view.interacting
    const extentChangeRelatedWidgetIdsOfView = this.getExtentChangeRelatedWidgetIdsOfView(view)

    extentMessage.setRelatedWidgetIds(extentChangeRelatedWidgetIdsOfView)
    extentMessage.addRelatedWidgetId(this.props.baseWidgetProps.id)
    this.props.onExtentChanged(this.props.dataSourceId, extentMessage)

    if (viewpointJson && extentJson) {
      postMessage({
        type: PostMessageType.ExbExtentChange,
        mapWidgetId: this.props.baseWidgetProps.id,
        viewpoint: viewpointJson,
        extent: extentJson
      })
    }

    if (stationary) {
      // handle viewpointHistory
      const currentViewpoint = view.viewpoint.clone()

      if (view.viewpointHistory.length > 0) {
        const indexes: number[] = [view.viewpointIndex, view.viewpointIndex - 1, view.viewpointIndex + 1]
        let isSameLikeViewpoint: boolean = false
        const lastViewpointIndex = view.viewpointHistory.length - 1

        for (let i = 0; i < indexes.length; i++) {
          const viewpointIndex = indexes[i]

          if (viewpointIndex >= 0 && viewpointIndex <= lastViewpointIndex) {
            const viewpoint = getViewpointInstanceFromHistory(view, viewpointIndex)

            if (viewpoint && isSameLikeViewpoints(view, currentViewpoint, viewpoint)) {
              isSameLikeViewpoint = true
              break
            }
          }
        }

        if (!isSameLikeViewpoint) {
          // current viewpointHistory: view.viewpointIndex point to C
          // A -> B -> [C] -> D -> E

          // temp viewpointHistory
          // A -> B -> [C]
          view.viewpointHistory.splice(view.viewpointIndex + 1)

          // new viewpointHistory
          // A -> B -> C -> [F]
          view.viewpointHistory.push(currentViewpoint)
          view.viewpointIndex += 1
        }
      } else {
        // first viewpoint
        view.viewpointHistory.push(currentViewpoint)
        view.viewpointIndex = 0
      }

      if (view.stationaryCallback) {
        view.stationaryCallback()
      }
    }

    this.debounceUpdateViewUrlParamsAndPersistentMapState()
  }

  debounceUpdateViewUrlParamsAndPersistentMapState = () => null

  updateViewUrlParamsAndPersistentMapState () {
    const view = this.getCurrentView()

    if (view) {
      const jimuMapView = this.getJimuMapViewByView(view)

      if (jimuMapView && jimuMapView.isActive) {
        // MapView always trigger twice extent change event after view when, about 3ms - 80ms after view when.
        // SceneView always trigger 2-5 times extent change event after view when, about 3 - 5000 ms, depends on data.
        // We don't want to update map url parameters during map initializing, so need to check viewpoint really changed or not.
        const isViewpointChange = !isSameLikeViewpoints(view, view.viewpoint, view.lastViewpointToUpdateUrlParams)

        if (isViewpointChange) {
          // viewpoint really changed
          updateViewUrlParamsForActiveJimuMapView(jimuMapView)
          updatePersistentMapStateForActiveJimuMapView(jimuMapView)
        }
      }
    }
  }

  generateViewPointFromInitialMapState (initialMapState: ImmutableObject<InitialMapState>): __esri.Viewpoint {
    // For 2d, initialMapState.extent and initialMapState.viewPoint have some difference.
    // The logic has run long time, for now we don't change its logic for compatibility.
    if (initialMapState.viewType === '2d') {
      return new this.Viewpoint(
        {
          targetGeometry: this.Extent.fromJSON(initialMapState.extent),
          rotation: initialMapState.rotation
        }
      )
    } else {
      return this.Viewpoint.fromJSON(initialMapState.viewPoint)
    }
  }

  getMapOptionsByUrlHashParams (is2d: boolean): ParsedViewUrlParams {
    let result: ParsedViewUrlParams = null

    try {
      const isRunAppMode = this.props.baseWidgetProps.isRunAppMode
      const runtimeUrlHashParams = this.props.baseWidgetProps.runtimeUrlHashParams

      if (isRunAppMode && runtimeUrlHashParams) {
        result = getParsedViewUrlParams(runtimeUrlHashParams, is2d, this.Viewpoint, this.Point, this.SpatialReference)
      }
    } catch (e) {
      console.error('parse map options from url hash params error', e)
      result = null
    }

    return result
  }

  async initViewTimeZone (view: MapbaseView) {
    // get the initial timeZone of MapViewer
    try {
      if (!view) {
        return
      }

      const map = view.map

      if (!map) {
        return
      }

      const webmapConfig = await (map as any).resourceInfo

      if (webmapConfig) {
        (map as any).originalItemTimeZone = webmapConfig.timeZone
      }
    } catch (e) {
      console.error('can not get MapViewer timeZone', e)
    }

    this.updateMapViewTimeZone(view)
  }

  updateMapViewTimeZone (view: MapbaseView) {
    if (view?.type === '2d') {
      // try to update mapView.timeZone
      const newTimeZone = this.calMapViewTimeZone(view.map as __esri.WebMap)
      const mapView = view as __esri.MapView

      if (mapView.timeZone !== newTimeZone) {
        mapView.timeZone = newTimeZone
      }
    }
  }

  calMapViewTimeZone (webMapOrWebScene: __esri.WebMap | __esri.WebScene): string {
    // eslint-disable-next-line no-useless-assignment
    let finalTimeZone: string = ''

    const timeZoneProp = this.props?.baseWidgetProps?.mapTimeZone
    const originalItemTimeZone = (webMapOrWebScene as any)?.originalItemTimeZone

    if (timeZoneProp) {
      // case1: user sets 'Device time zone' as timeZone in ExB
      // case2: user sets 'Specific time zone' as timeZone in ExB
      finalTimeZone = timeZoneProp
    } else if (originalItemTimeZone) {
      // user sets 'Data time zone' as timeZone in ExB
      // The webmap is a new one with timeZone.
      finalTimeZone = originalItemTimeZone
    } else {
      // user doesn't set timeZone in ExB
      // The webmap is an old one without timeZone.
      finalTimeZone = 'system'
    }

    return finalTimeZone
  }

  /**
   * This method create web map or web scene by data source. This method doesn't consider default web map case.
   * @param dataSourceInfo
   * @returns
   */
  createWebMapOrWebSceneByDataSource (dataSourceInfo: MapbaseDataSourceInfo): __esri.WebMap | __esri.WebScene {
    let webMapOrWebScene: __esri.WebMap | __esri.WebScene
    const MapClass: typeof __esri.WebMap | typeof __esri.WebScene = dataSourceInfo.isWebMap ? this.WebMap : this.WebScene

    const dataSourceJson = dataSourceInfo.dataSourceJson

    if (dataSourceJson.portalUrl) {
      // create web map or web scene for portal
      const portal = new this.Portal({
        url: portalUrlUtils.getPlatformUrlByOrgUrl(dataSourceJson.portalUrl)
      })

      webMapOrWebScene = new MapClass({
        portalItem: new this.PortalItem({
          id: dataSourceJson.itemId,
          portal: portal
        })
      })
    } else {
      // create web map or web scene for arcgis online
      webMapOrWebScene = new MapClass({
        portalItem: new this.PortalItem({
          id: dataSourceJson.itemId
        })
      })
    }

    return webMapOrWebScene
  }

  getInitViewPointForDefaultWebMap = (): __esri.Viewpoint => {
    const defaultExtent = this.props.defaultMapInfo && this.props.defaultMapInfo.defaultExtent
    let tempViewPoint
    if (this.props.baseWidgetProps.config.initialMapState && this.props.baseWidgetProps.config.initialMapState.viewPoint) {
      tempViewPoint = this.generateViewPointFromInitialMapState(this.props.baseWidgetProps.config.initialMapState)
    } else {
      tempViewPoint = new this.Viewpoint(
        {
          targetGeometry: new this.Extent({
            xmin: defaultExtent && defaultExtent.xmin,
            ymin: defaultExtent && defaultExtent.ymin,
            xmax: defaultExtent && defaultExtent.xmax,
            ymax: defaultExtent && defaultExtent.ymax,
            spatialReference: { wkid: defaultExtent.spatialReference.wkid }
          })
        }
      )
    }
    return tempViewPoint
  }

  // Get the default webmap.
  // This method will resolve when the webmap loaded.
  getDefaultWebMap (): __esri.WebMap {
    const defaultExtent = this.props.defaultMapInfo && this.props.defaultMapInfo.defaultExtent

    const tempViewPoint = new this.Viewpoint(
      {
        targetGeometry: new this.Extent({
          xmin: defaultExtent && defaultExtent.xmin,
          ymin: defaultExtent && defaultExtent.ymin,
          xmax: defaultExtent && defaultExtent.xmax,
          ymax: defaultExtent && defaultExtent.ymax,
          spatialReference: { wkid: defaultExtent.spatialReference.wkid }
        })
      }
    )

    const defaultWebmap = new this.WebMap({
      portalItem: {
        id: this.props.defaultMapInfo.defaultMapId,
        portal: {
          url: this.props.baseWidgetProps.portalUrl
        }
      },
      initialViewProperties: new this.InitialViewProperties({
        spatialReference: defaultExtent && defaultExtent.spatialReference,
        viewpoint: tempViewPoint
      })
    })

    return defaultWebmap
  }

  getMapViewOptionToCreateMapView (dataSourceInfo: MapbaseDataSourceInfo): MapViewOptions {
    let mapViewOption: MapViewOptions
    const config = this.props.baseWidgetProps.config

    const initialMapState = config.initialMapState
    const customLods = config.customLODs

    if (this.props.isDefaultMap) {
      const webmap = this.getDefaultWebMap()
      mapViewOption = {
        map: webmap,
        viewpoint: this.getInitViewPointForDefaultWebMap()
      }
    } else {
      const webmap = this.createWebMapOrWebSceneByDataSource(dataSourceInfo) as __esri.WebMap

      if (initialMapState) {
        mapViewOption = {
          map: webmap,
          viewpoint: initialMapState && this.generateViewPointFromInitialMapState(initialMapState)
        }
      } else {
        mapViewOption = {
          map: webmap,
        }
      }
    }

    const constraints: __esri.View2DConstraintsProperties = {
      // snapToZoom: true means integer zoom, false means float zoom
      // We need to set the initial value to true for backward compatibility and keep the same behavior with MapViewer
      // After map initialized, we will set snapToZoom to false to get the best synchronization between two map widgets
      snapToZoom: true
    }

    if (customLods?.lods?.length > 0) {
      const lods = customLods.lods.asMutable({ deep: true })
      constraints.lods = lods
    }

    // Don't update mapViewOption.constraints.minScale/maxScale here because the final minScale/maxScale should be calculated by lod and we can't get the lod information now.
    // In view.when() callback, we can get the lod information, so we will update constraints.minScale/maxScale in view.when() callback.
    mapViewOption.constraints = new this.MapViewConstraints(constraints)
    const isInBuilder = (window as any).jimuConfig?.isInBuilder

    if (!isInBuilder) {
      if (this.props.baseWidgetProps.queryObject[this.props.baseWidgetProps.id]) {
        const extentStr = this.props.baseWidgetProps.queryObject[this.props.baseWidgetProps.id].substr('extent='.length)
        let extent

        try {
          extent = new this.Extent(JSON.parse(extentStr))
        } catch (err) {
          console.error('Bad extent URL parameter.')
        }

        if (extent) {
          mapViewOption.extent = extent
        }
      }
    }

    return mapViewOption
  }

  getSceneViewOptionToCreateSceneView (dataSourceInfo: MapbaseDataSourceInfo): SceneViewOptions {
    const webScene = this.createWebMapOrWebSceneByDataSource(dataSourceInfo) as __esri.WebScene

    const sceneViewOption: SceneViewOptions = {
      map: webScene
    }

    const widgetConfig = this.props.baseWidgetProps.config
    const initialMapState = widgetConfig.initialMapState

    if (initialMapState) {
      sceneViewOption.viewpoint = initialMapState && this.generateViewPointFromInitialMapState(initialMapState)
    }

    const sceneQualityMode = widgetConfig.sceneQualityMode

    // If sceneQualityMode is 'low', 'medium' or 'high', we should set it to sceneViewOption.qualityProfile.
    // If sceneQualityMode is 'auto', we should not set sceneViewOption.qualityProfile because undefined means automatic.
    if (sceneQualityMode && sceneQualityMode !== SceneQualityMode.auto) {
      sceneViewOption.qualityProfile = sceneQualityMode
    }

    return sceneViewOption
  }

  private createDefaultHighlightOptionsByConfig (config: IMConfig, Color: typeof __esri.Color): __esri.HighlightOptions {
    const highlightColor = config?.selectionHighlightColor || DEFAULT_HIGHLIGHT_COLOR
    const highlightHaloColor = config?.selectionHighlightHaloColor || DEFAULT_HIGHLIGHT_HALO_COLOR
    const highlightOptions = {
      name: 'default',
      color: new Color(highlightColor),
      haloColor: new Color(highlightHaloColor)
    } as __esri.HighlightOptions
    return highlightOptions
  }

  bindMapBaseViewEvent (view: MapbaseView) {
    if (view) {
      this.releaseMapbaseViewEventHandles(view)

      view.mapBaseViewEventHandles.click = view.on('click', () => {
        this.releaseHighLightHandles(view)
      })
    }
  }

  isReadyToCreateJimuMapView (): boolean {
    const view = this.getCurrentView()

    if (view) {
      if (this.props.isDefaultMap) {
        // Don't need data source if use default map.
        return true
      } else {
        return this.mapDs && this.mapDs.id === this.props.dataSourceId
      }
    }

    return false
  }

  getJimuMapViewByView (view: MapbaseView): JimuMapView {
    if (view) {
      return MapViewManager.getInstance().getJimuMapViewByView(view)
    }

    return null
  }

  createJimuMapView () {
    if (!this.isReadyToCreateJimuMapView()) {
      return
    }

    const view = this.getCurrentView()
    const mapViewManager = MapViewManager.getInstance()
    const jimuMapViewId = view.dataSourceInfo?.jimuMapViewId

    // destroy the old JimuMapView to avoid multiple JimuMapViews
    if (jimuMapViewId) {
      const jimuMapView = mapViewManager.getJimuMapViewById(jimuMapViewId)

      if (jimuMapView?.view && jimuMapView?.view !== view) {
        mapViewManager.destroyJimuMapView(jimuMapViewId)
      }
    }

    // If dataSourceId is null, make sure it converts to empty string.
    const dataSourceId = this.props.dataSourceId || ''

    const useUrlHashLayersVisibility = this.props.baseWidgetProps.isRunAppMode

    mapViewManager.createJimuMapView({
      mapWidgetId: this.props.baseWidgetProps.id,
      dataSourceId,
      mapComponent: this.arcgisComponent,
      view,
      isEnablePopup: this.props.baseWidgetProps.config && !this.props.baseWidgetProps.config.disablePopUp,
      mapViewManager,
      useUrlHashLayersVisibility
    })

    view.when(() => {
      const jimuMapViewId = view.dataSourceInfo.jimuMapViewId
      const jimuMapView = mapViewManager.getJimuMapViewById(jimuMapViewId)

      if (jimuMapView) {
        if (jimuMapView.view) {
          jimuMapView.whenJimuMapViewLoaded().then(() => {
            if (!jimuMapView.view) {
              mapViewManager.destroyJimuMapView(jimuMapViewId)
              return
            }

            if (this.isArcgisComponentExpected(this.arcgisComponent)) {
              if (this.props.onJimuMapViewCreated) {
                this.props.onJimuMapViewCreated(jimuMapView)
              }
            }
          })
        } else {
          mapViewManager.destroyJimuMapView(jimuMapViewId)
        }
      }
    })
  }

  destroyCurrentArcgisComponent () {
    if (this.arcgisComponent) {
      this.destroyArcgisComponent(this.arcgisComponent)
    }

    // Note, don't set this.mapDs to null here.
    // Consider this case:
    // We create a new Mapbase instance, onDataSourceCreated callback is quickly, then we get this.mapDs.
    // Then componentDidMount is invoked for some reason (e.g. this.isBasicModulesLoaded changed from false to true),
    // and we need to call this method to destroy this.view.
    // So, if we set this.mapDs to null, we will never get this.mapDs,
    // and this.isReadyToCreateJimuMapView() always return false, then we can't create jimu map view.
    this.arcgisComponent = null
  }

  async destroyArcgisComponent (arcgisComponent: ArcgisComponent) {
    if (!arcgisComponent) {
      return
    }

    if (this.arcgisComponent === arcgisComponent) {
      this.arcgisComponent = null
    }

    const view = arcgisComponent.view as unknown as MapbaseView
    const jimuMapViewId = arcgisComponent.dataSourceInfo.jimuMapViewId

    if (view) {
      // release handles
      if (view.watchInteractingHandle) {
        view.watchInteractingHandle.remove()
        view.watchInteractingHandle = null
      }

      if (view.extentWatchHandle) {
        view.extentWatchHandle.remove()
        view.extentWatchHandle = null
      }

      if (view.watchLodsHandle) {
        view.watchLodsHandle.remove()
        view.watchLodsHandle = null
      }

      if (view.fatalErrorWatchHandle) {
        view.fatalErrorWatchHandle.remove()
        view.fatalErrorWatchHandle = null
      }

      if (view.stationaryTimerId) {
        clearTimeout(view.stationaryTimerId)
        view.stationaryTimerId = null
      }

      this.releaseHighLightHandles(view)

      this.releaseMapbaseViewEventHandles(view)
    }

    if (jimuMapViewId) {
      MapViewManager.getInstance().destroyJimuMapView(jimuMapViewId)
    }

    if (view && !view.destroyed) {
      view.destroy()
    }

    if (arcgisComponent.parentElement) {
      arcgisComponent.parentElement.removeChild(arcgisComponent)
    }

    try {
      await arcgisComponent.destroy?.()
    } catch (error) {
      console.warn('map component destroy error', error)
    }
  }

  releaseHighLightHandles (view: MapbaseView) {
    if (view.highLightHandles) {
      const keys = Object.keys(view.highLightHandles)

      for (const key of keys) {
        view.highLightHandles[key].remove()
      }
    }

    view.highLightHandles = {}
  }

  releaseMapbaseViewEventHandles (view: MapbaseView) {
    if (view.mapBaseViewEventHandles) {
      const keys = Object.keys(view.mapBaseViewEventHandles)

      for (const key of keys) {
        view.mapBaseViewEventHandles[key].remove()
      }
    }

    view.mapBaseViewEventHandles = {}
  }

  // reload map if webmap session changed or layer session changed
  private onStoreResourceSessionsChange (prevResourceSessions: ImmutableObject<ResourceSessions>, resourceSessions: ImmutableObject<ResourceSessions>) {
    // onStoreResourceSessionsChange will always be triggered incorrectly during the first execution of observeStore(), and we need to eliminate this situation.
    // For the first time, prevResourceSessions is undefined.
    if (!prevResourceSessions) {
      return
    }

    // When user logins, it will trigger onStoreResourceSessionsChange twice, the duration is about 10ms. So use the defer to only handle the last onStoreResourceSessionsChange.
    lodash.defer(() => {
      // There are two cases that we need to create view.
      // case1: webmap resource session changed
      //     1.1: user1 can't access the webmap, view create failed, then switch to user2, trigger onStoreResourceSessionsChange, webmap resource session changed
      //     1.2: user1 can access the webmap, view created, then switch to user2, trigger onStoreResourceSessionsChange again, webmap resource session changed
      // case2: layer resource session changed
      //        user1 can access the webmap, view created, then switch to user2, trigger onStoreResourceSessionsChange again, layer resource session changed

      if (!this.expectedDataSourceInfo) {
        return
      }

      if (this.mapCreatingInfo) {
        return
      }

      const view = this.getCurrentView()

      if (view) {
        // don't destroy a creating view, otherwise will get unexpected behavior, see #29049
        if (!view.isViewWhenReady) {
          return
        }

        if (view.isInCaching) {
          return
        }
      }

      // check case1
      let case1 = false
      let portalUrl

      if (this.expectedDataSourceInfo.isDefaultMap) {
        portalUrl = this.props.baseWidgetProps?.portalUrl
      } else {
        portalUrl = this.expectedDataSourceInfo.dataSourceJson?.portalUrl
      }

      if (portalUrl) {
        portalUrl = portalUrlUtils.getPlatformUrlByOrgUrl(portalUrl)
      }

      const standardPortalUrl = portalUrl ? portalUrlUtils.getStandardPortalUrl(portalUrl) : ''

      if (standardPortalUrl) {
        const preUser = prevResourceSessions?.[standardPortalUrl] || ''
        const currUser = resourceSessions?.[standardPortalUrl] || ''
        case1 = preUser !== currUser
      }

      // check case2
      let case2 = false

      if (view && view.isViewWhenReady && this.isArcgisComponentExpected(this.arcgisComponent)) {
        const allLayers = view.map?.allLayers?.toArray() || []

        if (allLayers.length > 0) {
          const serviceManager = ServiceManager.getInstance()

          // If any layer's session changes, the map needs to be reloaded.
          // Note, we need to check all layers here, not only failed layers.
          const isSomeLayerSessionChanged = allLayers.some(layer => {
            const layerUrl = (layer as any)?.url

            if (!layerUrl) {
              return false
            }

            const serviceOwningSystemUrl = serviceManager.getServerInfoByServiceUrl(layerUrl)?.owningSystemUrl
            const serverRootUrl = serviceUrlUtils.getServerRootUrl(layerUrl)
            const serviceStandardPlatformUrl = portalUrlUtils.getStandardPortalUrl(serviceOwningSystemUrl || serverRootUrl)

            if (!serviceStandardPlatformUrl) {
              return false
            }

            const preUser = prevResourceSessions?.[serviceStandardPlatformUrl] || ''
            const currUser = resourceSessions?.[serviceStandardPlatformUrl] || ''

            if (preUser !== currUser) {
              // session changed for layer, need to reload map
              // need to reload map even though preUser is not empty and currUser is empty
              return true
            }

            return false
          })

          case2 = isSomeLayerSessionChanged
        }
      }

      const jimuMapView = view ? this.getJimuMapViewByView(view) : null
      const jimuMapViewId = jimuMapView?.id

      const needRecreateMap = case1 || case2

      if (needRecreateMap) {
        const mapWidgetId = this.props?.baseWidgetProps?.widgetId
        console.log(`create map because resource session changed, mapWidgetId: ${mapWidgetId}, jimuMapViewId: ${jimuMapViewId}`)
        this.destroyCurrentArcgisComponent()
        // set checkFailedUniqueId to false for forced update
        const checkFailedUniqueId = false
        this.cacheLoadModulesAndCreateArcgisComponent(this.expectedDataSourceInfo, checkFailedUniqueId)
      }
    })
  }

  /**
   * onDataSourceCreated and onCreateDataSourceFailed will not invoked when this.props.isWebMap is true
   * @param dataSource
   */
  onDataSourceCreated = (dataSource: WebMapDataSource | WebSceneDataSource): void => {
    if (dataSource.id === this.props.dataSourceId) {
      delete this.createFailedDataSourceIds[this.props.dataSourceId]
      this.mapDs = dataSource

      if (this.isReadyToCreateJimuMapView()) {
        this.createJimuMapView()
      }
    }
  }

  onCreateDataSourceFailed = (err): void => {
    console.warn('onCreateDataSourceFailed', err)
    this.mapDs = null
    const dsId = this.props.dataSourceId
    this.createFailedDataSourceIds[dsId] = true

    this.setState({
      mapLoadStatus: MapLoadStatus.LoadError
    }, () => {
      this.props.onMapLoaded(dsId, MapLoadStatus.LoadError)
    })
  }

  getRestoreDataFromMS (): MapbaseRestoreData {
    const basicKey = this.getRestoreDataKey()
    const restoreData = MutableStoreManager.getInstance().getStateValue([this.props.baseWidgetProps.id, 'restoreData', basicKey]) as MapbaseRestoreData
    return restoreData
  }

  updateRestoreDataToMS (restoreData: MapbaseRestoreData) {
    const basicKey = this.getRestoreDataKey()
    MutableStoreManager.getInstance().updateStateValue(this.props.baseWidgetProps.id, `restoreData.${basicKey}`, restoreData)
  }

  getRestoreDataKey () {
    return `${this.props.baseWidgetProps.id}-restoreData-${this.props.dataSourceId}`
  }

  // This method is used to sync viewpoint between two mapbase of same map widget.
  setViewPoint = (viewPoint: __esri.Viewpoint): void => {
    const view = this.getCurrentView()

    if (view && viewPoint) {
      view.viewpoint = viewPoint.clone()
    }
  }

  // This method is used to sync viewpoint between two mapbase of same map widget.
  getViewPoint = (): __esri.Viewpoint => {
    const view = this.getCurrentView()
    return view && view.viewpoint ? view.viewpoint.clone() : null
  }

  getMapLoadStatus = (): MapLoadStatus => {
    return this.state.mapLoadStatus
  }

  getViewType = (): string => {
    return this.getDsJsonFromDsId(this.props.dataSourceId).type
  }

  /**
   * This method is called when user clicks the map thumbnail in map setting page and change the config.initialMapDataSourceID.
   * @param useAnimation
   */
  async goHome (useAnimation?: boolean): Promise<void> {
    if (!this.getDsJsonFromDsId(this.props.dataSourceId)) {
      return
    }

    const widgets = getAppStore().getState().appConfig.widgets
    const view = this.getCurrentView()

    if (view && widgets[this.props.baseWidgetProps.id]) {
      const initViewPoint = this.getMapBaseInitViewPoint()

      if (initViewPoint) {
        // TODO: maybe need to set view.constraints.snapToZoom to true before call view.goTo() and reset it to false after view.goTo() is done.
        return view.goTo(initViewPoint, {
          animate: useAnimation
        })
      }
    }
  }

  getMapBaseInitViewPoint (): __esri.Viewpoint {
    if (this.props.isDefaultMap) {
      return this.getInitViewPointForDefaultWebMap()
    } else {
      const initialMapState = this.props.baseWidgetProps.config.initialMapState

      if (initialMapState) {
        return this.generateViewPointFromInitialMapState(initialMapState)
      } else {
        const view = this.getCurrentView()

        if (view) {
          const map = view.map as __esri.WebMap | __esri.WebScene
          return map?.initialViewProperties?.viewpoint?.clone()
        }
      }
    }
  }

  formatMessage (id: string) {
    return this.props.baseWidgetProps.intl.formatMessage({ id: id, defaultMessage: defaultMessages[id] })
  }

  handleDisableWheel () {
    this.widgetContainer.style.pointerEvents = 'none'
    setTimeout(() => {
      this.widgetContainer.style.pointerEvents = 'auto'
    }, 50)
  }

  getMapSwitchForErrorMap () {
    return (
      <MultiSourceMapContext.Consumer>
        {({ isShowMapSwitchBtn, dataSourceIds, activeDataSourceId, switchMap }) => (
          <div
            className='mapswitch-container' style={{
              display: isShowMapSwitchBtn ? 'block' : 'none',
              marginBottom: this.props.widthBreakpoint === 'xsmall' ? 10 : 0
            }}
          >
            <div onClick={(e) => { e.preventDefault(); switchMap() }} className='w-100 h-100 esri-widget--button-like'>
              <Icon icon={Exchange} width={16} height={16} className='mapswitch-icon' />
            </div>
          </div>
        )}
      </MultiSourceMapContext.Consumer>
    )
  }

  queryExtentFromSingleLayerQueryParams = async (dataSourceId: string): Promise<QueryExtentInfo> => {
    const dataSource = this.dsManager.getDataSource(dataSourceId) as FeatureLayerDataSource
    const queryParams: SqlQueryParams = dataSource.getCurrentQueryParams()
    let layerObjectPromise

    if (dataSource?.layer) {
      layerObjectPromise = Promise.resolve(dataSource.layer)
    } else {
      layerObjectPromise = dataSource.createJSAPILayerByDataSource().then((layerObject) => Promise.resolve(layerObject))
    }

    const modules = await loadArcGISJSAPIModules([
      'esri/rest/support/Query',
      'esri/Graphic',
      'esri/geometry/Point'
    ])

    const [Query, Graphic, Point] = modules
    const query = new Query()
    query.where = queryParams?.where

    const layerObject = await layerObjectPromise

    // layerObject maybe SubtypeSublayer, SubtypeSublayer doesn't support queryExtent() method, so don't call layerObject.queryExtent(query) directly.
    // Instead, we use layerQueryExtent(layerObject, query) here.
    // layerQueryExtent is a wrapper of layer.queryExtent() method and it also supports SubtypeSublayer although SubtypeSublayer doesn't support layer.queryExtent() method.
    const queryResult = await layerQueryExtent(layerObject, query)
    const extent = queryResult?.extent
    const isValidExtent = extent && (typeof extent.xmin === 'number') && (typeof extent.xmax === 'number') && (typeof extent.ymin === 'number') && (typeof extent.ymax === 'number')
    let result: QueryExtentInfo

    if (isValidExtent) {
      // most cases
      const extentCenter = extent?.center
      let singlePointGraphic: __esri.Graphic = null

      if (queryResult?.count === 1 && (layerObject.geometryType === 'point') && extentCenter) {
        const point = new Point({
          x: extentCenter.x,
          y: extentCenter.y,
          spatialReference: extent.spatialReference
        })

        singlePointGraphic = new Graphic({ geometry: point })
      }

      result = {
        extent: extent,
        singlePointGraphic,
        count: queryResult?.count,
        layer: layerObject
      }
    } else {
      // special case
      result = {
        extent: null,
        singlePointGraphic: null,
        count: 0,
        layer: layerObject
      }
    }

    return result
  }

  queryExtentFromQueryParams = async (mapBaseView: MapbaseView, filterChangedDataSourceIds: string[], useDataSourceIds: string[]): Promise<QueryExtentInfo> => {
    // use default extent if all merged SQLs on data source is removed.
    const useDefaultExtentOfCurrentView = !useDataSourceIds.some(useDataSourceId => {
      // Note, we only use ds.getRuntimeQueryParams() method instead of ds.getRealQueryParams() to check runtime SQL.
      const dsView = this.dsManager.getDataSource(useDataSourceId) as FeatureLayerDataSource
      const dsViewQueryParams: SqlQueryParams = dsView.getRuntimeQueryParams()
      const dsViewHasQueryWhere = dsViewQueryParams?.where && dsViewQueryParams.where !== '1=1'

      // finalHasQueryWhere = dsViewHasQueryWhere || mainDsHasQueryWhere
      // So, we should also check mainDsHasQueryWhere.
      let finalHasQueryWhere = dsViewHasQueryWhere

      if (dsView.isDataView && !finalHasQueryWhere) {
        const mainDs = dsView.getMainDataSource() as FeatureLayerDataSource
        const mainDsQueryParams: SqlQueryParams = mainDs?.getRuntimeQueryParams()
        const mainDsHasQueryWhere = mainDsQueryParams?.where && mainDsQueryParams.where !== '1=1'

        if (mainDsHasQueryWhere) {
          finalHasQueryWhere = true
        }
      }

      if (finalHasQueryWhere) {
        return true
      } else {
        return false
      }
    })

    if (useDefaultExtentOfCurrentView) {
      const initViewPoint = this.getMapBaseInitViewPoint()
      return {
        viewpoint: initViewPoint,
        extent: null,
        useDefaultExtentOfCurrentView: true,
        singlePointGraphic: null,
        count: 2,
        layer: null
      }
    }

    const extentResultPromises: Array<Promise<QueryExtentInfo>> = []
    filterChangedDataSourceIds.forEach(dataSourceId => {
      extentResultPromises.push(this.queryExtentFromSingleLayerQueryParams(dataSourceId))
    })

    let extentInfos = await Promise.all(extentResultPromises)

    if (!extentInfos) {
      extentInfos = []
    }

    extentInfos = extentInfos.filter(extentInfo => !!(extentInfo?.extent))

    if (extentInfos.length === 0) {
      return null
    } else if (extentInfos.length === 1) {
      return extentInfos[0]
    } else {
      let count = 0

      const extents: __esri.Extent[] = []
      extentInfos.forEach(result => {
        if (result.extent) {
          extents.push(result.extent)
        }

        count = count + result.count
      })

      const fullExtent = await unionExtentsWithDifferentSpatialReference(extents, mapBaseView.spatialReference)

      return {
        extent: fullExtent,
        singlePointGraphic: null,
        count: count,
        layer: null
      }
    }
  }

  /**
   * handle message/action.
   */
  handleAction (mutableStateProps: ActionRelatedProps, mapBaseView: MapbaseView, jimuMapView: JimuMapView) {
    if (!mapBaseView || mapBaseView.destroyed) {
      return
    }

    // consume mutableStateProps.zoomToFeatureActionValue
    this.handleActionForZoomToFeatureActionValue(mutableStateProps, mapBaseView)

    // consume mutableStateProps.panToActionValue
    this.handleActionForPanToActionValue(mutableStateProps, mapBaseView)

    // consume flashActionValue and filterActionValue
    this.handleActionForFlashActionValueAndFilterActionValue(mutableStateProps, mapBaseView)

    // handle show data on map action
    this.handleActionForShowOnMapDatas(mutableStateProps, jimuMapView)

    // handle add data to map action
    this.handleActionForAddToMapDatas(mutableStateProps, jimuMapView)

    // handle add marker data action
    this.handleActionForAddMarker(mutableStateProps, jimuMapView)
  }

  getExtentChangeRelatedWidgetIdsOfView (view: MapbaseView): string[] {
    let result: string[] = []

    if (view) {
      const relatedWidgetIds = view.extentChangeRelatedWidgetIds || []
      // We need to clone the relatedWidgetIds.
      result = relatedWidgetIds.slice()
    }

    return result
  }

  setExtentChangeRelatedWidgetIdsForView (view: MapbaseView, _relatedWidgetIds: string[]): void {
    if (view) {
      const relatedWidgetIds = _relatedWidgetIds || []
      // We need to clone the relatedWidgetIds.
      view.extentChangeRelatedWidgetIds = relatedWidgetIds.slice()
    }
  }

  tryFatalErrorRecovery (view: MapbaseView) {
    if (view) {
      view.tryFatalErrorRecovery()
    }
  }

  async handleActionForZoomToFeatureActionValue (mutableStateProps: ActionRelatedProps, mapBaseView: MapbaseView): Promise<void> {
    if (!mutableStateProps.zoomToFeatureActionValue) {
      return
    }

    const receiveMessageTime = Date.now()
    const jimuMapView = this.getJimuMapViewByView(mapBaseView)
    const zoomToFeatureActionValue = mutableStateProps.zoomToFeatureActionValue
    const relatedWidgetIds: string[] = mutableStateProps.zoomToFeatureActionValue.relatedWidgets || []

    if (relatedWidgetIds && relatedWidgetIds.includes(this.props.baseWidgetProps.id)) {
      // avoid endless loop
      this.props.onMutableStatePropsChanged(this.props.dataSourceId, 'zoomToFeatureActionValue', null)
    } else {
      const zoomToFeatureInternalValue = zoomToFeatureActionValue.value

      if (zoomToFeatureInternalValue.type === 'zoom-to-extent') {
        // ZoomToExtentInternalValue

        const nowTime = Date.now()

        mapBaseView.lastZoomToExtentTime = nowTime

        // map widget1 extent changes and map widget2 needs to sync the extent by message action.
        // Finally, it calls view.goTo(extent)

        // Consider this case:
        // On app load:
        // 1. Both map widget1 and map widget2 set zoom-to action for each other.
        // 2. The initial extent of map widget1 is extent1 and the initial extent of map widget2 is extent2.
        // 3. map widget1 first publish extent-change message after the view is ready.
        // 4. Then map widget2 publish extent-change message.
        // 5. Then map widget2 receive message from map widget1 and call handleAction.
        // 6. Then map widget1 receive message from map widget2 and call handleAction.
        // At last, the extent of map widget1 is extent2 and the extent of map widget2 is extent1. This is not the expected result.
        // To avoid the above case, we need to stop the step6 because map widget1 first publish message.
        let isAboveCase = false

        if (mapBaseView.firstPublishExtentChangeTime) {
          if ((nowTime - mapBaseView.firstPublishExtentChangeTime) <= 2000) {
            if (mapBaseView.firstPublishExtentChangeTime <= zoomToFeatureInternalValue.publishTime) {
              if (!zoomToFeatureInternalValue.interactive) {
                // #14391, if extentMessage.interactive is true, means the extent comes from a interacting map and needs to sync viewpoint with the interacting map
                if (isTwoWidgetsMutuallyExtentChange(this.props.baseWidgetProps.id, zoomToFeatureInternalValue.publishWidgetId)) {
                  isAboveCase = true
                }
              }
            }
          }
        }

        // If mapBaseView is the last interactive view, it means mapBaseView is the extent-change source, we should ignore the zoom-to-extent message.
        if (!isAboveCase && mapBaseView !== MapBase.lastInteractiveView) {
          const viewpoint = zoomToFeatureInternalValue.viewpoint
          const extent = zoomToFeatureInternalValue.extent
          const stationary = zoomToFeatureInternalValue.stationary

          this.setExtentChangeRelatedWidgetIdsForView(mapBaseView, relatedWidgetIds)

          const viewSR = mapBaseView.spatialReference

          // viewpoint has high priority than extent, because it contains more information
          if (viewpoint) {
            // update view by viewpoint
            if (isNeedProjectViewpoint(viewpoint, viewSR)) {
              if (stationary) {
                // only project the viewpoint when map is static
                projectViewpoint(viewpoint, viewSR).then((projectedViewpoint) => {
                  // Consider this case(#16423):
                  // 1. handleActionForZoomToFeatureActionValue receive message at time1, the message viewpoint is viewpoint1
                  // 2. the viewpoint needs to be project, then send http request to project the viewpoint1, this async step maybe take long time
                  // 3. then JimuMapView needs to update viewpoint to viewpoint2 by url data_id (sync step) in JimuMapView.moveFeatureToCenter() at time2
                  // 4. then the async step2 is done at time3, and update viewpoint by the projected viewpoint1, finally the viewpoint is the projected viewpoint1
                  // The step4 is wrong, because viewpoint2 of step3 is the new one, and the projected viewpoint1 is stale.
                  // To avoid this case, we should check projectedViewpoint is fresh or stale.

                  const isProjectedViewpointStale = mapBaseView.receiveMessageTimeOfLastViewUpdate && mapBaseView.receiveMessageTimeOfLastViewUpdate > receiveMessageTime

                  if (!isProjectedViewpointStale) {
                    mapBaseView.viewpoint = projectedViewpoint
                  }
                })
              }
            } else {
              mapBaseView.viewpoint = viewpoint
            }
          } else {
            // TODO: need to remove the following extent logic
            // update view by extent
            if (isNeedProjectSpatialReference(extent.spatialReference, viewSR)) {
              if (stationary) {
                // only project the extent when map is static
                projectGeometries([extent], viewSR).then((projectedGeometries) => {
                  const projectedExtent = projectedGeometries[0] as __esri.Extent
                  mapBaseView.goTo(projectedExtent)
                })
              }
            } else {
              mapBaseView.goTo(extent, { animate: false })
            }
          }
        }
      } else if (zoomToFeatureInternalValue.type === 'zoom-to-query-params') {
        // ZoomToQueryParamsInternalValue

        // use default extent if all merged SQLs on data source is removed.
        this.queryExtentFromQueryParams(mapBaseView, zoomToFeatureInternalValue.filterChangedDataSourceIds, zoomToFeatureInternalValue.useDataSourceIds).then((result) => {
          if (!result) {
            return
          }

          let target
          if (result.count === 0) {
            return
          } else if (result.count === 1 && result?.singlePointGraphic) {
            target = {
              graphics: [result?.singlePointGraphic],
              layer: result?.layer
            }
          } else {
            target = result?.extent
          }

          this.setExtentChangeRelatedWidgetIdsForView(mapBaseView, relatedWidgetIds)

          // zoomToUtils does not support viewpoint, so use view.goTo() method here.
          if (result.useDefaultExtentOfCurrentView) {
            mapBaseView.goTo(result.viewpoint)
          } else {
            zoomToUtils.zoomTo(mapBaseView, target, zoomToFeatureInternalValue.zoomToOption)
          }
        })
      } else if (zoomToFeatureInternalValue.type === 'zoom-to-array-graphics') {
        // ZoomToArrayGraphicsInternalValue

        this.setExtentChangeRelatedWidgetIdsForView(mapBaseView, relatedWidgetIds)

        if (zoomToFeatureInternalValue.arrayFeatures?.length > 0) {
          zoomToUtils.zoomTo(mapBaseView, zoomToFeatureInternalValue.arrayFeatures, zoomToFeatureInternalValue.zoomToOption)
        }
      } else if (zoomToFeatureInternalValue.type === 'zoom-to-layers') {
        // ZoomToLayersInternalValue

        const dataSourceIds = zoomToFeatureInternalValue.dataSourceIds
        getLayersFromDataSourceIds(dataSourceIds).then(layers => {
          this.setExtentChangeRelatedWidgetIdsForView(mapBaseView, relatedWidgetIds)
          zoomToUtils.zoomTo(mapBaseView, layers, zoomToFeatureInternalValue.zoomToOption)
        })
      } else if (zoomToFeatureInternalValue.type === 'zoom-to-map-initial-extent') {
        // zoom to initial map extent
        const initialViewpoint = this.getMapBaseInitViewPoint()

        if (initialViewpoint) {
          this.setExtentChangeRelatedWidgetIdsForView(mapBaseView, relatedWidgetIds)
          // zoomToUtils does not support viewpoint, so use view.goTo() method here.
          mapBaseView.goTo(initialViewpoint)
        }
      } else if (zoomToFeatureInternalValue.type === 'zoom-to-features-extent') {
        // zoom to the extent of features
        const extentFunc = zoomToFeatureInternalValue.extent

        if (extentFunc) {
          let target: __esri.Extent | __esri.Graphic = null

          if (typeof extentFunc === 'function') {
            try {
              if (jimuMapView) {
                target = await extentFunc(jimuMapView)
              }
            } catch (e) {
              console.error('can not get extent by extent function', e)
            }
          } else {
            target = extentFunc
          }

          if (target) {
            const isExtent = target?.declaredClass === 'esri.geometry.Extent'
            const isGraphic = target?.declaredClass === 'esri.Graphic'

            if (isExtent || isGraphic) {
              let finalTarget: __esri.Extent | __esri.Graphic[] = null

              if (isExtent) {
                finalTarget = target as __esri.Extent
              } else if (isGraphic) {
                finalTarget = [target as __esri.Graphic]
              }

              if (finalTarget) {
                this.setExtentChangeRelatedWidgetIdsForView(mapBaseView, relatedWidgetIds)
                const scale = zoomToFeatureInternalValue.zoomToOption?.scale
                let zoomToOption: ZoomToOptions = null

                if (typeof scale === 'number' && scale >= 0) {
                  zoomToOption = {
                    scale
                  }
                }

                zoomToUtils.zoomTo(mapBaseView, finalTarget, zoomToOption)
              }
            }
          }
        }
      } else if (zoomToFeatureInternalValue.type === 'zoom-to-graphics') {
        // ZoomToGraphicsInternalValue
        // case1: If zoomToFeatureInternalValue.features is not empty, map will zoom to zoomToFeatureInternalValue.features.
        // case2: If zoomToFeatureInternalValue.features is empty, map will zoom to zoomToFeatureInternalValue.dataSourceId.
        // zoomToUtils.zoomTo() can handle the above two cases.
        const originalGraphics = zoomToFeatureInternalValue.features || []

        if (originalGraphics.length > 0 || zoomToFeatureInternalValue.dataSourceId) {
          const dataSource = this.dsManager.getDataSource(zoomToFeatureInternalValue.dataSourceId) as unknown as JSAPILayerMixin & FeatureLayerDataSource
          let layer: __esri.Layer | ArcGISSubLayer = null

          if (dataSource) {
            if (dataSource.layer) {
              layer = dataSource.layer
            } else if (dataSource.createJSAPILayerByDataSource) {
              layer = await dataSource.createJSAPILayerByDataSource()
            }
          }

          const handledGraphics = await processZoomToFeatures(mapBaseView, layer, originalGraphics)

          let zoomToTarget

          if (layer) {
            zoomToTarget = {
              layer,
              graphics: handledGraphics
            }
          } else {
            zoomToTarget = handledGraphics
          }

          if (!zoomToFeatureInternalValue.zoomToOption) {
            zoomToFeatureInternalValue.zoomToOption = {}
          }

          this.setExtentChangeRelatedWidgetIdsForView(mapBaseView, relatedWidgetIds)
          zoomToFeatureInternalValue.zoomToOption.queryParams = (dataSource?.getCurrentQueryParams && dataSource.getCurrentQueryParams()) || ''
          zoomToUtils.zoomTo(mapBaseView, zoomToTarget, zoomToFeatureInternalValue.zoomToOption)
        }
      }

      this.props.onMutableStatePropsChanged(this.props.dataSourceId, 'zoomToFeatureActionValue', null)
    }
  }

  handleActionForPanToActionValue (mutableStateProps: ActionRelatedProps, mapBaseView: MapbaseView): void {
    if (!mutableStateProps.panToActionValue) {
      return
    }

    const relatedWidgetIds: string[] = mutableStateProps.panToActionValue.relatedWidgets || []
    const panToType = mutableStateProps.panToActionValue.value?.type

    if (relatedWidgetIds && relatedWidgetIds.includes(this.props.baseWidgetProps.id)) {
      // avoid endless loop
      this.props.onMutableStatePropsChanged(this.props.dataSourceId, 'panToActionValue', null)
    } else if (panToType === 'pan-to-query-params') {
      const panToValue = mutableStateProps.panToActionValue.value
      // use default extent if all merged SQLs on data source is removed.
      this.queryExtentFromQueryParams(mapBaseView, panToValue.filterChangedDataSourceIds, panToValue.useDataSourceIds).then((result) => {
        if (!result) {
          return
        }

        // Because of 'panToGeometry' method does not support 'viewpoint', temporary code for using default viewpoint of sceneView.
        if (result.useDefaultExtentOfCurrentView) {
          const targetGeometry = result?.viewpoint?.camera?.position || result?.viewpoint?.targetGeometry
          this.panToGeometry([targetGeometry], mapBaseView, relatedWidgetIds)
        } else {
          this.panToGeometry([result?.extent], mapBaseView, relatedWidgetIds)
        }
      })
    } else if (panToType === 'pan-to-layer') {
      const panToValue = mutableStateProps.panToActionValue.value
      const dataSource = this.dsManager.getDataSource(panToValue.dataSourceId) as unknown as JSAPILayerMixin & FeatureLayerDataSource
      let layerPromise

      if (dataSource?.layer) {
        layerPromise = Promise.resolve(dataSource.layer)
      } else if (dataSource?.createJSAPILayerByDataSource) {
        layerPromise = dataSource.createJSAPILayerByDataSource()
      } else {
        layerPromise = Promise.resolve(null)
      }

      layerPromise.then(layer => {
        let queryParams = null

        if (dataSource) {
          if (dataSource.getCurrentQueryParams) {
            queryParams = dataSource.getCurrentQueryParams()
          }
        }

        zoomToUtils.layerExtent(mapBaseView, layer, queryParams).then(layerExtent => {
          if (layerExtent) {
            this.panToGeometry([layerExtent], mapBaseView, [])
          }
        })
      })
    } else if (panToType === 'pan-to-layers') {
      const panToValue = mutableStateProps.panToActionValue.value
      const dataSourceIds = panToValue.dataSourceIds
      getLayersFromDataSourceIds(dataSourceIds).then(layers => {
        const extentPromises = []
        layers.forEach(layer => {
          if (layer) {
            extentPromises.push(zoomToUtils.layerExtent(mapBaseView, layer))
          }
        })

        let fullExtent = null
        return Promise.all(extentPromises).then(extents => {
          extents.forEach(extent => {
            if (extent) {
              fullExtent = fullExtent ? fullExtent.union(extent) : extent
            }
          })
          if (fullExtent) {
            this.panToGeometry([fullExtent], mapBaseView, [])
          }
        })
      })
    } else if (panToType === 'pan-to-geometries') {
      const panToValue = mutableStateProps.panToActionValue.value
      this.panToGeometry(panToValue.geometries, mapBaseView, relatedWidgetIds)
    } else if (panToType === 'pan-to-map-initial-extent') {
      const initialViewpoint = this.getMapBaseInitViewPoint()

      if (initialViewpoint) {
        this.setExtentChangeRelatedWidgetIdsForView(mapBaseView, relatedWidgetIds)
        mapBaseView.goTo(initialViewpoint)
      }
    } else if (panToType === 'pan-to-extent') {
      // map widget1 extent changes and map widget2 needs to sync the extent by message action.
      // Finally, it calls view.goTo(extent.center).

      // Consider this case:
      // 1. Both map widget1 and map widget2 set pan-to action for each other.
      // 2. The initial extent of map widget1 is extent1 and the initial extent of map widget2 is extent2.
      // 3. map widget1 first publish extent-change message after the view is ready.
      // 4. Then map widget2 publish extent-change message.
      // 5. Then map widget2 receive message from map widget1 and call handleAction.
      // 6. Then map widget1 receive message from map widget2 and call handleAction.
      // At last, the extent of map widget1 is extent2 and the extent of map widget2 is extent1. This is not the expected result.
      // To avoid the above case, we need to stop the step6 because map widget1 first publish message.
      let isAboveCase = false
      const nowTime = Date.now()

      if (mapBaseView.firstPublishExtentChangeTime) {
        if ((nowTime - mapBaseView.firstPublishExtentChangeTime) <= 2000) {
          if (mapBaseView.firstPublishExtentChangeTime <= mutableStateProps.panToActionValue.value.publishTime) {
            if (isTwoWidgetsMutuallyExtentChange(this.props.baseWidgetProps.id, mutableStateProps.panToActionValue.value.publishWidgetId)) {
              isAboveCase = true
            }
          }
        }
      }

      // Consider this case:
      // 1. We have 4 map widgets. Here are the actions.
      // 2. Widget1 -> zoom to -> Widget2 -> zoom to -> Widget4
      // 3. Widget1 -> zoom to -> Widget3 -> pan to -> Widget4
      // 4. We move the map of widget1, finally widget4 will receive zoomTo and panTo actions serially, like zoomTo, panTo, zoomTo, panTo, ...
      // 5. Step4 will result in widget4's map view jumping.
      // 6. To avoid this case, we need to stop executing panTo action if zoomTo action is executed recently.
      let isPanZoomConflictCase = false

      if (mapBaseView.lastZoomToExtentTime) {
        // By test, the biggest delta time is about 200ms in most cases, but it is safe to use a bigger one.
        if ((nowTime - mapBaseView.lastZoomToExtentTime) <= 500) {
          isPanZoomConflictCase = true
        }
      }

      // If mapBaseView is the last interactive view, it means mapBaseView is the extent-change source, we should ignore the pan-to-extent message.
      if (!isAboveCase && !isPanZoomConflictCase && mapBaseView !== MapBase.lastInteractiveView) {
        this.setExtentChangeRelatedWidgetIdsForView(mapBaseView, relatedWidgetIds)
        const panToValue = mutableStateProps.panToActionValue.value
        const extent = panToValue.geometries[0]
        const extentCenter = extent.center
        const stationary = panToValue.stationary
        const viewSR = mapBaseView.spatialReference

        if (isNeedProjectSpatialReference(extentCenter.spatialReference, viewSR)) {
          if (stationary) {
            // only project the extent when map is static
            projectGeometries([extentCenter], viewSR).then((projectedGeometries) => {
              const projectedCenter = projectedGeometries[0] as __esri.Point
              mapBaseView.goTo(projectedCenter)
            })
          }
        } else {
          // mapBaseView.goTo(extentCenter, { animate: false })
          mapBaseView.center = extentCenter
        }
      }
    }

    this.props.onMutableStatePropsChanged(this.props.dataSourceId, 'panToActionValue', null)
  }

  panToGeometry (originalGeometries: __esri.Geometry[], mapBaseView: MapbaseView, relatedWidgetIds: string[]): void {
    projectGeometries(originalGeometries, mapBaseView.spatialReference).then((projectedGeometries) => {
      this.setExtentChangeRelatedWidgetIdsForView(mapBaseView, relatedWidgetIds)
      // projectedGeometries maybe empty array
      // If projectedGeometries is empty array, mapPanto will not change extent
      mapPanto(mapBaseView, projectedGeometries)
    })
  }

  handleActionForFlashActionValueAndFilterActionValue (mutableStateProps: ActionRelatedProps, mapBaseView: MapbaseView): void {
    const mutableStatePropsKeys = Object.keys(mutableStateProps)
    // WHY: why use array.some() here ? the callback always return false
    mutableStatePropsKeys.some(actionKey => {
      const jimuMapViewId = mapBaseView.dataSourceInfo.jimuMapViewId
      const tempJimuMapView = MapViewManager.getInstance().getJimuMapViewById(jimuMapViewId)

      // handle flash action
      if (actionKey.indexOf('flashActionValue-') === 0 && mutableStateProps[actionKey]) {
        mutableStateProps[actionKey].querySQL && flashFeaturesByQuery(tempJimuMapView, mutableStateProps[actionKey].layerDataSourceId, mutableStateProps[actionKey].querySQL)
        this.props.onMutableStatePropsChanged(this.props.dataSourceId, actionKey, null)
      }

      // handle filter action
      if (actionKey.indexOf('filterActionValue-') === 0 && mutableStateProps[actionKey]) {
        mutableStateProps[actionKey].querySQL?.length >= 0 && filterFeaturesByQuery(tempJimuMapView, mutableStateProps[actionKey].layerDataSourceId, mutableStateProps[actionKey].querySQL)
        this.props.onMutableStatePropsChanged(this.props.dataSourceId, actionKey, null)
      }

      return false
    })
  }

  handleActionForShowOnMapDatas (mutableStateProps: ActionRelatedProps, jimuMapView: JimuMapView): void {
    if (mutableStateProps.showOnMapDatas) {
      jimuMapView.handleShowOnMapAction(mutableStateProps.showOnMapDatas)
    }
  }

  handleActionForAddToMapDatas (mutableStateProps: ActionRelatedProps, jimuMapView: JimuMapView): void {
    if (mutableStateProps.addToMapDatas) {
      jimuMapView.handleAddToMapAction(mutableStateProps.addToMapDatas)
    }
  }

  async handleActionForAddMarker (mutableStateProps: ActionRelatedProps, jimuMapView: JimuMapView): Promise<void> {
    const markerGroup = mutableStateProps?.addMarkerData


    // only add markers for active JimuMapView
    if (jimuMapView && jimuMapView.isActive && markerGroup) {
      const mapView = jimuMapView.view
      const map = mapView?.map

      if (!map) {
        return
      }

      const pointGraphics = markerGroup?.graphics || []
      const widgetId = this.props.baseWidgetProps.id

      const mutableStoreManager = MutableStoreManager.getInstance()
      mutableStoreManager.updateStateValue(widgetId, 'addMarkerData', null)

      if (pointGraphics?.length > 0) {
        await jimuMapView.addMarkers([markerGroup])
        jimuMapView.updateMarkerUrlParamIfActive()

        const firstGeometry = pointGraphics[0]?.geometry
        const shouldPanTo = pointGraphics.length === 1 && firstGeometry?.type === 'point'

        if (shouldPanTo) {
          // pan to single marker
          mapView.goTo(firstGeometry)
        } else {
          // zoom to multiple markers
          zoomToUtils.zoomTo(mapView, pointGraphics, {
            padding: {
              left: 50,
              right: 50,
              top: 50,
              bottom: 50
            }
          })
        }

        // update mutable store to trigger rerendering clear-data-action
        mutableStoreManager.updateStateValue(widgetId, 'updateRender', Date.now())
      }
    }
  }

  listenToPostMessages () {
    this.releasePostMessageHandles()

    const handle1 = listenToPostMessage(ListenMessageType.ExbChangeExtent, (message: ChangeExtentListenMessage) => {
      if (this.shouldHandlePostMessage(message)) {
        this.handlePostMessageExbChangeExtent(message)
      }
    })

    const handle2 = listenToPostMessage(ListenMessageType.ExbZoomTo, (message: ZoomToListenMessage) => {
      if (this.shouldHandlePostMessage(message)) {
        this.handlePostMessageExbZoomTo(message)
      }
    })

    const handle3 = listenToPostMessage(ListenMessageType.ExbPanTo, (message: PanToListenMessage) => {
      if (this.shouldHandlePostMessage(message)) {
        this.handlePostMessageExbPanTo(message)
      }
    })

    this.postMessageHandles = [handle1, handle2, handle3]
  }

  shouldHandlePostMessage (message: ListenMessage): boolean {
    const mapWidgetId = this.props.baseWidgetProps.id
    const view = this.getCurrentView()

    if (mapWidgetId && (message as any)?.mapWidgetId === mapWidgetId && !this.__unmount && view && !view.destroyed && !view.isInCaching && view.isViewWhenReady) {
      const jimuMapView = this.getJimuMapViewByView(view)

      if (jimuMapView && jimuMapView.isActive) {
        return true
      }
    }

    return false
  }

  releasePostMessageHandles () {
    if (this.postMessageHandles?.length > 0) {
      this.postMessageHandles.forEach(handle => {
        if (handle?.remove) {
          handle.remove()
        }
      })

      this.postMessageHandles = []
    }
  }

  async handlePostMessageExbChangeExtent (message: ChangeExtentListenMessage) {
    const view = this.getCurrentView()
    const viewSR = view.spatialReference

    const modules = await loadArcGISJSAPIModules([
      'esri/geometry/Extent',
      'esri/Viewpoint'
    ])
    const [Extent, Viewpoint] = modules as [typeof __esri.Extent, typeof __esri.Viewpoint]

    let viewpoint: __esri.Viewpoint = null
    let extent: __esri.Extent = null

    if (message.viewpoint) {
      try {
        viewpoint = Viewpoint.fromJSON(message.viewpoint)
      } catch {
      }
    }

    if (message.extent) {
      try {
        extent = Extent.fromJSON(message.extent)
      } catch {
      }
    }

    // viewpoint has high priority than extent
    if (viewpoint) {
      // update view by viewpoint
      let finalViewpoint = viewpoint

      if (isNeedProjectViewpoint(viewpoint, viewSR)) {
        const projectedViewpoint = await projectViewpoint(viewpoint, viewSR)

        if (projectedViewpoint) {
          finalViewpoint = projectedViewpoint
        }
      }

      if (finalViewpoint) {
        view.viewpoint = finalViewpoint
      }
    } else if (extent) {
      // update view by extent
      let finalExtent = extent

      if (isNeedProjectSpatialReference(extent.spatialReference, viewSR)) {
        const projectedGeometries = await geometryUtils.projectToSpatialReference([extent], viewSR)
        const projectedExtent = projectedGeometries[0] as __esri.Extent

        if (projectedExtent) {
          finalExtent = projectedExtent
        }
      }

      if (finalExtent) {
        view.goTo(finalExtent, { animate: false })
      }
    } else {
      console.warn('Invalid post message', message)
    }
  }

  async handlePostMessageExbZoomTo (message: ZoomToListenMessage) {
    const view = this.getCurrentView()
    const viewSR = view.spatialReference

    const [geometryJsonUtils] = await loadArcGISJSAPIModules(['esri/geometry/support/jsonUtils']) as [typeof __esri.jsonUtils]
    let geometry: NotMeshGeometry = null

    if (message.geometry) {
      try {
        geometry = geometryJsonUtils.fromJSON(message.geometry) as NotMeshGeometry
      } catch{
      }
    }

    if (!geometry) {
      console.warn('Invalid post message', message)
      return
    }

    let finalGeometry = geometry

    if (isNeedProjectSpatialReference(geometry.spatialReference, viewSR)) {
      const projectedGeometries = await geometryUtils.projectToSpatialReference([geometry], viewSR)
      const projectedGeometry = projectedGeometries[0]

      if (projectedGeometry) {
        finalGeometry = projectedGeometry as NotMeshGeometry
      }
    }

    const goToTarget = {
      target: finalGeometry
    }

    if (message.scale && message.scale > 0) {
      (goToTarget as any).scale = message.scale
    }

    view.goTo(goToTarget, { animate: false })
  }

  async handlePostMessageExbPanTo (message: PanToListenMessage) {
    const view = this.getCurrentView()
    const viewSR = view.spatialReference

    const [geometryJsonUtils] = await loadArcGISJSAPIModules(['esri/geometry/support/jsonUtils']) as [typeof __esri.jsonUtils]
    let point: __esri.Point = null
    let geometry: __esri.Geometry = null

    if (message.geometry) {
      try {
        geometry = geometryJsonUtils.fromJSON(message.geometry)
      } catch{
      }
    }

    if (geometry) {
      if (geometry.type === 'point') {
        point = geometry as __esri.Point
      } else if (geometry.extent) {
        point = geometry.extent.center
      }
    }

    if (!point) {
      console.warn('Invalid post message', message)
      return
    }

    let finalPoint = point

    if (isNeedProjectSpatialReference(point.spatialReference, viewSR)) {
      const projectedGeometries = await geometryUtils.projectToSpatialReference([point], viewSR)
      const projectedPoint = projectedGeometries[0] as __esri.Point

      if (projectedPoint) {
        finalPoint = projectedPoint
      }
    }

    if (finalPoint) {
      view.goTo(finalPoint, { animate: false })
    }
  }
}
