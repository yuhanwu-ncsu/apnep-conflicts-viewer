import {
  esri, privilegeUtils, ServiceManager, SessionManager, dataSourceUtils, type FeatureDataRecord,
  type DataSource, type FeatureLayerDataSource, type UseDataSource, type ImmutableArray,
  type TimezoneAPI, Immutable, DataSourceManager, type ClauseValuePair, MutableStoreManager
} from 'jimu-core'
import type { IItem } from '@esri/arcgis-rest-portal'
import {
  LayerHonorModeType, type MapViewConfig, ResponsiveType, SelectionModeType, type LayersConfig, type Suggestion,
  AlignModeType, type TableFieldsSchema, LocationType, EditModeType
} from '../../config'
import { getHonorWebmapUsedFields, isSupportedJimuLayerView, minusArray, type SupportedDataSource } from '../../utils'
import TableTemplate from 'esri/widgets/FeatureTable/support/TableTemplate'
import type { JimuLayerView, JimuMapView, JimuTable } from 'jimu-arcgis'

const dsManager = DataSourceManager.getInstance()

/**
 * Function to get suggestion list.
 * @param {string} searchText the search text
 * @param {LayersConfig} config active layer config
 * @param {DataSource} dataSource dataSource used
 * @returns {Promise<Suggestion[]>} Suggestion list
 */
export async function fetchSuggestionRecords (
  searchText: string,
  config: LayersConfig,
  dataSource: DataSource
): Promise<Suggestion[]> {
  const option = {
    searchText,
    searchFields: config?.searchFields || [],
    dataSource,
    exact: config?.searchExact
  }
  return dataSourceUtils.querySuggestions(option)
}

/**
 * Function to get timezone for api.
 * @param {any} dataSource dataSource used
 * @returns {TimezoneAPI} timezone for api
 */
export function getTimezone (dataSource): TimezoneAPI {
  return dataSourceUtils.getTimezoneAPIFromRuntime(dataSource.getTimezone())
}


export const getDsAccessibleInfo = async (url: string) => {
  if (!url) return false
  const request = esri.restRequest.request
  try {
    const info = await request(`${url}?f=json`)
    if (Object.keys(info).includes('error')) {
      return false
    } else {
      return true
    }
  } catch (err) {
    return false
  }
}

export const getIsAdvancedPermission = async (dataSource: SupportedDataSource): Promise<boolean> => {
  if (!dataSource) return false
  const layerItemInfo = await dataSource?.fetchItemInfo().then((info: IItem) => {
    return info
  }).catch(err => {
    console.error(err)
  })
  if (!layerItemInfo || !layerItemInfo.url) return false
  // user is admin/owner, or user and item are in the same update org
  // If there is no portalUrl, it means it's non-hosted (sampleServer6)
  // const portalUrl = ServiceManager.getInstance().getServerInfoByServiceUrl(layerItemInfo.url)?.owningSystemUrl
  const portalUrl = (await ServiceManager.getInstance().fetchArcGISServerInfo(layerItemInfo.url))?.owningSystemUrl
  if (!portalUrl) return false
  const sessionForItem = SessionManager.getInstance().getSessionByUrl(portalUrl)
  // If there is no session, it means there was no pop-up login
  if (!sessionForItem) return false
  const user = await sessionForItem.getUser()
  // portal:admin:updateItems: users with advanced editing privileges but without normal editing privilege
  const isAdmin = user?.role === 'org_admin'
  const isOrgItem = layerItemInfo?.isOrgItem
  const hasUpdateItems = (user?.privileges || []).includes('portal:admin:updateItems')
  const allowAdminEdit = isAdmin && isOrgItem && hasUpdateItems
  const isOwner = layerItemInfo.owner === user?.username
  const isInUpdatedGroup = await privilegeUtils.isItemInTheUpdatedGroup(layerItemInfo.id, sessionForItem)
  return allowAdminEdit || isOwner || isInUpdatedGroup
}

