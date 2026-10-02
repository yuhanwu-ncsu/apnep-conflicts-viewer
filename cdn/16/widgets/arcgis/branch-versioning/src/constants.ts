import { CalciteScale, DisplayType } from './config'

export const SERVICE_NAME_REGEX = /\/services\/([^\/]+)\/FeatureServer/

export const SCALE_OPTIONS = [
  { value: CalciteScale.SMALL, labelKey: 'scaleSmall' },
  { value: CalciteScale.MEDIUM, labelKey: 'scaleMedium' },
  { value: CalciteScale.LARGE, labelKey: 'scaleLarge' }
] as const

export const DISPLAY_TYPE_OPTIONS = [
  { value: DisplayType.DOCKED, labelKey: 'displayTypeDocked' },
  { value: DisplayType.FLOATING, labelKey: 'displayTypeFloating' }
] as const

export const LAYOUT_TYPE_OPTIONS = [
  { value: 'horizontal', labelKey: 'layoutTypeHorizontal' },
  { value: 'vertical', labelKey: 'layoutTypeVertical' }
] as const

export const DOCK_POSITION_OPTIONS = [
  { value: 'panel-start', labelKey: 'dockPositionLeft' },
  { value: 'panel-top', labelKey: 'dockPositionTop' },
  { value: 'panel-end', labelKey: 'dockPositionRight' },
  { value: 'panel-bottom', labelKey: 'dockPositionBottom' }
] as const

