import { colorUtils, styled } from 'jimu-theme'
import { React, ReactResizeDetector, getAppStore } from 'jimu-core'
import 'calcite-components'
import type { DateProps } from './types'

const InputDatePickerRoot = styled('div')(() => {
  const overlayBgColor = 'var(--sys-color-surface-overlay)'
  const textColor = 'var(--sys-color-surface-overlay-text)'
  const hoverColor = 'color-mix(in srgb, #000000 20%, transparent)'
  return {
    'calcite-input-date-picker': {
      borderWidth: '0px',
      // input corner, set it as 0 because the range style does not support radius.
      '--calcite-input-date-picker-corner-radius': '0px',
      // date picker's corner on popper, set the same value as the popper's corner because the popper does not support customized radius.
      '--calcite-input-date-picker-calendar-corner-radius': '0.25rem',
      // month select
      '--calcite-select-background-color': overlayBgColor,
      '--calcite-input-date-picker-calendar-month-select-text-color': textColor,
      '--calcite-input-date-picker-calendar-icon-color': textColor,
      '--calcite-input-date-picker-calendar-icon-color-hover': textColor,
      // year input
      '--calcite-input-date-picker-calendar-year-text-color': textColor,
      // month navigation buttons
      '--calcite-input-date-picker-calendar-actions-background-color': 'transparent',
      '--calcite-input-date-picker-calendar-actions-background-color-hover': hoverColor,
      '--calcite-input-date-picker-calendar-actions-text-color': textColor,
      '--calcite-input-date-picker-calendar-actions-text-color-press': textColor,
      // days
      '--calcite-input-date-picker-calendar-day-range-background-color': colorUtils.colorMixOpacity('var(--sys-color-action-selected)', 0.2),
      '--calcite-input-date-picker-calendar-day-text-color': textColor,
      '--calcite-input-date-picker-calendar-day-text-color-hover': textColor,
    }
  }
})

interface InputDatePickerProps extends DateProps {
  autoWidth: boolean
  layoutId: string
  layoutItemId: string
}

export const InputDatePicker = (props: InputDatePickerProps) => {
  const { label, range, defaultDate, onDateChange, autoWidth, layoutId, layoutItemId, clearVersion } = props
  const [layout, setLayout] = React.useState<'horizontal' | 'vertical'>(null)
  const inputRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    setLayout(getlayoutDirection(inputRef.current?.clientWidth))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [range])

  React.useEffect(() => {
    if (clearVersion) {
      onDateChange(null)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clearVersion])

  const getlayoutDirection = (width: number) => {
    if (!range) {
      return 'horizontal'
    }
    return width > 352 ? 'horizontal' : 'vertical' // 360px including the padding
  }

  const onResize = ({ width }) => {
    if (autoWidth) { // get bbox.width from layout for autoWidth
      const runtimeState = getAppStore().getState()
      const layoutItem = runtimeState?.appConfig?.layouts?.[layoutId]?.content?.[layoutItemId]
      if (!layoutItem) {
        return
      }
      const w = layoutItem.bbox.width
      if (w.includes('px')) {
        width = w
      } else {
        const selector = `div.layout[data-layoutid=${layoutId}]`
        const parentElement = document.querySelector(selector)
        const { clientWidth = 480 } = parentElement || {}
        width = clientWidth * parseInt(w.split('%')[0]) / 100
      }
    }
    setLayout(getlayoutDirection(width))
  }

  const onCalciteDateChange = (event: any) => {
    const { value } = event.target as unknown as HTMLCalciteInputDatePickerElement
    onDateChange(value)
  }

  return (
    <InputDatePickerRoot className='input-date-picker' ref={el => { inputRef.current = el }}>
      {range && <ReactResizeDetector targetRef={inputRef} handleWidth onResize={onResize} />}
      <calcite-input-date-picker
        aria-label={label}
        range={range}
        layout={layout}
        value={defaultDate || ''}
        calendars={1}
        oncalciteInputDatePickerChange={onCalciteDateChange}
      />
    </InputDatePickerRoot>
  )
}

export default InputDatePicker
