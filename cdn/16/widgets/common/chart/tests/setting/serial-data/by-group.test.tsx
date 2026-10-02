import type { WebChartOrderOptions, ChartDataSource, WebChartSeries } from '../../../src/config'
import { React, Immutable, StatisticType, type ImmutableObject, type ImmutableArray } from 'jimu-core'
import { withStoreThemeIntlRender, mockTheme, type WithRenderResult } from 'jimu-for-test'
import { ByGroupData, type ByGroupDataProps } from '../../../src/setting/settings/chart/web-chart/common-sections/data/by-group'
import { MockNumericInput } from '../mock-numeric-input'
import { NumericFields, StringFields } from '../mock-field-selector'
import { getOutStatisticName } from '../../../src/utils/common/series'
import { fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
const ColumnTemplate = require('../../../src/setting/template/column.json')
const ComboTemplate = require('../../../src/setting/template/combo.json')

jest.mock('jimu-ui', () => {
  return {
    ...jest.requireActual<{ [key: string]: any }>('jimu-ui'),
    NumericInput: () => MockNumericInput
  }
})

jest.mock('../../../src/utils/common', () => {
  return {
    ...jest.requireActual<{ [key: string]: any }>('../../../src/utils/common'),
    getObjectIdField: () => 'FID'
  }
})

jest.mock('../../../src/setting/settings/chart/web-chart/components', () => {
  return {
    ...jest.requireActual<{ [key: string]: any }>('../../../src/setting/settings/chart/web-chart/components'),
    FieldSelector: require('../mock-field-selector').MockFieldSelector
  }
})

jest.mock('@arcgis/charts-components', () => jest.fn())
jest.mock('@arcgis/charts-components-react', () => jest.fn())

const CategoryFieldSelector = '.category-field-selector .selected-field-item'
const NumericFieldSelector = '.numeric-fields-selector .selected-fields'
const NumericFieldSelectedItem = '.numeric-fields-selector .selected-field-item'
const NumericFieldSelectItem = '.numeric-fields-selector .field-selector-item'
const SortFieldSelector = '.sort-select .dropdown-button-content'
const SortFieldSelectorItem = '.dropdown-menu--inner .jimu-dropdown-item'

const Container = (props: ByGroupDataProps): React.ReactElement => {
  const {
    series: propSeries,
    chartDataSource: propDataSource,
    orderOptions: propOrderOptions,
    onChange,
    ...others
  } = props
  const [series, setSeries] = React.useState(propSeries)
  const [orderOptions, setOrderOptions] = React.useState(propOrderOptions)
  const [dataSource, setDataSource] = React.useState(propDataSource)

  const handleChange = (series, { chartDataSource, orderOptions }): void => {
    onChange?.(series, chartDataSource)
    setSeries(series)
    setOrderOptions(orderOptions)
    setDataSource(chartDataSource)
  }

  return (
    <ByGroupData
      {...others}
      orderOptions={orderOptions}
      chartDataSource={dataSource}
      series={series}
      onChange={handleChange}
    />
  )
}

const chartDataSource: ImmutableObject<ChartDataSource> = Immutable({
  query: {
    groupByFieldsForStatistics: [StringFields[0]],
    outStatistics: [{
      statisticType: 'sum',
      onStatisticField: NumericFields[0],
      outStatisticFieldName: getOutStatisticName(NumericFields[0], StatisticType.Sum)
    }]
  }
})

describe('<ByGroupData />', () => {
  let useDataSources = null
  let render: WithRenderResult = null
  beforeAll(() => {
    useDataSources = [
      {
        dataSourceId: 'ds1',
        mainDataSourceId: 'ds1'
      }
    ]
    render = withStoreThemeIntlRender(true, mockTheme as any)
  })

  describe('work well for empty series', () => {
    it('should render well', () => {
      const series = Immutable(ColumnTemplate.series) as ImmutableArray<WebChartSeries>
      const props = {
        chartDataSource: undefined,
        series,
        useDataSources
      }
      const { getByText, queryBySelector } = render(<ByGroupData type='barSeries' {...props} />)
      expect(getByText('Count')).toBeInTheDocument()
      expect(queryBySelector(NumericFieldSelector)).not.toBeInTheDocument()
    })

    it('should hide count and split-by for combo template', () => {
      const series = Immutable(ComboTemplate.series) as ImmutableArray<WebChartSeries>
      const props = {
        chartDataSource: undefined,
        series,
        useDataSources,
        isComboTemplate: true
      }

      const { queryByText, queryBySelector, getBySelector } = render(<ByGroupData type='comboLineAndBarSeries' {...props} />)

      expect(queryByText('Count')).not.toBeInTheDocument()
      expect(queryByText('Split by field')).not.toBeInTheDocument()
      expect(queryBySelector(NumericFieldSelectedItem)).not.toBeInTheDocument()
      expect(getBySelector(SortFieldSelector)).toHaveTextContent('Category')
    })

    it('should use avg when combo category field is initialized without numeric fields', () => {
      const onChange = jest.fn()
      const series = Immutable(ComboTemplate.series) as ImmutableArray<WebChartSeries>
      const props = {
        chartDataSource: undefined,
        series,
        useDataSources,
        isComboTemplate: true,
        onChange
      }

      const { getByText, getBySelector, queryByText } = render(<Container type='comboLineAndBarSeries' {...props} />)

      fireEvent.click(getBySelector(CategoryFieldSelector))
      fireEvent.click(getByText(StringFields[1]))

      expect(getBySelector(CategoryFieldSelector)).toHaveTextContent(StringFields[1])
      expect(queryByText('Count')).not.toBeInTheDocument()
      expect(getBySelector(SortFieldSelector)).toHaveTextContent('Category')

      const nextSeries = onChange.mock.calls[0][0]
      expect(nextSeries).toHaveLength(1)
      expect(nextSeries[0].type).toBe('barSeries')
      expect(nextSeries[0].x).toBe(StringFields[1])
      expect(nextSeries[0].y).toBe('')

      const ds = onChange.mock.calls[0][1]
      expect(ds).toEqual({
        query: {
          outStatistics: [{
            statisticType: 'avg',
            onStatisticField: '',
            outStatisticFieldName: ''
          }],
          groupByFieldsForStatistics: [StringFields[1]]
        }
      })
    })

    it('category field change', () => {
      const onChange = jest.fn()
      const series = Immutable(ColumnTemplate.series) as ImmutableArray<WebChartSeries>

      const props = {
        chartDataSource: undefined,
        series,
        useDataSources,
        onChange
      }

      const { getByText, getBySelector } = render(<Container type='barSeries' {...props} />)
      fireEvent.click(getBySelector(CategoryFieldSelector))
      fireEvent.click(getByText(StringFields[1]))
      expect(getBySelector(CategoryFieldSelector)).toHaveTextContent(StringFields[1])
      expect(getByText('Count')).toBeInTheDocument()
      expect(getBySelector(SortFieldSelector)).toHaveTextContent('Category')

      const serie = onChange.mock.calls[0][0][0]
      expect(serie.type).toBe('barSeries')
      expect(serie.id).toBe('FID')
      expect(serie.x).toBe(StringFields[1])
      expect(serie.y).toBe('count_of_FID')
      const ds = onChange.mock.calls[0][1]
      expect(ds).toEqual({
        query: {
          outStatistics: [{
            statisticType: 'count',
            onStatisticField: 'FID',
            outStatisticFieldName: 'count_of_FID'
          }],
          groupByFieldsForStatistics: [StringFields[1]]
        }
      })
    })
  })
  describe('work well for exist series', () => {
    it('category field change', () => {
      const onChange = jest.fn()

      const series = ColumnTemplate.series
      series[0].id = NumericFields[0]
      series[0].x = StringFields[0]
      series[0].y = getOutStatisticName(NumericFields[0], StatisticType.Sum)

      const props = {
        chartDataSource,
        series: Immutable(series),
        useDataSources,
        onChange
      }
      const { getByText, getBySelector } = render(<Container type='barSeries' {...props} />)
      expect(getBySelector(CategoryFieldSelector)).toHaveTextContent(StringFields[0])
      expect(getByText('Sum')).toBeInTheDocument()
      expect(getByText(NumericFields[0])).toBeInTheDocument()
      expect(getBySelector(SortFieldSelector)).toHaveTextContent('Category')

      fireEvent.click(
        getBySelector(CategoryFieldSelector)
      )
      fireEvent.click(getByText(StringFields[1]))
      expect(
        getBySelector(CategoryFieldSelector)
      ).toHaveTextContent(StringFields[1])
      expect(getByText('Sum')).toBeInTheDocument()
      const serie = onChange.mock.calls[0][0][0]
      expect(serie.type).toBe('barSeries')
      expect(serie.x).toBe(StringFields[1])
      expect(serie.y).toBe(`sum_of_${NumericFields[0]}`)

      const ds = onChange.mock.calls[0][1]
      expect(ds).toEqual({
        query: {
          outStatistics: [{
            statisticType: 'sum',
            onStatisticField: NumericFields[0],
            outStatisticFieldName: `sum_of_${NumericFields[0]}`
          }],
          groupByFieldsForStatistics: [StringFields[1]]
        }
      })
    })
    it('normal numeric fields change', () => {
      const onChange = jest.fn()

      const series = ColumnTemplate.series
      series[0].id = NumericFields[0]
      series[0].x = StringFields[0]
      series[0].y = getOutStatisticName(NumericFields[0], StatisticType.Sum)

      const props = {
        chartDataSource,
        series: Immutable(series),
        useDataSources,
        onChange
      }
      const { getByText, queryByText, getBySelector, getAllBySelector } = render(<Container type='barSeries' {...props} />)
      expect(getBySelector(CategoryFieldSelector)).toHaveTextContent(StringFields[0])
      expect(getByText('Sum')).toBeInTheDocument()
      expect(getByText(NumericFields[0])).toBeInTheDocument()
      expect(getBySelector(SortFieldSelector)).toHaveTextContent('Category')

      fireEvent.click(getBySelector(NumericFieldSelector))
      fireEvent.click(getAllBySelector(NumericFieldSelectItem)[1])

      expect(getBySelector(CategoryFieldSelector)).toHaveTextContent(StringFields[0])
      expect(getByText('Sum')).toBeInTheDocument()
      expect(getByText(NumericFields[0])).toBeInTheDocument()
      expect(getByText(NumericFields[1])).toBeInTheDocument()
      expect(getBySelector(SortFieldSelector)).toHaveTextContent('Category')

      let serie = onChange.mock.calls[0][0][1]
      expect(serie.type).toBe('barSeries')
      expect(serie.x).toBe(StringFields[0])
      expect(serie.y).toBe(`sum_of_${NumericFields[1]}`)

      let ds = onChange.mock.calls[0][1]
      expect(ds).toEqual({
        query: {
          outStatistics: [{
            statisticType: 'sum',
            onStatisticField: NumericFields[0],
            outStatisticFieldName: `sum_of_${NumericFields[0]}`
          }, {
            statisticType: 'sum',
            onStatisticField: NumericFields[1],
            outStatisticFieldName: `sum_of_${NumericFields[1]}`
          }],
          groupByFieldsForStatistics: [StringFields[0]]
        }
      })

      fireEvent.click(getBySelector(NumericFieldSelector))
      fireEvent.click(getAllBySelector(NumericFieldSelectItem)[0])

      expect(getBySelector(CategoryFieldSelector)).toHaveTextContent(StringFields[0])
      expect(getByText('Sum')).toBeInTheDocument()
      expect(queryByText(NumericFields[0])).not.toBeInTheDocument()
      expect(getByText(NumericFields[1])).toBeInTheDocument()
      expect(getBySelector(SortFieldSelector)).toHaveTextContent('Category')

      serie = onChange.mock.calls[1][0][0]
      expect(serie.type).toBe('barSeries')
      expect(serie.x).toBe(StringFields[0])
      expect(serie.y).toBe(`sum_of_${NumericFields[1]}`)

      ds = onChange.mock.calls[1][1]
      expect(ds).toEqual({
        query: {
          outStatistics: [{
            statisticType: 'sum',
            onStatisticField: NumericFields[1],
            outStatisticFieldName: `sum_of_${NumericFields[1]}`
          }],
          groupByFieldsForStatistics: [StringFields[0]]
        }
      })
    })
    it('should keep all additional combo series as line series', () => {
      const onChange = jest.fn()

      const comboSeries = ComboTemplate.series
      comboSeries[0].id = NumericFields[0]
      comboSeries[0].x = StringFields[0]
      comboSeries[0].y = getOutStatisticName(NumericFields[0], StatisticType.Sum)
      comboSeries[1].id = NumericFields[1]
      comboSeries[1].x = StringFields[0]
      comboSeries[1].y = getOutStatisticName(NumericFields[1], StatisticType.Sum)

      const comboChartDataSource = Immutable({
        query: {
          groupByFieldsForStatistics: [StringFields[0]],
          outStatistics: [{
            statisticType: 'sum',
            onStatisticField: NumericFields[0],
            outStatisticFieldName: getOutStatisticName(NumericFields[0], StatisticType.Sum)
          }, {
            statisticType: 'sum',
            onStatisticField: NumericFields[1],
            outStatisticFieldName: getOutStatisticName(NumericFields[1], StatisticType.Sum)
          }]
        }
      }) as ImmutableObject<ChartDataSource>

      const props = {
        chartDataSource: comboChartDataSource,
        series: Immutable(comboSeries),
        useDataSources,
        isComboTemplate: true,
        onChange
      }

      const { getBySelector, getAllBySelector } = render(<Container type='comboLineAndBarSeries' {...props} />)

      fireEvent.click(getBySelector(NumericFieldSelector))
      fireEvent.click(getAllBySelector(NumericFieldSelectItem)[2])

      const nextSeries = onChange.mock.calls[0][0]
      expect(nextSeries).toHaveLength(3)
      expect(nextSeries[0].type).toBe('barSeries')
      expect(nextSeries[1].type).toBe('lineSeries')
      expect(nextSeries[2].type).toBe('lineSeries')

      const ds = onChange.mock.calls[0][1]
      expect(ds).toEqual({
        query: {
          outStatistics: [{
            statisticType: 'sum',
            onStatisticField: NumericFields[0],
            outStatisticFieldName: getOutStatisticName(NumericFields[0], StatisticType.Sum)
          }, {
            statisticType: 'sum',
            onStatisticField: NumericFields[1],
            outStatisticFieldName: getOutStatisticName(NumericFields[1], StatisticType.Sum)
          }, {
            statisticType: 'sum',
            onStatisticField: NumericFields[2],
            outStatisticFieldName: getOutStatisticName(NumericFields[2], StatisticType.Sum)
          }],
          groupByFieldsForStatistics: [StringFields[0]]
        }
      })
    })
    it('should not change remaining combo series type when numeric fields are removed', () => {
      const onChange = jest.fn()

      const comboSeries = [
        {
          ...ComboTemplate.series[0],
          id: NumericFields[0],
          x: StringFields[0],
          y: getOutStatisticName(NumericFields[0], StatisticType.Sum)
        },
        {
          ...ComboTemplate.series[1],
          id: NumericFields[1],
          x: StringFields[0],
          y: getOutStatisticName(NumericFields[1], StatisticType.Sum)
        },
        {
          ...ComboTemplate.series[0],
          id: NumericFields[2],
          x: StringFields[0],
          y: getOutStatisticName(NumericFields[2], StatisticType.Sum)
        }
      ]

      const comboChartDataSource = Immutable({
        query: {
          groupByFieldsForStatistics: [StringFields[0]],
          outStatistics: [{
            statisticType: 'sum',
            onStatisticField: NumericFields[0],
            outStatisticFieldName: getOutStatisticName(NumericFields[0], StatisticType.Sum)
          }, {
            statisticType: 'sum',
            onStatisticField: NumericFields[1],
            outStatisticFieldName: getOutStatisticName(NumericFields[1], StatisticType.Sum)
          }, {
            statisticType: 'sum',
            onStatisticField: NumericFields[2],
            outStatisticFieldName: getOutStatisticName(NumericFields[2], StatisticType.Sum)
          }]
        }
      }) as ImmutableObject<ChartDataSource>

      const props = {
        chartDataSource: comboChartDataSource,
        series: Immutable(comboSeries),
        useDataSources,
        isComboTemplate: true,
        onChange
      }

      const { getBySelector, getAllBySelector } = render(<Container type='comboLineAndBarSeries' {...props} />)

      fireEvent.click(getBySelector(NumericFieldSelector))
      fireEvent.click(getAllBySelector(NumericFieldSelectItem)[1])

      const nextSeries = onChange.mock.calls[0][0]
      expect(nextSeries).toHaveLength(2)
      expect(nextSeries[0].type).toBe('barSeries')
      expect(nextSeries[1].id).toBe(NumericFields[2])
      expect(nextSeries[1].type).toBe('barSeries')

      const ds = onChange.mock.calls[0][1]
      expect(ds).toEqual({
        query: {
          outStatistics: [{
            statisticType: 'sum',
            onStatisticField: NumericFields[0],
            outStatisticFieldName: getOutStatisticName(NumericFields[0], StatisticType.Sum)
          }, {
            statisticType: 'sum',
            onStatisticField: NumericFields[2],
            outStatisticFieldName: getOutStatisticName(NumericFields[2], StatisticType.Sum)
          }],
          groupByFieldsForStatistics: [StringFields[0]]
        }
      })
    })
    it('uncheck all numeric fields', () => {
      const onChange = jest.fn()

      const series = ColumnTemplate.series
      series[0].id = NumericFields[0]
      series[0].x = StringFields[0]
      series[0].y = getOutStatisticName(NumericFields[0], StatisticType.Sum)

      const props = {
        chartDataSource,
        series: Immutable(series),
        useDataSources,
        onChange
      }
      const { getByText, queryByText, getBySelector, getAllBySelector } = render(<Container type='barSeries' {...props} />)
      fireEvent.click(getBySelector(NumericFieldSelector))
      fireEvent.click(getAllBySelector(NumericFieldSelectItem)[0])

      expect(queryByText(NumericFields[0])).not.toBeInTheDocument()
      expect(queryByText(NumericFields[1])).not.toBeInTheDocument()

      let serie = onChange.mock.calls[0][0][0]
      expect(serie.type).toBe('barSeries')
      expect(serie.x).toBe(StringFields[0])
      expect(serie.y).toBe('')

      let ds = onChange.mock.calls[0][1]
      expect(ds).toEqual({
        query: {
          outStatistics: [{
            statisticType: 'sum',
            onStatisticField: '',
            outStatisticFieldName: ''
          }],
          groupByFieldsForStatistics: [StringFields[0]]
        }
      })

      fireEvent.click(getBySelector(NumericFieldSelector))
      fireEvent.click(getAllBySelector(NumericFieldSelectItem)[1])

      expect(getBySelector(CategoryFieldSelector)).toHaveTextContent(StringFields[0])
      expect(getByText('Sum')).toBeInTheDocument()
      expect(queryByText(NumericFields[0])).not.toBeInTheDocument()
      expect(getByText(NumericFields[1])).toBeInTheDocument()
      expect(getBySelector(SortFieldSelector)).toHaveTextContent('Category')

      serie = onChange.mock.calls[1][0][0]
      expect(serie.type).toBe('barSeries')
      expect(serie.x).toBe(StringFields[0])
      expect(serie.y).toBe(`sum_of_${NumericFields[1]}`)

      ds = onChange.mock.calls[1][1]
      expect(ds).toEqual({
        query: {
          outStatistics: [{
            statisticType: 'sum',
            onStatisticField: NumericFields[1],
            outStatisticFieldName: `sum_of_${NumericFields[1]}`
          }],
          groupByFieldsForStatistics: [StringFields[0]]
        }
      })
    })
    it('statisticType fields change', async () => {
      const onChange = jest.fn()

      const propSeries = ColumnTemplate.series
      propSeries[0].x = StringFields[0]
      propSeries[0].y = getOutStatisticName(NumericFields[0], StatisticType.Sum)

      const props = {
        chartDataSource,
        series: Immutable(propSeries),
        useDataSources,
        orderOptions: Immutable({
          orderByFields: [`sum_of_${NumericFields[0]} ASC`],
          data: {
            orderType: 'arcgis-charts-y-value',
            preferLabel: false,
            orderBy: 'ASC'
          }
        }) as ImmutableObject<WebChartOrderOptions>,
        onChange
      }
      const { getByText, getAllByText, getBySelector, queryBySelector, getAllBySelector } = render(<Container type='barSeries' {...props} />)
      expect(getBySelector(CategoryFieldSelector)).toHaveTextContent(StringFields[0])
      expect(getByText('Sum')).toBeInTheDocument()
      expect(getAllByText('Value')[0]).toBeInTheDocument()
      expect(getBySelector(SortFieldSelector)).toHaveTextContent('Value')

      fireEvent.click(getBySelector(NumericFieldSelector))
      fireEvent.click(getAllBySelector(NumericFieldSelectItem)[1])
      expect(getByText(NumericFields[1])).toBeInTheDocument()

      fireEvent.click(getByText('Sum'))
      fireEvent.click(getByText('Max'))

      expect(getBySelector(CategoryFieldSelector)).toHaveTextContent(StringFields[0])
      await waitFor(() => {
        expect(getByText('Max')).toBeInTheDocument()
      })
      expect(getByText(NumericFields[0])).toBeInTheDocument()
      expect(getBySelector(SortFieldSelector)).toHaveTextContent('Category')

      let series = onChange.mock.calls[1][0]
      expect(series.length).toBe(2)
      expect(series[0].type).toBe('barSeries')
      expect(series[0].x).toBe(StringFields[0])
      expect(series[0].y).toBe(`max_of_${NumericFields[0]}`)

      let ds = onChange.mock.calls[1][1]
      expect(ds).toEqual({
        query: {
          outStatistics: [{
            statisticType: 'max',
            onStatisticField: NumericFields[0],
            outStatisticFieldName: `max_of_${NumericFields[0]}`
          }, {
            statisticType: 'max',
            onStatisticField: NumericFields[1],
            outStatisticFieldName: `max_of_${NumericFields[1]}`
          }],
          groupByFieldsForStatistics: [StringFields[0]]
        }
      })

      fireEvent.click(getByText('Max'))
      fireEvent.click(getByText('Count'))

      expect(getBySelector(CategoryFieldSelector)).toHaveTextContent(StringFields[0])
      await waitFor(() => {
        expect(getByText('Count')).toBeInTheDocument()
      })
      expect(queryBySelector('.numeric-fields-selector')).not.toBeInTheDocument()
      expect(getBySelector(SortFieldSelector)).toHaveTextContent('Category')

      series = onChange.mock.calls[2][0]
      expect(series.length).toBe(1)
      expect(series[0].type).toBe('barSeries')
      expect(series[0].x).toBe(StringFields[0])
      expect(series[0].y).toBe('count_of_FID')

      ds = onChange.mock.calls[2][1]
      expect(ds).toEqual({
        query: {
          outStatistics: [{
            statisticType: 'count',
            onStatisticField: 'FID',
            outStatisticFieldName: 'count_of_FID'
          }],
          groupByFieldsForStatistics: [StringFields[0]]
        }
      })
    })
    it('order by fields change', () => {
      const onChange = jest.fn()

      const series = ColumnTemplate.series
      series[0].id = NumericFields[0]
      series[0].x = StringFields[0]
      series[0].y = getOutStatisticName(NumericFields[0], StatisticType.Sum)

      const props = {
        chartDataSource,
        series: Immutable(series),
        useDataSources,
        onChange
      }
      const { getByText, getBySelector, getAllBySelector } = render(<Container type='barSeries' {...props} />)
      expect(getBySelector(CategoryFieldSelector)).toHaveTextContent(StringFields[0])
      expect(getByText('Sum')).toBeInTheDocument()
      expect(getByText(NumericFields[0])).toBeInTheDocument()
      expect(getBySelector(SortFieldSelector)).toHaveTextContent('Category')

      fireEvent.click(getBySelector(SortFieldSelector))
      fireEvent.click(getAllBySelector(SortFieldSelectorItem)[1])

      expect(getBySelector(SortFieldSelector)).toHaveTextContent('Value')

      const ds = onChange.mock.calls[0][1]
      expect(ds).toEqual({
        query: {
          outStatistics: [{
            statisticType: 'sum',
            onStatisticField: NumericFields[0],
            outStatisticFieldName: `sum_of_${NumericFields[0]}`
          }],
          groupByFieldsForStatistics: [StringFields[0]]
        }
      })
    })
  })
})
