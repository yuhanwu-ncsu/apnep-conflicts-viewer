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
    const links = config?.functionConfig?.loginOptions?.links || []
    links.forEach ((link, index) => {
      keys.push({
        keyType: 'value',
        key: `widgets.${this.widgetId}.config.functionConfig.loginOptions.links[${index}].label`,
        label: {
          key: 'dataLabelForML',
          enLabel: message.link
        },
        valueType: 'text'
      })
    })
    return Promise.resolve(keys)
  }
}

