import { type DateTimeFieldFormatProperties, dateUtils, hooks, React } from 'jimu-core'
import type { SettingChangeFunction } from 'jimu-for-builder'
import { Label, Radio, Switch, defaultMessages as jimuUIMessages } from 'jimu-ui'
import { SettingRow, SettingSection } from 'jimu-ui/advanced/setting-components'
import { DatePicker } from 'jimu-ui/basic/date-picker'
import defaultMessages from './../translations/default'
import { FilterStyle, type IMConfig, SelectionMode } from '../../config'
import { VIRTUAL_LIST } from '../../utils/utils'

interface OptionsProps {
  widgetId: string,
  config: IMConfig,
  onSettingChange: SettingChangeFunction
}

export const Options = (props: OptionsProps) => {
  const { widgetId, config, onSettingChange } = props
  const {
    defaultDay,
    selectionMode,
    autoApply
  } = config

  const i18n = hooks.useTranslation(defaultMessages, jimuUIMessages)

  const onChange = (prop: string, value: any, newConfig = config) => {
    const widgetJson = {
      id: widgetId,
      config: newConfig.set(prop, value)
    }
    onSettingChange(widgetJson)
  }

  const onselectionchange = (evt) => {
    const mode = selectionMode === SelectionMode.Single ? SelectionMode.Range : SelectionMode.Single
    onChange('selectionMode', mode, config.set('defaultDay', null)) // also reset the default day to empty
  }

  // get date or virtual date lable.
  const getDateByLabel = (dayLabel: string) => {
    let date = null
    if (VIRTUAL_LIST.includes(dayLabel as dateUtils.VirtualDateType)) {
      date = dayLabel
    } else if (dayLabel) {
      date = new Date(dayLabel)
    }
    return date
  }

  const selectedDate = React.useMemo(() => {
    const dates = []
    if (selectionMode === SelectionMode.Single) {
      dates.push(getDateByLabel(defaultDay as string))
    } else {
      dates.push(getDateByLabel(defaultDay?.[0]))
      dates.push(getDateByLabel(defaultDay?.[1]))
    }
    return dates
  }, [defaultDay, selectionMode])

  const onDefaultDayChange = (value: number | dateUtils.VirtualDateType, isStart: boolean) => {
    let label: string = ''
    if (typeof value === 'string') {
      label = value
    } else if (value) {
      label = dateUtils.getStrictYMDFormat(new Date(value))
    }
    if (selectionMode === SelectionMode.Single) {
      onChange('defaultDay', label)
    } else {
      const labels = isStart ? [label, config.defaultDay?.[1] || ''] : [config.defaultDay?.[0] || '', label]
      onChange('defaultDay', labels)
    }
  }

  return (
    <SettingSection role='radiogroup' title={i18n('options')} aria-label={i18n('dateSelectionMode')}>
      <SettingRow label={i18n('dateSelectionMode')}/>
      <SettingRow>
        <Label check>
          <Radio
            name='selection-mode-radio'
            style={{ cursor: 'pointer' }}
            className='mr-2 align-text-bottom'
            checked={selectionMode === SelectionMode.Single}
            onChange={onselectionchange}
          />
          {i18n('singleSelection')}
        </Label>
      </SettingRow>
      <SettingRow className='mt-2'>
        <Label check>
          <Radio
            name='selection-mode-radio'
            style={{ cursor: 'pointer' }}
            className='mr-2 align-text-bottom'
            checked={selectionMode === SelectionMode.Range}
            onChange={onselectionchange}
          />
          {i18n('rangeSelection')}
        </Label>
      </SettingRow>
      <SettingRow label={i18n('defaultDate')}/>
      <SettingRow>
        <DatePicker
          style={{ width: '226px' }}
          aria-label={i18n('defaultDate')}
          disablePortal={false}
          selectedDate={selectedDate[0]}
          dateFormat={{ dateStyle: 'short' } as DateTimeFieldFormatProperties}
          showDoneButton
          runtime={true}
          supportVirtualDateList={true}
          virtualDateList={VIRTUAL_LIST}
          onChange={(value) => { onDefaultDayChange(value, true) }}
        />
      </SettingRow>
      {
        selectionMode === SelectionMode.Range && (
          <SettingRow>
            <DatePicker
              style={{ width: '226px' }}
              aria-label={i18n('defaultDate')}
              disablePortal={false}
              selectedDate={selectedDate[1]}
              dateFormat={{ dateStyle: 'short' } as DateTimeFieldFormatProperties}
              showDoneButton
              runtime={true}
              supportVirtualDateList={true}
              virtualDateList={VIRTUAL_LIST}
              onChange={(value) => { onDefaultDayChange(value, false) }}
            />
          </SettingRow>
        )
      }
      <SettingRow tag='label' label={i18n('autoApplyFilter')}>
        <Switch
          checked={autoApply}
          aria-label={i18n('autoApplyFilter')}
          disabled={config.filterStyle === FilterStyle.Input}
          onChange={() => { onChange('autoApply', !autoApply) }}
        />
      </SettingRow>
    </SettingSection>
  )
}