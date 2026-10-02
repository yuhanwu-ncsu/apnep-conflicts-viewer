import type { DateType } from '../../config'

export interface DateProps {
  label: string
  autoApply: boolean
  range: boolean
  defaultDate: DateType
  onDateChange?: (dates: DateType) => void
  clearVersion?: number
}