/** @jsx jsx */ // <-- make sure to include the jsx pragma
import { React, jsx, urlUtils, type IntlShape, type IMThemeVariables, type DataSource, DataSourceTypes, defaultMessages as jimuCoreDefaultMessages, type UseDataSource } from 'jimu-core'
import { AlertPopup, Checkbox, defaultMessages as jimuUIDefaultMessages, Tooltip } from 'jimu-ui'
import defaultMessages from '../translations/default'
import { InfoOutlined } from 'jimu-icons/outlined/suggested/info'
import { WarningOutlined } from 'jimu-icons/outlined/suggested/warning'
import { ThemeColorPicker } from 'jimu-ui/basic/color-picker'
import { getTheme2 } from 'jimu-theme'
import { defaultHighlightResultsColor, defaultAnalysis } from '../constants'
import { expressAddAnalysisPopperStyle } from '../lib/style'
import { getDisplayField, getSelectedLayerInstance } from '../../common/utils'
import { AnalysisTypeName, type LayersInfo, type ExpressModeAnalysisPayload } from '../../config'

interface Props {
  intl?: IntlShape
  isOpen?: boolean
  theme?: IMThemeVariables
  isActiveMapAreaSelected?: boolean
  selectedDs: string
  allFeatureLayers: DataSource[]
  layersInfoConfig: LayersInfo[]
  editedAnalysisLocalKeys?: string[]
  onClose?: () => void
  onOkClick?: (payload: ExpressModeAnalysisPayload) => void
  children?: React.ReactNode
}

interface IState {
  isAddNewAnalysisPopperActive: boolean
  isAllLayerChecked: boolean
  isAllClosestChecked: boolean
  isAllProximityChecked: boolean
  isAllSummaryChecked: boolean
  displayFeatureCount: boolean
  highlightResultsOnMap: boolean
  highlightColorOnMap: string
  expandOnOpen: boolean
  expressModeLayerAnalysis: any[]
}

export default class ExpressModeAddAnalysisPopper extends React.PureComponent<Props, IState> {
  private readonly getLocalEditedAnalysisKey = (layerDsId: string, analysisType: AnalysisTypeName): string => {
    return `${layerDsId || ''}|${analysisType || ''}`
  }

  private readonly isAnalysisEditedInEditPopup = (layerDsId: string, analysisType: AnalysisTypeName): boolean => {
    const key = this.getLocalEditedAnalysisKey(layerDsId, analysisType)
    return (this.props.editedAnalysisLocalKeys || []).includes(key)
  }

  /**
   * Indicate whether closest analysis is unavailable for the active search method.
   * @returns True when active-map-area search mode disables closest analysis.
   */
  isClosestDisabledForCurrentSearchMethod = () => {
    return !!this.props.isActiveMapAreaSelected
  }

  /**
   * Initialize popup state.
   * @param props - Component props used to initialize open state.
   */
  constructor (props) {
    super(props)
    this.state = {
      isAddNewAnalysisPopperActive: this.props.isOpen,
      isAllLayerChecked: false,
      isAllClosestChecked: false,
      isAllProximityChecked: false,
      isAllSummaryChecked: false,
      displayFeatureCount: true,
      highlightResultsOnMap: true,
      highlightColorOnMap: defaultHighlightResultsColor,
      expandOnOpen: false,
      expressModeLayerAnalysis: []
    }
  }

  /**
   * Seed popup state with default selections on the initial mount.
   */
  componentDidMount = () => {
    this.setState({
      ...this.getDefaultLayerAnalysisState(),
      ...this.getDefaultCommonSettings()
    })
  }

  /**
   * Reset popup state to defaults each time it opens and check for duplicate analyses.
   * @param prevProps - Previous component props used to detect open and layer-list changes.
   */
  componentDidUpdate = (prevProps, prevState: IState) => {
    const shouldReset = (prevProps.isOpen !== this.props.isOpen && this.props.isOpen) ||
      (this.props.isOpen && prevProps.allFeatureLayers?.length !== this.props.allFeatureLayers?.length) ||
      (this.props.isOpen && prevProps.isActiveMapAreaSelected !== this.props.isActiveMapAreaSelected)

    if (shouldReset) {
      this.setState({
        isAddNewAnalysisPopperActive: this.props.isOpen,
        ...this.getDefaultLayerAnalysisState(),
        ...this.getDefaultCommonSettings()
      })
    } else if (prevProps.isOpen !== this.props.isOpen) {
      this.setState({
        isAddNewAnalysisPopperActive: this.props.isOpen
      })
    }
  }

  /**
   * Resolve localized text for the given message id.
   * @param id - Translation key.
   * @returns Localized message text.
   */
  nls = (id: string) => {
    const messages = Object.assign({}, defaultMessages, jimuCoreDefaultMessages, jimuUIDefaultMessages)
    //for unit testing no need to mock intl we can directly use default en msg
    if (this.props.intl && this.props.intl.formatMessage) {
      return this.props.intl.formatMessage({ id: id, defaultMessage: messages[id] })
    } else {
      return messages[id]
    }
  }

