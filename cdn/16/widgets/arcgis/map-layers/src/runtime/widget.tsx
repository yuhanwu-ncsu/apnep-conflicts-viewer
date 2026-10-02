/** @jsx jsx */
import { AppMode, React, jsx, type AllWidgetProps, DataSourceComponent, MutableStoreManager, isKeyboardMode, focusElementInKeyboardMode, type MapDataSource, DataSourceTypes, type IMState, semver, getAppStore, appActions, type ImmutableObject, type ResourceSessions, loadArcGISMapComponents } from 'jimu-core'
import {
  loadArcGISJSAPIModules,
  JimuMapViewComponent,
  type JimuMapView,
  MapViewManager,
  type JimuLayerView
} from 'jimu-arcgis'
import { WidgetPlaceholder, Popper, defaultMessages as jimuDefaultMessages, Loading, getFocusableElements, LoadingType, Paper } from 'jimu-ui'
import type { IMConfig } from '../config'
import { getStyle } from './lib/style'
import type Action from './actions/action'
import defaultMessages from './translations/default'
import layerListIcon from '../../icon.svg'
import { versionManager } from '../version-manager'
import type { ReactNode } from 'react'
import MapLayersActionList from './components/map-layers-action-list'
import { TableOutlined } from 'jimu-icons/outlined/data/table'
import { getLayerListActions } from './actions'
import MapLayersHeader from './components/map-layers-header'
import type { LayerListItemType, LayerListItemCollection, TableListItemType, TableListItemCollection, BaseListItemType } from './types'
import { applyLegendPanel, collectActionGroups, filterActionGroupsByOptionAction, applyCustomizeLayerVisibility, assignSortedActionSections } from './lib/list-item-actions'
import { collectOldVersionUnselectableSublayer, getAllSpecialLayers } from './lib/old-sublayer-upgrade'
import { OptionAnchorManager, getActionElementsFromEvent, getOptionButtonFromAction, isOptionActionEventFromClickOutside } from './lib/option-anchor-manager'
import { isOnlyPopupMutableStateChanged } from './lib/mutable-store-refresh-utils'
import 'arcgis-map-components'

const allDefaultMessages = Object.assign({}, defaultMessages, jimuDefaultMessages)

export enum LoadStatus {
  Pending = 'Pending',
  Fulfilled = 'Fulfilled',
  Rejected = 'Rejected',
}

export interface WidgetProps extends AllWidgetProps<IMConfig> {}

export interface WidgetState {
  mapWidgetId: string
  jimuMapViewId: string
  mapDataSourceId: string
  listLoadStatus: LoadStatus
  tableLoadStatus: LoadStatus
  isActionListPopperOpen: boolean
  actionListPopperVersion: number
  actionListDOM: ReactNode
  nativeActionPopper: React.JSX.Element
  oldConfigUpdated: boolean
  headerKey: string
}

type LayerListElement = HTMLArcgisLayerListElement & {
  view: __esri.MapView | __esri.SceneView
  operationalItems: LayerListItemCollection
  filterPredicate?: ((item: LayerListItemType) => boolean) | null
  listItemCreatedFunction?: (event: { item: LayerListItemType }) => void
  knowledgeGraphOptions?: {
    listItemCreatedFunction?: (event: { item: TableListItemType }) => void
  }
  dragEnabled?: boolean
  visibilityAppearance?: 'default' | 'checkbox'
  componentOnReady?: () => Promise<void>
  destroy: () => Promise<void>
}

type TableListElement = HTMLArcgisTableListElement & {
  view?: __esri.MapView | __esri.SceneView
  map: __esri.WebMap | __esri.WebScene
  tableItems?: TableListItemCollection
  filterPredicate?: ((item: TableListItemType) => boolean) | null
  listItemCreatedFunction?: (event: { item: TableListItemType }) => void
  dragEnabled?: boolean
  componentOnReady?: () => Promise<void>
  destroy: () => Promise<void>
}

type ArcGISListElement = LayerListElement | TableListElement

interface ExtraProps {
  isDesignMode: boolean
  resourceSessions: ImmutableObject<ResourceSessions>
}

