/** @jsx jsx */ // <-- make sure to include the jsx pragma
import { React, jsx, type IntlShape, type IMThemeVariables, urlUtils, defaultMessages as jimuCoreDefaultMessages, type DataSource, type UseDataSource, lodash, Immutable, DataSourceManager, DataSourceTypes, getAppStore } from 'jimu-core'
import { Button, CollapsablePanel, Tooltip, Label, Alert, Checkbox, Switch } from 'jimu-ui'
import { SettingRow, SidePopper } from 'jimu-ui/advanced/setting-components'
import type { JimuMapView } from 'jimu-arcgis'
import { getAnalysisSettingStyle, getSidePanelStyle } from '../lib/style'
import defaultMessages from '../translations/default'
import {
  type AnalysisSettings, type CurrentLayer, type LayersInfo, type DataSourceOptions, AnalysisTypeName, type SearchSettings, type ProximityAnalysis,
  type ClosestAnalysis, type SaveFeatureSetting, type ExpressModeAnalysisPayload,
  type CacheState
} from '../../config'
import { analysisType, defaultAnalysis, expressModeUIVisibility } from '../constants'
import LayersInfos from '../components/layers-info'
import EditAnalysisPopper from '../components/edit-analysis-popper'
import { getAllFieldsNames, getDisplayField, getSelectedLayerInstance, getUniqueAnalysisId } from '../../common/utils'
import { InfoOutlined } from 'jimu-icons/outlined/suggested/info'
import SidepopperBackArrow from './sidepopper-back-arrow'
import { PinEsriOutlined } from 'jimu-icons/outlined/gis/pin-esri'
import { PolylineOutlined } from 'jimu-icons/outlined/gis/polyline'
import { PolygonOutlined } from 'jimu-icons/outlined/gis/polygon'
import { DataSourceSelector } from 'jimu-ui/advanced/data-source-selector'
import ExpressModeAddAnalysisPopper from './express-mode-add-analysis'

interface Props {
  widgetId: string
  intl: IntlShape
  theme: IMThemeVariables
  jimuMapView: JimuMapView
  activeDsSearchConfig: SearchSettings
  activeDsLayersConfig: AnalysisSettings
  allFeatureLayers: DataSourceOptions[]
  selectedDs: string
  useDataSourceConfig: UseDataSource[]
  onAnalysisSettingsUpdated: (prop: string, value: string | boolean | LayersInfo[] | SaveFeatureSetting | AnalysisSettings,
     isSaveFeatures?: boolean, isAllAnalysisSettingsUpdate?: boolean) => void
}

interface State {
  showEditAnalysisPopper: boolean
  showExpressAddAnalysisPopup: boolean
  newAddedLayerAnalysis: LayersInfo[]
  updatedAddedLayerAnalysis: LayersInfo[]
  newLayerAdded: boolean
  layersAnalysisType: string
  analysisIndex: number
  editCurrentLayer: CurrentLayer
  selectedLayerGeometryType: string
  popperFocusNode: HTMLElement
  disableSidePopperOkButton: boolean
  isResultSettingsOpen: boolean
  showPointFeature: boolean
  pointFeatureUseDs: UseDataSource
  showPolylineFeature: boolean
  polylineFeatureUseDs: UseDataSource
  showPolygonFeature: boolean
  polygonFeatureUseDs: UseDataSource
  searchAreaPolygonFeatureUseDs: UseDataSource
  searchActiveMapArea: boolean
  includeOutsideMapArea: boolean
  displayAllLayersResult: boolean
  displayAllLayersResultOnMap: boolean
}

let collectionLayersInfos = []

export default class AnalysisSetting extends React.PureComponent<Props, State> {
  supportedDsTypes = Immutable([DataSourceTypes.FeatureLayer, DataSourceTypes.SubtypeSublayer])
  analysisLayersPopperTrigger = React.createRef<HTMLDivElement>()
  backRef = React.createRef<SidepopperBackArrow>()
  public allDsLayers: DataSource[] = []
  isAnalysisEdited: boolean
  hasLayerOrAnalysisTypeChanged: boolean
  private readonly editedAnalysisLocalKeys = new Set<string>()
  private layerCollectionCache: CacheState | null = null
  constructor (props) {
    super(props)
    if (this.props.activeDsLayersConfig) {
      this.state = {
        showEditAnalysisPopper: false,
        showExpressAddAnalysisPopup: false,
        newAddedLayerAnalysis: this.props.activeDsLayersConfig?.layersInfo?.length > 0 ? this.props.activeDsLayersConfig?.layersInfo : [],
        updatedAddedLayerAnalysis: this.props.activeDsLayersConfig?.layersInfo?.length > 0 ? this.props.activeDsLayersConfig?.layersInfo : [],
        newLayerAdded: false,
        layersAnalysisType: '',
        analysisIndex: null,
        editCurrentLayer: { layerDsId: '', analysisType: '' },
        selectedLayerGeometryType: '',
        popperFocusNode: null,
        disableSidePopperOkButton: false,
        isResultSettingsOpen: false,
        showPointFeature: this.props.activeDsLayersConfig.saveFeatures?.pointFeature?.enabled,
        pointFeatureUseDs: this.props.activeDsLayersConfig.saveFeatures?.pointFeature?.useDataSource,
        showPolylineFeature: this.props.activeDsLayersConfig.saveFeatures?.polylineFeature?.enabled,
        polylineFeatureUseDs: this.props.activeDsLayersConfig.saveFeatures?.polylineFeature?.useDataSource,
        showPolygonFeature: this.props.activeDsLayersConfig.saveFeatures?.polygonFeature?.enabled,
        polygonFeatureUseDs: this.props.activeDsLayersConfig.saveFeatures?.polygonFeature?.useDataSource,
        searchAreaPolygonFeatureUseDs: this.props.activeDsLayersConfig.saveFeatures?.searchAreaFeature?.useDataSource,
        searchActiveMapArea: this.props.activeDsSearchConfig.searchByActiveMapArea,
        includeOutsideMapArea: this.props.activeDsSearchConfig.includeFeaturesOutsideMapArea,
        displayAllLayersResult: this.props.activeDsLayersConfig.displayAllLayersResult,
        displayAllLayersResultOnMap: this.props.activeDsLayersConfig.displayAllLayersResultOnMap
      }
    }
    this.isAnalysisEdited = false
    this.hasLayerOrAnalysisTypeChanged = false
  }

  nls = (id: string) => {
    const messages = Object.assign({}, defaultMessages, jimuCoreDefaultMessages)
    //for unit testing no need to mock intl we can directly use default en msg
    if (this.props.intl && this.props.intl.formatMessage) {
      return this.props.intl.formatMessage({ id: id, defaultMessage: messages[id] })
    } else {
      return messages[id]
    }
  }

  /**
   * Add all the added layers on mount of the component
   */
  componentDidMount = () => {
    collectionLayersInfos = this.collectionOfLayerInfos()
    const layerInfos = []// initial analysis layer delete
    if (this.props.activeDsLayersConfig?.layersInfo.length > 0) {
      this.props.activeDsLayersConfig?.layersInfo.map((result) => {
        layerInfos.push(result)
        return true
      })
      this.setState({
        newAddedLayerAnalysis: layerInfos
      })
    }
  }

