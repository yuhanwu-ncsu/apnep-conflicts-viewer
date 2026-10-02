import { React, type IMIconResult } from 'jimu-core'
import { type DateType, FilterStyle, SelectionMode } from '../../config'
import IconDatePicker from './icon-date-picker'
import InputDatePicker from './input-date-picker'
import InlineDatePicker from './inline-date-picker'
import { getDatesForDefaultDay } from './utils'

export interface DatePickerProps {
  label: string
  icon: string | IMIconResult
  style: FilterStyle
  autoWidth: boolean
  layoutId: string
  layoutItemId: string
  mode: SelectionMode
  defaultDay: DateType
  autoApply: boolean
  version?: number // to force reset date picker when version is changed.
  clearVersion?: number // to force clear date picker when clearVersion is changed.
  onChange?: (dates: DateType) => void
}

export const DatePicker = (props: DatePickerProps) => {
  const {
    label,
    style,
    icon, // icon style props
    autoWidth, layoutId, layoutItemId, // input style props
    mode,
    defaultDay,
    autoApply,
    version,
    clearVersion,
    onChange
  } = props
  const [ selectedDate, setSelectedDate ] = React.useState<DateType>(undefined)

  React.useEffect(() => {
    const ymdList = getDatesForDefaultDay(defaultDay, mode)
    setSelectedDate(ymdList)
  }, [defaultDay, mode, version])

  const onDateChange = (dates: DateType) => {
    setSelectedDate(dates)
    onChange(dates)
  }

  if (selectedDate === undefined) {
    return null
  }

  const dateProps = {
    label: label,
    range: mode === SelectionMode.Range,
    defaultDate: selectedDate,
    autoApply: autoApply,
    onDateChange: onDateChange
  }

  if (style === FilterStyle.Inline) {
    return <InlineDatePicker {...dateProps} version={version} clearVersion={clearVersion} />
  } else if (style === FilterStyle.Icon) {
    return <IconDatePicker {...dateProps} version={version} icon={icon} clearVersion={clearVersion} />
  } else { // input
    return <InputDatePicker {...dateProps} autoWidth={autoWidth} layoutId={layoutId} layoutItemId={layoutItemId} clearVersion={clearVersion} />
  }
}

export default DatePicker
