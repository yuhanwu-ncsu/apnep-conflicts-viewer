import { React, type ImmutableArray, classNames, type ImmutableObject, Immutable, type IMFeatureLayerQueryParams, type UseDataSource } from 'jimu-core'
import { getSeriesFillColor } from '../../../../../../../../utils/default'
import type { WebChartSeries } from '../../../../../../../../config'
import { SeriesItem } from './series-item'


interface SeriesStyleSettingProps {
  className?: string
  markSizeVisible?: boolean
  headerVisibility?: boolean
  labelVisibility?: boolean
  labelLevel?: 1 | 2 | 3
  defaultFillColor?: string
  series: ImmutableArray<WebChartSeries>
  query?: IMFeatureLayerQueryParams
  useDataSources?: ImmutableArray<UseDataSource>
  hideSeriesTypeSelector?: boolean
  onChange?: (series: ImmutableArray<WebChartSeries>) => void
}

const SeriesStyleSetting = (props: SeriesStyleSettingProps): React.ReactElement => {
  const { className, headerVisibility = true, labelVisibility = true, labelLevel, markSizeVisible = true, series: propSeries, hideSeriesTypeSelector = false, onChange } = props

  const [serieIndex, setSerieIndex] = React.useState<number>(headerVisibility ? -1 : 0)
  const handleClick = (index: number): void => {
    setSerieIndex(index)
  }

  const handleChange = (serie: ImmutableObject<WebChartSeries>): void => {
    const series = Immutable.set(propSeries, serieIndex, serie)
    onChange?.(series)
  }

  return (<div className={classNames('serial-series-setting-series', className)}>
    {propSeries?.map((serie, index) => {
      const type = serie.type
      const defaultFillColor = getSeriesFillColor(index)
      const color = ((type === 'lineSeries' ? serie.lineSymbol?.color : serie.fillSymbol?.color) as unknown) as string
      return (
        <SeriesItem
          key={index}
          className={classNames({ 'mt-2': index !== 0 }, 'pr-1')}
          markSizeVisible={markSizeVisible}
          headerVisibility={headerVisibility}
          labelVisibility={labelVisibility}
          labelLevel={labelLevel}
          isOpen={serieIndex === index}
          value={serie}
          showSeriesColor={true}
          seriesColor={color}
          onChange={handleChange}
          defaultColor={defaultFillColor}
          hideSeriesTypeSelector={hideSeriesTypeSelector}
          onRequestOpen={() => { handleClick(index) }}
          onRequestClose={() => { handleClick(-1) }}
        />
      )
    }
    )}
  </div>)
}

export default SeriesStyleSetting