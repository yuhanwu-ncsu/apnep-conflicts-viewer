import { WidgetVersionManager, type WidgetUpgradeInfo, type UseDataSource } from 'jimu-core'
import type { IMConfig } from './config'
import { getUseDataSourcesFromMapViewConfigList } from './utils/utils'

class VersionManager extends WidgetVersionManager {
  versions = [{
    version: '1.21.0',
    description: 'Update widget useDataSources based on date filter config',
    upgradeFullInfo: true,
    upgrader: (oldInfo: WidgetUpgradeInfo) => {
      const config: IMConfig = oldInfo.widgetJson.config
      if (!config) {
        return oldInfo
      }

      const useDss: UseDataSource[] = getUseDataSourcesFromMapViewConfigList(config.mapViewConfigList)
      if (useDss.length === 0) {
        return oldInfo
      }

      const widgetJson = oldInfo.widgetJson.set('useDataSources', useDss)
      const widgetInfo = { ...oldInfo, widgetJson }
      return widgetInfo
    }
  }]
}

export const versionManager: WidgetVersionManager = new VersionManager()
