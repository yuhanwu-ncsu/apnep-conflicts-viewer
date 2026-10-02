/* eslint-disable no-prototype-builtins */
/** @jsx jsx */
import { type JimuMapView, JimuMapViewComponent, geometryUtils, MapViewManager } from 'jimu-arcgis'
import {
  React, type AllWidgetProps, jsx, BaseWidget, getAppStore, lodash,
  type DataRecord, DataSourceManager, type DataSource, WidgetState, type IMState,
  DataActionManager, Immutable, DataSourceTypes, ReactResizeDetector, DataLevel, type QueryParams, type QueriableDataSource, DataSourceStatus, dataSourceUtils,
  MessageManager, DataRecordsSelectionChangeMessage,
  css,
  type DataRecordSet,
  type DataAction,
  classNames,
  DataSourceComponent,
  type MessageJson,
  type ImmutableObject,
  MessageType,
  type FeatureLayerDataSource, type FeatureDataRecord, type QueryRequiredInfo,
  CONSTANTS,
  MultipleDataSourceComponent, UrlManager, urlUtils, type SubtypeGroupLayerDataSource, type UseDataSource, type IMDataSourceInfo,
  loadArcGISJSAPIModule
} from 'jimu-core'
import { type IconComponentProps, Loading, LoadingType, WidgetPlaceholder, Alert, Label, Button, defaultMessages as jimuUIDefaultMessages, ConfirmDialog, Dropdown, DropdownButton, DropdownMenu, DropdownItem, Paper, Typography, Progress } from 'jimu-ui'
import { type SearchSettings, type AnalysisSettings, type GeneralSettings, type IMConfig, type LayersInfo, AnalysisTypeName, type SummaryAttributes, type ArcGISFeatureFormElement } from '../config'
import defaultMessages from './translations/default'
import { getStyle, getDataActionButtonStyle } from './lib/style'
import LayerAccordion from './components/layer-accordion'
import AoiTool, { type AoiGeometries } from './components/aoi-tool'
import { getConfiguredDsForRuntime, getPortalUnit, getSelectedLayerInstance, getSearchWorkflow, getOutputDsId, getAllFieldsNames, formatSmallNumberWithSignificantDigits } from '../common/utils'
import { getALLFeatures, getFeaturesCount, getFeaturesIds } from '../common/query-feature-utils'
import { distanceUnitWithAbbr, maxRecordCountThreshold } from './constant'
import * as unionOperator from 'esri/geometry/operators/unionOperator'
import * as intersectionOperator from 'esri/geometry/operators/intersectionOperator'
import * as geodeticAreaOperator from 'esri/geometry/operators/geodeticAreaOperator'
import * as areaOperator from 'esri/geometry/operators/areaOperator'
import * as geodeticLengthOperator from 'esri/geometry/operators/geodeticLengthOperator'
import * as geodesicProximityOperator from 'esri/geometry/operators/geodesicProximityOperator'
import * as lengthOperator from 'esri/geometry/operators/lengthOperator'
import GraphicsLayer from 'esri/layers/GraphicsLayer'
import type Point from 'esri/geometry/Point'
import type Polygon from 'esri/geometry/Polygon'
import type Geometry from 'esri/geometry/Geometry'
import type MapView from 'esri/views/MapView'
import type SceneView from 'esri/views/SceneView'
import type Field from 'esri/layers/support/Field'
import { getHighLightSymbol } from '../common/highlight-symbol-utils'
import type { FormatNumberOptions } from 'react-intl'
import { CommonSummaryFieldValue, transparentColor } from '../setting/constants'
import { RefreshOutlined } from 'jimu-icons/outlined/editor/refresh'
import { SaveOutlined } from 'jimu-icons/outlined/application/save'
import { TrashOutlined } from 'jimu-icons/outlined/editor/trash'
import Graphic from 'esri/Graphic'
import 'arcgis-map-components'
import { versionManager } from '../version-manager'
import { ExportOutlined } from 'jimu-icons/outlined/editor/export'
import { colorUtils } from 'jimu-theme'
import Report from './components/report'
import { LeftOutlined } from 'jimu-icons/outlined/directional/left'
import { SelectOptionOutlined } from 'jimu-icons/outlined/editor/select-option'

const widgetIcon = require('./assets/icons/nearme-icon.svg')
const closestIconComponent = require('jimu-icons/svg/outlined/gis/service-find-closest.svg')
const proximityIconComponent = require('jimu-icons/svg/outlined/gis/service-proximity.svg')
const summaryComponent = require('jimu-icons/svg/outlined/gis/service-summarize-within.svg')

interface ExtraProps {
  currentLocation: Point
  selectedIncidentLocation: DataRecord[]
  selectedDataSource: DataSource
  messageConfigs: ImmutableObject<{ [messageConfigId: string]: MessageJson }>
}

interface State {
  jimuMapView: JimuMapView
  searchSettings: SearchSettings
  analysisSettings: AnalysisSettings
  activeDataSource: string
  generalSettings: GeneralSettings
  aoiGeometries: AoiGeometries
  displayLayerAccordion: React.JSX.Element[]
  isClosestAddressShowing: boolean
  isMapAreaWarningMsgShowing: boolean
  listMaxHeight: string
  noResultsFoundMsg: string
  showNoResultsFoundMsg: boolean
  queryAborted: boolean
  msgActionGeometry: Geometry
  showExportButton: boolean
  isLayerAvailable: boolean
  isAnalysisLayerConfigured: boolean
  widgetWidth: number
  loadingAllFeaturesFromDs: boolean
  promptForDataAction: boolean
  showExportOptions: boolean
  dataSetArray: DataRecordSet[]
  actionNames: string[]
  actionNamesGroups: any
  isDropDownLoading: boolean
  actionElement: React.ReactElement
  dataSetUpdated: boolean
  onWidgetLoadShowLoadingIndicator: boolean
  isFilterActionBinded: boolean
  analysisTakingLongerTime: boolean
  showSaveIcon: boolean
  showFeatureForm: boolean
  currentPage: number
  formFailedMsg: string
  isSubmittingForm: boolean
  widgetClosed: boolean
  dsToGetSelectedOnLoad: string[]
  showBatchRetriveAll: boolean
  exportProgress: number
}

export default class Widget extends BaseWidget<AllWidgetProps<IMConfig> & ExtraProps, State> {
  //all required graphics layers for the widget
  public drawingLayer: GraphicsLayer
  public bufferLayer: GraphicsLayer
  public flashLayer: GraphicsLayer
  public highlightLayer: GraphicsLayer
  public highlightGraphicsLayers: any
  public featuresInfoByDsId: any
  public featuresByAnalysisId: any
  public closestFeatureIdByDsId: any
  public mapView: MapView | SceneView
  public portalUnit: string
  public activeCurrentDs: string
  public availableLayersIds: string[]
  public readonly divRef: React.RefObject<HTMLDivElement>
  public geometriesFromAction: any
  public actionTimeout: any
  private filtersAppliedOnDsId: string[]
  private configuredHiddenLayerIds: string[] = []
  aoiToolRef = React.createRef<AoiTool>()
  layerAccordionRefs: LayerAccordion[] = []
  dropdownRef = React.createRef<HTMLButtonElement>()
  widgetConRef = React.createRef<HTMLDivElement>()
  private abortControllerRef: AbortController[] = []
  private selectedPopupContainer: HTMLDivElement | null
  private selectedRecordsKey: string
  private selectedRecord: DataRecord
  private incidentGraphic: Graphic
  private skipHighlightRecordsOnMap: boolean
  private skipDsInfoChange: boolean
  private analysisLayersResults: any
  private proximityCountDataSetArr: DataRecordSet[]
  private readonly summaryAttributes: SummaryAttributes
  private printReportData: any
  incidentGeomfeatureForm: ArcGISFeatureFormElement | undefined
  bufferGeomfeatureForm: ArcGISFeatureFormElement | undefined
  incidentFormRef = React.createRef<any>()
  bufferFormRef = React.createRef<any>()
  aoiValue: string
  private incidentFormSubmitHandler: ((e: any) => void) | null = null
  private bufferFormSubmitHandler: ((e: any) => void) | null = null
  private incidentFormSubmitTarget: ArcGISFeatureFormElement | null = null
  private bufferFormSubmitTarget: ArcGISFeatureFormElement | null = null
  private incidentRejectHandler: ((reason?: any) => void) | null = null
  private bufferRejectHandler: ((reason?: any) => void) | null = null
  private geometryJsonUtils: any = null
  private isMapViewLoaded: boolean
  private isCurrentLocationReplayedOnMapLoad: boolean
  private previousHiddenLayerIds: string[]

  static versionManager = versionManager
  static mapExtraStateProps = (state: IMState,
    props: AllWidgetProps<IMConfig>): ExtraProps => {
    return {
      currentLocation: props?.mutableStateProps?.currentLocation,
      selectedIncidentLocation: props?.mutableStateProps?.selectedIncidentLocation,
      selectedDataSource: props?.mutableStateProps?.selectedDataSource,
      messageConfigs: state?.appConfig?.messageConfigs
    }
  }

  constructor (props) {
    super(props)
    this.divRef = React.createRef()
    this.featuresInfoByDsId = {}
    this.featuresByAnalysisId = {}
    this.closestFeatureIdByDsId = {}
    this.highlightGraphicsLayers = []
    this.geometriesFromAction = {}
    this.actionTimeout = null
    this.filtersAppliedOnDsId = []
    this.selectedPopupContainer = null
    this.selectedRecordsKey = ''
    this.selectedRecord = null
    this.incidentGraphic = null
    this.skipHighlightRecordsOnMap = false
    this.skipDsInfoChange = false
    this.analysisLayersResults = {}
    this.summaryAttributes = {}
    this.printReportData = []
    this.proximityCountDataSetArr = []
    this.aoiValue = ''
    this.isMapViewLoaded = false
    this.isCurrentLocationReplayedOnMapLoad = false
    this.previousHiddenLayerIds = []
    this.state = {
      jimuMapView: null,
      searchSettings: null,
      activeDataSource: null,
      analysisSettings: null,
      generalSettings: this.props.config.generalSettings,
      aoiGeometries: null,
      displayLayerAccordion: [],
      isClosestAddressShowing: false,
      isMapAreaWarningMsgShowing: false,
      listMaxHeight: '',
      noResultsFoundMsg: this.props.config.generalSettings.noResultsFoundText !== '' ? this.props.config.generalSettings.noResultsFoundText : this.nls('noDataMessageDefaultText'),
      showNoResultsFoundMsg: false,
      queryAborted: false,
      msgActionGeometry: null,
      showExportButton: this.props.enableDataAction !== undefined ? this.props.enableDataAction : true,
      isLayerAvailable: true,
      isAnalysisLayerConfigured: true,
      widgetWidth: null,
      loadingAllFeaturesFromDs: false,
      promptForDataAction: false,
      showExportOptions: false,
      dataSetArray: [],
      actionNames: [],
      actionNamesGroups: {},
      isDropDownLoading: false,
      actionElement: null,
      dataSetUpdated: false,
      onWidgetLoadShowLoadingIndicator: true,
      isFilterActionBinded: false,
      analysisTakingLongerTime: false,
      showSaveIcon: false,
      showFeatureForm: false,
      currentPage: 1,
      formFailedMsg: '',
      isSubmittingForm: false,
      widgetClosed: false,
      dsToGetSelectedOnLoad: [],
      showBatchRetriveAll: true,
      exportProgress: 0
    }
  }

  nls = (id: string) => {
    const messages = Object.assign({}, defaultMessages, jimuUIDefaultMessages)
    //for unit testing no need to mock intl we can directly use default en msg
    if (this.props.intl?.formatMessage) {
      return this.props.intl.formatMessage({ id: id, defaultMessage: messages[id] })
    } else {
      return messages[id]
    }
  }

  componentDidMount = () => {
    void (async () => {
      if (!geodeticLengthOperator.isLoaded()) {
        await geodeticLengthOperator.load()
      }
      if (!geodeticAreaOperator.isLoaded()) {
        await geodeticAreaOperator.load()
      }
      if (!geodesicProximityOperator.isLoaded()) {
        await geodesicProximityOperator.load()
      }
      if (this.props.mutableStatePropsVersion?.selectedDataSource && this.props.selectedDataSource) {
        this.setState({
          promptForDataAction: true
        })
      } else if (this.props.mutableStatePropsVersion?.selectedIncidentLocation) {
        this.geometriesByDsIdFromAction(this.props?.selectedIncidentLocation)
      } else if (this.props.mutableStatePropsVersion?.currentLocation) {
        this.recordSelectedFromAction(this.props?.currentLocation)
      }
    })()
  }

  /**
   * Check the current config property or runtime property changed in live view
   * @param prevProps previous property
   * @param prevState previous state
   */
  componentDidUpdate = (prevProps, prevState) => {
    void (async () => {
      const currentWidgetState = getAppStore()?.getState()?.widgetsRuntimeInfo[this.props.id]?.state
      if (currentWidgetState === WidgetState.Opened || !currentWidgetState || currentWidgetState === WidgetState.Hidden) {
        //check for feature selected using message action
        // if featureRecord found and prev selected record is not matching with the current then only load the analysis info for selected feature location
        if (this.props?.selectedIncidentLocation) {
          const geometriesByDsId: any = this.props?.selectedIncidentLocation
          if (geometriesByDsId && (!prevProps || !prevProps.mutableStatePropsVersion || !prevProps.mutableStatePropsVersion.selectedIncidentLocation ||
            prevProps?.mutableStatePropsVersion?.selectedIncidentLocation !== this.props.mutableStatePropsVersion?.selectedIncidentLocation)) {
            this.geometriesByDsIdFromAction(geometriesByDsId)
          }
        }
        if (this.props?.selectedDataSource &&
          (!prevProps || !prevProps.mutableStatePropsVersion || !prevProps.mutableStatePropsVersion.selectedDataSource ||
            prevProps?.mutableStatePropsVersion?.selectedDataSource !== this.props.mutableStatePropsVersion?.selectedDataSource)) {
          this.setState({
            promptForDataAction: true
          })
        }
        if (this.props?.currentLocation &&
          (!prevProps || !prevProps.mutableStatePropsVersion || !prevProps.mutableStatePropsVersion.currentLocation ||
            prevProps?.mutableStatePropsVersion?.currentLocation !== this.props.mutableStatePropsVersion?.currentLocation)) {
          this.recordSelectedFromAction(this.props?.currentLocation)
        }
      }

      if (this.props.state !== prevProps.state && (currentWidgetState === WidgetState.Closed || currentWidgetState === WidgetState.Hidden)) {
        //if widget is closed/hidden then deactivate the active sketch tools
        this.setState({
          widgetClosed: true
        })
        //if keep results when widget closed/hidden is disabled from config then clear the analysis results and the drawing from the map
        if (!this.props.config.generalSettings.keepResultsWhenClosed) {
          this.aoiToolRef?.current?.clearAll()
        }
      }

      //if widget is open then update the sketch tools and results according to the widget config option
      if (this.props.state !== prevProps.state && currentWidgetState === WidgetState.Opened) {
        this.setState({
          widgetClosed: false
        })
      }

      //if map is changed, then get the updated active jimuMapView or if map gets undo/redo
      if (prevProps.useMapWidgetIds !== this.props.useMapWidgetIds) {
        const jimuMapView = MapViewManager.getInstance().getJimuMapViewById(this.state.jimuMapView?.id)
        if (jimuMapView) {
          this.setState({
            jimuMapView: jimuMapView
          })
        }
      }

      //check if active datasource is changed
      if (prevState.state?.activeDataSource !== this.state.activeDataSource) {
        this.setState({
          activeDataSource: this.state.activeDataSource
        })
      }

      //check if the search settings are changed
      if (this.state.activeDataSource) {
        const currentActiveDsConfig = this.props.config.configInfo?.[this.state.activeDataSource]
        const prevActiveDsConfig = prevProps.config.configInfo?.[this.state.activeDataSource]

        if (!lodash.isDeepEqual(prevActiveDsConfig?.searchSettings, currentActiveDsConfig?.searchSettings)) {
          if (this.didSearchSettingsChanged(prevActiveDsConfig?.searchSettings, currentActiveDsConfig?.searchSettings)) {
            this.resetFeatureForm()
            //clear incident/buffer geometries if any search settings changed except heading label
            this.setState({
              aoiGeometries: null,
              searchSettings: currentActiveDsConfig?.searchSettings,
              showExportOptions: false
            }, () => {
              this.isValidLayerConfigured()
              this.hideConfiguredHiddenLayers()
              const { searchCurrentExtent, showAllFeatures } = getSearchWorkflow(this.state.searchSettings)
              if (searchCurrentExtent) {
                this.checkIfFilterMessageActionBinded()
              }
              if (showAllFeatures && this.state.jimuMapView) {
                this.onClear()
                this.queryLayers()
                this.resizeLayerListHeight()
              } else {
                this.setState({
                  showNoResultsFoundMsg: false,
                  queryAborted: false,
                  displayLayerAccordion: []
                })
              }
            })
          } else {
            //only heading label is changed
            this.setState({
              searchSettings: currentActiveDsConfig?.searchSettings
            }, () => {
              this.resizeLayerListHeight()
              const { searchCurrentExtent } = getSearchWorkflow(this.state.searchSettings)
              if (searchCurrentExtent) {
                this.checkIfFilterMessageActionBinded()
              }
            })
          }
        }

        //check if analysis settings is changed
        if (this.didAnalysisSettingsChanged(prevActiveDsConfig?.analysisSettings?.layersInfo,
          currentActiveDsConfig?.analysisSettings?.layersInfo) ||
          prevActiveDsConfig?.analysisSettings?.displayAnalysisIcon !== currentActiveDsConfig?.analysisSettings?.displayAnalysisIcon ||
          prevActiveDsConfig?.analysisSettings?.displayMapSymbols !== currentActiveDsConfig?.analysisSettings?.displayMapSymbols ||
          prevActiveDsConfig?.analysisSettings?.showDistFromInputLocation !== currentActiveDsConfig?.analysisSettings?.showDistFromInputLocation ||
          prevActiveDsConfig?.analysisSettings?.onlyShowLayersResult !== currentActiveDsConfig?.analysisSettings?.onlyShowLayersResult ||
          prevActiveDsConfig?.analysisSettings?.displayAllLayersResult !== currentActiveDsConfig?.analysisSettings?.displayAllLayersResult ||
          prevActiveDsConfig?.analysisSettings?.displayAllLayersResultOnMap !== currentActiveDsConfig?.analysisSettings?.displayAllLayersResultOnMap ||
          prevActiveDsConfig?.analysisSettings?.enableProximitySearch !== currentActiveDsConfig?.analysisSettings?.enableProximitySearch ||
          !lodash.isDeepEqual(prevActiveDsConfig?.analysisSettings?.saveFeatures, currentActiveDsConfig?.analysisSettings?.saveFeatures)
        ) {
          this.availableLayersIds = []
          const allDsLayers = await getConfiguredDsForRuntime(this.getUniqueDsIds(this.state.jimuMapView.dataSourceId), this.state.jimuMapView.dataSourceId)
          if (allDsLayers.length > 0) {
            allDsLayers.forEach((layer: any) => {
              if (layer?.getLayerDefinition()?.geometryType) {
                this.availableLayersIds.push(layer.id)
              }
            })
          }

          this.setState({
            analysisSettings: currentActiveDsConfig?.analysisSettings,
            onWidgetLoadShowLoadingIndicator: false
          }, () => {
            const displayAllLayersResultOnMapChanged =
              prevActiveDsConfig?.analysisSettings?.displayAllLayersResultOnMap !== currentActiveDsConfig?.analysisSettings?.displayAllLayersResultOnMap
            const displayAllLayersResultChanged =
              prevActiveDsConfig?.analysisSettings?.displayAllLayersResult !== currentActiveDsConfig?.analysisSettings?.displayAllLayersResult

            if (!lodash.isDeepEqual(prevActiveDsConfig?.analysisSettings?.saveFeatures, currentActiveDsConfig?.analysisSettings?.saveFeatures)) {
              this.resetFeatureForm()
            }
            if (this.state.displayLayerAccordion.length > 0 && displayAllLayersResultOnMapChanged) {
              //enable the visibility of all configured layers and
              //return search results when they are turned off in the web map or during runtime using Layer List widget.
              currentActiveDsConfig?.analysisSettings?.layersInfo.forEach((layerInfo) => {
                const hasNearMeResults = this.state.displayLayerAccordion.some((accordion) => {
                  return accordion?.props?.dsId === layerInfo.useDataSource.dataSourceId
                })
                const dsIdForLayerView = layerInfo.useDataSource.dataViewId
                  ? layerInfo.useDataSource.mainDataSourceId
                  : layerInfo.useDataSource.dataSourceId
                if (this.availableLayersIds.includes(layerInfo.useDataSource.dataSourceId) ||
                  (layerInfo.useDataSource.dataViewId && this.availableLayersIds.includes(layerInfo.useDataSource.mainDataSourceId))) {
                  const mapFeatureLayer = this.state.jimuMapView.getJimuLayerViewByDataSourceId(dsIdForLayerView)?.layer
                  if (mapFeatureLayer) {
                    if (this.state.analysisSettings.displayAllLayersResultOnMap && hasNearMeResults) {
                      if (!mapFeatureLayer.visible) {
                        // Capture the originally hidden configured layers so we can restore them when turning this option off.
                        if (!this.configuredHiddenLayerIds.includes(dsIdForLayerView)) {
                          this.configuredHiddenLayerIds.push(dsIdForLayerView)
                        }
                        mapFeatureLayer.visible = true
                      }
                    } else if (this.configuredHiddenLayerIds.includes(dsIdForLayerView) && mapFeatureLayer.visible) {
                      mapFeatureLayer.visible = false
                    }
                  }
                }
              })
              if (!displayAllLayersResultChanged) {
                return
              }
            }

            this.isValidLayerConfigured()
            const displayAllLayersConfigChanged = displayAllLayersResultChanged
            // if only show layers results changed update the filter according to current state
            if (this.state.analysisSettings?.onlyShowLayersResult !== prevState.analysisSettings?.onlyShowLayersResult) {
              this.onOnlyShowLayerResultsChanged()
            } else if (this.isLayerQueryNeeded(prevActiveDsConfig?.analysisSettings?.layersInfo,
              currentActiveDsConfig?.analysisSettings?.layersInfo) || displayAllLayersConfigChanged) {
              this.onRefreshResult()
              if (this.state.searchSettings?.searchByActiveMapArea) {
                this.aoiToolRef.current?.getMapExtentGeometry()
              }
            } else {
              this.setState({
                dataSetArray: []
              }, () => {
                this.displayAnalysisLayerInfo()
              })
              if (this.state.searchSettings?.searchByActiveMapArea) {
                this.aoiToolRef.current?.getMapExtentGeometry()
              }
            }
          })
        }
      }

      //check if general settings is changed
      if (!lodash.isDeepEqual(prevProps.config.generalSettings, this.props.config.generalSettings)) {
        this.setState({
          generalSettings: this.props.config.generalSettings
        })
      }

      //check if enable data action and individual action props is changed
      if (prevProps.enableDataAction !== this.props.enableDataAction ||
        !lodash.isDeepEqual(this.props.dataActions, prevProps.dataActions)
      ) {
        this.setState({
          showExportButton: this.props.enableDataAction !== undefined ? this.props.enableDataAction : true
        }, () => {
          this.setState({
            dataSetArray: []
          })
          this.displayAnalysisLayerInfo()
        })
      }

      //update the highlight bar in popup details
      if (this.selectedPopupContainer && prevProps.theme?.sys.color?.primary.main !== this.props.theme?.sys.color?.primary.main) {
        this.selectedPopupContainer.style.borderColor = this.props.theme?.sys.color?.primary.main
      }

      //On font size percentage change update the list to avoid double scrollbar
      if (prevProps.theme.ref.typeface.htmlFontSize !== this.props.theme.ref.typeface.htmlFontSize) {
        this.resizeLayerListHeight()
      }

      //on message config change update the hide or show the Update result button in case current map area
      if (!lodash.isDeepEqual(prevProps.messageConfigs, this.props.messageConfigs) ||
        !lodash.isDeepEqual(prevProps.useDataSources, this.props.useDataSources)) {
        const { searchCurrentExtent } = getSearchWorkflow(this.state.searchSettings)
        if (searchCurrentExtent) {
          this.checkIfFilterMessageActionBinded()
        }
      }
    })()
  }

