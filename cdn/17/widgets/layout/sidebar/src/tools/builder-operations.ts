import type { extensionSpec, IMAppConfig } from 'jimu-core'
import { defaultMessages as jimuUIMessages } from 'jimu-ui'
import type { IMSidebarConfig } from '../config'

export default class BuilderOperations implements extensionSpec.BuilderOperationsExtension {
  id = 'sidebar-builder-operation'
  widgetId: string

  getTranslationKey (appConfig: IMAppConfig): Promise<extensionSpec.TranslationKey[]> {
    if(!appConfig.widgets[this.widgetId]) {
      return Promise.resolve([])
    }
    const config = appConfig.widgets[this.widgetId].config as IMSidebarConfig
    const keys: extensionSpec.TranslationKey[] = []
    const prefix = `widgets.${this.widgetId}.config`
    if (config.collapseTooltip) {
      keys.push({
        keyType: 'value',
        key: `${prefix}.collapseTooltip`,
        label: {
          key: 'label',
          enLabel: jimuUIMessages.collapse
        },
        valueType: "text",
      })
    }
    if (config.expandTooltip) {
      keys.push({
        keyType: 'value',
        key: `${prefix}.expandTooltip`,
        label: {
          key: 'label',
          enLabel: jimuUIMessages.expand
        },
        valueType: "text",
      })
    }
    return Promise.resolve(keys)
  }
}
