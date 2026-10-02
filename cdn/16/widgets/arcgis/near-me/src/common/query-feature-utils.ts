import type Geometry from 'esri/geometry/Geometry'
import type SpatialReference from 'esri/geometry/SpatialReference'
import { type FeatureLayerQueryParams, type DataRecord, utils } from 'jimu-core'

interface GetAllFeaturesOptions {
  queryGeometry: Geometry
  returnGeometry: boolean
  outSR: SpatialReference
  outFields: string[]
  sortField?: string
  sortOrder?: string
  whereClause?: string
  ids?: string[]
  signal?: AbortSignal
}

interface GetPagedFeaturesOptions {
  queryGeometry: Geometry
  returnGeometry: boolean
  outSR: SpatialReference
  outFields: string[]
  sortOrder: string
  sortField: string
  start: number
  num: number
  whereClause: string
}

/**
 * Returns all the records satisfying the query
 * If the number of records are more than the maxRecord count then all the records are fetched by batch query and finally all records are return
 * @param ds Layers DataSource from which records needs to be fetched
 * @param options Query options
 * @returns promise of dataRecords
 */
export const getALLFeatures = async (ds, options: GetAllFeaturesOptions): Promise<DataRecord[]> => {
  const { queryGeometry, returnGeometry, outFields, sortField, sortOrder, whereClause, signal } = options
  const promise = new Promise<DataRecord[]>((resolve) => {
    if (!ds) {
      resolve([])
      return
    }
    const query = getQueryParams(ds, outFields, queryGeometry, returnGeometry)
    if (whereClause) {
      query.where = whereClause
    }
    if (sortField && sortOrder) {
      query.orderByFields = [sortField.toString() + ' ' + sortOrder]
    }
    if (options.ids?.length) {
      query.objectIds = options.ids
    }
    ds.queryAll(query, signal, null, { excludeQuery: { widgetId: 'filter-data-record-action', dataSourceId: ds.id } }).then((result) => {
      if (signal?.aborted) {
        console.error(signal.reason)
        resolve([])
      } else if (result?.records) {
        resolve(result.records)
      } else {
        resolve([])
      }
    }, (err) => {
      console.log(err)
      resolve([])
    })
  })
  return promise
}

/**
 * Returns a single record satisfying the query
 * @param ds Layers DataSource from which the record needs to be fetched
 * @param outFields Fields to be returned in the record
 * @param whereClause where clause to filter the records
 * @returns promise of a dataRecord
 */
export const getSingleRecord = async (ds, outFields: string[], whereClause: string): Promise<DataRecord> => {
  const promise = new Promise<DataRecord>((resolve) => {
    if (!ds) {
      resolve(null)
      return
    }
    const query = getQueryParams(ds, outFields, null, true) as any
    if (whereClause) {
      query.where = whereClause
    }
    query.num = 1
    ds.query(query, null, { excludeQuery: { widgetId: 'filter-data-record-action', dataSourceId: ds.id } }).then((result) => {
      if (result?.records?.[0]) {
        resolve(result.records[0])
      } else {
        resolve(null)
      }
    }, (err) => {
      console.log(err)
      resolve(null)
    })
  })
  return promise
}

/**
 * Returns all the records ids satisfying the query
 * @param ds Layers DataSource from which records needs to be fetched
 * @param queryGeometry Geometry of the buffer/ the incident location
 * @param returnGeometry Specify if geometry should returned while fetching the records
 * @param outSR Out Spatial Reference in which the returned geometries should be
 * @param outFields use datasources out fields
 * @returns promise of dataRecords
 */
export const getFeaturesIds = async (ds, queryGeometry: Geometry, outSR: SpatialReference, outFields: string[]): Promise<string[]> => {
  const promise = new Promise<string[]>((resolve) => {
    if (!ds) {
      resolve(null)
      return
    }
    const query = getQueryParams(ds, outFields, queryGeometry, false)
    ds.queryIds(query, null, { excludeQuery: { widgetId: 'filter-data-record-action', dataSourceId: ds.id } }).then((result) => {
      if (result.ids) {
        resolve(result.ids)
      } else {
        resolve([])
      }
    }, (err) => {
      console.log(err)
      resolve(null)
    })
  })
  return promise
}

/**
 * Returns limited records satisfying the query
 * If the number of records are more than the maxRecord count then all the records are fetched by batch query and finally all records are return
 * @param ds Layers DataSource from which records needs to be fetched
 * @param options Query options including pagination parameters
 * @returns promise of dataRecords
 */