  /**
   * Check if the filter message action is binded in the map widget
   */
  checkIfFilterMessageActionBinded = () => {
    //consider 'filter data record action' is not binded
    let isFilterActionBinded = false
    //loop through all the actions and find 'filter data record action' for the mapWidget used in nearme and has datasource used in the widget
    for (const messageId in this.props.messageConfigs) {
      const messageActionConfigItem = this.props.messageConfigs[messageId]
      //if current messageActionConfigItem is for map which is configured in near me and the action is for Extent change
      if (this.props.useMapWidgetIds.includes(messageActionConfigItem?.widgetId) && messageActionConfigItem?.messageType === MessageType.ExtentChange) {
        //in Extent change  look for 'filter data record action'
        const allUsedDSIds = this.props.useDataSources.map(obj => obj.dataSourceId)
        messageActionConfigItem.actions?.some((action) => {
          if (action.actionName === 'filter data record action' && action.useDataSources?.length) {
            const results = action.useDataSources.filter(useDs => allUsedDSIds.includes(useDs.dataSourceId))
            if (results.length) {
              isFilterActionBinded = true
              return true
            }
          }
          return false
        })
      }
    }
    //finally set the filterActionBinded state which will control the visibility of update button
    //if this is false we will see the update button
    this.setState({
      isFilterActionBinded: isFilterActionBinded
    })
  }

  /**
   * On widget delete clear all the graphics from the map
   */
  componentWillUnmount = () => {
    this.onClear()
  }

  /**
   * Get the selected feature record on initial load of the app in the preview mode
   * Checks the URL parameters on load to find any pre-selected features.
   * It identifies the data sources and specific records that are selected
   * and updates the state to trigger the analysis for them.
   */
  getSelectedFeatureRecordsOnLoad = async () => {
    const urlManager = UrlManager.getInstance()
    const dsInfos = urlUtils.getDataSourceInfosFromUrlParams(urlManager.getQueryObject(), urlManager.getHashObject())
    const selectedLayerDsIds: string[] = []
    for (const dsLayerId in dsInfos) {
      let selectedLayerDsId = dsLayerId
      let layerDataSource = DataSourceManager.getInstance().getDataSource(dsLayerId)
      // If the layer data source is not found, try to create it from the map's data source.
      if (!layerDataSource) {
        const mapDs = DataSourceManager.getInstance().getDataSource(this.state.jimuMapView?.dataSourceId)
        layerDataSource = mapDs?.isDataSourceSet() && await mapDs?.createDataSourceById(dsLayerId)
      }
      if (layerDataSource?.type === DataSourceTypes.SubtypeGroupLayer) {
        //get the sublayer datasource by record id
        const subLayerDataSource = await (layerDataSource as SubtypeGroupLayerDataSource).getSublayerDataSourceByRecordId((dsInfos[dsLayerId]?.selection as any).ids[0])
        selectedLayerDsId = subLayerDataSource.id
      }
      const selection = dsInfos[dsLayerId]?.selection as any
      if (selection?.ids?.length || selection?.queryParams?.geometry || selection?.queryParams?.where) {
        selectedLayerDsIds.push(selectedLayerDsId)
      }
    }
    // If any data sources with selections were found, update the state.
    // This will trigger the onDataSourceInfoChange listener to process the selections.
    if (selectedLayerDsIds.length > 0) {
      this.setState({
        dsToGetSelectedOnLoad: selectedLayerDsIds
      })
    }
  }

  /**
   * Handles data source changes for all the ds having selected records onload.
   * This function extracts their geometries and triggers an action to process them.
   * @param infos - `IMDataSourceInfo` contains information about the ds, including selected record IDs.
   */
  onDataSourceInfoChange = (infos: { [dataSourceId: string]: IMDataSourceInfo }) => {
    // Exit if no info or if any info object is missing selection data.
    if (!infos || Object.values(infos).some(info => !info || !('selectedIds' in info))) {
      return
    }
    // Object to store geometries grouped by their data source ID.
    const geometriesByDsId: { [key: string]: Geometry[] } = {}

    // Iterate over each data source that has selected records.
    Object.keys(infos).forEach(dsId => {
      // Get the data source instance.
      const ds = DataSourceManager.getInstance().getDataSource(dsId) as FeatureLayerDataSource
      if (!ds) return

      // Get all selected records from the data source.
      const selectedRecords = ds.getSelectedRecords()
      for (const record of selectedRecords) {
        // Extract the geometry from each record's feature.
        const geometry = (record as any).getFeature()?.geometry
        if (geometry) {
          // Initialize the array if it doesn't exist, then add the geometry.
          if (!geometriesByDsId[dsId]) {
            geometriesByDsId[dsId] = []
          }
          geometriesByDsId[dsId].push(geometry)
        }
      }
    })

    if (Object.keys(geometriesByDsId).length > 0) {
      this.skipHighlightRecordsOnMap = true
      this.geometriesByDsIdFromAction(geometriesByDsId)
    }

    this.setState({
      dsToGetSelectedOnLoad: []
    })
  }

  /**
   * Flatten a group layer data source into leaf feature/subtype-sublayer data sources.
   * Returns the same layer when the input is already a feature-capable layer.
   */
  recursiveCheckForGroupLayers = (ds: DataSource) => {
    const allDsLayers = []
    if (ds?.type === DataSourceTypes.GroupLayer) {
      const flattenGroupLayers = (grpLayer) => {
        const grpChildlayers = grpLayer.getChildDataSources() ?? []
        grpChildlayers.forEach((subLayers) => {
          if (subLayers?.type === DataSourceTypes.GroupLayer) {
            flattenGroupLayers(subLayers)
          } else if (subLayers?.type === DataSourceTypes.FeatureLayer || subLayers?.type === DataSourceTypes.SubtypeSublayer) { //for feature layer
            allDsLayers.push(subLayers)
          }
        })
      }
      flattenGroupLayers(ds)
    } else if (ds?.type === DataSourceTypes.FeatureLayer || ds?.type === DataSourceTypes.SubtypeSublayer) {
      allDsLayers.push(ds)
    }
    return allDsLayers
  }

  /**
   * Get all features from datasource and each geometries by ds id from action
   */
  getAllFeaturesFromSelectedDs = () => {
    // use abortController to make the selecting task cancelable
    const abortController = new AbortController()
    this.abortControllerRef.push(abortController)

    const geometriesByDsId = {}
    let dsID: string = ''
    dsID = this.props.selectedDataSource?.id
    if (!geometriesByDsId[dsID]) {
      geometriesByDsId[dsID] = []
    }
    this.setState({
      loadingAllFeaturesFromDs: true,
      analysisTakingLongerTime: false
    }, () => {
      void (async () => {
      let minTimeOut = setTimeout(() => {
        if (minTimeOut) {
          clearTimeout(minTimeOut)
          minTimeOut = null
        }
        this.setState({
          analysisTakingLongerTime: true
        })
      }, 10000)
      let outFields
      this.props.useDataSources.forEach((dataS) => {
        if (dataS.dataSourceId === this.props.selectedDataSource.id) {
          outFields = dataS.fields ?? []
        }
      })
      let allDsLayers = this.recursiveCheckForGroupLayers(this.props.selectedDataSource)
      if (allDsLayers.length === 0 && this.state.jimuMapView) {
        const mapLayers = await getConfiguredDsForRuntime(this.getUniqueDsIds(this.state.jimuMapView.dataSourceId), this.state.jimuMapView.dataSourceId)
        allDsLayers = mapLayers.filter((layer: any) => layer?.getLayerDefinition()?.geometryType)
      }
      const defArr = []
      allDsLayers.forEach((eachLayer) => {
        defArr.push(getALLFeatures(eachLayer, {
          queryGeometry: null,
          returnGeometry: true,
          outSR: this.state.jimuMapView.view.spatialReference,
          outFields,
          signal: abortController.signal
        }))
      })
      Promise.all(defArr).then(async (featuresByLayer) => {
        if (minTimeOut) {
          clearTimeout(minTimeOut)
          minTimeOut = null
        }
        if (featuresByLayer?.length > 0) {
          // Flatten the array-of-arrays and resolve geometries in parallel
          const allFeatureRecords = featuresByLayer.flat()
          const geoms = await Promise.all(allFeatureRecords.map((featureRecord) => this.ensureGeometryInstance(featureRecord)))
          geometriesByDsId[dsID].push(...geoms)
          this.geometriesByDsIdFromAction(geometriesByDsId)
        } else {
          this.setState({
            loadingAllFeaturesFromDs: false,
            analysisTakingLongerTime: false
          })
        }
      }).catch((err) => {
        console.error(err)
        if (minTimeOut) {
          clearTimeout(minTimeOut)
          minTimeOut = null
        }
        this.setState({
          loadingAllFeaturesFromDs: false,
          analysisTakingLongerTime: false
        })
      })
      })()
    })
  }

  /**
   * On Proceed button click close the prompt and get all the features and perform the analysis
   */
  analyzeAllFeatures = () => {
    this.setState({
      promptForDataAction: false
    })
    this.getAllFeaturesFromSelectedDs()
  }

  /**
   * On prompt close button click do not perform any process
   */
  onCancelButtonClicked = () => {
    this.setState({
      promptForDataAction: false,
      loadingAllFeaturesFromDs: false
    })
  }

  /**
   * Set the multiple features selected by other widgets as a set location in NM
   * @param selectedGeometriesByDsId selected feature geometry from action
   */
  geometriesByDsIdFromAction = (selectedGeometriesByDsId) => {
    const dsIds = Object.keys(selectedGeometriesByDsId)
    //Get the keys of each selected geometries and
    //loop through the array of datasource id and assign geometry of selected features to the class level variable
    dsIds.forEach((dsId) => {
      this.geometriesFromAction[dsId] = selectedGeometriesByDsId[dsId]
    })
    if (this.actionTimeout) {
      clearTimeout(this.actionTimeout)
    }
    this.actionTimeout = setTimeout(async () => {
      const geometryByTypes = {
        point: [],
        polyline: [],
        polygon: [],
        multipoint: []
      }
      const uniqueGeometryTypes = []
      const dsIds = Object.keys(this.geometriesFromAction)
      const dsManager = DataSourceManager.getInstance()
      //1. create array of unique geometry types
      //2. create object of geometries by geometry type
      dsIds.forEach((dsId) => {
        const dataSource = dsManager?.getDataSource(dsId)
        const allDsLayers = this.recursiveCheckForGroupLayers(dataSource)
        allDsLayers.forEach((eachDsLayer) => {
          if (eachDsLayer?.getGeometryType()) {
            const geometryType = dataSourceUtils.changeRestAPIGeometryTypeToJSAPIGeometryType(eachDsLayer.getGeometryType())
            if (!uniqueGeometryTypes.includes(geometryType)) {
              uniqueGeometryTypes.push(geometryType)
            }
            if (this.geometriesFromAction[dsId]?.length > 0) {
              geometryByTypes[geometryType] = geometryByTypes[geometryType].concat(this.geometriesFromAction[dsId])
            }
          }
        })
      })
      let unionGeometry = null
      //If all the geometries are of one type
      if (uniqueGeometryTypes.length === 1) {
        //If multiple features are selected then get the union of all the geometries else get the only one selected geometry
        if (geometryByTypes[uniqueGeometryTypes[0]].length > 1) {
          unionGeometry = unionOperator.executeMany(geometryByTypes[uniqueGeometryTypes[0]]) //union
        } else {
          unionGeometry = geometryByTypes[uniqueGeometryTypes[0]][0]
        }
      } else if (uniqueGeometryTypes.length > 1) {
        //If geometries with different types are selected, create buffer for all the points, multipoints and lines geometries
        //and then union the buffer geometries with selected polygon geometry.
        //As a result we will get only one polygon geometry at the end
        let pointLineArray = geometryByTypes.point.concat(geometryByTypes.polyline)
        pointLineArray = pointLineArray.concat(geometryByTypes.multipoint)
        const bufferGeometry: any = await geometryUtils.createBuffer(pointLineArray, [0.1], 'meters')
        const allPolygonsArray = bufferGeometry.concat(geometryByTypes.polygon)
        unionGeometry = unionOperator.executeMany(allPolygonsArray) //union
      }
      this.recordSelectedFromAction(unionGeometry)
      this.geometriesFromAction = {}
    }, 1000)
  }

  /**
   * Once received the features from
   * 1. RecordSelectionChange
   * 2. After searching in the search tool of the map
   * 3. After using current location tool of the map
   * set it in the state and the analysis will be performed using it
   * @param featureRecordGeometry selected feature record geometry
   */
  recordSelectedFromAction = async (featureRecordGeometry: any) => {
    //whenever record is selected, perform the action only when search by location is enabled,
    //in case of show all features and show features in current map area, skip the selection
    const { searchByLocation } = getSearchWorkflow(this.state.searchSettings)
    if (searchByLocation) {
      const mapSR = this.state.jimuMapView?.view?.spatialReference
      if (mapSR) {
        const projectedGeometries = await geometryUtils.projectToSpatialReference([featureRecordGeometry], mapSR)
        if (projectedGeometries?.length > 0 && projectedGeometries[0]) {
          this.setState({
            msgActionGeometry: projectedGeometries[0]
          })
        }
      }
    }
  }

  /**
   * Return a JSAPI geometry instance from a record feature, creating one from JSON when needed.
   * This normalizes records coming from different sources so downstream geometry operators work.
   */
  ensureGeometryInstance = async (record: DataRecord): Promise<Geometry> => {
    const isJSAPIGraphic = !!(record as any).feature && !!(((record as any).feature as Graphic).declaredClass)
    if (isJSAPIGraphic) {
      return (((record as any).feature as Graphic).geometry)
    } else {
      try {
        if (!this.geometryJsonUtils) {
          this.geometryJsonUtils = await loadArcGISJSAPIModule('esri/geometry/support/jsonUtils')
        }
        return this.geometryJsonUtils?.fromJSON(((record as any).feature).geometry)
      } catch (err) {
        console.error(err)
        return null
      }
    }
  }

