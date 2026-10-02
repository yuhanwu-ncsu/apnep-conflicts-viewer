import type { GeometryType } from '@esri/arcgis-rest-request'
import { type DataSourceJson, type DataSourceSchema, DataSourceTypes, type DateTimeFieldFormatProperties, dateUtils, EsriFieldType, type IMDataSourceSchema, type IntlShape, JimuFieldType } from 'jimu-core'
import defaultMessages from './translations/default'

const DATE_TIME_DEFAULT_ESRI_FORMAT = dateUtils.DATE_TIME_DEFAULT_ESRI_FORMAT as DateTimeFieldFormatProperties
export enum Operations {
  CREATE = 'CREATE',
  ADD = 'ADD',
  DELETE = 'DELETE',
  UPDATE = 'UPDATE',
  CLEAR = 'CLEAR',
  REFRESH = 'REFRESH'
}
const IdSchema = {
  jimuName: 'OBJECTID',
  name: 'OBJECTID',
  type: JimuFieldType.Number,
  esriType: EsriFieldType.OID,
  alias: 'ObjectID'
}

// track point
const TimeSchema = {
  jimuName: 'location_timestamp',
  name: 'location_timestamp',
  type: JimuFieldType.Date,
  esriType: EsriFieldType.Date,
  alias: 'Time',
  fieldFormat: DATE_TIME_DEFAULT_ESRI_FORMAT
}
const LongitudeSchema = {
  jimuName: 'Longitude',
  name: 'Longitude',
  type: JimuFieldType.Number,
  esriType: EsriFieldType.Double,
  alias: 'Longitude'
}
const LatitudeSchema = {
  jimuName: 'Latitude',
  name: 'Latitude',
  type: JimuFieldType.Number,
  esriType: EsriFieldType.Double,
  alias: 'Latitude'
}
const AltitudeSchema = {
  jimuName: 'altitude',
  name: 'altitude',
  type: JimuFieldType.Number,
  esriType: EsriFieldType.Double,
  alias: 'Altitude'
}
const OrientationSchema = {
  jimuName: 'Orientation',
  name: 'Orientation',
  type: JimuFieldType.Number,
  esriType: EsriFieldType.Double,
  alias: 'Orientation'
}
const SpeedSchema = {
  jimuName: 'speed',
  name: 'speed',
  type: JimuFieldType.Number,
  esriType: EsriFieldType.Double,
  alias: 'Speed'
}
const AccuracySchema = {
  jimuName: 'Accuracy',
  name: 'Accuracy',
  type: JimuFieldType.Number,
  esriType: EsriFieldType.Double,
  alias: 'Accuracy'
}

// trackline
const LineIdSchema = {
  jimuName: 'LineID',
  name: 'LineID',
  type: JimuFieldType.Number,
  esriType: EsriFieldType.Integer,
  alias: 'LineID'
}

const StartTimeSchema = {
  jimuName: 'StartTime',
  name: 'StartTime',
  type: JimuFieldType.Date,
  esriType: EsriFieldType.Date,
  alias: 'StartTime',
  fieldFormat: DATE_TIME_DEFAULT_ESRI_FORMAT
}
const EndTimeSchema = {
  jimuName: 'EndTime',
  name: 'EndTime',
  type: JimuFieldType.Date,
  esriType: EsriFieldType.Date,
  alias: 'EndTime',
  fieldFormat: DATE_TIME_DEFAULT_ESRI_FORMAT
}

const AverageAltitudeSchema = {
  jimuName: 'AverageAltitude',
  name: 'AverageAltitude',
  type: JimuFieldType.Number,
  esriType: EsriFieldType.Double,
  alias: 'AverageAltitude'
}

const AverageSpeedSchema = {
  jimuName: 'AverageSpeed',
  name: 'averageSpeed',
  type: JimuFieldType.Number,
  esriType: EsriFieldType.Double,
  alias: 'AverageSpeed'
}

const AverageAccuracySchema = {
  jimuName: 'AverageAccuracy',
  name: 'AverageAccuracy',
  type: JimuFieldType.Number,
  esriType: EsriFieldType.Double,
  alias: 'AverageAccuracy'
}

