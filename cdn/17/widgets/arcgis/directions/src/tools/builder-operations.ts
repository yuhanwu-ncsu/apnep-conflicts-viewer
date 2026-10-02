import type { extensionSpec, IMAppConfig } from 'jimu-core'
import { defaultMessages as jimuUIMessage } from 'jimu-ui'
import defaultMessage from '../setting/translations/default'
import type { IMConfig } from '../config'
const messages = Object.assign({}, jimuUIMessage, defaultMessage)

export default class BuilderOperations implements extensionSpec.BuilderOperationsExtension {
  id = 'directions-builder-operation'
  widgetId: string

  getTranslationKey (appConfig: IMAppConfig): Promise<extensionSpec.TranslationKey[]> {
    const keys: extensionSpec.TranslationKey[] = []
    const widgetConfig = appConfig.widgets[this.widgetId].config as IMConfig
    const { searchConfig } = widgetConfig

    if (searchConfig?.generalConfig?.hint) {
      keys.push({
        keyType: 'value',
        key: `widgets.${this.widgetId}.config.searchConfig.generalConfig.hint`,
        label: {
          key: 'hintForAll',
          enLabel: messages.hintForAll
        },
        valueType: 'text'
      })
    }

    // Each locator should have its own translation group with label and hint keys
    if (searchConfig?.dataConfig) {
      for (let i = 0; i < searchConfig.dataConfig.length; i++) {
        const groupKey = `widgets.${this.widgetId}.config.searchConfig.dataConfig[${i}]`
        const locatorLabel = searchConfig.dataConfig[i]?.label || `Locator ${i + 1}`

        keys.push({
          keyType: 'group',
          key: groupKey,
          label: locatorLabel
        })

        keys.push({
          keyType: 'value',
          key: `${groupKey}.label`,
          groupKey,
          label: {
            key: 'label',
            enLabel: messages.label
          },
          valueType: 'text'
        })

        if (searchConfig.dataConfig[i]?.hint) {
          keys.push({
            keyType: 'value',
            key: `${groupKey}.hint`,
            groupKey,
            label: {
              key: 'hint',
              enLabel: messages.hint
            },
            valueType: 'text'
          })
        }
      }
    }

    return Promise.resolve(keys)
  }
}