export const getFieldEditable = (layerDefinition, jimuName: string) => {
  const fieldsConfig = layerDefinition?.fields || []
  const orgField = fieldsConfig.find(config => config.name === jimuName)
  const fieldEditable = orgField ? orgField?.editable : true
  return fieldEditable
}

export const idsArrayEquals = (selection: ImmutableArray<string> | string[], preSelection: ImmutableArray<string> | string[]) => {
  return Array.isArray(selection) &&
    Array.isArray(preSelection) &&
    selection.length === preSelection.length &&
    selection.every((v, i) => preSelection[i] === v)
}

// https://devtopia.esri.com/WebGIS/arcgis-js-api/blob/4master/esri/intl/date.ts#L241
const dateFormatJSONMap = {
  shortDate: 'short-date',
  shortDateShortTime: 'short-date-short-time',
  shortDateShortTime24: 'short-date-short-time-24',
  shortDateLongTime: 'short-date-long-time',
  shortDateLongTime24: 'short-date-long-time-24',
  shortDateLE: 'short-date-le',
  shortDateLEShortTime: 'short-date-le-short-time',
  shortDateLEShortTime24: 'short-date-le-short-time-24',
  shortDateLELongTime: 'short-date-le-long-time',
  shortDateLELongTime24: 'short-date-le-long-time-24',
  longMonthDayYear: 'long-month-day-year',
  longMonthDayYearShortTime: 'long-month-day-year-short-time',
  longMonthDayYearShortTime24: 'long-month-day-year-short-time-24',
  longMonthDayYearLongTime: 'long-month-day-year-long-time',
  longMonthDayYearLongTime24: 'long-month-day-year-long-time-24',
  dayShortMonthYear: 'day-short-month-year',
  dayShortMonthYearShortTime: 'day-short-month-year-short-time',
  dayShortMonthYearShortTime24: 'day-short-month-year-short-time-24',
  dayShortMonthYearLongTime: 'day-short-month-year-long-time',
  dayShortMonthYearLongTime24: 'day-short-month-year-long-time-24',
  longDate: 'long-date',
  longDateShortTime: 'long-date-short-time',
  longDateShortTime24: 'long-date-short-time-24',
  longDateLongTime: 'long-date-long-time',
  longDateLongTime24: 'long-date-long-time-24',
  longMonthYear: 'long-month-year',
  shortMonthYear: 'short-month-year',
  year: 'year'
}

const camelToSnake = (str: string) => {
  return dateFormatJSONMap[str] || str
}