const getFieldsByType = (name: string, intl: IntlShape) => {
  TimeSchema.alias = intl.formatMessage({ id: 'trackTime', defaultMessage: defaultMessages.trackTime })
  LongitudeSchema.alias = intl.formatMessage({ id: 'trackLongitude', defaultMessage: defaultMessages.trackLongitude })
  LatitudeSchema.alias = intl.formatMessage({ id: 'trackLatitude', defaultMessage: defaultMessages.trackLatitude })
  AltitudeSchema.alias = intl.formatMessage({ id: 'trackAltitude', defaultMessage: defaultMessages.trackAltitude })
  OrientationSchema.alias = intl.formatMessage({ id: 'trackOrientation', defaultMessage: defaultMessages.trackOrientation })
  SpeedSchema.alias = intl.formatMessage({ id: 'trackSpeed', defaultMessage: defaultMessages.trackSpeed })
  AccuracySchema.alias = intl.formatMessage({ id: 'trackAccuracy', defaultMessage: defaultMessages.trackAccuracy })
  StartTimeSchema.alias = intl.formatMessage({ id: 'trackStartTime', defaultMessage: defaultMessages.trackStartTime })
  EndTimeSchema.alias = intl.formatMessage({ id: 'trackEndTime', defaultMessage: defaultMessages.trackEndTime })
  AverageAltitudeSchema.alias = intl.formatMessage({ id: 'averageAltitude', defaultMessage: defaultMessages.averageAltitude })
  AverageSpeedSchema.alias = intl.formatMessage({ id: 'averageSpeed', defaultMessage: defaultMessages.averageSpeed })
  AverageAccuracySchema.alias = intl.formatMessage({ id: 'averageAccuracy', defaultMessage: defaultMessages.averageAccuracy })
  let fields
  if (name === 'track') {
    fields = {
      [IdSchema.jimuName]: IdSchema,
      [TimeSchema.jimuName]: TimeSchema,
      [LongitudeSchema.jimuName]: LongitudeSchema,
      [LatitudeSchema.jimuName]: LatitudeSchema,
      [AltitudeSchema.jimuName]: AltitudeSchema,
      [OrientationSchema.jimuName]: OrientationSchema,
      [SpeedSchema.jimuName]: SpeedSchema,
      [AccuracySchema.jimuName]: AccuracySchema
    }
  } else if (name === 'trackline_point') {
    fields = {
      [IdSchema.jimuName]: IdSchema,
      [LineIdSchema.jimuName]: LineIdSchema,
      [TimeSchema.jimuName]: TimeSchema,
      [LongitudeSchema.jimuName]: LongitudeSchema,
      [LatitudeSchema.jimuName]: LatitudeSchema,
      [AltitudeSchema.jimuName]: AltitudeSchema,
      [OrientationSchema.jimuName]: OrientationSchema,
      [SpeedSchema.jimuName]: SpeedSchema,
      [AccuracySchema.jimuName]: AccuracySchema
    }
  } else if (name === 'trackline') {
    fields = {
      [IdSchema.jimuName]: IdSchema,
      [StartTimeSchema.jimuName]: StartTimeSchema,
      [EndTimeSchema.jimuName]: EndTimeSchema,
      [AverageAltitudeSchema.jimuName]: AverageAltitudeSchema,
      [AverageSpeedSchema.jimuName]: AverageSpeedSchema,
      [AverageAccuracySchema.jimuName]: AverageAccuracySchema
    }
  }
  return fields
}

export const getHiddenFields = (name: string) => {
  let hiddenFields
  if (name === 'track') {
    hiddenFields = [IdSchema.jimuName, TimeSchema.jimuName]
  } else if (name === 'trackline_point') {
    hiddenFields = [IdSchema.jimuName, TimeSchema.jimuName, LineIdSchema.jimuName]
  } else if (name === 'trackline') {
    hiddenFields = []
  }
  return hiddenFields
}

/**
 * Get the initial data source schema.
 * @param label
 * @param name
 */
export const getInitSchema = (intl: IntlShape, label: string = '', name: string = ''): DataSourceSchema => {
  const fields = getFieldsByType(name, intl)
  return {
    label,
    idField: IdSchema.jimuName,
    fields: fields
  } as DataSourceSchema
}

/**
 * Get original fields from output ds schema (without objectid field)
 * @param schema
 */
export const getSchemaOriginFields = (schema: IMDataSourceSchema): string[] => {
  if (!schema?.fields) return
  const fields = []
  Object.entries(schema.fields)?.forEach(([fieldName, fieldSchema]) => {
    //The objectid field is required in the schema, but it may not be used.
    if (fieldName === IdSchema.jimuName && fieldSchema.jimuName === IdSchema.jimuName) {
      return null
    }
    const originFields = fieldSchema.originFields ?? []
    originFields.forEach((field) => {
      if (field) {
        fields.push(field)
      }
    })
  })
  return Array.from(new Set(fields))
}

/**
 * Create the initial output data source.
 * @param originalId
 * @param label
 * @param useDataSource
 */
export const createInitOutputDataSource = (intl: IntlShape, id: string, label: string, name: string, geometryType: GeometryType) => {
  const schema = getInitSchema(intl, label, name)
  const layerId = id + '__layer'
  const outputDsJson: DataSourceJson = {
    id,
    type: DataSourceTypes.FeatureLayer,
    label,
    originDataSources: [],
    isOutputFromWidget: true,
    isDataInDataSourceInstance: false,
    schema,
    geometryType,
    layerId
  }

  return outputDsJson
}