  /**
   * check valid analysis layers are configured or not based on search settings
   */
  isValidLayerConfigured = () => {
    let validLayers: LayersInfo[]
    //filter closest analysis in case of current map extent or show all features
    const { showAllFeatures, searchCurrentExtent } = getSearchWorkflow(this.state.searchSettings)
    if ((showAllFeatures || searchCurrentExtent) && this.state.analysisSettings?.layersInfo?.length > 0) {
      validLayers = this.state.analysisSettings?.layersInfo.filter((layerInfo: any) => {
        const analysisType = layerInfo.analysisInfo.analysisType
        return analysisType === AnalysisTypeName.Proximity || analysisType === AnalysisTypeName.Summary
      })
    }
    if (validLayers && this.hasValidDsIds()) {
      ///define search is off or search by map area is on and proximity and summary layers also configured
      this.setState({
        isAnalysisLayerConfigured: validLayers?.length > 0
      })
    } else {
      this.setState({
        isAnalysisLayerConfigured: this.hasValidDsIds() && this.state.analysisSettings?.layersInfo?.length > 0
      }, () => {
        //clear all highlights, geometries.... no analysis layer is configured
        if (!this.state.isAnalysisLayerConfigured) {
          this.onClear()
        }
      })
    }
  }

  /**
   * Check if the configured layer analysis includes valid available layer datasources
   */
  hasValidDsIds = () => {
    let validDs = false
    this.state.analysisSettings?.layersInfo?.some((layerInfo, index: number) => {
      if (this.availableLayersIds.includes(layerInfo.useDataSource.dataSourceId) ||
      (layerInfo.useDataSource.dataViewId && this.availableLayersIds.includes(layerInfo.useDataSource.mainDataSourceId))) {
        validDs = true
        return validDs
      }
      return false
    })
    return validDs
  }

  /**
   * check analysis Settings Changed or not
   * @param prevSettings old props
   * @param newSettings new props
   * @returns  boolean analysis Settings Change true or false
   */
  didAnalysisSettingsChanged = (prevSettings, newSettings): boolean => {
    let analysisSettingsChange = false
    newSettings?.some((newSettings, index: number) => {
      if (!prevSettings || newSettings.useDataSource.dataSourceId !== prevSettings[index]?.useDataSource.dataSourceId ||
        newSettings.label !== prevSettings[index]?.label ||
        !lodash.isDeepEqual(newSettings.analysisInfo, prevSettings[index]?.analysisInfo)) {
        analysisSettingsChange = true
        return true
      }
      return false
    })
    return newSettings?.length !== prevSettings?.length ? true : analysisSettingsChange
  }

  /**
   * check search Settings Changed or not
   * @param prevSearchSettings old search settings
   * @param newSearchSettings new searchSettings props
   * @returns  boolean search Settings Change true or false
  */
  didSearchSettingsChanged = (prevSearchSettings: SearchSettings, newSearchSettings: SearchSettings): boolean => {
    let searchSettingsChange = false
    if (!prevSearchSettings || !newSearchSettings || newSearchSettings.includeFeaturesOutsideMapArea !== prevSearchSettings.includeFeaturesOutsideMapArea ||
      newSearchSettings.bufferDistance !== prevSearchSettings.bufferDistance ||
      newSearchSettings.distanceUnits !== prevSearchSettings.distanceUnits ||
      newSearchSettings.searchByActiveMapArea !== prevSearchSettings.searchByActiveMapArea) {
      // eslint-disable-next-line no-useless-assignment
      searchSettingsChange = true
      return true
    }
    return searchSettingsChange
  }

  /**
  * check layer query is needed or not based on analysis settings parameter change(dataSourceId,type,analysis settings length)
  * @param prevSettings old props
  * @param newSettings new props
  * @returns  boolean analysis Settings (dataSourceId,type,analysis settings length) Change true or false
  */
  isLayerQueryNeeded = (prevSettings, newSettings): boolean => {
    let analysisSettingsChange = false
    newSettings?.some((newSettings, index: number) => {
      if (!prevSettings || newSettings.useDataSource.dataSourceId !== prevSettings[index]?.useDataSource.dataSourceId ||
        ((newSettings.analysisInfo.analysisType === AnalysisTypeName.Closest || newSettings.analysisInfo.analysisType === AnalysisTypeName.Proximity) &&
        newSettings.analysisInfo.returnIntersectedPolygons !== prevSettings[index]?.analysisInfo.returnIntersectedPolygons) ||
        !lodash.isDeepEqual(newSettings.analysisInfo.fieldsToExport, prevSettings[index]?.analysisInfo.fieldsToExport) ||
        newSettings.analysisInfo.includeApproxDistance !== prevSettings[index]?.analysisInfo.includeApproxDistance) {
        analysisSettingsChange = true
        return true
      }
      return false
    })
    return newSettings?.length !== prevSettings?.length ? true : analysisSettingsChange
  }

  /**
   * Load configured analysis data sources
   * @param currentDataSourceId current data source id
   * @returns created data source
   */
  loadConfiguredDataSources = (currentDataSourceId: string): Array<Promise<DataSource>> => {
    const mapDs = DataSourceManager.getInstance().getDataSource(currentDataSourceId)
    const createdDs = []
    this.getUniqueDsIds(currentDataSourceId).forEach((dsId) => {
      createdDs.push(new Promise((resolve, reject) => {
        try {
          mapDs?.isDataSourceSet() && mapDs?.createDataSourceById(dsId).then((ds) => {
            resolve(ds)
          }, () => {
            resolve(null)
          })
        } catch {
          resolve(null)
        }
      }))
    })
    return createdDs
  }

  /**
   * Get unique configured ds ids from analysis settings to load the data sources only for the configured layers in analysis settings
   * @param jimuMapViewDataSourceId jimu map view datasource id
   * @returns unique Used Ds Ids
   */
  getUniqueDsIds = (jimuMapViewDataSourceId: string): string[] => {
    const uniqueUsedDsIds = []
    this.props.config?.configInfo?.[jimuMapViewDataSourceId]?.analysisSettings?.layersInfo?.forEach((individualLayer) => {
      !uniqueUsedDsIds.includes(individualLayer.useDataSource.dataSourceId) && uniqueUsedDsIds.push(individualLayer.useDataSource.dataSourceId)
    })
    return uniqueUsedDsIds
  }

  /**
   * handles map view change event
   * @param jimuMapView active map view
   */
  onActiveViewChange = async (jimuMapView: JimuMapView) => {
    this.availableLayersIds = []
    this.isMapViewLoaded = false
    this.isCurrentLocationReplayedOnMapLoad = false
    if (!(jimuMapView && jimuMapView.view)) {
      this.setState({
        isLayerAvailable: false,
        loadingAllFeaturesFromDs: false
      })
      return
    }
    this.setState({
      onWidgetLoadShowLoadingIndicator: true
    })
    await Promise.all(this.loadConfiguredDataSources(jimuMapView.dataSourceId))
    const isLayerAvailableOnMap = jimuMapView.getAllJimuLayerViews().filter((l) => l.type === 'feature')
    if (isLayerAvailableOnMap.length) {
      const allDsLayers = await getConfiguredDsForRuntime(this.getUniqueDsIds(jimuMapView.dataSourceId), jimuMapView.dataSourceId)
      if (allDsLayers.length > 0) {
        allDsLayers.forEach((layer: any) => {
          if (layer?.getLayerDefinition()?.geometryType) {
            this.availableLayersIds.push(layer.id)
          }
        })
      }
      this.setState({
        isLayerAvailable: true,
        onWidgetLoadShowLoadingIndicator: false
      })
    } else {
      this.setState({
        isLayerAvailable: false
      })
    }
    this.mapView = jimuMapView.view
    if (this.state.jimuMapView) {
      this.onClear()
      this.setState({
        analysisSettings: null
      })
    }
    if (jimuMapView) {
      //Check for the search tool from the map, and handle the select-result event
      //so that if anything is searched in the tool we can use that location as incident geometry
      jimuMapView.jimuMapTools?.forEach((tools) => {
        if (tools?.element && tools.name === 'Search') {
          (tools.element as HTMLArcgisSearchElement)?.addEventListener('arcgisSelectResult', (selection) => {
            if (selection?.detail?.result?.feature?.geometry) {
              this.recordSelectedFromAction(selection.detail.result.feature.geometry)
            }
          })
        }
      })
      this.setState({
        jimuMapView: jimuMapView
      }, () => {
        this.createGraphicsLayers()
        this.isMapViewLoaded = true
        if (jimuMapView.dataSourceId === null) {
          this.setState({
            activeDataSource: null
          })
        } else if (this.state.jimuMapView.dataSourceId || this.props.config.configInfo[this.state.jimuMapView.dataSourceId]) {
          this.setState({
            activeDataSource: this.state.jimuMapView.dataSourceId
          }, () => {
            this.setConfigForDataSources()
          })
        }
      })
    }
  }

  /**
   * Set the configured settings for the respective datasource
   */
  setConfigForDataSources = () => {
    if (this.state.jimuMapView.dataSourceId !== '') {
      const activeDsConfig = this.props.config.configInfo[this.state.jimuMapView.dataSourceId]
      this.setState({
        searchSettings: activeDsConfig?.searchSettings,
        analysisSettings: activeDsConfig?.analysisSettings
      }, () => {
        this.isValidLayerConfigured()
        const { showAllFeatures, searchByLocation, searchCurrentExtent } = getSearchWorkflow(this.state.searchSettings)
        if (searchCurrentExtent) {
          this.checkIfFilterMessageActionBinded()
        }
        // If current location is received before map view/config is ready, replay it once map is loaded.
        if (this.isMapViewLoaded && !this.isCurrentLocationReplayedOnMapLoad &&
          this.props.mutableStatePropsVersion?.currentLocation && this.props?.currentLocation) {
          this.isCurrentLocationReplayedOnMapLoad = true
          this.recordSelectedFromAction(this.props.currentLocation)
        }
        const urlParamEnabled = this.props.config.generalSettings?.urlParametersEnabled
        if (searchByLocation && urlParamEnabled) {
          this.getSelectedFeatureRecordsOnLoad()
        }
        //only in case of show all features query the layers once the active data source is changed
        if (showAllFeatures && this.state.jimuMapView && this.state.analysisSettings) {
          this.queryLayers()
          this.resizeLayerListHeight()
        }
      })
    }
  }

  /**
   * Hide the originally hidden configured layers on the map.
   * This is used when the widget switches away from a query mode
   * that temporarily made hidden layers visible.
   */
  hideConfiguredHiddenLayers = () => {
    const jimuMapView = this.state.jimuMapView
    if (!jimuMapView || !this.state.analysisSettings?.displayAllLayersResultOnMap) {
      return
    }

    const hiddenLayerIds = [...this.configuredHiddenLayerIds, ...this.previousHiddenLayerIds]
    hiddenLayerIds.forEach((layerId) => {
      const mapFeatureLayer = jimuMapView.getJimuLayerViewByDataSourceId(layerId)?.layer
      if (mapFeatureLayer && mapFeatureLayer.visible) {
        mapFeatureLayer.visible = false
      }
    })
  }

  /**
   * handles aoiComplete event of aoi-tool component
   * @param aoiGeometries current aoi(buffer/incident) geometries
   */
  onAoiComplete = (aoiGeometries: AoiGeometries) => {
    this.featuresInfoByDsId = {}
    this.featuresByAnalysisId = {}
    this.closestFeatureIdByDsId = {}
    this.printReportData = []
    this.setState({
      aoiGeometries: aoiGeometries
    }, () => {
      this.calculateAoiForPrint(aoiGeometries)
      this.queryLayers()
    })
  }

  /**
   * Calculate the area of interest value for pdf print
   * @param aoiGeometries current aoi(buffer/incident) geometries
   */
  calculateAoiForPrint = async (aoiGeometries: AoiGeometries) => {
    this.aoiValue = ''
    const { searchByLocation } = getSearchWorkflow(this.state.searchSettings)
    if (searchByLocation && aoiGeometries.bufferGeometry !== null && aoiGeometries.bufferGeometry.type === 'polygon') {
      const sr = aoiGeometries.bufferGeometry.spatialReference
      let value: number
      if (sr.wkid === 4326 || sr.isWebMercator || (sr.isGeographic)) {
        if (!geodeticAreaOperator.isLoaded()) {
          await geodeticAreaOperator.load()
        }
        value = geodeticAreaOperator.execute(aoiGeometries.bufferGeometry as Polygon, { unit: ('square-' + aoiGeometries.distanceUnit) as __esri.AreaUnit })
      } else {
        value = areaOperator.execute(aoiGeometries.bufferGeometry as Polygon, { unit: ('square-' + aoiGeometries.distanceUnit) as __esri.AreaUnit })
      }
      this.aoiValue = this.props.intl.formatNumber(value, { maximumFractionDigits: 2 }) + ' ' + this.getSelectedUnitsAbbr(aoiGeometries.distanceUnit as __esri.LengthUnit) + '&sup2'
    }
  }

  /**
   * handles clear event of aoi-tool component, clears aoiGeometries state
   */
  onClear = () => {
    this.destroyHighlightGraphicsLayer()
    this.flashLayer?.removeAll()
    this.featuresInfoByDsId = {}
    this.featuresByAnalysisId = {}
    this.closestFeatureIdByDsId = {}
    this.printReportData = []
    this.resetFeatureForm()
    this.resetFilters()
    this.clearMessageAction()
    this.clearOutPutDataSources()
    this.setState({
      aoiGeometries: null,
      displayLayerAccordion: [],
      isClosestAddressShowing: false,
      msgActionGeometry: null,
      showNoResultsFoundMsg: false,
      queryAborted: false,
      showBatchRetriveAll: true,
      exportProgress: 0
    })
  }

  /**
   * Clear the output data sources status to not ready
   */
  clearOutPutDataSources = () => {
    this.props?.outputDataSources?.forEach((outputDsId) => {
      this.getOutputDataSource(outputDsId)?.setStatus(DataSourceStatus.NotReady)
    })
  }

  /**
   * Handles refresh button clicked event and refresh the result with same AOI
   */
  onRefreshResult = (isAutoRefresh?: boolean) => {
    this.destroyHighlightGraphicsLayer()
    this.flashLayer?.removeAll()
    this.featuresInfoByDsId = {}
    this.featuresByAnalysisId = {}
    this.closestFeatureIdByDsId = {}
    this.printReportData = []
    const { searchByLocation } = getSearchWorkflow(this.state.searchSettings)
    //reset the applied filters from near me widget
    //if autorefresh is disabled, specify location workflow and filter enabled in near me widget
    if (!isAutoRefresh && searchByLocation && this.state.analysisSettings?.onlyShowLayersResult) {
      this.resetFilters()
    }
    this.clearMessageAction()
    this.clearOutPutDataSources()
    this.setState({
      dataSetArray: [],
      showExportOptions: false,
      showFeatureForm: false,
      currentPage: 1,
      showBatchRetriveAll: true,
      exportProgress: 0
    }, () => {
      this.queryLayers(isAutoRefresh)
    })
  }

  /**
   * get analysis type icon for layer
   * @param analysisType analysis type
   * @returns analysis type icon
   */
  getAnalysisTypeIcon = (analysisType: string): IconComponentProps => {
    let analysisTypeIcon: IconComponentProps
    if (analysisType === AnalysisTypeName.Closest) {
      analysisTypeIcon = closestIconComponent
    }
    if (analysisType === AnalysisTypeName.Proximity) {
      analysisTypeIcon = proximityIconComponent
    }
    if (analysisType === AnalysisTypeName.Summary) {
      analysisTypeIcon = summaryComponent
    }
    return analysisTypeIcon
  }

  /**
   * Get the field object with name, alias and type
   * @param field features field
   * @returns each inidvidual field
   */
  getFieldObj = (field: Field): Field => {
    // the function is supported to normalize the field.name
    const fieldName = field.name
    return {
      name: fieldName.replace(/\./g, '_').replace(/\(/g, '_').replace(/\)/g, '_'),
      alias: field.alias,
      type: field.type
    } as any
  }

  /**
   * Get the selected units abbreviation
   * @param selectedUnit selected unit
   * @returns selected unit with abbreviation
   */
  getSelectedUnitsAbbr = (selectedUnit: __esri.LengthUnit): string => {
    const distanceUnit = distanceUnitWithAbbr.find(unit => unit.value === selectedUnit)
    const selectedUnitAbbreviation = this.nls(distanceUnit.abbreviation)
    return selectedUnitAbbreviation
  }

  /**
   * Create each graphics layers to show on the map
   */
  createGraphicsLayers = () => {
    if (this.bufferLayer) {
      this.bufferLayer.destroy()
    }
    if (this.drawingLayer) {
      this.drawingLayer.destroy()
    }
    if (this.flashLayer) {
      this.flashLayer.destroy()
    }
    if (this.highlightLayer) {
      this.highlightLayer.destroy()
    }
    this.bufferLayer = new GraphicsLayer({ listMode: 'hide' })
    this.drawingLayer = new GraphicsLayer({ listMode: 'hide' })
    this.highlightLayer = new GraphicsLayer({ listMode: 'hide' })
    this.flashLayer = new GraphicsLayer({ listMode: 'hide', effect: 'bloom(0.8, 1px, 0)' })
    this.state.jimuMapView?.view?.map?.addMany([this.bufferLayer, this.drawingLayer, this.flashLayer, this.highlightLayer])
  }

  /**
   * Clears the record selection change message action executed by widget
   * Removes the highlight bar
   */
  clearMessageAction = () => {
    //unselects all the records selected by widget
    //clear the selection from the map only when the feature is selected
    if (this.selectedRecord?.dataSource && this.selectedRecord.dataSource.dataViewId !== CONSTANTS.SELECTION_DATA_VIEW_ID) {
      MessageManager.getInstance().publishMessage(new DataRecordsSelectionChangeMessage(this.props.id, [], [this.selectedRecord?.dataSource?.id]))
    }
    //removes the highlight bar from popup
    if (this.selectedPopupContainer) {
      this.selectedPopupContainer.style.borderColor = transparentColor
    }
    this.selectedPopupContainer?.classList?.remove('record-selected')
    //clears the highlight selection of the record from map
    if (this.selectedRecord?.dataSource?.dataViewId !== CONSTANTS.SELECTION_DATA_VIEW_ID) {
      this.selectedRecord?.dataSource?.clearSelection()
    }
    //clear all the variables related to selected record
    this.selectedRecord = null
    this.selectedPopupContainer = null
    this.selectedRecordsKey = ''
  }

  /**
   * Highlights the popup html dom and publish record selection change message action
   * @param record DataRecord to be selected
   */
  selectMessageAction = (record: DataRecord) => {
    //add class to show highlight bar in popup
    if (this.selectedPopupContainer) {
      this.selectedPopupContainer.style.borderColor = this.props.theme?.sys.color?.primary.main
    }
    this.selectedPopupContainer?.classList?.add('record-selected')
    if (record?.dataSource?.dataViewId !== CONSTANTS.SELECTION_DATA_VIEW_ID) {
      //publish record select message
      MessageManager.getInstance().publishMessage(
        new DataRecordsSelectionChangeMessage(this.props.id, [record], [record.dataSource?.id])
      )
      //highlight the record on map
      if (!this.skipHighlightRecordsOnMap) {
        this.skipDsInfoChange = true
        record.dataSource?.selectRecordsByIds([record.getId()], [record])
      }
    }
    this.skipHighlightRecordsOnMap = false
    this.selectedRecord = record
  }