export class Widget extends React.PureComponent<WidgetProps & ExtraProps, WidgetState> {
  public viewFromMapWidget: __esri.MapView | __esri.SceneView
  // This is used by the popup action
  public jmvFromMap: JimuMapView
  private dataSource: MapDataSource
  private mapView: __esri.MapView
  private sceneView: __esri.SceneView
  private MapView: typeof __esri.MapView
  private SceneView: typeof __esri.SceneView
  private loadMapComponentsPromise: Promise<void>
  private layerListActions: Action[]
  private renderPromise: Promise<void>
  private currentUseMapWidgetId: string
  private currentUseDataSourceId: string
  private jimuMapView: JimuMapView

  static mapExtraStateProps = (state: IMState, props: AllWidgetProps<IMConfig>): ExtraProps => {
    return {
      isDesignMode: state.appRuntimeInfo.appMode === AppMode.Design,
      resourceSessions: state.resourceSessions
    }
  }

  static versionManager = versionManager

  mapContainerRef: React.RefObject<HTMLDivElement>
  layerListContainerRef: React.RefObject<HTMLDivElement>
  tableListContainerRef: React.RefObject<HTMLDivElement>
  optionBtnRef: React.MutableRefObject<HTMLElement | null>
  optionAnchorManager: OptionAnchorManager
  optionActionElementRef: HTMLElement | null
  suppressNextOptionClickAfterDismiss: boolean
  layerListRef: React.MutableRefObject<LayerListElement | null>
  tableListRef: React.MutableRefObject<TableListElement | null>
  layerListShadowObserver: MutationObserver | null
  layerListShadowMappingRafId: number | null
  oldSublayersSetMap: Map<string, Set<string>>

  constructor (props) {
    super(props)
    this.state = {
      mapWidgetId: null,
      mapDataSourceId: null,
      jimuMapViewId: null,
      listLoadStatus: LoadStatus.Pending,
      isActionListPopperOpen: false,
      actionListPopperVersion: 0,
      actionListDOM: null,
      tableLoadStatus: LoadStatus.Pending,
      nativeActionPopper: null,
      oldConfigUpdated: false,
      headerKey: null
    }
    this.renderPromise = Promise.resolve()
    this.layerListActions = getLayerListActions(this)
    this.mapContainerRef = React.createRef()
    this.layerListContainerRef = React.createRef()
    this.tableListContainerRef = React.createRef()
    this.optionBtnRef = React.createRef()
    this.optionAnchorManager = new OptionAnchorManager()
    this.optionActionElementRef = null
    this.suppressNextOptionClickAfterDismiss = false
    this.layerListRef = React.createRef()
    this.tableListRef = React.createRef()
    this.layerListShadowObserver = null
    this.layerListShadowMappingRafId = null
    this.oldSublayersSetMap = new Map()
  }

  private readonly onLayerListTriggerAction = (event: CustomEvent<__esri.LayerListViewModelTriggerActionEvent>) => {
    this.onLayerListActionsTriggered(event?.detail)
  }

  private readonly onTableListTriggerAction = (event: CustomEvent<__esri.TableListViewModelTriggerActionEvent>) => {
    this.onLayerListActionsTriggered(event?.detail, true)
  }

  public translate = (stringId: string) => {
    return this.props.intl.formatMessage({
      id: stringId,
      defaultMessage: allDefaultMessages[stringId]
    })
  }

  componentDidMount () {
    this.bindClickHandler()
  }

  componentWillUnmount () {
    this.destroyLayerList()
    this.destroyTableList()
    if (this.jmvFromMap) {
      this.jmvFromMap.removeJimuLayerViewCreatedListener(this._addJlvCreatedListener)
      this.jmvFromMap = null
    }
    this.optionAnchorManager.cleanup()
  }

  componentDidUpdate (prevProps: WidgetProps & ExtraProps, prevState: WidgetState) {
    if (this.props.isDesignMode && this.props.isDesignMode !== prevProps.isDesignMode) {
      // Clean up the native popper when switch to the design mode
      this.setState({ nativeActionPopper: null })
    }

    if (this.needToPreventRefreshList(prevProps, prevState)) {
      return
    }

    // Clean up the data action list before rerendering the layerlist
    this.setState({
      actionListDOM: null
    })

    // Close poppers when dataAction toggled OR config changed
    // This keeps both action list and native action poppers in a clean state
    if (this.props.enableDataAction !== prevProps.enableDataAction || this.props.config !== prevProps.config) {
      this.optionAnchorManager.cleanup()
      this.optionBtnRef.current = null
      this.setState({ isActionListPopperOpen: false, nativeActionPopper: null })
    }

    this.bindClickHandler()

    if (this.props.config?.showTables !== prevProps.config?.showTables) {
      this.renderTableList()
      // Do not refresh the layerlist if it's caused by the showTables
      return
    }

    if ((this.props.config.useMapWidget && this.state.mapWidgetId === this.currentUseMapWidgetId) ||
       (!this.props.config.useMapWidget && this.state.mapDataSourceId === this.currentUseDataSourceId)) {
      // Put the layerlist render into the next marco task, so it will not slow down the setting panel UI
      setTimeout(() => {
        this.layerListActions = getLayerListActions(this)
        this.syncRenderer(this.renderPromise)
      }, 150)
    }
    if (!this.props.config.popup && prevProps.config.popup) {
      this.restoreLayerPopupField()
    }
  }