  /**
   * Update the config as per the config changes
   * @param prevProps previous props of the config
   */
  componentDidUpdate = (prevProps) => {
    //check if search by active map area props changes in live view
    // Cache will be automatically invalidated on next collectionOfLayerInfos() call
    // due to dependency check in shouldRebuildLayerCache()
    if (prevProps.activeDsSearchConfig.searchByActiveMapArea !== this.props.activeDsSearchConfig.searchByActiveMapArea) {
      collectionLayersInfos = this.collectionOfLayerInfos()
    }

    if (prevProps.activeDsSearchConfig.searchByActiveMapArea !== this.props.activeDsSearchConfig.searchByActiveMapArea ||
      prevProps.activeDsSearchConfig.includeFeaturesOutsideMapArea !== this.props.activeDsSearchConfig.includeFeaturesOutsideMapArea) {
      this.setState({
        searchActiveMapArea: this.props.activeDsSearchConfig.searchByActiveMapArea,
        includeOutsideMapArea: this.props.activeDsSearchConfig.includeFeaturesOutsideMapArea
      })
    }

    if (prevProps.activeDsLayersConfig?.layersInfo.length !== this.props.activeDsLayersConfig?.layersInfo.length ||
      !lodash.isDeepEqual(prevProps.activeDsLayersConfig?.layersInfo, this.props.activeDsLayersConfig?.layersInfo)) {
      this.setState({
        newAddedLayerAnalysis: this.props.activeDsLayersConfig?.layersInfo
      })
    }

    if (prevProps.activeDsLayersConfig.saveFeatures?.pointFeature?.enabled !== this.props.activeDsLayersConfig.saveFeatures?.pointFeature?.enabled) {
      this.setState({
        showPointFeature: this.props.activeDsLayersConfig.saveFeatures?.pointFeature?.enabled
      })
    } else if (prevProps.activeDsLayersConfig.saveFeatures?.polylineFeature?.enabled !== this.props.activeDsLayersConfig.saveFeatures?.polylineFeature?.enabled) {
      this.setState({
        showPolylineFeature: this.props.activeDsLayersConfig.saveFeatures?.polylineFeature?.enabled
      })
    } else if (prevProps.activeDsLayersConfig.saveFeatures?.polygonFeature?.enabled !== this.props.activeDsLayersConfig.saveFeatures?.polygonFeature?.enabled) {
      this.setState({
        showPolygonFeature: this.props.activeDsLayersConfig.saveFeatures?.polygonFeature?.enabled
      })
    }
  }

  /**
    * Update only show layer result property
    * @param evt only show results options event
    */
  onlyShowResultsOptionChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
    this.props.onAnalysisSettingsUpdated('onlyShowLayersResult', evt.target.checked)
  }

  /**
   * Update display all layers result
   * @param evt display all layers result options event
   */
  displayAllLayersResultOptionChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
    const nextDisplayAllLayersResult = evt.target.checked
    let nextDisplayAllLayersResultOnMap = false

    this.setState((prevState) => {
      // Unchecking "display all results" must also disable "display on map"
      nextDisplayAllLayersResultOnMap = nextDisplayAllLayersResult ? prevState.displayAllLayersResultOnMap : false
      return {
        displayAllLayersResult: nextDisplayAllLayersResult,
        displayAllLayersResultOnMap: nextDisplayAllLayersResultOnMap
      }
    }, () => {
      this.analysisSettingsUpdate(nextDisplayAllLayersResult, nextDisplayAllLayersResultOnMap)
    })
  }

  /**
   * Update display all layers result on the map
   * @param evt display all layers result options event
   */
  displayAllLayersResultOnMapOptionChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
    const nextDisplayAllLayersResultOnMap = evt.target.checked
    let nextDisplayAllLayersResult = false

    this.setState((prevState) => {
      // Checking "display on map" must also enable "display all results"
      nextDisplayAllLayersResult = nextDisplayAllLayersResultOnMap ? true : prevState.displayAllLayersResult
      return {
        displayAllLayersResultOnMap: nextDisplayAllLayersResultOnMap,
        displayAllLayersResult: nextDisplayAllLayersResult
      }
    }, () => {
      this.analysisSettingsUpdate(nextDisplayAllLayersResult, nextDisplayAllLayersResultOnMap)
    })
  }

