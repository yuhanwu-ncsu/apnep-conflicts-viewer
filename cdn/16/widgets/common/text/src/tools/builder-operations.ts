import { configTranslationUtils, type Expression, type extensionSpec, type IMAppConfig } from 'jimu-core'
import { defaultMessages as jimuUIMessage, richTextUtils } from 'jimu-ui'
import defaultMessage from '../setting/translations/default'
const defaultConfig = require('../../config.json')
const messages = Object.assign({}, jimuUIMessage, defaultMessage)

const isDefaultPlaceholderText = (text: string): boolean => {
  const textContent = richTextUtils.getHTMLTextContent(text)?.trim()
  return text.trim() === defaultConfig.placeholder || textContent === defaultConfig.placeholder
}

export const hasTranslatableText = (text?: string): boolean => {
  if (!text || richTextUtils.isBlankRichText(text)) return false
  return !isDefaultPlaceholderText(text)
}

export default class BuilderOperations implements extensionSpec.BuilderOperationsExtension {
  id = 'text-builder-operation'
  widgetId: string

  getTranslationKey (appConfig: IMAppConfig): Promise<extensionSpec.TranslationKey[]> {
    const keys: extensionSpec.TranslationKey[] = []
    const config = appConfig.widgets[this.widgetId]?.config
    if (config?.tooltip) {
          const tooltipExpression: Expression = config.tooltip
          const translationConfig: configTranslationUtils.ExpressionTranslationConfig = configTranslationUtils.getExpressionTranslationConfig(tooltipExpression)
          if (translationConfig.shouldTranslate) {
            const expressionKey = translationConfig.keyPath
              ? `widgets.${this.widgetId}.config.tooltip.${translationConfig.keyPath}`
              : `widgets.${this.widgetId}.config.tooltip`

            keys.push({
              keyType: 'value',
              key: expressionKey,
              label: {
                key: 'tooltip',
                enLabel: messages.tooltip
              },
              valueType: translationConfig.valueType
            })
          }
        }
    if (hasTranslatableText(config?.text)) {
      keys.push({
        keyType: 'value',
        key: `widgets.${this.widgetId}.config.text`,
        label: {
          key: 'textContent',
          enLabel: messages.textContent
        },
        valueType: 'rich-text-with-plugins'
      })
    }

    return Promise.resolve(keys)
  }
}