export const constructTableTemplate = (
  dataSource, curLayerConfig: LayersConfig, usedConfig,
  tableShowColumns: ClauseValuePair[], attributeTableTemplate, configChange?: boolean
) => {
  const allFieldsSchema = dataSource?.getSchema()
  const allFields = allFieldsSchema?.fields ? Object.values(allFieldsSchema?.fields) : []
  const layerDefinition = (dataSource as FeatureLayerDataSource)?.getLayerDefinition()
  const { columnSetting } = usedConfig || {}
  const { layerHonorMode, isFreezeFields, frozenFields, freezeLocation } = curLayerConfig
  const fieldColumnAttr = columnSetting?.responsiveType === ResponsiveType.Fit
    ? { autoWidth: true, textAlign: columnSetting?.textAlign ?? AlignModeType.Start, textWrap: columnSetting?.wrapText ?? false }
    : { autoWidth: false, width: columnSetting?.columnWidth || 200,
      textWrap: columnSetting?.wrapText ?? false, textAlign: columnSetting?.textAlign ?? AlignModeType.Start
    }
  const curColumns = tableShowColumns ? tableShowColumns.map(col => { return { jimuName: col.value } }) : curLayerConfig.tableFields.filter(item => item.visible)
  const invisibleColumns = minusArray(allFields, curColumns).map(item => {
    return item.jimuName
  })
  // sort fields
  const queryParams = dataSource?.getCurrentQueryParams()
  const sortFieldsArray = queryParams?.orderByFields || []
  const sortFields = {}
  sortFieldsArray.forEach((item, index) => {
    const fieldSort = item.split(' ')
    sortFields[fieldSort[0]] = { direction: fieldSort[1]?.toLowerCase(), initialSortPriority: index }
  })
  // For dataview, need to merge its sorting information into default
  let tableTemplate: __esri.TableTemplate
  const isHonorWebmap = layerHonorMode === LayerHonorModeType.Webmap
  const isHonorTableSettings = layerHonorMode === LayerHonorModeType.MapTable
  const isCustomSettings = layerHonorMode === LayerHonorModeType.Custom
  const newColumnTemplates = []
  let freezeColumnTemplate
  const { hasPopup, honorUsedFields, layerDefaultFields } = getHonorWebmapUsedFields(dataSource)
  if (isHonorWebmap || (isHonorTableSettings && !attributeTableTemplate)) {
    if (hasPopup) {
      layerDefaultFields.forEach(item => {
        const itemKey = item.jimuName || item.name
        const isFrozen = isFreezeFields && frozenFields?.includes(itemKey)
        const freezeBegin = !freezeLocation || freezeLocation === LocationType.Beginning
        const columnTemplate = {
          ...item,
          ...fieldColumnAttr,
          type: 'field',
          fieldName: itemKey,
          label: item.alias || item.name,
          editable: getFieldEditable(layerDefinition, itemKey),
          visible: honorUsedFields.some(attrItem => attrItem.fieldName === itemKey),
          format: item.format
            ? {
              ...item.format,
              ...(item.format?.dateFormat ? { dateFormat: camelToSnake(item.format.dateFormat) } : {})
            }
            : null,
          ...(sortFields[itemKey] ? sortFields[itemKey] : {}),
          ...(isFrozen ? (freezeBegin ? { frozen: true } : { frozenToEnd: true }) : {})
        }
        if (isFrozen) {
          freezeColumnTemplate = columnTemplate
        } else {
          newColumnTemplates.push(columnTemplate)
        }
      })
      // sort by popup
      newColumnTemplates.sort((a, b) => {
        const aIndex = honorUsedFields.findIndex(item => item.fieldName === a.fieldName)
        const bIndex = honorUsedFields.findIndex(item => item.fieldName === b.fieldName)
        if (aIndex === -1) return 1
        if (bIndex === -1) return -1
        return aIndex - bIndex
      })
      if (freezeColumnTemplate) {
        const freezeColIsBeginning = !freezeLocation || freezeLocation === LocationType.Beginning
        freezeColIsBeginning ? newColumnTemplates.unshift(freezeColumnTemplate) : newColumnTemplates.push(freezeColumnTemplate)
      }
    } else {
      honorUsedFields.forEach(item => {
        const itemKey = item.jimuName || item.name
        const isFrozen = isFreezeFields && frozenFields?.includes(itemKey)
        const freezeBegin = !freezeLocation || freezeLocation === LocationType.Beginning
        const columnTemplate = {
          ...item,
          ...fieldColumnAttr,
          type: 'field',
          fieldName: itemKey,
          label: item.alias || item.name,
          editable: getFieldEditable(layerDefinition, itemKey),
          visible: true,
          format: item.format
            ? {
              ...item.format,
              ...(item.format?.dateFormat ? { dateFormat: camelToSnake(item.format.dateFormat) } : {})
            }
            : null,
          ...(sortFields[itemKey] ? sortFields[itemKey] : {}),
          ...(isFrozen ? (freezeBegin ? { frozen: true } : { frozenToEnd: true }) : {})
        }
        if (isFrozen) {
          freezeColumnTemplate = columnTemplate
        } else {
          newColumnTemplates.push(columnTemplate)
        }
      })
      if (freezeColumnTemplate) {
        const freezeColIsBeginning = !freezeLocation || freezeLocation === LocationType.Beginning
        freezeColIsBeginning ? newColumnTemplates.unshift(freezeColumnTemplate) : newColumnTemplates.push(freezeColumnTemplate)
      }
    }
    tableTemplate = new TableTemplate({
      columnTemplates: newColumnTemplates
    })
  } else if (isCustomSettings) {
    curLayerConfig.tableFields.forEach(item => {
      const itemKey = item.jimuName || item.name
      const isArcadeField = dataSource?.isArcadeField?.(itemKey)
      const newItem = isArcadeField ? item : allFieldsSchema?.fields?.[itemKey]
      const isFrozen = isFreezeFields && frozenFields?.includes(itemKey)
      const freezeBegin = !freezeLocation || freezeLocation === LocationType.Beginning
      const columnTemplate = {
        format: newItem?.format
          ? {
            ...item.format,
            ...(item.format?.dateFormat ? { dateFormat: camelToSnake(item.format.dateFormat) } : {})
          }
          : null,
        type: isArcadeField ? 'column' : 'field',
        ...fieldColumnAttr,
        fieldName: itemKey,
        ...(isArcadeField ? { icon: 'lock' } : {}),
        label: newItem?.alias,
        editable: getFieldEditable(layerDefinition, itemKey) && item?.editAuthority,
        visible: configChange ? item.visible : invisibleColumns.indexOf(itemKey) < 0,
        ...(sortFields[itemKey] ? sortFields[itemKey] : {}),
        ...(isFrozen ? (freezeBegin ? { frozen: true } : { frozenToEnd: true }) : {}),
        ...(isArcadeField ? {
          formatFunction: ({ feature }) => {
            const component = document.createElement('div')
            const record = dataSource.buildRecord(feature) as FeatureDataRecord
            record?.resolveArcadeFieldValue?.(itemKey).then(res => {
              // TODO res type: string | number | Date
              component.innerHTML = res as any
            })
            return component
          }
        } : {}),
      }
      if (isFrozen) {
        freezeColumnTemplate = columnTemplate
      } else {
        newColumnTemplates.push(columnTemplate)
      }
    })
    if (freezeColumnTemplate) {
      const freezeColIsBeginning = !freezeLocation || freezeLocation === LocationType.Beginning
      freezeColIsBeginning ? newColumnTemplates.unshift(freezeColumnTemplate) : newColumnTemplates.push(freezeColumnTemplate)
    }
    tableTemplate = new TableTemplate({
      columnTemplates: newColumnTemplates
    })
  } else if (isHonorTableSettings && attributeTableTemplate) {
    const { attributeTableElements, orderByFields } = attributeTableTemplate
    const attrSortFieldsArray = orderByFields || []
    const attrSortFields = {}
    attrSortFieldsArray.forEach((item, index) => {
      attrSortFields[item.field] = { direction: item.order, initialSortPriority: index }
    })
    layerDefaultFields.forEach(item => {
      const itemKey = item.jimuName || item.name
      const isFrozen = isFreezeFields && frozenFields?.includes(itemKey)
      const freezeBegin = !freezeLocation || freezeLocation === LocationType.Beginning
      const columnTemplate = {
        ...item,
        ...fieldColumnAttr,
        type: 'field',
        fieldName: itemKey,
        label: item.alias || item.name,
        editable: getFieldEditable(layerDefinition, itemKey),
        visible: attributeTableElements.some(attrItem => attrItem.fieldName === itemKey),
        format: item.format
          ? {
            ...item.format,
            ...(item.format?.dateFormat ? { dateFormat: camelToSnake(item.format.dateFormat) } : {})
          }
          : null,
        ...(attrSortFields[itemKey] ? attrSortFields[itemKey] : {}),
        ...(isFrozen ? (freezeBegin ? { frozen: true } : { frozenToEnd: true }) : {})
      }
      if (isFrozen) {
        freezeColumnTemplate = columnTemplate
      } else {
        newColumnTemplates.push(columnTemplate)
      }
    })
    // sort by attributeTableElements
    newColumnTemplates.sort((a, b) => {
      const aIndex = attributeTableElements.findIndex(item => item.fieldName === a.fieldName)
      const bIndex = attributeTableElements.findIndex(item => item.fieldName === b.fieldName)
      if (aIndex === -1) return 1
      if (bIndex === -1) return -1
      return aIndex - bIndex
    })
    if (freezeColumnTemplate) {
      const freezeColIsBeginning = !freezeLocation || freezeLocation === LocationType.Beginning
      freezeColIsBeginning ? newColumnTemplates.unshift(freezeColumnTemplate) : newColumnTemplates.push(freezeColumnTemplate)
    }
    tableTemplate = new TableTemplate({
      columnTemplates: newColumnTemplates
    })
  }
  return tableTemplate
}

