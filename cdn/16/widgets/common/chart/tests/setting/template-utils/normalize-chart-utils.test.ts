import normalizeChart from '../../../src/setting/settings/chart-type-selector/utils/normalize-chart'

jest.mock('@arcgis/charts-components', () => jest.fn())
jest.mock('@arcgis/charts-components-react', () => jest.fn())

describe('normalizeChart', () => {
  it('Normalize series for serial/pie chart', () => {
    const webChart = {
      series: [{
        type: 'barSeries',
        x: 'foo',
        y: '123abc',
        id: '123abc',
        query: {
          groupByFieldsForStatistics: ['foo'],
          outStatistics: [{
            onStatisticField: 'bar',
            statisticType: 'sum',
            outStatisticFieldName: '123abc'
          }],
          orderByFields: ['123abc desc']
        }
      }]
    } as any

    const normalized = normalizeChart(webChart)
    expect(normalized).toEqual({
      series: [{
        type: 'barSeries',
        x: 'foo',
        y: 'sum_of_bar',
        id: 'bar'
      }],
      dataSource: {
        query: {
          groupByFieldsForStatistics: ['foo'],
          outStatistics: [{
            onStatisticField: 'bar',
            statisticType: 'sum',
            outStatisticFieldName: 'sum_of_bar'
          }],
          orderByFields: ['123abc desc']
        }
      }
    })
  })

  it('Normalize series for scatter chart', () => {
    const webChart = {
      series: [{
        type: 'scatterSeries',
        x: 'foo',
        y: 'bar',
        id: 'chart 123abc'
      }]
    } as any

    const normalized = normalizeChart(webChart)
    expect(normalized).toEqual({
      series: [{
        type: 'scatterSeries',
        x: 'foo',
        y: 'bar',
        id: 'bar'
      }],
      dataSource: {
        query: {
          outFields: ['foo', 'bar']
        }
      }
    })
  })

  it('Normalize series color type for serial/pie chart', () => {
    let webChart = {
      series: [{
        type: 'barSeries',
        x: 'foo',
        y: '123abc',
        id: '123abc',
        fillSymbol: {
          type: 'esriSFS',
          style: 'esriSFSSolid',
          color: [0, 0, 0, 255],
          outline: {
            type: 'esriSLS',
            style: 'esriSLSSolid',
            color: [0, 0, 0, 255],
            width: 1
          }
        },
        query: {
          groupByFieldsForStatistics: ['foo'],
          outStatistics: [{
            onStatisticField: 'bar',
            statisticType: 'sum',
            outStatisticFieldName: '123abc'
          }],
          orderByFields: ['123abc desc']
        }
      }]
    } as any

    let normalized = normalizeChart(webChart)
    expect(normalized).toEqual({
      series: [{
        type: 'barSeries',
        x: 'foo',
        y: 'sum_of_bar',
        id: 'bar',
        fillSymbol: {
          type: 'esriSFS',
          style: 'esriSFSSolid',
          color: [0, 0, 0, 255],
          outline: {
            type: 'esriSLS',
            style: 'esriSLSSolid',
            color: [0, 0, 0, 255],
            width: 1
          }
        }
      }],
      dataSource: {
        query: {
          groupByFieldsForStatistics: ['foo'],
          outStatistics: [{
            onStatisticField: 'bar',
            statisticType: 'sum',
            outStatisticFieldName: 'sum_of_bar'
          }],
          orderByFields: ['123abc desc']
        }
      }
    })

    webChart = {
      series: [{
        type: 'barSeries',
        x: 'foo',
        y: '123abc',
        id: '123abc',
        fillSymbol: {
          type: 'esriSFS'
        },
        query: {
          groupByFieldsForStatistics: ['foo'],
          outStatistics: [{
            onStatisticField: 'bar',
            statisticType: 'sum',
            outStatisticFieldName: '123abc'
          }],
          orderByFields: ['123abc desc']
        }
      }]
    } as any

    normalized = normalizeChart(webChart)
    expect(normalized).toEqual({
      series: [{
        type: 'barSeries',
        x: 'foo',
        y: 'sum_of_bar',
        id: 'bar',
        fillSymbol: {
          type: 'esriSFS'
        }
      }],
      dataSource: {
        query: {
          groupByFieldsForStatistics: ['foo'],
          outStatistics: [{
            onStatisticField: 'bar',
            statisticType: 'sum',
            outStatisticFieldName: 'sum_of_bar'
          }],
          orderByFields: ['123abc desc']
        }
      }
    })
  })

  it('Normalize series color type for scatter chart', () => {
    const webChart = {
      series: [{
        type: 'scatterSeries',
        x: 'foo',
        y: 'bar',
        id: 'chart 123abc',
        markerSymbol: {
          type: 'esriSMS',
          style: 'esriSMSCircle',
          color: [0, 0, 0, 255],
          size: 12
        }
      }]
    } as any

    const normalized = normalizeChart(webChart)
    expect(normalized).toEqual({
      series: [{
        type: 'scatterSeries',
        x: 'foo',
        y: 'bar',
        id: 'bar',
        markerSymbol: {
          type: 'esriSMS',
          style: 'esriSMSCircle',
          color: [0, 0, 0, 255],
          size: 12
        }
      }],
      dataSource: {
        query: {
          outFields: ['foo', 'bar']
        }
      }
    })
  })

  it('Normalize mixed combo series and merge grouped statistics into chart data source', () => {
    const webChart = {
      series: [{
        type: 'barSeries',
        x: 'category',
        y: 'temporary-bar-id',
        id: 'temporary-bar-id',
        fillSymbol: {
          type: 'esriSFS',
          style: 'esriSFSSolid',
          color: '#5E8FD0',
          outline: {
            type: 'esriSLS',
            style: 'esriSLSSolid',
            color: '#ffffff',
            width: 0
          }
        },
        query: {
          groupByFieldsForStatistics: ['category'],
          outStatistics: [{
            onStatisticField: 'sales',
            statisticType: 'sum',
            outStatisticFieldName: 'temporary-bar-id'
          }],
          orderByFields: ['temporary-bar-id desc']
        }
      }, {
        type: 'lineSeries',
        x: 'category',
        y: 'temporary-line-id',
        id: 'temporary-line-id',
        lineSmoothed: true,
        markerVisible: true,
        assignToSecondValueAxis: true,
        lineSymbol: {
          type: 'esriSLS',
          style: 'esriSLSSolid',
          color: '#E07A2D',
          width: 2
        },
        markerSymbol: {
          type: 'esriSMS',
          style: 'esriSMSCircle',
          color: '#E07A2D',
          size: 6
        },
        query: {
          groupByFieldsForStatistics: ['category'],
          outStatistics: [{
            onStatisticField: 'profit',
            statisticType: 'avg',
            outStatisticFieldName: 'temporary-line-id'
          }],
          orderByFields: ['temporary-line-id desc']
        }
      }]
    } as any

    const normalized = normalizeChart(webChart)
    expect(normalized).toEqual({
      series: [{
        type: 'barSeries',
        x: 'category',
        y: 'sum_of_sales',
        id: 'sales',
        fillSymbol: {
          type: 'esriSFS',
          style: 'esriSFSSolid',
          color: '#5E8FD0',
          outline: {
            type: 'esriSLS',
            style: 'esriSLSSolid',
            color: '#ffffff',
            width: 0
          }
        }
      }, {
        type: 'lineSeries',
        x: 'category',
        y: 'avg_of_profit',
        id: 'profit',
        lineSmoothed: true,
        markerVisible: true,
        assignToSecondValueAxis: true,
        lineSymbol: {
          type: 'esriSLS',
          style: 'esriSLSSolid',
          color: '#E07A2D',
          width: 2
        },
        markerSymbol: {
          type: 'esriSMS',
          style: 'esriSMSCircle',
          color: '#E07A2D',
          size: 6
        }
      }],
      dataSource: {
        query: {
          groupByFieldsForStatistics: ['category'],
          outStatistics: [{
            onStatisticField: 'sales',
            statisticType: 'sum',
            outStatisticFieldName: 'sum_of_sales'
          }, {
            onStatisticField: 'profit',
            statisticType: 'avg',
            outStatisticFieldName: 'avg_of_profit'
          }],
          orderByFields: ['temporary-bar-id desc']
        }
      }
    })
  })
})
