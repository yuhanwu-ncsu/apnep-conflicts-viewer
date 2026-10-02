/** @jsx jsx */
import { React, type IntlShape, type IMThemeVariables, type DataRecord, css, DataLevel, type DataAction, getAppStore, DataActionManager, type DataRecordSet, DataSourceManager, type FeatureLayerDataSource, Immutable, DataSourceTypes, type FeatureLayerQueryParams, lodash, type FeatureDataRecord, type UseDataSource, OrderRule, dataSourceUtils, DataSourceStatus, JimuFieldType, EsriFieldType, type FieldSchema, type QueriableDataSource, type DataSource } from 'jimu-core'
import { getLayerAccordionStyle, getCardStyle } from '../lib/style'
import defaultMessages from '../translations/default'
import { type AnalysisSettings, AnalysisTypeName, type LayersInfo, type SearchSettings, type SummaryAttributes, type SummaryFieldsInfo, type SumOfAreaLengthParam } from '../../config'
import { Button, Icon, Collapse, Label, type IconComponentProps, Row, Dropdown, DropdownButton, DropdownMenu, DropdownItem, Surface, Typography, Loading, LoadingType, Progress, Tooltip } from 'jimu-ui'
import { DownOutlined } from 'jimu-icons/outlined/directional/down'
import { RightOutlined } from 'jimu-icons/outlined/directional/right'
import { ExportOutlined } from 'jimu-icons/outlined/editor/export'
import { createSymbol, getAllFieldsNames, getDisplayField, getDisplayLabel, getOutputDsId, getPortalUnit, getSearchWorkflow, getSelectedLayerInstance } from '../../common/utils'
import classNames from 'classnames'
import * as intersectionOperator from 'esri/geometry/operators/intersectionOperator'
import * as geodeticAreaOperator from 'esri/geometry/operators/geodeticAreaOperator'
import * as areaOperator from 'esri/geometry/operators/areaOperator'
import * as geodeticLengthOperator from 'esri/geometry/operators/geodeticLengthOperator'
import * as geodesicProximityOperator from 'esri/geometry/operators/geodesicProximityOperator'
import * as lengthOperator from 'esri/geometry/operators/lengthOperator'
import * as equalsOperator from 'esri/geometry/operators/equalsOperator'
import { buildDateWhereClause, getALLFeatures, getFeaturesIds, getGroupSubGroupFeatures, getPagedFeatures, getQueryParams, getSingleRecord } from '../../common/query-feature-utils'
import type { AoiGeometries } from './aoi-tool'
import * as workers from 'esri/core/workers'
import { distanceUnitWithAbbr, maxRecordCountThreshold } from '../constant'
import type { JimuMapView } from 'jimu-arcgis'
import FeatureSet from './features-set'
import Graphic from 'esri/Graphic'
import type Geometry from 'esri/geometry/Geometry'
import type GraphicsLayer from 'esri/layers/GraphicsLayer'
import { CommonSummaryFieldValue, NumberFormatting } from '../../setting/constants'
import type { FormatNumberOptions } from 'react-intl'
import SummaryResult from './summary-result'
import FeatureLayer from 'esri/layers/FeatureLayer'
import { SelectOptionOutlined } from 'jimu-icons/outlined/editor/select-option'
import { WarningOutlined } from 'jimu-icons/outlined/suggested/warning'


interface Props {
  theme: IMThemeVariables
  key: number
  intl: IntlShape
  widgetId?: string
  analysisIcon?: IconComponentProps
  label: string
  featureCount?: number
  isExpanded: boolean
  isListView?: boolean
  children?: React.ReactNode[]
  onToggle?: (analysisId: string, isExpanded: boolean) => void
  selectRecord?: (index: string, popupContainer: HTMLDivElement, record: DataRecord) => void
  clearRecord?: (index: string) => void
  highlightFeature?: (featureRecord: DataRecord, showHighlight: boolean) => void
  onUpdateDataActionDataSet?: (dataSet: DataRecordSet[]) => void
  onUpdateProximityCountDataActionDataSet?: (dataSet: DataRecordSet) => void
  createHighlightGraphicsForLayer?: (analysisId: string, features: DataRecord[], expandLayer: boolean, highlightResults: boolean, highlightResultsColor: string, clipFeatures?: boolean) => void
  onAllFeaturesFetched?: (dsId: string, analysisId: string, features: DataRecord[]) => void
  onGroupSubGroupInfoUpdated?: (analysisId: string, groupSubGroupInfo: any) => void
  onRemoveLayerAccordion?: (analysisId: string) => void
  index?: number
  dsId?: string
  analysisId: string
  analysisType?: string
  layerInfo: LayersInfo
  showExportButton?: boolean
  canToggle: boolean
  mapView: JimuMapView
  searchSettings?: SearchSettings
  analysisSettings?: AnalysisSettings
  displayMapSymbol?: boolean
  aoiGeometries?: AoiGeometries
  folderUrl?: string
  useDataSources?: Immutable.ImmutableArray<UseDataSource>
  incidentGraphic?: Graphic
  isReturnOneAnalysisResult?: boolean
  graphicLayer?: GraphicsLayer
  groupSubGroupFeaturesObj?: any
  whereClause?: string
  shouldRetrieveFeaturesOnLoad?: boolean
  idsToExclude?: Array<string | number | { [key: string]: any }>
}

interface State {
  isFeatureLayerOpen: boolean
  isIconDown: boolean
  label: string
  layerLabelWidth: string
  displayAnalysisIcon: boolean
  displayFeatureCount: boolean
  showExportButton: boolean
  actionNames: string[]
  actionNamesGroups: any
  isDropDownLoading: boolean
  actionElement: React.ReactElement
  showExportOptions: boolean
  featureItems: React.JSX.Element[]
  isLoading: boolean
  showRetriveAll: boolean
  exportProgress: number
  showmaxRecordCountInfoMsg: boolean
  showMaxRecordTooltip: boolean
  updatedFeatureCount: number
  isFeatureCountCorrected: boolean
}

export default class LayerAccordion extends React.PureComponent<Props, State> {
  public symbolRef: React.RefObject<HTMLDivElement>
  public expandButtonRef: React.RefObject<HTMLButtonElement>
  public layerData = []
  public canShowMoreFeatures: boolean
  public dataSet: DataRecordSet[]
  public queriedData: DataRecord[]
  public allIntersectingFeatures: DataRecord[]
  public featuresIds: string[]
  public groupSubGroupInfo: any
  private summaryAttributes: SummaryAttributes
  private filteredOutObjectIds: Array<string | number | { [key: string]: any }> = []
  dropdownRef = React.createRef<HTMLButtonElement>()
  constructor (props) {
    super(props)
    this.symbolRef = React.createRef()
    this.expandButtonRef = React.createRef()
    this.canShowMoreFeatures = false
    this.dataSet = []
    this.queriedData = []
    this.allIntersectingFeatures = []
    this.featuresIds = []
    this.summaryAttributes = {}
    this.filteredOutObjectIds = []
    this.state = {
      isFeatureLayerOpen: this.props.isExpanded,
      isIconDown: !this.props.isExpanded,
      label: this.props?.label,
      layerLabelWidth: '',
      displayAnalysisIcon: !!this.props.analysisIcon,
      displayFeatureCount: this.props.layerInfo.analysisInfo.displayFeatureCount,
      showExportButton: false,
      actionNames: [],
      actionNamesGroups: {},
      isDropDownLoading: false,
      actionElement: null,
      showExportOptions: false,
      featureItems: [],
      isLoading: false,
      showRetriveAll: !this.props.shouldRetrieveFeaturesOnLoad,
      exportProgress: 0,
      showmaxRecordCountInfoMsg: true,
      showMaxRecordTooltip: false,
      updatedFeatureCount: this.props.featureCount,
      isFeatureCountCorrected: false
    }
  }

  nls = (id: string) => {
    const messages = Object.assign({}, defaultMessages)
    //for unit testing no need to mock intl we can directly use default en msg
    if (this.props.intl?.formatMessage) {
      return this.props.intl.formatMessage({ id: id, defaultMessage: messages[id] })
    } else {
      return messages[id]
    }
  }

  /**
   * Check if the current analysis is a returnIntersectedPolygons case
   * @returns true if the layer is a polygon layer with returnIntersectedPolygons enabled and search by location is active
   */
  isReturnIntersectedPolygonsCase = (): boolean => {
    const layerInfo = this.props.layerInfo as any
    const { searchByLocation } = getSearchWorkflow(this.props.searchSettings)
    const dataSource = getSelectedLayerInstance(this.props.dsId) as FeatureLayerDataSource
    return searchByLocation && layerInfo.analysisInfo.returnIntersectedPolygons && dataSource?.getGeometryType() === 'esriGeometryPolygon'
  }

  /**
   * Get the effective feature count - uses the locally corrected count for returnIntersectedPolygons case
   * after local filtering has reduced the count from the server-side query
   * @returns the effective feature count
   */
  getEffectiveFeatureCount = (): number => {
    if (this.isReturnIntersectedPolygonsCase() && this.state.updatedFeatureCount !== this.props.featureCount) {
      return this.state.updatedFeatureCount
    }
    return this.props.featureCount
  }

  componentDidMount = async () => {
    this.updateLayerLabelWidth()
    if (!geodeticLengthOperator.isLoaded()) {
      await geodeticLengthOperator.load()
    }
    if (!geodeticAreaOperator.isLoaded()) {
      await geodeticAreaOperator.load()
    }
    if (!geodesicProximityOperator.isLoaded()) {
      await geodesicProximityOperator.load()
    }
    this.setState({
      // Only update showRetriveAll if it's currently true; once false, it stays false
      showRetriveAll: this.state.showRetriveAll ? !this.props.whereClause : this.state.showRetriveAll,
      showmaxRecordCountInfoMsg: this.handleMaxRecordCountInfoMsg()
    }, () => {
      if (this.props.isExpanded || this.props.shouldRetrieveFeaturesOnLoad) {
        this.expandAnalysisResults()
      }
    })
    if (this.props.displayMapSymbol) {
      this.createMapSymbol()
    }
  }

  /**
   * Update features received from the parent component
   * @param features Feature records
   */
  updateFeatures = (sharedFeatures: FeatureDataRecord[]) => {
    // create a shallow copy of features to avoid mutating the original array from parent component
    let features = [...sharedFeatures]
    // here all features are ready so now hide the retrieve all button and set export progress to 90% as we are in final stage of preparing export data source and options
    this.setState({
      showRetriveAll: false,
      exportProgress: 90
    }, async () => {
      const { analysisType } = this.props
      const dataSource = getSelectedLayerInstance(this.props.dsId) as FeatureLayerDataSource
      const { searchByLocation } = getSearchWorkflow(this.props.searchSettings)
      // Filter only intersected polygons in case of return intersected polygon is enabled for polygon layer
      if (searchByLocation && (this.props.layerInfo as any).analysisInfo.returnIntersectedPolygons && dataSource.getGeometryType() === 'esriGeometryPolygon') {
        features = this.filterOnlyIntersectedPolygons(features) as FeatureDataRecord[]
      }
      const sortByDist = (this.props.layerInfo.analysisInfo as any)?.sortFeaturesByDistance && searchByLocation
      const showApproxDist = this.props.analysisSettings?.showDistFromInputLocation && searchByLocation
      const isClosest = analysisType === AnalysisTypeName.Closest
      if (sortByDist || showApproxDist || isClosest) {
        features = await this.getFeaturesDistance(features)
      }
      const sortIdFields = this.getSortIdFields(dataSource)
      const sortedRecords = this.getSortedFeatures(features, sortIdFields)
      const records = isClosest ? this.getClosestRecord(sortedRecords as FeatureDataRecord[]): sortedRecords
      this.allIntersectingFeatures = records
      this.setState({
        showmaxRecordCountInfoMsg: this.handleMaxRecordCountInfoMsg()
      })
      this.refreshAccordionContent()
      this.prepareExportData(true)
    })
  }

  /**
   * Get the closest record based on the geometry equality and distance
   * @param records Feature records
   * @return closest record
   * If multiple records have the same distance, it checks for geometry equality with the incident geometry and returns the matching record. If no geometry matches, it returns the first record (closest by distance).
   */
  getClosestRecord = (records: FeatureDataRecord[]): FeatureDataRecord[] => {
    // Assumes records are sorted by distance ascending
    if (!records || records.length === 0) return []
    const firstFeature = records[0].getFeature() as Graphic
    const incidentGeom = this.props.aoiGeometries?.incidentGeometry as __esri.GeometryUnion
    // Only check geometry equality if types match
    if (incidentGeom && incidentGeom.type === firstFeature.geometry.type) {
      const match = records.find(
        (f: any) => f.feature.distance === (firstFeature as any).distance && equalsOperator.execute(f.feature.geometry, incidentGeom)
      )
      return match ? [match] : [records[0]]
    }
    // Fallback: return the first record
    return [records[0]]
  }

  /**
   * Expand analysis results on layer expand
   */
  expandAnalysisResults = lodash.debounce(async () => {
    this.setState({ isLoading: true })
    const { analysisType, groupSubGroupFeaturesObj, searchSettings, featureCount, whereClause } = this.props
    const isSummary = analysisType === AnalysisTypeName.Summary
    const isClosest = analysisType === AnalysisTypeName.Closest
    const isGroupFeatures = !!groupSubGroupFeaturesObj && !whereClause
    const isSubGroupFeatures = !!whereClause && !!groupSubGroupFeaturesObj
    const { searchByLocation } = getSearchWorkflow(searchSettings)
    const sortByDist = (this.props.layerInfo.analysisInfo as any)?.sortFeaturesByDistance && searchByLocation
    const showApproxDist = this.props.analysisSettings?.showDistFromInputLocation && searchByLocation

    // 1. Exit early for Summary Analysis
    if (isSummary) {
      // If no summary fields are configured, do not expand the accordion
      const analysisInfo = this.props.layerInfo.analysisInfo as any
      if (!analysisInfo.summaryFields || analysisInfo.summaryFields.length === 0) {
        this.setState({ isLoading: false })
      }

      const isInProgress = !this.state.showRetriveAll && this.state.exportProgress < 100 && !this.props.whereClause
      // If building output datasource is in progress then shouldBuildOutputDs should be true
      const shouldBuildOutputDs = !this.state.showmaxRecordCountInfoMsg || isInProgress
      await this.prepareExportData(shouldBuildOutputDs)
      return
    }
    // 2. Fetch or retrieve existing data
    let records: DataRecord[] | FeatureDataRecord[] = this.queriedData.length ? this.queriedData : this.allIntersectingFeatures
    // When sort by field is configured for a datasource with uniqueIdFields, server-side paged
    // queries (start/num) are unreliable because composite-key services have no OID tiebreaker
    // to guarantee consistent page ordering. Fetch all records at once (like sort by distance).
    const sortByField = !!(this.props.layerInfo.analysisInfo as any)?.sortFeatures?.sortFeaturesByField && !sortByDist && !isClosest
    const hasUniqueIdFields = sortByField && ((getSelectedLayerInstance(this.props.dsId) as FeatureLayerDataSource)?.getUniqueIdFields?.() ?? []).length > 0
    const shouldFetchAll = records.length === 0 && (!isSubGroupFeatures && (featureCount <= maxRecordCountThreshold || (!isGroupFeatures && sortByDist) || (!isGroupFeatures && hasUniqueIdFields) || this.isReturnIntersectedPolygonsCase()) || isClosest)
    let onAllFeaturesFetchedCalled = false
    if (shouldFetchAll) {
      this.setState({
        showRetriveAll: false,
        showmaxRecordCountInfoMsg: false
      })
      // Extensive fetch logic
      const dataSource = getSelectedLayerInstance(this.props.dsId) as FeatureLayerDataSource
      const sortIdFields = this.getSortIdFields(dataSource)
      records = await this.getAllRecords()
      if (this.props.onAllFeaturesFetched && !isClosest) {
        this.props.onAllFeaturesFetched(this.props.dsId, this.props.analysisId, records)
        onAllFeaturesFetchedCalled = true
      }
      if (searchByLocation && (this.props.layerInfo as any).analysisInfo.returnIntersectedPolygons && dataSource.getGeometryType() === 'esriGeometryPolygon') {
        records = this.filterOnlyIntersectedPolygons(records)
      }
      records = await this.applyClientSideSorting(
        records as FeatureDataRecord[],
        sortIdFields,
        sortByDist,
        showApproxDist,
        isClosest,
        hasUniqueIdFields && sortByField
      )
      // If parent component has this method then only use following logic other wise just update the this.allIntersectingFeatures (this will happen in case of features list of group/subgroup features)
      if (this.props.onAllFeaturesFetched) {
        records = isClosest ? this.getClosestRecord(records as FeatureDataRecord[]) : records
        if (isClosest) {
          this.props.onAllFeaturesFetched(this.props.dsId, this.props.analysisId, records)
          onAllFeaturesFetchedCalled = true
        }
        this.allIntersectingFeatures = records
        await this.handleAllFeaturesReady()
      } else {
        this.allIntersectingFeatures = records
      }
    }
    const effectiveFeatureCount = this.getEffectiveFeatureCount()
    if ((isGroupFeatures || isSubGroupFeatures) && this.queriedData.length === 0) { // grouped / sub group features
      this.queriedData = await this.queryGroupSubGroupFeatures()
    } else if (!isClosest && (records.length !== effectiveFeatureCount || records.length === 0)) {
      const dataSource = getSelectedLayerInstance(this.props.dsId) as FeatureLayerDataSource
      // if selected layer is only view then some times the paged query fails so in this case query all the ids first and then query 20 records records per page based on these ids
      if (dataSource?.layer?.sourceJSON?.isView) {
        if (this.featuresIds.length === 0) {
          this.featuresIds = await this.getRecordsIds()
        }
        // here ids will passed so 20 records will be fetched based on these ids and if sort by distance or closest analysis then these 20 records will be sorted based on distance and then added to the existing features in the accordion
        records = await this.getAllRecords()
        await this.handleFeaturesDistance(records)
        this.canShowMoreFeatures = records.length + this.state.featureItems.length < (effectiveFeatureCount || 0)
      } else {
        records = await this.queryRecords()
      }
    }
    // 3. UI Processing
    if (this.allIntersectingFeatures.length === effectiveFeatureCount || this.queriedData.length > 0) {
      records = this.handleFeaturesToShow()
    }
    // In case sort by field is selected when all features are ready then share these all features
    if (!onAllFeaturesFetchedCalled && this.allIntersectingFeatures.length === effectiveFeatureCount && !this.props.whereClause && (!sortByDist && !isClosest)) {
      if (this.props.onAllFeaturesFetched) {
        this.props.onAllFeaturesFetched(this.props.dsId, this.props.analysisId, this.allIntersectingFeatures)
        await this.handleAllFeaturesReady()
      }
    }
    this.createChildElm(records)
    this.setState({ isLoading: false })
  }, 300)