/**
 * Function to construct layer config from dataSource.
 * @param {DataSource} currentDs used dataSource
 * @param {boolean} isMapMode table widget is map mode
 * @param {(dsId: string) => string} getNewConfigId method to get config id in layer mode
 * @returns {LayersConfig} layer config
 */
export const constructConfig = (currentDs: DataSource, isMapMode?: boolean,
  getNewConfigId?: (dsId: string) => string, parentViewId?: string
): LayersConfig => {
  const allFields = currentDs.getSchema()
  const layerDefinition = (currentDs as FeatureLayerDataSource)?.getLayerDefinition()
  const allFieldsDetails = allFields?.fields ? Object.values(allFields?.fields) : []
  const fieldsConfig = layerDefinition?.fields || []
  let initTableFields = allFieldsDetails.map(item => {
    const orgField = fieldsConfig.find(field => field.name === item.jimuName)
    const defaultAuthority = orgField?.editable
    return { ...item, editAuthority: defaultAuthority, editable: defaultAuthority, visible: true }
  })
  // Field-maps setting is initially selected by default if the map has field-maps setting
  const popupSetting = (currentDs as FeatureLayerDataSource)?.getPopupInfo()?.fieldInfos
  // const popupSetting = (selectedDs as FeatureLayerDataSource)?.layer?.formTemplate?.elements
  if (currentDs.dataViewId !== 'output' && popupSetting && popupSetting?.length > 0) {
    const popupVisibleFieldNames = []
    popupSetting.forEach(item => {
      if (item?.visible) {
        popupVisibleFieldNames.push(item.fieldName)
      }
    })
    initTableFields = initTableFields.filter(
      item => popupVisibleFieldNames.includes(item.name)
    )
  }
  // If there are too many columns, only the first 50 columns will be displayed by default
  if (initTableFields?.length > 50) {
    initTableFields = initTableFields.slice(0, 50)
  }
  // save the fields they used in its `useDataSource.fields`
  const useDataSource = {
    dataSourceId: currentDs.id,
    mainDataSourceId: currentDs.getMainDataSource()?.id,
    dataViewId: currentDs.dataViewId,
    rootDataSourceId: currentDs.getRootDataSource()?.id
  } as UseDataSource
  const currentIMUseDs = Immutable(useDataSource)
  const usedFields = initTableFields.map(f => f.jimuName)
  const curIMUseDsWithFields = currentIMUseDs.set('fields', usedFields)
  const configId = isMapMode ? currentDs.id : (getNewConfigId ? getNewConfigId(currentDs.id) : currentDs.id)
  const layerItem: LayersConfig = {
    id: configId,
    name: currentDs.getLabel(),
    useDataSource: curIMUseDsWithFields.asMutable({ deep: true }),
    allFields: allFieldsDetails,
    tableFields: initTableFields,
    enableAttachments: false,
    enableEdit: false,
    allowCsv: false,
    enableSearch: false,
    searchFields: [],
    enableRefresh: true,
    enableShowHideColumn: true,
    enableSelect: true,
    enableDelete: false,
    selectMode: SelectionModeType.Single,
    editMode: EditModeType.Single,
    showCount: true,
    headerFontSetting: {
      backgroundColor: '',
      fontSize: 14,
      bold: false,
      color: ''
    },
    columnSetting: {
      responsiveType: ResponsiveType.Fixed,
      columnWidth: 200,
      wrapText: false,
      textAlign: AlignModeType.Start
    },
    layerHonorMode: LayerHonorModeType.Webmap,
    parentViewId
  }
  return layerItem
}

