import { dataSourceUtils, TimezoneConfig, type Timezone, lodash, dateUtils } from 'jimu-core'
import { DateOrSeason, type DaylightConfig, DefaultTimeSettingMode, Season } from '../../../../constraints'
import { getUtcOffsetFromMinutes } from '../../../../common/time-utils'


interface DaylightTimeParams {
  localDate?: Date,
  timeSliderPosition?: number
  utcOffset?: number
  currentSeason?: Season
}

const getTimeSliderPositionFromDate = (date: Date) => {
  return date.getHours() * 60 + date.getMinutes()
}

const getTimeParamsInSyncWithAppMode = (daylightConfig: DaylightConfig, timeZoneInfo: Timezone = { type: TimezoneConfig.Device }) => {
  const timeParams: DaylightTimeParams = {}
  const currentDate = new Date()

  if (timeZoneInfo?.type === TimezoneConfig.Device) {
    timeParams.utcOffset = currentDate.getTimezoneOffset() / -60
    timeParams.localDate = currentDate
    timeParams.timeSliderPosition = getTimeSliderPositionFromDate(currentDate)
  } else if (timeZoneInfo?.type === TimezoneConfig.Specific && timeZoneInfo.value !== undefined) {
    timeParams.utcOffset = dataSourceUtils.getTimeZoneOffsetByName(timeZoneInfo.value) / (60 * 60 * 1000)
    timeParams.localDate = currentDate
    timeParams.timeSliderPosition = getTimeSliderPositionFromDate(currentDate)
  }

  return timeParams
}

const getTimeParamsInSyncWithCurrentDateAndTimeMode = (daylightConfig: DaylightConfig) => {
  const timeParams: DaylightTimeParams = {}
  const currentDate = new Date()

  timeParams.utcOffset = currentDate.getTimezoneOffset() / -60
  timeParams.localDate = currentDate
  timeParams.timeSliderPosition = getTimeSliderPositionFromDate(currentDate)

  return timeParams
}

const getTimeParamsInCustomMode = (daylightConfig: DaylightConfig) => {
  const timeParams: DaylightTimeParams = {}
  const { defaultDateVal, defaultTimeVal, defaultTimeZoneVal, dateOrSeason } = daylightConfig

  Object.assign(timeParams, {
    timeSliderPosition: defaultTimeVal !== undefined ? dateUtils.convertISOTimeToMinutes(defaultTimeVal) : undefined,
    utcOffset: getUtcOffsetFromMinutes(defaultTimeZoneVal)
  })

  if (dateOrSeason === DateOrSeason.Date) {
    timeParams.localDate = defaultDateVal !== undefined ? new Date(defaultDateVal) : undefined
  } else if (dateOrSeason === DateOrSeason.Season) {
    timeParams.currentSeason = daylightConfig.currentSeason !== Season.SyncedWithMap ? daylightConfig.currentSeason : undefined
  }

  return lodash.omitBy(timeParams, lodash.isUndefined)
}

export const getDefaultDaylightTimeParams = (daylightConfig: DaylightConfig, timeZoneInfo: Timezone = { type: TimezoneConfig.Device }) => {

  const { defaultTimeSettingMode = DefaultTimeSettingMode.SyncWithScene } = daylightConfig || {}


  if (defaultTimeSettingMode === DefaultTimeSettingMode.SyncWithScene) {
    const timeParams: DaylightTimeParams = {}
    return timeParams
  }

  if (defaultTimeSettingMode === DefaultTimeSettingMode.SyncWithApp) {
    const timeParams = getTimeParamsInSyncWithAppMode(daylightConfig, timeZoneInfo)
    return timeParams
  }

  if (defaultTimeSettingMode === DefaultTimeSettingMode.SyncWithCurrentDateAndTime) {
    const timeParams = getTimeParamsInSyncWithCurrentDateAndTimeMode(daylightConfig)
    return timeParams
  }

  if (defaultTimeSettingMode === DefaultTimeSettingMode.Custom) {
    const timeParams = getTimeParamsInCustomMode(daylightConfig)
    return timeParams
  }

  return {} as DaylightTimeParams

}

export const setDaylightTimeParams = (daylightElement: HTMLArcgisDaylightElement, timeParams?: DaylightTimeParams) => {
  if (!daylightElement || !timeParams) {
    return
  }
  const { localDate, timeSliderPosition, utcOffset, currentSeason } = timeParams

  if (utcOffset !== undefined) {
    daylightElement.utcOffset = utcOffset
  }
  // run microtask to ensure the localDate and timeSliderPosition are set after utcOffset, which is required by arcgis daylight widget to correctly calculate the local time
  Promise.resolve().then(() => {
    if (localDate !== undefined) {
      daylightElement.localDate = localDate
    }
    if (currentSeason !== undefined) {
      daylightElement.currentSeason = currentSeason as Exclude<Season, "syncedWithMap">
    }
    if (timeSliderPosition !== undefined) {
      daylightElement.timeSliderPosition = timeSliderPosition
    }
  })
}