  /**
   * Filter only intersected polygons in case of return intersected polygon is enabled for polygon layer in search by location workflow
   * @param records Feature records to filter
   * @returns filtered features that only includes intersected polygons
   */
  filterOnlyIntersectedPolygons = (records: DataRecord[]) => {
    const dataSource = getSelectedLayerInstance(this.props.dsId) as FeatureLayerDataSource
    const uniqueIdFields = dataSource?.getUniqueIdFields?.() ?? []
    const idField = dataSource?.getIdField()
    const filteredOutIds: Array<string | number | { [key: string]: any }> = []
    const filteredRecords = [] as DataRecord[]

    records.forEach((eachRecord) => {
      const featureRecord = eachRecord as FeatureDataRecord
      const intersects = intersectionOperator.execute(
        this.props.aoiGeometries?.incidentGeometry as __esri.GeometryUnion,
        featureRecord.feature.geometry as __esri.GeometryUnion
      )

      if (intersects) {
        filteredRecords.push(eachRecord)
      } else if (idField || uniqueIdFields.length > 0) {
        const attrs = (featureRecord as any).feature?.attributes ?? (featureRecord as any).getData?.()
        if (uniqueIdFields.length > 1) {
          // Push composite id only when all unique fields have primitive values.
          const compositeId: { [key: string]: string | number | boolean } = {}
          let hasAllFields = true
          uniqueIdFields.forEach((fieldName) => {
            const fieldValue = attrs?.[fieldName]
            const isPrimitive = ['string', 'number', 'boolean'].includes(typeof fieldValue)
            if (fieldValue === undefined || fieldValue === null || !isPrimitive) {
              hasAllFields = false
              return
            }
            compositeId[fieldName] = fieldValue
          })
          if (hasAllFields) {
            filteredOutIds.push(compositeId)
          }
        } else if (uniqueIdFields.length === 1) {
          // Push scalar id for single unique id field.
          const uniqueIdValue = attrs?.[uniqueIdFields[0]]
          if (uniqueIdValue !== undefined && uniqueIdValue !== null && typeof uniqueIdValue !== 'object') {
            filteredOutIds.push(uniqueIdValue)
          }
        } else if (idField) {
          // Fallback to datasource id field when unique ids are unavailable.
          const oid = attrs?.[idField]
          if (oid !== undefined && oid !== null && typeof oid !== 'object') {
            filteredOutIds.push(oid)
          }
        }
      }
    })
    this.filteredOutObjectIds = filteredOutIds
    this.setState({
      updatedFeatureCount: this.props.analysisType === AnalysisTypeName.Closest ? 1 : filteredRecords.length,
      isFeatureCountCorrected: true
    })
    if (filteredRecords.length === 0) {
      this.props.onRemoveLayerAccordion(this.props.analysisId)
    }
    return filteredRecords
  }

  /**
   * Handles the further functionality when all features are retrieved
   */
  handleAllFeaturesReady = async () => {
    const { searchByLocation } = getSearchWorkflow(this.props.searchSettings)
    if (searchByLocation) {
      this.highlightFeaturesOnMap(this.allIntersectingFeatures)
    }
    const isOutputDsReady = this.isOutPutDsReady()
    if (!isOutputDsReady) {
      const shouldBuildOutputDs = !this.handleMaxRecordCountInfoMsg()
      await this.prepareExportData(shouldBuildOutputDs)
    }
  }

  /**
   * Get the configured sorting field
   * @returns sorting field
   */
  getConfiguredSortingField = () => {
    const layerInfo = this.props.layerInfo as any
    let sortingField: string
    const isClosest = this.props.analysisType === AnalysisTypeName.Closest
    const sortByDist = (this.props.layerInfo.analysisInfo as any)?.sortFeaturesByDistance && getSearchWorkflow(this.props.searchSettings).searchByLocation
    if (sortByDist || isClosest) {
      sortingField = 'distance'
    } else {
      sortingField = layerInfo.analysisInfo.sortFeatures?.sortFeaturesByField
    }
    return sortingField
  }

  /**
   * Resolve id fields used for deterministic sorting.
   * Prefer unique id fields, otherwise fall back to the id field.
   * @param dataSource feature layer data source used to resolve sort id fields
   * @returns unique id fields when present, otherwise the id field as a single-item array
   */
  getSortIdFields = (dataSource: FeatureLayerDataSource): string[] => {
    const uniqueIdFields = (dataSource?.getUniqueIdFields?.() ?? []) as string[]
    if (uniqueIdFields.length > 0) {
      return uniqueIdFields
    }

    const idField = dataSource?.getIdField?.()
    return idField ? [idField] : []
  }


  /**
   * Create child element for accordion
   */
  createChildElm = (featuresOrGroups: DataRecord[]) => {
    let items
    const groupSubGroupFeaturesObj = this.props.groupSubGroupFeaturesObj
    if (!!groupSubGroupFeaturesObj && groupSubGroupFeaturesObj.field !== "") {
      // Create accordion for grouped feature
      items = this.getGroupSubGroupFeaturesSet(featuresOrGroups)
    } else {
      // Create features set for proximity or closest analysis
      items = this.getFeatureSet(featuresOrGroups)
    }
    this.setState({
      featureItems: items
    })
  }

  /**
   * Builds output datasource
   */
  buildOutputDs = async () => {
    const layerInfo = this.props.layerInfo
    const isClosest = this.props.analysisType === AnalysisTypeName.Closest
    let records: DataRecord[]
    if (isClosest && this.allIntersectingFeatures.length > 0) {
      records = this.allIntersectingFeatures
    } else if (this.allIntersectingFeatures.length === 0 || this.allIntersectingFeatures.length !== this.state.updatedFeatureCount) {
      records = await this.getALLRecordsForOutputDs()
      // All features are fetched
      this.props.onAllFeaturesFetched(this.props.dsId, this.props.analysisId, records)
      const dataSource = getSelectedLayerInstance(this.props.dsId) as FeatureLayerDataSource
      const { searchByLocation } = getSearchWorkflow(this.props.searchSettings)
      if (searchByLocation && (this.props.layerInfo as any).analysisInfo.returnIntersectedPolygons && dataSource.getGeometryType() === 'esriGeometryPolygon') {
        records = this.filterOnlyIntersectedPolygons(records)
      }
      this.allIntersectingFeatures = records
      const sortByDistance = (this.props.layerInfo.analysisInfo as any)?.sortFeaturesByDistance && searchByLocation
      const showApproxDist = this.props.analysisSettings?.showDistFromInputLocation && searchByLocation
      const outputSortIdFields = this.getSortIdFields(dataSource)
      const sortByField = !!(this.props.layerInfo.analysisInfo as any)?.sortFeatures?.sortFeaturesByField
      const hasUniqueIdFields = outputSortIdFields.length > 0
      records = await this.applyClientSideSorting(
        records as FeatureDataRecord[],
        outputSortIdFields,
        sortByDistance,
        showApproxDist,
        isClosest,
        sortByField && hasUniqueIdFields
      )
      this.allIntersectingFeatures = isClosest ? this.getClosestRecord(records as FeatureDataRecord[]) : records
    } else {
      records = this.allIntersectingFeatures
    }
    const isGroupFeatures = !!this.props.groupSubGroupFeaturesObj && !this.props.whereClause
    if (isGroupFeatures) {
      this.groupSubGroupInfo = this.genarateGroupSubGroupInfo()
      this.props.onGroupSubGroupInfoUpdated(this.props.analysisId, this.groupSubGroupInfo)
      // TODO use groupSubGroupInfo to create group subgroup results
    }
    const { searchByLocation } = getSearchWorkflow(this.props.searchSettings)
    if (searchByLocation) {
      this.highlightFeaturesOnMap(this.allIntersectingFeatures)
    }
    const outputDsId = getOutputDsId(this.props.widgetId, layerInfo.analysisInfo.analysisType, layerInfo.analysisInfo.analysisId)
    const outputRecords = isClosest ? this.allIntersectingFeatures : records
    await this.buildOutputDsResults(layerInfo.label, outputDsId, outputRecords, layerInfo)
    if (this.props.showExportButton) {
      await this.buildExportOptions()
    } else { // if export button is not enabled then set the export progress to 100% to hide the progress icon in the UI
      this.setState({ exportProgress: 100 })
    }
  }

