
import { DefaultTimeSettingMode, type DaylightConfig, type ShadowCastConfig, ToolsID, DateOrSeason, Season } from '../../constraints'

import type { IMConfig } from '../../config'


const getDefaultTimeSettingModeForDaylight = (config: DaylightConfig): DefaultTimeSettingMode => {
  if (config.dateOrSeason === DateOrSeason.Season && config.currentSeason !== Season.SyncedWithMap) {
    return DefaultTimeSettingMode.Custom
  }
  return DefaultTimeSettingMode.SyncWithScene
}

export const upgrader = (oldConfig: IMConfig) => {
  oldConfig = oldConfig.setIn(['tools'], oldConfig.tools.map(tool => {
    if (tool.id === ToolsID.Daylight) {
      const config = tool.config as DaylightConfig
      const nextConfig = {
        ...config,
        defaultTimeSettingMode: getDefaultTimeSettingModeForDaylight(config),
      }
      return tool.set('config', nextConfig)
    }
    if (tool.id === ToolsID.ShadowCast) {
      const config = tool.config as ShadowCastConfig
      const nextConfig = {
        ...config,
        defaultTimePeriodSettingMode: DefaultTimeSettingMode.SyncWithScene,
      }
      return tool.set('config', nextConfig)
    }
    return tool
  }))
  return oldConfig
}