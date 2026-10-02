import type { extensionSpec, IMAppConfig } from 'jimu-core'
import { defaultMessages as jimuUIMessage } from 'jimu-ui'
import type { IMConfig } from '../config'
import defaultMessage from '../setting/translations/default'
import { getKeysInSqlExprBuilder } from 'jimu-ui/basic/sql-expression-runtime'
const messages = Object.assign({}, jimuUIMessage, defaultMessage)
export default class BuilderOperations implements extensionSpec.BuilderOperationsExtension {
  id = 'button-builder-operation'
  widgetId: string

  getTranslationKey (appConfig: IMAppConfig): Promise<extensionSpec.TranslationKey[]> {
    const widgetConfig = appConfig.widgets[this.widgetId].config as IMConfig
    let keys: extensionSpec.TranslationKey[] = []
    const hasSortTranslation = !!(widgetConfig.sorts && widgetConfig.sorts?.length > 0)
    const hasFilterTranslation = !!(widgetConfig?.filter?.parts && widgetConfig?.filter?.parts?.length > 0)
    const hasSearchHintTranslation = !!widgetConfig.searchHint
    const hasToolsTranslation = hasSortTranslation || hasFilterTranslation || hasSearchHintTranslation
    const toolsGroupKey = `widgets.${this.widgetId}.config.tools`
    const sortGroupKey = `${toolsGroupKey}.sort`
    const filterGroupKey = `${toolsGroupKey}.filter`

    if (hasToolsTranslation) {
      keys.push({
        keyType: 'group',
        key: toolsGroupKey,
        label: {
          key: 'tools',
          enLabel: messages.tools
        }
      })
    }

    if (widgetConfig.searchHint) {
      keys.push({
        keyType: 'value',
        key: `widgets.${this.widgetId}.config.searchHint`,
        groupKey: toolsGroupKey,
        label: {
          key: 'searchToolHint',
          enLabel: messages.searchToolHint
        },
        valueType: 'text'
      })
    }

    if (hasSortTranslation) {
      keys.push({
        keyType: 'group',
        key: sortGroupKey,
        groupKey: toolsGroupKey,
        label: {
          key: 'sort',
          enLabel: messages.sort
        }
      })
    }

    if (hasFilterTranslation) {
      keys.push({
        keyType: 'group',
        key: filterGroupKey,
        groupKey: toolsGroupKey,
        label: {
          key: 'filter',
          enLabel: messages.filter
        }
      })
    }

    if (widgetConfig.noDataMessage) {
      keys.push({
        keyType: 'value',
        key: `widgets.${this.widgetId}.config.noDataMessage`,
        label: {
          key: 'noDataMessage',
          enLabel: messages.noDataMessage
        },
        valueType: 'text'
      })
    }

    if (widgetConfig.sorts && widgetConfig.sorts?.length > 0) {
      widgetConfig.sorts.forEach((sort, index) => {
        keys.push({
          keyType: 'value',
          key: `widgets.${this.widgetId}.config.sorts[${index}].ruleOptionName`,
          groupKey: sortGroupKey,
          label: {
            key: 'i18nNameFor',
            values: { value: sort.ruleOptionName || `${messages.sort} ${index + 1}` },
            enLabel: `Name for "${sort.ruleOptionName || `${messages.sort} ${index + 1}`}"`
          },
          valueType: 'text'
        })
      })
    }

    if (widgetConfig?.filter?.parts && widgetConfig?.filter?.parts?.length > 0) {
      const keysOfFilter = getKeysInSqlExprBuilder(widgetConfig?.filter, `widgets.${this.widgetId}.config.filter`, filterGroupKey)
      keys = keys.concat(keysOfFilter)
    }

    return Promise.resolve(keys)
  }
}
