import { React, type ImmutableObject, type ImmutableArray, css, hooks } from 'jimu-core'
import type { WebChartSeries } from '../../../../../../config'
import type { ChartTypes, WebChartAxis, WebChartLabelBehavior } from 'jimu-ui/advanced/chart'
import { SettingRow } from 'jimu-ui/advanced/setting-components'
import defaultMessages from '../../../../../translations/default'
import { DeletableCollapsePanel } from '../../../../components'
import { updateSeriesAxisPosition } from '../../../../../../utils/common'
import { AxesItem } from './axes-item'
import { PositionSwitch } from './components'

interface ValueAxisProps {
  axes: ImmutableArray<WebChartAxis>
  series: ImmutableArray<WebChartSeries>
  valueAxis: ImmutableArray<WebChartAxis>
  chartType: ChartTypes
  isHorizontal: boolean
  rotated: boolean
  labelBehavior: WebChartLabelBehavior
  onAxisChange?: (index: number, axis: ImmutableObject<WebChartAxis>) => void
  onSeriesChange?: (series: ImmutableArray<WebChartSeries>) => void
  onAxesAndSeriesChange?: (axes: ImmutableArray<WebChartAxis>, series: ImmutableArray<WebChartSeries>) => void
  handleLabelsBehaviorChange: (value: WebChartLabelBehavior, isHorizontal: boolean) => void
  showLogarithmicScale: boolean
}

const SerieLabel = (props: { color: string, label: string }): React.ReactElement => {
  const cssStyle = css`
    display: flex;
    align-items: center;
    > .color-circle {
      flex-shrink: 0;
      width: 16px;
      height: 16px;
      background-color: ${props.color};
      margin-right: var(--size-spacing-1, 4px);
      border-radius: 50%;
    }
  `
  return (
    <div css={cssStyle}>
      <div className='color-circle'></div>
      <div className='text-truncate' title={props.label}>{props.label}</div>
    </div>
  )
}

const yAxisPositionSettingStyle = css`
  .series-position-row > .jimu-widget-setting--row-label {
    max-width: 55%;
  }
`

export const ValueAxis = (props: ValueAxisProps): React.ReactElement => {
  const {
    axes: propAxes,
    series: propSeries,
    valueAxis: propValueAxis,
    chartType,
    isHorizontal,
    labelBehavior,
    rotated,
    onAxisChange,
    onSeriesChange,
    onAxesAndSeriesChange,
    handleLabelsBehaviorChange,
    showLogarithmicScale
  } = props
  const [axisIndex, setAxisIndex] = React.useState(-1)
  const translate = hooks.useTranslation(defaultMessages)
  const leftAxisSeriesCount = propSeries?.filter(series => !series?.assignToSecondValueAxis)?.length ?? 0

  const handlePositionChange = (index: number, position?: 'left' | 'right') => {
    const nextChartState = updateSeriesAxisPosition(propAxes, propSeries, index, position)
    if (onAxesAndSeriesChange) {
      onAxesAndSeriesChange(nextChartState.axes, nextChartState.series)
      return
    }

    onSeriesChange?.(nextChartState.series)
  }

  const getAxisLabel = (index: number): string => {
    if (rotated) {
      return index === 0 ? translate('downAxis') : translate('upAxis')
    }
    return index === 0 ? translate('leftAxis') : translate('rightAxis')
  }

  return <>
    <div className='y-axis-position-setting' css={yAxisPositionSettingStyle}>
      {
        propSeries.map((series: ImmutableObject<WebChartSeries>, index) => {
          const type = series.type
          const color = ((type === 'lineSeries' ? series.lineSymbol?.color : series.fillSymbol?.color) as unknown) as string
          const rightDisabled = leftAxisSeriesCount === 1 && !series.assignToSecondValueAxis
          return (
            <SettingRow key={index} className='series-position-row' label={<SerieLabel color={color} label={series.name} />} flow='no-wrap' level={2}>
              <PositionSwitch
                position={series.assignToSecondValueAxis ? 'right' : 'left'}
                rightDisabled={rightDisabled}
                rotated={rotated}
                onChange={(position) => { handlePositionChange(index, position) }}
              />
            </SettingRow>
          )
        })
      }
    </div>
    <div className='mt-4'>
      {propValueAxis?.map((axis, index) => {
        const actualAxisIndex = index + 1

        // Second value axis doesn't support grid and guide options.
        const hideAxisGrid = actualAxisIndex === 2
        const hideGuide = actualAxisIndex === 2
        return (
          <DeletableCollapsePanel
            key={actualAxisIndex}
            className={index === 0 ? '' : 'mt-3'}
            level={2}
            type='primary'
            bottomLine={false}
            label={getAxisLabel(index)}
            isOpen={axisIndex === index}
            onRequestOpen={() => { setAxisIndex(index) }}
            onRequestClose={() => { setAxisIndex(-1) }}
          >
            <AxesItem
              axis={axis}
              index={actualAxisIndex}
              chartType={chartType}
              isHorizontal={isHorizontal}
              labelBehavior={labelBehavior}
              hideAxisGrid={hideAxisGrid}
              hideGuide={hideGuide}
              handleChange={(nextAxis) => { onAxisChange?.(actualAxisIndex, nextAxis) }}
              handleLabelsBehaviorChange={handleLabelsBehaviorChange}
              showLogarithmicScale={showLogarithmicScale}
            />
          </DeletableCollapsePanel>
        )
      })}
    </div>
  </>
}