  // Always open popup with default per-layer selections.
  getDefaultLayerAnalysisState = () => {
    const expressAnalysisLayersConfig = []

    this.props.allFeatureLayers?.forEach((layer) => {
      const createUseDs: UseDataSource = {
        dataSourceId: layer?.id,
        mainDataSourceId: layer?.id,
        rootDataSourceId: this.props.selectedDs
      }
      const layerObj = getSelectedLayerInstance(layer?.id) as any
      const candidateLayerInfo = {
        label: layerObj?.getLabel(),
        useDataSource: createUseDs
      }

      // Keep duplicate flags stable for the popup session and based on what Add Analysis would create on open.
      // Only Edit popup changes should affect duplicate warnings.
      // Check if configured analysis has the same default settings
      const isClosestDuplicate = (this.props.layersInfoConfig || []).some(c =>
        c?.useDataSource?.dataSourceId === candidateLayerInfo.useDataSource.dataSourceId &&
        c?.analysisInfo?.analysisType === AnalysisTypeName.Closest &&
        !this.isAnalysisEditedInEditPopup(c?.useDataSource?.dataSourceId, AnalysisTypeName.Closest) &&
        this.isDuplicateAnalysisWithDefaultSettings(c?.analysisInfo, AnalysisTypeName.Closest, candidateLayerInfo)
      )
      const isProximityDuplicate = (this.props.layersInfoConfig || []).some(c =>
        c?.useDataSource?.dataSourceId === candidateLayerInfo.useDataSource.dataSourceId &&
        c?.analysisInfo?.analysisType === AnalysisTypeName.Proximity &&
        !this.isAnalysisEditedInEditPopup(c?.useDataSource?.dataSourceId, AnalysisTypeName.Proximity) &&
        this.isDuplicateAnalysisWithDefaultSettings(c?.analysisInfo, AnalysisTypeName.Proximity, candidateLayerInfo)
      )
      const isSummaryDuplicate = (this.props.layersInfoConfig || []).some(c =>
        c?.useDataSource?.dataSourceId === candidateLayerInfo.useDataSource.dataSourceId &&
        c?.analysisInfo?.analysisType === AnalysisTypeName.Summary &&
        !this.isAnalysisEditedInEditPopup(c?.useDataSource?.dataSourceId, AnalysisTypeName.Summary) &&
        this.isDuplicateAnalysisWithDefaultSettings(c?.analysisInfo, AnalysisTypeName.Summary, candidateLayerInfo)
      )

      expressAnalysisLayersConfig.push({
        label: candidateLayerInfo.label,
        useDataSource: candidateLayerInfo.useDataSource,
        groupLabel: this.getGroupLabelForLayer(layer),
        enabled: false,
        // Duplicate analyses are shown as disabled + warning; keep all default checks off.
        closest: false,
        proximity: false,
        summary: false,
        isClosestDuplicate,
        isProximityDuplicate,
        isSummaryDuplicate
      })
    })

    return {
      expressModeLayerAnalysis: expressAnalysisLayersConfig,
      isAllLayerChecked: false,
      isAllClosestChecked: false,
      isAllProximityChecked: false,
      isAllSummaryChecked: false
    }
  }

  /**
   * Build a display label from parent group-layer names so grouped rows can be rendered in the table.
   * @param layerDs - Layer data source used to resolve parent group names.
   * @returns Slash-separated group label path.
   */
  getGroupLabelForLayer = (layerDs: DataSource): string => {
    const groupPathFromDataSource = this.getGroupPathFromDataSource(layerDs)
    if (groupPathFromDataSource.length > 0) {
      return groupPathFromDataSource.join(' / ')
    }

    const groupPathFromMapLayer = this.getGroupPathFromMapLayer(layerDs)
    return groupPathFromMapLayer.join(' / ')
  }

  /**
   * Handle variations in datasource type naming for group layers.
   * @param type - Data source type value to check.
   * @returns True when the type represents a group-layer data source.
   */
  isGroupLayerDataSourceType = (type: any): boolean => {
    const normalizedType = String(type || '').toLowerCase()
    return type === DataSourceTypes.GroupLayer ||
      type === DataSourceTypes.SubtypeGroupLayer ||
      normalizedType.includes('grouplayer') ||
      normalizedType.includes('subtypegroup')
  }

  /**
   * Extract group labels from datasource parent chain when datasource nesting is available.
   * @param layerDs - Starting layer data source.
   * @returns Group labels collected from outermost to innermost parent.
   */
  getGroupPathFromDataSource = (layerDs: DataSource): string[] => {
    const groupPath: string[] = []
    const visitedDsIds = new Set<string>()
    let parentDs = this.resolveParentDataSource(layerDs)

    while (parentDs && parentDs.id !== this.props.selectedDs) {
      // Some data source chains can be self-referencing/cyclic; stop traversal to avoid UI freeze.
      if (visitedDsIds.has(parentDs.id)) {
        break
      }
      visitedDsIds.add(parentDs.id)

      const isGroupLayer = this.isGroupLayerDataSourceType(parentDs.type)
      if (isGroupLayer) {
        const parentLabel = parentDs?.getLabel?.()
        if (parentLabel) {
          groupPath.unshift(parentLabel)
        }
      }

      const nextParentDs = this.resolveParentDataSource(parentDs)
      if (!nextParentDs || nextParentDs.id === parentDs.id) {
        break
      }
      parentDs = nextParentDs
    }

    return groupPath
  }

  /**
   * Resolve parent datasource using runtime link first, then datasource json parent ids as fallback.
   * @param ds - Data source whose parent should be resolved.
   * @returns Parent data source when available; otherwise null.
   */
  resolveParentDataSource = (ds: DataSource): DataSource => {
    const directParent = ds?.getMainDataSource?.()
    if (directParent && directParent.id !== ds?.id) {
      return directParent
    }

    const dsJson = (ds as any)?.getDataSourceJson?.()
    const parentDsId = dsJson?.parentDataSourceId || dsJson?.belongToDataSource
    if (!parentDsId || parentDsId === ds?.id) {
      return null
    }

    return getSelectedLayerInstance(parentDsId)
  }

