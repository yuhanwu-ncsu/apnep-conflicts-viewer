import { appActions, DataSourceManager, getAppStore, type IMFeatureLayerQueryParams, type ImmutableArray, type ImmutableObject, Immutable } from 'jimu-core'
import { getInitState } from 'jimu-for-test'
import { CategoryType, type IWebChart, type WebChartSeries } from '../../src/config'
import { getFieldSchema, getFieldsSchema, convertSerialSeriesRenderType, normalizeValueAxesInWebChart, syncValueAxesWithSeries, updateSeriesAxisPosition } from '../../src/utils/common'
import { getCategoryType, normalizeComboSeries } from '../../src/utils/common/series'
import { getDefaultAxes } from '../../src/utils/default'

jest.mock('@arcgis/charts-components', () => jest.fn())
jest.mock('@arcgis/charts-components-react', () => jest.fn())

const state = getInitState()

getAppStore().dispatch(appActions.updateStoreState(state))

describe('src/utils/common', () => {
  describe('getFieldSchema and getFieldsSchema', () => {
    let dss = null
    let mockFn = null
    beforeAll(() => {
      dss = {
        ds1: {
          getSchema: () => ({
            fields: {
              field1: {
                name: 'field1',
                alias: 'Field1'
              },
              field2: {
                name: 'field2',
                alias: 'Field2'
              }
            }
          })
        },
        ds2: {
          getSchema: () => ({
            fields: {
              field3: {
                name: 'field3',
                alias: 'Field3'
              }
            }
          })
        }
      }
      mockFn = jest.fn().mockImplementation(dsId => {
        return dss[dsId] == null ? dss.ds1 : dss[dsId]
      })
      DataSourceManager.getInstance().getDataSource = mockFn
    })

    afterEach(() => {
      mockFn.mockClear()
    })

    afterAll(() => {
      mockFn.mockRestore()
    })
    it('getFieldSchema', () => {
      expect(getFieldSchema('field1', 'ds1')).toEqual({
        name: 'field1',
        alias: 'Field1'
      })
      expect(mockFn).toHaveBeenCalledTimes(1)
      expect(getFieldSchema('field1', 'ds1')).toEqual({
        name: 'field1',
        alias: 'Field1'
      })
      expect(mockFn).toHaveBeenCalledTimes(1)
      expect(getFieldSchema('field2', 'ds1')).toEqual({
        name: 'field2',
        alias: 'Field2'
      })
      expect(mockFn).toHaveBeenCalledTimes(2)
    })

    it('getFieldsSchema', () => {
      expect(getFieldsSchema('ds1')).toEqual({
        field1: {
          name: 'field1',
          alias: 'Field1'
        },
        field2: {
          name: 'field2',
          alias: 'Field2'
        }
      })
      expect(mockFn).toHaveBeenCalledTimes(1)
      expect(getFieldsSchema('ds1')).toEqual({
        field1: {
          name: 'field1',
          alias: 'Field1'
        },
        field2: {
          name: 'field2',
          alias: 'Field2'
        }
      })
      expect(mockFn).toHaveBeenCalledTimes(1)
      expect(getFieldsSchema('ds2')).toEqual({
        field3: {
          name: 'field3',
          alias: 'Field3'
        }
      })
      expect(mockFn).toHaveBeenCalledTimes(2)
    })
  })

  describe('test some series utils', () => {
    it('getCategoryTypeFromQuery', () => {
      const groupByFieldsForStatistics = ['category0']
      const outStatistics = [
        {
          statisticType: 'sum',
          onStatisticField: 'numericField0',
          outStatisticFieldName: 'numericField0_0'
        }
      ]

      let query = Immutable({
        groupByFieldsForStatistics,
        outStatistics
      }) as IMFeatureLayerQueryParams

      expect(getCategoryType(query)).toBe(CategoryType.ByGroup)

      query = Immutable({ outStatistics }) as IMFeatureLayerQueryParams

      expect(getCategoryType(query)).toBe(CategoryType.ByField)
    })

    it('should create a line symbol from bar styling when switching to line', () => {
      const serie = Immutable({
        type: 'barSeries',
        fillSymbol: {
          color: '#ff5500',
          outline: {
            width: 3,
            color: '#222222',
            style: 'esriSLSDash'
          }
        },
        hideOversizedStackedLabels: true
      }) as unknown as ImmutableObject<WebChartSeries>

      const nextSerie = convertSerialSeriesRenderType(serie, 'smoothLine', '#0099ff', '#111111')

      expect(nextSerie.type).toBe('lineSeries')
      expect((nextSerie as any).lineSmoothed).toBe(true)
      expect((nextSerie as any).showArea).toBeUndefined()
      expect((nextSerie as any).lineSymbol.color).toBe('#ff5500')
      expect((nextSerie as any).lineSymbol.width).toBe(2)
      expect((nextSerie as any).lineSymbol.style).toBe('esriSLSSolid')
      expect((nextSerie as any).fillSymbol).toBeUndefined()
      expect((nextSerie as any).hideOversizedStackedLabels).toBe(true)
    })

    it('should keep the existing line symbol when only switching between line variants', () => {
      const serie = Immutable({
        type: 'lineSeries',
        lineSmoothed: true,
        showArea: true,
        lineSymbol: {
          color: '#3366ff',
          width: 5,
          style: 'esriSLSDot'
        }
      }) as unknown as ImmutableObject<WebChartSeries>

      const nextSerie = convertSerialSeriesRenderType(serie, 'line', '#0099ff', '#111111')

      expect(nextSerie.type).toBe('lineSeries')
      expect((nextSerie as any).lineSmoothed).toBe(false)
      expect((nextSerie as any).lineSymbol.color).toBe('#3366ff')
      expect((nextSerie as any).lineSymbol.width).toBe(5)
      expect((nextSerie as any).lineSymbol.style).toBe('esriSLSDot')
      expect((nextSerie as any).showArea).toBe(true)
    })

    it('should create a fill symbol from line styling when switching to column', () => {
      const serie = Immutable({
        type: 'lineSeries',
        lineSmoothed: true,
        showArea: true,
        markerVisible: true,
        markerSymbol: {
          color: '#ffffff'
        },
        lineSymbol: {
          color: '#44aa55',
          width: 4,
          style: 'esriSLSDashDot'
        }
      }) as unknown as ImmutableObject<WebChartSeries>

      const nextSerie = convertSerialSeriesRenderType(serie, 'column', '#0099ff', '#111111')

      expect(nextSerie.type).toBe('barSeries')
      expect((nextSerie as any).fillSymbol.color).toBe('#44aa55')
      expect((nextSerie as any).fillSymbol.outline.width).toBe(0)
      expect((nextSerie as any).fillSymbol.outline.color).toBe('var(--sys-color-divider-secondary)')
      expect((nextSerie as any).lineSmoothed).toBeUndefined()
      expect((nextSerie as any).lineSymbol).toBeUndefined()
      expect((nextSerie as any).showArea).toBe(true)
      expect((nextSerie as any).markerVisible).toBeUndefined()
      expect((nextSerie as any).markerSymbol).toBeUndefined()
    })

    it('should convert only newly added non-primary combo series to line series', () => {
      const previousSeries = [{
        type: 'barSeries',
        id: 'series-0',
        x: 'category',
        y: 'value-0',
        fillSymbol: {
          color: '#ff5500'
        }
      }, {
        type: 'lineSeries',
        id: 'series-1',
        x: 'category',
        y: 'value-1',
        lineSymbol: {
          color: '#2255ff',
          width: 2,
          style: 'esriSLSSolid'
        }
      }] as unknown as WebChartSeries[]

      const nextSeries = [{
        ...previousSeries[0]
      }, {
        ...previousSeries[1]
      }, {
        type: 'barSeries',
        id: 'series-2',
        x: 'category',
        y: 'value-2',
        fillSymbol: {
          color: '#11aa33',
          outline: {
            width: 1,
            color: '#11aa33',
            style: 'esriSLSSolid'
          }
        }
      }] as unknown as WebChartSeries[]

      const normalizedSeries = normalizeComboSeries(nextSeries, previousSeries, true)

      expect(normalizedSeries[0].type).toBe('barSeries')
      expect(normalizedSeries[1].type).toBe('lineSeries')
      expect(normalizedSeries[2].type).toBe('lineSeries')
      expect((normalizedSeries[2] as any).lineSymbol.color).toBe('#11aa33')
      expect((normalizedSeries[2] as any).fillSymbol).toBeUndefined()
    })
  })

  describe('secondary value axis utils', () => {
    const getAxes = () => Immutable(getDefaultAxes('barSeries'))

    const getSeries = (assignToSecondValueAxis = false) => {
      return Immutable([
        {
          type: 'barSeries',
          id: 'series-1',
          name: 'Series 1',
          x: 'category',
          y: 'value',
          assignToSecondValueAxis,
          dataLabels: {
            type: 'chartText',
            visible: false,
            content: {
              type: 'esriTS',
              color: '#000000',
              text: ''
            }
          }
        }
      ]) as any as ImmutableArray<WebChartSeries>
    }

    it('should add a secondary value axis when a series is assigned to the right axis', () => {
      const axes = getAxes()
      const series = getSeries(true)

      const nextAxes = syncValueAxesWithSeries(axes, series)

      expect(nextAxes).toHaveLength(3)
      expect(nextAxes[2].valueFormat).toEqual(nextAxes[1].valueFormat)
      expect(nextAxes[2].title?.content?.text).toBe('')
    })

    it('should remove the secondary value axis when no series uses it', () => {
      const axes = syncValueAxesWithSeries(getAxes(), getSeries(true))
      const nextAxes = syncValueAxesWithSeries(axes, getSeries(false))

      expect(nextAxes).toHaveLength(2)
    })

    it('should update series assignment and remove the third axis after switching back to left', () => {
      const axes = syncValueAxesWithSeries(getAxes(), getSeries(true))
      const series = getSeries(true)

      const nextState = updateSeriesAxisPosition(axes, series, 0, 'left')

      expect(nextState.series[0].assignToSecondValueAxis).toBeUndefined()
      expect(nextState.axes).toHaveLength(2)
    })

    it('should normalize an incoming chart config when right-axis series exist without a third axis', () => {
      const webChart = Immutable({
        series: getSeries(true),
        axes: getAxes()
      }) as unknown as ImmutableObject<IWebChart>

      const normalizedWebChart = normalizeValueAxesInWebChart(webChart)

      expect(normalizedWebChart.axes).toHaveLength(3)
      expect(normalizedWebChart.axes?.[2]).toBeDefined()
    })
  })
})
