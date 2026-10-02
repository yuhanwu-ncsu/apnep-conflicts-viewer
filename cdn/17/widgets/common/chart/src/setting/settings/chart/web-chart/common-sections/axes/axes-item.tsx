import { React, type ImmutableObject } from 'jimu-core'
import type { ChartTypes, WebChartAxis, WebChartLabelBehavior } from 'jimu-ui/advanced/chart'
import { CategoryAxis } from './category-axis'
import { DateAxis } from './date-axis'
import { NumericAxis } from './numeric-axis'
import { isSerialSeries } from '../../../../../../utils/default'

interface AxesItemProps {
  axis: ImmutableObject<WebChartAxis>
  index: number
  chartType: ChartTypes
  isHorizontal: boolean
  labelBehavior: WebChartLabelBehavior
  hideAxisGrid?: boolean
  hideGuide?: boolean
  handleChange: (axis: ImmutableObject<WebChartAxis>) => void
  handleLabelsBehaviorChange: (value: WebChartLabelBehavior, isHorizontal: boolean) => void
  showLogarithmicScale?: boolean
}

export const AxesItem = (props: AxesItemProps): React.ReactElement => {
  const { axis, index, chartType, isHorizontal, labelBehavior, hideAxisGrid = false, hideGuide = false, handleChange, handleLabelsBehaviorChange, showLogarithmicScale } = props
  const type = axis.valueFormat.type
  const showValueRange = index === 0 ? (chartType === 'scatterSeries') : true
  const showIntegerOnly = index === 0 ? (chartType === 'scatterSeries') : true
  const showTickSpacing = index !== 0 ? isSerialSeries(chartType) : false
  const showGuide = (index === 0 ? !isSerialSeries(chartType) : true) && !hideGuide
  const singleNumericFormatSetting = index === 0 ? isSerialSeries(chartType) : false

  return (
    <>
      {
        type === 'category' && (
          <CategoryAxis
            axis={axis}
            className='mt-4'
            onChange={handleChange}
            isHorizontal={isHorizontal}
            labelBehavior={labelBehavior}
            hideAxisGrid={hideAxisGrid}
            onLabelBehaviorChange={handleLabelsBehaviorChange}
          />
        )
      }
      {
        type === 'number' && (
          <NumericAxis
            axis={axis}
            className='mt-4'
            showGuide={showGuide}
            hideAxisGrid={hideAxisGrid}
            isHorizontal={isHorizontal}
            showTickSpacing={showTickSpacing}
            showValueRange={showValueRange}
            showIntegerOnly={showIntegerOnly}
            showLogarithmicScale={showLogarithmicScale}
            singleNumericFormatSetting={singleNumericFormatSetting}
            labelBehavior={labelBehavior}
            onChange={handleChange}
            onLabelBehaviorChange={handleLabelsBehaviorChange} />
        )
      }
      {
        type === 'date' && (
          <DateAxis
            className='mt-4'
            axis={axis}
            labelBehavior={labelBehavior}
            hideAxisGrid={hideAxisGrid}
            onChange={handleChange}
            onLabelBehaviorChange={handleLabelsBehaviorChange} />
        )
      }
    </>
  )
}