  restoreLayerPopupField () {
    const popupValue = MutableStoreManager.getInstance().getStateValue([this.props.widgetId, 'popup']) || {}
    for (const entry of Object.values(popupValue)) {
      (entry as any).layer.popupEnabled = (entry as any).initialValue
    }
    if (popupValue) {
      MutableStoreManager.getInstance().updateStateValue(this.props.widgetId, 'popup', null)
    }
  }

  private readonly isOptionActionElement = (actionElement: HTMLElement): boolean => {
    const actionId = actionElement.getAttribute('data-action-id')
    return actionId === 'option-action' || actionElement.title === this.translate('options') || actionElement.title === 'Options'
  }

  private readonly bindOptionActionClickHandler = (refNode: HTMLElement): void => {
    if (!refNode || refNode.onclick) {
      return
    }

    refNode.onclick = (event: MouseEvent) => {
      const { actionElement, optionButtonElement } = getActionElementsFromEvent(event)
      if (!actionElement || !this.isOptionActionElement(actionElement)) {
        return
      }

      const isSameActionElement = this.optionActionElementRef === actionElement
      const sourceAnchor = optionButtonElement || getOptionButtonFromAction(actionElement) || actionElement
      const isSuppressedReopen = !this.state.isActionListPopperOpen && this.suppressNextOptionClickAfterDismiss
      const optionRef = this.optionAnchorManager.ensure(sourceAnchor)
      this.optionBtnRef.current = optionRef
      this.optionActionElementRef = actionElement

      if (isSuppressedReopen) {
        this.suppressNextOptionClickAfterDismiss = false
        return
      }

      // Toggle off only when clicking the same option action again.
      if (this.state.isActionListPopperOpen && isSameActionElement) {
        this.optionAnchorManager.cleanup()
        this.optionActionElementRef = null
        this.setState({ isActionListPopperOpen: false, nativeActionPopper: null })
        return
      }

      this.suppressNextOptionClickAfterDismiss = false
      // The popper here is kept mounted, this results in re-render the popper's content
      // instead of creating a new popper component, which causes overlap problem.
      // Give the popper a random key so it will force the popper to re-calculate the position again.
      this.setState({
        isActionListPopperOpen: true,
        nativeActionPopper: null,
        actionListPopperVersion: this.state.actionListPopperVersion + 1
      })
    }
  }

  bindClickHandler () {
    this.bindOptionActionClickHandler(this.layerListContainerRef.current)
    this.bindOptionActionClickHandler(this.tableListContainerRef.current)
  }

  private readonly isRefreshInputUnchanged = (prevProps: WidgetProps & ExtraProps): boolean => {
    return this.props.config === prevProps.config &&
      this.props.enableDataAction === prevProps.enableDataAction &&
      this.props.useMapWidgetIds?.[0] === prevProps.useMapWidgetIds?.[0] &&
      this.props.useDataSources?.[0]?.dataSourceId === prevProps.useDataSources?.[0]?.dataSourceId
  }

  needToPreventRefreshList (prevProps: WidgetProps & ExtraProps, prevState: WidgetState) {
    if (prevState.isActionListPopperOpen !== this.state.isActionListPopperOpen || prevState.actionListPopperVersion !== this.state.actionListPopperVersion || prevState.nativeActionPopper !== this.state.nativeActionPopper || prevState.listLoadStatus !== this.state.listLoadStatus || prevState.tableLoadStatus !== this.state.tableLoadStatus || prevState.headerKey !== this.state.headerKey) {
      return true
    }
    if (prevState.actionListDOM !== this.state.actionListDOM) {
      return true
    }
    // Sometimes clicking the option will fetch the layer's info, which causes portalSelf changes
    if (this.props.isDesignMode !== prevProps.isDesignMode || this.props.portalSelf !== prevProps.portalSelf) {
      return true
    }
    if (this.isRefreshInputUnchanged(prevProps) && isOnlyPopupMutableStateChanged(prevProps.mutableStatePropsVersion, this.props.mutableStatePropsVersion)) {
      return true
    }
    return false
  }

  // eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
  async createView (): Promise<__esri.MapView | __esri.SceneView | unknown> {
    if (this.props.config.useMapWidget) {
      return this.jimuMapView?.view
    } else {
      return await this.createViewByDataSource()
    }
  }

  async createViewByDataSource () {
    await this.loadViewModules(this.dataSource)

    if (this.dataSource.type === DataSourceTypes.WebMap) {
      return await new Promise((resolve, reject) => { this.createWebMapView(this.MapView, resolve, reject) })
    } else if (this.dataSource.type === DataSourceTypes.WebScene) {
      return new Promise((resolve, reject) => { this.createSceneView(this.SceneView, resolve, reject) })
    } else {
      return Promise.reject(new Error(null))
    }
  }

  createWebMapView (MapView, resolve, reject) {
    if (this.mapView) {
      this.mapView.map = this.dataSource.map
    } else {
      const mapViewOption: __esri.MapViewProperties = {
        map: this.dataSource.map,
        container: this.mapContainerRef.current
      }
      this.mapView = new MapView(mapViewOption)
    }
    this.mapView.when(
      () => {
        resolve(this.mapView)
      },
      (error) => reject(error)
    )
  }

  createSceneView (SceneView, resolve, reject) {
    if (this.sceneView) {
      this.sceneView.map = this.dataSource.map
    } else {
      const mapViewOption: __esri.SceneViewProperties = {
        map: this.dataSource.map,
        container: this.mapContainerRef.current
      }
      this.sceneView = new SceneView(mapViewOption)
    }

    this.sceneView.when(
      () => {
        resolve(this.sceneView)
      },
      (error) => reject(error)
    )
  }

  destroyView () {
    this.mapView && !this.mapView.destroyed && this.mapView.destroy()
    this.sceneView && !this.sceneView.destroyed && this.sceneView.destroy()
  }

  async getModule (moduleName: string, getter: any, setter: any) {
    const currentValue = getter()
    if (currentValue) {
      return currentValue
    }
    const module = await loadArcGISJSAPIModules([moduleName])
    setter(module[0])
    return module[0]
  }

  async loadViewModules (dataSource: MapDataSource): Promise<typeof __esri.MapView | typeof __esri.SceneView> {
    let ret = null
    if (dataSource.type === DataSourceTypes.WebMap) {
      ret = await this.getModule('esri/views/MapView', () => this.MapView, (value) => { this.MapView = value })
    } else if (dataSource.type === DataSourceTypes.WebScene) {
      ret = await this.getModule('esri/views/SceneView', () => this.SceneView, (value) => { this.SceneView = value })
    }
    return ret
  }

  ensureMapComponentsLoaded = async () => {
    if (!this.loadMapComponentsPromise) {
      this.loadMapComponentsPromise = loadArcGISMapComponents()
    }

    try {
      await this.loadMapComponentsPromise
    } catch (error) {
      this.loadMapComponentsPromise = null
      throw error
    }
  }

  destroyTableList () {
    const tableList = this.tableListRef.current
    if (!tableList) {
      return
    }
    this.destroyListComponent(tableList, this.onTableListTriggerAction as EventListener)
    this.tableListRef.current = null
  }

  destroyLayerList () {
    this.teardownLayerListShadowMapping()
    const layerList = this.layerListRef.current
    if (!layerList) {
      return
    }
    this.destroyListComponent(layerList, this.onLayerListTriggerAction as EventListener)
    this.layerListRef.current = null
  }

