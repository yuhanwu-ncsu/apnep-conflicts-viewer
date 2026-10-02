import { dateUtils, hooks } from 'jimu-core'
import { Radio, Label, defaultMessages as jimuUIMessages } from 'jimu-ui'
import defaultMessages from '../../../../translations/default'
import { SettingRow } from 'jimu-ui/advanced/setting-components'
import type { Tool3D, ShadowCastConfig } from '../../../../../constraints'
import { DefaultTimeSettingMode } from '../../../../../constraints'

import { TimeSettingModeOptions } from '../../../../constants'
import { getStyle } from './style'
import { useTimeRangeValidation } from './use-time-range-validation'


interface DefaultTimePeriodSettingProps {
  toolConfig: Tool3D;
  onSettingChanged?: (toolConfig: Partial<ShadowCastConfig>) => void;
}

export const DefaultTimePeriodSetting = (props: DefaultTimePeriodSettingProps) => {
  const { toolConfig, onSettingChanged } = props
  const shadowCastConfig = toolConfig.config as ShadowCastConfig

  const translate = hooks.useTranslation(defaultMessages, jimuUIMessages)
  const defaultTimePeriodSettingMode = shadowCastConfig.defaultTimePeriodSettingMode ?? DefaultTimeSettingMode.SyncWithScene
  const { timeRangeErrorState, validateTimeRange, clearTimeRangeError } = useTimeRangeValidation({
    errorMessage: translate('startTimeMustBeEarlierThanEndTime')
  })

  const onDefaultTimeSettingModeChange = (mode: DefaultTimeSettingMode) => {
    const nextConfig: Partial<ShadowCastConfig> = {
      defaultTimePeriodSettingMode: mode,
      defaultDateVal: undefined,
      defaultStartTimeVal: undefined,
      defaultEndTimeVal: undefined,
      defaultTimeZoneVal: undefined
    }

    if (mode === DefaultTimeSettingMode.Custom) {
      const now = new Date()
      nextConfig.defaultDateVal = shadowCastConfig.defaultDateVal ?? dateUtils.format(now,"yyyy-MM-dd")
      nextConfig.defaultStartTimeVal = shadowCastConfig.defaultStartTimeVal
      nextConfig.defaultEndTimeVal = shadowCastConfig.defaultEndTimeVal
      nextConfig.defaultTimeZoneVal = shadowCastConfig.defaultTimeZoneVal ?? (now.getTimezoneOffset() * -1)
      validateTimeRange(nextConfig.defaultStartTimeVal, nextConfig.defaultEndTimeVal)
    }else {
      clearTimeRangeError()
    }

    onSettingChanged(nextConfig)
  }

  const onDateInputChange = (e) => {
    onSettingChanged({ defaultDateVal: e.target.value })
  }

  const onTimeZoneInputChange = (e) => {
    const defaultTimeZoneVal = e.target.value
    if (defaultTimeZoneVal !== undefined && defaultTimeZoneVal !== null && defaultTimeZoneVal !== '') {
      onSettingChanged({ defaultTimeZoneVal })
    }
  }

  const onStartTimeInputChange = (e) => {
    const defaultStartTimeVal = e.target.value
    if (defaultStartTimeVal !== undefined && validateTimeRange(defaultStartTimeVal, shadowCastConfig.defaultEndTimeVal)) {
      onSettingChanged({ defaultStartTimeVal })
    }
  }

  const onEndTimeInputChange = (e) => {
    const defaultEndTimeVal = e.target.value
    if (defaultEndTimeVal !== undefined && validateTimeRange(shadowCastConfig.defaultStartTimeVal, defaultEndTimeVal)) {
      onSettingChanged({ defaultEndTimeVal })
    }
  }

  const renderTimeSettingModeOptions = () => {
    return <SettingRow role='group' aria-label={translate('defaultTimePeriodSetting')}>
      <div className='d-block'>
        {TimeSettingModeOptions.map((option, idx) => {
          return <div className={`d-flex align-items-center ${idx > 0 ? 'mt-2' : ''}`} key={option.value}>
            <Label className='d-flex align-items-center'>
              <Radio
                name='defaultTimePeriodSettingMode'
                className='mr-2'
                checked={defaultTimePeriodSettingMode === option.value}
                onChange={(evt, checked) => { onDefaultTimeSettingModeChange(checked ? option.value : undefined) }}
              />
              {translate(option.labelTranslateKey)}
            </Label>
          </div>
        })}
      </div>
    </SettingRow>
  }

  const renderCustomTimePeriodSetting = () => {
    if (defaultTimePeriodSettingMode !== DefaultTimeSettingMode.Custom) {
      return null
    }

    return <>
      <SettingRow tag='label' label={translate('timeZone')}></SettingRow>
      <SettingRow role='group' aria-label={translate('timeZone')}>
        <calcite-input-time-zone className='w-100 jimu-calcite-timezone' oncalciteInputTimeZoneChange={onTimeZoneInputChange} value={shadowCastConfig.defaultTimeZoneVal?.toString()} />
      </SettingRow>

      <SettingRow tag='label' label={translate('date')}></SettingRow>
      <SettingRow role='group' aria-label={translate('date')}>
        <calcite-input-date-picker className='jimu-calcite-input-date-picker' oncalciteInputDatePickerChange={onDateInputChange} value={shadowCastConfig.defaultDateVal}></calcite-input-date-picker>
      </SettingRow>

      <SettingRow tag='label' label={translate('timePeriod')}></SettingRow>
      <SettingRow role='group' aria-label={translate('from')}>
        <div className='time-period-row'>
          <div className='time-period-label'>{translate('from')}</div>
          <calcite-input-time-picker className='jimu-calcite-timepicker time-period-input' oncalciteInputTimePickerChange={onStartTimeInputChange} value={shadowCastConfig.defaultStartTimeVal} status={timeRangeErrorState ? 'invalid' : 'idle'}></calcite-input-time-picker>
        </div>
      </SettingRow>

      <SettingRow role='group' aria-label={translate('toUppercase')}>
        <div className='time-period-row'>
          <div className='time-period-label'>{translate('toUppercase')}</div>
          <calcite-input-time-picker className='jimu-calcite-timepicker time-period-input' oncalciteInputTimePickerChange={onEndTimeInputChange} value={shadowCastConfig.defaultEndTimeVal} status={timeRangeErrorState ? 'invalid' : 'idle'} validationMessage={timeRangeErrorState}></calcite-input-time-picker>
        </div>
      </SettingRow>
    </>
  }

  return (
    <div css={getStyle()}>
      <SettingRow tag='label' label={translate('defaultTimePeriodSetting')}></SettingRow>
      {renderTimeSettingModeOptions()}
      {renderCustomTimePeriodSetting()}
    </div>
  )
}