  /**
   * Fallback: extract group labels from ArcGIS layer parent chain when datasource parent chain is flattened.
   * @param layerDs - Starting layer data source.
   * @returns Group labels collected from outermost to innermost parent.
   */
  getGroupPathFromMapLayer = (layerDs: DataSource): string[] => {
    const groupPath: string[] = []
    const visitedLayers = new Set<any>()
    let parentLayer = (layerDs as any)?.layer?.parent

    while (parentLayer) {
      if (visitedLayers.has(parentLayer)) {
        break
      }
      visitedLayers.add(parentLayer)

      if (parentLayer?.type === 'group') {
        const parentTitle = parentLayer?.title
        if (parentTitle) {
          groupPath.unshift(parentTitle)
        }
      }

      parentLayer = parentLayer?.parent
    }

    return groupPath
  }

  // Always open popup with default common settings.
  getDefaultCommonSettings = () => {
    return {
      displayFeatureCount: true,
      highlightResultsOnMap: true,
      highlightColorOnMap: defaultHighlightResultsColor,
      expandOnOpen: false
    }
  }

  // Build the combined payload for layer-specific and common analysis settings.
  getAnalysisPayload = (): ExpressModeAnalysisPayload => {
    const isClosestDisabled = this.isClosestDisabledForCurrentSearchMethod()
    const filteredLayersInfo = this.state.expressModeLayerAnalysis.map((layerInfo) => {
      const keepClosest = !isClosestDisabled && layerInfo.closest && !layerInfo.isClosestDuplicate
      const keepProximity = layerInfo.proximity && !layerInfo.isProximityDuplicate
      const keepSummary = layerInfo.summary && !layerInfo.isSummaryDuplicate
      const hasAnyAnalysisType = keepClosest || keepProximity || keepSummary

      return {
        ...layerInfo,
        closest: keepClosest,
        proximity: keepProximity,
        summary: keepSummary,
        enabled: layerInfo.enabled && hasAnyAnalysisType
      }
    })

    return {
      layersInfo: filteredLayersInfo,
      commonLayersInfo: {
        featureCount: this.state.displayFeatureCount,
        highlightResultsOnMap: this.state.highlightResultsOnMap,
        highlightColor: this.state.highlightColorOnMap,
        expandAnalysisResults: this.state.expandOnOpen
      }
    }
  }

  // Close the popup after confirming the current selections.
  onOkButtonClicked = () => {
    this.props.onClose?.()
    setTimeout(() => {
      this.props.onOkClick?.(this.getAnalysisPayload())
    }, 100)
  }

  // Close the popup without applying further changes from this dialog.
  onCancelButtonClicked = () => {
    this.props.onClose?.()
  }

  /**
   * Toggle the enabled state for every layer row from the header checkbox.
   * @param checked - True to enable all rows, false to disable all rows.
   */
  onLayerHeaderCheckBoxChange = (checked) => {
    const updatedSettings = this.state.expressModeLayerAnalysis.map((layerSetting) => ({
      ...layerSetting,
      enabled: checked
    }))
    this.setState({ expressModeLayerAnalysis: updatedSettings }, () => {
      this.updateLayerHeaderCheckBoxState()
    })
  }

  // Recompute whether all layer rows are enabled.
  updateLayerHeaderCheckBoxState = () => {
    const isAllLayerChecked = this.state.expressModeLayerAnalysis.length > 0 &&
      this.state.expressModeLayerAnalysis.every((config) => config.enabled)
    this.setState({ isAllLayerChecked })
  }

  /**
   * Toggle closest-analysis for every layer row from the header checkbox.
   * @param checked - True to check closest-analysis for all rows, false to clear it.
   */
  onClosestHeaderCheckBoxChange = (checked) => {
    if (this.isClosestDisabledForCurrentSearchMethod()) {
      return
    }

    const updatedSettings = this.state.expressModeLayerAnalysis.map((layerSetting) => ({
      ...layerSetting,
      closest: checked && !layerSetting.isClosestDuplicate
    }))
    this.setState({ expressModeLayerAnalysis: updatedSettings }, () => {
      this.updateLayerHeaderCheckBoxState()
      this.updateClosestHeaderCheckBoxState()
    })
  }

  // Recompute whether all non-duplicate layers have closest analysis enabled.
  updateClosestHeaderCheckBoxState = () => {
    const nonDuplicateRows = this.state.expressModeLayerAnalysis.filter((layerSetting) => !layerSetting.isClosestDuplicate)
    const isAllClosestChecked = nonDuplicateRows.length > 0 && nonDuplicateRows.every((layerSetting) => layerSetting.closest)
    this.setState({ isAllClosestChecked })
  }

  /**
   * Toggle proximity-analysis for every layer row from the header checkbox.
   * @param checked - True to check proximity-analysis for all rows, false to clear it.
   */
  onProximityHeaderCheckBoxChange = (checked) => {
    const updatedSettings = this.state.expressModeLayerAnalysis.map((layerSetting) => ({
      ...layerSetting,
      proximity: checked && !layerSetting.isProximityDuplicate
    }))
    this.setState({ expressModeLayerAnalysis: updatedSettings }, () => {
      this.updateLayerHeaderCheckBoxState()
      this.updateProximityHeaderCheckBoxState()
    })
  }