  private readonly applyLayerListShadowMapping = (shadowRoot: ShadowRoot): void => {
    const actionColor = 'var(--sys-color-surface-paper-text)'
    const visibleToggleColor = this.props.config?.useTickBoxes ? 'var(--sys-color-action-selected)' : actionColor

    const visibleToggleActions = shadowRoot.querySelectorAll<HTMLElement>('calcite-action.esri-layer-list__visible-toggle')
    visibleToggleActions.forEach((action) => {
      action.style.color = visibleToggleColor
      // action.style.setProperty('--calcite-action-text-color', visibleToggleColor)
      action.style.setProperty('--calcite-icon-color', visibleToggleColor)
      // action.style.setProperty('--calcite-ui-icon-color', visibleToggleColor)
    })

    const itemActions = shadowRoot.querySelectorAll<HTMLElement>('calcite-action.esri-layer-list__item-action')
    itemActions.forEach((action) => {
      if (action.classList.contains('esri-layer-list__visible-toggle')) {
        return
      }
      action.style.color = actionColor
      // action.style.setProperty('--calcite-action-text-color', actionColor)
      action.style.setProperty('--calcite-icon-color', actionColor)
      // action.style.setProperty('--calcite-ui-icon-color', actionColor)
    })
  }

  private readonly teardownLayerListShadowMapping = (): void => {
    if (this.layerListShadowMappingRafId != null) {
      window.cancelAnimationFrame(this.layerListShadowMappingRafId)
      this.layerListShadowMappingRafId = null
    }

    if (this.layerListShadowObserver) {
      this.layerListShadowObserver.disconnect()
      this.layerListShadowObserver = null
    }
  }

  private readonly setupLayerListShadowMapping = (layerList: LayerListElement): void => {
    this.teardownLayerListShadowMapping()

    const init = () => {
      const shadowRoot = layerList.shadowRoot
      if (!shadowRoot) {
        this.layerListShadowMappingRafId = window.requestAnimationFrame(init)
        return
      }

      this.layerListShadowMappingRafId = null
      this.applyLayerListShadowMapping(shadowRoot)
      this.layerListShadowObserver = new MutationObserver(() => {
        this.applyLayerListShadowMapping(shadowRoot)
      })
      this.layerListShadowObserver.observe(shadowRoot, {
        childList: true,
        subtree: true
      })
    }

    init()
  }

  private readonly destroyListComponent = (listComponent: ArcGISListElement, triggerActionListener: EventListener): void => {
    listComponent.removeEventListener('arcgisTriggerAction', triggerActionListener)
    listComponent.remove()
    listComponent.destroy?.().catch((error) => {
      console.warn(error)
    })
  }

  private readonly mountListComponent = async (container: HTMLDivElement, listComponent: ArcGISListElement): Promise<void> => {
    container.replaceChildren(listComponent)
    await listComponent.componentOnReady?.()
  }

  async createTableList (view: __esri.MapView | __esri.SceneView) {
    this.setState({ tableLoadStatus: LoadStatus.Pending })
    await this.ensureMapComponentsLoaded()
    if (!this.tableListContainerRef.current) {
      return
    }

    this.destroyTableList()

    const tableList = document.createElement('arcgis-table-list') as TableListElement
    tableList.className = 'table-list'
    tableList.view = view
    tableList.map = view.map as __esri.WebMap | __esri.WebScene
    tableList.dragEnabled = this.props.config?.reorderLayers
    tableList.listItemCreatedFunction = this.defineLayerListActionsGenerator(true)
    tableList.addEventListener('arcgisTriggerAction', this.onTableListTriggerAction as EventListener)
    await this.mountListComponent(this.tableListContainerRef.current, tableList)

    this.tableListRef.current = tableList
    return this.tableListRef.current
  }

  async createLayerList (view: __esri.MapView | __esri.SceneView) {
    this.setState({ listLoadStatus: LoadStatus.Pending })
    await this.ensureMapComponentsLoaded()
    if (!this.layerListContainerRef.current) {
      return
    }

    this.destroyLayerList()

    const layerList = document.createElement('arcgis-layer-list') as LayerListElement
    layerList.className = 'jimu-widget'
    layerList.view = view
    layerList.listItemCreatedFunction = this.defineLayerListActionsGenerator(false)
    layerList.knowledgeGraphOptions = {
      listItemCreatedFunction: this.defineLayerListActionsGenerator(true)
    }

    if (this.props.config.useMapWidget) {
      layerList.dragEnabled = this.props.config?.reorderLayers ?? false
      layerList.visibilityAppearance = this.props.config?.useTickBoxes ? 'checkbox' : 'default'
    }

    layerList.addEventListener('arcgisTriggerAction', this.onLayerListTriggerAction as EventListener)
    await this.mountListComponent(this.layerListContainerRef.current, layerList)
    this.setupLayerListShadowMapping(layerList)

    if (this.props.config.expandAllLayers) {
      this.toggleExpand(layerList.operationalItems, true)
    }

    this.layerListRef.current = layerList
  }

