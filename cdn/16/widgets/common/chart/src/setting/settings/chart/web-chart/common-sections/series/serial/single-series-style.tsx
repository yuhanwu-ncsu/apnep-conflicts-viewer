import { React, hooks, type ImmutableArray, type IMFeatureLayerQueryParams, type ImmutableObject, type UseDataSource } from 'jimu-core'
import defaultMessages from '../../../../../../translations/default'
import { convertSerialSeriesRenderType, getCategoryType, type SerialSeriesRenderType } from '../../../../../../../utils/common'
import { CategoryType, type ChartRenderer, type WebChartSeries } from '../../../../../../../config'
import { SettingRow } from 'jimu-ui/advanced/setting-components'
import SerieTypeSelector from './editors/serie-type-selector'
import StyleSourceSelector from './shared/style-source-selector'
import SeriesStyleSetting from './editors/series-style-setting'
import SingleBarSeriesStyle from './single-bar/single-bar-series-style'

interface SingleSeriesStyleProps {
  labelLevel?: 1 | 2 | 3
  defaultFillColor?: string
  series: ImmutableArray<WebChartSeries>
  query?: IMFeatureLayerQueryParams
  useDataSources?: ImmutableArray<UseDataSource>
  colorMatch: boolean
  chartRenderer?: ChartRenderer
  colorMatchAllowed?: boolean
  onChange?: (series: ImmutableArray<WebChartSeries>) => void
  onColorMatchChange?: (colorMatch: boolean) => void
  onSingleStyleChange?: (propSeries: ImmutableArray<WebChartSeries>, props: { colorMatch: boolean, chartRenderer?: ChartRenderer }) => void
}

const SingleSeriesStyle = (props: SingleSeriesStyleProps): React.ReactElement => {
  const { labelLevel = 3, defaultFillColor, series: propSeries, query, useDataSources, colorMatch, chartRenderer, colorMatchAllowed, onChange, onColorMatchChange, onSingleStyleChange } = props

  const translate = hooks.useTranslation(defaultMessages)
  const categoryType = getCategoryType(query)
  const isByField = categoryType === CategoryType.ByField
  const serie = propSeries?.[0] as ImmutableObject<WebChartSeries>
  const isLineSeries = serie?.type === 'lineSeries'
  const defaultLineColor = defaultFillColor
  const replaceSerie = React.useCallback((nextSerie: ImmutableObject<WebChartSeries>): ImmutableArray<WebChartSeries> => {
    return propSeries?.map((currentSerie, index) => {
      return (index === 0 ? nextSerie : currentSerie) as any
    }) as ImmutableArray<WebChartSeries>
  }, [propSeries])
  const emitStyleChange = React.useCallback((nextSerie: ImmutableObject<WebChartSeries>, nextColorMatch = colorMatch, nextChartRenderer = chartRenderer): void => {
    onSingleStyleChange?.(replaceSerie(nextSerie), { colorMatch: nextColorMatch, chartRenderer: nextChartRenderer })
  }, [chartRenderer, colorMatch, onSingleStyleChange, replaceSerie])

  const handleSerieTypeChange = React.useCallback((renderType: SerialSeriesRenderType): void => {
    const nextSerie = convertSerialSeriesRenderType(serie, renderType, defaultFillColor, defaultLineColor)
    emitStyleChange(nextSerie, colorMatch, undefined)
  }, [colorMatch, defaultFillColor, defaultLineColor, emitStyleChange, serie])

  return (
    <>
      <SettingRow level={2} label={translate('renderAs')} flow='no-wrap' className='mt-2'>
        <SerieTypeSelector
          serie={serie}
          onChange={handleSerieTypeChange}
        />
      </SettingRow>
      {isLineSeries && !isByField && <StyleSourceSelector value={colorMatch} onChange={onColorMatchChange} colorMatchAllowed={colorMatchAllowed} />}
      {isLineSeries && (!colorMatch || isByField) && <SeriesStyleSetting
        markSizeVisible={false}
        headerVisibility={false}
        labelVisibility={true}
        labelLevel={labelLevel}
        series={propSeries}
        defaultFillColor={defaultFillColor}
        hideSeriesTypeSelector={true}
        onChange={onChange}
      />}
      {!isLineSeries && <SingleBarSeriesStyle
        defaultFillColor={defaultFillColor}
        series={propSeries}
        query={query}
        useDataSources={useDataSources}
        colorMatch={colorMatch}
        chartRenderer={chartRenderer}
        colorMatchAllowed={colorMatchAllowed}
        onSingleStyleChange={onSingleStyleChange}
      />}
    </>
  )
}

export default SingleSeriesStyle
