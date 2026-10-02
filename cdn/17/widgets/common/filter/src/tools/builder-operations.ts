import type { extensionSpec, IMAppConfig } from 'jimu-core'
import type { IMConfig } from '../config'
import { getKeysInSqlExprBuilder, getClauseKeys } from 'jimu-ui/basic/sql-expression-runtime'

export default class BuilderOperations implements extensionSpec.BuilderOperationsExtension {
  id = 'filter-builder-operation'
  widgetId: string

  getTranslationKey (appConfig: IMAppConfig): Promise<extensionSpec.TranslationKey[]> {
    const keys: extensionSpec.TranslationKey[] = []
    const config = appConfig.widgets[this.widgetId].config as IMConfig
    config.filterItems?.forEach((filterItem, filterIndex) => {
      const filterGroupKey = `widgets.${this.widgetId}.config.filterItems[${filterIndex}].name`
      keys.push({
        keyType: 'group',
        key: filterGroupKey,
        label: filterItem.name
      })
      keys.push({
        keyType: 'value',
        key: `widgets.${this.widgetId}.config.filterItems[${filterIndex}].name`,
        groupKey: filterGroupKey,
        label: {
          key: 'i18nLabelFor',
          values: { value: filterItem.name },
          enLabel: `Label for "${filterItem.name}"`
        },
        valueType: 'text'
      })
      // add keys from sql expression builder
      if (filterItem.sqlExprObj) {
        const sqlKeys = getKeysInSqlExprBuilder(filterItem.sqlExprObj, `widgets.${this.widgetId}.config.filterItems[${filterIndex}].sqlExprObj`, filterGroupKey)
        sqlKeys.length > 0 && keys.push(...sqlKeys)
      } else if (filterItem.sqlExprObjForGroup) {
        const clause = filterItem.sqlExprObjForGroup[0].clause
        const sqlKeys = getClauseKeys(clause, `widgets.${this.widgetId}.config.filterItems[${filterIndex}].sqlExprObjForGroup[0].clause`, 0, null, filterGroupKey)
        sqlKeys.length > 0 && keys.push(...sqlKeys)
      }
    })
    return Promise.resolve(keys)
  }
}
