import { React, type ImmutableArray, type UseDataSource, type ImmutableObject, type IMFeatureLayerQueryParams, hooks } from 'jimu-core'
import { SettingSection, SettingRow } from 'jimu-ui/advanced/setting-components'
import type { ChartComponentOptions, ChartMessages, ChartRenderer, IWebChart, WebChartOrderOptions, WebChartSeries } from '../../../../../config'
import { StatisticsDataSetting } from '../common-sections/data'
import { defaultMessages as jimUiDefaultMessage, CollapsablePanel } from 'jimu-ui'
import { defaultMessages as jimuBuilderDefaultMessage } from 'jimu-for-builder'
import type { WebChartLabelBehavior, WebChartStackedKinds, ChartTypes, WebChartAxis } from 'jimu-ui/advanced/chart'
import defaultMessages from '../../../../translations/default'
import { ChartSettingSection } from '../../type'
import { AppearanceSetting } from '../common-sections/appearance'
import { SerialAxesSetting } from '../common-sections/axes'
import { XYGeneralSetting } from '../common-sections/general'
import { SerialSeriesSetting } from '../common-sections/series'
import type { SeriesRelatedProps } from '../common-sections/data'
import { autoUpdateChartTileIfNecessary, normalizeValueAxesInWebChart } from '../../../../../utils/common'

export interface SerialSettingProps {
  type: ChartTypes
  template?: string
  colorMatchingApplied?: boolean
  section: ChartSettingSection
  webChart: ImmutableObject<IWebChart>
  messages: ImmutableObject<ChartMessages>
  options: ImmutableObject<ChartComponentOptions>
  useDataSources: ImmutableArray<UseDataSource>
  onOptionsChange: (options: ImmutableObject<ChartComponentOptions>) => void
  onSectionChange: (section: ChartSettingSection) => void
  onMessagesChange: (messages: ImmutableObject<ChartMessages>) => void
  onWebChartChange: (webChart: ImmutableObject<IWebChart>, query?: IMFeatureLayerQueryParams) => void
}

