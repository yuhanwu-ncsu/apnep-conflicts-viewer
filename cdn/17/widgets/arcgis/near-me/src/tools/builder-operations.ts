import { DataSourceManager, type extensionSpec, type IMAppConfig } from 'jimu-core'
import type { IMConfig } from '../config'
import defaultMessages from '../setting/translations/default'

export default class BuilderOperations implements extensionSpec.BuilderOperationsExtension {
  id = 'near-me-builder-operation'
  widgetId: string

  getTranslationKey (appConfig: IMAppConfig): Promise<extensionSpec.TranslationKey[]> {
    const config = appConfig.widgets[this.widgetId].config as IMConfig
    const keys: extensionSpec.TranslationKey[] = []
    // General Settings - No results found message
    config.generalSettings && config.generalSettings.noResultsFoundText && keys.push({
      keyType: 'value',
      key: `widgets.${this.widgetId}.config.generalSettings.noResultsFoundText`,
      label: {
        key: 'noResultsFoundLabel',
        enLabel: defaultMessages.noResultsFoundLabel
      },
      valueType: "textarea",
    })
    // General Settings - Custom message
    config.generalSettings && config.generalSettings.promptTextMessage && keys.push({
      keyType: 'value',
      key: `widgets.${this.widgetId}.config.generalSettings.promptTextMessage`,
      label: {
        key: 'promptMessageLabel',
        enLabel: defaultMessages.promptMessageLabel
      },
      valueType: "textarea",
    })
    const dsIds = Object.keys(config?.configInfo) || []
    dsIds.forEach((dsId: string) => {
      // Data Source Group
      const dsGroupKey = `widgets.${this.widgetId}.config.configInfo.${dsId}`
      keys.push({
        keyType: 'group',
        key: dsGroupKey,
        label: DataSourceManager.getInstance().getDataSource(dsId).getLabel()
      })

      // Search Settings - Heading Label
      const individualConfigInfo = config?.configInfo[dsId]
      if (individualConfigInfo.searchSettings.headingLabel) {
        keys.push({
          keyType: 'value',
          key: `widgets.${this.widgetId}.config.configInfo.${dsId}.searchSettings.headingLabel`,
          groupKey: dsGroupKey,
          label: {
            key: 'headingLabel',
            enLabel: defaultMessages.headingLabel
          },
          valueType: "text",
        })
      }
      // Each Analysis labels
      individualConfigInfo.analysisSettings.layersInfo.forEach((layerInfo, index) => {
        if (layerInfo.label) {
          keys.push({
            keyType: 'value',
            key: `widgets.${this.widgetId}.config.configInfo.${dsId}.analysisSettings.layersInfo[${index}].label`,
            groupKey: dsGroupKey,
            label: {
              key: 'analysisLabel',
              enLabel: layerInfo.label
            },
            valueType: "text",
          })
        }
      })
    })
    return Promise.resolve(keys)
  }
}
