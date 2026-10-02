import { dateUtils, EsriFieldType, Immutable, JimuFieldType } from 'jimu-core'
import { SelectionMode } from '../src/config'
import { getDatesForDefaultDay } from '../src/runtime/components/utils'
import { getStartAndEndDateFieldsFromLayerDs } from '../src/utils/utils'

const sDate = '2019-09-05'
const eDate = '2019-09-10'
const dataSource: any = {
  url: 'https://sampleserver6.arcgisonline.com/arcgis/rest/services/USA/MapServer/0',
  getTimezone: () => {
    return 'device'
  },
  supportTime: () => {
    return false
  },
  getSchema: () => {
    return Immutable({
      fields: {
        SDATE: {
          name: 'SDATE',
          type: JimuFieldType.Date,
          esriType: EsriFieldType.Date
        },
        EDATE: {
          name: 'EDATE',
          type: JimuFieldType.Date,
          esriType: EsriFieldType.Date
        },
        SDATEONLY: {
          name: 'SDATEONLY',
          type: JimuFieldType.DateOnly,
          esriType: EsriFieldType.DateOnly
        },
        EDATEONLY: {
          name: 'EDATEONLY',
          type: JimuFieldType.DateOnly,
          esriType: EsriFieldType.DateOnly
        }
      }
    })
  }
}

