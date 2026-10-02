import type { ImmutableArray } from 'jimu-core'
import type Point from 'esri/geometry/Point'
import type Viewpoint from 'esri/Viewpoint'

// tools
export enum ToolsID {
  Daylight = 'daylight',
  Weather = 'weather',
  ShadowCast = 'shadowcast',
  LineOfSight = 'lineofsight',
  Slice = 'slice'
}
export interface Tool3D {
  id: ToolsID
  enable: boolean
  activedOnLoad: boolean
  config: DaylightConfig | WeatherConfig | ShadowCastConfig | LineOfSightConfig | SliceConfig
}
// configs
// 1.Daylight
// https://developers.arcgis.com/javascript/latest/api-reference/esri-widgets-Daylight.html#dateOrSeason
export enum DateOrSeason {
  Date = 'date',
  Season = 'season'
}
export enum Season {
  SyncedWithMap = 'syncedWithMap',
  Spring = 'spring',
  Summer = 'summer',
  Fall = 'fall',
  Winter = 'winter'
}

export enum DefaultTimeSettingMode {
  SyncWithScene = 'syncWithScene',
  SyncWithApp = 'syncWithApp',
  SyncWithCurrentDateAndTime = 'syncWithCurrentDateAndTime',
  Custom = 'custom'
}

export interface DaylightConfig {
  timezone: boolean
  timeSliderSteps: number

  playButtons: boolean
  playSpeedMultiplier: number
  dateTimeAutoPlay: boolean // set vm.dayPlaying = true
  // yearPlaying: boolean
  datePicker: boolean
  dateOrSeason: DateOrSeason
  currentSeason?: Season

  isShowShadows: boolean
  dateTimeToggle: boolean

  defaultTimeSettingMode : DefaultTimeSettingMode
  /** value format is 'YYYY-MM-DD' */
  defaultDateVal?: string
  /** value format is 'HH:mm' */
  defaultTimeVal?: string
  /** raw calcite-input-time-zone value, unit is minute */
  defaultTimeZoneVal?: number | string

}
// 2.Weather
export enum WeatherType {
  Sunny = 'sunny',
  Cloudy = 'cloudy',
  Rainy = 'rainy',
  Snowy = 'snowy',
  Foggy = 'foggy'
}
export interface SunnyCloudyConfig {
  cloudCover: number
}
export interface RainyConfig {
  cloudCover: number
  precipitation: number
}
export interface SnowyConfig {
  cloudCover: number
  precipitation: number
  //snowCover: 'enabled' | 'disabled'
}
export interface FoggyConfig {
  fogStrength: number
}
export interface WeatherConfig {
  weatherType: WeatherType
  //weatherParams?: SunnyCloudyConfig | RainySnowyConfig | FoggyConfig
  sunnyConfig: SunnyCloudyConfig
  cloudyConfig: SunnyCloudyConfig
  rainyConfig: RainyConfig
  snowyConfig: SnowyConfig
  foggyConfig: FoggyConfig
}
// 3.Shadow cast
export enum ShadowCastVisType {
  Threshold = 'threshold',
  Duration = 'duration',
  Discrete = 'discrete'
}
export interface ShadowCastConfig {
  visType: ShadowCastVisType
  timezone: boolean
  datePicker: boolean
  defaultTimePeriodSettingMode?: DefaultTimeSettingMode
  /** value format is 'YYYY-MM-DD' */
  defaultDateVal?: string
  /** value format is 'HH:mm' */
  defaultStartTimeVal?: string
  /** value format is 'HH:mm' */
  defaultEndTimeVal?: string
  /** raw calcite-input-time-zone value, unit is minute */
  defaultTimeZoneVal?: number | string
}
// 4.LineOfSight
export interface LineOfSightConfig {
  observer?: Point
}
// 5.Slice
export interface sliceAnalysisInfo {
  mapViewId?: string// jimumapViewId
  analysis: string
  viewpoint?: Viewpoint
}
export interface SliceConfig {
  tiltEnabled: boolean
  excludeGroundSurface: boolean
  analyses: ImmutableArray<sliceAnalysisInfo>
}

// Arrangements
export enum ArrangementStyle {
  List = 'list',
  Icon = 'icon'
}
export enum ArrangementDirection {
  Horizontal = 'horizontal',
  Vertical = 'vertical'
}
export interface Arrangement {
  style: ArrangementStyle
  direction: ArrangementDirection
}
