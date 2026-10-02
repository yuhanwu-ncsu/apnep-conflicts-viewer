import { dataSourceUtils, TimezoneConfig, type Timezone, lodash, dateUtils } from 'jimu-core'
import { type ShadowCastConfig, DefaultTimeSettingMode } from '../../../../constraints'
import { getUtcOffsetFromMinutes } from '../../../../common/time-utils'
import type SunLighting from 'esri/webscene/SunLighting'
import type VirtualLighting from 'esri/webscene/VirtualLighting'


interface ShadowCastTimeParams {
  date?: Date
  startTimeOfDay?: number
  endTimeOfDay?: number
  utcOffset?: number
}

const getTimeParamsInSyncWithSceneMode = (shadowCastConfig: ShadowCastConfig, lightingUnion: SunLighting | VirtualLighting) => {
  const timeParams: ShadowCastTimeParams = {}
  if(lightingUnion?.type === 'sun') {
    // The date in the SunLighting is in UTC, so we need to convert it to local time based on the displayUTCOffset and timezone offset.
    timeParams.date = new Date(lightingUnion.date.getTime() + (lightingUnion.displayUTCOffset * 60 + lightingUnion.date.getTimezoneOffset()) * 60 * 1000)
    timeParams.utcOffset = lightingUnion.displayUTCOffset
  }
  return timeParams
}


const getTimeParamsInSyncWithAppMode = (shadowCastConfig: ShadowCastConfig, extraInfo: {
  timeZoneInfo: Timezone,
  lighting: SunLighting | VirtualLighting
}) => {
  const timeParams: ShadowCastTimeParams = {}
  const { timeZoneInfo = { type: TimezoneConfig.Device }, lighting } = extraInfo || {}
  const currentDate = new Date()

  if (timeZoneInfo?.type === TimezoneConfig.Device) {
    timeParams.utcOffset = currentDate.getTimezoneOffset() / -60
    timeParams.date = currentDate
  } else if (timeZoneInfo?.type === TimezoneConfig.Specific && timeZoneInfo.value !== undefined) {
    timeParams.utcOffset = dataSourceUtils.getTimeZoneOffsetByName(timeZoneInfo.value) / (60 * 60 * 1000)
    timeParams.date = currentDate
  }else if(timeZoneInfo.type === TimezoneConfig.Data) {
    if(lighting?.type === 'sun') {
      timeParams.date = lighting.date
      timeParams.utcOffset = lighting.displayUTCOffset
    }
  }

  return timeParams
}

const getTimeParamsInSyncWithCurrentDateAndTimeMode = (shadowCastConfig: ShadowCastConfig) => {
  const timeParams: ShadowCastTimeParams = {}
  const currentDate = new Date()
  timeParams.utcOffset = currentDate.getTimezoneOffset() / -60
  timeParams.date = currentDate
  return timeParams
}

const getTimeParamsInCustomMode = (shadowCastConfig: ShadowCastConfig) => {
  const timeParams: ShadowCastTimeParams = {}
  const { defaultDateVal, defaultStartTimeVal, defaultEndTimeVal, defaultTimeZoneVal } = shadowCastConfig

  Object.assign(timeParams, {
    date: defaultDateVal !== undefined ? new Date(defaultDateVal) : undefined,
    startTimeOfDay: defaultStartTimeVal !== undefined ? dateUtils.convertISOTimeToMinutes(defaultStartTimeVal) * 60 * 1000 : undefined,
    endTimeOfDay: defaultEndTimeVal !== undefined ? dateUtils.convertISOTimeToMinutes(defaultEndTimeVal) * 60 * 1000 : undefined,
    utcOffset: getUtcOffsetFromMinutes(defaultTimeZoneVal)
  })

  return lodash.omitBy(timeParams, lodash.isUndefined)
}


export const getDefaultShadowCastTimeParams = (shadowCastConfig: ShadowCastConfig, extraInfo: {
  timeZoneInfo: Timezone,
  lighting: SunLighting | VirtualLighting
}) => {
  const {defaultTimePeriodSettingMode = DefaultTimeSettingMode.SyncWithScene} = shadowCastConfig || {}


  if (defaultTimePeriodSettingMode === DefaultTimeSettingMode.SyncWithScene) {
    const timeParams = getTimeParamsInSyncWithSceneMode(shadowCastConfig, extraInfo.lighting)
    return timeParams
  }

  if (defaultTimePeriodSettingMode === DefaultTimeSettingMode.SyncWithApp) {
    const timeParams = getTimeParamsInSyncWithAppMode(shadowCastConfig, extraInfo)
    return timeParams
  }

  if (defaultTimePeriodSettingMode === DefaultTimeSettingMode.SyncWithCurrentDateAndTime) {
    const timeParams = getTimeParamsInSyncWithCurrentDateAndTimeMode(shadowCastConfig)
    return timeParams
  }

  if (defaultTimePeriodSettingMode === DefaultTimeSettingMode.Custom) {
    const timeParams = getTimeParamsInCustomMode(shadowCastConfig)
    return timeParams
  }

  return {} as ShadowCastTimeParams
}


export const setShadowCastTimeParams = (shadowCastElement: HTMLArcgisShadowCastElement, timeParams?: ShadowCastTimeParams) => {
  if (!shadowCastElement || !timeParams) {
    return
  }
  const { date, startTimeOfDay, endTimeOfDay, utcOffset } = timeParams

  if (utcOffset !== undefined) {
    shadowCastElement.utcOffset = utcOffset
  }

  Promise.resolve().then(() => {
    if (date !== undefined) {
      shadowCastElement.date = date
    }
    if (startTimeOfDay !== undefined) {
      shadowCastElement.startTimeOfDay = startTimeOfDay
    }
    if (endTimeOfDay !== undefined) {
      shadowCastElement.endTimeOfDay = endTimeOfDay
    }
  })
}