  defineLayerListActionsGenerator = (isTableList = false) => {
    return (event) => {
      const listItem = event.item as BaseListItemType
      applyLegendPanel(listItem, {
        isTableList,
        useMapWidget: this.props.config?.useMapWidget,
        enableLegend: this.props.config?.enableLegend,
        showAllLegend: this.props.config?.showAllLegend
      })

      const actionGroups = collectActionGroups(listItem, isTableList, this.layerListActions)
      const filteredActionGroups = filterActionGroupsByOptionAction(actionGroups, this.props.enableDataAction ?? true)

      const customizeLayerOption = this.props?.config?.customizeLayerOptions?.[this.state.jimuMapViewId]
      const currentJimuLayerViewId = this.jimuMapView?.getJimuLayerViewIdByAPILayer(listItem.layer)
      applyCustomizeLayerVisibility({
        listItem,
        customizeLayerOption,
        currentJimuLayerViewId
      })

      assignSortedActionSections(listItem, filteredActionGroups)
    }
  }

  onActionListItemClick () {
    // Let the action popper find the reference DOM node
    setTimeout(() => {
      this.setState({ isActionListPopperOpen: false })
    }, 100)
  }

  private readonly getSupportedOptionActions = (listItem: BaseListItemType, isTableList: boolean): Action[] => {
    return this.layerListActions.filter((candidateAction) => {
      return candidateAction.isValid(listItem, isTableList) && candidateAction.id !== 'option-action'
    })
  }

  private readonly renderOptionActionList = (listItem: BaseListItemType, isTableList: boolean): void => {
    const supportedActionObjects = this.getSupportedOptionActions(listItem, isTableList)
    const shouldHideEmptyList = supportedActionObjects.length > 0
    const enableDataAction = this.props.enableDataAction ?? true

    // Create data action list in the next macro task so the optionBtnRef is the latest
    setTimeout(() => {
      const mapLayersDsActionList = <MapLayersActionList
        widgetId={this.props.id}
        jimuMapView={this.jimuMapView}
        mapDataSource={this.dataSource}
        actionObjects={supportedActionObjects}
        listItem={listItem} onActionListItemClick={() => { this.onActionListItemClick() }}
        enableDataAction={enableDataAction}
        shouldHideEmptyList={shouldHideEmptyList}
        optionBtnRef={this.optionBtnRef}
      >
      </MapLayersActionList>

      this.setState({ actionListDOM: mapLayersDsActionList })
    }, 0)
  }

  private readonly executeNativeAction = (actionObj: Action, listItem: BaseListItemType): void => {
    const actionElement = actionObj.execute(listItem)
    if (actionElement) {
      this.setState({
        nativeActionPopper: actionElement
      })
    }
  }

  onLayerListActionsTriggered = (event, isTableList = false) => {
    const action = event?.action
    const listItem = event?.item
    if (!action || !listItem) {
      return
    }
    const actionObj = this.layerListActions.find(
      (actionObj) => actionObj.id === action.id
    )
    if (!actionObj) {
      return
    }

    if (actionObj.id === 'option-action') {
      // Popup the window when click option-action
      this.renderOptionActionList(listItem, isTableList)
    } else {
      // A native action
      this.executeNativeAction(actionObj, listItem)
    }
  }

  async renderLayerList () {
    try {
      const view = await this.createView() as __esri.MapView | __esri.SceneView
      if (this.props.config?.showTables) {
        await this.renderTableList()
      }
      await this.createLayerList(view)
      this.setState({
        listLoadStatus: LoadStatus.Fulfilled,
        headerKey: Math.random().toString()
      })
    } catch (error) {
      console.error(error)
    }
  }

  async renderTableList () {
    try {
      const view = await this.createView() as __esri.MapView | __esri.SceneView
      if (this.props.config?.showTables) {
        await this.createTableList(view)
        this.setState({ tableLoadStatus: LoadStatus.Fulfilled })
      } else {
        this.destroyTableList()
      }
    } catch (error) {
      console.error(error)
    }
  }

  async syncRenderer (preRenderPromise) {
    this.jimuMapView = MapViewManager.getInstance().getJimuMapViewById(this.state.jimuMapViewId)

    // The datasource mode does not have a jimuMapView
    if (this.jimuMapView) {
      await this.jimuMapView.whenJimuMapViewLoaded()
    }
    await preRenderPromise

    this.renderPromise = this.renderLayerList()
  }

