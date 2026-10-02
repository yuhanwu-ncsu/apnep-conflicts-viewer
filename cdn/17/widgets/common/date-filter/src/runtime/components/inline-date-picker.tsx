import { colorUtils, styled } from 'jimu-theme'
import { dateUtils, hooks, React } from 'jimu-core'
import { Button, defaultMessages } from 'jimu-ui'
import 'calcite-components'
import type { DateProps } from './types'
import type { DateType } from '../../config'
import { FilterClearOutlined } from 'jimu-icons/outlined/editor/filter-clear'
import { FilterApplyOutlined } from 'jimu-icons/outlined/editor/filter-apply'

const DatePickerRoot = styled('div')(({ theme, styleState }) => {
  const isInPopper = (styleState as any).isInPopper
  const pageBgColor = 'var(--sys-color-surface-paper)'
  const overlayBgColor = 'var(--sys-color-surface-overlay)'
  const pageTextColor = 'var(--sys-color-surface-paper-text)'
  const overlayTextColor = 'var(--sys-color-surface-overlay-text)'
  const hoverColor = 'color-mix(in srgb, #000000 20%, transparent)'
  const textColor = isInPopper ? overlayTextColor : pageTextColor
  return {
    width: '298px', // same as calcite-date-picker width in m size
    height: '390px',
    ...(!isInPopper && {
      backgroundColor: pageBgColor,
      color: pageTextColor,
    }),
    'calcite-date-picker': {
      borderWidth: '0px',
      // month select
      '--calcite-select-background-color': overlayBgColor, // 'transparent' would cause options' bg color issue in windows
      '--calcite-date-picker-month-select-text-color': textColor,
      '--calcite-date-picker-month-select-icon-color': textColor,
      '--calcite-date-picker-month-select-icon-color-hover': textColor,
      // year input
      '--calcite-date-picker-year-text-color': textColor,
      // month navigation buttons
      '--calcite-date-picker-header-action-background-color': 'transparent',
      '--calcite-date-picker-header-action-background-color-hover': hoverColor,
      '--calcite-date-picker-header-action-text-color': textColor,
      '--calcite-date-picker-header-action-text-color-press': textColor,
      // days
      '--calcite-date-picker-day-background-color-hover': hoverColor,
      '--calcite-date-picker-day-range-background-color': colorUtils.colorMixOpacity('var(--sys-color-action-selected)', 0.2),
      '--calcite-date-picker-day-text-color': textColor,
      '--calcite-date-picker-day-text-color-hover': textColor,
      ...(!isInPopper && {
        '--calcite-date-picker-corner-radius': '0px',
        '--calcite-color-foreground-1': pageBgColor,
        '--calcite-select-background-color': pageBgColor,
        '--calcite-date-picker-day-background-color': pageBgColor
      }),
    },
    '.date-filter-footer': {
      padding: '0 8px 12px 8px',
      flexDirection: 'column',
      '.month-bottom-line': {
        height: '1px',
        marginBottom: '8px',
        backgroundColor: theme.ref.palette.neutral[500]
      },
      '.today-button': {
        fontSize: '0.75rem',
        overflow: 'visible'
      }
    }
  }
})

interface InlineDatePickerProps extends DateProps {
  version: number
  isInPopper?: boolean
  isPopperClosed?: boolean
  onApplyChanged?: (applied: boolean) => void
}

