import { React, type ImmutableArray, hooks, type IMFeatureLayerQueryParams, type UseDataSource } from 'jimu-core'
import type { ChartRenderer, WebChartSeries } from '../../../../../../../config'
import defaultMessages from '../../../../../../translations/default'
import { SettingRow } from 'jimu-ui/advanced/setting-components'
import { AnchoredSidePanel } from '../../../../../components'
import SeriesStyleSetting from './editors/series-style-setting'
import StyleSourceSelector from './shared/style-source-selector'
import SplitBySeries from './split-by/split-by-series'
import SingleSeriesStyle from './single-series-style'

interface SeriesStyleProps {
  labelLevel?: 1 | 2 | 3
  defaultFillColor?: string
  series: ImmutableArray<WebChartSeries>
  query?: IMFeatureLayerQueryParams
  useDataSources?: ImmutableArray<UseDataSource>
  useSplitBy: boolean
  multiSeries: boolean
  colorMatch: boolean
  chartRenderer?: ChartRenderer
  colorMatchAllowed?: boolean
  onChange?: (series: ImmutableArray<WebChartSeries>) => void
  onColorMatchChange?: (colorMatch: boolean) => void
  onSingleStyleChange?: (propSeries: ImmutableArray<WebChartSeries>, props: { colorMatch: boolean, chartRenderer?: ChartRenderer }) => void
}

const SeriesStyle = (props: SeriesStyleProps): React.ReactElement => {
  const { labelLevel, defaultFillColor, useDataSources, query, series: propSeries, useSplitBy, multiSeries, colorMatch, chartRenderer, colorMatchAllowed, onChange, onColorMatchChange, onSingleStyleChange } = props

  const translate = hooks.useTranslation(defaultMessages)

  return (
    <>
      {multiSeries && !useSplitBy && <SettingRow className='mt-2'>
        <AnchoredSidePanel
          level={2}
          label={translate('seriesStyle')}
          title={translate('seriesStyle')}
          className='mt-0'
        >
          <SeriesStyleSetting
            className='pl-4 pr-3'
            markSizeVisible={multiSeries}
            headerVisibility={multiSeries}
            labelVisibility={multiSeries}
            labelLevel={labelLevel}
            series={propSeries}
            defaultFillColor={defaultFillColor}
            onChange={onChange}
          />
        </AnchoredSidePanel>
      </SettingRow>}
      {multiSeries && useSplitBy && <StyleSourceSelector value={colorMatch} onChange={onColorMatchChange} colorMatchAllowed={colorMatchAllowed} className='mt-2'>
        {!colorMatch && <AnchoredSidePanel
          level={3}
          title={translate('seriesStyle')}
          className='mt-0'
        >
          <SplitBySeries useDataSources={useDataSources} query={query} series={propSeries} onChange={onChange} />
        </AnchoredSidePanel>}
      </StyleSourceSelector>}
      {!multiSeries &&
        <SingleSeriesStyle
          labelLevel={labelLevel}
          defaultFillColor={defaultFillColor}
          series={propSeries}
          query={query}
          useDataSources={useDataSources}
          colorMatch={colorMatch}
          chartRenderer={chartRenderer}
          colorMatchAllowed={colorMatchAllowed}
          onChange={onChange}
          onColorMatchChange={onColorMatchChange}
          onSingleStyleChange={onSingleStyleChange}
        />
      }
    </>
  )
}

export default SeriesStyle
