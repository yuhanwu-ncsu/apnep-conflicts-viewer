import type { extensionSpec, IMAppConfig } from 'jimu-core'
import type { IMConfig } from '../config'
import {defaultMessages as jimuUIMessage} from 'jimu-ui'
import defaultMessages from '../setting/translations/default'

const message = Object.assign({}, jimuUIMessage, defaultMessages)

export default class BuilderOperations implements extensionSpec.BuilderOperationsExtension {
  id = 'filter-builder-operation'
  widgetId: string

  getTranslationKey (appConfig: IMAppConfig): Promise<extensionSpec.TranslationKey[]> {
    const keys: extensionSpec.TranslationKey[] = []
    const config = appConfig.widgets[this.widgetId].config as IMConfig
    if (config.noDataMessage) {
      keys.push({
        keyType: 'value',
        key: `widgets.${this.widgetId}.config.noDataMessage`,
        label: {
          key: 'noDataMessage',
          enLabel: message.noDataMessage
        },
        valueType: 'textarea'
      })
    }

    if (config.dsConfigs) {
      config.dsConfigs.forEach ((dsConfig, index) => {
        keys.push({
          keyType: 'value',
          key: `widgets.${this.widgetId}.config.dsConfigs[${index}].label`,
          label: {
            key: 'i18nLabelFor',
            values: { value: dsConfig.label },
            enLabel: `Label for "${dsConfig.label}"`
          },
          valueType: 'text'
        })
      })
    }
    return Promise.resolve(keys)
  }
}