  private readonly _addJlvCreatedListener = (jlv: JimuLayerView) => {
    if (jlv.fromRuntime) {
      this.syncRenderer(this.renderPromise)
    }
  }

  onActiveViewChange = (jimuMapView: JimuMapView) => {
    const useMapWidget =
      this.props.useMapWidgetIds && this.props.useMapWidgetIds[0]
    // Remove the previous listener so the callback will not be invoked multiple times
    if (this.jmvFromMap) {
      this.jmvFromMap.removeJimuLayerViewCreatedListener(this._addJlvCreatedListener)
      this.jmvFromMap = null
    }

    if (!useMapWidget) {
      this.viewFromMapWidget = null
      this.destroyLayerList()
      this.setState({
        nativeActionPopper: null,
        mapWidgetId: null,
        jimuMapViewId: null
      })
    } else if (jimuMapView && jimuMapView.view) {
      this.jmvFromMap = jimuMapView

      jimuMapView.addJimuLayerViewCreatedListener(this._addJlvCreatedListener)

      this.viewFromMapWidget = jimuMapView && jimuMapView.view
      this.setState({
        nativeActionPopper: null
      }, function afterPopperClose () {
        this.setState({
          mapWidgetId: useMapWidget,
          jimuMapViewId: jimuMapView.id,
        })
      })
    } else {
      this.destroyLayerList()
    }
  }

  onDataSourceCreated = (dataSource: MapDataSource): void => {
    this.dataSource = dataSource
    this.setState({
      mapDataSourceId: dataSource.id,
    })
  }

  editWidgetConfig = (jmvIds: string[]) => {
    let newConfig = this.props.config

    for (const jmvId of jmvIds) {
      const oldShowJlvIds = this.props.config.customizeLayerOptions?.[jmvId]?.showJimuLayerViewIds || []
      const sublayerIdsSet = this.oldSublayersSetMap.get(jmvId)
      if (sublayerIdsSet) {
        newConfig = newConfig.setIn(['customizeLayerOptions', jmvId, 'showJimuLayerViewIds'], [...oldShowJlvIds, ...sublayerIdsSet])
      }
    }

    let appConfig = getAppStore().getState().appConfig
    appConfig = appConfig.setIn(['widgets', this.props.id, 'config'], newConfig)
    getAppStore().dispatch(appActions.appConfigChanged(appConfig))
    this.setState({
      oldConfigUpdated: true
    })
  }

  upgradeOldSublayerConfig = async (jmvs: { [jmvId: string]: JimuMapView }) => {
    const originVersion = this.props.originVersion
    if (!originVersion || !semver.lt(originVersion, '1.18.0') || this.state.oldConfigUpdated) {
      return
    }

    for (const jmvId of Object.keys(jmvs)) {
      const isCustomized = this.props.config.customizeLayerOptions?.[jmvId]?.isEnabled
      const showJlvIds = this.props.config.customizeLayerOptions?.[jmvId]?.showJimuLayerViewIds
      // Do not update app that still uses hiddenList
      if (showJlvIds === undefined) {
        break
      }
      if (isCustomized) {
        const jmv = jmvs[jmvId]
        const allLayers = await getAllSpecialLayers(jmv.view.map.layers)
        for (const layer of allLayers) {
          collectOldVersionUnselectableSublayer(layer, jmv, this.oldSublayersSetMap)
        }
      }
    }

    if (this.oldSublayersSetMap.size > 0) {
      this.editWidgetConfig(Object.keys(jmvs))
    }
  }

  onToggleActionsPopper = (event?: any, reason?: string) => {
    if (isOptionActionEventFromClickOutside(event, reason, this.isOptionActionElement, [this.layerListContainerRef.current, this.tableListContainerRef.current])) {
      return
    }

    const isClickOutsideReason = reason === 'clickOutside'
    this.suppressNextOptionClickAfterDismiss = isClickOutsideReason && this.optionAnchorManager.isClickInsideCurrentOptionAnchor(event)

    const focusTarget = this.optionAnchorManager.sourceAnchor || this.optionBtnRef.current
    this.optionAnchorManager.cleanup()
    if (!isClickOutsideReason) {
      this.suppressNextOptionClickAfterDismiss = false
      this.optionActionElementRef = null
    }
    this.optionBtnRef.current = focusTarget
    this.setState({ isActionListPopperOpen: false, actionListDOM: null })
    if (isKeyboardMode()) {
      const focusableElements: HTMLElement[] = getFocusableElements(focusTarget)
      focusElementInKeyboardMode(focusableElements[0])
    }
  }