  /**
   * Highlight hovered feature on map even though the layers are hide from the map
   * @param featureRecord hovered feature record
   * @param showLayer if hovered then show highlight layer
   */
  highlightFeatureOnMap = (featureRecord: DataRecord, showHighlight: boolean) => {
    if (showHighlight) {
      this.highlightLayer.removeAll()
      //reorder the highlight layer to be on top so that the hover highlight graphics is visible on map
      this.state.jimuMapView?.view.map.reorder(this.highlightLayer, this.state.jimuMapView?.view.map.layers.length - 1)
      const graphics = getHighLightSymbol((featureRecord as any).getFeature(), '#FFFF00')
      this.highlightLayer?.add(graphics)
    } else {
      this.highlightLayer.removeAll()
    }
  }

  /**
   * On clicking or opening the feature details selects or unselect the records
   * Currently only single selection is supported
   * @param key Unique index for each feature
   * @param popupContainer HTML dom ref to show the highlight bar
   * @param record DataRecord to be selected/unselected
   */
  executeSelectMessageAction = (key: string, popupContainer: HTMLDivElement, record: DataRecord) => {
    if (this.selectedRecordsKey === key) {
      this.clearMessageAction()
    } else if (this.selectedRecordsKey !== key) {
      if (this.selectedRecordsKey) {
        this.clearMessageAction()
      }
      this.selectedPopupContainer = popupContainer
      this.selectedRecordsKey = key
      this.selectMessageAction(record)
    }
  }

  /**
    * On clicking or closing the feature details unselect the records
    * Clear only when the key is of previously selected record
    * @param key Unique index for each feature
    */
  executeClearMessageAction = (key: string) => {
    if (this.selectedRecordsKey === key) {
      this.clearMessageAction()
    }
  }

  /**
   * Update the layer accordian features
   * If same layer is configured then update the features for same layer analysis
   * @param dsId datasource id
   * @param features feature records
   */
  updateLayerAccordian = (dsId: string, analysisId: string, features: DataRecord[]) => {
    ;(this.layerAccordionRefs as any)?.forEach((elm: LayerAccordion) => {
      if (elm) {
        if (elm.props.analysisType === AnalysisTypeName.Closest && elm.props.analysisId === analysisId && this.checkOnlyClosestConfiguredForDS(dsId)) {
          const ds = getSelectedLayerInstance(dsId) as any
          if (ds) {
            const uniqueIdFields = ds?.getUniqueIdFields?.() ?? []
            const idField = ds?.getIdField?.()
            const featureRecord = features[0] as FeatureDataRecord
            if (featureRecord) {
              const attrs = featureRecord.getFeature()?.attributes ?? {}
              let closestRecordId: any = null
              if (uniqueIdFields.length > 1) {
                closestRecordId = {}
                uniqueIdFields.forEach((fieldName) => {
                  closestRecordId[fieldName] = attrs[fieldName]
                })
              } else {
                const objIdField = uniqueIdFields[0] ?? idField
                closestRecordId = attrs[objIdField]
              }
              this.closestFeatureIdByDsId[dsId] = closestRecordId
              this.filterToOnlyShowResultFeatures(dsId, closestRecordId)
            }
          }
        }
        const props = elm.props
        if (props.analysisId !== analysisId && props.dsId === dsId && props.analysisType !== AnalysisTypeName.Closest &&
          elm.allIntersectingFeatures.length !== elm.state.updatedFeatureCount) {
          elm.updateFeatures(features as unknown as FeatureDataRecord[])
        }
        if (!this.featuresInfoByDsId[dsId]?.records) {
          this.featuresInfoByDsId[dsId].records = features
        }
      }
    })
  }

  /**
   * Remove the layer accordian from the list when there is no features to show
   * @param analysisId analysis id to remove the layer accordian
   */
  removeLayerAccordion = (analysisId: string) => {
    const layerAccordionIndex = this.state.displayLayerAccordion.findIndex((accordion) => accordion.props.analysisId === analysisId)
    if (layerAccordionIndex > -1) {
      const items = this.state.displayLayerAccordion.filter((accordion, index) => index !== layerAccordionIndex)
      this.setState({
        displayLayerAccordion: items,
        showNoResultsFoundMsg: items.length === 0,
      })
    }
  }

  /**
   * Update the group and subgroup information for a specific analysis
   * @param analysisId The ID of the analysis
   * @param groupSubGroupInfo The group and subgroup information to update
   */
  updateGroupSubGroupInfo = (analysisId: string, groupSubGroupInfo: any) => {
    const analysisResult = this.analysisLayersResults.find((result) => result.layerInfo.analysisInfo.analysisId === analysisId)
    if (analysisResult) {
      analysisResult.featuresAndGroup = groupSubGroupInfo
    }
  }

  /**
   * Get the feature record count for the configured layer
   * @param layerInfo configured layers info
   * @returns records promise
   */
  getRecordsCount = async (layerInfo: LayersInfo) => {
    const dsId = layerInfo.useDataSource.dataSourceId
    const ds = getSelectedLayerInstance(layerInfo.useDataSource.dataSourceId) as FeatureLayerDataSource
    if (!ds) {
      return Promise.resolve()
    }
    const promise = new Promise((resolve, reject) => {
      // use abortController to make the selecting task cancelable
      const abortController = new AbortController()
      this.abortControllerRef.push(abortController)

      let bufferGeometry = null
      //in case of show all features return geometry will be false, we will get geometry only when search area is defined
      const { searchByLocation, searchCurrentExtent } = getSearchWorkflow(this.state.searchSettings)
      if (searchByLocation || searchCurrentExtent) {
        //set buffer geometry
        if (this.state.aoiGeometries?.bufferGeometry) {
          bufferGeometry = this.state.aoiGeometries.bufferGeometry
        } else {
          bufferGeometry = this.state.aoiGeometries.incidentGeometry
        }
      }
      let outFields
      this.props.useDataSources.forEach((dataS) => {
        if (dataS.dataSourceId === ds.id) {
          outFields = dataS.fields ?? []
        }
      })
      getFeaturesCount(ds, bufferGeometry, this.state.jimuMapView.view.spatialReference, outFields, abortController.signal).then((count: number) => {
        this.featuresInfoByDsId[dsId] = {
          records: [],
          count: count
        }
        resolve(count)
      }, (err) => {
        resolve(null)
      })
    })
    return promise
  }

  /**
   * perform the analysis on the features
   * @param layerInfo configured layers info
   * @returns promise of the feature set
   */
  performAnalysis = async (layerInfo) => {
    const dsId: string = layerInfo.useDataSource.dataSourceId
    const ds = getSelectedLayerInstance(dsId) as any
    const allowExport = await ds.allowToExportData()
    const isClosestAnalysis = AnalysisTypeName.Closest === layerInfo.analysisInfo.analysisType
    const promise = new Promise((resolve, reject) => {
      if (this.featuresInfoByDsId.hasOwnProperty(dsId)) {
        //clone the featuresInfoByDsId array
        let featureCount
        if (this.featuresInfoByDsId[dsId].count) {
          featureCount = isClosestAnalysis ? 1 : this.featuresInfoByDsId[dsId].count
        }
        const featureSet = {
          count: featureCount,
          layerInfo: layerInfo,
          allowExport: allowExport
        }
        resolve(featureSet)
      }
    })
    return promise
  }

  /**
   * Resize the layers list height depending whether the closest address is showing
   * @param isClosestAddressShowing whether the closest address is showing
   */
  resizeLayerListHeight = () => {
    if (this.divRef?.current) {
      const { searchByLocation, showAllFeatures, searchCurrentExtent } = getSearchWorkflow(this.state.searchSettings)
      const rawOffsetHeight = this.divRef.current.offsetHeight
      const toolbarNode = this.divRef.current.querySelector('.top-button-list')
      let toolbarHeightInFlow = 0
      if (toolbarNode) {
        const toolbarStyle = window.getComputedStyle(toolbarNode)
        toolbarHeightInFlow = toolbarNode.getBoundingClientRect().height +
          (parseFloat(toolbarStyle.marginTop) || 0) +
          (parseFloat(toolbarStyle.marginBottom) || 0)
      }
      // Keep existing resize logic, but normalize measurement to exclude in-flow action toolbar height.
      const offsetHeight = Math.max(rawOffsetHeight - toolbarHeightInFlow, 0)
      const layerContainerTopMargin = 4
      //Height of the refresh/delete button to be added if title is in multiple rows
      const refreshDeleteButtonHeight = this.props.theme.ref.typeface.htmlFontSize === '125%' ? 35 : 27
      //calculate the value of list height
      let divHeight = offsetHeight
      //In case of Search by location, we will always have delete and refresh button, so add refreshDeleteButtonHeight in the offset height
      //In case of Show all feature, based on if multiple rows are shown or single or no heading label calculate height
      //In case of current extent, we will show the batch export button, so add refreshDeleteButtonHeight in the offset height
      if (searchByLocation || searchCurrentExtent) {
        divHeight = offsetHeight + refreshDeleteButtonHeight
      } else if (showAllFeatures) {
        if (this.props.theme.ref.typeface.htmlFontSize === '125%') {
          //means no label
          if (offsetHeight <= 34) {
            divHeight = 35
          } else if (offsetHeight > 34) {
            //means multiple rows
            divHeight = offsetHeight + refreshDeleteButtonHeight
          }
        } else {
          //means no label
          if (offsetHeight <= 28) {
            divHeight = 28
          } else if (offsetHeight > 28) {
            //means multiple rows
            divHeight = offsetHeight + refreshDeleteButtonHeight
          }
        }
      }
      this.setState({
        listMaxHeight: 'calc(100% - ' + (divHeight + layerContainerTopMargin) + 'px)'
      })
    }
  }

  /**
   * Destroy/remove the highlight graphics layers
   */
  destroyHighlightGraphicsLayer = () => {
    this.highlightGraphicsLayers.forEach((layer) => {
      if (layer) {
        layer.removeAll()
        layer.destroy()
      }
    })
    this.highlightGraphicsLayers = []
  }

  /**
   * On layer toggle make the layer visible
   * @param index Index of each layer toggle
   * @param isExpanded check whether the layer section is expanded
   */
  onLayerToggle = (analysisId: string, isExpanded: boolean) => {
    if (this.highlightGraphicsLayers?.length > 0) {
      const layer = this.highlightGraphicsLayers.find((layer) => layer?.id === analysisId + '_' + this.props.widgetId)
      if (layer) {
        if (isExpanded) {
          layer.visible = true
        } else {
          layer.visible = false
        }
      }
    }
  }

  /**
   * Queries only unique layers from the configured analysis starts display layer analysis
   */
  queryLayers = lodash.debounce((isAutoRefresh?: boolean) => {
    this.setState({
      showNoResultsFoundMsg: false,
      queryAborted: false,
      displayLayerAccordion: [],
      analysisTakingLongerTime: false
    }, () => {
      let minTimeOut = setTimeout(() => {
        if (minTimeOut) {
          clearTimeout(minTimeOut)
          minTimeOut = null
        }
        this.setState({
          analysisTakingLongerTime: true
        })
      }, 10000)
      this.destroyHighlightGraphicsLayer()
      const { showAllFeatures, searchByLocation, searchCurrentExtent } = getSearchWorkflow(this.state.searchSettings)
      //reset the applied filters from near me widget
      //if autorefresh is disabled, specify location workflow and filter enabled in near me widget
      if (!isAutoRefresh && searchByLocation && this.state.analysisSettings?.onlyShowLayersResult) {
        this.resetFilters()
      }
      this.clearMessageAction()
      const defArray: Array<Promise<any>> = []
      const queriedLayers: string[] = []
      const shouldShowLayerInResult = this.state.analysisSettings?.displayAllLayersResult
      if (shouldShowLayerInResult) {
        // Before recomputing visibility for this query, restore layers that were initially hidden.
        this.previousHiddenLayerIds = [...this.configuredHiddenLayerIds]
        // Track layers that are configured as hidden in the map on initial query
        this.configuredHiddenLayerIds = []
      } else {
        // No temporary layer visibility changes are needed when results are not displayed on the map.
        this.previousHiddenLayerIds = []
        this.configuredHiddenLayerIds = []
      }
      if ((showAllFeatures || ((searchByLocation || searchCurrentExtent) && this.state.aoiGeometries)) && this.state.jimuMapView &&
        this.state.analysisSettings?.layersInfo?.length > 0) {
        this.state.analysisSettings.layersInfo.forEach((layerInfo: LayersInfo) => {
          //Loop through all analysis layers settings configuration
          //Any layer which does not falls in the layer arrays
          //are not present in the webmap/webscene
          //skip analysis for those layers
          const dsIdForLayerView = layerInfo.useDataSource.dataViewId ? layerInfo.useDataSource.mainDataSourceId : layerInfo.useDataSource.dataSourceId
          const mapFeatureLayer = this.state.jimuMapView.getJimuLayerViewByDataSourceId(dsIdForLayerView)?.layer
          if (mapFeatureLayer && (this.availableLayersIds.includes(layerInfo.useDataSource.dataSourceId) ||
            (layerInfo.useDataSource.dataViewId && this.availableLayersIds.includes(layerInfo.useDataSource.mainDataSourceId))) && ((!mapFeatureLayer.visible && shouldShowLayerInResult) || mapFeatureLayer.visible)) {
            // Track layers that are initially hidden in the map
            if (!mapFeatureLayer.visible && shouldShowLayerInResult) {
              if (!this.configuredHiddenLayerIds.includes(dsIdForLayerView)) {
                this.configuredHiddenLayerIds.push(dsIdForLayerView)
              }
            }
            const dsId: string = layerInfo?.useDataSource?.dataSourceId
            if (dsId && !queriedLayers.includes(dsId)) {
              queriedLayers.push(dsId)
              //Live mode: if analysis setting is changed then query only for newly added layers
              if (!this.featuresInfoByDsId[dsId]) {
                defArray.push(this.getRecordsCount(layerInfo))
              }
            }
          } else {
            const dsId: string = layerInfo?.useDataSource?.dataSourceId
            this.featuresInfoByDsId[dsId] = {
              records: [],
              count: 0
            }
            defArray.push(Promise.resolve([]))
          }
        })
      }
      Promise.all(defArray).then(() => {
        this.abortControllerRef = []
        if (minTimeOut) {
          clearTimeout(minTimeOut)
          minTimeOut = null
        }
        this.setState({
          analysisTakingLongerTime: false
        }, () => {
          setTimeout(() => {
            this.displayAnalysisLayerInfo(isAutoRefresh)
          }, 500)
        })
      })
    })
  }, 300)

  /**
   * Get configured fields to export
   * @param analysisId analysis id
   * @returns configured fields to export
   */
  getFieldsToExport = (analysisId): string[] => {
    let configFieldsToExport: string[] = []
    const configLayersInfo = this.state.analysisSettings?.layersInfo
    const { searchByLocation } = getSearchWorkflow(this.state.searchSettings)
    configLayersInfo.forEach((layerInfo) => {
      if (layerInfo.analysisInfo.analysisId === analysisId) {
        if (layerInfo.analysisInfo.fieldsToExport?.length > 0) {
          const updatedFieldsToExport = [...layerInfo.analysisInfo.fieldsToExport]
          //in case of only search by location show the approximate distance fields in the exported CSV if available
          if (!searchByLocation && layerInfo.analysisInfo.fieldsToExport.includes('esriCTApproxDistance')) {
            updatedFieldsToExport.splice(layerInfo.analysisInfo.fieldsToExport.indexOf('esriCTApproxDistance'), 1)
          }
          configFieldsToExport = updatedFieldsToExport
        } else { //if no configured fields then fallback to take all the field names
          configFieldsToExport = getAllFieldsNames(layerInfo.useDataSource.dataSourceId)
        }
      }
    })
    return configFieldsToExport
  }

