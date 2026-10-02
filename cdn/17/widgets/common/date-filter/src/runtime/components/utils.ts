import {
  ClauseLogic, ClauseOperator, dataSourceUtils, dateUtils, Immutable,
  type QueriableDataSource, type DataSource, type SqlResult, type JimuFieldType,
  MessageManager, DataSourceFilterChangeMessage
} from 'jimu-core'
import type { JimuLayerView, JimuMapView, JimuTable } from 'jimu-arcgis'
import { type DateType, type IMLayerConfigList, type IMMapViewConfigList, SelectionMode } from '../../config'
import { getStartAndEndDateFieldsFromLayerDs, VIRTUAL_LIST } from '../../utils/utils'

export interface ApplyFiltersByDataProps {
  widgetId: string
  date: DateType
  selectionMode: SelectionMode
  dataSources: { [dsId: string]: DataSource }
  notReadyOutputDsIds: string[]
  layerConfigList: IMLayerConfigList
}

export function applyFiltersByData (props: ApplyFiltersByDataProps) {
  const { layerConfigList, dataSources, notReadyOutputDsIds, ...others } = props
  if (!dataSources) return
  const dsIds: string[] = []
  layerConfigList.forEach(layerConfig => {
    const dsId = layerConfig.useDataSource.dataSourceId
    // skip unready output ds, and without startField cases
    if (notReadyOutputDsIds.includes(dsId) || !layerConfig.startField) {
      return
    }
    const dataSource = dataSources[dsId]
    if (!dataSource) {
      return
    }
    applyFilters({
      dataSource,
      startField: layerConfig.startField,
      endField: layerConfig.endField,
      ...others
    })
    dsIds.push(dsId)
  })
  publishFilterMessage(others.widgetId, dsIds, others.date)
}

export interface ApplyFiltersByMapProps {
  widgetId: string
  date: DateType
  selectionMode: SelectionMode
  mapViewConfigList: IMMapViewConfigList
  jimuMapView: JimuMapView
  jimuLayerViews: { [lvId: string]: JimuLayerView }
  jimuTables: { [tableViewId: string]: JimuTable }
}
export function applyFiltersByMap (props: ApplyFiltersByMapProps) {
  const { mapViewConfigList, jimuMapView, jimuLayerViews, jimuTables, ...others } = props
  const jimuMapViewId = jimuMapView.id
  const isSyncMode = syncToMapWidget(mapViewConfigList, jimuMapViewId)
  // get all dss from layer and table
  const dataSourceList = []
  const dsIds: string[] = []
  jimuLayerViews && Object.keys(jimuLayerViews).forEach(id => {
    dataSourceList.push(jimuLayerViews[id].getLayerDataSource())
  })
  const mapDs = jimuMapView.getMapDataSource()
  jimuTables && Object.keys(jimuTables).forEach(id => {
    mapDs && dataSourceList.push(mapDs.getDataSourceByLayer(jimuTables[id].table))
  })

  dataSourceList.forEach(dataSource => {
    let dateValues
    if (isSyncMode) {
      const { startField, endField } = getStartAndEndDateFieldsFromLayerDs(dataSource, true)
      if (startField === null) { // normal layer with multiple date fields
        return
      }
      dateValues = {
        startField: startField?.jimuName,
        endField: endField?.jimuName || null
      }
    } else {
      dateValues = mapViewConfigList[jimuMapViewId].layerConfigList.find(lc => lc.useDataSource.dataSourceId === dataSource.id)
      if (!dateValues || !dateValues.startField) { // current layer is not in config list, or not set startField
        return
      }
    }
    applyFilters({
      dataSource,
      startField: dateValues.startField,
      endField: dateValues.endField,
      ...others
    })
    dsIds.push(dataSource.id)
  })
  publishFilterMessage(others.widgetId, dsIds, others.date)
}

interface ApplyFiltersProps {
  widgetId: string
  date: DateType
  selectionMode: SelectionMode
  dataSource: DataSource
  startField: string
  endField: string
}
function applyFilters (props: ApplyFiltersProps) {
  const { widgetId, date, selectionMode, dataSource: ds, startField, endField } = props
  if (!ds) return
  const dateFieldType = ds.getSchema().fields[startField].type
  const sqlResult = getIntersectSQL({
    dateFieldType,
    startField: startField,
    endField: endField,
    date,
    selectionMode,
    dataSource: ds
  })
  const queryParams = { where: sqlResult.sql, sqlExpression: sqlResult.sqlExpression } as any
  (ds as QueriableDataSource).updateQueryParams?.(queryParams, widgetId)
}