  toggleExpand = (operationalItems: LayerListItemCollection, expand: boolean) => {
    for (const item of operationalItems) {
      item.open = expand
      if (item.children) {
        this.toggleExpand(item.children, expand)
      }
    }
  }

  render () {
    const useMapWidget = this.props.useMapWidgetIds && this.props.useMapWidgetIds[0]
    const useDataSource = this.props.useDataSources && this.props.useDataSources[0]

    this.currentUseMapWidgetId = useMapWidget
    this.currentUseDataSourceId = useDataSource && useDataSource.dataSourceId

    let dataSourceContent = null
    if (this.props.config.useMapWidget) {
      dataSourceContent = (
        <JimuMapViewComponent
          useMapWidgetId={this.props.useMapWidgetIds?.[0]}
          onActiveViewChange={this.onActiveViewChange}
          onViewsCreate={(jmvs) => {
            this.upgradeOldSublayerConfig(jmvs)
          }}
        />
      )
    } else if (useDataSource) {
      dataSourceContent = (
        <DataSourceComponent
          useDataSource={useDataSource}
          onDataSourceCreated={this.onDataSourceCreated}
          onCreateDataSourceFailed={(err) => { console.error(err) }}
        />
      )
    }

    let content
    if (this.props.config.useMapWidget ? !useMapWidget : !useDataSource) {
      this.destroyLayerList()
      content = (
        <div className="widget-layerlist">
          <WidgetPlaceholder
            icon={layerListIcon}
            name={this.translate('_widgetLabel')}
            widgetId={this.props.id}
          />
        </div>
      )
    } else {
      let loadingContent = null
      if (this.state.listLoadStatus === LoadStatus.Pending) {
        loadingContent = <div className="jimu-secondary-loading" />
      }

      const shouldShowHeader = !loadingContent && (this.props.config.layerBatchOptions || this.props.config.searchLayers)

      content = (
        <div className={`widget-layerlist widget-layerlist_${this.props.id}`}>
          {shouldShowHeader &&
            <MapLayersHeader
              // Do not re-use the component when the layerlist rerenders, only rerender when the layerlist is refreshed
              // This key will affect the whole component, do not render till need to, see #28550
              headerKey={this.state.headerKey}
              theme={this.props.theme}
              jimuMapViewId={this.state.jimuMapViewId}
              layerListRef={this.layerListRef}
              tableListRef={this.tableListRef}
              config={this.props.config}
            ></MapLayersHeader>
          }
          <div ref={this.layerListContainerRef} />
          {
            this.props.config.showTables && (
              <React.Fragment>
                {
                  (loadingContent === null && this.state.tableLoadStatus === LoadStatus.Fulfilled) &&
                  <div className='table-list-divider d-flex align-items-center'>
                    <TableOutlined></TableOutlined>
                    <span className='ml-1'>{this.translate('tables')}</span>
                  </div>
                }
                {
                  (loadingContent === null && this.state.tableLoadStatus === LoadStatus.Pending) && <Loading type={LoadingType.DotsPrimary} useAriaLive></Loading>
                }
                <div ref={this.tableListContainerRef} className='table-list-wrapper' />
              </React.Fragment>
            )
          }
          {/* Fix double scroll bar problem in the widget controller */}
          <div style={{ position: 'absolute', opacity: 0, top: 0, left: 0, zIndex: -1 }} ref={this.mapContainerRef}>
            mapContainer
          </div>
          <div style={{ position: 'absolute', display: 'none' }}>
            {dataSourceContent}
          </div>
        </div>
      )
    }

    return (
      <Paper
        variant='flat'
        css={getStyle(this.props.theme, this.props.config)}
        className="jimu-widget"
        shape='none'
      >
        {content}
        {
          this.state.actionListDOM &&
          <Popper key={this.state.actionListPopperVersion} style={{ minWidth: '170px', overflow: 'hidden' }} keepMount reference={this.optionBtnRef.current} open={this.state.isActionListPopperOpen} toggle={this.onToggleActionsPopper}>
            {this.state.actionListDOM}
          </Popper>
        }
        {this.state.nativeActionPopper}
      </Paper>
    )
  }
}

export default Widget