  /**
   * loop through analysis setting layer infos and display layers accordion
   */
  displayAnalysisLayerInfo = (isAutoRefresh?: boolean) => {
    this.printReportData = []
    this.clearOutPutDataSources()
    const items: React.JSX.Element[] = []
    this.proximityCountDataSetArr = []
    this.setState({
      dataSetArray: [],
      showBatchRetriveAll: true,
      exportProgress: 0
    })
    if (this.state.displayLayerAccordion.length > 0) {
      this.setState({
        showNoResultsFoundMsg: false,
        queryAborted: false,
        displayLayerAccordion: []
      })
      this.destroyHighlightGraphicsLayer()
      this.clearMessageAction()
    }
    const defArray = []
    const configLayersInfo = this.state.analysisSettings?.layersInfo
    const { showAllFeatures, searchByLocation, searchCurrentExtent } = getSearchWorkflow(this.state.searchSettings)
    if ((showAllFeatures || ((searchByLocation || searchCurrentExtent) && this.state.aoiGeometries)) && this.state.jimuMapView &&
      configLayersInfo?.length > 0) {
      let totalAnalysisResult: number = 0
      //find out the number of analysis results returned
      configLayersInfo.forEach((layerInfo, index) => {
        const analysisId = layerInfo.analysisInfo.analysisId ?? index.toString()
        const filteredFeaturesCount = this.featuresByAnalysisId[analysisId] ?? this.featuresInfoByDsId[layerInfo.useDataSource.dataSourceId]?.count
        if (layerInfo.analysisInfo.analysisType === AnalysisTypeName.Closest) {
          if (filteredFeaturesCount > 0) {
            totalAnalysisResult += 1
          }
        } else {
          totalAnalysisResult += filteredFeaturesCount ?? 0
        }
      })
      const isReturnOneAnalysisResult = totalAnalysisResult === 1
      configLayersInfo.forEach((layerInfo, index) => {
        //if show all features or map area is on then don't show closest analysis type layers
        if (!((showAllFeatures || searchCurrentExtent) && layerInfo.analysisInfo.analysisType === AnalysisTypeName.Closest)) {
          //Loop through all analysis layers settings configuration
          //Any layer which does not falls in the layer arrays
          //are not present in the webmap/webscene
          //skip analysis for those layers
          if (this.availableLayersIds.includes(layerInfo.useDataSource.dataSourceId) ||
            (layerInfo.useDataSource.dataViewId && this.availableLayersIds.includes(layerInfo.useDataSource.mainDataSourceId))) {
            defArray.push(this.performAnalysis(layerInfo))
          }
        }
      })
      Promise.all(defArray).then((results) => {
        if (results.length) {
          this.analysisLayersResults = results
        }
        const retrievedOnLoad = []
        results.forEach((result, index: number) => {
          if (result?.count > 0) {
            let groupFeaturesObj = null
            if (result.layerInfo.analysisInfo.groupFeaturesEnabled && result.layerInfo.analysisInfo.groupFeatures.groupFeaturesByField) {
              groupFeaturesObj = {
                field: result.layerInfo.analysisInfo.groupFeatures.groupFeaturesByField,
                sortOrder: result.layerInfo.analysisInfo.groupFeatures.groupFeaturesOrder,
                sortByCount: result.layerInfo.analysisInfo.groupFeatures.sortGroupsByCount,
                noValueLabel: result.layerInfo.analysisInfo.groupFeatures.noValueGroupLabel
              }
            }

            let canToggle: boolean = true
            // don't expand features list if summary is not added
            if (result.layerInfo.analysisInfo.analysisType === 'summary') {
              const areaOrLengthFieldConfigured = result.layerInfo.analysisInfo.summaryFields.some(({ summaryFieldInfo: sfi }) => sfi?.summaryBy === CommonSummaryFieldValue.SumOfIntersectedArea || sfi?.summaryBy === CommonSummaryFieldValue.SumOfIntersectedLength
              )
              if (searchByLocation) {
                canToggle = result.layerInfo.analysisInfo.summaryFields.length > 0
              } else {
                canToggle = (areaOrLengthFieldConfigured && result.layerInfo.analysisInfo.summaryFields.length === 1) ? false : result.layerInfo.analysisInfo.summaryFields.length > 0
              }
            }
            const dsId = result.layerInfo.useDataSource.dataSourceId
            const canExportData: boolean = this.state.showExportButton && result.allowExport
            const expandLayer: boolean = result.layerInfo.analysisInfo.expandOnOpen
            // Filter layers to show only the result except closest anlaysis
            if (!isAutoRefresh && searchByLocation && this.state.analysisSettings?.onlyShowLayersResult && !this.checkOnlyClosestConfiguredForDS(dsId)) {
              this.filterToOnlyShowResultFeatures(dsId)
            }
            let shouldRetrieveOnLoad = false
            const isClosestAnalysis = result.layerInfo.analysisInfo.analysisType === AnalysisTypeName.Closest
            // Closest should always resolve its single record on load (when count > 0),
            // even if another analysis for the same data source was already retrieved.
            if (isClosestAnalysis || (!retrievedOnLoad.includes(result.layerInfo.useDataSource.dataSourceId) && result.count <= maxRecordCountThreshold)) {
              shouldRetrieveOnLoad = true
              if (!isClosestAnalysis) {
                retrievedOnLoad.push(result.layerInfo.useDataSource.dataSourceId)
              }
            }
            items.push(<LayerAccordion
              theme={this.props.theme}
              key={index}
              intl={this.props.intl}
              widgetId={this.props.widgetId}
              label={result.layerInfo.label}
              aoiGeometries={this.state.aoiGeometries}
              analysisIcon={this.state.analysisSettings?.displayAnalysisIcon ? this.getAnalysisTypeIcon(result.layerInfo.analysisInfo.analysisType) : null}
              featureCount={result?.count}
              folderUrl={this.props.context.folderUrl}
              isExpanded={expandLayer}
              isListView={true}
              index={index}
              dsId={dsId}
              analysisId={result.layerInfo.analysisInfo.analysisId}
              analysisType={result.layerInfo.analysisInfo.analysisType}
              layerInfo={result.layerInfo}
              mapView={this.state.jimuMapView}
              useDataSources={this.props.useDataSources}
              ref={(el) => { this.layerAccordionRefs[index] = el }}
              showExportButton={canExportData}
              shouldRetrieveFeaturesOnLoad={shouldRetrieveOnLoad}
              onToggle={this.onLayerToggle}
              searchSettings={this.state.searchSettings}
              analysisSettings={this.state.analysisSettings}
              canToggle={canToggle}
              incidentGraphic={this.incidentGraphic}
              isReturnOneAnalysisResult={isReturnOneAnalysisResult}
              graphicLayer={this.flashLayer}
              groupSubGroupFeaturesObj={groupFeaturesObj}
              highlightFeature={this.highlightFeatureOnMap}
              selectRecord={this.executeSelectMessageAction}
              clearRecord={this.executeClearMessageAction}
              onUpdateDataActionDataSet={this.updateDataActionDataSet}
              onAllFeaturesFetched={this.updateLayerAccordian}
              onGroupSubGroupInfoUpdated={this.updateGroupSubGroupInfo}
              createHighlightGraphicsForLayer={this.createHighlightGraphicsForLayer}
              onUpdateProximityCountDataActionDataSet={(dataSet) => { this.proximityCountDataSetArr.push(dataSet) }}
              onRemoveLayerAccordion={this.removeLayerAccordion}>
            </LayerAccordion>)
          }
        })
        const saveFeatureConfig = this.getSaveFeaturesConfig(items.length > 0)
        this.setState({
          showSaveIcon: saveFeatureConfig.anyInputFeatureEnabled || saveFeatureConfig.onlySearchAreaEnabled,
          displayLayerAccordion: items,
          showNoResultsFoundMsg: items.length === 0,
          loadingAllFeaturesFromDs: false
        }, () => {
          // Enable/hide configured layers based on Near Me results and original map-hidden state.
          const hiddenLayerIds = [...this.previousHiddenLayerIds, ...this.configuredHiddenLayerIds]
          configLayersInfo.forEach((layerInfo, index) => {
            const dsIdForLayerView = layerInfo.useDataSource.dataViewId ? layerInfo.useDataSource.mainDataSourceId : layerInfo.useDataSource.dataSourceId
            const hasNearMeResults = this.state.displayLayerAccordion.some((accordion) => {
              return accordion?.props?.dsId === layerInfo.useDataSource.dataSourceId
            })
            if (this.availableLayersIds.includes(layerInfo.useDataSource.dataSourceId) ||
              (layerInfo.useDataSource.dataViewId && this.availableLayersIds.includes(layerInfo.useDataSource.mainDataSourceId))) {
              const mapFeatureLayer = this.state.jimuMapView.getJimuLayerViewByDataSourceId(layerInfo.useDataSource.dataSourceId)?.layer
              if (mapFeatureLayer && this.state.analysisSettings.displayAllLayersResultOnMap) {
                if (hasNearMeResults && !mapFeatureLayer.visible) {
                  mapFeatureLayer.visible = true
                } else if (!hasNearMeResults && hiddenLayerIds.includes(dsIdForLayerView) && mapFeatureLayer.visible) {
                  mapFeatureLayer.visible = false
                }
              }
            }
          })
        })
      })
    }
  }

  /**
   * Create highlighting graphics for the selected feature
   * @param records feature records
   * @param isVisible whether highlight layer is visible
   * @param highlightResults whether layer results highlighted on map
   * @param highlightResultsColor highlight layer with configured color
   */
  createHighlightGraphicsForLayer = (analysisId: string, records: DataRecord[], isVisible: boolean, highlightResults: boolean, highlightResultsColor: string, clipFeatures: boolean) => {
    const layerId = analysisId + '_' + this.props.widgetId
    const highlightLayerPresent = this.highlightGraphicsLayers.some((layer) => layer.id === layerId)
    if (highlightResults && !highlightLayerPresent) {
      const highlightLayer = new GraphicsLayer({ listMode: 'hide', visible: isVisible })
      highlightLayer.id = analysisId + '_' + this.props.widgetId
      this.highlightGraphicsLayers.push(highlightLayer)
      this.state.jimuMapView?.view.map.addMany([highlightLayer])
      //reorder the flash layer to be on top so that the flashed graphics is visible on map
      this.state.jimuMapView?.view.map.reorder(this.flashLayer, this.state.jimuMapView?.view.map.layers.length - 1)
      records.forEach((record) => {
        const featureRecord = record as any
        const feature = featureRecord.getFeature()
        const graphic = getHighLightSymbol(feature, colorUtils.parseThemeVariable(highlightResultsColor, this.props.theme))
        if (clipFeatures && this.state.aoiGeometries?.incidentGeometry) {
          //clip the geometry if clip feature is enabled and AOI geometry is present
          const clippedGeometry = intersectionOperator.execute(feature.geometry, (this.state.aoiGeometries.bufferGeometry ?? this.state.aoiGeometries.incidentGeometry) as __esri.GeometryUnion)
          if (clippedGeometry) {
            graphic.geometry = clippedGeometry
          }
          //calculate area or lenght based on the type of clipped geometry
          if (clippedGeometry?.type === 'polygon') {
            const area = this.getArea([record], clippedGeometry, this.state.aoiGeometries.distanceUnit || this.state.searchSettings.distanceUnits || getPortalUnit())
            feature.attributes = {
              ...graphic.attributes,
              esriCTClippedInfo: Number(area).toString()
            }
          } else if (clippedGeometry?.type === 'polyline') {
            const length = this.getLength([record], clippedGeometry, this.state.aoiGeometries.distanceUnit || this.state.searchSettings.distanceUnits || getPortalUnit())
            feature.attributes = {
              ...graphic.attributes,
              esriCTClippedInfo: Number(length).toString()
            }
          }
        }
        if (highlightLayer && graphic) {
          highlightLayer.add(graphic)
        }
      })
    }
  }

  /**
   * Get the intersected area for polygon feature
   * @param featureRecords selected features records
   * @param geoms geometry of the features
   * @param distanceUnits config distance units
   * @returns formatted value or area
   */
  getArea = (featureRecords: DataRecord[], geoms: __esri.GeometryUnion, distanceUnits: string): number => {
    let value: number = 0
    const units = ('square-' + distanceUnits) as __esri.AreaUnit
    featureRecords.forEach(async featureRecord => {
      const selectedFeatureRecord = featureRecord as any
      let intersectGeom
      if (geoms) {
        intersectGeom = intersectionOperator.execute(selectedFeatureRecord.feature.geometry, geoms)
      } else {
        intersectGeom = selectedFeatureRecord.feature.geometry
      }
      if (intersectGeom !== null) {
        const sr = intersectGeom.spatialReference
        if (sr.wkid === 4326 || sr.isWebMercator || (sr.isGeographic)) {
          if (!geodeticAreaOperator.isLoaded()) {
            await geodeticAreaOperator.load()
          }
          value += geodeticAreaOperator.execute(intersectGeom, { unit: units })
        } else {
          value += areaOperator.execute(intersectGeom, { unit: units })
        }
      }
    })
    return value
  }

  /**
   * Get the intersected length for polyline feature
   * @param featureRecords selected features records
   * @param geoms geometry of the features
   * @param distanceUnits config distance units
   * @returns formatted value or length
   */
  getLength = (featureRecords: DataRecord[], geoms: __esri.GeometryUnion, distanceUnits: string): number => {
    let value: number = 0
    const units = distanceUnits as __esri.LengthUnit
    featureRecords.forEach(async featureRecord => {
      const selectedFeatureRecord = featureRecord as any
      let intersectGeom
      if (geoms) {
        intersectGeom = intersectionOperator.execute(selectedFeatureRecord.feature.geometry, geoms)
      } else {
        intersectGeom = selectedFeatureRecord.feature.geometry
      }
      if (intersectGeom !== null) {
        const sr = intersectGeom.spatialReference
        if (sr.wkid === 4326 || sr.isWebMercator || (sr.isGeographic)) {
          if (!geodeticLengthOperator.isLoaded()) {
            await geodeticLengthOperator.load()
          }
          value += geodeticLengthOperator.execute(intersectGeom, { unit: units })
        } else {
          value += lengthOperator.execute(intersectGeom, { unit: units })
        }
      }
    })
    return value
  }

  /**
   * Retrieves config value of save input features and search area
   * @param resultsFound
   * @returns save features config
   */
  getSaveFeaturesConfig = (resultsFound: boolean) => {
    const saveFeatureConfig = {
      anyInputFeatureEnabled: false,
      onlySearchAreaEnabled: false
    }
    if (resultsFound && !(this.state.searchSettings?.searchByActiveMapArea && this.state.searchSettings?.includeFeaturesOutsideMapArea)) {
      if (this.state.analysisSettings?.saveFeatures?.saveInputLocation) {
        const drawnIncidentGeometryType = this.state.aoiGeometries.incidentGeometry.type
        // eslint-disable-next-line @typescript-eslint/switch-exhaustiveness-check
        switch (drawnIncidentGeometryType) {
          case 'point':
            saveFeatureConfig.anyInputFeatureEnabled = this.state.analysisSettings.saveFeatures.pointFeature.enabled && !!this.state.analysisSettings.saveFeatures.pointFeature.useDataSource
            break
          case 'polyline':
            saveFeatureConfig.anyInputFeatureEnabled = this.state.analysisSettings.saveFeatures.polylineFeature.enabled && !!this.state.analysisSettings.saveFeatures.polylineFeature.useDataSource
            break
          case 'polygon':
            saveFeatureConfig.anyInputFeatureEnabled = this.state.analysisSettings.saveFeatures.polygonFeature.enabled && !!this.state.analysisSettings.saveFeatures.polygonFeature.useDataSource
            break
        }
      }
      // if all input locations are disabled then only check for save search area
      if (!saveFeatureConfig.anyInputFeatureEnabled) {
        saveFeatureConfig.onlySearchAreaEnabled = this.state.aoiGeometries?.bufferDistance > 0 && this.state.analysisSettings.saveFeatures?.searchAreaFeature?.enabled && !!this.state.analysisSettings.saveFeatures?.searchAreaFeature?.useDataSource
      }
    }
    return saveFeatureConfig
  }

  /**
   * Build output datasource for each accordian and updates the progess
   */
  onBatchRetriveAllClick = async () => {
    this.setState({
      showBatchRetriveAll: false,
      exportProgress: 0
    })
    for (let i = 0; i < (this.layerAccordionRefs as any)?.length; i++) {
      const elm = (this.layerAccordionRefs as any)[i]
      // check if expand button is not disabled then prepare the data for export and build output data source for each layer one by one, so that the progress can be shown incrementally
      if (elm && !elm?.expandButtonRef?.current?.disabled) {
        const outputDsId = getOutputDsId(this.props.widgetId, elm.props.analysisType, elm.props.analysisId)
        const ds = this.getOutputDataSource(outputDsId)
        const isOutputDsReady = ds && ds.getStatus() !== DataSourceStatus.NotReady
        if (!isOutputDsReady) {
          await elm.prepareExportData(true)
        }
        // Add a small delay to show the export progress incrementally
        await new Promise((resolve) => { setTimeout(resolve, 500) })
        const exportProgress = Math.round(((i + 1) / this.state.displayLayerAccordion.length) * 100)
        this.setState({
          exportProgress: exportProgress === 100 ? exportProgress : exportProgress - 1 //To should progress use this logic
        })
      }
    }
  }

  /**
   * Update data action data set
   * @param dataActionDataSet data record set array
   * @returns promise
   */
  updateDataActionDataSet = (dataActionDataSet: DataRecordSet[]): void => {
    // If data action array is empty then only check if all output ds are ready or not
    if (dataActionDataSet.length === 0) {
      this.setState({
        showBatchRetriveAll: !this.state.showBatchRetriveAll ? false : !this.areAllLayerOutputDsReady(),
        exportProgress: this.areAllLayerOutputDsReady() ? 100 : 0
      })
      return
    }
    // Add a small delay to allow DS status to update before checking readiness
    setTimeout(() => {
      this.setState((prevState) => ({
        showBatchRetriveAll: !prevState.showBatchRetriveAll ? false : !this.areAllLayerOutputDsReady(),
        dataSetArray: [...prevState.dataSetArray, ...dataActionDataSet],
        dataSetUpdated: !prevState.dataSetUpdated
      }), () => {
        if (this.areAllLayerOutputDsReady()) {
          this.setState({
            exportProgress: 100
          })
        }
      })
    }, 100)
  }

  /**
   * Get output data source from data source manager instance
   * @param outputDs output data source id
   * @returns output data source
   */
  getOutputDataSource = (outputDsId: string) => {
    return DataSourceManager.getInstance().getDataSource(outputDsId)
  }

  /**
   * Set current widget width
   * @param widgetWidth widget width
   */
  onResize = ({ width, height }) => {
    //if widget size is below 306 then show value in next row
    //else show label and value in one row
    this.setState({
      widgetWidth: width
    })
    this.resizeLayerListHeight()
  }

  /**
   * Update state to know closest Address is Showing or not
   * @param isClosestAddressShowing if closest address is showing
   */
  updateClosestAddressState = (isClosestAddressShowing: boolean) => {
    this.setState({
      isClosestAddressShowing: isClosestAddressShowing
    }, () => {
      this.resizeLayerListHeight()
    })
  }

  /**
   * When onlyShowLayerResults configuration is changed in live mode
   * Update the filters on each layers according to the curent state of onlyShowLayerResults
   */
  onOnlyShowLayerResultsChanged = () => {
    //if only show results enabled apply filters to the layers
    //else clear the filters
    if (this.state.analysisSettings?.onlyShowLayersResult) {
      this.featuresInfoByDsId && Object.keys(this.featuresInfoByDsId).forEach((dsId) => {
        let recordId: string | number | { [key: string]: any } | undefined
        let shouldFilterFeatures = true
        //when only closest configured for any data source, then only one record should be shown
        if (this.checkOnlyClosestConfiguredForDS(dsId) && this.closestFeatureIdByDsId) {
          recordId = this.closestFeatureIdByDsId[dsId]
          shouldFilterFeatures = !!recordId
        }
        if (shouldFilterFeatures) {
          this.filterToOnlyShowResultFeatures(dsId, recordId)
        }
      })
    } else {
      this.resetFilters(true)
    }
  }