export const getAllMapLayersConfig = async (
  mapViewConfig: MapViewConfig,
  jimuMapView: JimuMapView,
  widgetId: string,
  onLayersConfigChange: (layersConfig: LayersConfig[]) => void
) => {
  if (!jimuMapView) return []
  const mapLayersConfig = []
  // ensure we can get jimuTables
  await jimuMapView.whenJimuMapViewLoaded()
  const jimuLayerViews = jimuMapView.getAllJimuLayerViews()
  const jimuTables = jimuMapView.getJimuTables()
  const jimuLayerViewConfigIds = jimuLayerViews.map(jimuLayerView => {
    const prefixIndex = jimuLayerView.id.indexOf('-')
    return prefixIndex > -1 ? jimuLayerView.id.substring(prefixIndex + 1) : jimuLayerView.id
  })
  const jimuTableConfigIds = jimuTables.map(jimuTable => {
    const prefixIndex = jimuTable.id.indexOf('-')
    return prefixIndex > -1 ? jimuTable.id.substring(prefixIndex + 1) : jimuTable.id
  })
  const fallbackOrderIds = [...jimuLayerViewConfigIds, ...jimuTableConfigIds]
  const { layersConfig = Immutable([]) as ImmutableArray<LayersConfig>, customJimuLayerViewIds = [], customizeLayers, displayRuntimeLayers = true } = mapViewConfig || {}
  // layerViewId is like 'widget_8-dataSource_1-18cae7226c6-layer-6'
  // layerConfig id is like 'dataSource_1-18cae7226c6-layer-6'
  if (jimuLayerViews.length === 0) {
    MutableStoreManager.getInstance().updateStateValue(widgetId, 'runtimeTableObj', {})
  }
  // all layers are invisible
  const allInvisible = jimuLayerViews.every(jimuLayerView => {
    const layerViewId = jimuLayerView.id
    const isFromRunTime = jimuLayerView.fromRuntime
    const isLayerVisible = isFromRunTime && jimuLayerView?.layer?.listMode === 'hide' ? false : jimuLayerView.isLayerVisible()
    const shouldShow = customizeLayers ? customJimuLayerViewIds.includes(layerViewId) : isLayerVisible
    return !shouldShow
  })
  if ((jimuLayerViews.length === 0 || allInvisible) && jimuTables.length === 0) {
    onLayersConfigChange([])
  }

  const runtimeTableObj = {}
  MutableStoreManager.getInstance().updateStateValue(widgetId, 'runtimeTableObj', {})

  const layerViewResults = await Promise.allSettled(jimuLayerViews.map(async (jimuLayerView) => {
    const result = await getLayersConfigFromJimuLayerView(
      jimuLayerView,
      displayRuntimeLayers,
      customizeLayers,
      customJimuLayerViewIds,
      layersConfig
    )
    return { jimuLayerView, result }
  }))

  layerViewResults.forEach(item => {
    if (item.status === 'rejected') {
      console.error(item.reason)
      return
    }
    const { jimuLayerView, result } = item.value
    if (!result) return
    const { isFromRuntime, layersConfig: newLayersConfig } = result || {}
    if (isFromRuntime) {
      const isLayerVisible = jimuLayerView.isLayerVisible()
      const layerHide = jimuLayerView?.layer?.listMode === 'hide' || !isLayerVisible
      if (layerHide) {
        if (runtimeTableObj[newLayersConfig.id]) delete runtimeTableObj[newLayersConfig.id]
      } else {
        runtimeTableObj[newLayersConfig.id] = newLayersConfig
      }
    } else if (newLayersConfig) {
      mapLayersConfig.push(newLayersConfig)
    }
  })

  const tableResults = await Promise.allSettled(jimuTables.map(async (jimuTable) => {
    return getLayersConfigFromJimuTable(
      jimuTable,
      jimuMapView,
      customizeLayers,
      customJimuLayerViewIds,
      layersConfig
    )
  }))

  tableResults.forEach(item => {
    if (item.status === 'rejected') {
      console.error(item.reason)
      return
    }
    if (item.value) {
      mapLayersConfig.push(item.value)
    }
  })

  MutableStoreManager.getInstance().updateStateValue(widgetId, 'runtimeTableObj', { ...runtimeTableObj })
  sortMapLayersConfig(mapLayersConfig, layersConfig, fallbackOrderIds)
  onLayersConfigChange([...mapLayersConfig])
}

