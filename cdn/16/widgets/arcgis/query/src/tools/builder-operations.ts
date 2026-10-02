import type { extensionSpec, IMAppConfig, ImmutableObject } from 'jimu-core'
import { defaultMessages as jimuUIMessages } from 'jimu-ui'
import { getKeysInSqlExprBuilder } from 'jimu-ui/basic/sql-expression-runtime'
import type { IMConfig, QueryItemType } from '../config'
import defaultMessages from '../setting/translations/default'

export default class BuilderOperations implements extensionSpec.BuilderOperationsExtension {
  id = 'button-builder-operation'
  widgetId: string

  getTranslationKey (appConfig: IMAppConfig): Promise<extensionSpec.TranslationKey[]> {
    const config = appConfig.widgets[this.widgetId].config as IMConfig
    const keys: extensionSpec.TranslationKey[] = []
    const queryItems = config?.queryItems || []
    queryItems.forEach((queryItem: ImmutableObject<QueryItemType>, index: number) => {
      const prefix = `widgets.${this.widgetId}.config.queryItems[${index}]`
      const groupKey = `${prefix}.name`
      keys.push({
        keyType: 'group',
        key: groupKey,
        label: queryItem.name
      })
      if (queryItem.name) {
        keys.push({
          groupKey,
          keyType: 'value',
          key: `${prefix}.name`,
          label: {
            key: 'label',
            enLabel: jimuUIMessages.label
          },
          valueType: "text",
        })
      }
      if (queryItem.attributeFilterLabel) {
        keys.push({
          groupKey,
          keyType: 'value',
          key: `${prefix}.attributeFilterLabel`,
          label: {
            key: 'attributeFilter',
            enLabel: defaultMessages.attributeFilter
          },
          valueType: 'text'
        })
      }
      if (queryItem.sqlExprObj) {
        const sqlKeys = getKeysInSqlExprBuilder(
          queryItem.sqlExprObj,
          `${prefix}.sqlExprObj`,
          groupKey
        )
        sqlKeys.length > 0 && keys.push(...sqlKeys)
      }
      if (queryItem.attributeFilterDesc) {
        keys.push({
          groupKey,
          keyType: 'value',
          key: `${prefix}.attributeFilterDesc`,
          label: {
            key: 'description',
            enLabel: defaultMessages.descriptionForAttr
          },
          valueType: 'textarea'
        })
      }
      if (queryItem.spatialFilterLabel) {
        keys.push({
          groupKey,
          keyType: 'value',
          key: `${prefix}.spatialFilterLabel`,
          label: {
            key: 'spatialFilter',
            enLabel: defaultMessages.spatialFilter
          },
          valueType: 'text'
        })
      }
      if (queryItem.spatialFilterDesc) {
        keys.push({
          groupKey,
          keyType: 'value',
          key: `${prefix}.spatialFilterDesc`,
          label: {
            key: 'description',
            enLabel: defaultMessages.descriptionForSpatial
          },
          valueType: 'textarea'
        })
      }
      if (queryItem.resultsLabel) {
        keys.push({
          groupKey,
          keyType: 'value',
          key: `${prefix}.resultsLabel`,
          label: {
            key: 'results',
            enLabel: defaultMessages.results
          },
          valueType: 'text'
        })
      }
      if (queryItem.resultTitleExpression) {
        keys.push({
          groupKey,
          keyType: 'value',
          key: `${prefix}.resultTitleExpression`,
          label: {
            key: 'configTitle',
            enLabel: defaultMessages.configTitle
          },
          valueType: 'textarea'
        })
      }
    })
    return Promise.resolve(keys)
  }
}