export const getPagedFeatures = async (ds, options: GetPagedFeaturesOptions): Promise<DataRecord[]> => {
  const { queryGeometry, returnGeometry, outFields, sortOrder, sortField, start, num, whereClause } = options
  const promise = new Promise<DataRecord[]>((resolve) => {
    if (!ds) {
      resolve([])
      return
    }
    const query = getQueryParams(ds, outFields, queryGeometry, returnGeometry) as any
    if (sortField && sortOrder) {
      query.orderByFields = [sortField.toString() + ' ' + sortOrder]
    }
    if (whereClause) {
      query.where = whereClause
    }
    query.start = start
    query.num = num
    ds.query(query, null, { excludeQuery: { widgetId: 'filter-data-record-action', dataSourceId: ds.id } }).then((result) => {
      if (result?.records) {
        resolve(result.records)
      } else {
        resolve([])
      }
    }, (err) => {
      console.log(err)
      resolve([])
    })
  })
  return promise
}

/**
 *
 * @param ds Layers DataSource from which records needs to be fetched
 * @param outFields use datasources out fields
 * @param queryGeometry Geometry of the buffer/ the incident location
 * @param returnGeometry Specify if geometry should returned while fetching the records
 * @returns
 */
export const getQueryParams = (ds, outFields, queryGeometry, returnGeometry): FeatureLayerQueryParams => {
  let outFieldsArr
  if (outFields === undefined) {
    outFieldsArr = ['*']
  } else {
    //skip esriCTApproxDistance as this is a custom field generated by widget which will not be available for query
    outFieldsArr = Object.assign([], outFields)
    if (outFields?.includes('esriCTApproxDistance')) {
      outFieldsArr.splice(outFields.indexOf('esriCTApproxDistance'), 1)
    }
  }

  //To prevent query errors, filter out any fields that are not present in the data source's schema.
  const fieldsInSchema = ds.getSchema()?.fields
  if (fieldsInSchema) {
    const fieldsInDS = Object.keys(fieldsInSchema).map(key => key.toLowerCase())
    outFieldsArr = outFieldsArr.filter(field => fieldsInDS.includes(field.toLowerCase()))
  }

  //if the objectId field is not available in the outfields then add the objectId field in outfields array
  const oid = ds.getIdField()
  if (oid && !outFieldsArr.includes('*') && !outFieldsArr.includes(oid)) {
    outFieldsArr.push(oid)
  }
  const query: FeatureLayerQueryParams = {}
  if (queryGeometry) {
    //when passing query as FeatureLayerQueryParams use toJson else invalid geometry is passed in the query request
    query.geometry = queryGeometry.toJSON()
    query.geometryType = queryGeometry ? utils.getGeometryType(queryGeometry) : undefined
  }
  //get all the fields as we need to show the feature info
  query.outFields = outFieldsArr
  //get the return geometry only if asked
  query.returnGeometry = returnGeometry
  query.notAddFieldsToClient = true
  return query
}

/**
 * Returns all the records count satisfying the query
 * @param ds Layers DataSource from which records needs to be fetched
 * @param queryGeometry Geometry of the buffer/ the incident location
 * @param returnGeometry Specify if geometry should returned while fetching the records
 * @param outSR Out Spatial Reference in which the returned geometries should be
 * @param outFields use datasources out fields
 * @returns promise of dataRecords
 */
export const getFeaturesCount = async (ds, queryGeometry: Geometry, outSR: SpatialReference, outFields: string[], signal?: AbortSignal): Promise<number> => {
  const promise = new Promise<number>((resolve) => {
    if (!ds) {
      resolve(null)
      return
    }
    const query = getQueryParams(ds, outFields, queryGeometry, false)
    ds.queryCount(query, signal, null, { excludeQuery: { widgetId: 'filter-data-record-action', dataSourceId: ds.id } }).then((result) => {
      if (signal.aborted) {
        console.error(signal.reason)
        resolve(null)
      } else if (result?.count) {
        resolve(result.count)
      } else {
        resolve(null)
      }
    }, (err) => {
      console.log(err)
      resolve(null)
    })
  })
  return promise
}

/**
 * Returns all the group features records count satisfying the query
 * @param ds Layers DataSource from which records needs to be fetched
 * @param queryGeometry Geometry of the buffer/ the incident location
 * @param returnGeometry Specify if geometry should returned while fetching the records
 * @param groupField Group field for the query
 * @param sortOrder sort order for the query
 * @param whereClause where clause for the query
 * @returns promise of group features
 */