/**
 * Persist the complete analysis settings payload for result-display toggles.
 * This method enforces the following rules:
 * - If "display all layers result" is false, "display all layers result on map" must be false.
 * - If "display all layers result on map" is true, "display all layers result" must be true.
 */
  analysisSettingsUpdate = (displayAllLayersResult: boolean, displayAllLayersResultOnMap: boolean) => {
    const analysisSettings: AnalysisSettings = {
      layersInfo: this.props.activeDsLayersConfig.layersInfo,
      displayAnalysisIcon: this.props.activeDsLayersConfig.displayAnalysisIcon,
      displayMapSymbols: this.props.activeDsLayersConfig.displayMapSymbols,
      showDistFromInputLocation: this.props.activeDsLayersConfig.showDistFromInputLocation,
      onlyShowLayersResult: this.props.activeDsLayersConfig.onlyShowLayersResult,
      displayAllLayersResult,
      displayAllLayersResultOnMap,
      enableProximitySearch: this.props.activeDsLayersConfig.enableProximitySearch,
      saveFeatures: this.props.activeDsLayersConfig.saveFeatures
    }
    this.props.onAnalysisSettingsUpdated('analysisSettings', analysisSettings, undefined, true)

  }
  /**
   * Update proximity search option
   * @param evt proximity search option event
   */
  enableProximitySearchOptionChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
    this.props.onAnalysisSettingsUpdated('enableProximitySearch', evt.target.checked)
  }

  /**
   * Update save input location option
   * @param evt save input location event
   */
  enableSaveInputLocation = (evt: React.ChangeEvent<HTMLInputElement>) => {
    this.props.onAnalysisSettingsUpdated('saveInputLocation', evt.target.checked, true, undefined)
  }

  /**
   * Update save search area option
   * @param evt save search area event
   */
  enableSaveSearchArea = (evt: React.ChangeEvent<HTMLInputElement>) => {
    const updateSaveSearchArea: SaveFeatureSetting = {
      enabled: evt.target.checked,
      useDataSource: this.state.searchAreaPolygonFeatureUseDs
    }
    this.props.onAnalysisSettingsUpdated('searchAreaFeature', updateSaveSearchArea, true, undefined)
  }

  /**
   * Update Point feature option
   * @param evt point feature change event
   */
  onPointFeatureChange = (evt: any) => {
    this.setState({
      showPointFeature: evt.target.checked
    })
    const updatePointFeature: SaveFeatureSetting = {
      enabled: evt.target.checked,
      useDataSource: this.state.pointFeatureUseDs
    }
    this.props.onAnalysisSettingsUpdated('pointFeature', updatePointFeature, true, undefined)
  }

  /**
   * Update the polyline feature option
   * @param evt polyline feature change event
   */
  onPolylineFeatureChange = (evt: any) => {
    this.setState({
      showPolylineFeature: evt.target.checked
    })
    const updatePolylineFeature: SaveFeatureSetting = {
      enabled: evt.target.checked,
      useDataSource: this.state.polylineFeatureUseDs
    }
    this.props.onAnalysisSettingsUpdated('polylineFeature', updatePolylineFeature, true, undefined)
  }

  /**
   * Update the polygon feature option
   * @param evt polygon feature change event
   */
  onPolygonFeatureChange = (evt: any) => {
    this.setState({
      showPolygonFeature: evt.target.checked
    })
    const updatePolygonFeature: SaveFeatureSetting = {
      enabled: evt.target.checked,
      useDataSource: this.state.polygonFeatureUseDs
    }
    this.props.onAnalysisSettingsUpdated('polygonFeature', updatePolygonFeature, true, undefined)
  }

  /**
   * Save point data source
   * @param useDataSources use data source
   */
  pointDataSourceChangeSave = (useDataSources: UseDataSource[]) => {
    if (!useDataSources) {
      return
    }
    this.setState({
      pointFeatureUseDs: useDataSources[0]
    })
    const updatePointFeature: SaveFeatureSetting = {
      enabled: this.state.showPointFeature,
      useDataSource: useDataSources[0]
    }
    this.props.onAnalysisSettingsUpdated('pointFeature', updatePointFeature, true, undefined)
  }

  /**
   * Save the polyline data source
   * @param useDataSources use data source
   */
  polylineDataSourceChangeSave = (useDataSources: UseDataSource[]) => {
    if (!useDataSources) {
      return
    }
    this.setState({
      polylineFeatureUseDs: useDataSources[0]
    })
    const updatePolylineFeature: SaveFeatureSetting = {
      enabled: this.state.showPolylineFeature,
      useDataSource: useDataSources[0]
    }
    this.props.onAnalysisSettingsUpdated('polylineFeature', updatePolylineFeature, true, undefined)
  }

  /**
   * Save the polygon datasource
   * @param useDataSources use data source
   */
  polygonDataSourceChangeSave = (useDataSources: UseDataSource[]) => {
    if (!useDataSources) {
      return
    }
    this.setState({
      polygonFeatureUseDs: useDataSources[0]
    })
    const updatePolygonFeature: SaveFeatureSetting = {
      enabled: this.state.showPolygonFeature,
      useDataSource: useDataSources[0]
    }
    this.props.onAnalysisSettingsUpdated('polygonFeature', updatePolygonFeature, true, undefined)
  }

  /**
   * Save the search area polygon data source
   * @param useDataSources use data source
   * @returns
   */
  searchAreaPolygonDataSourceChangeSave = (useDataSources: UseDataSource[]) => {
    if (!useDataSources) {
      return
    }
    this.setState({
      searchAreaPolygonFeatureUseDs: useDataSources[0]
    })
    const searchAreaPolygonFeature: SaveFeatureSetting = {
      enabled: true,
      useDataSource: useDataSources[0]
    }
    this.props.onAnalysisSettingsUpdated('searchAreaFeature', searchAreaPolygonFeature, true, undefined)
  }

  /**
   * Toggle results on click of collapsible to expand or collapse the panel
   */
  onToggleResults = () => {
    this.setState({
      isResultSettingsOpen: !this.state.isResultSettingsOpen
    })
  }

  /**
   * Update show distance from input location property
   * @param evt show distance from input location change event
   */
  onShowDistFromInputLocToolsChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
    this.props.onAnalysisSettingsUpdated('showDistFromInputLocation', evt.target.checked)
  }

  /**
   * Update the display analysis icon property
   * @param evt display analysis icon change event
   */
  displayAnalysisIconStateChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
    this.props.onAnalysisSettingsUpdated('displayAnalysisIcon', evt.target.checked)
  }

  /**
   * Update the show map symbols property
   * @param evt display map symbol change event
   */
  displayMapSymbolsStateChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
    this.props.onAnalysisSettingsUpdated('displayMapSymbols', evt.target.checked)
  }

  /**
   * Check if layer collection cache needs invalidation
   * @returns true if cache should be rebuilt
   */
  private readonly shouldRebuildLayerCache = (): boolean => {
    if (!this.layerCollectionCache) return true
    return (
      this.layerCollectionCache.lastSelectedDs !== this.props.selectedDs ||
      this.layerCollectionCache.lastSearchByActiveMapArea !== this.props.activeDsSearchConfig.searchByActiveMapArea
    )
  }

  /**
   * Extract unique layers from feature layers config with O(n) complexity
   * @returns array of unique DataSource instances
   */
  private readonly extractUniqueLayers = (): DataSource[] => {
    const uniqueLayers: DataSource[] = []
    const seenLayerIds = new Set<string>()

    const selectedLayerConfig = this.props.allFeatureLayers.find(
      (layersConfig) => layersConfig.value === this.props.selectedDs
    )

    if (!selectedLayerConfig?.availableLayers) {
      return uniqueLayers
    }

    // Single pass to extract unique layers
    selectedLayerConfig.availableLayers.forEach((layer) => {
      const getLayersInstance = getSelectedLayerInstance((layer as any).layerDsId)
      const layerId = getLayersInstance?.id
      if (getLayersInstance && layerId && !seenLayerIds.has(layerId)) {
        seenLayerIds.add(layerId)
        uniqueLayers.push(getLayersInstance)
      }
    })

    return uniqueLayers
  }

  /**
   * Create the collection of combinations of different layers with closest, proximity and summary analysis types
   * Uses memoization to avoid unnecessary recalculation
   * Reduced complexity from O(n²) to O(n) by using flatMap instead of nested loops
   * @returns combination of analysis type and configured feature layer
   */
  collectionOfLayerInfos = () => {
    // Return cached result if dependencies haven't changed
    if (!this.shouldRebuildLayerCache()) {
      return this.layerCollectionCache?.combinations || []
    }

    // Extract unique layers in O(n) time
    const uniqueLayers = this.extractUniqueLayers()
    this.allDsLayers = uniqueLayers

    // Build combinations using flatMap - O(n*m) where m is constant (analysisType length)
    const combinations = uniqueLayers.flatMap((featureLayer) =>
      analysisType
        .filter((type) => !(
          this.props.activeDsSearchConfig.searchByActiveMapArea &&
          type === AnalysisTypeName.Closest
        ))
        .map((analysisTypeValue) => ({
          analysisType: analysisTypeValue,
          featureLayer
        }))
    )

    // Cache the result with dependency metadata to prevent unnecessary rebuilds
    this.layerCollectionCache = {
      combinations,
      uniqueLayers,
      lastSelectedDs: this.props.selectedDs,
      lastSearchByActiveMapArea: this.props.activeDsSearchConfig.searchByActiveMapArea
    }
    return combinations
  }

  /**
   * On add analysis click the analysis layers gets added with the respective types
   * eg. Closest, Proximity, Summary
  */
  onAddAnalysisClick = () => {
    if (window.isExpressBuilder) {
      return this.analysisIfExpressBuilder()
    } else {
      return this.analysisIfNoExpressBuilder()
    }
  }

  //open the express mode add analysis popup
  analysisIfExpressBuilder = () => {
    this.setState({
      showExpressAddAnalysisPopup: true
    })
    return this.state.newAddedLayerAnalysis
  }

  /**
   * Convert one express-mode row into a saved analysis configuration with shared settings applied.
   * @param layerInfo - The express-mode layer row containing useDataSource and label.
   * @param analysisType - The analysis type (Closest, Proximity or Summary) to create.
   * @param commonLayersInfo - Shared settings (featureCount, highlight, expand) applied to all analyses.
   * @returns A fully populated LayersInfo object ready to be persisted.
   */
  createAnalysisFromExpressMode = (layerInfo, analysisType: AnalysisTypeName, commonLayersInfo: ExpressModeAnalysisPayload['commonLayersInfo']): LayersInfo => {
    const analysisInfo: any = lodash.cloneDeep(defaultAnalysis.find(result => result.analysisType === analysisType))
    const layerObj = getSelectedLayerInstance(layerInfo.useDataSource.dataSourceId) as any

    analysisInfo.analysisId = getUniqueAnalysisId()
    analysisInfo.fieldsToExport = getAllFieldsNames(layerInfo.useDataSource.dataSourceId)
    analysisInfo.displayFeatureCount = commonLayersInfo.featureCount
    analysisInfo.highlightResultsOnMap = commonLayersInfo.highlightResultsOnMap
    analysisInfo.highlightColorOnMap = commonLayersInfo.highlightColor
    analysisInfo.expandOnOpen = commonLayersInfo.expandAnalysisResults

    if (analysisType === AnalysisTypeName.Proximity) {
      analysisInfo.displayField = getDisplayField(layerObj)
    }

    return {
      useDataSource: layerInfo.useDataSource,
      label: layerInfo.label,
      analysisInfo
    }
  }

  /**
   * Create express-mode analyses, merge them into existing settings, and persist the result.
   * @param analysisPayload - The payload emitted by the popup, containing layersInfo selections
   *   and commonLayersInfo shared settings.
   */
  addAnalysisOkClick = (analysisPayload: ExpressModeAnalysisPayload) => {
    const createdLayersInfo: LayersInfo[] = []

    analysisPayload.layersInfo.forEach((layerInfo) => {
      if (!layerInfo.enabled) {
        return
      }

      if (layerInfo.closest) {
        createdLayersInfo.push(this.createAnalysisFromExpressMode(layerInfo, AnalysisTypeName.Closest, analysisPayload.commonLayersInfo))
      }

      if (layerInfo.proximity) {
        createdLayersInfo.push(this.createAnalysisFromExpressMode(layerInfo, AnalysisTypeName.Proximity, analysisPayload.commonLayersInfo))
      }

      if (layerInfo.summary) {
        createdLayersInfo.push(this.createAnalysisFromExpressMode(layerInfo, AnalysisTypeName.Summary, analysisPayload.commonLayersInfo))
      }
    })

    const mergedLayersInfo = [
      ...this.state.newAddedLayerAnalysis,
      ...createdLayersInfo
    ]

    // Analyses created from Add popup are considered unedited.
    createdLayersInfo.forEach((layerInfo) => {
      const key = this.getLocalEditedAnalysisKey(layerInfo?.useDataSource?.dataSourceId, layerInfo?.analysisInfo?.analysisType)
      this.editedAnalysisLocalKeys.delete(key)
    })

    this.setState({
      newAddedLayerAnalysis: mergedLayersInfo,
      updatedAddedLayerAnalysis: mergedLayersInfo,
      showExpressAddAnalysisPopup: false
    }, () => {
      this.props.onAnalysisSettingsUpdated('layersInfo', mergedLayersInfo)
    })
  }

  /**
   * Close the express-mode add analysis popup without changing saved analysis settings.
   */
  addAnalysisCloseClick = () => {
    this.setState({
      showExpressAddAnalysisPopup: false
    })
  }

  /**
   * Add a single analysis entry in standard builder mode and open it in the side popper.
   * Reuses the first unmatched layer/type combination when available; otherwise falls back
   * to the default closest or proximity analysis based on current search settings.
   */
  analysisIfNoExpressBuilder = () => {
    this.setSidePopperAnchor(null, true)
    if (this.props.activeDsLayersConfig?.layersInfo.length > 0) {
      const indexes = []
      //checks whether the layers and analysis type combinations matches with the configured analysis
      for (let i = 0; i < collectionLayersInfos.length; i++) {
        for (let j = 0; j < this.state.newAddedLayerAnalysis.length; j++) {
          if (collectionLayersInfos[i].analysisType === this.state.newAddedLayerAnalysis[j].analysisInfo.analysisType &&
            collectionLayersInfos[i].featureLayer.id === this.state.newAddedLayerAnalysis[j].useDataSource.dataSourceId) {
            indexes.push(i)
          }
        }
      }
      const unmatchedIndex = []
      collectionLayersInfos.forEach((result, index) => {
        if (!indexes.includes(index)) {
          unmatchedIndex.push(index)
        }
      })
      const createUseDs: UseDataSource = {
        dataSourceId: collectionLayersInfos[unmatchedIndex?.[0]]?.featureLayer?.id,
        mainDataSourceId: collectionLayersInfos[unmatchedIndex?.[0]]?.featureLayer?.id,
        rootDataSourceId: this.props.selectedDs
      }
      // Adds the analysis layer-wise and each layer with 3 different analysis types
      if (unmatchedIndex.length > 0) {
        const analysis: any = defaultAnalysis.find(result => result.analysisType === collectionLayersInfos[unmatchedIndex[0]].analysisType)
        const layerObj = getSelectedLayerInstance(collectionLayersInfos[unmatchedIndex[0]].featureLayer.id) as any
        const newAnalysis: LayersInfo = {
          useDataSource: createUseDs,
          label: layerObj?.getLabel(),
          analysisInfo: analysis
        }
        const analysisInfo: any = newAnalysis.analysisInfo
        analysisInfo.analysisId = getUniqueAnalysisId()
        analysisInfo.fieldsToExport = getAllFieldsNames(collectionLayersInfos[unmatchedIndex[0]].featureLayer.id)
        if (collectionLayersInfos[unmatchedIndex[0]].analysisType === AnalysisTypeName.Proximity) {
          analysisInfo.displayField = getDisplayField(layerObj)
        }
        newAnalysis.analysisInfo = analysisInfo
        const updatedLayerAnalysis = [...this.state.newAddedLayerAnalysis, newAnalysis]
        this.setState({
          newAddedLayerAnalysis: updatedLayerAnalysis,
          analysisIndex: this.state.newAddedLayerAnalysis.length,
          editCurrentLayer: { layerDsId: collectionLayersInfos[unmatchedIndex[0]].featureLayer.id, analysisType: collectionLayersInfos[unmatchedIndex[0]].analysisType },
          selectedLayerGeometryType: layerObj?.getLayerDefinition()?.geometryType,
          newLayerAdded: true,
          showEditAnalysisPopper: true
        })
        return updatedLayerAnalysis
      } else { //if all the layers with analysis types are added then add the closest/ proximity default analysis type again
        //depending on searchByActiveMapArea parameter
        return this.displayDefaultClosestOrProximity(collectionLayersInfos, true)
      }
    } else { //if any analysis not configured then load the layer with closest/ proximity analysis type
      //depending on searchByActiveMapArea parameter
      return this.displayDefaultClosestOrProximity(collectionLayersInfos, false)
    }
  }

  /**
   * Display the closest or proximity analysis type layer info
   * @param collectionLayersInfos Feature layer instance
   * @param isAdded Check if the layer is added
   * @returns Promise that resolves to the updated newAddedLayerAnalysis state
   */
  displayDefaultClosestOrProximity = (collectionLayersInfos, isAdded: boolean): LayersInfo[] => {
    const defaultUseDs: UseDataSource = {
      dataSourceId: collectionLayersInfos[0].featureLayer.id,
      mainDataSourceId: collectionLayersInfos[0].featureLayer.id,
      rootDataSourceId: this.props.selectedDs
    }

    const layerObj = getSelectedLayerInstance(collectionLayersInfos[0].featureLayer.id)
    const newAnalysis: LayersInfo = {
      useDataSource: defaultUseDs,
      label: layerObj?.getLabel(),
      analysisInfo: this.props.activeDsSearchConfig.searchByActiveMapArea ? defaultAnalysis[1] as ProximityAnalysis : defaultAnalysis[0] as ClosestAnalysis
    }
    const analysisInfo = newAnalysis.analysisInfo
    analysisInfo.analysisId = getUniqueAnalysisId()
    newAnalysis.analysisInfo = analysisInfo
    newAnalysis.analysisInfo.fieldsToExport = getAllFieldsNames(collectionLayersInfos[0].featureLayer.id)

    const updatedLayerAnalysis = isAdded ? [...this.state.newAddedLayerAnalysis, newAnalysis] : [newAnalysis]
    this.setState({
      newAddedLayerAnalysis: updatedLayerAnalysis,
      analysisIndex: this.state.newAddedLayerAnalysis.length,
      editCurrentLayer: { layerDsId: collectionLayersInfos[0].featureLayer.id, analysisType: collectionLayersInfos[0].analysisType },
      showEditAnalysisPopper: true,
      newLayerAdded: true
    })
    return updatedLayerAnalysis
  }

  /**
   * Close the edit analysis side popper
   */
  closeEditAnalysisPopper = () => {
    this.isAnalysisEdited = false
    this.hasLayerOrAnalysisTypeChanged = false
    if (this.state.newLayerAdded) {
      this.setSidePopperAnchor(null, true)
    } else {
      this.setSidePopperAnchor(this.state.analysisIndex)
    }
    const configuredLayersInfo: any = this.props.activeDsLayersConfig?.layersInfo
    this.setState({
      newAddedLayerAnalysis: this.props.activeDsLayersConfig?.layersInfo?.length > 0 ? configuredLayersInfo : [],
      showEditAnalysisPopper: false,
      analysisIndex: null,
      editCurrentLayer: { layerDsId: '', analysisType: '' }
    }, () => {
      this.props.onAnalysisSettingsUpdated('layersInfo', this.state.newAddedLayerAnalysis)
    })
  }

  /**
   * Update the config when analysis added or edited on OK button clicked
   */
  editOkButtonCLick = () => {
    const shouldPersistUpdatedAnalysis = this.isAnalysisEdited || this.hasLayerOrAnalysisTypeChanged

    if (this.isAnalysisEdited && !this.hasLayerOrAnalysisTypeChanged) {
      const editedLayer = this.state.updatedAddedLayerAnalysis?.[this.state.analysisIndex]
      const key = this.getLocalEditedAnalysisKey(editedLayer?.useDataSource?.dataSourceId, editedLayer?.analysisInfo?.analysisType)
      this.editedAnalysisLocalKeys.add(key)
    } else if (this.hasLayerOrAnalysisTypeChanged) {
      const previousLayer = this.state.newAddedLayerAnalysis?.[this.state.analysisIndex]
      const updatedLayer = this.state.updatedAddedLayerAnalysis?.[this.state.analysisIndex]
      const previousKey = this.getLocalEditedAnalysisKey(previousLayer?.useDataSource?.dataSourceId, previousLayer?.analysisInfo?.analysisType)
      const updatedKey = this.getLocalEditedAnalysisKey(updatedLayer?.useDataSource?.dataSourceId, updatedLayer?.analysisInfo?.analysisType)
      this.editedAnalysisLocalKeys.delete(previousKey)
      this.editedAnalysisLocalKeys.delete(updatedKey)
    }

    this.setState({
      showEditAnalysisPopper: false,
      newAddedLayerAnalysis: shouldPersistUpdatedAnalysis ? this.state.updatedAddedLayerAnalysis : this.state.newAddedLayerAnalysis
    }, () => {
      this.props.onAnalysisSettingsUpdated('layersInfo', this.state.newAddedLayerAnalysis)
    })
    this.isAnalysisEdited = false
    this.hasLayerOrAnalysisTypeChanged = false
  }

  /**
  * On click opens the Edit side popper of the respective analysis layers settings
  * @param isOpen Check if analysis layer is in editing mode
  * @param layerDsId Specifies layer Ds id
  * @param analysisType Analysis type of respective layer
  * @param analysisIndex Edit analysis layer index
  */
  onEditButtonClick = (isOpen: boolean, layerDsId: string, analysisType: string, analysisIndex: number) => {
    this.isAnalysisEdited = false
    this.hasLayerOrAnalysisTypeChanged = false
    this.setSidePopperAnchor(analysisIndex)
    this.setState({
      showEditAnalysisPopper: isOpen,
      analysisIndex: analysisIndex,
      editCurrentLayer: { layerDsId: layerDsId, analysisType: analysisType },
      newLayerAdded: false
    })
  }

  /**
   * set side popper anchor
   * @param index index of the analysis
   */
  setSidePopperAnchor = (index?: number, isNewAdded = false) => {
    let node: any
    if (isNewAdded) {
      node = this.analysisLayersPopperTrigger.current.getElementsByClassName('add-layer-btn')[0]
    } else {
      node = this.analysisLayersPopperTrigger.current?.getElementsByClassName('jimu-tree-item__body')[index]
    }
    this.setState({
      popperFocusNode: node
    })
  }

  /**
   * On click deletes the respective layers shell and layers settings
   * @param addedLayerAnalysis Layer info that to be deleted
   * @param layerDsId Specifies layer Ds id
   * @param analysisType Analysis type of respective layer
   * @param index Delete analysis layer index
   */
  onDeleteButtonClick = (addedLayerAnalysis, layerDsId: string, analysisType: string, index: number) => {
    const removedKey = this.getLocalEditedAnalysisKey(layerDsId, analysisType)
    this.editedAnalysisLocalKeys.delete(removedKey)

    this.setState({
      newAddedLayerAnalysis: addedLayerAnalysis,
      analysisIndex: index
    }, () => {
      this.props.onAnalysisSettingsUpdated('layersInfo', addedLayerAnalysis)
      if (this.state.analysisIndex === -1 && this.state.editCurrentLayer.layerDsId === layerDsId && this.state.editCurrentLayer.analysisType === analysisType) {
        this.setSidePopperAnchor(this.state.analysisIndex)
        this.setState({
          showEditAnalysisPopper: false,
          analysisIndex: null,
          editCurrentLayer: { layerDsId: '', analysisType: '' }
        }, () => {
          this.props.onAnalysisSettingsUpdated('layersInfo', this.state.newAddedLayerAnalysis)
        })
      }
    })
  }

  /**
   * On layer info settings update, update the config
   * @param updatedAnalysis Update layers info
   * @param analysisIndex Index of updated layer
   * @param layerDsId Specifies layer Ds id
   * @param analysisType Analysis type of respective layer
   */

  updateLayersInfoSettings = (updatedAnalysis, analysisIndex: number, layerDsId: string, analysisType: string) => {
    this.setState({
      newAddedLayerAnalysis: updatedAnalysis,
      analysisIndex: analysisIndex,
      editCurrentLayer: { layerDsId: layerDsId, analysisType: analysisType }
    }, () => {
      this.props.onAnalysisSettingsUpdated('layersInfo', updatedAnalysis)
    })
  }

  /**
   * On parameter update of analysis info
   * @param analysisListSettings Layer analysis list
   * @param layerDsId Specifies layer Ds id
   * @param analysisType Analysis type of respective layer
   * @param idx Index of updated layer
   */

  onAnalysisInfoUpdate = (analysisListSettings: LayersInfo[], layerDsId: string, analysisType: string, idx: number) => {
    const previousLayer = this.state.newAddedLayerAnalysis?.[idx]
    const updatedLayer = analysisListSettings?.[idx]
    const isLayerOrAnalysisTypeChanged =
      previousLayer?.useDataSource?.dataSourceId !== updatedLayer?.useDataSource?.dataSourceId ||
      previousLayer?.analysisInfo?.analysisType !== updatedLayer?.analysisInfo?.analysisType

    this.isAnalysisEdited = !isLayerOrAnalysisTypeChanged
    this.hasLayerOrAnalysisTypeChanged = isLayerOrAnalysisTypeChanged

    this.setState({
      updatedAddedLayerAnalysis: analysisListSettings,
      analysisIndex: idx,
      editCurrentLayer: { layerDsId: layerDsId, analysisType: analysisType }
    })
  }

  private readonly getLocalEditedAnalysisKey = (layerDsId: string, analysisType: string): string => {
    return `${layerDsId || ''}|${analysisType || ''}`
  }

  /**
   * Disable the OK button when search by active map area is enabled and closest analysis is configured
   * @param disable Disable only in case of closest analysis
   */
  onDisableOkButton = (disable: boolean) => {
    this.setState({
      disableSidePopperOkButton: disable
    })
  }

  /**
    * Get the data source root ids from the appconfig datasources
    * @returns array of root data source ids
    */
  getDsRootIdsByWidgetId = () => {
    const appConfig = getAppStore().getState()?.appStateInBuilder?.appConfig
    const widgetJson = appConfig
    const rootIds = []
    const ds = widgetJson?.dataSources[this.props.selectedDs]
    if (ds?.type === DataSourceTypes.WebMap || ds?.type === DataSourceTypes.WebScene) { // is root ds
      rootIds.push(this.props.selectedDs)
    }

    return rootIds.length > 0 ? Immutable(rootIds) : undefined
  }

  render () {
    const ds = DataSourceManager.getInstance().getDataSource(this.props.selectedDs)
    const childDs = ds?.isDataSourceSet() && ds?.getChildDataSources()
    let dsAdded = false
    const pointDsRootIdsArr = []
    const polylineDsRootIdsArr = []
    const polygonDsRootIdsArr = []
    if (childDs) {
      childDs.forEach((layer) => {
        if (layer?.type === DataSourceTypes.MapService || layer?.type === DataSourceTypes.GroupLayer || layer?.type === DataSourceTypes.SubtypeGroupLayer) {
          const recursiveCheckForGroupLayers = (grpLayer) => {
            const grpChildlayers = grpLayer.getChildDataSources()
            grpChildlayers.forEach((subLayers) => {
              if (subLayers?.type === DataSourceTypes.MapService || subLayers?.type === DataSourceTypes.GroupLayer || subLayers?.type === DataSourceTypes.SubtypeGroupLayer) {
                recursiveCheckForGroupLayers(subLayers)
              } else if (subLayers?.type === DataSourceTypes.FeatureLayer || subLayers?.type === DataSourceTypes.SubtypeSublayer) {
                const layerDefinition = subLayers?.getLayerDefinition()
                if (layerDefinition?.geometryType && layerDefinition?.geometryType === 'esriGeometryPoint' &&
                  subLayers.layer.capabilities.operations.supportsEditing) {
                  pointDsRootIdsArr.push(subLayers.id)
                } else if (layerDefinition?.geometryType && layerDefinition?.geometryType === 'esriGeometryPolyline' &&
                  subLayers.layer.capabilities.operations.supportsEditing) {
                  polylineDsRootIdsArr.push(subLayers.id)
                } else if (layerDefinition?.geometryType && layerDefinition?.geometryType === 'esriGeometryPolygon' &&
                  subLayers.layer.capabilities.operations.supportsEditing) {
                  polygonDsRootIdsArr.push(subLayers.id)
                }
              }
            })
          }
          recursiveCheckForGroupLayers(layer)
        } else if (layer?.type === DataSourceTypes.FeatureLayer || layer?.type === DataSourceTypes.SubtypeSublayer) { //for feature layer
          const layerDefinition = (layer as any)?.getLayerDefinition()
          if (layerDefinition?.geometryType === 'esriGeometryPoint' && (layer as any).layer.capabilities.operations.supportsEditing) {
            if (pointDsRootIdsArr.length > 0) { //check for if map service child data source is same as feature layer ds id
              const matchedLayerWithMapService = pointDsRootIdsArr.find(item => item.id === layer.id)
              if (!matchedLayerWithMapService) {
                dsAdded = true
              }
              if (dsAdded && layerDefinition?.geometryType) pointDsRootIdsArr.push(layer.id)
            } else {
              if (layerDefinition?.geometryType) pointDsRootIdsArr.push(layer.id)
            }
          } else if (layerDefinition?.geometryType === 'esriGeometryPolyline' && (layer as any).layer.capabilities.operations.supportsEditing) {
            if (polylineDsRootIdsArr.length > 0) { //check for if map service child data source is same as feature layer ds id
              const matchedLayerWithMapService = polylineDsRootIdsArr.find(item => item.id === layer.id)
              if (!matchedLayerWithMapService) {
                dsAdded = true
              }
              if (dsAdded && layerDefinition?.geometryType) polylineDsRootIdsArr.push(layer.id)
            } else {
              if (layerDefinition?.geometryType) polylineDsRootIdsArr.push(layer.id)
            }
          } else if (layerDefinition?.geometryType === 'esriGeometryPolygon' && (layer as any).layer.capabilities.operations.supportsEditing) {
            if (polygonDsRootIdsArr.length > 0) { //check for if map service child data source is same as feature layer ds id
              const matchedLayerWithMapService = polygonDsRootIdsArr.find(item => item.id === layer.id)
              if (!matchedLayerWithMapService) {
                dsAdded = true
              }
              if (dsAdded && layerDefinition?.geometryType) polygonDsRootIdsArr.push(layer.id)
            } else {
              if (layerDefinition?.geometryType) polygonDsRootIdsArr.push(layer.id)
            }
          }
        }
      })
    }

    const dsRootIds = this.getDsRootIdsByWidgetId()

    //dsObject parameters used to pass to the ds selector
    const pointDsSelectorSource = {
      fromRootDsIds: dsRootIds,
      fromDsIds: Immutable(pointDsRootIdsArr)
    }
    const polylineDsSelectorSource = {
      fromRootDsIds: dsRootIds,
      fromDsIds: Immutable(polylineDsRootIdsArr)
    }
    const polygonDsSelectorSource = {
      fromRootDsIds: dsRootIds,
      fromDsIds: Immutable(polygonDsRootIdsArr)
    }
    return (
      <div css={getAnalysisSettingStyle(this.props.theme)} style={{ height: '100%', width: '100%' }}>
        <div ref={this.analysisLayersPopperTrigger} className='mb-4'>
          <SettingRow role='group' aria-label={this.state.newAddedLayerAnalysis.length === 0 ? this.nls('noAnalysisConfiguredMsg') : ''}>
            <Button role={'button'} className={'w-100 text-dark add-layer-btn'} type={'primary'} onClick={this.onAddAnalysisClick.bind(this)} >
              {this.nls('addAnalysisLabel')}
            </Button>
          </SettingRow>

          {this.state.newAddedLayerAnalysis.length === 0 &&
            <SettingRow>
              <Alert style={{ minWidth: 'auto' }} withIcon={true} text={this.nls('noAnalysisConfiguredMsg')} type={'info'} data-testid={'noAnalysisConfiguredMsg'}/>
            </SettingRow>
          }

          {this.state.newAddedLayerAnalysis && this.state.newAddedLayerAnalysis.length > 0 &&
            <div tabIndex={-1} className='w-100 mb-4 mt-2'>
              <LayersInfos
                intl={this.props.intl}
                theme={this.props.theme}
                addedLayerAnalysis={this.state.newAddedLayerAnalysis}
                showEditAnalysisPopper={this.state.showEditAnalysisPopper}
                analysisIndex={this.state.analysisIndex}
                editCurrentLayer={this.state.editCurrentLayer}
                onEditAction={this.onEditButtonClick}
                onDeleteAction={this.onDeleteButtonClick.bind(this)}
                onLayersInfoSettingsUpdated={this.updateLayersInfoSettings}
                isActiveMapAreaSelected={this.props.activeDsSearchConfig.searchByActiveMapArea}
                availableLayerDsIds={this.props.allFeatureLayers
                  .find((ds) => ds.value === this.props.selectedDs)
                  ?.availableLayers.map((l) => l.layerDsId)} />
            </div>
          }
        </div>

        <SettingRow className='border-top pt-3'>
          <CollapsablePanel
            aria-label={this.nls('resultsCollapsible')}
            label={this.nls('resultsCollapsible')}
            isOpen={this.state.isResultSettingsOpen}
            onRequestOpen={() => { this.onToggleResults() }}
            onRequestClose={() => { this.onToggleResults() }}>
            <div style={{ height: '100%', marginTop: 10 }}>

              {expressModeUIVisibility.displayAnalysisIcon &&
                <SettingRow role='group' aria-label={this.nls('displayAnalysisIconLabel')} className={'ml-2'}>
                  <Label check centric style={{ cursor: 'pointer' }}>
                    <Checkbox data-testid={'displayAnalysisIcon'}
                      style={{ cursor: 'pointer' }} className='mr-2' checked={this.props.activeDsLayersConfig.displayAnalysisIcon}
                      onChange={this.displayAnalysisIconStateChange.bind(this)}
                    />
                    {this.nls('displayAnalysisIconLabel')}
                  </Label>
                </SettingRow>
              }

              <SettingRow role='group' aria-label={this.nls('mapSymbolsLabel')} className={'ml-2'}>
                <Label check centric style={{ cursor: 'pointer' }}>
                  <Checkbox data-testid={'mapSymbols'}
                    style={{ cursor: 'pointer' }} className='mr-2' checked={this.props.activeDsLayersConfig.displayMapSymbols}
                    onChange={this.displayMapSymbolsStateChange.bind(this)}
                  />
                  {this.nls('mapSymbolsLabel')}
                </Label>
              </SettingRow>

              {(expressModeUIVisibility.showDistFromInputLocation) && !this.props.activeDsSearchConfig.searchByActiveMapArea &&
                <SettingRow role='group' aria-label={this.nls('showDistFromInputLoc')} className={'ml-2'}>
                  <Label check centric style={{ cursor: 'pointer' }}>
                    <Checkbox data-testid={'showDistFromInputLoc'}
                      style={{ cursor: 'pointer' }} className='mr-2' checked={this.props.activeDsLayersConfig.showDistFromInputLocation}
                      onChange={this.onShowDistFromInputLocToolsChange.bind(this)}
                    />
                    {this.nls('showDistFromInputLoc')}
                  </Label>
                </SettingRow>}

              {!this.props.activeDsSearchConfig.searchByActiveMapArea &&
                <SettingRow role='group' aria-label={this.nls('onlyShowResults') + ' ' + this.nls('onlyShowResultsTooltip')} className={'ml-2'}>
                  <Label check centric className='w-100 labelStyle' style={{ cursor: 'pointer' }}>
                    <Checkbox data-testid={'onlyShowResults'}
                      style={{ cursor: 'pointer' }} className='mr-2' checked={this.props.activeDsLayersConfig.onlyShowLayersResult}
                      onChange={this.onlyShowResultsOptionChange.bind(this)}
                    />
                    {this.nls('onlyShowResults')}
                  </Label>
                  <Tooltip title={this.nls('onlyShowResultsTooltip')} showArrow placement='top'>
                    <div className='title3 text-default mr-2 d-inline'>
                      <InfoOutlined />
                    </div>
                  </Tooltip>
                </SettingRow>}

              <SettingRow className={'ml-2'}>
                <Label check centric className='w-100 labelStyle' style={{ cursor: 'pointer' }}>
                  {this.nls('displayAllLayersResultLabel')}
                </Label>
                <Tooltip title={this.nls('displayAllLayersResultTooltip')} showArrow placement='top'>
                  <div className='title3 text-default mr-2 d-inline'>
                    <InfoOutlined />
                  </div>
                </Tooltip>
              </SettingRow>

              <SettingRow role='group' aria-label={this.nls('displayAllLayersResultLabel') + ' ' + this.nls('nearmePanelLabel')} className={'mt-2 ml-2'}>
                <Label check centric style={{ cursor: 'pointer' }}>
                  <Checkbox data-testid={'nearmePanelLabel'}
                    style={{ cursor: 'pointer' }} className='mr-2' checked={this.state.displayAllLayersResult}
                    onChange={this.displayAllLayersResultOptionChange.bind(this)}
                  />
                  {this.nls('nearmePanelLabel')}
                </Label>
              </SettingRow>

              <SettingRow role='group' aria-label={this.nls('displayAllLayersResultLabel') + ' ' + this.nls('mapLabel')} className={'mt-1 ml-2'}>
                <Label check centric style={{ cursor: 'pointer' }}>
                  <Checkbox data-testid={'mapLabel'}
                    style={{ cursor: 'pointer' }} className='mr-2' checked={this.state.displayAllLayersResultOnMap}
                    onChange={this.displayAllLayersResultOnMapOptionChange.bind(this)}
                  />
                  {this.nls('mapLabel')}
                </Label>
              </SettingRow>

              {!this.props.activeDsSearchConfig.searchByActiveMapArea &&
                <SettingRow role='group' aria-label={this.nls('enableProximitySearchLabel') + ' ' + this.nls('enableProximitySearchTooltip')} className={'ml-2'}>
                  <Label check centric className='w-100 labelStyle' style={{ cursor: 'pointer' }}>
                    <Checkbox data-testid={'enableProximitySearch'}
                      style={{ cursor: 'pointer' }} className='mr-2' checked={this.props.activeDsLayersConfig.enableProximitySearch}
                      onChange={this.enableProximitySearchOptionChange.bind(this)}
                    />
                    {this.nls('enableProximitySearchLabel')}
                  </Label>
                  <Tooltip title={this.nls('enableProximitySearchTooltip')} showArrow placement='top'>
                    <div className='title3 text-default mr-2 d-inline'>
                      <InfoOutlined />
                    </div>
                  </Tooltip>
                </SettingRow>
              }

              {expressModeUIVisibility.saveInputLocation && !this.props.activeDsSearchConfig.searchByActiveMapArea &&
                <React.Fragment>
                  <SettingRow role='group' aria-label={this.nls('saveInputLocationLabel') + ' ' + this.nls('saveInputLocationTooltip')} className={'ml-2'}>
                    <Label check centric className='w-100 labelStyle' style={{ cursor: 'pointer' }}>
                      <Checkbox data-testid={'saveInputLocation'}
                        style={{ cursor: 'pointer' }} className='mr-2' disabled={!(pointDsRootIdsArr.length || polylineDsRootIdsArr.length || polygonDsRootIdsArr.length)}
                        checked={this.props.activeDsLayersConfig?.saveFeatures?.saveInputLocation}
                        onChange={this.enableSaveInputLocation.bind(this)}
                      />
                      {this.nls('saveInputLocationLabel')}
                    </Label>
                    <Tooltip title={this.nls('saveInputLocationTooltip')} showArrow placement='top'>
                      <div className='title3 text-default mr-2 d-inline'>
                        <InfoOutlined />
                      </div>
                    </Tooltip>
                  </SettingRow>

                  {this.props.activeDsLayersConfig?.saveFeatures?.saveInputLocation &&
                    <React.Fragment>
                      {pointDsRootIdsArr.length &&
                        <React.Fragment>
                          <SettingRow role='group' aria-label={this.nls('point')} className='mt-3 ml-3'>
                            <PinEsriOutlined size={'m'} />
                            <Label className='ml-2 w-100 justify-content-between' check centric style={{ cursor: 'pointer' }}>{this.nls('point')}
                              <Switch title={this.nls('point')}
                                checked={this.state.showPointFeature} onChange={this.onPointFeatureChange} />
                            </Label>
                          </SettingRow>
                          {this.state.showPointFeature &&
                            <DataSourceSelector className='mt-3 mb-3 pl-3'
                              types={this.supportedDsTypes}
                              useDataSources={this.state.pointFeatureUseDs ? Immutable([this.state.pointFeatureUseDs]) : Immutable([])}
                              fromRootDsIds={pointDsSelectorSource.fromRootDsIds}
                              fromDsIds={pointDsSelectorSource.fromDsIds}
                              mustUseDataSource={true}
                              onChange={this.pointDataSourceChangeSave}
                              enableToSelectOutputDsFromSelf={false}
                              closeDataSourceListOnChange
                              hideAddDataButton={true}
                              disableRemove={() => true}
                              hideDataView={true}
                              useDataSourcesEnabled
                            />
                          }
                        </React.Fragment>
                      }

                      {polylineDsRootIdsArr.length > 0 &&
                        <React.Fragment>
                          <SettingRow role='group' aria-label={this.nls('polyline')} className='mt-1 ml-3'>
                            <PolylineOutlined size={'m'} />
                            <Label className='ml-2 w-100 justify-content-between' check centric style={{ cursor: 'pointer' }}>{this.nls('polyline')}
                              <Switch title={this.nls('polyline')}
                                checked={this.state.showPolylineFeature} onChange={this.onPolylineFeatureChange} />
                            </Label>
                          </SettingRow>
                          {this.state.showPolylineFeature &&
                            <DataSourceSelector className='mt-3 mb-3 pl-3'
                              types={this.supportedDsTypes}
                              useDataSources={this.state.polylineFeatureUseDs ? Immutable([this.state.polylineFeatureUseDs]) : Immutable([])}
                              fromRootDsIds={polylineDsSelectorSource.fromRootDsIds}
                              fromDsIds={polylineDsSelectorSource.fromDsIds}
                              mustUseDataSource={true}
                              onChange={this.polylineDataSourceChangeSave}
                              enableToSelectOutputDsFromSelf={false}
                              closeDataSourceListOnChange
                              hideAddDataButton={true}
                              disableRemove={() => true}
                              hideDataView={true}
                              useDataSourcesEnabled
                            />
                          }
                        </React.Fragment>
                      }

                      {polygonDsRootIdsArr.length > 0 &&
                        <React.Fragment>
                          <SettingRow role='group' aria-label={this.nls('polygon')} className='mt-1 ml-3'>
                            <PolygonOutlined size={'m'} />
                            <Label className='ml-2 w-100 justify-content-between' check centric style={{ cursor: 'pointer' }}>{this.nls('polygon')}
                              <Switch title={this.nls('polygon')}
                                checked={this.state.showPolygonFeature} onChange={this.onPolygonFeatureChange} />
                            </Label>
                          </SettingRow>
                          {this.state.showPolygonFeature &&
                            <DataSourceSelector className='mt-3 mb-3 pl-3'
                              types={this.supportedDsTypes}
                              useDataSources={this.state.polygonFeatureUseDs ? Immutable([this.state.polygonFeatureUseDs]) : Immutable([])}
                              fromRootDsIds={polygonDsSelectorSource.fromRootDsIds}
                              fromDsIds={polygonDsSelectorSource.fromDsIds}
                              mustUseDataSource={true}
                              onChange={this.polygonDataSourceChangeSave}
                              enableToSelectOutputDsFromSelf={false}
                              closeDataSourceListOnChange
                              hideAddDataButton={true}
                              disableRemove={() => true}
                              hideDataView={true}
                              useDataSourcesEnabled
                            />
                          }
                        </React.Fragment>
                      }
                    </React.Fragment>
                  }

                  {polygonDsRootIdsArr.length > 0 &&
                    <React.Fragment>
                      <SettingRow role='group' aria-label={this.nls('saveSearchAreaLabel') + ' ' + this.nls('saveSearchAreaTooltip')} className={'ml-2'}>
                        <Label check centric className='w-100 labelStyle' style={{ cursor: 'pointer' }}>
                          <Checkbox style={{ cursor: 'pointer' }} className='mr-2' checked={this.props.activeDsLayersConfig.saveFeatures.searchAreaFeature?.enabled}
                            onChange={this.enableSaveSearchArea.bind(this)}
                          />
                          {this.nls('saveSearchAreaLabel')}
                        </Label>
                        <Tooltip title={this.nls('saveSearchAreaTooltip')} showArrow placement='top'>
                          <div className='title3 text-default mr-2 d-inline'>
                            <InfoOutlined />
                          </div>
                        </Tooltip>
                      </SettingRow>

                      {this.props.activeDsLayersConfig.saveFeatures.searchAreaFeature?.enabled &&
                        <DataSourceSelector className='mt-3 mb-3 pl-3'
                          types={this.supportedDsTypes}
                          useDataSources={this.state.searchAreaPolygonFeatureUseDs ? Immutable([this.state.searchAreaPolygonFeatureUseDs]) : Immutable([])}
                          fromRootDsIds={polygonDsSelectorSource.fromRootDsIds}
                          fromDsIds={polygonDsSelectorSource.fromDsIds}
                          mustUseDataSource={true}
                          onChange={this.searchAreaPolygonDataSourceChangeSave}
                          enableToSelectOutputDsFromSelf={false}
                          closeDataSourceListOnChange
                          hideAddDataButton={true}
                          disableRemove={() => true}
                          hideDataView={true}
                          useDataSourcesEnabled
                        />
                      }
                    </React.Fragment>
                  }
                </React.Fragment>
              }
            </div>
          </CollapsablePanel>
        </SettingRow>

        {
          <SidePopper isOpen={this.state.showEditAnalysisPopper && !urlUtils.getAppIdPageIdFromUrl().pageId}
            position={'right'}
            toggle={this.closeEditAnalysisPopper.bind(this)}
            trigger={this.analysisLayersPopperTrigger?.current}
            backToFocusNode={this.state.popperFocusNode}
            title={this.nls('editAnalysis')}>
            <div className='bg-default border-color-gray-400' css={getSidePanelStyle(this.props.theme)}>
              <SidepopperBackArrow
                theme={this.props.theme}
                intl={this.props.intl}
                title={this.nls('editAnalysis')}
                ref={this.backRef}
                hideBackArrow={true}
                showCloseIcon={true}
                disableOkButton={this.state.disableSidePopperOkButton}
                onBack={this.closeEditAnalysisPopper}
                showOkButton
                onOkButtonClicked={this.editOkButtonCLick}>
                <EditAnalysisPopper
                  widgetId={this.props.widgetId}
                  intl={this.props.intl}
                  theme={this.props.theme}
                  jimuMapView={this.props.jimuMapView}
                  isActiveMapAreaSelected={this.state.searchActiveMapArea}
                  isIncludeOutsideMapAreaSelected={this.state.includeOutsideMapArea && this.state.searchActiveMapArea}
                  activeDs={this.props.selectedDs}
                  analysisIndex={this.state.analysisIndex}
                  availableFeatureLayer={this.allDsLayers}
                  editCurrentLayer={this.state.editCurrentLayer}
                  analysisList={this.state.newAddedLayerAnalysis}
                  selectedLayerGeometry={this.state.selectedLayerGeometryType}
                  onAnalysisUpdate={this.onAnalysisInfoUpdate}
                  disableOkButton={this.onDisableOkButton}
                />
              </SidepopperBackArrow>
            </div>
          </SidePopper>
        }

        {/* Express mode add analysis popup */}
        <ExpressModeAddAnalysisPopper
          theme={this.props.theme}
          intl={this.props.intl}
          isOpen={this.state.showExpressAddAnalysisPopup}
          isActiveMapAreaSelected={this.state.searchActiveMapArea}
          selectedDs={this.props.selectedDs}
          allFeatureLayers={this.allDsLayers}
          editedAnalysisLocalKeys={Array.from(this.editedAnalysisLocalKeys)}
          layersInfoConfig={this.isAnalysisEdited ? this.state.updatedAddedLayerAnalysis : this.state.newAddedLayerAnalysis}
          onOkClick={this.addAnalysisOkClick.bind(this)}
          onClose={this.addAnalysisCloseClick.bind(this)} />

      </div>
    )
  }
}
