import { configTranslationUtils, type Expression, type extensionSpec, type IMAppConfig } from 'jimu-core'
import { defaultMessages as jimuUIMessage } from 'jimu-ui'
import defaultMessage from '../setting/translations/default'
const messages = Object.assign({}, jimuUIMessage, defaultMessage)

export default class BuilderOperations implements extensionSpec.BuilderOperationsExtension {
  id = 'button-builder-operation'
  widgetId: string

  getTranslationKey (appConfig: IMAppConfig): Promise<extensionSpec.TranslationKey[]> {
    const functionConfig = appConfig.widgets[this.widgetId].config.functionConfig
    const keys: extensionSpec.TranslationKey[] = []

    if (functionConfig.toolTip) {
      keys.push({
        keyType: 'value',
        key: `widgets.${this.widgetId}.config.functionConfig.toolTip`,
        label: {
          key: 'tooltip',
          enLabel: messages.tooltip
        },
        valueType: 'text'
      })
    }

    if (functionConfig.toolTipExpression) {
      const toolTipExpression: Expression = functionConfig.toolTipExpression
      const translationConfig: configTranslationUtils.ExpressionTranslationConfig = configTranslationUtils.getExpressionTranslationConfig(toolTipExpression)

      if (translationConfig.shouldTranslate) {
        const expressionKey = translationConfig.keyPath
          ? `widgets.${this.widgetId}.config.functionConfig.toolTipExpression.${translationConfig.keyPath}`
          : `widgets.${this.widgetId}.config.functionConfig.toolTipExpression`

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

    if (functionConfig.text) {
      keys.push({
        keyType: 'value',
        key: `widgets.${this.widgetId}.config.functionConfig.text`,
        label: {
          key: 'text',
          enLabel: messages.text
        },
        valueType: 'text'
      })
    }

    if (functionConfig.textExpression) {
      const textExpression: Expression = functionConfig.textExpression
      const translationConfig: configTranslationUtils.ExpressionTranslationConfig = configTranslationUtils.getExpressionTranslationConfig(textExpression)

      if (translationConfig.shouldTranslate) {
        const expressionKey = translationConfig.keyPath
          ? `widgets.${this.widgetId}.config.functionConfig.textExpression.${translationConfig.keyPath}`
          : `widgets.${this.widgetId}.config.functionConfig.textExpression`

        keys.push({
          keyType: 'value',
          key: expressionKey,
          label: {
            key: 'text',
            enLabel: messages.text
          },
          valueType: translationConfig.valueType
        })
      }
    }


    return Promise.resolve(keys)
  }
}