  /**
   * Formats a field value for use in a SQL WHERE clause.
   * Numeric values are left unquoted; strings are single-quoted with escaped apostrophes.
   * @param value - The field value to format
   * @returns SQL-safe string representation of the value
   */
  formatWhereValue = (value: any): string => {
    if (typeof value === 'number' && Number.isFinite(value)) {
      return value.toString()
    }
    const escaped = String(value ?? '').replace(/'/g, "''")
    return `'${escaped}'`
  }

  /**
   * Builds a SQL WHERE clause for the Closest analysis filter.
   * When closestRecordId is a composite object (layer with multiple unique id fields),
   * each field is matched with AND. When it is a scalar (single unique id / object id field),
   * a simple equality condition is built.
   * Returns null when no valid id/field is available.
   * @param closestRecordId - The id of the closest feature (scalar or composite object)
   * @param uniqueIdFields - List of unique id field names from the data source
   * @param filterField - Fallback single field name (first unique id field or object id field)
   * @returns WHERE clause string or null
   */
  buildClosestWhereClause = (
    closestRecordId: string | number | { [key: string]: any },
    uniqueIdFields: string[],
    filterField: string | null
  ): string | null => {
    if (!filterField && uniqueIdFields.length === 0) {
      return null
    }

    // If multiple unique ID fields are present, use all of them with AND logic (composite key)
    if (uniqueIdFields.length > 0) {
      const whereClauses = uniqueIdFields.map((field) => {
        if (typeof closestRecordId === 'object' && !Array.isArray(closestRecordId)) {
          const value = closestRecordId[field]
          if (value !== undefined && value !== null) {
            return `${field} = ${this.formatWhereValue(value)}`
          }
        } else {
          return `${field} = ${this.formatWhereValue(closestRecordId)}`
        }
        return null
      }).filter(Boolean)

      if (whereClauses.length > 0) {
        return whereClauses.join(' AND ')
      }
    }

    // Fallback to using the filter field
    if (typeof closestRecordId === 'object' && !Array.isArray(closestRecordId)) {
      const value = closestRecordId[filterField]
      if (value !== undefined && value !== null) {
        return `${filterField} = ${this.formatWhereValue(value)}`
      }
    } else {
      return `${filterField} = ${this.formatWhereValue(closestRecordId)}`
    }
    return null
  }

  /**
   * Builds a SQL WHERE clause for Non-Closest analysis (Proximity / Summary) filter.
   * For data sources with unique id fields, builds predicates from the returned records.
   * For data sources without unique id fields, falls back to object ID IN clause.
   * Returns null when no ids/records are found.
   * @param ds - The data source instance to query ids from
   * @param bufferGeometry - The AOI geometry used to query intersecting feature ids
   * @param outFields - Configured fields for the data source
   * @param idField - Object ID field name (used when unique id fields are unavailable)
   * @returns WHERE clause string or null
   */
  buildNonClosestWhereClause = async (
    ds: any,
    bufferGeometry: any,
    outFields: string[],
    idField: string | null,
    uniqueIdFields: string[]
  ): Promise<string | null> => {
    if (!idField && uniqueIdFields.length === 0) {
      return null
    }

    try {
      const fieldsForQuery = Array.from(new Set([...(outFields ?? []), ...(uniqueIdFields ?? [])]))

      // When unique ID fields exist, build predicates from returned records so composite keys
      // are represented as (f1=v1 AND f2=v2) OR (f1=v3 AND f2=v4).
      if (uniqueIdFields.length > 0) {
        const records = await getALLFeatures(ds, {
          queryGeometry: bufferGeometry,
          returnGeometry: false,
          outSR: this.state.jimuMapView.view.spatialReference,
          outFields: fieldsForQuery
        })

        if (!records || records.length === 0) {
          return null
        }

        if (uniqueIdFields.length === 1) {
          const field = uniqueIdFields[0]
          const rawValues = records
            .map((record) => (record as FeatureDataRecord)?.getFeature?.()?.attributes?.[field])
            .filter((value) => value !== undefined && value !== null)

          const distinctValues = Array.from(new Set(rawValues.map((value) => JSON.stringify(value))))
            .map((value) => JSON.parse(value))

          if (distinctValues.length === 0) {
            return null
          }

          const whereValues = distinctValues.map((value) => this.formatWhereValue(value)).join(',')
          return `${field} IN (${whereValues})`
        }

        const compositeClauses = records
          .map((record) => {
            const attrs = (record as FeatureDataRecord)?.getFeature?.()?.attributes ?? {}
            const predicates = uniqueIdFields.map((field) => {
              const value = attrs[field]
              if (value === undefined || value === null) {
                return null
              }
              return `${field} = ${this.formatWhereValue(value)}`
            })

            if (predicates.some((predicate) => !predicate)) {
              return null
            }

            return `(${predicates.join(' AND ')})`
          })
          .filter(Boolean)

        const distinctCompositeClauses = Array.from(new Set(compositeClauses))
        return distinctCompositeClauses.length > 0 ? distinctCompositeClauses.join(' OR ') : null
      }

      // Fallback for layers without unique ID fields.
      const oIds = await getFeaturesIds(ds, bufferGeometry, this.state.jimuMapView.view.spatialReference, fieldsForQuery)
      if (!oIds || oIds.length === 0) {
        return null
      }

      const whereValues = oIds.map((id) => this.formatWhereValue(id)).join(',')
      return `${idField} IN (${whereValues})`
    } catch (error) {
      console.error(error)
      return null
    }
  }

  /**
   * Filters the Data Source to show only the resultant features.
   * For Closest analysis, closestRecordId is provided and the filter targets exactly one record.
   * For Non-Closest analysis (Proximity/Summary), a WHERE clause is built from AOI result records.
   * Falls back to '1=2' (show nothing) when no matching ids can be determined.
   * @param dsId - Data source id to filter
   * @param closestRecordId - Closest feature id (scalar or composite); omitted for non-closest analysis
   */
  filterToOnlyShowResultFeatures = async (dsId, closestRecordId?: string | number | { [key: string]: any }) => {
    if (this.state.analysisSettings?.onlyShowLayersResult && dsId && this.featuresInfoByDsId[dsId]) {
      const ds = getSelectedLayerInstance(dsId) as any
      if (ds) {
        const uniqueIdFields = ds?.getUniqueIdFields?.() ?? []
        const idField = ds?.getIdField?.()
        // Prefer the first unique id field; fall back to the layer's object id field
        const filterField = idField || uniqueIdFields[0]

        let bufferGeometry
        //in case of show all features return geometry will be false, we will get geometry only when search area is defined
        const { searchByLocation, searchCurrentExtent } = getSearchWorkflow(this.state.searchSettings)
        if (searchByLocation || searchCurrentExtent) {
          //set buffer geometry
          if (this.state.aoiGeometries?.bufferGeometry) {
            bufferGeometry = this.state.aoiGeometries.bufferGeometry
          } else {
            bufferGeometry = this.state.aoiGeometries.incidentGeometry
          }

          let outFields
          this.props.useDataSources.forEach((dataS) => {
            if (dataS.dataSourceId === ds.id || ds.id?.startsWith(`${dataS.dataSourceId}-`)) {
              outFields = dataS.fields ?? []
            }
          })

          // Default: hide all features until a valid WHERE clause is built
          let whereClause: string | null

          try {
            if (closestRecordId !== undefined && closestRecordId !== null) {
              // --- Closest analysis: match exactly the one closest feature ---
              whereClause = this.buildClosestWhereClause(closestRecordId, uniqueIdFields, filterField)
            } else {
              // --- Non-closest analysis (Proximity/Summary): match all AOI result features ---
              whereClause = await this.buildNonClosestWhereClause(ds, bufferGeometry, outFields, idField, uniqueIdFields)
            }
          } catch (error) {
            console.error(error)
            whereClause = null
          }

          const queryParams = whereClause
            ? { where: whereClause } as QueryParams
            : { where: '1=2' } as QueryParams

          (ds as QueriableDataSource).updateQueryParams?.(queryParams, this.props.id)
          //store the dsId in filtersAppliedOnDsId array, so that we can use the array to reset them
          if (!this.filtersAppliedOnDsId.includes(dsId)) {
            this.filtersAppliedOnDsId.push(dsId)
          }
        }
      }
    }
  }

  /**
   * Removes all filters applied by the widget
   * @param forceReset if need to force reset
   */
  resetFilters = (forceReset?: boolean) => {
    const emptyQueryParams = { where: '1=1', sqlExpression: null } as QueryParams
    if ((this.state.analysisSettings?.onlyShowLayersResult || forceReset) && this.state.jimuMapView) {
      //reset the filters applied by near-me widget
      this.filtersAppliedOnDsId.forEach((dsId) => {
        const ds = getSelectedLayerInstance(dsId) as any
        if (ds) {
          (ds as QueriableDataSource).updateQueryParams?.(emptyQueryParams, this.props.id)
        }
      })
      //empty the array, so next time we can reset filters only for those ds which are applied by near-me
      this.filtersAppliedOnDsId = []
    }
  }

  /**
   * Checks if only closest is configured for the dsId
   * @param dsId string dataSourceId
   * @returns true if only closest configured for the dsId
   */
  checkOnlyClosestConfiguredForDS = (dsId: string): boolean => {
    const analysisForDsId: string[] = []
    //get all the analysis types configured for the dsId
    this.state.analysisSettings?.layersInfo.forEach((layerInfo) => {
      const configuredDsId = layerInfo.useDataSource.dataSourceId
      const configuredLayerDs = getSelectedLayerInstance(configuredDsId) as any
      const isSameDataSource =
        dsId === configuredDsId ||
        dsId?.startsWith(`${configuredDsId}-`) ||
        configuredLayerDs?.id === dsId

      if (isSameDataSource) {
        analysisForDsId.push(layerInfo.analysisInfo.analysisType)
      }
    })
    //if proximity or summary is include return false else return true
    if (analysisForDsId.includes(AnalysisTypeName.Proximity) || analysisForDsId.includes(AnalysisTypeName.Summary)) {
      return false
    }
    return true
  }

  /**
   * Emits event on search by rest button is clicked
   */
  onResetButtonClick = () => {
    this.aoiToolRef.current?.refreshButtonClicked()
    this.clearOutPutDataSources()
    const jimuMapView = this.state.jimuMapView
    const displayAllLayersResultOnMap = this.state.analysisSettings?.displayAllLayersResultOnMap

    // Restore layer visibility - turn off only those layers that were configured as hidden in the map
    if (displayAllLayersResultOnMap && jimuMapView && (this.configuredHiddenLayerIds.length > 0 || this.previousHiddenLayerIds.length > 0)) {
      const hiddenLayerIds = [...this.configuredHiddenLayerIds, ...this.previousHiddenLayerIds]
      hiddenLayerIds.forEach((layerId) => {
        const mapFeatureLayer = jimuMapView.getJimuLayerViewByDataSourceId(layerId)?.layer
        if (mapFeatureLayer && mapFeatureLayer.visible) {
          mapFeatureLayer.visible = false
        }
      })
    }

    this.setState({
      showBatchRetriveAll: true,
      exportProgress: 0,
      showExportOptions: false,
      showFeatureForm: false,
      currentPage: 1
    })
  }

  /**
   * Emits when save button is clicked
   */
  onSaveInputLocationClick = () => {
    const saveFeaturesConfig = this.getSaveFeaturesConfig(true)
    // if only saveSearchArea is enabled from config then direct render to 2nd page
    this.setState({
      showFeatureForm: true,
      currentPage: saveFeaturesConfig.onlySearchAreaEnabled ? 2 : 1
    }, () => {
      let geometryType
      // if page number is 1 then geometry type is incident geometry
      if (this.state.currentPage === 1) {
        geometryType = this.state.aoiGeometries.incidentGeometry.type
      } else {
        geometryType = this.state.aoiGeometries.bufferGeometry.type
      }
      this.initializeForm(geometryType)
    })
  }

  /**
   * Retrieves the layer to save the feature
   * @param geometryType Geometry type of the feature
   * @returns feature layer
   */
  getLayerToSaveFeature = (geometryType) => {
    let dsId: string
    if (this.state.currentPage === 2) {
      dsId = this.state.analysisSettings.saveFeatures.searchAreaFeature.useDataSource.dataSourceId
    } else {
      switch (geometryType) {
        case 'point':
          dsId = this.state.analysisSettings.saveFeatures.pointFeature.useDataSource.dataSourceId
          break
        case 'polyline':
          dsId = this.state.analysisSettings.saveFeatures.polylineFeature.useDataSource.dataSourceId
          break
        case 'polygon':
          dsId = this.state.analysisSettings.saveFeatures.polygonFeature.useDataSource.dataSourceId
          break
      }
    }
    const layerObj = getSelectedLayerInstance(dsId) as FeatureLayerDataSource
    return layerObj.layer
  }

  /**
   * Initialized the feature form
   * @param geometryType Geometry type of the feature
   */
  initializeForm = (geometryType) => {
    // if feature form is already initialized then don't initialize it again
    if (this.state.currentPage === 1 && this.incidentGeomfeatureForm) {
      return
    } else if (this.state.currentPage === 2 && this.bufferGeomfeatureForm) {
      return
    }
    const layer = this.getLayerToSaveFeature(geometryType)
    // if page number is 2 and AOI geometry type is polygon then show form for bufferGeometry
    // else show form for incident geometry
    let geometry = geometryType === 'polygon' && this.state.currentPage === 2
      ? this.state.aoiGeometries.bufferGeometry
      : this.state.aoiGeometries.incidentGeometry

    // Remove Z and M values if the layer doesn't support them
    if (geometry && (geometry.hasZ || geometry.hasM)) {
      const layerHasZ = layer.capabilities?.data?.supportsZ || layer.hasZ || false
      const layerHasM = layer.capabilities?.data?.supportsM || layer.hasM || false

      // Clone the geometry to avoid modifying the original
      const clonedGeometry = geometry.clone()

      // Remove Z values if layer doesn't support Z coordinates
      if (geometry.hasZ && !layerHasZ) {
        clonedGeometry.hasZ = false
      }

      // Remove M values if layer doesn't support M coordinates
      if (geometry.hasM && !layerHasM) {
        clonedGeometry.hasM = false
      }

      geometry = clonedGeometry
    }
    const graphic = new Graphic({
      geometry: geometry
    })
    // After render, set layer and feature directly on the <arcgis-feature-form> web component element via ref
    const formElement = this.state.currentPage === 1
      ? this.incidentFormRef.current
      : this.bufferFormRef.current
    if (formElement) {
      formElement.layer = layer
      formElement.feature = graphic
      if (this.state.currentPage === 1) {
        this.incidentGeomfeatureForm = formElement
      } else {
        this.bufferGeomfeatureForm = formElement
      }
      this.handleFormSubmit()
    }
  }

  /**
   * Removes existing form submit listeners to prevent accumulation
   */
  removeFormSubmitListeners = () => {
    // Reject pending promises to prevent memory leaks
    if (this.incidentRejectHandler) {
      this.incidentRejectHandler()
      this.incidentRejectHandler = null
    }
    if (this.bufferRejectHandler) {
      this.bufferRejectHandler()
      this.bufferRejectHandler = null
    }
    if (this.incidentFormSubmitTarget && this.incidentFormSubmitHandler) {
      this.incidentFormSubmitTarget.removeEventListener('arcgisSubmit', this.incidentFormSubmitHandler)
    }
    if (this.bufferFormSubmitTarget && this.bufferFormSubmitHandler) {
      this.bufferFormSubmitTarget.removeEventListener('arcgisSubmit', this.bufferFormSubmitHandler)
    }
    this.incidentFormSubmitHandler = null
    this.bufferFormSubmitHandler = null
    this.incidentFormSubmitTarget = null
    this.bufferFormSubmitTarget = null
  }

  /**
   * Handles the form submission
   */
  handleFormSubmit = () => {
    // Remove existing listeners to prevent accumulation
    this.removeFormSubmitListeners()

    const incidentFormPromise = new Promise<void>((resolve, reject) => {
      this.incidentRejectHandler = reject
      this.incidentFormSubmitHandler = (e: any) => {
        this.incidentRejectHandler = null
        if (e.detail.invalid.length) {
          this.pageChanged(1)
        } else if (!this.bufferGeomfeatureForm) {
          this.submitForm()
        } else {
          resolve()
        }
      }
      const incidentSubmitTarget = this.incidentGeomfeatureForm
      this.incidentFormSubmitTarget = incidentSubmitTarget ?? null
      incidentSubmitTarget?.addEventListener('arcgisSubmit', this.incidentFormSubmitHandler)
    })

    const bufferFormPromise = new Promise<void>((resolve, reject) => {
      this.bufferRejectHandler = reject
      this.bufferFormSubmitHandler = (e: any) => {
        this.bufferRejectHandler = null
        if (this.incidentGeomfeatureForm) {
          incidentFormPromise.then(() => {
            if (e.detail.invalid.length) {
              this.pageChanged(2)
            } else {
              resolve()
            }
          }).catch((err) => {
            // If incident form promise rejected, reject this one too
            reject(new Error(err))
          })
        } else {
          if (e.detail.invalid.length) {
            this.pageChanged(2)
          } else {
            this.submitForm()
          }
        }
      }
      const bufferSubmitTarget = this.bufferGeomfeatureForm
      this.bufferFormSubmitTarget = bufferSubmitTarget ?? null
      bufferSubmitTarget?.addEventListener('arcgisSubmit', this.bufferFormSubmitHandler)
    })
    // Wait for both forms to finish submission
    Promise.all([incidentFormPromise, bufferFormPromise]).then(() => {
      this.submitForm()
    }).catch((err) => {
      console.error(err)
    })
  }

  /**
   * Resets the feature form
   */
  resetFeatureForm = () => {
    if (this.state.showFeatureForm) {
      // Clean up event listeners before resetting
      this.removeFormSubmitListeners()
      this.incidentGeomfeatureForm = undefined
      this.bufferGeomfeatureForm = undefined
      this.setState({
        showFeatureForm: false,
        currentPage: 1,
        formFailedMsg: ''
      })
    }
  }

  /**
   * Changes the page
   * @param evt page number
   */
  pageChanged = (evt) => {
    this.setState({
      currentPage: evt
    }, () => {
      this.initializeForm(this.state.currentPage === 1 ? this.state.aoiGeometries.incidentGeometry.type : this.state.aoiGeometries.bufferGeometry.type)
    })
  }

  /**
   * Emits the submit event when submit button is clicked
   */
  submitBtnClicked = () => {
    if (this.incidentGeomfeatureForm) {
      this.incidentGeomfeatureForm.submit()
    }
    if (this.bufferGeomfeatureForm) {
      this.bufferGeomfeatureForm.submit()
    }
  }

  /**
   * Submits the feature form
   */
  submitForm = async () => {
    this.setState({
      isSubmittingForm: true
    })
    try {
      if (this.incidentGeomfeatureForm) {
        const incidentFeatureLayer: any = this.incidentGeomfeatureForm.layer
        this.incidentGeomfeatureForm.feature.attributes = this.incidentGeomfeatureForm.getValues()
        await incidentFeatureLayer.applyEdits({
          addFeatures: [this.incidentGeomfeatureForm.feature]
        })
      }
      if (this.bufferGeomfeatureForm) {
        try {
          const bufferFeatureLayer: any = this.bufferGeomfeatureForm.layer
          this.bufferGeomfeatureForm.feature.attributes = this.bufferGeomfeatureForm.getValues()
          await bufferFeatureLayer.applyEdits({
            addFeatures: [this.bufferGeomfeatureForm.feature]
          })
          // Clean up listeners after successful submission
          this.removeFormSubmitListeners()
          this.incidentGeomfeatureForm = undefined
          this.bufferGeomfeatureForm = undefined
          this.setState({
            showFeatureForm: false,
            currentPage: 1,
            isSubmittingForm: false,
            formFailedMsg: ''
          })
        } catch (bufferError) {
          console.error(bufferError)
          // Clean up listeners before retrying to prevent accumulation
          this.removeFormSubmitListeners()
          this.setState({
            formFailedMsg: bufferError.message,
            showFeatureForm: true,
            isSubmittingForm: false
          }, () => {
            this.handleFormSubmit()
          })
        }
      } else {
        // Clean up listeners after successful submission (no buffer form)
        this.removeFormSubmitListeners()
        this.incidentGeomfeatureForm = undefined
        this.bufferGeomfeatureForm = undefined
        this.setState({
          showFeatureForm: false,
          isSubmittingForm: false,
          currentPage: 1,
          formFailedMsg: ''
        })
      }
    } catch (incidentError) {
      console.error(incidentError)
      // Clean up listeners before retrying to prevent accumulation
      this.removeFormSubmitListeners()
      this.setState({
        formFailedMsg: incidentError.message,
        isSubmittingForm: false
      }, () => {
        this.pageChanged(1)
        this.handleFormSubmit()
      })
    }
  }

  /**
   * Aborts the query
   */
  stopLoading = () => {
    const abortController = this.abortControllerRef
    abortController.forEach((abortController) => {
      abortController.abort()
    })
    this.onResetButtonClick()
    this.featuresInfoByDsId = {}
    this.featuresByAnalysisId = {}
    this.closestFeatureIdByDsId = {}
    this.printReportData = []
    this.setState({
      queryAborted: true,
      loadingAllFeaturesFromDs: false
    })
  }

  /**
   * Get the Prompt display message in alert
   * @param layerName selected layer name
   * @returns prompt message string
   */
  getPromptMessageString = (layerName: string): string => {
    const getPromptTitleMessage = this.props.intl.formatMessage({
      id: 'promptTitleMessageFromDataAction', defaultMessage: defaultMessages.promptTitleMessageFromDataAction
    }, { layerName: layerName })
    return getPromptTitleMessage
  }

  /**
   * @param layerName
   * @returns save location header
   */
  getSaveInputLocationHeaderString = (layerName: string): string => {
    const saveLocationHeader = this.props.intl.formatMessage({
      id: 'saveInputLocationLabel', defaultMessage: defaultMessages.saveInputLocationLabel
    }, { layerName: layerName })
    return saveLocationHeader
  }

  /**
   * @param layerName
   * @returns save search area header
   */
  getSaveSearchAreaLabelHeaderString = (layerName: string): string => {
    const saveSearchAreaHeader = this.props.intl.formatMessage({
      id: 'saveSearchAreaLabel', defaultMessage: defaultMessages.saveSearchAreaLabel
    }, { layerName: layerName })
    return saveSearchAreaHeader
  }

  /**
   * Export batch export files
   */
  onBatchExportToggle = () => {
    if (!this.state.showExportOptions) { // open the dropdown menu
      this.setState({
        isDropDownLoading: true
      }, async () => {
        await new Promise((resolve) => { setTimeout(resolve, 100) })
        try {
          const [recordActions] = await this.getAvailableActions()
          const recordActionNames = Object.keys(recordActions)
          this.setState({
            actionNames: recordActionNames,
            actionNamesGroups: recordActions
          })
        } catch (err) {
          console.error(err)
          this.setState({
            actionNamesGroups: {}
          })
        }
        this.setState({
          showExportOptions: !this.state.showExportOptions,
          isDropDownLoading: false
        })
      })
    } else {
      this.setState({
        showExportOptions: !this.state.showExportOptions
      })
    }
  }

  /**
   * Get all the available data action
   * @returns records action promise
   */
  getAvailableActions = () => {
    // If no records, return empty record action list
    let recordActionsPromise = null
    const recordsCount = this.getDataSetRecordsCount()
    if (recordsCount !== 0) {
      recordActionsPromise = DataActionManager.getInstance().getSupportedActions(this.props.widgetId, this.state.dataSetArray, DataLevel.Records)
    }
    return Promise.all([recordActionsPromise || {}])
  }

  /**
   * Get available records count from data set array
   * @returns records count
   */
  getDataSetRecordsCount = () => {
    let count = 0
    for (const dataSet of this.state.dataSetArray) {
      count += dataSet.records?.length
    }
    return count
  }

  /**
   * Checks if all layer output data sources are ready (not in NotReady status)
   * @returns Promise that resolves to true if all output DS are ready, false otherwise
   */
  areAllLayerOutputDsReady = (): boolean => {
    const presentOutputDsIds = []
    // consider only those output ds for which layer accordion is generated and show export is enabled for that layer
    this.layerAccordionRefs.forEach((elm) => {
      if (elm) {
        if (elm.props.showExportButton) {
          const outputDsId = getOutputDsId(this.props.widgetId, elm.props.analysisType, elm.props.analysisId)
          presentOutputDsIds.push(outputDsId)
        }
      }
    })
    // check ds status for every output ds
    return presentOutputDsIds.every(outputDsId => {
      const ds = this.getOutputDataSource(outputDsId)
      return ds && ds.getStatus() !== DataSourceStatus.NotReady
    })
  }

  /**
   * Show a feature form functionality for saving input location
   * @returns Feature form for saving the input location
   */
  renderFormForSavingInputLocation = () => {
    const theme = this.props.theme
    const saveSearchAreaEnabled = this.state.analysisSettings?.saveFeatures.searchAreaFeature.enabled && !!this.state.analysisSettings.saveFeatures.searchAreaFeature.useDataSource && this.state.aoiGeometries.bufferDistance > 0
    const currentPage = this.state.currentPage
    const buttonText = saveSearchAreaEnabled && currentPage === 1 ? this.nls('next') : this.nls('submit')
    const geometryType = currentPage === 1 ? this.state.aoiGeometries.incidentGeometry.type : this.state.aoiGeometries.bufferGeometry.type
    const layer = this.getLayerToSaveFeature(geometryType)
    const formHeaderText = currentPage === 1 ? this.getSaveInputLocationHeaderString(layer.title) : this.getSaveSearchAreaLabelHeaderString(layer.title)

    const formContainer = css`
        display: flex;
        flex-direction: column;
        height: 100%;
        `
    const formHeader = css`
        position: sticky;
        top: 0;
        display: flex;
        `
    const backButton = css`
        flex-shrink: 0;
        color: inherit;
        `
    const formHeaderTitle = css`
        border-left: ${currentPage === 2 ? `1px solid ${theme.sys.color.divider.secondary}` : 'none'};
        `
    const formBody = css`
        flex: 1;
        overflow-y: auto;
        border-top: 1px solid ${theme.sys.color.divider.secondary};
        border-bottom: 1px solid ${theme.sys.color.divider.secondary};
        `
    const formFooterButtons = css`
        position: sticky;
        bottom: 5px;
        display: flex;
        `
    const buttonBorder = css`
        border-radius: 0px !important;
       `
    return (
      <React.Fragment>
        <div css={formContainer}>
          <div css={formHeader}>
            {this.state.currentPage === 2 && this.incidentGeomfeatureForm &&
              <Button css={backButton} aria-label={this.nls('back')} type='tertiary' icon onClick={() => { currentPage === 2 ? this.pageChanged(1) : this.resetFeatureForm() }}>
                <LeftOutlined autoFlip />
              </Button>}
            <Typography css={formHeaderTitle} variant="title2" color="paperText" className="py-3 px-2">
              {formHeaderText}
            </Typography>

          </div>
          <div css={formBody} className={'mb-3'}>
            {this.state.formFailedMsg && <Alert
              style={{ width: '100%' }}
              aria-live="polite"
              closable
              form="basic"
              onClose={() => { this.setState({ formFailedMsg: '' }) }}
              open
              shape="none"
              size="medium"
              text={this.state.formFailedMsg}
              title={this.nls('formSubmissionFailedMsg')}
              type="error"
              variant="contained"
              withIcon
            />}
            <div style={{ display: currentPage === 1 ? 'block' : 'none', padding: '12px 15px' }} id='incident-feature-form'>
              <arcgis-feature-form ref={this.incidentFormRef} />
            </div>
            <div style={{ display: currentPage === 2 ? 'block' : 'none', padding: '12px 15px' }} id='buffer-feature-form'>
              <arcgis-feature-form ref={this.bufferFormRef} />
            </div>
          </div>
          <div css={formFooterButtons} className='px-3'>
            <Button block role={'button'} aria-label={this.nls('cancel')} title={this.nls('cancel')}
              size={'default'} type='secondary'
              css={buttonBorder}
              onClick={this.resetFeatureForm}>
              {this.nls('cancel')}
            </Button>
            <Button block role={'button'} aria-label={buttonText} title={buttonText}
              size={'default'} type='primary'
              css={buttonBorder}
              onClick={() => {
                currentPage === 2 ? this.submitBtnClicked() : saveSearchAreaEnabled && currentPage === 1 ? this.pageChanged(2) : this.submitBtnClicked()
              }}>
              {buttonText}
            </Button>
          </div>
        </div>
      </React.Fragment>
    )
  }

  /**
   * Render the batch Export dropdown list
   * @returns export options dropdown list
   */
  renderBatchExportList = () => {
    const { searchByLocation } = getSearchWorkflow(this.state.searchSettings)
    let showAOI = false
    if (searchByLocation) {
      showAOI = true
    }
    const isRTL = getAppStore().getState().appContext.isRTL
    let isAnyAnalysisGroupingEnabled: boolean = false
    if ((!this.printReportData || this.printReportData.length === 0) && (this.analysisLayersResults.length || this.summaryAttributes)) {
      this.printReportData = this.createPrintReportData()
    }
    //if grouping is enabled then only show the merge rows for groups and subgroups in PDF popup
    this.analysisLayersResults.forEach((result) => {
      if (result.layerInfo.analysisInfo.groupFeaturesEnabled && result.layerInfo.analysisInfo.groupFeatures.groupFeaturesByField !== '' &&
        result.featuresAndGroup?.featuresGroup?.length > 0) {
        isAnyAnalysisGroupingEnabled = true
      }
    })
    const dataActionButtonStyle = getDataActionButtonStyle()
    const loadingStyle = css`
        @keyframes loading {
          0% {transform: rotate(0deg); };
          100% {transform: rotate(360deg)};
        }
        position: absolute;
        width: 60%;
        height: 60%;
        top: 20%;
        left: 20%;
        border: 2px solid var(--sys-color-secondary-light);
        border-radius: 50%;
        border-top: 2px solid var(--sys-color-primary-main);
        box-sizing: border-box;
        animation:loading 2s infinite linear;
      `
    return (
      <React.Fragment>
        <Dropdown className='top-button' direction='down' size='sm' aria-label={this.nls('exportBtnTitle')}
          useKeyUpEvent toggle={this.onBatchExportToggle} isOpen={this.state.showExportOptions}>
          <DropdownButton size='sm' arrow={false} css={dataActionButtonStyle} icon ref={this.dropdownRef} color='inherit'
            className='data-action-button' onClick={this.onBatchExportToggle} type='tertiary' title={this.nls('exportBtnTitle')}>
            {!this.state.isDropDownLoading && <ExportOutlined size='m' />}
            {this.state.isDropDownLoading && <div css={loadingStyle} />}
          </DropdownButton>
          <DropdownMenu>
            <Dropdown key={this.state.actionNames.length + 1} direction={'right'} isSubMenuItem={true}>
              <DropdownButton size={'sm'} type={'default'} arrowRight={true} onClick={this.onExportPdfOptionClick}>
                <div className='d-flex align-items-center'>
                  {<span>{this.nls('exportToPdf')}</span>}
                </div>
              </DropdownButton>
              <DropdownMenu>
                <div onClick={this.pdfPopupClick} className='p-3 w-100'>
                  <Report
                    theme={this.props.theme}
                    intl={this.props.intl}
                    mapView={this.state.jimuMapView}
                    reportData={this.printReportData}
                    showAreaOfInterest={showAOI}
                    aoiValue={this.aoiValue}
                    isGroupingEnabled={isAnyAnalysisGroupingEnabled}
                    isRTL={isRTL}
                    folderUrl={this.props.context.folderUrl}
                    onReportExported={this.onExportPdfClick} />
                </div>
              </DropdownMenu>
            </Dropdown>
            {this.state.actionNames?.length > 0 &&
              this.state.actionNames.map(actionName => this.createActionItem(this.state.actionNamesGroups, actionName, DataLevel.Records))}
          </DropdownMenu>
        </Dropdown>
        {this.state.actionElement}
      </React.Fragment>
    )
  }

  /**
   * Zoom to the incident Geometry or a BufferGeometry on export pdf option click
   */
  onExportPdfOptionClick = () => {
    const { searchByLocation } = getSearchWorkflow(this.state.searchSettings)
    if (searchByLocation) {
      const geometryToZoom = this.state.aoiGeometries?.bufferGeometry ? this.state.aoiGeometries.bufferGeometry : this.state.aoiGeometries.incidentGeometry
      //zoom to the incident/buffer geometry
      this.state.jimuMapView?.view.goTo(
        geometryToZoom.type === 'point'
          ? { center: geometryToZoom as Point }
          : { target: geometryToZoom.extent.clone().expand(1.5) }
      )
    }
  }

  /**
   * Perform the functionality on export button click
   */
  onExportPdfClick = () => {
    this.setState({
      showExportOptions: false
    })
  }

  /**
   * Stop event propagation on pdf popup click
   * @param evt event
   */
  pdfPopupClick = (evt) => {
    evt.stopPropagation()
  }

  /**
   * Create the report data for exporting pdf
   * @param reportData report data details
   * @returns print report data
   */
  createPrintReportData = () => {
    const printReportData = []
    const showRowIndex = true
    this.analysisLayersResults.forEach((result) => {
      const cols: string[] = [] // array of table columns which will have field aliases/fieldName
      const rows = [] // array of table rows which will have field values
      let attrKeys:string[] = [] // array of field names which will be used to get the field values

      //create print data for only those analysis layers which allowExport is true
      if (result.allowExport) {
        //if the analysis type is summary then get the summary attributes from the output data source
        if (result.layerInfo.analysisInfo.analysisType === AnalysisTypeName.Summary) {
          //Get the summary attributes from the output datasource created for this summary analysis
          const outputDsId = getOutputDsId(this.props.widgetId, AnalysisTypeName.Summary, result.layerInfo.analysisInfo.analysisId)
          const featureLayerDs = this.getOutputDataSource(outputDsId) as FeatureLayerDataSource
          //Summary will always have only one feature with each summary field as attribute
          const summaryFeature = featureLayerDs?.layer?.source?.at(0)
          const eachRow: any[] = []
          //Create cols for each summary field
          result.layerInfo.analysisInfo.summaryFields.forEach((fieldInfos) => {
            const fieldName = fieldInfos.fieldLabel.replace(/ /g, '')
            if (summaryFeature?.attributes.hasOwnProperty(fieldName)) {
              cols.push(fieldInfos.fieldLabel)
              eachRow.push(summaryFeature.attributes[fieldName])
            }
          })
          //Show count column only when no summary fields are configured, if we don't add this then Summary table for this analysis will not be shown
          if (summaryFeature?.attributes.esriCTCOUNT > 0 && cols.length === 0 && eachRow.length === 0) {
            cols.push(this.nls('count'))
            eachRow.push(summaryFeature.attributes.esriCTCOUNT)
          }
          //push the row in rows array
          rows.push(eachRow)
          //push the summary data in printReportData
          printReportData.push({
            data: {
              cols: cols,
              rows: rows,
              showRowIndex: true
            },
            title: result.layerInfo.label,
            totalCount: result.count,
            maxNoOfCols: 5
          })
        } else {
          const fieldsToExport = this.getFieldsToExport(result.layerInfo.analysisInfo.analysisId)
          const layerAnalysisInfo = result.layerInfo.analysisInfo
          const selectedAccordianInfo = (this.layerAccordionRefs as any)?.find(elm => elm && elm.props && elm.props.analysisId === result.layerInfo.analysisInfo.analysisId)
          let records = selectedAccordianInfo?.allIntersectingFeatures || []
          // update the result count to avoid incorrect feature count when Return intersected polygon is enabled
          result.count = records.length
          let groupFieldCol: null|number = null
          let subgroupFieldCol: null|number = null
          //if group features are enabled then get the records from the featuresAndGroup
          if (layerAnalysisInfo.groupFeaturesEnabled && layerAnalysisInfo.groupFeatures.groupFeaturesByField !== '' &&
            result.featuresAndGroup?.featuresGroup?.length > 0) {
            records = []
            //loop through the group and get the records
            //if subgroup features are enabled then loop through the subGroupInfo and get the records
            //else get the records from the featuresGroup
            result.featuresAndGroup?.featuresGroup.forEach(featureGroup => {
              if (featureGroup.subGroupInfo?.featuresSubGroup?.length > 0) {
                featureGroup.subGroupInfo.featuresSubGroup.forEach((subGroup) => {
                  records.push(...subGroup.features)
                })
              } else {
                records.push(...featureGroup.features)
              }
            })
          }
          //As we have group and subgroup features, we need to show group field as first column and subgroup field as second column
          //so we need to add group and subgroup field as first two columns in the cols array
          //similarly the key for group and subgroup field should be added as first two keys in the attrKeys array
          //and the rest of the fields should be added in the end of the cols and attrKeys array
          //so that we can show group and subgroup field as first two columns in the table
          let groupCol: string = ''
          let subGroupCol: string = ''
          let groupFieldKey: string = ''
          let subGroupFieldKey: string = ''
          for (const attrKey in records[0]?.feature.attributes) {
            let fieldName: string
            const fields = records[0].feature.layer.fields
            if (fieldsToExport.includes(attrKey)) {
              if (attrKey === 'esriCTApproxDistance') {
                fieldName = this.nls('closestApproxDistance')
              } else if (attrKey === 'esriCTClippedInfo') {
                //Set the Area or Length label along with the Units
                const distanceUnit = this.state.aoiGeometries?.distanceUnit || this.state.searchSettings?.distanceUnits || getPortalUnit()
                let unitAbbr = this.getSelectedUnitsAbbr(distanceUnit as __esri.LengthUnit)
                //show square unit for area
                if (records[0].feature.geometry?.type === 'polygon') {
                  unitAbbr = unitAbbr + '\u00b2'
                  fieldName = this.props.intl.formatMessage({
                    id: 'areaUnitLabel', defaultMessage: defaultMessages.areaUnitLabel
                  }, { unitLabel: unitAbbr })
                } else{
                  fieldName = this.props.intl.formatMessage({
                    id: 'lengthUnitLabel', defaultMessage: defaultMessages.lengthUnitLabel
                  }, { unitLabel: unitAbbr })
                }
              } else if (attrKey !== undefined) {
                const filteredField = fields.filter((field) => { return field.name === attrKey })
                fieldName = filteredField[0]?.alias || attrKey
              }
              if (fieldName !== undefined) {
                if (!cols.includes(fieldName)) {
                  if (attrKey === layerAnalysisInfo.groupFeatures?.groupFeaturesByField || attrKey === layerAnalysisInfo.subGroupFeatures?.subGroupFeaturesByField) {
                      if (attrKey === layerAnalysisInfo.groupFeatures.groupFeaturesByField) {
                        groupFieldCol = showRowIndex ? 1 : 0
                        groupCol = fieldName
                        groupFieldKey = attrKey
                      }
                      if (layerAnalysisInfo.subGroupFeatures.subGroupFeaturesByField !== '' &&
                        attrKey === layerAnalysisInfo.subGroupFeatures.subGroupFeaturesByField) {
                        subgroupFieldCol = showRowIndex ? 2 : 1
                        subGroupCol = fieldName
                        subGroupFieldKey = attrKey
                      }
                  } else {
                    cols.push(fieldName)
                    attrKeys.push(attrKey)
                  }
                }
              }
            }
          }
          //when group and subgroup field are same then remove the subgroup field from the cols and attrKeys array
          if(groupFieldKey && subGroupFieldKey && groupFieldKey === subGroupFieldKey) {
            subGroupCol = ''
            subgroupFieldCol = null
            subGroupFieldKey = ''
          }
          //if group and subgroup field are not found in the attributes then add them to the first and secound cols and attrKeys array
          //as we are using unshift to add the group and subgroup field as first two columns, first add subgroup and then group field
          // so that group will be first and subgroup will be second column
          if (subGroupFieldKey) {
            cols.unshift(subGroupCol)
            attrKeys.unshift(subGroupFieldKey)
          }
          if (groupFieldKey) {
            cols.unshift(groupCol)
            attrKeys.unshift(groupFieldKey)
          }
          //loop through the records and get the field values for each record
          records.forEach((eachRecord) => {
            const eachRow = []
            //if attrKeys is empty then get the keys from the attributes
            //this is used to get the field values for each record
            if (!attrKeys.length) {
              attrKeys = Object.keys(eachRecord.feature.attributes)
            }
            //loop through the attrKeys and get the field values for each record
            //this will be in same sequence as the cols array and it will have group and subgroup field as first two columns
            //and the rest of the fields in the end
            //so that we can show group and subgroup field as first two columns in the table
            attrKeys.forEach(attrKey => {
              if (fieldsToExport.includes(attrKey)) {
                let fieldValue = eachRecord.getFormattedFieldValue(attrKey, this.props.intl) ?? ''
                if (fieldValue === undefined || fieldValue === "" || fieldValue === null || fieldValue.toString().trim() === "") {
                  fieldValue = this.nls('noData')
                }
                if (attrKey === 'esriCTClippedInfo' && fieldValue !== this.nls('noData')) {
                  // Format the clipped area/length value with grouping, separator, and 2 decimal places for PDF export
                  const defaultNumberFormat: FormatNumberOptions = {
                    useGrouping: true,
                    notation: 'standard',
                    maximumFractionDigits: 2,
                    minimumFractionDigits: 2
                  }
                  fieldValue = this.props.intl.formatNumber(fieldValue, defaultNumberFormat)
                  // if the value is 0.00 show the actual value
                  if (fieldValue === "0.00") {
                    const originalValue = eachRecord.getFormattedFieldValue(attrKey, this.props.intl) ?? ''
                    fieldValue = originalValue !== '' ? formatSmallNumberWithSignificantDigits(originalValue as number) : ''
                  }
                }
                eachRow.push(fieldValue)
              }
            })
            rows.push(eachRow)
          })
          printReportData.push({
            data: {
              cols: cols,
              rows: rows,
              showRowIndex: showRowIndex
            },
            title: result.layerInfo.label,
            totalCount: result.count,
            maxNoOfCols: 5,
            groupFieldCol: groupFieldCol,
            subgroupFieldCol: subgroupFieldCol
          })
        }
      }
    })
    return printReportData
  }

  /**
   * On action item click export the respective item
   * @param action clicked action
   * @param dataLevel data level
   */
  onActionItemClick = async (action: DataAction, dataLevel: DataLevel): Promise<void> => {
    const ACTIVE_CLASSNAME = 'active-data-action-item'
    const prevActive = document.querySelector(`.${ACTIVE_CLASSNAME}`)

    if (prevActive) {
      // Clean up the active className first
      prevActive.classList.remove(ACTIVE_CLASSNAME)
    }

    this.dropdownRef.current.className = classNames(this.dropdownRef.current.className, ACTIVE_CLASSNAME)
    let newDataSetArr = this.state.dataSetArray
    //For batch export
    //if CSV export action is clicked then push the proximity feature count dataSet in the array
    if (action.id === 'export-csv' && this.proximityCountDataSetArr.length > 0) {
      newDataSetArr = [...newDataSetArr, ...this.proximityCountDataSetArr]
    }
    // Execute the data action
    const actionElement = await DataActionManager.getInstance().executeDataAction(action, newDataSetArr, dataLevel, this.props.widgetId)

    // This is used for close the modal
    if (actionElement !== null && typeof actionElement !== 'boolean') {
      this.setState({
        actionElement: React.cloneElement(
          actionElement,
          {
            onClose: () => { this.setState({ actionElement: null }) },
            onConfirm: (...args) => {
              !actionElement.props.keepOpenAfterConfirm && this.setState({ actionElement: null })
              return actionElement.props.onConfirm(...args)
            }
          }
        )
      })
    }
    this.setState({
      showExportOptions: false
    })
  }

  /**
   * Create the action items to display in the dropdown
   * @param actionGroups available action groups
   * @param actionName available action names
   * @param dataLevel data level
   * @returns dropdown export items
   */
  createActionItem = (actionGroups: any, actionName: string, dataLevel: DataLevel): React.JSX.Element => {
    const actions: DataAction[] = actionGroups[actionName]
    if (actionName === 'export' && actions?.length > 0 && this.state.dataSetArray.length > 0) {
      if (actions.length > 0) {
        return (
          <React.Fragment key={'exportAction'}>
            {actions.map((action, index) => {
              let label = action.label
              if (action.widgetId) {
                const widget = getAppStore().getState().appConfig.widgets[action.widgetId]
                label = widget?.label ?? action.label
              }
              return (
                <DropdownItem
                  key={index}
                  header={false}
                  onClick={async () => { await this.onActionItemClick(action, dataLevel) }}
                >
                  {label}
                </DropdownItem>
              )
            })}
          </React.Fragment>
        )
      }
    }
    return null
  }

  /**
   * Update the incident graphic to used in the direction widget to get the updated directions
   * @param graphic incident drawn graphic
   */
  onIncidentGraphicChange = (graphic) => {
    this.incidentGraphic = graphic.geometry.type === 'point' ? graphic : null
  }

  /**
   * Update  results on query changed
   * On map extent change or the data is filtered from filter widget the update the analysis results
   * @param queryRequiredInfo
   * @param preQueryRequiredInfo
   * @returns
   */
  onQueryRequired = (queryRequiredInfo: QueryRequiredInfo, preQueryRequiredInfo?: QueryRequiredInfo) => {
    //on datasource component mount, it is triggering onQueryRequired which is causing recursion and results are loaded in loop
    if (!preQueryRequiredInfo) {
      return
    }

    for (const dsId in queryRequiredInfo) {
      const info = queryRequiredInfo[dsId]
      const preInfo = preQueryRequiredInfo?.[dsId]
      //Return in following cases
      // 1. invalid info
      // 2. When widgetqueries are not changed at all
      if (!info || lodash.isDeepEqual(info?.widgetQueries, preInfo?.widgetQueries)) {
        //if source version is changed then update the results
        if (info?.sourceVersion !== preInfo?.sourceVersion) {
          this.updateOnDSInfoChange()
          return
        }
        return
      }

      let requireRefresh = false

      if (info.widgetQueries) {
        const { showAllFeatures, searchByLocation } = getSearchWorkflow(this.state.searchSettings)
        //get all widgetIds which have applied filters on the DS
        const allKeys = Object.keys(info.widgetQueries)

        //skip filter-data-record-action in showAllFeatures and searchByLocation case as this is fired on extent change only
        if ((showAllFeatures || searchByLocation) && allKeys.includes('filter-data-record-action')) {
          allKeys.splice(allKeys.indexOf('filter-data-record-action'), 1)
        }

        // Now check if any of the widgets queries other than near-ne are changed then only refresh
        allKeys.some((key) => {
          //skip widgetQueries by self
          const isValidKey = key !== this.props.id
          //refresh only when any widgets queries are changed
          if (isValidKey && !lodash.isDeepEqual(info?.widgetQueries?.[key], preInfo?.widgetQueries?.[key])) {
            requireRefresh = true
            return true
          }
          return false
        })
      }
      if (requireRefresh) {
        this.updateOnDSInfoChange()
      }
    }
  }

  /**
   * Debounce the method to be executed on ds info change as ds info change will be for multiple ds and we would like to execute code only once
   */
  updateOnDSInfoChange = lodash.debounce(() => {
    if (this.skipDsInfoChange) {
      this.skipDsInfoChange = false
      return
    }
    const { showAllFeatures, searchByLocation, searchCurrentExtent } = getSearchWorkflow(this.state.searchSettings)
    //In Case of showAllFeatures and searchByLocation refresh the results only when valid widgetQuries are found
    //this should be executed only when filters are changed on extent change it should not refresh the result, hence skipped filter-data-record-action
    if (showAllFeatures || searchByLocation) {
      this.onRefreshResult(true)
    } else if (searchCurrentExtent) {
      this.aoiToolRef?.current?.onSearchByMapAreaClicked()
    }
  }, 1000)

  /**
   * Render the data source component for the configured useDataSources
   * @returns data source component list
   */
  renderDataSourceComponent = () => {
    const dsComponentList = []
    this.props.useDataSources?.forEach((useDs, index) => {
      dsComponentList.push(<DataSourceComponent
        key={index}
        useDataSource={useDs}
        onQueryRequired={this.onQueryRequired}
        widgetId={this.props.id}
      />)
    })
    return dsComponentList
  }

  render () {
    const { showAllFeatures, searchByLocation, searchCurrentExtent } = getSearchWorkflow(this.state.searchSettings)

    if (!this.props.useMapWidgetIds?.[0]) {
      return (
        <WidgetPlaceholder
          data-testid='widgetPlaceholder'
          icon={widgetIcon} widgetId={this.props.id}
          name={this.props.intl.formatMessage({ id: '_widgetLabel', defaultMessage: this.nls('_widgetLabel') })}
        />
      )
    }
    //showing loading indicator
    const showLoadingIndicator = !this.state.onWidgetLoadShowLoadingIndicator && (!this.state?.jimuMapView || this.state.loadingAllFeaturesFromDs ||
      (this.state.displayLayerAccordion.length === 0 && !this.state.showNoResultsFoundMsg &&
        (showAllFeatures || ((searchByLocation || searchCurrentExtent) && this.state.aoiGeometries)) &&
        this.state.analysisSettings?.layersInfo.length > 0 && this.state.jimuMapView !== null)) && !this.state.queryAborted
    const shouldEnableLayerScroll = this.state.displayLayerAccordion.length > 0 || this.state.showNoResultsFoundMsg || showLoadingIndicator

    const showTopExportForCurrentExtent = this.state.displayLayerAccordion?.length > 0 && this.state.isLayerAvailable && !this.state.showBatchRetriveAll && this.state.exportProgress === 100 &&
      searchCurrentExtent && this.state.jimuMapView && this.state.showExportButton && this.getDataSetRecordsCount() > 0
    const showTopExportForLocationOrAll = this.state.displayLayerAccordion?.length > 0 && this.state.isLayerAvailable && !this.state.showBatchRetriveAll && this.state.exportProgress === 100 &&
      (searchByLocation || showAllFeatures) && this.state.jimuMapView && this.state.showExportButton && this.getDataSetRecordsCount() > 0
    const showTopRetrieveOrProgress = this.state.displayLayerAccordion?.length > 0 && this.state.isLayerAvailable
    const showTopRefreshActions = (this.state.displayLayerAccordion?.length > 0 ||
      (this.state.displayLayerAccordion.length === 0 && this.state.showNoResultsFoundMsg && (showAllFeatures || (searchByLocation && this.state.aoiGeometries)) &&
        this.state.analysisSettings?.layersInfo.length > 0 && this.state.isAnalysisLayerConfigured)) && this.state.isLayerAvailable &&
      (searchByLocation || showAllFeatures) && this.state.jimuMapView
    const showTopButtonList = !!(showTopExportForCurrentExtent || showTopExportForLocationOrAll || showTopRetrieveOrProgress || showTopRefreshActions)

    const loadingMessage = this.state.analysisTakingLongerTime ? this.nls('analysisTakingLongerMsg') : this.nls('loadingText')
    const dsToGetSelectedOnLoad: UseDataSource[] = []
    if (this.state.dsToGetSelectedOnLoad?.length > 0) {
      this.state.dsToGetSelectedOnLoad.forEach((dsId) => {
        const ds = DataSourceManager.getInstance().getDataSource(dsId)
        ds && dsToGetSelectedOnLoad.push({
          dataSourceId: dsId,
          mainDataSourceId: ds.getMainDataSource()?.id,
          rootDataSourceId: ds.getRootDataSource()?.id
        } as UseDataSource)
      })
    }
    return (
      <Paper ref={this.widgetConRef} variant='flat' shape="none" className='jimu-widget' css={getStyle(this.props.theme, this.state.listMaxHeight, this.state.generalSettings.noResultMsgStyleSettings, this.state.generalSettings.promptTextMsgStyleSettings, this.state.searchSettings?.headingLabelStyle, this.state.showFeatureForm)}>
        <JimuMapViewComponent useMapWidgetId={this.props.useMapWidgetIds?.[0]} onActiveViewChange={this.onActiveViewChange}></JimuMapViewComponent>
        {this.renderDataSourceComponent()}
        {dsToGetSelectedOnLoad.length > 0 &&
          <MultipleDataSourceComponent
            useDataSources={Immutable([...dsToGetSelectedOnLoad])}
            onDataSourceInfoChange={this.onDataSourceInfoChange}
            widgetId={this.props.id} />
        }
        <div className='widget-near-me'>

          {this.state.showFeatureForm && this.renderFormForSavingInputLocation()}
          {this.state.isSubmittingForm && <Loading type={LoadingType.Donut} />}

          <div className='main-row w-100 h-100'>
            <div ref={this.divRef}>
              {(searchByLocation || searchCurrentExtent) && this.state.jimuMapView && this.state.isLayerAvailable && this.state.isAnalysisLayerConfigured &&
                <AoiTool
                  ref={this.aoiToolRef}
                  theme={this.props.theme}
                  intl={this.props.intl}
                  widgetClosed={this.state.widgetClosed}
                  activateToolOnWidgetLoad={this.state.searchSettings.activeToolWhenWidgetOpens}
                  isFilterActionBinded={this.state.isFilterActionBinded}
                  headingLabel={this.state.searchSettings?.headingLabel}
                  showInputAddress={this.state.searchSettings?.showInputAddress}
                  config={this.state.searchSettings}
                  highlightColor={colorUtils.parseThemeVariable(this.state.generalSettings.highlightColor, this.props.theme)}
                  bufferSymbol={this.state.generalSettings.searchAreaSymbol}
                  jimuMapView={this.state.jimuMapView}
                  aoiComplete={this.onAoiComplete}
                  clear={this.onClear}
                  bufferLayer={this.bufferLayer}
                  drawingLayer={this.drawingLayer}
                  updateClosestAddressState={this.updateClosestAddressState}
                  incidentGraphicChange={this.onIncidentGraphicChange}
                  msgActionGeometry={this.state.msgActionGeometry}
                  widgetWidth={this.state.widgetWidth}
                />}

              {/*Heading Label for show all features */}
              {showAllFeatures && this.state.jimuMapView && this.state.isLayerAvailable && this.state.isAnalysisLayerConfigured &&
                <Label className={'headingLabelStyle px-2 pt-2'}>{this.state.searchSettings?.headingLabel}</Label>
              }

              {showTopButtonList &&
                <div className='top-button-list'>
                {showTopExportForCurrentExtent &&
                  <div className={'pr-1'}>
                    {this.renderBatchExportList()}
                  </div>
                }

                {showTopExportForLocationOrAll &&
                  <React.Fragment>
                    {this.renderBatchExportList()}
                  </React.Fragment>
                }

                {showTopRetrieveOrProgress &&
                  <React.Fragment>
                    {this.state.showBatchRetriveAll && <div className='top-button'>
                      <Button type='tertiary' aria-label={this.nls('retrieveAll')} color='inherit' icon title={this.nls('retrieveAll')} onClick={this.onBatchRetriveAllClick}><SelectOptionOutlined /></Button>
                    </div>}
                    {!this.state.showBatchRetriveAll && this.state.exportProgress < 100 && <div className='top-button'>
                      <Progress color="primary" type="circular" value={this.state.exportProgress} size={20} thickness={2} />
                    </div>}
                  </React.Fragment>
                }

                {/**
               * Show refresh button in following cases
               * 1. When layer results are shown OR
               * 2. When No result found msg shown (this condition to be inline with no found msg)
               *                 AND
               * 3. ShowAll features or SearchBy location is selected
              */}
                {showTopRefreshActions &&
                  <React.Fragment>
                    {this.state.showSaveIcon && <div className='top-button'>
                      <Button type='tertiary' aria-label={this.nls('saveTooltip')} color='inherit' icon title={this.nls('saveTooltip')} onClick={this.onSaveInputLocationClick}><SaveOutlined /></Button>
                    </div>}
                    {searchByLocation &&
                      <div className='top-button'>
                        <Button type='tertiary' aria-label={this.nls('clear')} color='inherit' icon title={this.nls('clear')} onClick={this.onResetButtonClick}><TrashOutlined /></Button>
                      </div>
                    }
                    <div className='top-button'>
                      <Button type='tertiary' aria-label={this.nls('refreshTooltip')} color='inherit' icon title={this.nls('refreshTooltip')} onClick={() => { this.onRefreshResult(false) }}><RefreshOutlined /></Button>
                    </div>
                  </React.Fragment>
                }
                </div>
              }
            </div>
            <div className={classNames('layerContainer', { 'layerContainer-scroll': shouldEnableLayerScroll })}>
              {/* Initial widget loading indicator */}
              {(this.state.onWidgetLoadShowLoadingIndicator && this.state.isLayerAvailable) && <React.Fragment >
                <Loading type={LoadingType.Donut} />
                <p data-testid={'mapLoadingMsg'} className='map-loading-text pt-4'>{this.nls('mapLoadingMsg')}</p>
              </React.Fragment>
              }

              {/* Loading indicator */}
              {showLoadingIndicator && <React.Fragment>
                <Loading type={LoadingType.Donut} />
                {(this.state.loadingAllFeaturesFromDs || this.state.analysisSettings?.layersInfo.length > 0) &&
                  <p className='loading-text pt-4'>
                    {loadingMessage}
                    {this.state.analysisTakingLongerTime &&
                      <Button role={'button'} aria-label={this.nls('commonModalCancel')} title={this.nls('stopQueryProgressMsg')}
                        size={'default'} type='default' className={'cancel-button-pos'} onClick={this.stopLoading}>
                        {this.nls('commonModalCancel')}
                      </Button>
                    }
                  </p>}
              </React.Fragment>}

              {/* Layers accordions */}
              {this.state.displayLayerAccordion.length > 0 && this.state.jimuMapView && this.state.isLayerAvailable &&
                <React.Fragment>
                  {this.state.displayLayerAccordion}
                </React.Fragment>}

              {/* Display prompt message*/}
              {!showLoadingIndicator && this.state.displayLayerAccordion.length === 0 && (!this.state.showNoResultsFoundMsg || this.state.queryAborted) &&
                this.state.analysisSettings?.layersInfo.length > 0 && this.state.jimuMapView && this.state.isAnalysisLayerConfigured && this.state.isLayerAvailable &&
                <div className='applyPromptTextStyle'>
                  {this.state.generalSettings.promptTextMessage}
                </div>}

              {/* No result found message*/}
              {!showLoadingIndicator && this.state.displayLayerAccordion.length === 0 && (showAllFeatures || ((searchByLocation || searchCurrentExtent) && this.state.aoiGeometries)) &&
                this.state.analysisSettings?.layersInfo.length > 0 && this.state.jimuMapView && this.state.isAnalysisLayerConfigured && this.state.isLayerAvailable && (this.state.showNoResultsFoundMsg && !this.state.queryAborted) &&
                <div className='applyTextStyle'>
                  {this.state.generalSettings.noResultsFoundText}
                </div>}

              {/* No analysis layer is configured*/}
              {!this.state.isAnalysisLayerConfigured && this.state.isLayerAvailable &&
                <Alert tabIndex={0} withIcon={true} size='small' type='info' className='w-100 shadow-2 mb-1 m-0'>
                  <div className='flex-grow-1 text-break settings-text-level' data-testid={'noAnalysisLayerMsg'}>
                    {this.nls('noAnalysisLayerMsg')}
                  </div>
                </Alert>}

              {/* Map/Scene has no layers*/}
              {!this.state.isLayerAvailable &&
                <Alert tabIndex={0} withIcon={true} size='small' type='info' className='w-100 shadow-2 mb-1 m-0'>
                  <div className='flex-grow-1 text-break settings-text-level'>
                    {this.nls('warningMsgIfNoLayersOnMap')}
                  </div>
                </Alert>}
            </div>
          </div>
        </div>
        <ReactResizeDetector targetRef={this.widgetConRef} handleWidth handleHeight onResize={this.onResize} />

        {/**Confirm Dialog whether to show all features analysis */
        this.state.promptForDataAction &&
          <ConfirmDialog
            level='info'
            title={this.getPromptMessageString(this.props.selectedDataSource?.getLabel())}
            hasNotShowAgainOption={false}
            content={this.nls('promptBottomMessageFromDataAction')}
            confirmLabel={this.nls('okButtonLabel')}
            cancelLabel={this.nls('commonModalCancel')}
            onConfirm={this.analyzeAllFeatures.bind(this)}
            onClose={this.onCancelButtonClicked.bind(this)}
          />
        }
      </Paper>
    )
  }
}
