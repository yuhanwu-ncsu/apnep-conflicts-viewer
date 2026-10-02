import { React, type ImmutableArray, type ImmutableObject, classNames, Immutable, hooks, type IMFeatureLayerQueryParams, type UseDataSource } from 'jimu-core'
import type { WebChartSeries } from '../../../../../../../../config'
import { DefaultSplitByOtherSeriesColor, getSeriesFillColor } from '../../../../../../../../utils/default'
import defaultMessages from '../../../../../../../translations/default'
import { SeriesItem } from '../editors/series-item'
import { styled } from 'jimu-theme'
import { SplitByOtherSeriesValue } from '../../../../../../../../../src/constants'
import { SerieAdder } from './serie-adder'
import { getSplitByField, getSplitByValue } from 'jimu-ui/advanced/chart'
import { applySeriesColors, createSplitBySerieFromSeries, getFieldType, getSplitByFieldValues } from '../../../../../../../../../src/utils/common'
import type { ValidityResult } from 'jimu-ui'
import { SeriesLoader } from './series-loader'
import { ColorsSelector } from '../../components'

type SplitByValue = string | number | null

const sortSplitByValues = (values: SplitByValue[]): SplitByValue[] => {
  const normalValues: Array<string | number> = []
  let hasNull = false
  let hasUndefined = false

  values.forEach((value) => {
    if (value === SplitByOtherSeriesValue) {
      hasUndefined = true
      return
    }

    if (value === null) {
      hasNull = true
      return
    }

    if (!normalValues.includes(value)) {
      normalValues.push(value)
    }
  })

  const result: SplitByValue[] = [...normalValues]
  if (hasNull) {
    result.push(null)
  }
  if (hasUndefined) {
    result.push(SplitByOtherSeriesValue)
  }
  return result
}

const isNullSerie = (serie: ImmutableObject<WebChartSeries>): boolean => {
  if (serie?.id === SplitByOtherSeriesValue) return false
  return getSplitByValue({ where: serie?.query?.where, normalize: true }) === null
}

interface SplitBySeriesSettingProps {
  className?: string
  series: ImmutableArray<WebChartSeries>
  query?: IMFeatureLayerQueryParams
  useDataSources?: ImmutableArray<UseDataSource>
  onChange?: (series: ImmutableArray<WebChartSeries>) => void
}

const Root = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  position: relative;
  color: var(--ref-palette-neutral-1100);
  > .body {
    width: 100%;
    height: calc(100% - 43px);
    > .series-list {
      width: 100%;
      max-height: 85%;
      overflow-y: auto;
    }
  }
  > .footer {
    height: 43px;
    width: 100%;
    border-top: 1px solid #6a6a6a;
    > div {
      display: flex;
      width: 100%;
      justify-content: space-between;
      .colors-selector {
        width: 80%;
      }
    }
  }