export const getGroupSubGroupFeatures = async (ds, queryGeometry, groupField: string, sortOrder: string, whereClause?: string): Promise<DataRecord[]> => {
  const promise = new Promise<DataRecord[]>((resolve) => {
    if (!ds) {
      resolve([])
      return
    }
    if (!groupField) {
      resolve([])
      return
    }
    // Validate groupField exists in schema
    const dsSchema = ds.getSchema?.()
    if (dsSchema?.fields && !dsSchema.fields[groupField]) {
      resolve([])
      return
    }

    // Determine the best field for statistics count
    const objectIdField = ds.getIdField?.() || ds.layer?.objectIdField
    const schemaFields = Object.keys(dsSchema?.fields || {})
    let statisticField: string
    if (objectIdField && schemaFields.includes(objectIdField)) {
      statisticField = objectIdField
    } else if (schemaFields.length > 0) {
      statisticField = schemaFields[0]
    } else {
      statisticField = '*'
    }

    const buildQuery = (includeGeometry: boolean) => {
      const query: FeatureLayerQueryParams = {}
      if (includeGeometry && queryGeometry) {
        try {
          //when passing query as FeatureLayerQueryParams use toJson else invalid geometry is passed in the query request
          query.geometry = queryGeometry.toJSON()
          query.geometryType = queryGeometry ? utils.getGeometryType(queryGeometry) : undefined
        } catch (err) {
          console.error(err)
        }
      }
      if (whereClause) {
        query.where = whereClause
      }
      query.orderByFields = [groupField + ' ' + sortOrder]
      query.groupByFieldsForStatistics = [groupField]
      query.outStatistics = [{
        onStatisticField: statisticField,
        outStatisticFieldName: "feature_count",
        statisticType: "count"
      }]
      return query
    }

    const executeQuery = (query: FeatureLayerQueryParams, attemptNum: number, withGeometry: boolean) => {
      ds.query(query, null, { excludeQuery: { widgetId: 'filter-data-record-action', dataSourceId: ds.id } }).then((result) => {
        if (result?.records) {
          resolve(result.records)
        } else {
          resolve([])
        }
      }, (err) => {
        console.error(err)
        // If with geometry query failed, retry without geometry
        if (attemptNum === 1 && withGeometry && queryGeometry) {
          const queryWithoutGeometry = buildQuery(false)
          executeQuery(queryWithoutGeometry, 2, false)
        } else {
          resolve([])
        }
      })
    }

    const query = buildQuery(true)
    executeQuery(query, 1, true)
  })
  return promise
}

/**
 * Build a where clause for a field based on an epoch timestamp
 * @param fieldName - The name of the field to compare against
 * @param epochMs - The epoch timestamp in milliseconds to build the where clause for
 *
 * @return A where clause string that can be used in a query to filter records where the field value is within the second specified by the epoch timestamp
 */
export const buildDateWhereClause = (fieldName: string, epochMs: number): string => {
  // Floor to the current second boundary
  const floorMs = Math.floor(epochMs / 1000) * 1000
  // Next second boundary
  const ceilMs = floorMs + 1000
  const tsFloor = epochToTimestamp(floorMs)
  const tsCeil = epochToTimestamp(ceilMs)
  return (
    fieldName + " >= TIMESTAMP '" + tsFloor + "' AND " + fieldName + " < TIMESTAMP '" + tsCeil + "'"
  )
}

/**
* Converts epoch milliseconds to an ArcGIS TIMESTAMP-compatible
* UTC date string in the format: YYYY-MM-DD HH:MM:SS
*
* @param epochMs - Epoch timestamp in milliseconds
* @returns Formatted UTC date string
*/
const epochToTimestamp = (epochMs: number): string => {
  const d = new Date(epochMs)
  const yyyy = d.getUTCFullYear()
  const mm = String(d.getUTCMonth() + 1).padStart(2, "0")
  const dd = String(d.getUTCDate()).padStart(2, "0")
  const hh = String(d.getUTCHours()).padStart(2, "0")
  const mi = String(d.getUTCMinutes()).padStart(2, "0")
  const ss = String(d.getUTCSeconds()).padStart(2, "0")
  return yyyy + "-" + mm + "-" + dd + " " + hh + ":" + mi + ":" + ss
}