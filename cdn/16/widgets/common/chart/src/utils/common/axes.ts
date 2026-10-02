import { Immutable, type ImmutableArray, type ImmutableObject } from 'jimu-core'
import type { WebChartAxis } from 'jimu-ui/advanced/chart'
import type { IWebChart, WebChartSeries } from '../../config'
import { getValueAxis } from '../default'

export const PrimaryValueAxisIndex = 1
export const SecondaryValueAxisIndex = 2

export const hasSecondaryValueAxisSeries = (
  series?: ImmutableArray<WebChartSeries>
): boolean => {
  return series?.some(serie => !!serie?.assignToSecondValueAxis) ?? false
}

export const createSecondaryValueAxis = (
  primaryAxis?: ImmutableObject<WebChartAxis>
): ImmutableObject<WebChartAxis> => {
  let axis = Immutable(getValueAxis('', true, primaryAxis?.labels?.visible)) as ImmutableObject<WebChartAxis>

  if (!primaryAxis) {
    return axis
  }

  axis = axis
    .set('visible', primaryAxis.visible ?? true)
    .set('labels', primaryAxis.labels)
    .set('valueFormat', primaryAxis.valueFormat)

  if (primaryAxis.lineSymbol) {
    axis = axis.set('lineSymbol', primaryAxis.lineSymbol)
  }

  return axis
}

export const syncValueAxesWithSeries = (
  axes?: ImmutableArray<WebChartAxis>,
  series?: ImmutableArray<WebChartSeries>
): ImmutableArray<WebChartAxis> => {
  if (!axes) {
    return axes
  }

  const hasSecondaryAxis = hasSecondaryValueAxisSeries(series)
  const trimmedAxes = axes.length > SecondaryValueAxisIndex + 1
    ? Immutable(axes.slice(0, SecondaryValueAxisIndex + 1)) as ImmutableArray<WebChartAxis>
    : axes

  if (!hasSecondaryAxis) {
    return trimmedAxes.length > SecondaryValueAxisIndex
      ? Immutable(trimmedAxes.slice(0, SecondaryValueAxisIndex)) as ImmutableArray<WebChartAxis>
      : trimmedAxes
  }

  if (trimmedAxes[SecondaryValueAxisIndex] || !trimmedAxes[PrimaryValueAxisIndex]) {
    return trimmedAxes
  }

  return Immutable([
    ...trimmedAxes,
    createSecondaryValueAxis(trimmedAxes[PrimaryValueAxisIndex])
  ]) as ImmutableArray<WebChartAxis>
}

export const updateSeriesAxisPosition = (
  axes: ImmutableArray<WebChartAxis>,
  series: ImmutableArray<WebChartSeries>,
  seriesIndex: number,
  position?: 'left' | 'right'
): {
    axes: ImmutableArray<WebChartAxis>
    series: ImmutableArray<WebChartSeries>
  } => {
  const nextSerie = position === 'right'
    ? series[seriesIndex].set('assignToSecondValueAxis', true)
    : series[seriesIndex].without('assignToSecondValueAxis')

  const nextSeries = Immutable.set(
    series,
    seriesIndex,
    nextSerie
  )

  return {
    axes: syncValueAxesWithSeries(axes, nextSeries),
    series: nextSeries
  }
}

export const normalizeValueAxesInWebChart = (
  webChart: ImmutableObject<IWebChart>
): ImmutableObject<IWebChart> => {
  if (!webChart?.axes) {
    return webChart
  }

  const axes = syncValueAxesWithSeries(webChart.axes as ImmutableArray<WebChartAxis>, webChart.series)
  return axes === webChart.axes ? webChart : webChart.set('axes', axes)
}