export const InlineDatePicker = (props: InlineDatePickerProps) => {
  const {
    label, range, defaultDate, autoApply, onDateChange, version, clearVersion, isInPopper = false, isPopperClosed = false, onApplyChanged
  } = props
  const defaultDateRef = hooks.useLatest(defaultDate)
  const [tempDate, setTempDates] = React.useState(defaultDate)
  const [activeDate, setActiveDate] = React.useState(null)
  const [isReady, setIsReady] = React.useState(false)
  const [applied, setApplied] = React.useState(autoApply) // when autoApply is false
  const i18n = hooks.useTranslation(defaultMessages)

  const onGetPickerRef = React.useCallback((datePicker: HTMLCalciteDatePickerElement) => {
    if (datePicker) {
      datePicker.componentOnReady().then(() => {
        setIsReady(true)
      }).catch((err) => {
        console.error('CalciteDatePicker componentOnReady error', err)
      })
    }
  }, [])

  const getStartDate = (date: DateType) => {
    let startDate = null
    if (typeof date === 'string') {
      startDate = new Date(date)
    } else if (Array.isArray(date) && date[0]) {
      startDate = new Date(date[0])
    }
    return startDate
  }

  /**
   * Update activeDate to make sure the selected month is displayed when popper is opened again.
   * Note: the `activeDate` needs to be changed to trigger the reset to the selected date.
   */
  const updateActiveDate = () => {
    setActiveDate((prevActiveDate) => {
      const startDate = getStartDate(defaultDateRef.current)
      if (startDate) {
        return prevActiveDate ? null : startDate
      }
      return new Date() // no valid date, go to today
    })
  }

  hooks.useUpdateEffect(() => {
    setTempDates(defaultDate)
    setApplied(false)
    updateActiveDate()
  }, [version])

  React.useEffect(() => {
    if (clearVersion) {
      setTempDates(null)
      setApplied(false)

      // set new activeDate to trigger to back to selected month view
      const startDate = getStartDate(defaultDateRef.current)
      setActiveDate(startDate ? new Date(startDate.getTime() + 1) : new Date())
    }
  }, [clearVersion, defaultDateRef])

  // update tempDate and applied states when defaultDate is changed by config
  hooks.useUpdateEffect(() => {
    if (defaultDate !== tempDate) {
      setTempDates(defaultDate)
      setApplied(false)
    }
  }, [defaultDate])

  hooks.useUpdateEffect(() => {
    onApplyChanged?.(applied)
  }, [applied])

  // popper is closed, reset tempDate to defaultDate
  hooks.useUpdateEffect(() => {
    if (isPopperClosed) {
      setTempDates(defaultDate)
      updateActiveDate()
    }
  }, [isPopperClosed])

  const onCalciteDateChange = (event: any) => {
    const { value } = event.target as unknown as HTMLCalciteDatePickerElement
    let newValue = value

    if (range) {
      if (value[1]=== '0NaN-NaN-NaN') { // skip the calcite bug: the range is not created when selecting a day, then selecting a day before it.
        newValue = [value[0], tempDate[0]]
      } else if ( // start a new range selection
        tempDate?.[0] && tempDate?.[1] && // the previouse selection is a completed range
        (tempDate[0] !== value[0] || tempDate[1] !== value[1]) // start or end date is changed
      ) {
        const newDateYMD = value[tempDate[0] === value[0] ? 1 : 0]
        newValue = [newDateYMD, '']
      }
    }
    if (autoApply && (!range || (range && newValue[0] && newValue[1]))) {
      onDateChange(newValue)
    } else {
      setTempDates(newValue)
    }
  }

  // navigate to the current month view only, no date change
  const toToday = evt => {
    setActiveDate(new Date())
  }

  const applyDates = () => {
    setApplied(true)
    onDateChange(tempDate)

    // back to the selected month view
    keepSelectedMonthView(tempDate)
  }

  const clearDates = evt => {
    if (!autoApply) {
      setApplied(false)
      setTempDates(defaultDate)

      // preserve the current month view
      keepSelectedMonthView(defaultDate)
    }
    onDateChange(null)
  }

  const keepSelectedMonthView = (date) => {
    const dateLabel = typeof date === 'string' ? date : date[0]
    setActiveDate(new Date(dateLabel))
  }

  // Note: new Date(2020,3,5) returns date with 0:00:00, new Date('2020-04-05') returns date with current hour in local timezone.
  // For the current exact date, only ymd is needed.
  const valueAsDate = React.useMemo(() => {
    if (typeof tempDate === 'string') {
      return dateUtils.getDateByStrictYMDFormat(tempDate)
    } else if (Array.isArray(tempDate)) {
      return tempDate.map(d => dateUtils.getDateByStrictYMDFormat(d))
    } else {
      return null
    }
  }, [tempDate])

  return (
    <DatePickerRoot className='date-filter-picker' styleState={{ isInPopper }}>
      <calcite-date-picker
        className='calcite-date-picker'
        aria-label={label}
        range={range}
        activeDate={activeDate}
        // value={tempDate} // TODO: `value` does not support setting null to clear dates, will use value instead of valueAsDate when this bug is fixed.
        valueAsDate={valueAsDate}
        calendars={1}
        oncalciteDatePickerChange={onCalciteDateChange}
        ref={onGetPickerRef}
      />
      {
        isReady &&
        <div className='date-filter-footer d-flex'>
          <div className='month-bottom-line'></div>
          <div className={'w-100 d-flex justify-content-end'}>
            <Button
              type='tertiary'
              className='today-button pl-1 pr-1'
              variant='text'
              color='inherit'
              onClick={toToday}
            >
              <div className='w-100 p-0 text-truncate'>
                {i18n('today')}
              </div>
            </Button>
            <div className={'w-100 d-flex justify-content-end apply-clear-group'}>
              <Button
                icon
                type='tertiary'
                className='filter-clear-button'
                variant='text'
                color='inherit'
                title={i18n('clear')}
                aria-label={i18n('clear')}
                disabled={autoApply ? !tempDate : !applied}
                onClick={clearDates}>
                <FilterClearOutlined />
              </Button>
              {
                !autoApply && <Button
                  icon
                  type='tertiary'
                  className='filter-apply-button ml-2'
                  variant='text'
                  color='inherit'
                  title={i18n('apply')}
                  aria-label={i18n('apply')}
                  disabled={(!applied && !tempDate) || (applied && tempDate === defaultDate)}
                  onClick={evt => { applyDates() }}
                >
                  <FilterApplyOutlined />
                </Button>
              }
            </div>
          </div>
        </div>
      }
    </DatePickerRoot>
  )
}

export default InlineDatePicker
