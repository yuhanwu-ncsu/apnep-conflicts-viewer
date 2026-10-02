import type { ImmutableArray, ImmutableObject } from 'jimu-core'

export enum DisplayOrderType {
  xy = 'XY',
  yx = 'YX'
}

export enum WidgetStyleType {
  classic = 'CLASSIC',
  modern = 'MODERN'
}

export enum ElevationUnitType {
  metric = 'METRIC',
  imperial = 'IMPERIAL'
}

export interface MapInfo {
  id: string
  title: string
  wkid: string
  label: string
  csUnit: string
}

export interface WidgetRect {
  width: number
  height: number
}

export interface CoordinateConfig {
  id: string
  name: string
  wkid: string
  crs?: any
  displayUnit: string
  elevationUnit?: ElevationUnitType
  datumWkid?: string
  datumName?: string
  transformForward?: boolean
  datumWkid2?: string
  datumName2?: string
  transformForward2?: boolean
  overrideGeneralSettings?: boolean
  coordinateDecimal?: number
  altitudeDecimal?: number
  showSeparators?: boolean
  displayOrder?: DisplayOrderType
}

export interface Config {
  coordinateSystem: ImmutableArray<CoordinateConfig>
  widgetStyle: WidgetStyleType
  mapInfo?: MapInfo
  mapInfo2?: MapInfo
  // general settings
  coordinateDecimal: number
  altitudeDecimal: number
  showSeparators: boolean
  displayOrder: DisplayOrderType
}

export type IMConfig = ImmutableObject<Config>
