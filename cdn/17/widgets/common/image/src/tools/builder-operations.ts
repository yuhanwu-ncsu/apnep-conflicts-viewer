import { configTranslationUtils, type Expression, type extensionSpec, type IMAppConfig, type ImmutableObject } from 'jimu-core'
import { defaultMessages as jimuUiMessage } from 'jimu-ui'
import type { IMConfig } from '../config'

export default class BuilderOperations implements extensionSpec.BuilderOperationsExtension {
  id = 'image-builder-operation'
  widgetId: string

  getTranslationKey (appConfig: IMAppConfig): Promise<extensionSpec.TranslationKey[]> {
    const config = appConfig.widgets[this.widgetId].config as IMConfig
    const { functionConfig } = config
    const keys: extensionSpec.TranslationKey[] = []
    if (functionConfig?.toolTip) {
      keys.push({
        keyType: 'value',
        key: `widgets.${this.widgetId}.config.functionConfig.toolTip`,
        label: {
          key: 'tooltip',
          enLabel: jimuUiMessage.tooltip
        },
        valueType: 'text'
      })
    }
    if (functionConfig?.altText) {
      keys.push({
        keyType: 'value',
        key: `widgets.${this.widgetId}.config.functionConfig.altText`,
        label: {
          key: 'altText',
          enLabel: jimuUiMessage.altText
        },
        valueType: 'text'
      })
    }
    if (functionConfig?.toolTipExpression) {
      const key = getExpressionKey(
        functionConfig.toolTipExpression,
        `widgets.${this.widgetId}.config.functionConfig.toolTipExpression`,
        'tooltip',
        jimuUiMessage.tooltip
      )
      key && keys.push(key)
    }
    if (functionConfig?.altTextExpression) {
      const key = getExpressionKey(
        functionConfig.altTextExpression,
        `widgets.${this.widgetId}.config.functionConfig.altTextExpression`,
        'altText',
        jimuUiMessage.altText
      )
      key && keys.push(key)
    }

    return Promise.resolve(keys)
  }
}

function getExpressionKey (expression: ImmutableObject<Expression>, configPath: string, labelKey: string, enLabel: string): extensionSpec.TranslationKey {
  if (!expression) return null
  const translationConfig: configTranslationUtils.ExpressionTranslationConfig = configTranslationUtils.getExpressionTranslationConfig(expression)
  if (!translationConfig.shouldTranslate) return null
  return {
    keyType: 'value',
    key: translationConfig.keyPath ? `${configPath}.${translationConfig.keyPath}` : configPath,
    label: {
      key: labelKey,
      enLabel,
    },
    valueType: translationConfig.valueType
  }
}