function publishFilterMessage (widgetId: string, dataSourceIds: string[], date: DateType) {
  if (dataSourceIds.length === 0) {
    return
  }
  const clearDsIds = date ? [] : dataSourceIds
  MessageManager.getInstance().publishMessage(new DataSourceFilterChangeMessage(widgetId, dataSourceIds, clearDsIds))
}

export function syncToMapWidget (mapViewConfigList: IMMapViewConfigList, jimuMapViewId: string): boolean {
  return !mapViewConfigList || !mapViewConfigList[jimuMapViewId] || !mapViewConfigList[jimuMapViewId].customizeLayers
}

// date field
const inputEditorForSingleDate = 'DATE_PICKER'
const inputEditorForDoubleDate = 'DOUBLE_DATE_PICKER'
// date-only field
const inputEditorForSingleDateOnly = 'DATE_ONLY_PICKER'
const inputEditorForDoubleDateOnly = 'DOUBLE_DATE_ONLY_PICKER'
// blank
const inputEditorForBlank = 'BLANK_SELECTOR'

const oneDayTimes = 24 * 3600 * 1000
interface IntersectSQLProps {
  dateFieldType: JimuFieldType
  startField: string
  endField: string
  date: DateType
  selectionMode: SelectionMode
  dataSource: DataSource
}
export function getIntersectSQL (props: IntersectSQLProps): SqlResult {
  const { dateFieldType, startField, endField: propEndField, date, selectionMode, dataSource: ds } = props
  const endField = startField === propEndField ? null : propEndField // if same field, treat as one field
  const emptyObj: SqlResult = {
    sqlExpression: null,
    sql: '',
    displaySQL: ''
  }
  if (!date) {
    return emptyObj
  }

  const clauses = []
  // one field
  if (endField === null) {
    if (selectionMode === SelectionMode.Single) {
      let targetDateTime: string | number = date as string
      let operator = ClauseOperator.DateOnlyOperatorIsOn
      let inputEditor = inputEditorForSingleDateOnly
      if (dateFieldType === 'DATE') {
        targetDateTime = getDateTimeByLabel(targetDateTime)
        operator = ClauseOperator.DateOperatorIsOn
        inputEditor = inputEditorForSingleDate
      }
      const clause = dataSourceUtils.createSQLClause(startField, operator, [{value: targetDateTime, label: '', isUTC: true}], false, inputEditor)
      clauses.push(clause)
    } else { // range
      const dateRange = date as string[]
      let dateTime1, dateTime2, operator, inputEditor
      if (dateFieldType === 'DATE') {
        dateTime1 = getDateTimeByLabel(dateRange[0])
        dateTime2 = getDateTimeByLabel(dateRange[1])
        operator = ClauseOperator.DateOperatorIsBetween
        inputEditor = inputEditorForDoubleDate
      } else {
        dateTime1 = dateRange[0]
        dateTime2 = dateRange[1]
        operator = ClauseOperator.DateOnlyOperatorIsBetween
        inputEditor = inputEditorForDoubleDateOnly
      }
      const clause = dataSourceUtils.createSQLClause(startField, operator, [{ value: dateTime1, label: '', isUTC: true }, { value: dateTime2, label: '', isUTC: true }], false, inputEditor)
      clauses.push(clause)
    }
  } else { // two fields
    let dateRange = date as string[]
    let clauseSetWithTwoValues, clauseSetWithoutEndValue, clauseSetWithoutStartValue
    if (dateFieldType === 'DATE') {
      if (selectionMode === SelectionMode.Single) { // change single selection to range
        dateRange = [date as string, date as string]
      }
      const dateTime1 = getDateTimeByLabel(dateRange[0])
      const dateTime2 = getDateTimeByLabel(dateRange[1])
      const dateTime3 = dateTime2 + oneDayTimes // next day 0:00

      const value1 = { value: dateTime1, label: '', isUTC: true }
      const value3 = { value: dateTime3, label: '', isUTC: true }
      clauseSetWithTwoValues = dataSourceUtils.createSQLClauseSet(ClauseLogic.And, [
        dataSourceUtils.createSQLClause(startField, ClauseOperator.DateOperatorIsBefore, [value3], false, inputEditorForSingleDate),
        dataSourceUtils.createSQLClause(endField, ClauseOperator.DateOperatorIsOnOrAfter, [value1], false, inputEditorForSingleDate)
      ])
      clauseSetWithoutEndValue = dataSourceUtils.createSQLClauseSet(ClauseLogic.And, [
        dataSourceUtils.createSQLClause(startField, ClauseOperator.DateOperatorIsBefore, [value3], false, inputEditorForSingleDate),
        dataSourceUtils.createSQLClause(endField, ClauseOperator.DateOperatorIsBlank, null, false, inputEditorForBlank)
      ])
      clauseSetWithoutStartValue = dataSourceUtils.createSQLClauseSet(ClauseLogic.And, [
        dataSourceUtils.createSQLClause(endField, ClauseOperator.DateOperatorIsOnOrAfter, [value1], false, inputEditorForSingleDate),
        dataSourceUtils.createSQLClause(startField, ClauseOperator.DateOperatorIsBlank, null, false, inputEditorForBlank)
      ])
    } else {
      let value1, value2
      if (selectionMode === SelectionMode.Single) { // change single selection to range
        value1 = { value: date as string, label: '', isUTC: true }
        value2 = value1
      } else {
        value1 = { value: dateRange[0], label: '', isUTC: true }
        value2 = { value: dateRange[1], label: '', isUTC: true }
      }
      clauseSetWithTwoValues = dataSourceUtils.createSQLClauseSet(ClauseLogic.And, [
        dataSourceUtils.createSQLClause(startField, ClauseOperator.DateOnlyOperatorIsOnOrBefore, [value2], false, inputEditorForSingleDateOnly),
        dataSourceUtils.createSQLClause(endField, ClauseOperator.DateOnlyOperatorIsOnOrAfter, [value1], false, inputEditorForSingleDateOnly)
      ])
      clauseSetWithoutEndValue = dataSourceUtils.createSQLClauseSet(ClauseLogic.And, [
        dataSourceUtils.createSQLClause(startField, ClauseOperator.DateOnlyOperatorIsOnOrBefore, [value2], false, inputEditorForDoubleDateOnly),
        dataSourceUtils.createSQLClause(endField, ClauseOperator.DateOnlyOperatorIsBlank, null, false, inputEditorForBlank)
      ])
      clauseSetWithoutStartValue = dataSourceUtils.createSQLClauseSet(ClauseLogic.And, [
        dataSourceUtils.createSQLClause(endField, ClauseOperator.DateOnlyOperatorIsOnOrAfter, [value1], false, inputEditorForDoubleDateOnly),
        dataSourceUtils.createSQLClause(startField, ClauseOperator.DateOnlyOperatorIsBlank, null, false, inputEditorForBlank)
      ])
    }
    clauses.push(clauseSetWithTwoValues)
    clauses.push(clauseSetWithoutEndValue)
    clauses.push(clauseSetWithoutStartValue)
  }
  const sqlExpr = dataSourceUtils.createSQLExpression(ClauseLogic.Or, clauses, ds)
  return {
    sqlExpression: Immutable(sqlExpr),
    sql: sqlExpr.sql,
    displaySQL: sqlExpr.displaySQL
  }
}