  /**
   * Get all records for building output data source
   * @returns feature records
   */
  getALLRecordsForOutputDs = async () => {
    const layerInfo = this.props.layerInfo as any
    const dsManager = DataSourceManager.getInstance()
    const ds: any = dsManager.getDataSource(layerInfo.useDataSource.dataSourceId)
    const { searchByLocation, searchCurrentExtent } = getSearchWorkflow(this.props.searchSettings)
    let geometry
    if (searchByLocation || searchCurrentExtent) {
      //set buffer geometry
      if (this.props.aoiGeometries?.bufferGeometry) {
        geometry = this.props.aoiGeometries.bufferGeometry
      } else {
        geometry = this.props.aoiGeometries.incidentGeometry
      }
    }
    let outFields
    this.props.useDataSources.forEach((dataS) => {
      if (dataS.dataSourceId === layerInfo.useDataSource.dataSourceId) {
        outFields = dataS.fields ?? []
      }
    })
    const sortField = layerInfo.analysisInfo?.sortFeatures?.sortFeaturesByField
    const sortOrder = layerInfo.analysisInfo?.sortFeatures?.sortFeaturesOrder
    let signal: AbortSignal
    const query = getQueryParams(ds, outFields, geometry, searchByLocation)
    // Skip server-side orderByFields for datasources with uniqueIdFields — they may not support it.
    const dsUniqueIdFields = ds?.getUniqueIdFields?.() ?? []
    if (sortField && sortOrder && dsUniqueIdFields.length === 0) {
      query.orderByFields = [sortField.toString() + ' ' + sortOrder]
    }
    const result = await ds.queryAll(query, signal, this.progressCallback, { excludeQuery: { widgetId: 'filter-data-record-action', dataSourceId: ds.id } })
    return result.records
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
   * Create initial output datasource JSON as fallback when datasource doesn't exist in config
   * @param outputDsId output datasource id
   * @param analytics label for the datasource
   * @param layerInfo layer information containing analysis details
   * @param fieldsToExport fields to include in the output schema
   * @returns DataSourceJson object for creating datasource
   */
  createInitialOutputDsJson = (outputDsId: string, analysisLabel: string, layerInfo: any, fieldsToExport: string[]): any => {
    try {
      const dsManager = DataSourceManager.getInstance()
      const sourceDs = dsManager.getDataSource(layerInfo.useDataSource.dataSourceId) as FeatureLayerDataSource
      const uniqueIdFields = sourceDs?.getUniqueIdFields?.() ?? []
      if (!sourceDs) {
        return null
      }

      const schema = sourceDs.getSchema()
      const { showAllFeatures, searchCurrentExtent } = getSearchWorkflow(this.props.searchSettings)

      // Filter schema fields based on fieldsToExport
      const filteredSchemaFields: any = Object.keys(schema?.fields || {})
        .filter(key => fieldsToExport.includes(key))
        .reduce((obj: any, key) => {
          obj[key] = schema?.fields[key]
          return obj
        }, {})
      if (uniqueIdFields.length > 0) {
        // Ensure all unique id fields are included in the filtered schema
        uniqueIdFields.forEach(field => {
          if (!filteredSchemaFields[field] && schema?.fields[field]) {
            filteredSchemaFields[field] = schema.fields[field]
          }
        })
      }
      const outputIdField = schema?.idField || 'OBJECTID'
      // Ensure idField exists in schema fields for downstream widgets.
      if (!filteredSchemaFields[outputIdField]) {
        if (schema?.fields?.[outputIdField]) {
          filteredSchemaFields[outputIdField] = schema.fields[outputIdField]
        } else if (outputIdField === 'OBJECTID') {
          filteredSchemaFields.OBJECTID = {
            alias: 'OBJECTID',
            esriType: EsriFieldType.OID,
            format: null,
            type: JimuFieldType.Number,
            jimuName: 'OBJECTID',
            name: 'OBJECTID'
          }
        }
      }
      const outputSchemaFields = Object.keys(filteredSchemaFields).length > 0
        ? filteredSchemaFields
        : (schema?.fields || {})
      const fieldSchema = {
        idField: outputIdField,
        ...(uniqueIdFields.length > 0 && { uniqueIdFields: [...uniqueIdFields] }),
        fields: outputSchemaFields
      }
      const outputDsJson: any = {
        id: outputDsId,
        type: DataSourceTypes.FeatureLayer,
        label: analysisLabel,
        isOutputFromWidget: true,
        schema: fieldSchema
      }

      // Only set geometryType if not in showAllFeatures or searchCurrentExtent mode
      if (!searchCurrentExtent && !showAllFeatures) {
        outputDsJson.geometryType = sourceDs.getGeometryType()

        // Add esriCTApproxDistance field if needed
        if ((layerInfo?.analysisInfo)?.includeApproxDistance) {
          outputDsJson.schema.fields.esriCTApproxDistance = {
            alias: this.nls('approximateDistance'),
            name: 'esriCTApproxDistance',
            type: 'string'
          }
        }

        // Add esriCTClippedInfo field for Proximity analysis with clipFeatures enabled
        if (layerInfo.analysisInfo.analysisType === AnalysisTypeName.Proximity &&
            (layerInfo?.analysisInfo)?.clipFeatures) {
          outputDsJson.schema.fields.esriCTClippedInfo = {
            alias: 'Intersected Area/Length',
            name: 'esriCTClippedInfo',
            type: 'double'
          }
        }
      }

      return outputDsJson
    } catch (err) {
      console.error(err)
      return null
    }
  }

  /**
   * Create initial output datasource JSON for Summary analysis as fallback
   * @param outputDsId output datasource id
   * @param analysisLabel label for the datasource
   * @param summaryFields configured summary fields
   * @param dataSource source datasource for getting export options
   * @returns DataSourceJson object for creating datasource
   */
  createInitialSummaryOutputDsJson = (outputDsId: string, analysisLabel: string, summaryFields: SummaryFieldsInfo[], dataSource: FeatureLayerDataSource): any => {
    try {
      const fieldsObj: any = {
        OBJECTID: {
          alias: 'OBJECTID',
          name: 'OBJECTID',
          type: 'double'
        },
        esriCTCOUNT: {
          alias: this.nls('count'),
          name: 'esriCTCOUNT',
          type: 'double'
        }
      }

      // Add configured summary fields
      summaryFields.forEach((field) => {
        const fieldName = field.fieldLabel.replace(/ /g, '')
        fieldsObj[fieldName] = {
          alias: field.fieldLabel,
          name: fieldName,
          type: 'string'
        }
      })

      const outputDsJson: any = {
        id: outputDsId,
        type: DataSourceTypes.FeatureLayer,
        label: analysisLabel,
        isOutputFromWidget: true,
        geometryType: 'point',
        schema: {
          idField: 'OBJECTID',
          fields: fieldsObj
        },
        exportOptions: dataSource?.getExportOptions() || {}
      }

      return outputDsJson
    } catch (err) {
      console.error(err)
      return null
    }
  }

  /**
   * Build output data source results for Proximity and Closest analysis
   * @param analysisLabel - Configured analysis label
   * @param outputDsId output dataSource id
   * @param featureRecords resultant feature records
   * @param result analysis result
   */
  buildOutputDsResults = async (analysisLabel: string, outputDsId: string, featureRecords: DataRecord[], layerInfo: any) => {
    const { showAllFeatures, searchCurrentExtent } = getSearchWorkflow(this.props.searchSettings)
    let outputDS = this.getOutputDataSource(outputDsId)
    const dsManager = DataSourceManager.getInstance()
    const ds = dsManager.getDataSource(layerInfo.useDataSource.dataSourceId) as FeatureLayerDataSource
    if (!outputDS) {
      try {
        // Try to create with just the ID first
        outputDS = await dsManager.createDataSource(outputDsId) as FeatureLayerDataSource
      } catch (err) {
        try {
          // Fallback: try with initial JSON configuration
          const fieldsToExport = this.getFieldsToExport(layerInfo.analysisInfo.analysisId)
          const initialDsJson = this.createInitialOutputDsJson(outputDsId, analysisLabel, layerInfo, fieldsToExport)
          if (initialDsJson) {
            outputDS = await dsManager.createDataSource(Immutable(initialDsJson)) as FeatureLayerDataSource
          }
        } catch (jsonErr) {
          return
        }
      }
    }
    if (!outputDS) {
      return
    }
    const schema = outputDS.getSchema()
    const fieldsToExport = this.getFieldsToExport(layerInfo.analysisInfo.analysisId)
    const newSchema = schema

    const dsJson = { ...outputDS.getDataSourceJson() }
    const sourceSchema = ds?.getSchema?.()
    const sourceUniqueIdFields = ds?.getUniqueIdFields?.() ?? []
    const dsJsonSchema: any = { ...(dsJson.schema || {}) }
    const dsJsonFields: any = { ...(dsJsonSchema.fields || {}) }

    const resolvedOutputIdField = sourceSchema?.idField || dsJsonSchema?.idField || 'OBJECTID'
    dsJsonSchema.idField = resolvedOutputIdField
    if (!dsJsonFields[resolvedOutputIdField]) {
      if (sourceSchema?.fields?.[resolvedOutputIdField]) {
        dsJsonFields[resolvedOutputIdField] = sourceSchema.fields[resolvedOutputIdField]
      } else if (resolvedOutputIdField === 'OBJECTID') {
        dsJsonFields.OBJECTID = {
          alias: 'OBJECTID',
          esriType: EsriFieldType.OID,
          fieldFormat: {
            type: JimuFieldType.Number,
            useGrouping: 'never'
          },
          type: JimuFieldType.Number,
          jimuName: 'OBJECTID',
          name: 'OBJECTID'
        }
      }
    }

    if (sourceUniqueIdFields.length > 0) {
      dsJsonSchema.uniqueIdFields = [...sourceUniqueIdFields]
      sourceUniqueIdFields.forEach((field) => {
        if (!dsJsonFields[field] && sourceSchema?.fields?.[field]) {
          dsJsonFields[field] = sourceSchema.fields[field]
        }
      })
    }

    dsJsonSchema.fields = Object.keys(dsJsonFields).length > 0
      ? dsJsonFields
      : (sourceSchema?.fields || {})
    dsJson.schema = dsJsonSchema
    // If user is in search by current extent or show all features mode,
    // We will create output ds as tables since we don't have geometries of intersecting features in this mode
    if (searchCurrentExtent || showAllFeatures) {
      delete dsJson.geometryType
    } else {
      //in case of specify location only we can have clipped features functionality
      //if we have esriCTClippedInfo update the alias to show the current selected unit
      const esriCTClippedInfoField: any = dsJson.schema?.fields?.esriCTClippedInfo
      //Set the Area or Length label along with the Units
      if (esriCTClippedInfoField) {
        try {
          const distanceUnit = this.props.aoiGeometries?.distanceUnit || this.props.searchSettings?.distanceUnits || getPortalUnit()
          const unitAbbr = this.getSelectedUnitsAbbr(distanceUnit as __esri.LengthUnit)
          //show square unit for area
          if (dsJson.geometryType === "esriGeometryPolygon") {
            esriCTClippedInfoField.alias = this.props.intl.formatMessage({
              id: 'areaUnitForDSColumn', defaultMessage: defaultMessages.areaUnitForDSColumn
            }, { unitLabel: unitAbbr })
          } else {
            esriCTClippedInfoField.alias = this.props.intl.formatMessage({
              id: 'lengthUnitLabel', defaultMessage: defaultMessages.lengthUnitLabel
            }, { unitLabel: unitAbbr })
          }
        }
        catch (err) {
          console.error(err)
        }
      }
    }
    const allowExport = this.props.showExportButton
    // Update the disableExport option based on allowExport in the output data source instance.
    dsManager.updateDataSourceByDataSourceJson(outputDS, Immutable({ ...dsJson, disableExport: !allowExport, exportOptions: ds.getExportOptions() }))
    //filter the schema fields depending on the configured exported fields
    const featureFields = Object.keys(newSchema?.fields)
      .filter(key => fieldsToExport.includes(key) || layerInfo.analysisInfo.includeApproxDistance)
      .reduce((obj, key) => {
        obj[key] = schema?.fields[key]
        return obj
      }, {})

    const fieldsInPopupTemplate: any[] = []
    //create field infos for layer and popupTemplate
    for (const key in featureFields) {
      const popupFieldItem = {
        fieldName: featureFields[key].name,
        label: featureFields[key].alias
      }
      //create fields in popup template
      fieldsInPopupTemplate.push(popupFieldItem)
    }

    const featureLayerDs = this.getOutputDataSource(outputDsId) as FeatureLayerDataSource
    const outputIdField = dsJsonSchema?.idField || featureLayerDs?.getIdField?.() || 'OBJECTID'
    const recordsForLayer = featureRecords
      .map((r: any, index) => {
        const graphic = r?.getFeature?.() || r?.feature
        if (!graphic) {
          return null
        }
        const maybeGraphic = graphic
        const clonedGraphic = typeof maybeGraphic.clone === 'function'
          ? maybeGraphic.clone()
          : new Graphic({
              geometry: maybeGraphic.geometry,
              attributes: { ...(maybeGraphic.attributes || {}) }
            })
        const attrs = { ...(clonedGraphic.attributes || {}) }
        if (attrs[outputIdField] === undefined || attrs[outputIdField] === null) {
          attrs[outputIdField] = index + 1
        }
        clonedGraphic.attributes = attrs
        return featureLayerDs.buildRecord(clonedGraphic)
      })
      .filter((record): record is FeatureDataRecord => !!record)
    const layerDef = { ...dataSourceUtils.getLayerDefinitionIntersection(ds.getLayerDefinition(), featureLayerDs), timeInfo: null }
    //update the layerDefinition with the layer definition of the data source so that the domain values will shown
    featureLayerDs?.setLayerDefinition(layerDef)
    //create custom feature layer with all the analysis layer info
    const layer = await dataSourceUtils.createJSAPIFeatureLayerByRecords(featureLayerDs, recordsForLayer, null, {
      id: outputDsId + '_layer',
      title: outputDsId,
      popupTemplate: { //feature info widget popup title
        title: analysisLabel ?? outputDS.getLabel() ?? outputDsId,
        fieldInfos: fieldsInPopupTemplate,
        content: [{
          type: 'fields',
          fieldInfos: fieldsInPopupTemplate
        }]
      },
      visible: false,
      listMode: 'hide',
      customParameters: {
        moveFeaturesToCenterWhenPrinting: 'true'
      }
    }).then(res => res.layer)

    // If user is in search by current extent or show all features mode,
    // Set the layer's isTable property to true and set isTable to true as we don't have geometries in this mode
    if (searchCurrentExtent || showAllFeatures) {
      Object.defineProperty(layer, 'isTable', {
        writable: true,
      })
      // @ts-expect-error
      layer.isTable = true
    }

    let outputFeatureRecords: DataRecord[] = recordsForLayer
    if (layer && featureLayerDs) {
      featureLayerDs.layer = layer
      if (recordsForLayer.length > 0) {
        featureLayerDs.setSourceRecords(recordsForLayer)
        outputFeatureRecords = recordsForLayer as unknown as DataRecord[]
      }
    }
    let dataSet
    if (this.props.showExportButton) {
      dataSet = {
        records: outputFeatureRecords,
        dataSource: outputDS as FeatureLayerDataSource,
        name: outputDS.getLabel(),
        fields: fieldsToExport
      }
    }
    if (this.props.analysisType === AnalysisTypeName.Proximity && this.allIntersectingFeatures.length > 0) {
      await this.buildOutputDataSetForProximityCount(analysisLabel, this.allIntersectingFeatures, outputDS, outputDsId)
    }
    const dataSetArr = dataSet ? [dataSet] : []
    this.props.onUpdateDataActionDataSet(dataSetArr)
    //update the data source status
    this.getOutputDataSource(outputDsId)?.setStatus(DataSourceStatus.Unloaded)
    this.getOutputDataSource(outputDsId)?.setCountStatus(DataSourceStatus.Unloaded)
    this.getOutputDataSource(outputDsId)?.addSourceVersion()
  }

  /**
   * Build output dataSource result for summary
   * @param analysisLabel - Configured analysis label
   * @param dsId - use data source id
   * @param summaryFields summary result fields info
   * @param outputDsId Output data source id
   * @param attributesValues resolved summary fields values
   */
  buildOutputDsResultsForSummary = async (analysisLabel: string, dsId: string, summaryFields: SummaryFieldsInfo[], outputDsId: string, attributesValues: SummaryAttributes) => {
    let outputDS = this.getOutputDataSource(outputDsId)
    if (!outputDS) {
      const dsManager = DataSourceManager.getInstance()
      try {
        // Try to create with just the ID first
        outputDS = await dsManager.createDataSource(outputDsId) as FeatureLayerDataSource
      } catch (err) {
        try {
          // Fallback: try with initial JSON configuration
          const dataSource = dsManager?.getDataSource(dsId) as FeatureLayerDataSource
          const initialDsJson = this.createInitialSummaryOutputDsJson(outputDsId, analysisLabel, summaryFields, dataSource)
          if (initialDsJson) {
            outputDS = await dsManager.createDataSource(Immutable(initialDsJson)) as FeatureLayerDataSource
          }
        } catch (jsonErr) {
          console.error(jsonErr)
          return
        }
      }
    }
    if (!outputDS) {
      return
    }
    const dsManager = DataSourceManager.getInstance()
    const dataSource = dsManager?.getDataSource(dsId) as FeatureLayerDataSource
    const allowExport = await (dataSource as QueriableDataSource).allowToExportData()

    const dsJson = Object.assign(outputDS.getDataSourceJson())
    // Update the disableExport option based on allowExport in the output data source instance.
    DataSourceManager.getInstance().updateDataSourceByDataSourceJson(outputDS, Immutable({ ...dsJson, disableExport: !allowExport, exportOptions: dataSource.getExportOptions() }))
    //We will always have objectId and count in summary analysis
    //if summary fields are not configured user can still see the count
    const summaryFieldsArr: __esri.FieldProperties[] = [
      {
        alias: 'OBJECTID',
        type: 'double',
        name: 'OBJECTID'
      },
      {
        alias: this.nls('count'),
        type: 'double',
        name: 'esriCTCOUNT'
      }
    ]
    const summaryFieldsValues: any = {}
    // Add objectid and count attributeValues
    summaryFieldsValues.OBJECTID = 0
    if (Object.prototype.hasOwnProperty.call(attributesValues, 'esriCTCOUNT')) {
      summaryFieldsValues.esriCTCOUNT = attributesValues.esriCTCOUNT
    }
    //push all the configured summary fields
    summaryFields.forEach((fieldInfos) => {
      const fieldName = fieldInfos.fieldLabel.replace(/ /g, '')
      summaryFieldsArr.push({
        alias: fieldInfos.fieldLabel,
        type: 'string',
        name: fieldName
      })
      //if attributesValues are available set it
      if (Object.prototype.hasOwnProperty.call(attributesValues, fieldName)) {
        summaryFieldsValues[fieldName] = attributesValues[fieldName]
      }
    })

    //define dummy point geometry as for summary analysis stats value we don't have any geometry
    const dummyPointGeometry = {
      type: 'point',
      x: this.props.mapView?.view?.extent.center.x,
      y: this.props.mapView?.view?.extent.center.y,
      spatialReference: { wkid: this.props.mapView.view.spatialReference.wkid }
    } as __esri.GeometryUnion

    const summaryFieldsGraphic = new Graphic({
      attributes: summaryFieldsValues,
      geometry: dummyPointGeometry
    })

    const fieldsInPopupTemplate: any[] = []
    summaryFieldsArr.forEach((fields) => {
      if (fields.name) {
        fieldsInPopupTemplate.push({
          fieldName: fields.name,
          label: fields.alias
        })
      }
    })

    //create custom feature layer with all the statistics info
    const layer = new FeatureLayer({
      id: outputDsId + '_layer',
      title: outputDsId,
      fields: summaryFieldsArr,
      geometryType: 'point',
      source: [summaryFieldsGraphic],
      objectIdField: 'OBJECTID',
      popupTemplate: { //feature info widget popup title
        title: analysisLabel ?? outputDS.getLabel() ?? outputDsId,
        fieldInfos: fieldsInPopupTemplate,
        content: [{
          type: 'fields',
          fieldInfos: fieldsInPopupTemplate
        }]
      },
      visible: false,
      listMode: 'hide',
      customParameters: {
        moveFeaturesToCenterWhenPrinting: 'true'
      }
    })
    const featureLayerDs = this.getOutputDataSource(outputDsId) as FeatureLayerDataSource
    featureLayerDs.layer = layer

    //query on output ds to get the feature records
    //we need feature to be store in output datasource sumamry
    //to convert the features into feature record in the output ds we have to build the record
    let records
    const query = featureLayerDs.layer.createQuery()
    query.outSpatialReference = this.props.mapView.view.spatialReference
    query.returnGeometry = true
    query.outFields = ['*']
    query.where = '1=1'
    featureLayerDs.layer.queryFeatures(query).then((results) => {
      if (results.features?.length > 0) {
        records = results.features.map((feature) => {
          return featureLayerDs.buildRecord(feature)
        })
      }
      const dataSetSummaryArr = []
      const summaryFeatureRecords = this.allIntersectingFeatures
      if (!summaryFeatureRecords) {
        return
      }

      if (allowExport) {
        dataSetSummaryArr.push({
          records: attributesValues.esriCTCOUNT > 0 ? records : [],
          dataSource: outputDS,
          name: outputDS.getLabel()
        })

        dsManager.createDataSource(Immutable({
          id: 'downloadCsv_output' + new Date().getTime(),
          type: DataSourceTypes.FeatureLayer,
          isDataInDataSourceInstance: true,
          schema: dataSource.getSchema(),
          exportOptions: dataSource.getExportOptions()
        })).then(ds => {
          const newDsJson = Object.assign(ds.getDataSourceJson())
          DataSourceManager.getInstance().updateDataSourceByDataSourceJson(ds, Immutable({ ...newDsJson, disableExport: !allowExport, exportOptions: dataSource.getExportOptions() }))
          ds.setSourceRecords(summaryFeatureRecords)
          if (this.props.showExportButton) {
            const dataSets = {
              records: summaryFeatureRecords,
              dataSource: ds,
              name: dataSource.getLabel(),
              fields: this.getFieldsToExport(this.props.analysisId)
            }
            dataSetSummaryArr.push(dataSets)
            this.props.onUpdateDataActionDataSet(dataSetSummaryArr)
          }
        })
      } else {
        this.props.onUpdateDataActionDataSet([])
      }
    })

    //update the data source status
    this.getOutputDataSource(outputDsId)?.setStatus(DataSourceStatus.Unloaded)
    this.getOutputDataSource(outputDsId)?.setCountStatus(DataSourceStatus.Unloaded)
    this.getOutputDataSource(outputDsId)?.addSourceVersion()
  }

  /**
   * Callback to update export progress
   * @param progress progress value
   *
   * */
  progressCallback = (progress: number) => {
    const percent = Math.round(progress * 100)
    this.setState({
      exportProgress: percent - 1
    })
  }

  /**
   * Highlight features on the map
   * @param records records to highlight on the map
   * @param showHighlights whether to show or remove highlights
   */
  highlightFeaturesOnMap = (records: DataRecord[] | FeatureDataRecord[]) => {
    const analysisInfo = this.props.layerInfo.analysisInfo as any
    const clipFeatures = analysisInfo.clipFeatures
    const highlightResults = analysisInfo.highlightResultsOnMap
    const highlightResultsColor = analysisInfo.highlightColorOnMap
    this.props.createHighlightGraphicsForLayer(this.props.analysisId, records, this.state.isFeatureLayerOpen, highlightResults, highlightResultsColor, clipFeatures)
  }

  /**
   * Create summary analysis jsx element
   * @param buildOutputDs: when true output data source should build to show export functionality
   */
  createSummaryAnalysis = async (buildOutputDs: boolean) => {
    const jsxElements: React.JSX.Element[] = []
    let value = null
    const analysisInfo: any = this.props.layerInfo.analysisInfo as any
    const analysisLabel: string = this.props.layerInfo.label
    if (!analysisInfo.summaryFields || analysisInfo.summaryFields.length === 0) {
      if (buildOutputDs) {
        await this.updateSummaryOutputDS(analysisLabel, this.props.layerInfo.useDataSource.dataSourceId, [], this.props.analysisId)
      }
      this.setState({
        featureItems: [],
        isLoading: false
      })
      return
    }
    const { showAllFeatures, searchByLocation, searchCurrentExtent } = getSearchWorkflow(this.props.searchSettings)
    const areaOrLengthFieldConfigured = analysisInfo.summaryFields.some(({ summaryFieldInfo: sfi }) => sfi?.summaryBy === CommonSummaryFieldValue.SumOfIntersectedArea || sfi?.summaryBy === CommonSummaryFieldValue.SumOfIntersectedLength
    )
    const calculateOrLengthField = !(showAllFeatures || searchCurrentExtent) && !this.state.showmaxRecordCountInfoMsg && areaOrLengthFieldConfigured
    if (calculateOrLengthField) {
      if (this.allIntersectingFeatures.length === 0 || this.allIntersectingFeatures.length !== this.state.updatedFeatureCount) {
        this.allIntersectingFeatures = await this.getAllRecords()
        this.props.onAllFeaturesFetched(this.props.dsId, this.props.analysisId, this.allIntersectingFeatures)
      }
      if (searchByLocation) {
        this.highlightFeaturesOnMap(this.allIntersectingFeatures)
      }
      let bufferGeometry
      if (searchByLocation || searchCurrentExtent) {
        //set buffer geometry
        if (this.props.aoiGeometries?.bufferGeometry) {
          bufferGeometry = this.props.aoiGeometries.bufferGeometry
        } else {
          bufferGeometry = this.props.aoiGeometries?.incidentGeometry
        }
      }
      const featureList = this.allIntersectingFeatures
      const portalUnit = getPortalUnit()
      //Use portal unit in case of show all features OR search by extent
      const distanceUnit = showAllFeatures || searchCurrentExtent
        ? portalUnit
        : this.props.aoiGeometries.distanceUnit || this.props.searchSettings.distanceUnits || portalUnit
      //skip the length or area field when search by location is not enabled
      // get the value of SumOfIntersectedArea/SumOfIntersectedLength
      analysisInfo.summaryFields.forEach((summaryField: SummaryFieldsInfo, index: number) => {
        //   // if define search is off or search by map are is on then skip sum of intersected area/length fields of summary
        if ((calculateOrLengthField && Object.prototype.hasOwnProperty.call(summaryField.summaryFieldInfo, 'summaryBy'))) {
          if (summaryField.summaryFieldInfo?.summaryBy === CommonSummaryFieldValue.SumOfIntersectedArea) {
            value = this.getArea(featureList, bufferGeometry, distanceUnit)
            value = this.getSummaryDisplayValue(value, summaryField.summaryFieldInfo, distanceUnit, true)
          }
          if (summaryField.summaryFieldInfo?.summaryBy === CommonSummaryFieldValue.SumOfIntersectedLength) {
            value = this.getLength(featureList, bufferGeometry, distanceUnit)
            value = this.getSummaryDisplayValue(value, summaryField.summaryFieldInfo, distanceUnit, false)
          }
        }
      })
    } if (!this.state.showmaxRecordCountInfoMsg) {
      if (this.allIntersectingFeatures.length === 0 || this.allIntersectingFeatures.length !== this.state.updatedFeatureCount) {
        this.allIntersectingFeatures = await this.getAllRecords()
        this.props.onAllFeaturesFetched(this.props.dsId, this.props.analysisId, this.allIntersectingFeatures)
      }
      if (searchByLocation) {
        this.highlightFeaturesOnMap(this.allIntersectingFeatures)
      }
    }
    //If calculateOrLengthField and only SumOfIntersectedArea/SumOfIntersectedLength then we don't need any summary fields
    //as in search by current map area we cannot calculate SumOfIntersectedArea/SumOfIntersectedLength
    //else create the list of summary fields
    if (!calculateOrLengthField && analysisInfo.summaryFields.length === 1 && ('summaryBy' in (analysisInfo.summaryFields[0]?.summaryFieldInfo || {}))) {
      if (buildOutputDs) {
        this.updateSummaryOutputDS(analysisLabel, this.props.layerInfo.useDataSource.dataSourceId, analysisInfo.summaryFields, this.props.analysisId)
      }
    } else {
      const useDataSource = this.props.useDataSources.find((ds) => ds.dataSourceId === this.props.layerInfo.useDataSource.dataSourceId)
      const geometry = this.props.aoiGeometries?.bufferGeometry || this.props.aoiGeometries?.incidentGeometry
      jsxElements.push(<SummaryResult
        key={this.props.analysisId}
        widgetId={this.props.widgetId}
        theme={this.props.theme}
        useDataSource={useDataSource}
        summaryFieldInfos={analysisInfo.summaryFields}
        sumOfAreaOrLengthValue={value}
        singleFieldColor={analysisInfo.isSingleColorMode ? analysisInfo.singleFieldColor : null}
        onSummaryFieldsResolved={(summaryAttributes: SummaryAttributes) => {
          this.setState({ isLoading: false })
          if (buildOutputDs) {
            this.updateSummaryOutputDS(analysisLabel, this.props.layerInfo.useDataSource.dataSourceId, analysisInfo.summaryFields, this.props.analysisId, summaryAttributes, true)
          }
        }}
        analysisId={this.props.analysisId}
        bufferGeom={geometry}
      ></SummaryResult>)
    }
    this.setState({
      featureItems: jsxElements
    })
  }

  /**
   * Updates the output dataSource with the resolved summary values
   * @param analysisLabel - Configured analysis label
   * @param dsId - use data source id
   * @param summaryFields - Configured SummaryFieldsInfo for the analysis
   * @param analysisId - Analysis id
   * @param intersectingFeaturesCount - Total number of features intersecting the AOI
   * @param resolvedAttributes - Resolved values of configured summary expressions
   * @param resetDataSet - When true, the dataset will be reset and rebuilt.
  */
  updateSummaryOutputDS = async (analysisLabel: string, dsId: string, summaryFields: SummaryFieldsInfo[], analysisId: string, resolvedAttributes?: SummaryAttributes, resetDataSet = false) => {
    const summaryAttributes: SummaryAttributes = resolvedAttributes ? { ...resolvedAttributes } : {}
    this.summaryAttributes = summaryAttributes
    const outputDsId = getOutputDsId(this.props.widgetId, AnalysisTypeName.Summary, analysisId)
    summaryAttributes.esriCTCOUNT = this.state.updatedFeatureCount
    //in case of workflows other than searchByLocation exclude SumOfIntersectedArea/SumOfIntersectedLength from summaryFields
    const { searchByLocation } = getSearchWorkflow(this.props.searchSettings)
    const filteredSummaryFields = searchByLocation
      ? summaryFields
      : summaryFields.filter(field =>
        field.summaryFieldInfo?.summaryBy !== CommonSummaryFieldValue.SumOfIntersectedArea &&
        field.summaryFieldInfo?.summaryBy !== CommonSummaryFieldValue.SumOfIntersectedLength
      )
    if (this.allIntersectingFeatures.length === 0) {
      let records = await this.getALLRecordsForOutputDs()
      this.props.onAllFeaturesFetched(this.props.dsId, this.props.analysisId, records)
      const sortByDist = (this.props.layerInfo.analysisInfo as any)?.sortFeaturesByDistance && searchByLocation
      const showApproxDist = this.props.analysisSettings?.showDistFromInputLocation && searchByLocation
      const isClosest = this.props.analysisType === AnalysisTypeName.Closest
      const dataSource = getSelectedLayerInstance(this.props.dsId) as FeatureLayerDataSource
      const summarySortIdFields = this.getSortIdFields(dataSource)
      const sortByField = !!(this.props.layerInfo.analysisInfo as any)?.sortFeatures?.sortFeaturesByField
      const hasUniqueIdFields = summarySortIdFields.length > 0
      records = await this.applyClientSideSorting(
        records as FeatureDataRecord[],
        summarySortIdFields,
        sortByDist,
        showApproxDist,
        isClosest,
        sortByField && hasUniqueIdFields
      )
      this.allIntersectingFeatures = records
    }
    await this.buildOutputDsResultsForSummary(analysisLabel, dsId, filteredSummaryFields, outputDsId, summaryAttributes)
    if (this.props.showExportButton) {
      this.buildExportOptions(resetDataSet)
    } else {
      this.setState({ exportProgress: 100 })
    }
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
    featureRecords.forEach(featureRecord => {
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
          value += geodeticLengthOperator.execute(intersectGeom, { unit: units })
        } else {
          value += lengthOperator.execute(intersectGeom, { unit: units })
        }
      }
    })
    return value
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
    featureRecords.forEach(featureRecord => {
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
          value += geodeticAreaOperator.execute(intersectGeom, { unit: units })
        } else {
          value += areaOperator.execute(intersectGeom, { unit: units })
        }
      }
    })
    return value
  }

  /**
   * Get summary field display value
   * @param summaryValue sum of intersected Length/Area
   * @param summaryFieldInfo Sum Of Area/Length Params
   * @param distanceUnit  selected unit
   * @param isIntersectingArea if intersecting area is selected
   * @returns formatted value or area
   */
  getSummaryDisplayValue = (summaryValue: number, summaryFieldInfo: SumOfAreaLengthParam, distanceUnit: string, isIntersectingArea?: boolean): string => {
    const defaultNumberFormat: FormatNumberOptions = {
      useGrouping: summaryFieldInfo.showSeparator,
      notation: 'standard'
    }
    let formattedValue: string
    if (summaryFieldInfo.numberFormattingOption === NumberFormatting.Round) {
      defaultNumberFormat.maximumFractionDigits = summaryFieldInfo.significantDigits
      defaultNumberFormat.minimumFractionDigits = summaryFieldInfo.significantDigits
      formattedValue = this.props.intl.formatNumber(summaryValue, defaultNumberFormat)
    } else if (summaryFieldInfo.numberFormattingOption === NumberFormatting.Truncate) {
      defaultNumberFormat.minimumSignificantDigits = summaryFieldInfo.significantDigits
      if (!isNaN(summaryValue) && summaryValue !== null) {
        const truncatePlaces = summaryFieldInfo.significantDigits
        const truncateExp = new RegExp(truncatePlaces > 0 ? '^\\d*[.]?\\d{0,' + truncatePlaces + '}' : '^\\d*')
        formattedValue = truncateExp.exec(summaryValue.toString())[0]
      }
      formattedValue = this.props.intl.formatNumber(Number(formattedValue), defaultNumberFormat)
    } else {
      formattedValue = this.props.intl.formatNumber(summaryValue, defaultNumberFormat)
    }
    let unitAbbr = this.getSelectedUnitsAbbr(distanceUnit)
    //show square unit for area
    if (isIntersectingArea) {
      unitAbbr = unitAbbr + '\u00b2'
    }
    return this.summaryIntersectValueAndUnitLabel(formattedValue, unitAbbr)
  }

  /**
   * Get label for sum of intersected area/length value and unit
   * @param formattedSummaryValue formatted sum of intersected area/length value
   * @param unit unit
   * @returns formatted sum of intersected area/length value unit label
   */
  summaryIntersectValueAndUnitLabel = (formattedSummaryValue: string, unit: string): string => {
    const summaryIntersectValueAndUnitLabel = this.props.intl.formatMessage({
      id: 'summaryIntersectValueAndUnit', defaultMessage: defaultMessages.summaryIntersectValueAndUnit
    }, { summaryIntersectValue: formattedSummaryValue, unitLabel: unit })
    return summaryIntersectValueAndUnitLabel
  }

  /**
   * Get label for max record warning message
   * @returns
   */
  getMaxRecordInfoMsg = (): string => {
    let maxRecordWarningMsg = ''
    maxRecordWarningMsg = this.props.intl.formatMessage({
      id: 'maxRecordWarningMsg', defaultMessage: defaultMessages.maxRecordWarningMsg
    }, { feature: maxRecordWarningMsg, maxRecordCountThreshold: maxRecordCountThreshold })
    return maxRecordWarningMsg
  }

  /**
   * Create grouped feature set jsx elements
   * @param groupFeatures grouped features
   * @returns jsx elements
   */
  getGroupSubGroupFeaturesSet = (groupFeatures) => {
    const analysisInfo = this.props.layerInfo.analysisInfo as any
    let subGroupFeaturesObj = null
    const { field, noValueLabel } = this.props.groupSubGroupFeaturesObj
    if (analysisInfo.subGroupFeatures.subGroupFeaturesByField && analysisInfo.subGroupFeatures.subGroupFeaturesByField !== field) {
      subGroupFeaturesObj = {
        field: analysisInfo.subGroupFeatures.subGroupFeaturesByField,
        sortOrder: analysisInfo.subGroupFeatures.subGroupFeaturesOrder,
        sortByCount: analysisInfo.subGroupFeatures.sortSubGroupsByCount,
        noValueLabel: analysisInfo.subGroupFeatures.noValueSubGroupLabel
      }
    }
    //create ids to exclude using filteredOutObjectIds if it has else also check if props.idsToExclude has value to use for excluding features in feature set
    const idsToExclude = this.filteredOutObjectIds?.length ? this.filteredOutObjectIds : this.props.idsToExclude?.length ? this.props.idsToExclude : []
    const jsxElements = [... this.state.featureItems]
    //check config parameters to decide feature details/groups should be expanded or collapse
    const expandFeaturesOrGroups = this.props.analysisType === AnalysisTypeName.Proximity ? (analysisInfo.expandOnOpen && analysisInfo.expandFeatureDetails) : true
    const layerObj = getSelectedLayerInstance(this.props.layerInfo.useDataSource.dataSourceId) as any
    const showGroupSymbol = this.props.analysisSettings?.displayMapSymbols &&
      layerObj.layer?.renderer?.type === 'unique-value' &&
      field === layerObj.layer?.renderer?.field
    groupFeatures.forEach((group, groupIndex) => {
      const whereClause = this.getWhereClause(group, field)
      jsxElements.push(
        <LayerAccordion
          widgetId={this.props.widgetId}
          theme={this.props.theme}
          key={groupIndex}
          index={groupIndex}
          idsToExclude={idsToExclude}
          intl={this.props.intl}
          analysisSettings={this.props.analysisSettings}
          label={group.label || noValueLabel}
          analysisIcon={null}
          featureCount={group.count}
          isExpanded={expandFeaturesOrGroups}
          dsId={this.props.layerInfo.useDataSource.dataSourceId}
          analysisId={analysisInfo.analysisId}
          analysisType={this.props.analysisType}
          layerInfo={this.props.layerInfo}
          isListView={false}
          searchSettings={this.props.searchSettings}
          aoiGeometries={this.props.aoiGeometries}
          mapView={this.props.mapView}
          displayMapSymbol={showGroupSymbol}
          groupSubGroupFeaturesObj={subGroupFeaturesObj}
          whereClause={whereClause}
          canToggle
          useDataSources={this.props.useDataSources}
          folderUrl={this.props.folderUrl}
          incidentGraphic={this.props.incidentGraphic}
          graphicLayer={this.props.graphicLayer}
          highlightFeature={this.props.highlightFeature}
          selectRecord={this.props.selectRecord}
          clearRecord={this.props.clearRecord}
          createHighlightGraphicsForLayer={this.props.createHighlightGraphicsForLayer}>
        </LayerAccordion>
      )
    })
    return jsxElements
  }

  /**
   * Get where clause for group
   * @param group group
   * @param field field
   * @returns where clause
   */
  getWhereClause = (group, field): string => {
    let whereClause: string
    const value = group.value
    // for null value we need to use IS NULL to check the null value in sql where clause
    if (value === null) {
      whereClause = `${field} IS NULL`
    } else if (group.fieldType === 'DATE') {
      whereClause = buildDateWhereClause(field, value)
    } else if (group.fieldType === 'STRING') {
      whereClause = `${field} = '${value}'`
    } else {
      whereClause = `${field} = ${value}`
    }
    if (this.props.whereClause) {
      whereClause = this.props.whereClause + ' AND (' + whereClause + ')'
    }
    return whereClause
  }

  /**
   * Create feature set jsx elements
   * @param features features
   * @returns jsx elements
   */
  getFeatureSet = (features) => {
    const layerInfo = this.props.layerInfo as any
    const jsxElements = [... this.state.featureItems]
    // create list
    const { showAllFeatures, searchByLocation, searchCurrentExtent } = getSearchWorkflow(this.props.searchSettings)
    let popupTitleField: string = ''
    if (layerInfo.analysisInfo.analysisType === AnalysisTypeName.Proximity && layerInfo.analysisInfo.displayField !== '') {
      popupTitleField = layerInfo.analysisInfo.displayField
    } else {
      const dsId: string = layerInfo.useDataSource.dataSourceId
      const ds = getSelectedLayerInstance(dsId) as any
      //Get the default selected display field for proximity
      popupTitleField = getDisplayField(ds)
    }
    const portalUnit = getPortalUnit()
    //check config parameters to decide feature details/groups should be expanded or collapse
    const expandFeaturesOrGroups = this.props.analysisType === AnalysisTypeName.Proximity
      ? layerInfo.analysisInfo.expandOnOpen && layerInfo.analysisInfo.expandFeatureDetails
      : true
    //Use portal unit in case of show all features OR search by extent
    const distanceUnit = showAllFeatures || searchCurrentExtent
      ? portalUnit
      : this.props.aoiGeometries.distanceUnit || this.props.searchSettings.distanceUnits || portalUnit
    const showClippedFeaturesInfo = layerInfo.analysisInfo.analysisType === AnalysisTypeName.Proximity && searchByLocation && layerInfo.analysisInfo.clipFeatures
    features.forEach((feature: FeatureDataRecord, featureIndex: number) => {
      const analysisId = layerInfo.analysisInfo.analysisId ?? featureIndex.toString()
      jsxElements.push(<FeatureSet
        intl={this.props.intl}
        widgetId={this.props.widgetId}
        index={analysisId + '_' + this.state.featureItems.length + featureIndex}
        key={analysisId + '_' + this.state.featureItems.length + featureIndex}
        theme={this.props.theme}
        popupTitleField={this.props.analysisType === AnalysisTypeName.Proximity ? popupTitleField : null}
        jimuMapView={this.props.mapView}
        selectedRecord={feature}
        distanceUnit={(searchByLocation || searchCurrentExtent) ? this.getSelectedUnitsAbbr(distanceUnit) : null}
        showPlanRoute={this.canShowPlanRouteButton(feature, this.props.analysisType, searchByLocation)}
        selectedFeatureLength={features.length}
        ifOneAnalysisResult={this.props.isReturnOneAnalysisResult}
        isExpanded={expandFeaturesOrGroups}
        expandOnOpen={layerInfo.analysisInfo.expandOnOpen}
        approximateDistanceUI={this.displayApproximateDistanceUI(layerInfo)}
        showDistFromInputLocation={this.props.analysisSettings?.showDistFromInputLocation}
        displayMapSymbol={this.props.analysisSettings?.displayMapSymbols}
        isEnableProximitySearch={this.props.analysisSettings?.enableProximitySearch}
        showDataActions={searchByLocation}
        selectRecord={this.props.selectRecord}
        clearRecord={this.props.clearRecord}
        highlightFeature={this.props.highlightFeature}
        startingPointGraphic={this.props.incidentGraphic}
        selectedLayerDsId={layerInfo.useDataSource.dataSourceId}
        graphicLayer={this.props.graphicLayer}
        aoiGeometries={this.props.aoiGeometries}
        showClippedFeaturesInfo={showClippedFeaturesInfo}
      >
      </FeatureSet>)
    })
    return jsxElements
  }

  /**
   * Verify whether to show Plan Route button
   * @param selectedRecord selected record
   * @param analysisType analysis type
   * @param searchByLocation search by location method
   * @returns can show Plan Route Button in feature info
   */
  canShowPlanRouteButton = (selectedRecord: FeatureDataRecord, analysisType: string, searchByLocation: boolean): boolean => {
    return (this.props.incidentGraphic && (selectedRecord?.feature?.geometry as Geometry)?.type === 'point' &&
      searchByLocation && analysisType !== AnalysisTypeName.Summary)
  }

  /**
   * Check if to display approximate distance UI
   * @param layerInfo analysis layers info
   * @returns whether to approximate distance UI
   */
  displayApproximateDistanceUI = (layerInfo: LayersInfo): boolean => {
    let showApproximateDistanceUI: boolean = false
    const layerAnalysisInfo: any = layerInfo.analysisInfo
    const analysisType = layerInfo.analysisInfo.analysisType
    const { searchByLocation } = getSearchWorkflow(this.props.searchSettings)
    //search by distance settings is enabled show approximate distance for closest and for proximity if expand list and expand feature details are on
    //for search by map area and show all features don't show approximate distance
    if (searchByLocation) {
      if ((analysisType === AnalysisTypeName.Closest) || (analysisType === AnalysisTypeName.Proximity && layerAnalysisInfo.expandOnOpen &&
        layerAnalysisInfo.expandFeatureDetails)) {
        showApproximateDistanceUI = true
      }
    }
    return showApproximateDistanceUI
  }

  /**
   * Get intersecting features ids for the selected analysis type
   * @returns features ids
   */
  getRecordsIds = async () => {
    const dataSource = getSelectedLayerInstance(this.props.dsId) as FeatureLayerDataSource
    let outFields
    this.props.useDataSources.forEach((dataS) => {
      if (dataS.dataSourceId === dataSource.id) {
        outFields = dataS.fields ?? []
      }
    })
    const bufferGeometry = this.props.aoiGeometries?.bufferGeometry ?? this.props.aoiGeometries?.incidentGeometry
    const ids = await getFeaturesIds(dataSource, bufferGeometry, this.props.mapView.view.spatialReference, outFields)
    return ids
  }

  /**
   * Query records for the selected analysis type
   */
  queryRecords = async () => {
    let records: DataRecord[]
    if (this.state.featureItems.length !== this.state.updatedFeatureCount) {
      records = await this.getPagedRecords()
    }
    await this.handleFeaturesDistance(records)
    this.canShowMoreFeatures = records.length + this.state.featureItems.length < (this.state.updatedFeatureCount || 0)
    return records
  }

  /**
   * Handle features distance calculation and sorting if search by location is enabled
   * @param records features data
   */
  handleFeaturesDistance = async (records: DataRecord[]) => {
    const { searchByLocation } = getSearchWorkflow(this.props.searchSettings)
    const sortByDistance = (this.props.layerInfo.analysisInfo as any)?.sortFeaturesByDistance && searchByLocation
    if (searchByLocation && !sortByDistance) { // when sort by any field is selected
      const showApproxDist = this.props.analysisSettings?.showDistFromInputLocation
      if (showApproxDist) {
        records = await this.getFeaturesDistance(records as FeatureDataRecord[])
      }
    }
    if (records) {
      this.allIntersectingFeatures = [...this.allIntersectingFeatures, ...records]
    }
  }

  /**
   * Handle features to show on load more
   * @param data features data
   * @returns features to render
   */
  handleFeaturesToShow = () => {
    const data = this.queriedData.length ? this.queriedData : this.allIntersectingFeatures
    const end = this.state.featureItems.length + 20
    const featuresToRender = data.slice(this.state.featureItems.length, end)
    if (end >= data.length) {
      this.canShowMoreFeatures = false
    } else {
      this.canShowMoreFeatures = true
    }
    return featuresToRender
  }

  /**
   * Handles querying and sorting of grouped features
   */
  queryGroupSubGroupFeatures = async () => {
    const dataSource = getSelectedLayerInstance(this.props.dsId) as FeatureLayerDataSource
    const { field, sortOrder, sortByCount } = this.props.groupSubGroupFeaturesObj
    const bufferGeometry = this.props.aoiGeometries?.bufferGeometry ?? this.props.aoiGeometries?.incidentGeometry
    // For group/subgroup queries, only use base whereClause (geometry-based filtering).
    // All exclusions are applied client-side to avoid server errors with GROUP BY/statistics.
    const baseWhereClause = this.props.whereClause
    // Validate groupField exists in schema before querying
    const dsSchema = dataSource?.getSchema?.()
    if (!dsSchema?.fields?.[field]) {
      return []
    }

    // For returnIntersectedPolygons, grouped statistics queried from server cannot be
    // reliably filtered by record ids. Build grouped results from locally filtered records.
    if (this.isReturnIntersectedPolygonsCase()) {
      let records = this.allIntersectingFeatures?.length > 0 ? this.allIntersectingFeatures : await this.getAllRecords()
      records = this.filterOnlyIntersectedPolygons(records)
      const fieldType = dsSchema?.fields?.[field]?.type
      const groupedMap = new Map<string, { label: string, value: any, count: number, fieldType: any }>()

      records.forEach((record: any) => {
        const attrs = record?.getData?.() ?? record?.feature?.attributes ?? {}
        const groupValue = attrs?.[field]
        const mapKey = String(groupValue)
        const groupLabel = record?.getFormattedFieldValue
          ? (record.getFormattedFieldValue(field, this.props.intl) ?? '')
          : (groupValue ?? '')
        const existing = groupedMap.get(mapKey)
        if (existing) {
          existing.count += 1
        } else {
          groupedMap.set(mapKey, {
            label: groupLabel,
            value: groupValue,
            count: 1,
            fieldType
          })
        }
      })

      const groupedArr = Array.from(groupedMap.values())
      if (sortByCount) {
        return groupedArr.sort((a, b) => sortOrder === OrderRule.Desc ? b.count - a.count : a.count - b.count)
      }
      // For datasources with unique id fields, server-side grouped sorting can be unreliable.
      // Always apply value sorting client-side and keep empty-value groups at the end.
      const groupsWithEmptyLabel = groupedArr.filter(group => group.label === '')
      const groupsWithNonEmptyLabel = groupedArr.filter(group => group.label !== '')
      const sortedGroups = groupsWithNonEmptyLabel.sort(this.sortGroups('value', sortOrder))
      const sortedEmptyGroups = groupsWithEmptyLabel.sort(this.sortGroups('value', sortOrder))
      return [...sortedGroups, ...sortedEmptyGroups]
    }

    try {
      // Query with base whereClause only (no exclusions in server-side query)
      let groupedFeatures = await getGroupSubGroupFeatures(dataSource, bufferGeometry, field, sortOrder, baseWhereClause)

      if (!groupedFeatures || groupedFeatures.length === 0) {
        return []
      }

      const excludedIds = [...(this.filteredOutObjectIds ?? []), ...(this.props.idsToExclude ?? [])]
      const uniqueIdFields = dataSource?.getUniqueIdFields?.() ?? []
      const objectIdField = dataSource.getIdField()

      // Apply all exclusions client-side to avoid server errors
      if (excludedIds.length > 0) {
        groupedFeatures = groupedFeatures.filter((record) => {
          const attrs = record.getData()
          const hasObjectIdInGroupResult = !!objectIdField && attrs?.[objectIdField] !== undefined && attrs?.[objectIdField] !== null
          const hasUniqueIdsInGroupResult = uniqueIdFields.length > 0 && uniqueIdFields.every((fieldName) => attrs?.[fieldName] !== undefined && attrs?.[fieldName] !== null)
          // Grouped statistic records commonly only contain group field + feature_count.
          // If id fields are absent in the grouped payload, keep the record to avoid incorrect removals.
          if (!hasObjectIdInGroupResult && !hasUniqueIdsInGroupResult) {
            return true
          }
          // Check if this group record matches any excluded ID
          return !excludedIds.some((excludedId) => {
            if (uniqueIdFields.length > 1) {
              // For composite IDs, all fields must match
              if (typeof excludedId !== 'object' || excludedId === null) {
                return false
              }
              return uniqueIdFields.every((fieldName) =>
                excludedId[fieldName] === attrs[fieldName]
              )
            } else if (uniqueIdFields.length === 1) {
              // For single unique ID field
              if (typeof excludedId === 'object' && excludedId !== null) {
                return excludedId[uniqueIdFields[0]] === attrs[uniqueIdFields[0]]
              }
              return excludedId === attrs[uniqueIdFields[0]]
            } else if (objectIdField) {
              // Fallback to objectIdField
              if (typeof excludedId === 'object' && excludedId !== null) {
                return excludedId[objectIdField] === attrs[objectIdField]
              }
              return excludedId === attrs[objectIdField]
            }
            return false
          })
        })
      }

      const sortedGroups = this.getSortedGroupSubGroupFeatures(groupedFeatures, field, sortByCount, sortOrder)
      return sortedGroups
    } catch (error) {
      console.error(error)
      return []
    }
  }

  /**
   * Get sorted grouped features
   * @param records grouped records
   * @param groupOrSubGroupField group or sub group field
   * @param sortByCount whether to sort by count
   * @param sortOrder sort order
   * @returns sorted grouped features
   */
  getSortedGroupSubGroupFeatures = (records, groupOrSubGroupField, sortByCount, sortOrder) => {
    const ds = DataSourceManager.getInstance().getDataSource(this.props.dsId)
    const dsSchema = ds?.getSchema()
    const groupedArr = records.map((record) => {
      const attrs = record.getData()
      const label = record.getFormattedFieldValue(groupOrSubGroupField, this.props.intl)
      const fieldType = dsSchema?.fields?.[groupOrSubGroupField]?.type
      const parsedCount = Number(attrs?.feature_count)
      return {
        label: label ?? '',
        value: attrs[groupOrSubGroupField],
        count: Number.isFinite(parsedCount) ? parsedCount : 0,
        fieldType
      }
    })
    if (sortByCount) {
      // sort by count
      return groupedArr.sort((a, b) => sortOrder === OrderRule.Desc ? b.count - a.count : a.count - b.count)
    } else {
      // Sort by grouped value in configured order and keep empty-label groups at the end.
      const groupsWithEmptyLabel = groupedArr.filter(group => group.label === '')
      const groupsWithNonEmptyLabel = groupedArr.filter(group => group.label !== '')
      const sortedGroups = groupsWithNonEmptyLabel.sort(this.sortGroups('value', sortOrder))
      const sortedEmptyGroups = groupsWithEmptyLabel.sort(this.sortGroups('value', sortOrder))
      return [...sortedGroups, ...sortedEmptyGroups]
    }
  }

  /**
   * Get the sorted features
   * @param selectedFeatures selected features on the map
   * @param layerInfo analysis layers info
   * @param isSortByObjId sort feature by object id
   * @param idFields fields of the layer
   * @returns selected features and group features
   */
  getSortedFeatures = (selectedFeatures, idFields: string[]) => {
    const sortingField = this.getConfiguredSortingField()
    const analysisType = this.props.analysisType
    if (this.props.analysisType === AnalysisTypeName.Proximity) {
      const records = this.sortRecords(selectedFeatures, sortingField)
      selectedFeatures = records.notEmptyRecordsArr.sort(this.sortFeatureList(sortingField, analysisType, idFields))
      const featuresWithNullValue = records.emptyRecordArr.sort(this.sortFeatureList(sortingField, analysisType, idFields))
      if ((this.props.layerInfo.analysisInfo as any).sortFeatures?.sortFeaturesOrder === OrderRule.Desc) {
        selectedFeatures = featuresWithNullValue.concat(selectedFeatures)
      } else {
        selectedFeatures = selectedFeatures.concat(featuresWithNullValue)
      }
    } else {
      selectedFeatures = selectedFeatures.sort(this.sortFeatureList(sortingField, analysisType, idFields))
    }
    return selectedFeatures
  }

  /**
   * Apply the shared client-side sorting flow after records are fetched.
   * This keeps distance calculation and client-side sorting behavior aligned
   * across the different analysis load paths.
   * @param records fetched feature records
   * @param sortIdFields id fields used for deterministic sorting
   * @param sortByDistance whether the current analysis sorts by distance
   * @param showApproxDist whether distances need to be computed for display
   * @param isClosest whether the current analysis is Closest
   * @param shouldApplyFieldSort whether field sorting should be applied client-side
   * @returns records with distance calculation and client-side sorting applied when needed
   */
  applyClientSideSorting = async (
    records: FeatureDataRecord[],
    sortIdFields: string[],
    sortByDistance: boolean,
    showApproxDist: boolean,
    isClosest: boolean,
    shouldApplyFieldSort: boolean
  ): Promise<FeatureDataRecord[]> => {
    if (sortByDistance || showApproxDist || isClosest) {
      const recordsWithDist = await this.getFeaturesDistance(records)
      if (sortByDistance || isClosest || shouldApplyFieldSort) {
        return this.getSortedFeatures(recordsWithDist, sortIdFields)
      }
      return recordsWithDist
    }

    if (shouldApplyFieldSort) {
      return this.getSortedFeatures(records, sortIdFields)
    }

    return records
  }

  /**
   * Get the sorted group and sub group info
   * @returns selected features and group features
   */
  genarateGroupSubGroupInfo = () => {
    const layerInfo = this.props.layerInfo as any
    const selectedFeatures = [...this.allIntersectingFeatures]
    let groupEnabled = false
    let groupField = ''
    let groupsArr = []
    const layerAnalysisInfo = layerInfo.analysisInfo
    if (layerAnalysisInfo.analysisType === AnalysisTypeName.Proximity) {
      if (layerAnalysisInfo.groupFeaturesEnabled && layerAnalysisInfo.groupFeatures.groupFeaturesByField !== '') {
        groupEnabled = true
        groupField = layerAnalysisInfo.groupFeatures.groupFeaturesByField
      }
    }
    if (groupEnabled) {
      for (let i = 0; i < selectedFeatures.length; i++) {
        const featureRecord = selectedFeatures[i] as any
        const featureValue = featureRecord.feature.attributes[groupField]
        const groupLabel = featureRecord.getFormattedFieldValue(groupField, this.props.intl)
        const gId = 'group_' + layerInfo.useDataSource.dataSourceId + '_' + groupField + '_' + featureValue
        let addGroup = true
        let group
        if (groupsArr.length > 0) {
          for (let j = 0; j < groupsArr.length; j++) {
            const groupInfo = groupsArr[j]
            if (gId === groupInfo.id) {
              if (featureValue === groupInfo.value) {
                addGroup = false
                group = groupInfo
                break
              }
            }
          }
        }
        if (addGroup) {
          groupsArr.push({
            id: gId,
            value: featureValue,
            count: 1,
            label: groupLabel
          })
        } else {
          groupsArr.forEach(g => {
            if (g.id === (gId)) {
              group = g
            }
          })
          group.count += 1
        }
      }
    }

    if (groupEnabled && groupsArr.length > 0) {
      let groupSortingField
      if (layerAnalysisInfo.groupFeatures.sortGroupsByCount) {
        groupSortingField = 'count'
      } else {
        groupSortingField = 'value'
      }
      const groups = this.divideGroupsByEmptyValue(groupsArr, groupSortingField)
      groupsArr = groups.groupsWithNonEmptyValue.sort(this.sortGroups(groupSortingField, layerAnalysisInfo.groupFeatures.groupFeaturesOrder))
      const sortedEmptyValueGroups = groups.groupsWithEmptyValue.sort(this.sortGroups(groupSortingField, layerAnalysisInfo.groupFeatures.groupFeaturesOrder))
      //show group with no value always at bottom
      groupsArr = groupsArr.concat(sortedEmptyValueGroups)
    }

    if (groupEnabled && groupsArr.length > 0) {
      groupsArr.forEach(group => {
        selectedFeatures.forEach(record => {
          const selectedRecord = record as any
          if (group.value === selectedRecord.feature.attributes[groupField]) {
            if (!group.features) {
              group.features = []
            }
            group.features.push(record)
          }
        })
      })

      //Create subgroup info only if subGroup field configured and it is not same as group field
      if (layerAnalysisInfo.subGroupFeatures.subGroupFeaturesByField !== '' &&
        layerAnalysisInfo.subGroupFeatures.subGroupFeaturesByField !== groupField) {
        groupsArr.forEach(group => {
          group.subGroupInfo = this.generateSubGroupInfo(group.features, layerInfo)
        })
      }
    }
    return {
      features: selectedFeatures,
      featuresGroup: groupsArr
    }
  }

  /**
* Divide Groups By EmptyValue and NonEmptyValue to show EmptyValue always at bottom
* @param groups groups
* @param groupSortingField configure field for group sorting
* @returns records array
*/
  divideGroupsByEmptyValue = (groups: any[], groupSortingField: string) => {
    const groupsWithEmptyValue = []
    const groupsWithNonEmptyValue = []
    groups.forEach((group) => {
      const sortFieldValue = group[groupSortingField]
      if (typeof (sortFieldValue) === 'undefined' || sortFieldValue === null || sortFieldValue === '') {
        groupsWithEmptyValue.push(group)
      } else {
        groupsWithNonEmptyValue.push(group)
      }
    })
    return {
      groupsWithEmptyValue: groupsWithEmptyValue,
      groupsWithNonEmptyValue: groupsWithNonEmptyValue
    }
  }

  /**
   * Sort groups according to the group sorting field
   * @param groupSortingField configured group sorting field
   * @param groupSortFieldOrder configured group field sorting order
   * @returns sorting field object
   */
  sortGroups = (groupSortingField: string, groupSortFieldOrder: OrderRule) => {
    return (a: any, b: any) => {
      //proximity grouping enabled and groups are sort by count
      //sort same feature count group with group value and group field sort order
      if (a[groupSortingField] === b[groupSortingField] || (a[groupSortingField] === null && b[groupSortingField] === null)) {
        if (a.value < b.value) {
          return groupSortFieldOrder === OrderRule.Desc ? 1 : -1
        }
        if (a.value > b.value) {
          return groupSortFieldOrder === OrderRule.Desc ? -1 : 1
        }
      }
      if (a[groupSortingField] < b[groupSortingField]) {
        return groupSortFieldOrder === OrderRule.Desc ? 1 : -1
      }
      if (a[groupSortingField] > b[groupSortingField]) {
        return groupSortFieldOrder === OrderRule.Desc ? -1 : 1
      }
      return 0
    }
  }

  /**
   * Build the record comparator used by feature sorting.
   * For Proximity analysis, ties are resolved in a stable order so paged loads and
   * client-side resorting do not reshuffle equivalent rows between renders.
   * @param sortingField configured sorting field
   * @param analysisType configured analysis type
   * @param idFields id fields used as the final deterministic tiebreaker
   * @returns comparator function passed to Array.sort
   */
  sortFeatureList = (sortingField: string, analysisType: string, idFields?: string[]) => {
    const sortFieldOrder = (this.props.layerInfo.analysisInfo as any)?.sortFeatures?.sortFeaturesOrder
    // Cache resolved id values per feature object so repeated comparator calls do not rebuild
    // the same single-field or composite identifier over and over during one sort pass.
    const idValueCache = new WeakMap<object, string | number>()
    const compareBySortOrder = (aValue, bValue) => {
      if (aValue < bValue) {
        return sortFieldOrder === OrderRule.Desc ? 1 : -1
      }
      if (aValue > bValue) {
        return sortFieldOrder === OrderRule.Desc ? -1 : 1
      }
      return 0
    }

    const getRecordIdValue = (recordFeature, recordAttributes) => {
      if (!recordFeature || typeof recordFeature !== 'object') {
        return recordFeature?.objectId
      }
      if (idValueCache.has(recordFeature)) {
        return idValueCache.get(recordFeature)
      }

      const fields = idFields ?? []
      let idValue: string | number
      if (fields.length === 1) {
        idValue = recordAttributes?.[fields[0]]
        idValueCache.set(recordFeature, idValue)
        return idValue
      }
      if (fields.length > 1) {
        // Composite id strings are used only for deterministic tie-breaking when the
        // datasource has multiple unique id fields instead of a single object id.
        idValue = fields.map((fieldName) => recordAttributes?.[fieldName] ?? '').join('|')
        idValueCache.set(recordFeature, idValue)
        return idValue
      }
      idValue = recordFeature?.objectId
      idValueCache.set(recordFeature, idValue)
      return idValue
    }

    return (aRecord: DataRecord, bRecord: DataRecord) => {
      const aFeatureRecord = aRecord as any
      let a = aFeatureRecord.feature
      const bFeatureRecord = bRecord as any
      let b = bFeatureRecord.feature
      const _a = a
      const _b = b
      if (sortingField !== 'distance') {
        a = a.attributes
        b = b.attributes
      }

      if (analysisType === AnalysisTypeName.Proximity) {
        if (a[sortingField] === b[sortingField] || (a[sortingField] === null && b[sortingField] === null)) {
          if (sortingField !== 'distance') {
            // When sorting by an attribute in Proximity, keep nearer features first for rows
            // with the same attribute value so the list remains spatially meaningful.
            if (_a.distance !== _b.distance) {
              if (_a.distance < _b.distance) {
                return -1
              }
              if (_a.distance > _b.distance) {
                return 1
              }
            } else {
              // If both attribute value and distance are equal, fall back to a stable id-based
              // ordering so repeated sorts do not produce inconsistent row order.
              const aIdValue = getRecordIdValue(_a, a)
              const bIdValue = getRecordIdValue(_b, b)
              if (aIdValue < bIdValue) {
                return -1
              }
              if (aIdValue > bIdValue) {
                return 1
              }
            }
          } else {
            // Distance sorting already used the primary spatial value, so only the stable
            // id-based tiebreaker is needed here when two distances are identical.
            const aIdValue = getRecordIdValue(a, a.attributes)
            const bIdValue = getRecordIdValue(b, b.attributes)
            if (aIdValue < bIdValue) {
              return -1
            }
            if (aIdValue > bIdValue) {
              return 1
            }
          }
        }
      }

      return compareBySortOrder(a[sortingField], b[sortingField])
    }
  }

  /**
   * Get the sorted features for sub groups
   * @param selectedFeatures selected features on the map
   * @param layerInfo analysis layers info
   * @returns selected features and sub group features
   */
  generateSubGroupInfo = (selectedFeatures: DataRecord[], layerInfo: LayersInfo) => {
    let groupEnabled = false
    let subGroupField = ''
    let subGroupsArr = []
    const layerAnalysisInfo = layerInfo.analysisInfo as any
    if (layerAnalysisInfo.analysisType === AnalysisTypeName.Proximity) {
      if (layerAnalysisInfo.groupFeaturesEnabled && layerAnalysisInfo.groupFeatures.groupFeaturesByField !== '' &&
        layerAnalysisInfo.subGroupFeatures.subGroupFeaturesByField !== '') {
        groupEnabled = true
        subGroupField = layerAnalysisInfo.subGroupFeatures.subGroupFeaturesByField
      }
    }
    if (groupEnabled) {
      for (let i = 0; i < selectedFeatures.length; i++) {
        const featureRecord = selectedFeatures[i] as any
        const featureValue = featureRecord.feature.attributes[subGroupField]
        const subGroupLabel = featureRecord.getFormattedFieldValue(subGroupField, this.props.intl)
        const gId = 'subGroup_' + layerInfo.useDataSource.dataSourceId + '_' + subGroupField + '_' + featureValue
        let addSubGroup = true
        let subGroup
        if (subGroupsArr.length > 0) {
          for (let j = 0; j < subGroupsArr.length; j++) {
            const groupInfo = subGroupsArr[j]
            if (gId === groupInfo.id) {
              if (featureValue === groupInfo.value) {
                addSubGroup = false
                subGroup = groupInfo
                break
              }
            }
          }
        }
        if (addSubGroup) {
          subGroupsArr.push({
            id: gId,
            value: featureValue,
            count: 1,
            label: subGroupLabel
          })
        } else {
          subGroupsArr.forEach(g => {
            if (g.id === (gId)) {
              subGroup = g
            }
          })
          subGroup.count += 1
        }
      }
    }

    if (groupEnabled && subGroupsArr.length > 0) {
      let subGroupSortingField
      if (layerAnalysisInfo.subGroupFeatures.sortSubGroupsByCount) {
        subGroupSortingField = 'count'
      } else {
        subGroupSortingField = 'value'
      }
      const subGroups = this.divideGroupsByEmptyValue(subGroupsArr, subGroupSortingField)
      subGroupsArr = subGroups.groupsWithNonEmptyValue.sort(this.sortGroups(subGroupSortingField, layerAnalysisInfo.subGroupFeatures.subGroupFeaturesOrder))
      const sortedEmptyValueSubGroups = subGroups.groupsWithEmptyValue.sort(this.sortGroups(subGroupSortingField, layerAnalysisInfo.subGroupFeatures.subGroupFeaturesOrder))
      //show group with no value always at bottom
      subGroupsArr = subGroupsArr.concat(sortedEmptyValueSubGroups)
    }

    if (groupEnabled && subGroupsArr.length > 0) {
      subGroupsArr.forEach(group => {
        selectedFeatures.forEach(record => {
          const selectedRecord = record as any
          if (group.value === selectedRecord.feature.attributes[subGroupField]) {
            if (!group.features) {
              group.features = []
            }
            group.features.push(record)
          }
        })
      })
    }
    return {
      features: selectedFeatures,
      featuresSubGroup: subGroupsArr
    }
  }

  /**
   * Sort records according to sorting field
   * @param features features
   * @param sortingField configure field for sorting
   * @returns records array
   */
  sortRecords = (features: DataRecord[], sortingField: string) => {
    const emptyRecordArr: DataRecord[] = []
    const notEmptyRecordsArr: DataRecord[] = []
    features?.forEach((record: DataRecord, i) => {
      const featureRecord = record as any
      const sortFieldValue = sortingField === 'distance' ? featureRecord.feature[sortingField] : featureRecord.feature.attributes[sortingField]
      if (typeof (sortFieldValue) === 'undefined' || sortFieldValue === null || sortFieldValue === '') {
        emptyRecordArr.push(record)
      } else {
        notEmptyRecordsArr.push(record)
      }
    })
    return {
      emptyRecordArr: emptyRecordArr,
      notEmptyRecordsArr: notEmptyRecordsArr
    }
  }

  /**
   * get the features distance using distance units
   * @param selectedFeatures selected features on the map
   * @returns selected features
   */
  getFeaturesDistance = async (selectedFeatures: FeatureDataRecord[]) => {
    if (selectedFeatures.length === 0) {
      return []
    }
    const promise = new Promise<FeatureDataRecord[]>((resolve) => {
      const { showAllFeatures, searchCurrentExtent } = getSearchWorkflow(this.props.searchSettings)
      const portalUnit = getPortalUnit()
      //Use portal unit in case of show all features OR search by extent
      const distanceUnit = showAllFeatures || searchCurrentExtent
        ? portalUnit
        : this.props.aoiGeometries?.distanceUnit || this.props.searchSettings.distanceUnits || portalUnit
      //get the incident geometry
      const incidentGeometry = this.props.aoiGeometries.incidentGeometry4326 as __esri.GeometryUnion || this.props.aoiGeometries.incidentGeometry as __esri.GeometryUnion

      let distances
      this.getAllFeaturesDistance(incidentGeometry, selectedFeatures, distanceUnit)
        .then(result => {
          distances = result
          if (!distances) {
            resolve(null)
            return
          }
          const unitsAbbr = this.getSelectedUnitsAbbr(distanceUnit)
          for (let i = 0; i < selectedFeatures.length; i++) {
            const tempFeature: any = selectedFeatures[i].feature
            if (incidentGeometry && tempFeature.geometry) {
              tempFeature.distance = distances[i] as number
              const formattedDistance = this.props.intl.formatNumber(tempFeature.distance, { maximumFractionDigits: 2 }) + ' ' + unitsAbbr
              if (tempFeature.attributes) {
                //add the esriCTApproxDistance attribute in the feature
                tempFeature.attributes.esriCTApproxDistance = formattedDistance
              } else {
                tempFeature.attributes = {
                  esriCTApproxDistance: formattedDistance
                }
              }
            } else {
              tempFeature.distance = 0
            }
          }
          resolve(selectedFeatures)
        }, () => {
          resolve(null)
        })
    })
    return promise
  }

  /**
   * Get the selected units abbreviation
   * @param selectedUnit selected unit
   * @returns selected unit with abbreviation
   */
  getSelectedUnitsAbbr = (selectedUnit: string): string => {
    const distanceUnit = distanceUnitWithAbbr.find(unit => unit.value === selectedUnit)
    const selectedUnitAbbreviation = this.nls(distanceUnit.abbreviation)
    return selectedUnitAbbreviation
  }

  /**
   * Get the distance between incident geometry and each intersected feature geometry
   * @param incidentGeometry selected/drawn geometry
   * @param featureRecords intersecting feature records
   * @param distanceUnit selected distance unit
   * @returns promise of number array having distances of each intersected feature from incident geometry
   */
  getAllFeaturesDistance = async (incidentGeometry: __esri.GeometryUnion, featureRecords: FeatureDataRecord[], distanceUnit): Promise<number[]> => {
    const promise = new Promise<number[]>((resolve, reject) => {
      //if valid incident geometry found, then only proceed to get the distances
      if (incidentGeometry) {
        const intersectedGeometryJsonArray: any[] = []
        //get all the intersected geometries from the feature records
        for (let i = 0; i < featureRecords.length; i++) {
          if (featureRecords[i].feature.geometry) {
            intersectedGeometryJsonArray.push((featureRecords[i].feature.geometry as any).toJSON())
          }
        }
        if (intersectedGeometryJsonArray.length > 0) {
          let connection
          const workerUrl = `${this.props.folderUrl}dist/runtime/assets/workers/worker-distance-utils.js`
          workers.open(workerUrl)
            .then((conn) => {
              connection = conn
              // use abortController to make the worker task cancelable
              const abortController = new AbortController()
              // this.abortControllerRef.push(abortController)
              //invoke the get distance method in the worker
              const selectedGeometryJson = incidentGeometry.toJSON()
              return conn.invoke("getDistance",
                {
                  selectedGeometryJson: selectedGeometryJson,
                  intersectedGeometryJsonArray: intersectedGeometryJsonArray,
                  distanceUnit: distanceUnit
                },
                {
                  signal: abortController.signal
                })
            }).then((result) => {
              // close the connection
              connection?.close()
              connection = null
              resolve(result)
            }, (err: Error) => {
              // close the connection
              connection?.close()
              connection = null
              reject(err)
            })
        }
      } else {
        resolve([])
      }
    })
    return promise
  }

  /**
   * Get all features with geometry
   */
  getAllRecords = async () => {
    const layerInfo = this.props.layerInfo as any
    const dataSource = getSelectedLayerInstance(this.props.dsId) as FeatureLayerDataSource
    const bufferGeometry = this.props.aoiGeometries?.bufferGeometry ?? this.props.aoiGeometries?.incidentGeometry
    const { searchByLocation, searchCurrentExtent } = getSearchWorkflow(this.props.searchSettings)
    const returnGeometry = searchByLocation && !searchCurrentExtent
    let outFields
    this.props.useDataSources.forEach((dataS) => {
      if (dataS.dataSourceId === dataSource.id) {
        outFields = dataS.fields ?? []
      }
    })
    const sortField = layerInfo.analysisInfo.sortFeatures?.sortFeaturesByField
    const sortOrder = layerInfo.analysisInfo.sortFeatures?.sortFeaturesOrder
    const ids = this.featuresIds?.slice(this.state.featureItems.length, this.state.featureItems.length + 20)
    // Datasources with uniqueIdFields may not support server-side orderByFields.
    // Skip server-side sorting here; the caller is responsible for client-side sorting.
    const dsUniqueIdFields = dataSource?.getUniqueIdFields?.() ?? []
    const recordsList = await getALLFeatures(dataSource, {
      queryGeometry: bufferGeometry,
      returnGeometry,
      outSR: this.props.mapView.view.spatialReference,
      outFields,
      sortField: dsUniqueIdFields.length > 0 ? undefined : sortField,
      sortOrder: dsUniqueIdFields.length > 0 ? undefined : sortOrder,
      ids,
      whereClause: this.props.whereClause
    }) as FeatureDataRecord[]
    return recordsList
  }

  /**
   * Get limited paged features using server side sorting
   */
  getPagedRecords = async () => {
    const layerInfo = this.props.layerInfo as any
    const dataSource = getSelectedLayerInstance(this.props.dsId) as FeatureLayerDataSource
    const bufferGeometry = this.props.aoiGeometries?.bufferGeometry ?? this.props.aoiGeometries?.incidentGeometry
    const { searchByLocation, searchCurrentExtent } = getSearchWorkflow(this.props.searchSettings)
    const returnGeometry = searchByLocation && !searchCurrentExtent
    const sortField = layerInfo.analysisInfo.sortFeatures?.sortFeaturesByField
    const sortOrder = layerInfo.analysisInfo.sortFeatures?.sortFeaturesOrder
    let outFields
    this.props.useDataSources.forEach((dataS) => {
      if (dataS.dataSourceId === dataSource.id) {
        outFields = dataS.fields ?? []
      }
    })
    const start = this.state.featureItems.length
    const num = this.state.featureItems.length + 20 > (this.state.updatedFeatureCount || 0) ? (this.state.updatedFeatureCount || 0) - this.state.featureItems.length : 20
    // Skip server-side orderByFields for datasources with uniqueIdFields — they may not support it.
    const dsPagedUniqueIdFields = [...(dataSource?.getUniqueIdFields?.() ?? [])]
    const recordList = await getPagedFeatures(dataSource, {
      queryGeometry: bufferGeometry,
      returnGeometry,
      outSR: this.props.mapView.view.spatialReference,
      outFields,
      sortOrder: dsPagedUniqueIdFields.length > 0 ? undefined : sortOrder,
      sortField: dsPagedUniqueIdFields.length > 0 ? undefined : sortField,
      start,
      num,
      whereClause: this.props.whereClause
    })
    if (dsPagedUniqueIdFields.length > 0 && sortField) {
      return this.getSortedFeatures(recordList, dsPagedUniqueIdFields)
    }
    return recordList
  }

  /**
   * Build data set array for downloading individual layer export
   */
  buildDataSetArray = () => {
    const currentDsId = getOutputDsId(this.props.widgetId, this.props.analysisType, this.props.analysisId)
    const currentDs = DataSourceManager.getInstance().getDataSource(currentDsId) as FeatureLayerDataSource
    if (!currentDs) {
      return
    }
    if (this.props.analysisType === AnalysisTypeName.Summary) {
      if (this.props.dsId) {
        const dataSourceForSummaryRecords = this.allIntersectingFeatures?.[0]?.dataSource ?? currentDs
        //dataset for feature attributes
        this.pushUniqueDataSet({
          records: this.allIntersectingFeatures ?? [],
          dataSource: dataSourceForSummaryRecords,
          name: dataSourceForSummaryRecords.getLabel(),
          fields: this.getFieldsToExport(this.props.analysisId)
        })
      }
    } else if (this.props.analysisType === AnalysisTypeName.Closest) {
      // Use already-resolved closest records directly.
      // queryAll on output DS can fail for layers configured with unique id fields.
      this.pushUniqueDataSet({
        records: this.allIntersectingFeatures ?? [],
        dataSource: currentDs,
        name: currentDs.getLabel()
      })
    } else {
      //proximity dataset for feature attributes
      this.pushUniqueDataSet({
        records: this.allIntersectingFeatures ?? [],
        dataSource: currentDs,
        name: currentDs.getLabel()
      })
    }
  }

  /**
   * Push only the unique dataset
   * @param newDataSet dataset
   */
  pushUniqueDataSet = (newDataSet: DataRecordSet) => {
    const idExists = this.dataSet.some(obj => obj.dataSource.id === newDataSet.dataSource.id)
    !idExists && this.dataSet.push(newDataSet)
  }

  /**
   * Check the current config property or runtime property changed in live view
   * @param prevProps previous property
   */
  componentDidUpdate = (prevProps) => {
    //check if analysis icon config or feature count config is changed
    //accrodingly update the UI at runtime
    if (prevProps.analysisIcon !== this.props.analysisIcon ||
      prevProps.featureCount !== this.props.featureCount) {
      this.setState({
        displayAnalysisIcon: !!this.props.analysisIcon,
        displayFeatureCount: !!this.props.featureCount,
        // Reset to server count and mark as not yet corrected for a fresh query
        updatedFeatureCount: this.props.featureCount,
        isFeatureCountCorrected: false
      }, () => {
        this.updateLayerLabelWidth()
      })
    }
  }

  /**
   * calculate and update width for layer label
   */
  updateLayerLabelWidth = () => {
    let layerLabelWidth: number
    if (this.props.isListView) {
      if (this.state.displayAnalysisIcon && this.state.displayFeatureCount) {
        layerLabelWidth = 130
      } else if (!this.state.displayAnalysisIcon && !this.state.displayFeatureCount) {
        layerLabelWidth = 50
      } else if (this.state.displayAnalysisIcon && !this.state.displayFeatureCount) {
        layerLabelWidth = 80
      } else if (!this.state.displayAnalysisIcon && this.state.displayFeatureCount) {
        layerLabelWidth = 100
      }
      if (!this.state.showExportButton) {
        layerLabelWidth = layerLabelWidth - 24
      }
      this.setState({
        layerLabelWidth: 'calc(100% - ' + layerLabelWidth + 'px)'
      })
    } else {
      if (this.state.displayFeatureCount) {
        this.setState({
          layerLabelWidth: 'calc(100% - 64px) !important'
        })
      } else {
        this.setState({
          layerLabelWidth: 'calc(100% - 24px) !important'
        })
      }
    }
  }

  /**
   * toggles right/down icon click
   */
  onToggleSelectedLayer = () => {
    // to avoid toggle when click on disabled
    if (this.expandButtonRef.current.disabled) return
    this.props.canToggle && this.setState({
      isFeatureLayerOpen: !this.state.isFeatureLayerOpen,
      isIconDown: !this.state.isIconDown,
      showmaxRecordCountInfoMsg: this.handleMaxRecordCountInfoMsg()
    }, () => {
      if (this.state.featureItems.length === 0) {
        this.expandAnalysisResults()
      }
      if (this.props.onToggle) {
        this.props.onToggle(this.props.analysisId, this.state.isFeatureLayerOpen)
      }
    })
  }

  /**
   * Create symbol for the selected record in list
   */
  createMapSymbol = () => {
    const dataSource = getSelectedLayerInstance(this.props.dsId) as FeatureLayerDataSource
    let outFields
    this.props.useDataSources.forEach((dataS) => {
      if (dataS.dataSourceId === dataSource.id) {
        outFields = dataS.fields ?? []
      }
    })
    getSingleRecord(dataSource, outFields, this.props.whereClause).then((record) => {
      if (record) {
        createSymbol(record, this.symbolRef, this.nls('accessibleMapSymbolLabel'))
      }
    })
  }

  /**
   * On click of Retrieve all records button in max record count info message, retrieve all the records for the analysis and update the UI
   * @param evt event
   */
  onRetrieveAllClick = async (evt) => {
    evt?.stopPropagation()
    await this.prepareExportData(true)
  }

  /**
   * Refresh accordion content
   *
   */
  refreshAccordionContent = () => {
    this.setState({
      showmaxRecordCountInfoMsg: false
    })
    const { searchByLocation } = getSearchWorkflow(this.props.searchSettings)
    if (this.props.analysisType === AnalysisTypeName.Summary) {
      this.setState({
        featureItems: [],
        isLoading: true
      }, async () => {
        const isOutPutDsReady = this.isOutPutDsReady()
        // build output ds if it is already build to avoid issue in case of batch export click
        await this.createSummaryAnalysis(isOutPutDsReady)
      })
    } else if (searchByLocation) {
      this.highlightFeaturesOnMap(this.allIntersectingFeatures)
    }
  }

  /**
   * Render the individual Export list
   * @returns export options dropdown list
   */
  renderIndividualExportList = () => {
    const actionButton = css`
       padding-top: 7px!important;
      `
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
        <Dropdown className={'float-right mb-1'} direction='down' size='sm' title={this.nls('exportBtnTitle')}
          useKeyUpEvent toggle={this.onIndividualExportToggle} isOpen={this.state.showExportOptions}>
          <DropdownButton size='sm' arrow={false} css={actionButton} icon ref={this.dropdownRef} color='inherit'
            className='data-action-button' onClick={this.onIndividualExportToggle} type='tertiary' aria-label={this.nls('exportBtnTitle')}>
            {!this.state.isDropDownLoading && <ExportOutlined size={'m'} title={this.nls('exportBtnTitle')} />}
            {this.state.isDropDownLoading && <div css={loadingStyle} />}
          </DropdownButton>
          <DropdownMenu>
            {this.state.actionNames?.length > 0 &&
              this.state.actionNames.map(actionName => this.createActionItem(this.state.actionNamesGroups, actionName, DataLevel.Records))}
          </DropdownMenu>
        </Dropdown>
        {this.state.actionElement}
      </React.Fragment>
    )
  }

  /**
   * On action item click export the respective item
   * @param action clicked action
   * @param dataLevel data level
   */
  onActionItemClick = async (action: DataAction, dataLevel: DataLevel) => {
    const ACTIVE_CLASSNAME = 'active-data-action-item'
    const prevActive = document.querySelector(`.${ACTIVE_CLASSNAME}`)

    if (prevActive) {
      // Clean up the active className first
      prevActive.classList.remove(ACTIVE_CLASSNAME)
    }

    this.dropdownRef.current.className = classNames(this.dropdownRef.current.className, ACTIVE_CLASSNAME)
    // Execute the data action
    let actionElement = null
    let newDataSetArr = this.dataSet
    //if CSV export action is clicked then push the proximity feature count dataSet in the array
    if (action.id === 'export-csv' && this.props.analysisType === AnalysisTypeName.Proximity) {
      const currentDsId = getOutputDsId(this.props.widgetId, this.props.analysisType, this.props.analysisId)
      const proximityCountDsId = currentDsId + '_Count'
      const proximityCountDs = DataSourceManager.getInstance().getDataSource(proximityCountDsId) as FeatureLayerDataSource
      const query: FeatureLayerQueryParams = {}
      query.returnGeometry = true
      query.outFields = ['*']
      query.where = '1=1'
      const result = await proximityCountDs.queryAll(query)
      //dataset for proximity layer count
      const proximityCountDataSetArr = {
        records: result.records,
        dataSource: proximityCountDs,
        name: proximityCountDs.getLabel()
      }
      newDataSetArr = [...newDataSetArr, proximityCountDataSetArr]
    } else if ((action.id === 'export-csv' || action.id === 'export-json' || action.id === 'export-item') && this.props.analysisType === AnalysisTypeName.Summary) {
      const summaryAttributuesDataSet = await this.buildSummaryAttributeDataSet()
      newDataSetArr = [...newDataSetArr, summaryAttributuesDataSet]
    }
    actionElement = await DataActionManager.getInstance().executeDataAction(action, newDataSetArr, dataLevel, this.props.widgetId)
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
   * Build summary attribute data set for exporting summary analysis attributes in CSV export
   * @returns dataset with summary analysis attributes
   */
  buildSummaryAttributeDataSet = async (): Promise<any> => {
    const currentDsId = getOutputDsId(this.props.widgetId, this.props.analysisType, this.props.analysisId)
    const currentDs = DataSourceManager.getInstance().getDataSource(currentDsId) as FeatureLayerDataSource
    if (!currentDs) {
      return
    }
    const dsManager = DataSourceManager.getInstance()
    const query: FeatureLayerQueryParams = {}
    query.returnGeometry = true
    query.outFields = ['*']
    query.where = '1=1'
    const result = await currentDs.queryAll(query)
    const ds = await dsManager.createDataSource(Immutable({
      id: 'downloadCsv_layer' + new Date().getTime(),
      type: DataSourceTypes.FeatureLayer,
      isDataInDataSourceInstance: true,
      schema: currentDs.getSchema(),
      label: currentDs.getLabel()
    }))
    const dsJson = Object.assign(ds.getDataSourceJson())
    DataSourceManager.getInstance().updateDataSourceByDataSourceJson(ds, Immutable({ ...dsJson, exportOptions: currentDs.getExportOptions() }))
    ds.setSourceRecords(result.records)
    //dataset for statistics attributes
    return {
      records: result.records,
      dataSource: ds,
      name: currentDs.getLabel()
    }
  }

  /**
   * Build output data set for the proximity total feature count in the exported CSV
   * @param result analysis result
   * @param analysisLabel Configured analysis label
   * @param featureRecords resultant feature records
   * @param outputDS output data source
   * @param outputDsId output dataSource id
   */
  buildOutputDataSetForProximityCount = async (analysisLabel: string, featureRecords: DataRecord[], outputDS: DataSource, outputDsId: string) => {
    const layerInfo = this.props.layerInfo
    const proximityFieldsArr: __esri.FieldProperties[] = [
      {
        alias: 'OBJECTID',
        type: 'double',
        name: 'OBJECTID'
      },
      {
        alias: this.nls('layer'),
        type: 'string',
        name: 'layerName'
      },
      {
        alias: this.nls('count'),
        type: 'double',
        name: 'esriCTProximityLayerCount'
      }]
    const proximityFieldsValues: any = {}
    proximityFieldsValues.OBJECTID = 0
    proximityFieldsValues.layerName = analysisLabel
    proximityFieldsValues.esriCTProximityLayerCount = featureRecords.length
    //define dummy point geometry as for proximity analysis feature count value we don't have any geometry
    const dummyPointGeometry = {
      type: 'point',
      x: this.props.mapView?.view?.extent.center.x,
      y: this.props.mapView?.view?.extent.center.y,
      spatialReference: { wkid: this.props.mapView.view.spatialReference.wkid }
    } as __esri.GeometryUnion

    const proximityFieldsGraphic = new Graphic({
      attributes: proximityFieldsValues,
      geometry: dummyPointGeometry
    })

    const fieldsInPopupTemplate: any[] = []
    proximityFieldsArr.forEach((fields) => {
      if (fields.name) {
        fieldsInPopupTemplate.push({
          fieldName: fields.name,
          label: fields.alias
        })
      }
    })

    //create custom feature layer with all the feature count info
    const layer = new FeatureLayer({
      id: outputDsId + '_layer',
      title: outputDsId,
      fields: proximityFieldsArr,
      geometryType: 'point',
      source: [proximityFieldsGraphic],
      objectIdField: 'OBJECTID',
      popupTemplate: { //feature info widget popup title
        title: analysisLabel ?? outputDS.getLabel() ?? outputDsId,
        fieldInfos: fieldsInPopupTemplate,
        content: [{
          type: 'fields',
          fieldInfos: fieldsInPopupTemplate
        }]
      },
      visible: false,
      listMode: 'hide',
      customParameters: {
        moveFeaturesToCenterWhenPrinting: 'true'
      }
    })

    const fields: any = {}

    const proximityFieldsSchema: FieldSchema[] = [
      {
        alias: 'OBJECTID',
        type: JimuFieldType.Number,
        jimuName: 'OBJECTID',
        name: 'OBJECTID'
      },
      {
        alias: this.nls('layer'),
        type: JimuFieldType.String,
        jimuName: 'layerName',
        name: 'layerName'
      },
      {
        alias: this.nls('count'),
        type: JimuFieldType.Number,
        jimuName: 'esriCTProximityLayerCount',
        name: 'esriCTProximityLayerCount'
      }]
    proximityFieldsSchema?.forEach((fieldSchema, index) => {
      if (index === 0) {
        fields.OBJECTID = fieldSchema
      } else if (fieldSchema?.name === 'esriCTProximityLayerCount') {
        fields.esriCTProximityLayerCount = fieldSchema
      } else {
        fields[fieldSchema?.jimuName] = fieldSchema
      }
    })

    const proximityCountDsId = outputDsId + '_Count'
    const dsLabel = analysisLabel + ' (' + this.nls(layerInfo.analysisInfo.analysisType) + ' ' + this.nls('count') + ')'
    const dsManager = DataSourceManager.getInstance()
    if (dsManager.getDataSource(proximityCountDsId)) {
      dsManager.destroyDataSource(proximityCountDsId)
    }
    const ds = await dsManager.createDataSource(Immutable({
      id: proximityCountDsId,
      type: DataSourceTypes.FeatureLayer,
      isDataInDataSourceInstance: true,
      schema: {
        idField: 'OBJECTID',
        fields: fields,
        label: dsLabel
      },
      layer: layer
    }))
    const record = ds.buildRecord(proximityFieldsGraphic)
    ds.setSourceRecords([record])
    const dataSet = {
      records: [record],
      dataSource: ds,
      name: dsLabel
    }
    this.props.onUpdateProximityCountDataActionDataSet(dataSet)
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
    if (actionName === 'export' && actions?.length > 0) {
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
                  onClick={() => { this.onActionItemClick(action, dataLevel) }}
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
   * Get all the available data action
   * @returns records action promise
   */
  getAvailableActions = async () => {
    // If no records, return empty record action list
    const recordActionsPromise = DataActionManager.getInstance().getSupportedActions(this.props.widgetId, this.dataSet, DataLevel.Records)
    return Promise.all([recordActionsPromise || {}])
  }

  /**
   * Build available export options
   * @param resetDataSet When true, the dataset will be reset and rebuilt.
   */
  buildExportOptions = async (resetDataSet = false) => {
    if (resetDataSet) {
      this.dataSet.length = 0
    }
    this.setState({
      isDropDownLoading: true
    })
    try {
      if (this.dataSet.length === 0) {
        this.buildDataSetArray()
      }
      const [recordActions] = await this.getAvailableActions()
      const recordActionNames = Object.keys(recordActions)
      this.setState({
        showExportButton: (recordActions as any).export?.length,
        actionNames: recordActionNames,
        actionNamesGroups: recordActions,
        isDropDownLoading: false,
        exportProgress: 100
      })
    } catch (err) {
      console.error(err)
      this.setState({
        actionNamesGroups: {},
        isDropDownLoading: false,
        exportProgress: 100
      })
    }
  }

  /**
   * Builds output ds
   * @param evt
   */
  prepareExportData = async (shouldBuildOutputDs: boolean) => {
    const promise = new Promise<void>((resolve) => {
      this.setState({
        // Only update showRetriveAll if it's currently true; once false, it stays false
        showRetriveAll: this.state.showRetriveAll ? !shouldBuildOutputDs : this.state.showRetriveAll,
        // Dismiss the max record warning if we are successfully building the output
        showmaxRecordCountInfoMsg: shouldBuildOutputDs ? false : this.state.showmaxRecordCountInfoMsg
      }, async () => {
        if (this.props.analysisType === AnalysisTypeName.Summary) {
          const analysisLabel: string = this.props.layerInfo.label
          const analysisInfo: any = this.props.layerInfo.analysisInfo as any
          // if no summary attributes are configured then only update output ds to show export functionality
          if ((this.props.layerInfo.analysisInfo as any).summaryFields.length === 0) {
            this.updateSummaryOutputDS(analysisLabel, this.props.layerInfo.useDataSource.dataSourceId, analysisInfo.summaryFields, this.props.analysisId)
          } else {
            // if feature items are 0 means the summary analysis has not been created so create summary analysis
            this.setState({
              featureItems: [],
              isLoading: true
            }, async () => {
              await this.createSummaryAnalysis(shouldBuildOutputDs)
            })
          }
          resolve()
        } else if (shouldBuildOutputDs) {
          await this.buildOutputDs()
          resolve()
        } else {
          resolve()
        }
      })
    })
    return promise
  }

  /**
   * Check whether output data source is ready
   * @returns boolean value
   */
  isOutPutDsReady = (): boolean => {
    const outputDsId = getOutputDsId(this.props.widgetId, this.props.layerInfo.analysisInfo.analysisType, this.props.layerInfo.analysisInfo.analysisId)
    const ds = this.getOutputDataSource(outputDsId)
    const isOutputDsReady = ds && ds.getStatus() !== DataSourceStatus.NotReady
    return isOutputDsReady
  }

  /**
   * Export individual export files
   * @param evt event on toggle button click
   */
  onIndividualExportToggle = (evt) => {
    evt?.stopPropagation()
    this.setState({
      showExportOptions: !this.state.showExportOptions
    })
  }

  /**
   * Handle max record count info message display
   *
   * @returns boolean value
   */
  handleMaxRecordCountInfoMsg = () => {
    let showmaxRecordCountInfoMsg
    const isGroupFeatures = !!this.props.groupSubGroupFeaturesObj && !this.props.whereClause
    const isSubGroupFeatures = !!this.props.whereClause && !!this.props.groupSubGroupFeaturesObj
    const featuresOfGroupOrSubGroup = !this.props.groupSubGroupFeaturesObj && this.props.whereClause
    if (this.props.analysisType === AnalysisTypeName.Proximity && isGroupFeatures) {
      // Show message only if the returned feature count is less than the total found and that count exceeds the threshold.
      showmaxRecordCountInfoMsg = this.allIntersectingFeatures.length === this.state.updatedFeatureCount ? false : this.state.updatedFeatureCount > maxRecordCountThreshold
    } else if (isSubGroupFeatures || featuresOfGroupOrSubGroup) {
      // We don't show the "Max Record" message when viewing a specific subgroup breakdown.
      showmaxRecordCountInfoMsg = false
    } else {
      // Hide the message if:
      // - The total found matches the total returned (no records were cut off).
      // - OR the current list items match the total returned.
      // Otherwise, show it if the count is above the threshold.
      showmaxRecordCountInfoMsg = this.allIntersectingFeatures.length === this.state.updatedFeatureCount ? false : this.state.featureItems.length === this.state.updatedFeatureCount ? false : this.state.updatedFeatureCount > maxRecordCountThreshold
    }
    return showmaxRecordCountInfoMsg
  }

  /**
   * Get configured fields to export
   * @param analysisId analysis id
   * @returns configured fields to export
   */
  getFieldsToExport = (analysisId): string[] => {
    let configFieldsToExport: string[] = []
    const configLayersInfo = this.props.analysisSettings?.layersInfo
    const { searchByLocation } = getSearchWorkflow(this.props.searchSettings)
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

  render () {
    let styles = getLayerAccordionStyle(this.props.theme, this.state.layerLabelWidth, this.props.canToggle)
    if (!this.props.isListView) {
      styles = getCardStyle(this.props.theme, this.state.layerLabelWidth)
    }
    const title = getDisplayLabel(this.props.label, this.nls('noValueForDisplayField'))
    // const showFeaturesProgressCount = this.props.analysisType === AnalysisTypeName.Proximity && !this.props.groupSubGroupFeaturesObj && this.state.isFeatureLayerOpen && this.state.updatedFeatureCount > 500
    const showFeaturesProgressCount = false
    const formattedFeatureCount = this.props.intl.formatNumber(this.state.updatedFeatureCount, { maximumFractionDigits: 0 })
    const showmaxRecordCountInfoMsg = this.handleMaxRecordCountInfoMsg()
    // Show progress icon when export is in progress and "Retrieve All" button is not shown and where clause is not applied (not in group/subgroup level), as export is triggered only at the layer level.
    // When where clause is defined then it means the user is looking at a group/subgroup accordian of features and in that case we don't show the progress icon at group/subgroup level.
    const showProgressIcon = !this.state.showRetriveAll && this.state.exportProgress < 100 && !this.props.whereClause
    const { searchByLocation } = getSearchWorkflow(this.props.searchSettings)
    const sortByDist = (this.props.layerInfo.analysisInfo as any)?.sortFeaturesByDistance && searchByLocation
    // Disable expand when export is in progress and the features are sorted by distance or when the feature count is less than the threshold
    const disableExpand = showProgressIcon && (sortByDist || this.state.updatedFeatureCount <= maxRecordCountThreshold)
    const maxRecordInfoMsg = this.getMaxRecordInfoMsg()
    return (
      <Surface level="overlay" css={styles} style={{ border: this.props.isListView ? '' : '1px solid var(--sys-color-divider-secondary)' }} className={this.props.isListView ? 'layer-Container shadow-2 py-1 w-100' : 'layer-Container shadow-none py-0 w-100 card rounded-1'}>
        <Row flow='wrap'>
          <div tabIndex={0} className='layer-title-Container' onClick={this.onToggleSelectedLayer.bind(this)} onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                this.onToggleSelectedLayer()
              }
            }}>

            {this.props.displayMapSymbol && <div className='layer-title-map-symbol' ref={this.symbolRef}></div>}

            {this.state.displayAnalysisIcon &&
              <div className='icon'>
                <Icon size={'m'} icon={this.props.analysisIcon} />
              </div>
            }

            <div className='layer-title'>
              <Label className='title3 layer-title-label text-break' title={title}>
                {title}
              </Label>
            </div>

            {/* When retrieve all is shown then only max record count info message is displayed */}
            {showmaxRecordCountInfoMsg && this.state.showRetriveAll &&
              <Tooltip role={'tooltip'} title={maxRecordInfoMsg} tabIndex={0} showArrow placement='top' open={this.state.showMaxRecordTooltip}>
                <Button className='mx-2' aria-label={maxRecordInfoMsg} icon
                  onClick={(e) => { e?.stopPropagation(); this.setState({ showMaxRecordTooltip: !this.state.showMaxRecordTooltip }) }}
                  onMouseEnter={() => { this.setState({ showMaxRecordTooltip: true }) }}
                  onMouseLeave={() => { this.setState({ showMaxRecordTooltip: false }) }}
                  variant='text' size="default">
                  <WarningOutlined color={'var(--sys-color-warning-main)'} />
                </Button>
              </Tooltip>}

            {this.state.showRetriveAll && <div className={'float-right'}>
              <Button type='tertiary' aria-label={this.nls('retrieveAll')} color='inherit' icon title={this.nls('retrieveAll')}
                onClick={this.onRetrieveAllClick}><SelectOptionOutlined /></Button>
            </div>}

            {showProgressIcon && <div className={'float-right mr-1 mt-2'}>
              <Progress color="primary" type="circular" value={this.state.exportProgress} size={20} thickness={2} />
            </div>}

            {this.props.isListView && this.state.showExportButton && !this.state.showRetriveAll &&
              this.renderIndividualExportList()
            }
            {/* Show feature count when displayFeatureCount is true and when where calus is not applied with intersected polygon case as in that case we are not sure about the feature count until all the features are retrieved and also when the feature count is corrected or not in case of intersected polygon */}
            {this.state.displayFeatureCount && !(!this.props.whereClause && this.isReturnIntersectedPolygonsCase() && !this.state.isFeatureCountCorrected) &&
              <Label className='count mx-0' title={formattedFeatureCount}>{formattedFeatureCount}</Label>}
            {
              <Button disabled={disableExpand} ref={this.expandButtonRef} type='tertiary' color='inherit'
                className={'mr-1 toggle-button p-0'} icon aria-label={this.props.label} aria-expanded={this.state.isFeatureLayerOpen}
                onClick={(e) => {
                  e.stopPropagation()
                  this.onToggleSelectedLayer()
                }} onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    e.stopPropagation()
                    this.onToggleSelectedLayer()
                  }
                }}>
                {this.state.isIconDown && <RightOutlined size={'m'} autoFlip />}
                {!this.state.isIconDown && <DownOutlined size={'m'} />}
              </Button>}
          </div>
          {showFeaturesProgressCount && <div className='features-count-indicator'>
            <Typography className='mr-1' color="overlayHint" variant="inherit">{this.nls('featuresLabel')}: {formattedFeatureCount}</Typography>
            <Typography className='ml-1' color="overlayHint" variant="inherit">{this.nls('showingLabel')}: {this.state.featureItems.length} </Typography>
          </div>}
        </Row>
        <Collapse isOpen={this.state.isFeatureLayerOpen} className='w-100'>
          {this.state.featureItems.length > 0 && this.state.featureItems}
          {this.state.isLoading && <div className='loading-dots-primary'> <Loading type={LoadingType.DotsPrimary} /></div>}
          {this.canShowMoreFeatures &&
            <div className='show-more-button p-1 nm-border-top-color'>
              <Button type='secondary' title={this.nls('showMoreBtnTitle')} onClick={this.expandAnalysisResults}>{this.nls('showMoreBtnTitle')}</Button>
            </div>
          }
        </Collapse>
      </Surface>
    )
  }
}