  // Recompute whether all non-duplicate layers have proximity analysis enabled.
  updateProximityHeaderCheckBoxState = () => {
    const nonDuplicateRows = this.state.expressModeLayerAnalysis.filter((layerSetting) => !layerSetting.isProximityDuplicate)
    const isAllProximityChecked = nonDuplicateRows.length > 0 && nonDuplicateRows.every((layerSetting) => layerSetting.proximity)
    this.setState({ isAllProximityChecked })
  }

  /**
   * Toggle summary-analysis for every layer row from the header checkbox.
   * @param checked - True to check summary-analysis for all rows, false to clear it.
   */
  onSummaryHeaderCheckBoxChange = (checked) => {
    const updatedSettings = this.state.expressModeLayerAnalysis.map((layerSetting) => ({
      ...layerSetting,
      summary: checked && !layerSetting.isSummaryDuplicate
    }))
    this.setState({ expressModeLayerAnalysis: updatedSettings }, () => {
      this.updateLayerHeaderCheckBoxState()
      this.updateSummaryHeaderCheckBoxState()
    })
  }

  // Recompute whether all non-duplicate layers have summary analysis enabled.
  updateSummaryHeaderCheckBoxState = () => {
    const nonDuplicateRows = this.state.expressModeLayerAnalysis.filter((layerSetting) => !layerSetting.isSummaryDuplicate)
    const isAllSummaryChecked = nonDuplicateRows.length > 0 && nonDuplicateRows.every((layerSetting) => layerSetting.summary)
    this.setState({ isAllSummaryChecked })
  }

  /**
   * Update the enabled state for a single layer row.
   * @param checked - New enabled state for the row.
   * @param analysisIndex - Index of the target row in expressModeLayerAnalysis.
   */
  onLayerCheckBoxChange = (checked, analysisIndex) => {
    const layerSetting = this.state.expressModeLayerAnalysis[analysisIndex]
    const updatedSettings = { ...layerSetting, enabled: checked }
    this.updateItem(analysisIndex, updatedSettings)
  }

  /**
   * Update closest-analysis state for a single layer row.
   * @param checked - New closest-analysis state for the row.
   * @param analysisIndex - Index of the target row in expressModeLayerAnalysis.
   */
  closestAnalysisStateChange = (checked, analysisIndex) => {
    if (this.isClosestDisabledForCurrentSearchMethod()) {
      return
    }

    const layerSetting = this.state.expressModeLayerAnalysis[analysisIndex]
    const updatedSettings = { ...layerSetting, closest: checked }
    this.updateItem(analysisIndex, updatedSettings, AnalysisTypeName.Closest)
  }

  /**
   * Replace one row entry and refresh the related header checkbox state.
   * @param index - Index of the row to update.
   * @param itemAttributes - Partial row attributes to merge into the existing row.
   * @param analysisType - Optional analysis type used to refresh the corresponding header checkbox.
   */
  updateItem = (index: number, itemAttributes: any, analysisType?: string) => {
    if (index > -1) {
      const mergedItem = { ...this.state.expressModeLayerAnalysis[index], ...itemAttributes }

      const analysisLayersSettings = [
        ...this.state.expressModeLayerAnalysis.slice(0, index),
        mergedItem,
        ...this.state.expressModeLayerAnalysis.slice(index + 1)
      ]

      this.setState({
        expressModeLayerAnalysis: analysisLayersSettings
      }, () => {
        this.updateLayerHeaderCheckBoxState()
        analysisType === AnalysisTypeName.Closest && this.updateClosestHeaderCheckBoxState()
        analysisType === AnalysisTypeName.Proximity && this.updateProximityHeaderCheckBoxState()
        analysisType === AnalysisTypeName.Summary && this.updateSummaryHeaderCheckBoxState()
      })
    }
  }

  /**
   * Update proximity-analysis state for a single layer row.
   * @param checked - New proximity-analysis state for the row.
   * @param analysisIndex - Index of the target row in expressModeLayerAnalysis.
   */
  proximityAnalysisStateChange = (checked, analysisIndex) => {
    const layerSetting = this.state.expressModeLayerAnalysis[analysisIndex]
    const updatedSettings = { ...layerSetting, proximity: checked }
    this.updateItem(analysisIndex, updatedSettings, AnalysisTypeName.Proximity)
  }

  /**
   * Update summary-analysis state for a single layer row.
   * @param checked - New summary-analysis state for the row.
   * @param analysisIndex - Index of the target row in expressModeLayerAnalysis.
   */
  summaryAnalysisStateChange = (checked, analysisIndex) => {
    const layerSetting = this.state.expressModeLayerAnalysis[analysisIndex]
    const updatedSettings = { ...layerSetting, summary: checked }
    this.updateItem(analysisIndex, updatedSettings, AnalysisTypeName.Summary)
  }

