import { DataSourceManager, DataSourceTypes, type extensionSpec, type IMAppConfig } from 'jimu-core'
import type { IMConfig } from '../config'
import defaultMessages from '../setting/translations/default'

export default class BuilderOperations implements extensionSpec.BuilderOperationsExtension {
  id = 'elevation-profile-builder-operation'
  widgetId: string

  getTranslationKey (appConfig: IMAppConfig): Promise<extensionSpec.TranslationKey[]> {
    const config = appConfig.widgets[this.widgetId].config as IMConfig
    const keys: extensionSpec.TranslationKey[] = []

    const dsIds = Object.keys(config?.configInfo) || []
    dsIds.forEach((dsId: string) => {
      // Data Source Group
      const dsGroupKey = `widgets.${this.widgetId}.config.configInfo.${dsId}`
      const dataSource = DataSourceManager.getInstance().getDataSource(dsId)
      keys.push({
        keyType: 'group',
        key: dsGroupKey,
        label: dsId === 'default' ? 'Default' : dataSource.getLabel()
      })

      const individualConfigInfo = config?.configInfo[dsId]
      //Volumetric objects label
      if (individualConfigInfo.elevationLayersSettings.volumetricObjSettingsOptions.volumetricObjLabel && dataSource?.type === DataSourceTypes.WebScene) {
        keys.push({
          keyType: 'value',
          key: `widgets.${this.widgetId}.config.configInfo.${dsId}.elevationLayersSettings.volumetricObjSettingsOptions.volumetricObjLabel`,
          groupKey: dsGroupKey,
          label: {
            key: 'volumetricObjLabel',
            enLabel: defaultMessages.volumetricObjectsLabel
          },
          valueType: "text",
        })
      }
      // Each elevation layers labels
      individualConfigInfo.elevationLayersSettings.addedElevationLayers.forEach((elevationLayers, index) => {
        if (elevationLayers.label) {
          keys.push({
            keyType: 'value',
            key: `widgets.${this.widgetId}.config.configInfo.${dsId}.elevationLayersSettings.addedElevationLayers[${index}].label`,
            groupKey: dsGroupKey,
            label: {
              key: 'elevationLayersLabel',
              enLabel: elevationLayers.label
            },
            valueType: "text",
          })
        }
      })
    })
    return Promise.resolve(keys)
  }
}