const SerialSetting = (props: SerialSettingProps): React.ReactElement => {
  const {
    type,
    template,
    section,
    options,
    messages,
    useDataSources,
    colorMatchingApplied,
    webChart: propWebChart,
    onSectionChange,
    onWebChartChange,
    onMessagesChange,
    onOptionsChange
  } = props

  const webChart = React.useMemo(() => {
    return normalizeValueAxesInWebChart(propWebChart)
  }, [propWebChart])

  React.useEffect(() => {
    if (webChart !== propWebChart) {
      onWebChartChange?.(webChart)
    }
  }, [webChart, propWebChart, onWebChartChange])

  const colorMatch = webChart?.colorMatch ?? false
  const rotated = webChart?.rotated ?? false
  const stackedType = webChart?.stackedType ?? 'sideBySide'
  const orderOptions = webChart?.orderOptions as ImmutableObject<WebChartOrderOptions>
  const legendValid = webChart?.series != null && webChart?.series?.length > 1
  const valueFormat = webChart?.axes?.[0]?.valueFormat
  const translate = hooks.useTranslation(defaultMessages, jimUiDefaultMessage, jimuBuilderDefaultMessage)
  const dataSourceId = useDataSources?.[0]?.dataSourceId
  const horizontalAxisLabelsBehavior = webChart?.horizontalAxisLabelsBehavior
  const verticalAxisLabelsBehavior = webChart?.verticalAxisLabelsBehavior

  const handleSeriesStatisticsChange = (series: ImmutableArray<WebChartSeries>, seriesRelatedProps: SeriesRelatedProps) => {
    const chartDataSource = seriesRelatedProps.chartDataSource
    const orderOptions = seriesRelatedProps.orderOptions
    const query = seriesRelatedProps.query
    const valueFormat = seriesRelatedProps.valueFormat
    const colorMatch = seriesRelatedProps?.colorMatch
    const chartRenderer = seriesRelatedProps?.chartRenderer
    let nextWebChart = webChart.set('series', series).set('dataSource', chartDataSource)
    nextWebChart = chartRenderer != null
      ? nextWebChart.set('chartRenderer', chartRenderer)
      : nextWebChart.without('chartRenderer')
    if (valueFormat) {
      nextWebChart = nextWebChart.setIn(['axes', '0', 'valueFormat'], valueFormat)
    }
    if (orderOptions) {
      nextWebChart = nextWebChart.set('orderOptions', orderOptions)
    }
    if (colorMatch != null) {
      nextWebChart = nextWebChart.set('colorMatch', colorMatch)
    }
    nextWebChart = autoUpdateChartTileIfNecessary(webChart, nextWebChart, dataSourceId, translate)
    onWebChartChange?.(nextWebChart, query)
  }

  const handleSeriesChange = (series: ImmutableArray<WebChartSeries>, seriesRelatedProps?: { valueFormat?: any, colorMatch?: boolean, chartRenderer?: ChartRenderer }) => {
    const valueFormat = seriesRelatedProps?.valueFormat
    const colorMatch = seriesRelatedProps?.colorMatch
    const chartRenderer = seriesRelatedProps?.chartRenderer
    let nextWebChart = webChart.set('series', series)
    nextWebChart = chartRenderer != null
      ? nextWebChart.set('chartRenderer', chartRenderer)
      : nextWebChart.without('chartRenderer')
    if (valueFormat) {
      nextWebChart = nextWebChart.setIn(['axes', '0', 'valueFormat'], valueFormat)
    }
    if (colorMatch != null) {
      nextWebChart = nextWebChart.set('colorMatch', colorMatch)
    }
    onWebChartChange?.(nextWebChart)
  }

  const handleStackedTypeChange = (stackedType: WebChartStackedKinds) => {
    onWebChartChange?.(webChart.set('stackedType', stackedType))
  }

  const handleAxesChange = (axes: ImmutableArray<WebChartAxis>): void => {
    onWebChartChange?.(webChart.set('axes', axes))
  }

  const handleAxesSeriesChange = (series: ImmutableArray<WebChartSeries>): void => {
    onWebChartChange?.(webChart.set('series', series))
  }

  const handleAxesAndSeriesChange = (axes: ImmutableArray<WebChartAxis>, series: ImmutableArray<WebChartSeries>): void => {
    onWebChartChange?.(webChart.set('axes', axes).set('series', series))
  }

  const handleHorizontalAxisLabelsBehaviorChange = (value: WebChartLabelBehavior): void => {
    onWebChartChange?.(webChart.set('horizontalAxisLabelsBehavior', value))
  }

  const handleVerticalAxisLabelsBehaviorChange = (value: WebChartLabelBehavior): void => {
    onWebChartChange?.(webChart.set('verticalAxisLabelsBehavior', value))
  }

  return (
    <>
      <SettingSection>
        <CollapsablePanel
          label={translate('data')}
          aria-label={translate('data')}
          isOpen={section === ChartSettingSection.Data}
          onRequestOpen={() => { onSectionChange(ChartSettingSection.Data) }}
          onRequestClose={() => { onSectionChange(ChartSettingSection.None) }}
        >
          <SettingRow flow='wrap' aria-label={translate('data')} role='group'>
            <StatisticsDataSetting
              type={type}
              template={template}
              valueFormat={valueFormat}
              orderOptions={orderOptions}
              chartDataSource={webChart?.dataSource}
              useDataSources={useDataSources}
              series={webChart?.series}
              onChange={handleSeriesStatisticsChange}
            />
          </SettingRow>
        </CollapsablePanel>
      </SettingSection>
      <SettingSection>
        <CollapsablePanel
          aria-label={translate('series')}
          label={translate('series')}
          isOpen={section === ChartSettingSection.Series}
          onRequestOpen={() => { onSectionChange(ChartSettingSection.Series) }}
          onRequestClose={() => { onSectionChange(ChartSettingSection.None) }}
        >
          <SettingRow flow='wrap'>
            <SerialSeriesSetting
              rotated={rotated}
              stackedType={stackedType}
              colorMatch={colorMatch}
              chartRenderer={webChart?.chartRenderer}
              colorMatchingApplied={colorMatchingApplied}
              series={webChart?.series}
              useDataSources={useDataSources}
              options={options}
              query={webChart?.dataSource?.query}
              onChange={handleSeriesChange}
              onOptionsChange={onOptionsChange}
              onStackedTypeChange={handleStackedTypeChange}
            />
          </SettingRow>
        </CollapsablePanel>
      </SettingSection>
      <SettingSection>
        <CollapsablePanel
          label={translate('axes')}
          aria-label={translate('axes')}
          isOpen={section === ChartSettingSection.Axes}
          onRequestOpen={() => { onSectionChange(ChartSettingSection.Axes) }}
          onRequestClose={() => { onSectionChange(ChartSettingSection.None) }}
        >
          <SettingRow flow='wrap'>
            <SerialAxesSetting
              chartType={type}
              rotated={rotated}
              axes={webChart?.axes}
              series={webChart?.series}
              onChange={handleAxesChange}
              onSeriesChange={handleAxesSeriesChange}
              onAxesAndSeriesChange={handleAxesAndSeriesChange}
              verticalAxisLabelsBehavior={verticalAxisLabelsBehavior}
              horizontalAxisLabelsBehavior={horizontalAxisLabelsBehavior}
              onVerticalAxisLabelsBehaviorChange={handleVerticalAxisLabelsBehaviorChange}
              onHorizontalAxisLabelsBehaviorChange={handleHorizontalAxisLabelsBehaviorChange}
            />
          </SettingRow>
        </CollapsablePanel>
      </SettingSection>
      <SettingSection>
        <CollapsablePanel
          label={translate('general')}
          aria-label={translate('general')}
          isOpen={section === ChartSettingSection.General}
          onRequestOpen={() => { onSectionChange(ChartSettingSection.General) }}
          onRequestClose={() => { onSectionChange(ChartSettingSection.None) }}
        >
          <SettingRow flow='wrap'>
            <XYGeneralSetting
              rotatable={true}
              messages={messages}
              value={webChart}
              legendValid={legendValid}
              onChange={onWebChartChange}
              onMessagesChange={onMessagesChange}
            />
          </SettingRow>
        </CollapsablePanel>
      </SettingSection>
      <SettingSection>
        <CollapsablePanel
          label={translate('appearance')}
          aria-label={translate('appearance')}
          isOpen={section === ChartSettingSection.Appearance}
          onRequestOpen={() => { onSectionChange(ChartSettingSection.Appearance) }}
          onRequestClose={() => { onSectionChange(ChartSettingSection.None) }}
        >
          <SettingRow flow='wrap'>
            <AppearanceSetting
              webChart={webChart}
              onChange={onWebChartChange}
            />
          </SettingRow>
        </CollapsablePanel>
      </SettingSection>
    </>
  )
}

export default SerialSetting
