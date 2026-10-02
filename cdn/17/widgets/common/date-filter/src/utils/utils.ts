import {
  type DataSource, JSAPILayerTypes, DataSourceTypes, EsriFieldType, dateUtils, type FieldSchema, type UseDataSource
} from 'jimu-core'
import type { JimuLayerView } from 'jimu-arcgis'
import type { IMLayerConfigList, IMMapViewConfigList } from '../config'

export const VIRTUAL_LIST = [
  dateUtils.VirtualDateType.Today,
  dateUtils.VirtualDateType.Yesterday,
  dateUtils.VirtualDateType.Tomorrow,
]

// data
export const SUPPORTED_LAYER_TYPES = [
  DataSourceTypes.FeatureLayer,
  DataSourceTypes.SceneLayer,
  DataSourceTypes.BuildingComponentSubLayer,
  DataSourceTypes.OrientedImageryLayer,
  DataSourceTypes.KnowledgeGraphSublayer,
  DataSourceTypes.ImageryLayer,
  DataSourceTypes.SubtypeGroupLayer,
  DataSourceTypes.SubtypeSublayer
]

export function isSingleLayer (dsType: DataSourceTypes): boolean {
  return SUPPORTED_LAYER_TYPES.includes(dsType)
}

// map
const SUPPORTED_JSAPI_LAYER_TYPES: string[] = [
  JSAPILayerTypes.FeatureLayer,
  JSAPILayerTypes.SceneLayer,
  JSAPILayerTypes.BuildingComponentSublayer,
  JSAPILayerTypes.OrientedImageryLayer,
  JSAPILayerTypes.KnowledgeGraphSublayer,
  JSAPILayerTypes.ImageryLayer,
  JSAPILayerTypes.SubtypeSublayer
]

export function isJimuLayerViewSupported (jimuLayerView: JimuLayerView): boolean {
  if (!jimuLayerView || !jimuLayerView.type) {
      return false
    }
    // Some BuildingComponentSublayer doesn't have layer view, so need to check jimuLayerView.view here.
    const viewType = jimuLayerView.type
    const isViewPass = (viewType !== JSAPILayerTypes.BuildingComponentSublayer) || (viewType === JSAPILayerTypes.BuildingComponentSublayer && jimuLayerView.view)
    const isSupported = isViewPass && SUPPORTED_JSAPI_LAYER_TYPES.includes(viewType)
    if (!isSupported) {
      return false
    }
    // check fields
    const fields = jimuLayerView.layer.fields || jimuLayerView.layer.sourceJSON.fields
    if(!fields || fields.length === 0) {
      return null
    }
    return !!getFirstDateFieldFromEsriFields(fields)
}

export function isJimuTableSupported (tableLayer: __esri.Layer): boolean {
  if (!tableLayer || !tableLayer.type) {
    return false
  }
  // check fields
  const fields = (tableLayer as __esri.FeatureLayer).fields
  if(!fields || fields.length === 0) {
    return null
  }
  return !!getFirstDateFieldFromEsriFields(fields)
}

/**
 * Get start and end date fields from the data source. (Setting)
 * When ds is time-aware, get from time info whether there are one or two date fields
 * Otherwise, get the first date field or date-only field as startField, keep endField null.
 */
export function getStartAndEndDateFieldsFromLayerDs (ds: DataSource, checkDateFieldsCount = false): {startField: FieldSchema, endField: FieldSchema} {
  const dates = {
      startField: null,
      endField: null
    }
  if (!ds) {
    return dates
  }
  const fields = ds.getSchema().fields.asMutable({ deep: true })
  if ((ds as any).supportTime()) {
    const timeInfo = (ds as any).getTimeInfo()
    if (timeInfo?.startTimeField) { // TODO: check whether startTimeField could be null but endTimeField is set
      return {
        startField: fields[timeInfo.startTimeField],
        endField: timeInfo.endTimeField ? fields[timeInfo.endTimeField] : null
      }
    }
  }

  // if the ds has multiple date fields:
  // runtime: not apply filters in sync mode
  // setting: not set startField when ds is selected in layer-setting list
  if (checkDateFieldsCount && getDateFieldCount(ds) >= 2) {
    return dates
  }

  return {
    startField: getFirstDateField(ds),
    endField: null
  }
}

function getDateFieldCount (ds: DataSource): number {
  const dateFields = Object.values(ds.getSchema().fields).filter(field => field.esriType === EsriFieldType.Date || field.esriType === EsriFieldType.DateOnly)
  return dateFields.length
}

export function getFirstDateField (ds: DataSource): FieldSchema {
  const fields = ds.getSchema().fields // some ds does not have fields, such as group layer from map widget.
  const dateField = fields && Object.values(fields).find(field => field.esriType === EsriFieldType.Date || field.esriType === EsriFieldType.DateOnly)
  return dateField?.asMutable({ deep: true }) || null
}

function getFirstDateFieldFromEsriFields (fields: __esri.Field[]): __esri.Field {
  const dateField = fields.find(field => field.type === 'date' || field.type === 'date-only')
  return dateField || null
}

export const getUseDataSourcesFromLayerConfigList = (layerConfigList?: IMLayerConfigList): UseDataSource[] => {
  const useDss = {} // can not use array because ds could be repeated in layerConfigList for data mode.
  layerConfigList?.forEach(layerConfig => {
    const useDs = layerConfig.useDataSource
    const useDsId = useDs?.dataSourceId
    if (!useDsId) {
      return
    }

    // TODO: add fields for selection view ds.
    // const existingFields = useDss[useDsId]?.fields || []
    // const fields = [layerConfig?.startField, layerConfig?.endField].filter(Boolean)
    // const newUseDs = Object.assign({}, useDs, {
    //   ...useDs,
    //   fields: Array.from(new Set([...existingFields, ...fields]))
    // })

    useDss[useDsId] = useDs
  })
  return Object.values(useDss)
}

// get widgetJson's useDataSources from mapViewConfigList
export function getUseDataSourcesFromMapViewConfigList (mapViewConfigList: IMMapViewConfigList): UseDataSource[] {
  const useDsList: UseDataSource[] = []
  if (mapViewConfigList) {
    Object.values(mapViewConfigList).forEach(mapViewConfig => {
      if (!mapViewConfig?.customizeLayers) {
        return
      }
      useDsList.push(
        ...getUseDataSourcesFromLayerConfigList(mapViewConfig.layerConfigList)
      )
    })
  }
  return useDsList
}