describe('date filter widget', function () {
  describe('getDatesForDefaultDay', function () {
    it('Virtual date', function () {
      const todayYMDLabel = dateUtils.getStrictYMDFormat(new Date())
      const yesterdayYMDLabel = dateUtils.getStrictYMDFormat(new Date(Date.now() - 86400000))
      const dates = getDatesForDefaultDay('TODAY', SelectionMode.Single)
      expect(dates).toBe(todayYMDLabel)
      const dates2 = getDatesForDefaultDay(['YESTERDAY', 'TODAY'], SelectionMode.Range)
      expect(dates2[0]).toBe(yesterdayYMDLabel)
      expect(dates2[1]).toBe(todayYMDLabel)
    })
    it('Exact date', function () {
      const date1 = getDatesForDefaultDay(undefined, SelectionMode.Single) // default
      expect(date1).toBe(null)
      const date2 = getDatesForDefaultDay('', SelectionMode.Single) // add, then remove
      expect(date2).toBe(null)
      const date3 = getDatesForDefaultDay(sDate, SelectionMode.Single)
      expect(date3).toBe(sDate)
    })
    it('Exact dates', function () {
       const dates1 = getDatesForDefaultDay(undefined, SelectionMode.Range)
      expect(dates1).toBe(null)
      const dates2 = getDatesForDefaultDay(['', eDate], SelectionMode.Range)
      expect(dates2[0]).toBe(eDate)
      expect(dates2[1]).toBe(eDate)
      const dates3 = getDatesForDefaultDay([sDate, ''], SelectionMode.Range)
      expect(dates3[0]).toBe(sDate)
      expect(dates3[1]).toBe(sDate)
      const dates4 = getDatesForDefaultDay([sDate, eDate], SelectionMode.Range)
      expect(dates4[0]).toBe(sDate)
      expect(dates4[1]).toBe(eDate)
    })
  })

  /*
  describe('getIntersectSQL', function () {
    it('no date value', function () {
      const props = {
        dateFieldType: JimuFieldType.Date,
        startField: 'SDATE',
        endField: null,
        date: undefined,
        selectionMode: SelectionMode.Single,
        dataSource: dataSource
      }
      const emptyObj: SqlResult = {
        sqlExpression: null,
        sql: '',
        displaySQL: ''
      }
      const result = getIntersectSQL(props)
      expect(result).toEqual(emptyObj)
    })

    // date field
    describe('date field', function () {
      it('One field, single mode', function () {
        const props = {
          dateFieldType: JimuFieldType.Date,
          startField: 'SDATE',
          endField: null,
          date: sDate,
          selectionMode: SelectionMode.Single,
          dataSource: dataSource
        }
        const result = getIntersectSQL(props)
        const expectExpr = '(SDATE BETWEEN \'2019-09-04 16:00:00\' AND \'2019-09-05 16:00:00\') AND SDATE <> \'2019-09-05 16:00:00\'';
        expect(result.sql).toBe(expectExpr)
      })
      it('One field, range mode', function () {
        const props = {
          dateFieldType: JimuFieldType.Date,
          startField: 'SDATE',
          endField: null,
          date: [sDate, eDate],
          selectionMode: SelectionMode.Range,
          dataSource: dataSource
        }
        const result = getIntersectSQL(props)
        const expectExpr = '(SDATE BETWEEN \'2019-09-04 16:00:00\' AND \'2019-09-10 16:00:00\') AND SDATE <> \'2019-09-10 16:00:00\'';
        expect(result.sql).toBe(expectExpr)
      })
      it('Two fields, single mode', function () {
        const props = {
          dateFieldType: JimuFieldType.Date,
          startField: 'SDATE',
          endField: 'EDATE',
          date: sDate,
          selectionMode: SelectionMode.Single,
          dataSource: dataSource
        }
        const result = getIntersectSQL(props)
        const expectExpr = '((SDATE < \'2019-09-05 16:00:00\') AND (EDATE >= \'2019-09-04 16:00:00\')) OR ((SDATE < \'2019-09-05 16:00:00\') AND (EDATE IS NULL)) OR ((EDATE >= \'2019-09-04 16:00:00\') AND (SDATE IS NULL))'
        expect(result.sql).toBe(expectExpr)
      })
      it('Two fields, range mode', function () {
        const props = {
          dateFieldType: JimuFieldType.Date,
          startField: 'SDATE',
          endField: 'EDATE',
          date: [sDate, eDate],
          selectionMode: SelectionMode.Range,
          dataSource: dataSource
        }
        const result = getIntersectSQL(props)
        const expectExpr = '((SDATE < \'2019-09-10 16:00:00\') AND (EDATE >= \'2019-09-04 16:00:00\')) OR ((SDATE < \'2019-09-10 16:00:00\') AND (EDATE IS NULL)) OR ((EDATE >= \'2019-09-04 16:00:00\') AND (SDATE IS NULL))'
        expect(result.sql).toBe(expectExpr)
      })
    })

    // date-only field
    describe('date-only field', function () {
      it('One field, single mode', function () {
        const props = {
          dateFieldType: JimuFieldType.DateOnly,
          startField: 'SDATEONLY',
          endField: null,
          date: sDate,
          selectionMode: SelectionMode.Single,
          dataSource: dataSource
        }
        const result = getIntersectSQL(props)
        const expectExpr = 'SDATEONLY = DATE \'2019-09-05\''
        expect(result.sql).toBe(expectExpr)
      })
      it('One field, range mode', function () {
        const props = {
          dateFieldType: JimuFieldType.DateOnly,
          startField: 'SDATEONLY',
          endField: null,
          date: [sDate, eDate],
          selectionMode: SelectionMode.Range,
          dataSource: dataSource
        }
        const result = getIntersectSQL(props)
        const expectExpr = 'SDATEONLY BETWEEN DATE \'2019-09-05\' AND DATE \'2019-09-10\''
        expect(result.sql).toBe(expectExpr)
      })
      it('Two fields, single mode', function () {
        const props = {
          dateFieldType: JimuFieldType.DateOnly,
          startField: 'SDATEONLY',
          endField: 'EDATEONLY',
          date: sDate,
          selectionMode: SelectionMode.Single,
          dataSource: dataSource
        }
        const result = getIntersectSQL(props)
        const expectExpr = '((SDATEONLY <= DATE \'2019-09-05\') AND (EDATEONLY >= DATE \'2019-09-05\')) OR ((SDATEONLY <= DATE \'2019-09-05\') AND (EDATEONLY IS NULL)) OR ((EDATEONLY >= DATE \'2019-09-05\') AND (SDATEONLY IS NULL))'
        expect(result.sql).toBe(expectExpr)
      })
      it('Two fields, range mode', function () {
        const props = {
          dateFieldType: JimuFieldType.DateOnly,
          startField: 'SDATEONLY',
          endField: 'EDATEONLY',
          date: [sDate, eDate],
          selectionMode: SelectionMode.Range,
          dataSource: dataSource
        }
        const result = getIntersectSQL(props)
        const expectExpr = '((SDATEONLY <= DATE \'2019-09-10\') AND (EDATEONLY >= DATE \'2019-09-05\')) OR ((SDATEONLY <= DATE \'2019-09-10\') AND (EDATEONLY IS NULL)) OR ((EDATEONLY >= DATE \'2019-09-05\') AND (SDATEONLY IS NULL))'
        expect(result.sql).toBe(expectExpr)
      })
    })
  })
  */

  describe('getStartAndEndDateFieldsFromLayerDs', function () {
    it('common dataSource', function () {
      const result = getStartAndEndDateFieldsFromLayerDs(dataSource)
      expect(result.startField.name).toEqual('SDATE')
      expect(result.endField).toEqual(null)
    })
    it('time-awared dataSource, one field', function () {
      const timeAwareDataSource = {
        ...dataSource,
        supportTime: () => {
          return true
        },
        getTimeInfo: () => {
          return {
            startTimeField: 'SDATE',
            endTimeField: null
          }
        }
      }
      const result = getStartAndEndDateFieldsFromLayerDs(timeAwareDataSource)
      expect(result.startField.name).toEqual('SDATE')
      expect(result.endField).toEqual(null)
    })
    it('time-awared dataSource, two fields', function () {
      const timeAwareDataSource = {
        ...dataSource,
        supportTime: () => {
          return true
        },
        getTimeInfo: () => {
          return {
            startTimeField: 'SDATE',
            endTimeField: 'EDATE'
          }
        }
      }
      const result = getStartAndEndDateFieldsFromLayerDs(timeAwareDataSource)
      expect(result.startField.name).toEqual('SDATE')
      expect(result.endField.name).toEqual('EDATE')
    })
  })

})