`

const SplitBySeries = (props: SplitBySeriesSettingProps): React.ReactElement => {
  const { className, series: propSeries, query, useDataSources, onChange } = props
  const translate = hooks.useTranslation(defaultMessages)
  const dataSourceId = useDataSources?.[0]?.dataSourceId
  const listCount = propSeries?.length ?? 0
  const ref = React.useRef<HTMLDivElement>(null)
  const [colors, setColors] = React.useState<string[]>()
  const fetchNullValues = propSeries?.[0]?.query?.fetchNullValues ?? false

  const splitByField = getSplitByField(propSeries?.[0]?.query?.where, true)
  const splitByFieldType = React.useMemo(() => {
    if (splitByField) {
      return getFieldType(splitByField, dataSourceId)
    }
  }, [splitByField, dataSourceId])

  const splitByValues = React.useMemo(() => {
    return getSplitByFieldValues(propSeries) ?? []
  }, [propSeries])

  const orderedSeries = React.useMemo(() => {
    const normalSeries: Array<ImmutableObject<WebChartSeries>> = []
    let nullSerie: ImmutableObject<WebChartSeries> | null = null
    let undefinedSerie: ImmutableObject<WebChartSeries> | null = null

    propSeries?.forEach((serie) => {
      if (serie.id === SplitByOtherSeriesValue) {
        undefinedSerie = serie
        return
      }

      if (isNullSerie(serie)) {
        nullSerie = serie
        return
      }

      normalSeries.push(serie)
    })

    const series = [...normalSeries]
    if (nullSerie) {
      series.push(nullSerie)
    }
    if (undefinedSerie) {
      series.push(undefinedSerie)
    }
    return series
  }, [propSeries])

  const [serieIndex, setSerieIndex] = React.useState<number>(-1)
  const handleClick = (index: number): void => {
    setSerieIndex(index)
  }

  const handleChange = (serie: ImmutableObject<WebChartSeries>): void => {
    const series = Immutable.set(propSeries, serieIndex, serie)
    onChange?.(series)
  }

  const validity = React.useCallback(
    (value): ValidityResult => {
      value = value.trim()
      if (!value) {
        return {
          valid: false,
          msg: translate('seriesNameEmptyTip')
        }
      }
      const existed = splitByValues.includes(value)
      if (existed) {
        return {
          valid: false,
          msg: translate('seriesExist')
        }
      }
      return { valid: true }
    },
    [splitByValues, translate]
  )

  const handleSerieAdded = (splitByValue: string | number) => {
    if (splitByValue == null) return
    const otherSerie = propSeries[propSeries.length - 1]
    const preSerie = propSeries[propSeries.length - 2]
    const preSerieColor = (preSerie as any).fillSymbol?.color ?? (preSerie as any).lineSymbol?.color
    const newSerie = createSplitBySerieFromSeries(propSeries, query, splitByFieldType, [splitByValue], true, { colors, preSerieColor })[0]
    let series = propSeries.filter((value) => value.id !== SplitByOtherSeriesValue)
    series = series.concat(newSerie)
    series = series.concat(otherSerie)
    onChange?.(series)
  }

  const handleSplitByValuesChange = (values: SplitByValue[]) => {
    const orderedValues = sortSplitByValues(values)
    const series = createSplitBySerieFromSeries(propSeries, query, splitByFieldType, orderedValues, false, { colors })
    onChange?.(Immutable(series))
  }

  const handleColorsChange = (colors: string[]) => {
    setColors(colors)
    const series = applySeriesColors(propSeries, colors)
    onChange?.(series)
  }

  const handleDelete = (seriesId: string) => {
    const series = propSeries.filter(serie => serie.id !== seriesId)
    onChange?.(series)
  }

  React.useEffect(() => {
    const nodes = ref.current.querySelectorAll('.series-item')
    const node = nodes[listCount - 2]
    node?.scrollIntoView()
  }, [listCount])

  return (<Root className={classNames('split-by-series-setting-series', className)} role='group' aria-label={translate('sliceColor')}>
    <div className='body'>
      <div className='series-list pl-4 pr-3' ref={ref}>
        {orderedSeries?.map((serie, index) => {
          const defaultColor = serie.id === SplitByOtherSeriesValue ? DefaultSplitByOtherSeriesColor : getSeriesFillColor(index)
          const undefinedItem = serie.id === SplitByOtherSeriesValue
          const nullItem = isNullSerie(serie)
          const specialItem = undefinedItem || nullItem
          const previousSerie = index > 0 ? orderedSeries[index - 1] : null
          const previousSpecialItem = previousSerie ? previousSerie.id === SplitByOtherSeriesValue || isNullSerie(previousSerie) : false
          const type = serie.type
          const color = ((type === 'lineSeries' ? serie.lineSymbol?.color : serie.fillSymbol?.color) as unknown) as string
          return (
            <SeriesItem
              className={classNames({ 'mt-2': index !== 0 })}
              key={serie.id}
              isOpen={serieIndex === index}
              value={serie}
              headerVisibility={true}
              labelVisibility={!specialItem}
              dividerVisibility={specialItem && !previousSpecialItem}
              deletable={serie.deletable}
              showSeriesColor={true}
              seriesColor={color}
              onChange={handleChange}
              onDelete={handleDelete}
              defaultColor={defaultColor}
              onRequestOpen={() => { handleClick(index) }}
              onRequestClose={() => { handleClick(-1) }}
            />
          )
        }
        )}
      </div>
      <SerieAdder
        className='pl-4 pr-3 mt-2'
        fieldType={splitByFieldType}
        validity={validity}
        onChange={handleSerieAdded}
      />
    </div>
    <div className='footer'>
      <div className='px-4'>
        <SeriesLoader className='my-2' dataSourceId={dataSourceId} splitByField={splitByField} values={splitByValues} fetchNullValues={fetchNullValues} onChange={handleSplitByValuesChange}></SeriesLoader>
        <ColorsSelector label={translate('applySeriesColorsTip')} className='my-2' onChange={handleColorsChange} />
      </div>
    </div>
  </Root>)
}

export default SplitBySeries