  /**
   * Toggle whether feature counts are shown in analysis results.
   * @param evt - Switch change event containing the checked value.
   */
  displayFeatureCountStateChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({
      displayFeatureCount: evt.target.checked
    })
  }

  /**
   * Toggle whether analysis results should be highlighted on the map.
   * @param evt - Switch change event containing the checked value.
   */
  highlightResultsOnMapOnChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({
      highlightResultsOnMap: evt.target.checked
    })
  }

  /**
   * Store the selected highlight color for map results.
   * @param color - Selected color value from the theme color picker.
   */
  onHighlightColorOnMapChange = (color: string) => {
    this.setState({
      highlightColorOnMap: color
    })
  }

  /**
   * Toggle whether result sections are expanded when opened.
   * @param evt - Switch change event containing the checked value.
   */
  expandListOnChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({
      expandOnOpen: evt.target.checked
    })
  }

  /**
   * Sort object keys recursively to make JSON comparison deterministic.
   * @param value - Input value to normalize.
   * @returns Input value with recursively sorted object keys.
   */
  getStandardJson = (value: any): any => {
    if (Array.isArray(value)) {
      return value.map((item) => this.getStandardJson(item))
    }
    if (value && typeof value === 'object') {
      return Object.keys(value).sort().reduce((result, key) => {
        result[key] = this.getStandardJson(value[key])
        return result
      }, {})
    }
    return value
  }

  /**
   * Build a stable compare key for one layer and analysis config, excluding analysisId only.
   * @param layerAnalysisInfo - Layer analysis configuration to serialize.
   * @returns Stable JSON key used for equality checks.
   */
  getComparableAnalysisJsonKey = (layerAnalysisInfo: LayersInfo): string => {
    const plainLayerAnalysisInfo: any = JSON.parse(JSON.stringify(layerAnalysisInfo || {}))
    const plainAnalysisInfo = plainLayerAnalysisInfo?.analysisInfo || {}
    delete plainAnalysisInfo.analysisId

    const comparablePayload = {
      label: plainLayerAnalysisInfo?.label || '',
      layerDsId: plainLayerAnalysisInfo?.useDataSource?.dataSourceId || '',
      analysisType: plainAnalysisInfo?.analysisType || '',
      analysisInfo: plainAnalysisInfo
    }
    return JSON.stringify(this.getStandardJson(comparablePayload))
  }

  /**
   * Build expected analysis settings for a type using template + supplied common settings.
   * For proximity, align displayField with how express-mode creation persists it.
   * @param analysisType - Analysis type to build expected settings for.
   * @param layerInfo - Candidate layer row with datasource id.
   * @param commonSettings - Common settings snapshot to apply.
   * @returns Expected analysis settings payload.
   */
  private readonly getExpectedAnalysisSettingsForCommonSettings = (
    analysisType: AnalysisTypeName,
    layerInfo: any,
    commonSettings: {
      displayFeatureCount: boolean
      highlightResultsOnMap: boolean
      highlightColorOnMap: string
      expandOnOpen: boolean
    }
  ): any => {
    const template = defaultAnalysis.find(d => d.analysisType === analysisType) || { analysisType }
    const expectedSettings: any = {
      ...template,
      displayFeatureCount: commonSettings.displayFeatureCount,
      highlightResultsOnMap: commonSettings.highlightResultsOnMap,
      highlightColorOnMap: commonSettings.highlightColorOnMap,
      expandOnOpen: commonSettings.expandOnOpen
    }

    if (analysisType === AnalysisTypeName.Proximity) {
      const layerDsId = layerInfo?.useDataSource?.dataSourceId
      const layerObj = layerDsId ? getSelectedLayerInstance(layerDsId) : null
      if (layerObj) {
        expectedSettings.displayField = getDisplayField(layerObj)
      }
    }

    return expectedSettings
  }

  /**
   * Return true when configured analysis matches expected settings for provided common settings.
   * @param configuredAnalysisInfo - Saved analysis info to compare.
   * @param analysisType - Analysis type to compare.
   * @param layerInfo - Candidate layer row used to resolve layer-specific defaults.
   * @param commonSettings - Common settings snapshot to compare against.
   * @returns True when the saved analysis has the same effective settings.
   */
  private readonly isSameAnalysisAsProvidedCommonSettings = (
    configuredAnalysisInfo: any,
    analysisType: AnalysisTypeName,
    layerInfo: any,
    commonSettings: {
      displayFeatureCount: boolean
      highlightResultsOnMap: boolean
      highlightColorOnMap: string
      expandOnOpen: boolean
    }
  ): boolean => {
    const expectedSettings = this.getExpectedAnalysisSettingsForCommonSettings(analysisType, layerInfo, commonSettings)


    for (const key of Object.keys(expectedSettings)) {

      const configuredValue = configuredAnalysisInfo?.[key]
      const expectedValue = expectedSettings[key]

      if (configuredValue === undefined) continue

      if (JSON.stringify(configuredValue) !== JSON.stringify(expectedValue)) {
        return false
      }
    }

    return true
  }

  /**
   * Adapt header layer checkbox event to the shared handler signature.
   * @param evt - Checkbox change event from the layer header control.
   */
  readonly handleLayerHeaderCheckChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
    this.onLayerHeaderCheckBoxChange(evt.target.checked)
  }

  /**
   * Adapt header closest checkbox event to the shared handler signature.
   * @param evt - Checkbox change event from the closest header control.
   */
  readonly handleClosestHeaderCheckChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
    this.onClosestHeaderCheckBoxChange(evt.target.checked)
  }

  /**
   * Adapt header proximity checkbox event to the shared handler signature.
   * @param evt - Checkbox change event from the proximity header control.
   */
  readonly handleProximityHeaderCheckChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
    this.onProximityHeaderCheckBoxChange(evt.target.checked)
  }

  /**
   * Adapt header summary checkbox event to the shared handler signature.
   * @param evt - Checkbox change event from the summary header control.
   */
  readonly handleSummaryHeaderCheckChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
    this.onSummaryHeaderCheckBoxChange(evt.target.checked)
  }

  // Return true when no effective (non-duplicate) analysis type is selected in any layer row.
  isAllAnalysisTypesOff = () => {
    return !this.state.expressModeLayerAnalysis.some((layerSetting) => {
      const hasClosest = layerSetting.closest && !layerSetting.isClosestDuplicate
      const hasProximity = layerSetting.proximity && !layerSetting.isProximityDuplicate
      const hasSummary = layerSetting.summary && !layerSetting.isSummaryDuplicate
      return hasClosest || hasProximity || hasSummary
    })
  }

  // Return true when no layer row is enabled.
  isAllLayersUnchecked = () => {
    return !this.state.expressModeLayerAnalysis.some((layerSetting) => layerSetting.enabled)
  }

  // Return true when at least one row has both layer enabled and any analysis type selected.
  hasAnyEnabledLayerWithSelectedAnalysis = () => {
    return this.state.expressModeLayerAnalysis.some((layerSetting) => {
      const hasClosest = layerSetting.closest
      const hasProximity = layerSetting.proximity
      const hasSummary = layerSetting.summary
      return layerSetting.enabled && (hasClosest || hasProximity || hasSummary)
    })
  }

  /**
   * Return true when every layer has duplicate config for the provided analysis type.
   * @param analysisType - Analysis type to evaluate.
   * @returns True when all rows are duplicates for the given analysis type.
   */
  isAllAnalysisDuplicateForType = (analysisType: AnalysisTypeName) => {
    const flagKey = analysisType === AnalysisTypeName.Closest
      ? 'isClosestDuplicate'
      : analysisType === AnalysisTypeName.Proximity
        ? 'isProximityDuplicate'
        : 'isSummaryDuplicate'
    return this.state.expressModeLayerAnalysis.length > 0 &&
      this.state.expressModeLayerAnalysis.every((layerSetting) => layerSetting[flagKey])
  }

  // Render one table row per layer, including duplicate-config warnings for checked analysis types.
  renderFeatureLayersList = () => {
    const rows: React.ReactNode[] = []
    let previousGroupLabel = ''

    this.state.expressModeLayerAnalysis?.forEach((layer, index) => {
      const rowHeaderId = `analysis-row-${index}`
      const closestWarningId = `analysis-row-${index}-closest-warning`
      const proximityWarningId = `analysis-row-${index}-proximity-warning`
      const summaryWarningId = `analysis-row-${index}-summary-warning`
      const handleLayerChange = (checked) => { this.onLayerCheckBoxChange(checked, index) }
      const handleClosestChange = (checked) => { this.closestAnalysisStateChange(checked, index) }
      const handleProximityChange = (checked) => { this.proximityAnalysisStateChange(checked, index) }
      const handleSummaryChange = (checked) => { this.summaryAnalysisStateChange(checked, index) }
      // Use flags stored at popup-open time so table state is unaffected by common-settings changes.
      const showClosestSameConfigWarning = layer.isClosestDuplicate
      const showProximitySameConfigWarning = layer.isProximityDuplicate
      const showSummarySameConfigWarning = layer.isSummaryDuplicate

      if (layer.groupLabel && layer.groupLabel !== previousGroupLabel) {
        rows.push(
          <tr key={`group-${layer.groupLabel}-${index}`} className='feature-group-row'>
            <th colSpan={4} scope='rowgroup'>
              <span className='feature-group-label' title={layer.groupLabel}>{layer.groupLabel}</span>
            </th>
          </tr>
        )
      }

      previousGroupLabel = layer.groupLabel || ''

      rows.push(<tr key={`layer-${layer.useDataSource?.dataSourceId || index}`}>
        <th id={rowHeaderId} scope='row'><Checkbox className={'cursor-pointer mr-2 ml-1 font-13'}
          aria-label={layer.label}
          checked={layer.enabled}
          onChange={evt => { handleLayerChange(evt.target.checked) }} />
          {layer.label}</th>
        <td style={{ textAlign: 'center' }}>
          <div className='analysis-cell-control' role='presentation'>
            <Checkbox className={'cursor-pointer font-13'}
              aria-label={layer.label + ' ' + this.nls('closest')}
              aria-describedby={showClosestSameConfigWarning ? closestWarningId : ''}
              checked={layer.closest && !showClosestSameConfigWarning}
              disabled={this.isClosestDisabledForCurrentSearchMethod() || showClosestSameConfigWarning}
              onChange={evt => { handleClosestChange(evt.target.checked) }} />
            {showClosestSameConfigWarning &&
              <Tooltip title={this.nls('sameConfigWarningMessage')} showArrow placement='top'>
                <div id={closestWarningId} className='analysis-warning-icon' tabIndex={0}><WarningOutlined color='var(--sys-color-warning-dark)'/></div>
              </Tooltip>
            }
          </div>
        </td>
        <td style={{ textAlign: 'center' }}>
          <div className='analysis-cell-control' role='presentation'>
            <Checkbox className={'cursor-pointer font-13'}
              aria-label={layer.label + ' ' + this.nls('proximity')}
              aria-describedby={showProximitySameConfigWarning ? proximityWarningId : ''}
              checked={layer.proximity && !showProximitySameConfigWarning}
              disabled={showProximitySameConfigWarning}
              onChange={evt => { handleProximityChange(evt.target.checked) }} />
            {showProximitySameConfigWarning &&
              <Tooltip title={this.nls('sameConfigWarningMessage')} showArrow placement='top'>
                <div id={proximityWarningId} className='analysis-warning-icon' tabIndex={0}><WarningOutlined color='var(--sys-color-warning-dark)'/></div>
              </Tooltip>
            }
          </div>
        </td>
        <td style={{ textAlign: 'center' }}>
          <div className='analysis-cell-control' role='presentation'>
            <Checkbox className={'cursor-pointer font-13'}
              aria-label={layer.label + ' ' + this.nls('summary')}
              aria-describedby={showSummarySameConfigWarning ? summaryWarningId : ''}
              checked={layer.summary && !showSummarySameConfigWarning}
              disabled={showSummarySameConfigWarning}
              onChange={evt => { handleSummaryChange(evt.target.checked) }} />
            {showSummarySameConfigWarning &&
              <Tooltip title={this.nls('sameConfigWarningMessage')} showArrow placement='top'>
                <div id={summaryWarningId} className='analysis-warning-icon' tabIndex={0}><WarningOutlined color='var(--sys-color-warning-dark)'/></div>
              </Tooltip>
            }
          </div>
        </td>
      </tr>)
    })

    return rows
  }

  /**
   * Check if configured analysis has the same default settings.
   * @param analysisInfo - Analysis info to check.
   * @param analysisType - Analysis type.
   * @param layerInfo - Layer info.
   * @returns True if the analysis has the same default settings.
   */
  private readonly isDuplicateAnalysisWithDefaultSettings = (analysisInfo: any, analysisType: AnalysisTypeName, layerInfo: any): boolean => {
    if (!analysisInfo || analysisInfo.analysisType !== analysisType) {
      return false
    }

    // Get the default common settings
    const defaultCommonSettings = this.getDefaultCommonSettings()

    // Get expected settings based on default template
    const expectedSettings = this.getExpectedAnalysisSettingsForCommonSettings(
      analysisType,
      layerInfo,
      defaultCommonSettings
    )

    // Properties to compare (exclude analysisId, analysisType, and fieldsToExport which are populated dynamically)
    const keysToCompare = Object.keys(expectedSettings).filter(key =>
      key !== 'analysisId' &&
      key !== 'analysisType' &&
      key !== 'fieldsToExport'
    )

    // Compare all expected settings with configured settings
    for (const key of keysToCompare) {
      const configuredValue = analysisInfo?.[key]
      const expectedValue = expectedSettings[key]

      // If both are undefined, consider them equal
      if (configuredValue === undefined && expectedValue === undefined) {
        continue
      }

      // Compare values using JSON stringification for deep comparison
      const configuredStr = JSON.stringify(configuredValue)
      const expectedStr = JSON.stringify(expectedValue)

      if (configuredStr !== expectedStr) {
        return false
      }
    }

    return true
  }

  // Render the express-mode add-analysis popup with default selections and warning indicators.
  render () {
    const disableClosestCheckboxes = this.isClosestDisabledForCurrentSearchMethod()
    const disableClosestParentCheckbox = disableClosestCheckboxes || this.isAllAnalysisDuplicateForType(AnalysisTypeName.Closest)
    const disableProximityParentCheckbox = this.isAllAnalysisDuplicateForType(AnalysisTypeName.Proximity)
    const disableSummaryParentCheckbox = this.isAllAnalysisDuplicateForType(AnalysisTypeName.Summary)
    const closestTooltipId = 'analysis-col-closest-tooltip'
    const proximityTooltipId = 'analysis-col-proximity-tooltip'
    const summaryTooltipId = 'analysis-col-summary-tooltip'
    const expressAddAnalysisPopperCSS = expressAddAnalysisPopperStyle()

    return <AlertPopup css={expressAddAnalysisPopperCSS} style={{ maxWidth: '970px' }}
      aria-expanded={this.state.isAddNewAnalysisPopperActive}
      isOpen={this.state.isAddNewAnalysisPopperActive && !urlUtils.getAppIdPageIdFromUrl().pageId}
      onClickOk={this.onOkButtonClicked}
      onClickClose={this.onCancelButtonClicked}
      disableOK={!this.hasAnyEnabledLayerWithSelectedAnalysis()}
      title={this.nls('addAnalysisLabel')}>
      <div className='table-wrapper'>
        <div id='analysis-popup-instruction' className='analysis-popup-instruction'>
          {this.nls('analysisPopupInstruction')}
        </div>
        <table className='feature-table' cellPadding={10} role='presentation'>
          <thead>
            <tr>
              <th id='analysis-col-layer' scope='col'>
                <div className='feature-table-header'>
                  <Checkbox className={'cursor-pointer mr-2 ml-1 font-13'}
                    aria-label={this.nls('layer')}
                    checked={this.state.isAllLayerChecked}
                    onChange={this.handleLayerHeaderCheckChange} />
                  <span className='feature-table-header-label cursor-pointer' title={this.nls('layer')}>
                    {this.nls('layer')}
                  </span>
                </div>
              </th>
              <th id='analysis-col-closest' scope='col'>
                <div className='feature-table-header has-info'>
                  <Checkbox className={'cursor-pointer mr-2 ml-1 font-13'}
                    aria-label={this.nls('closest') + ' ' + this.nls('closestAnalysisTypeTooltip')}
                    checked={this.state.isAllClosestChecked}
                    disabled={disableClosestParentCheckbox}
                    onChange={this.handleClosestHeaderCheckChange} />
                  <span className='feature-table-header-label cursor-pointer' title={this.nls('closest')}>
                    {this.nls('closest')}
                  </span>
                  <Tooltip title={this.nls('closestAnalysisTypeTooltip')} showArrow placement='top'>
                    <div className='feature-table-header-icon title3 text-default'><InfoOutlined /></div>
                  </Tooltip>
                  <span id={closestTooltipId} style={{ position: 'absolute', width: 1, height: 1, margin: -1, padding: 0, border: 0, overflow: 'hidden', clip: 'rect(0 0 0 0)', whiteSpace: 'nowrap' }}>{this.nls('closestAnalysisTypeTooltip')}</span>
                </div>
              </th>
              <th id='analysis-col-proximity' scope='col'>
                <div className='feature-table-header has-info'>
                  <Checkbox className={'cursor-pointer mr-2 ml-1 font-13'}
                    aria-label={this.nls('proximity') + ' ' + this.nls('proximityAnalysisTypeTooltip')}
                    checked={this.state.isAllProximityChecked}
                    disabled={disableProximityParentCheckbox}
                    onChange={this.handleProximityHeaderCheckChange} />
                  <span className='feature-table-header-label cursor-pointer' title={this.nls('proximity')}>
                    {this.nls('proximity')}
                  </span>
                  <Tooltip title={this.nls('proximityAnalysisTypeTooltip')} showArrow placement='top'>
                    <div className='feature-table-header-icon title3 text-default'><InfoOutlined /></div>
                  </Tooltip>
                  <span id={proximityTooltipId} style={{ position: 'absolute', width: 1, height: 1, margin: -1, padding: 0, border: 0, overflow: 'hidden', clip: 'rect(0 0 0 0)', whiteSpace: 'nowrap' }}>{this.nls('proximityAnalysisTypeTooltip')}</span>
                </div>
              </th>
              <th id='analysis-col-summary' scope='col'>
                <div className='feature-table-header has-info'>
                  <Checkbox className={'cursor-pointer mr-2 ml-1 font-13'}
                    aria-label={this.nls('summary') + ' ' + this.nls('summaryAnalysisTypeTooltip')}
                    checked={this.state.isAllSummaryChecked}
                    disabled={disableSummaryParentCheckbox}
                    onChange={this.handleSummaryHeaderCheckChange} />
                  <span className='feature-table-header-label cursor-pointer' title={this.nls('summary')}>
                    {this.nls('summary')}
                  </span>
                  <Tooltip title={this.nls('summaryAnalysisTypeTooltip')} showArrow placement='top'>
                    <div className='feature-table-header-icon title3 text-default'><InfoOutlined /></div>
                  </Tooltip>
                  <span id={summaryTooltipId} style={{ position: 'absolute', width: 1, height: 1, margin: -1, padding: 0, border: 0, overflow: 'hidden', clip: 'rect(0 0 0 0)', whiteSpace: 'nowrap' }}>{this.nls('summaryAnalysisTypeTooltip')}</span>
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            {this.renderFeatureLayersList()}
          </tbody>
        </table>
      </div>
      <div className='common-settings-table-wrapper'>
        <table className='common-table' role='presentation'>
          <colgroup>
            <col style={{ width: '55%' }} />
            <col style={{ width: '45%' }} />
          </colgroup>
          <tbody>
            <tr>
              <td>
                <div className='common-setting-item'>
                  <div className='common-setting-control'>
                    <Checkbox aria-label={this.nls('displayFeatureCountInfoTooltip')}
                      title={this.nls('displayFeatureCountLabel')} className={'cursor-pointer font-13'}
                      checked={this.state.displayFeatureCount} onChange={this.displayFeatureCountStateChange} />
                  </div>
                  <span className='common-setting-label' title={this.nls('displayFeatureCountLabel')}>{this.nls('displayFeatureCountLabel')}</span>
                  <Tooltip title={this.nls('displayFeatureCountInfoTooltip')} showArrow placement='top'>
                    <div className='title3 text-default d-inline'>
                      <InfoOutlined />
                    </div>
                  </Tooltip>
                </div>
              </td>
              <td />
            </tr>
            {!this.props.isActiveMapAreaSelected && (
              <React.Fragment>
                <tr>
                  <td>
                    <div className='common-setting-item' role='group' aria-label={this.nls('highlightResultsOnMapLabel')}>
                      <div className='common-setting-control'>
                        <Checkbox aria-label={this.nls('highlightResultsOnMapLabel')} title={this.nls('highlightResultsOnMapLabel')} className={'cursor-pointer font-13'} data-testid={'highlightResultsOnMapLabel'}
                          checked={this.state.highlightResultsOnMap} onChange={this.highlightResultsOnMapOnChange} />
                      </div>
                      <span className='common-setting-label' title={this.nls('highlightResultsOnMapLabel')}>{this.nls('highlightResultsOnMapLabel')}</span>
                    </div>
                  </td>
                  <td />
                </tr>
                {this.state.highlightResultsOnMap &&
                  <tr>
                    <td>
                      <div className='highlight-color-setting' role='group' aria-label={this.nls('highlightColorLabel')}>
                        <span className='common-setting-label' title={this.nls('highlightColorLabel')}>{this.nls('highlightColorLabel')}</span>
                        <div className='common-setting-control'>
                          <ThemeColorPicker specificTheme={getTheme2()} value={this.state.highlightColorOnMap || defaultHighlightResultsColor}
                            onChange={(color) => { this.onHighlightColorOnMapChange(color) }} />
                        </div>
                      </div>
                    </td>
                    <td />
                  </tr>
                }
              </React.Fragment>
            )}
            <tr>
              <td>
                <div className='common-setting-item' role='group' aria-label={this.nls('expandOnOpen')}>
                  <div className='common-setting-control'>
                    <Checkbox title={this.nls('expandOnOpen')} className={'cursor-pointer font-13'} data-testid={'expandOnOpen'}
                      checked={this.state.expandOnOpen} onChange={this.expandListOnChange} />
                  </div>
                  <span className='common-setting-label' title={this.nls('expandOnOpen')}>{this.nls('expandOnOpen')}</span>
                </div>
              </td>
              <td />
            </tr>
          </tbody>
        </table>
      </div>
    </AlertPopup>
  }

}