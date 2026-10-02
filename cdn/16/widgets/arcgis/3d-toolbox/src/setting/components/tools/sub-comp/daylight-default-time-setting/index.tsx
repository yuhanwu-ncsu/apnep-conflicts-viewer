import { hooks , dateUtils } from 'jimu-core'
import { Radio, Label, Select, defaultMessages as jimuUIMessages } from 'jimu-ui'
import defaultMessages from '../../../../translations/default'
import { SettingRow } from 'jimu-ui/advanced/setting-components'
import type { Tool3D, DaylightConfig } from '../../../../../constraints'
import { DateOrSeason, DefaultTimeSettingMode, Season } from '../../../../../constraints'

import { TimeSettingModeOptions } from '../../../../constants'
import { getStyle } from './style'

interface DefaultTimeSettingProps {
  toolConfig: Tool3D;
  onSettingChanged?: (toolConfig: Partial<DaylightConfig>) => void;
}

const seasonTypes = [Season.SyncedWithMap, Season.Spring, Season.Summer, Season.Fall, Season.Winter]

export const DefaultTimeSetting = (props: DefaultTimeSettingProps) => {
  const { toolConfig, onSettingChanged } = props
  const daylightConfig = toolConfig.config as DaylightConfig

  const translate = hooks.useTranslation(defaultMessages, jimuUIMessages)


  const onDefaultTimeSettingModeChange = (mode: DefaultTimeSettingMode) => {
    const nextConfig: Partial<DaylightConfig> = {
      defaultTimeSettingMode: mode,
      defaultDateVal: undefined,
      defaultTimeVal: undefined,
      defaultTimeZoneVal: undefined
    }
    if (mode === DefaultTimeSettingMode.SyncWithScene) {
      // when switch to sync with scene mode, reset the default time params
      nextConfig.currentSeason = Season.SyncedWithMap
    } else if (mode === DefaultTimeSettingMode.Custom) {
      const now = new Date()
      nextConfig.defaultDateVal = daylightConfig.defaultDateVal ?? dateUtils.format(now,"yyyy-MM-dd")
      nextConfig.defaultTimeZoneVal = daylightConfig.defaultTimeZoneVal ?? (now.getTimezoneOffset() * -1)
      nextConfig.defaultTimeVal = daylightConfig.defaultTimeVal ?? dateUtils.format(now, "HH:mm")
    }

    onSettingChanged(nextConfig)
  }


  const onTimeInputChange = (e) => {
    const defaultTimeVal = e.target.value // value format is 'HH:mm'
    if (defaultTimeVal !== undefined) {
      onSettingChanged({ defaultTimeVal })
    }
  }
  const onTimeZoneInputChange = (e) => {
    const defaultTimeZoneVal = e.target.value
    if (defaultTimeZoneVal !== undefined && defaultTimeZoneVal !== null && defaultTimeZoneVal !== '') {
      onSettingChanged({ defaultTimeZoneVal })
    }
  }
  const onDateInputChange = (e) => {
    const defaultDateVal = e.target.value // value format is 'YYYY-MM-DD'
    onSettingChanged({ defaultDateVal })
  }


  const renderTimeSettingModeOptions = () => {
    return <SettingRow role='group' aria-label={translate('defaultTimeSetting')}>
      <div className='d-block'>
        {TimeSettingModeOptions.map((option, idx) => {
          return <div className={`d-flex align-items-center ${idx > 0 ? 'mt-2' : ''}`} key={option.value}>
            <Label className='d-flex align-items-center'>
              <Radio
                name='defaultTimeSettingMode'
                className='mr-2'
                checked={daylightConfig.defaultTimeSettingMode === option.value}
                onChange={(evt, checked) => { onDefaultTimeSettingModeChange(checked ? option.value : undefined) }}
              />
              {translate(option.labelTranslateKey)}
            </Label>
          </div>
        })}
      </div>
    </SettingRow>
  }
  const renderDateOrSeasonPicker = () => {
    const dateOrSeason = daylightConfig.dateOrSeason
    if (dateOrSeason === DateOrSeason.Date) {
      return <>
        <SettingRow tag='label' label={translate('date')} ></SettingRow>
        <SettingRow role='group' aria-label={translate('date')} >
          <calcite-input-date-picker className='jimu-calcite-input-date-picker' oncalciteInputDatePickerChange={onDateInputChange} value={daylightConfig.defaultDateVal}></calcite-input-date-picker>
        </SettingRow>
      </>


    } else if (dateOrSeason === DateOrSeason.Season) {
      return <>
        <SettingRow label={translate('season')}></SettingRow>
        <SettingRow aria-label={translate('season')}>
          <Select
            value={daylightConfig.currentSeason}
            onChange={(evt) => { onSettingChanged({ currentSeason: evt.target.value }) }}
            style={{
              height: '32px'
            }}>
            {
              seasonTypes.map((type, idx) => {
                const tip = translate(type)
                return <option key={idx} value={type}>{tip}</option>
              })
            }
          </Select>
        </SettingRow>
      </>

    }
    return null
  }
  const renderTimeZoneAndDateSetting = () => {
    if (daylightConfig.defaultTimeSettingMode === DefaultTimeSettingMode.Custom) {
      return <>
        <SettingRow tag='label' label={translate('timeZone')} ></SettingRow>
        <SettingRow role='group' aria-label={translate('timeZone')} >
          <calcite-input-time-zone value={daylightConfig.defaultTimeZoneVal?.toString()} className='w-100 jimu-calcite-timezone' oncalciteInputTimeZoneChange={onTimeZoneInputChange} referenceDate={daylightConfig.defaultDateVal} />
        </SettingRow>
        {
          renderDateOrSeasonPicker()
        }
        <SettingRow tag='label' label={translate('time')} ></SettingRow>
        <SettingRow role='group' aria-label={translate('time')} >
          <calcite-input-time-picker className='w-100 jimu-calcite-timepicker' oncalciteInputTimePickerChange={onTimeInputChange} value={daylightConfig.defaultTimeVal}></calcite-input-time-picker>
        </SettingRow>
      </>
    }
    return null
  }


  return (
    <div css={getStyle()}>
      <SettingRow tag='label' label={translate('defaultTimeSetting')}></SettingRow>
      {renderTimeSettingModeOptions()}
      {renderTimeZoneAndDateSetting()}
    </div>
  )
}