async function getLayersConfigFromJimuLayerView (
  jimuLayerView: JimuLayerView,
  displayRuntimeLayers: boolean,
  customizeLayers: boolean,
  customJimuLayerViewIds: string[],
  layersConfig: ImmutableArray<LayersConfig>
) {
  const layerViewId = jimuLayerView.id
  const layerInvalid = !isSupportedJimuLayerView(jimuLayerView)
  if (layerInvalid) return null
  const { layerDataSourceId } = jimuLayerView
  // sync: Use layer's visible; not sync: Judging by the whitelist
  const isFromRunTime = jimuLayerView?.fromRuntime
  const isLayerVisible = jimuLayerView.isLayerVisible()
  const needToConfigRuntime = displayRuntimeLayers && isFromRunTime
  // update runtime layer config to runtimeTableObj
  if (needToConfigRuntime) {
    let layerDs = jimuLayerView?.getLayerDataSource() || dsManager.getDataSource(layerDataSourceId)
    if (!layerDs) {
      try {
        layerDs = await jimuLayerView.createLayerDataSource()
      } catch (error) {
        // some data have layer but no ds: like kg
        return { isFromRuntime: true, layersConfig: null }
      }
    }
    // imagery layer with no field information
    const allFieldsSchema = layerDs?.getSchema()
    if (!layerDs || !allFieldsSchema?.fields) return
    const newRuntimeLayerConfigItem = constructConfig(layerDs, true, undefined, jimuLayerView.jimuMapViewId)
    return { isFromRuntime: true, layersConfig: newRuntimeLayerConfigItem }
  }

  const shouldShow = customizeLayers ? customJimuLayerViewIds.includes(layerViewId) : isLayerVisible
  if (!shouldShow) return { isFromRuntime: false, layersConfig: null }
  const prefixIndex = layerViewId.indexOf('-')
  const layerViewConfigId = layerViewId.substring(prefixIndex + 1)
  const haveLayerConfig = layersConfig.find(item => item.id === layerViewConfigId)
  // When the setting config is available, use the runtime field information and other config.
  // When there is no setting config, use the ds of runtime to create a new config directly.
  let layerDs = jimuLayerView?.getLayerDataSource() || dsManager.getDataSource(layerDataSourceId)
  if (!layerDs) {
    try {
      layerDs = await jimuLayerView.createLayerDataSource()
    } catch (error) {
      // some data have layer but no ds: like kg
      return { isFromRuntime: false, layersConfig: null }
    }
  }
  // imagery layer with no field information
  const allFieldsSchema = layerDs?.getSchema()
  if (!layerDs || !allFieldsSchema?.fields) return
  // const isShowOrAddToMap = layerViewId.includes(SHOW_ON_MAP_DATA_ID_PREFIX) || layerViewId.includes(ADD_TO_MAP_DATA_ID_PREFIX)
  const newLayerConfigItem = constructConfig(layerDs, true, undefined, jimuLayerView.jimuMapViewId)
  if (haveLayerConfig) {
    // If the information related to ds changes, the latest config is used.
    const diffArray = minusArray(newLayerConfigItem.allFields, haveLayerConfig.allFields)
    if (diffArray.length !== 0) {
      const newLayerConfig = {
        ...haveLayerConfig,
        name: newLayerConfigItem.name,
        useDataSource: newLayerConfigItem.useDataSource,
        allFields: newLayerConfigItem.allFields,
        tableFields: newLayerConfigItem.tableFields
      }
      return { isFromRuntime: false, layersConfig: newLayerConfig }
    } else {
      return { isFromRuntime: false, layersConfig: haveLayerConfig }
    }
  } else {
    // no 'haveLayerConfig', indicate it’s a new config from runtime
    return { isFromRuntime: false, layersConfig: newLayerConfigItem }
  }
}

