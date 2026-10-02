import type { extensionSpec, IMAppConfig } from 'jimu-core'
import type { IMConfig } from '../config'

export default class BuilderOperations implements extensionSpec.BuilderOperationsExtension {
  id = 'coordinate-conversion-builder-operation'
  widgetId: string

  getTranslationKey (appConfig: IMAppConfig): Promise<extensionSpec.TranslationKey[]> {
    const config = appConfig.widgets[this.widgetId].config as IMConfig
    const keys: extensionSpec.TranslationKey[] = []

    const outputSettings = config?.outputSettings || []
      // Each format labels
      outputSettings.forEach((config, index) => {
        if (config.label) {
          keys.push({
            keyType: 'value',
            key: `widgets.${this.widgetId}.config.outputSettings[${index}].label`,
            label: {
              key: 'label',
              enLabel: config.label
            },
            valueType: "text",
          })
        }
    })
    return Promise.resolve(keys)
  }
}
