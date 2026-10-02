import { React, type ImmutableArray, type ImmutableObject, Immutable, hooks } from 'jimu-core'
import { defaultMessages as jimuUiDefaultMessage } from 'jimu-ui'
import type { ChartTypes, WebChartAxis, WebChartLabelBehavior } from 'jimu-ui/advanced/chart'
import defaultMessages from '../../../../../translations/default'
import { SettingCollapse } from '../../../../components'
import type { WebChartSeries } from '../../../../../../config'
import { AxesItem } from './axes-item'
import { ValueAxis } from './value-axis'

export interface SerialAxesSettingProps {
  rotated: boolean
  chartType: ChartTypes
  showLogarithmicScale?: boolean
  axes: ImmutableArray<WebChartAxis>
  series: ImmutableArray<WebChartSeries>
  horizontalAxisLabelsBehavior?: WebChartLabelBehavior
  verticalAxisLabelsBehavior?: WebChartLabelBehavior
  onChange?: (axes: ImmutableArray<WebChartAxis>) => void
  onSeriesChange?: (series: ImmutableArray<WebChartSeries>) => void
  onAxesAndSeriesChange?: (axes: ImmutableArray<WebChartAxis>, series: ImmutableArray<WebChartSeries>) => void
  onHorizontalAxisLabelsBehaviorChange?: (value: WebChartLabelBehavior) => void
  onVerticalAxisLabelsBehaviorChange?: (value: WebChartLabelBehavior) => void
}

const DefaultSeries: any = Immutable([])

export const SerialAxesSetting = (props: SerialAxesSettingProps): React.ReactElement => {
  const {
    chartType,
    showLogarithmicScale = false,
    axes: propAxes,
    series: propSeries = DefaultSeries,
    rotated,
    horizontalAxisLabelsBehavior,
    verticalAxisLabelsBehavior,
    onChange,
    onSeriesChange,
    onAxesAndSeriesChange,
    onHorizontalAxisLabelsBehaviorChange,
    onVerticalAxisLabelsBehaviorChange
  } = props
  const [axisIndex, setAxisIndex] = React.useState<number>(-1)
  const translate = hooks.useTranslation(defaultMessages, jimuUiDefaultMessage)

  const useSplitBy = !!propSeries?.[0]?.query?.where
  const multiSeries = propSeries?.length > 1
  const yAxisPositionSettingVisible = !useSplitBy && multiSeries

  const axesListByType = yAxisPositionSettingVisible ? Immutable(propAxes.reduce((acc, axis, index) => {
    if (index === 0) {
      acc.push(axis)
    } else {
      if (!acc[1]) {
        acc[1] = []
      }
      acc[1].push(axis)
    }
    return acc
  }, [])) : propAxes

  const handleClick = (index: number): void => {
    setAxisIndex(index)
  }

  const handleChange = (axis: ImmutableObject<WebChartAxis>): void => {
    onChange?.(Immutable.set(propAxes, axisIndex, axis))
  }

  const handleAxisChange = (index: number, axis: ImmutableObject<WebChartAxis>): void => {
    onChange?.(Immutable.set(propAxes, index, axis))
  }

  const handleLabelsBehaviorChange = (value: WebChartLabelBehavior, isHorizontal: boolean): void => {
    isHorizontal ? onHorizontalAxisLabelsBehaviorChange?.(value) : onVerticalAxisLabelsBehaviorChange?.(value)
  }

  return (
    <div className='auto-axes-setting w-100' role='group' aria-label={translate('axes')}>
      {axesListByType?.map((axis, index) => {
        const name = index === 0 ? 'xAxis' : 'yAxis'
        const isHorizontal = (name === 'xAxis' && !rotated) || (name === 'yAxis' && rotated)
        const labelBehavior = isHorizontal ? horizontalAxisLabelsBehavior : verticalAxisLabelsBehavior

        return (
          <SettingCollapse
            level={1}
            className='mt-2'
            key={index}
            bottomLine={index === 0}
            label={translate(name)}
            aria-label={translate(name)}
            role='group'
            isOpen={axisIndex === index}
            onRequestOpen={() => { handleClick(index) }}
            onRequestClose={() => { handleClick(-1) }}
          >
            {
              index === 1 && yAxisPositionSettingVisible ?
                <ValueAxis
                  axes={propAxes}
                  valueAxis={axis as ImmutableArray<WebChartAxis>}
                  series={propSeries}
                  chartType={chartType}
                  rotated={rotated}
                  isHorizontal={isHorizontal}
                  labelBehavior={labelBehavior}
                  onAxisChange={handleAxisChange}
                  onSeriesChange={onSeriesChange}
                  onAxesAndSeriesChange={onAxesAndSeriesChange}
                  handleLabelsBehaviorChange={handleLabelsBehaviorChange}
                  showLogarithmicScale={showLogarithmicScale}
                /> :
                <AxesItem
                  axis={axis}
                  index={index}
                  chartType={chartType}
                  isHorizontal={isHorizontal}
                  labelBehavior={labelBehavior}
                  handleChange={handleChange}
                  handleLabelsBehaviorChange={handleLabelsBehaviorChange}
                  showLogarithmicScale={showLogarithmicScale}
                />
            }
          </SettingCollapse>
        )
      })}
    </div>
  )
}
