import type { StatisticDefinition, FeatureLayerQueryParams, ImmutableObject, SqlExpression } from 'jimu-core'
import type {
  WebChart as _WebChart,
  WebGaugeChart,
  WebChartSeries as _WebChartSeries,
  WebChartBarChartSeries,
  WebChartLineChartSeries,
  WebChartGaugeAxis,
  WebChartAxis,
  WebChartOrderSeriesBy,
  WebChartDirectionalDataOrder,
  WebChartPredefinedLabelsDataOrder
} from 'jimu-ui/advanced/chart'

interface WebChartSeriesQuery extends FeatureLayerQueryParams {
  fetchNullValues?: boolean
}

export type WebChartSeries = Omit<_WebChartSeries, 'query'> & {
  query?: WebChartSeriesQuery
  //add for custom added split-by series, will be removed at runtime
  deletable?: boolean
  lineSmoothed?: WebChartLineChartSeries['lineSmoothed']
  fillSymbol?: WebChartBarChartSeries['fillSymbol']
  lineSymbol?: WebChartLineChartSeries['lineSymbol']
  markerVisible?: WebChartLineChartSeries['markerVisible']
  markerSymbol?: WebChartLineChartSeries['markerSymbol']
}

export type HistogramOverlaysType = 'mean' | 'median' | 'standardDeviation' | 'comparisonDistribution'

export interface ChartDataSource {
  query: FeatureLayerQueryParams
}

interface WebChart extends Omit<_WebChart, 'axes'>, Omit<WebGaugeChart, 'axes'> {
  axes?: [WebChartAxis, WebChartAxis?, WebChartAxis?] | [WebChartGaugeAxis]
}

export type ChartRenderer = WebChart['chartRenderer']

export interface ChartComponentOptions {
  /**
    * Show the series on the chart even if it doesn't have data (i.e. empty)
    *
    * When `false`, the empty series are completely hidden from the chart and the legend.
    * For example a series can be empty after applying a data filter, filter by attribute or geometry (as when using the filter by extent).
    * @default false
    */
  showEmptySeries?: boolean
}

export interface WebChartOrderOptions {
  /**
   * How series should be ordered and displayed in a multi-series chart.
   * If not provided the series will be displayed as they are ordered in the config.
   */
  series?: WebChartOrderSeriesBy
  /**
   * How data for a chart should be ordered. It is recommended to use this property over its sibling `orderByFields` to order the chart data.
   *
   * If not provided, the data will be displayed as it was retrieved from the server. No additional ordering will be applied.
   */
  data?: WebChartDirectionalDataOrder | WebChartPredefinedLabelsDataOrder
  /**
   * The orderByFields to be sent with the query when retrieving data for the chart.
   *
   * Use this property for unique cases such as to order data by multiple fields.
   * In case both this property and its sibling `data` object are provided, the `data` property will be used.
   */
  orderByFields?: string[]
}

export interface IWebChart extends Omit<WebChart, 'background' | 'series'> {
  dataSource: ChartDataSource
  background?: string
  series: WebChartSeries[]
}

export enum CategoryType {
  ByGroup = 'BYGROUP',
  ByField = 'BYFIELD'
}

export interface ChartTools {
  filter?: SqlExpression
  cursorEnable?: boolean
}

export interface ChartMessages {
  noDataMessage?: string
}

export type ChartType = 'column' | 'bar' | 'line' | 'combo' | 'area' | 'pie' | 'scatter' | 'histogram' | 'gauge'

export type TemplateType = 'bar' | 'stacked-bar' | 'stacked100-bar'
| 'column' | 'stacked-column' | 'stacked100-column'
| 'combo'
| 'line' | 'smooth-line'
| 'area' | 'smooth-area'
| 'pie' | 'donut'
| 'scatter'
| 'histogram'
| 'gauge'

export interface Config {
  //It is only used when configuring the app template
  _templateType?: TemplateType
  template: string
  webChart: IWebChart
  tools?: ChartTools
  options?: ChartComponentOptions
  messages?: ChartMessages
}

export type IMConfig = ImmutableObject<Config>

export type ChartStatisticType = Omit<StatisticDefinition['statisticType'], 'stddev' | 'var' | 'percentile_cont' | 'percentile_disc'> | 'percentile-continuous' | 'no_aggregation'