async function getLayersConfigFromJimuTable (
  jimuTable: JimuTable,
  jimuMapView: JimuMapView,
  customizeLayers: boolean,
  customJimuLayerViewIds: string[],
  layersConfig: ImmutableArray<LayersConfig>
) {
  const oriTable = jimuTable.table
  const tableLayerId = jimuTable.id
  const { visible: originalLayerVisible } = oriTable
  const layerDataSourceId = jimuMapView.getDataSourceIdByAPILayer(oriTable)
  // sync: Use layer's visible; not sync: Judging by the whitelist
  const shouldShow = customizeLayers ? customJimuLayerViewIds.includes(tableLayerId) : originalLayerVisible
  if (!shouldShow) return
  const prefixIndex = tableLayerId.indexOf('-')
  const tableLayerConfigId = tableLayerId.substring(prefixIndex + 1)
  const haveLayerConfig = layersConfig.find(item => item.id === tableLayerConfigId)
  const tableDs = dsManager.getDataSource(layerDataSourceId)
  const mapDs = jimuMapView.getMapDataSource()
  let layerDs = tableDs
  if (!tableDs && mapDs) {
    try {
      layerDs = await mapDs.createDataSourceByLayer(oriTable)
    } catch (error) {
      return
    }
  }
  if (!layerDs) return
  const newLayerConfigItem = constructConfig(layerDs, true)
  if (haveLayerConfig) {
    // If the information related to ds changes, the latest config is used.
    const diffArray = minusArray(newLayerConfigItem.allFields, haveLayerConfig.allFields)
    if (diffArray.length !== 0) {
      const newLayerConfig = {
        ...haveLayerConfig,
        name: newLayerConfigItem.name,
        useDataSource: newLayerConfigItem.useDataSource,
        allFields: newLayerConfigItem.allFields,
        tableFields: newLayerConfigItem.tableFields
      }
      return newLayerConfig
    } else {
      return haveLayerConfig
    }
  } else {
    // no 'haveLayerConfig', indicate it’s a new config from runtime
    return newLayerConfigItem
  }
}