function getDateTimeByLabel (dateLabel: string) {
  const date = dateUtils.getDateByStrictYMDFormat(dateLabel)
  return date.getTime()
}

// get selected dates for defaultDay, convert virtual date to real ymd date label.
export function getDatesForDefaultDay (defaultDay: DateType, mode: SelectionMode): DateType {
  if (mode === SelectionMode.Single) {
    return getYmdDateByLabel(defaultDay as string)
  } else {
    const dates = (defaultDay as string[])?.filter(d => !!d) || []
    if (dates.length === 0) {
      return null
    }
    // use the only valid date to generate range if only one date is set.
    const startDate = getYmdDateByLabel(dates[0])
    const endDate = getYmdDateByLabel(dates[1] || dates[0])
    return [startDate, endDate]
  }
}

// get ymd date string by virtual date label or ymd date label.
function getYmdDateByLabel (dateLabel: string): string {
  let ymd: string = null
  if (VIRTUAL_LIST.includes(dateLabel as dateUtils.VirtualDateType)) {
    const date = dateUtils.getRealDateByVirtualDate(dateLabel as dateUtils.VirtualDateType) as Date
    ymd = dateUtils.getStrictYMDFormat(date)
  } else if (dateLabel) {
    ymd = dateLabel
  }
  return ymd
}