function sortMapLayersConfig (
  mapLayersConfig: LayersConfig[],
  layersConfig: ImmutableArray<LayersConfig>,
  fallbackOrderIds: string[] = []
) {
  const configLayerIds = layersConfig?.length > 0 ? layersConfig.map(item => item.id) : []
  const fallbackOrderMap = new Map(fallbackOrderIds.map((id, index) => [id, index]))
  const getLayerOrder = (layerId: string) => {
    const configIndex = configLayerIds.indexOf(layerId)
    if (configIndex > -1) {
      return { group: 0, index: configIndex }
    }
    const fallbackIndex = fallbackOrderMap.has(layerId) ? fallbackOrderMap.get(layerId) : Number.MAX_SAFE_INTEGER
    return { group: 1, index: fallbackIndex }
  }

  mapLayersConfig.sort((a, b) => {
    const aOrder = getLayerOrder(a.id)
    const bOrder = getLayerOrder(b.id)
    if (aOrder.group !== bOrder.group) {
      return aOrder.group - bOrder.group
    }
    if (aOrder.index !== bOrder.index) {
      return aOrder.index - bOrder.index
    }
    return (a.name || a.id).localeCompare(b.name || b.id)
  })

  return mapLayersConfig
}

export const getTableColumnsFields = (usedColumns: any[], tableFields?: TableFieldsSchema[]): { columnsAllFields: ClauseValuePair[], columnsVisibleFields: ClauseValuePair[] } => {
  const columnsAllFields: ClauseValuePair[] = []
  const columnsVisibleFields: ClauseValuePair[] = []
  usedColumns?.forEach(item => {
    const columnValue = item.name || item.fieldName
    const columnLabel = item.effectiveLabel || item.alias || item.fieldName
    columnsAllFields.push({
      value: columnValue,
      label: columnLabel
    })
    const tableField = tableFields?.find(field => field.jimuName === columnValue || field.name === columnValue)
    const isVisible = tableField ? tableField.visible : !item.hidden
    if (isVisible) {
      columnsVisibleFields.push({
        value: columnValue,
        label: columnLabel
      })
    }
  })
  return { columnsAllFields, columnsVisibleFields }
}
