import { type extensionSpec, type IMAppConfig, type ImmutableArray, DataSourceManager } from 'jimu-core'
import type { IMConfig, DataSourceItem, IMDataSourceItem } from '../config'
import defaultMessage from '../setting/translations/default'
import { getKeysInSqlExprBuilder } from 'jimu-ui/basic/sql-expression-runtime'

interface DataSourceItemWithIndex {
  dataSourceItem: IMDataSourceItem;
  itemIndex: number;
}

export default class BuilderOperations implements extensionSpec.BuilderOperationsExtension {
  id = 'select-builder-operation'
  widgetId: string

  async getTranslationKey (appConfig: IMAppConfig): Promise<extensionSpec.TranslationKey[]> {
    const resultKeys: extensionSpec.TranslationKey[] = []

    const widgetConfig = appConfig?.widgets?.[this.widgetId]?.config as IMConfig
    const dataAttributeInfo = widgetConfig?.dataAttributeInfo
    const mapInfo = widgetConfig?.mapInfo

    if (dataAttributeInfo) {
      const dataSourceItems = dataAttributeInfo.dataSourceItems

      if (dataSourceItems?.length > 0) {
        const keyPrefix = `widgets.${this.widgetId}.config.dataAttributeInfo`
        const keys = await getKeysOfDataSourceItems(keyPrefix, dataSourceItems)

        if (keys?.length > 0) {
          resultKeys.push(...keys)
        }
      }
    }

    if (mapInfo) {
      const jimuMapViewIds = Object.keys(mapInfo)

      const promises = jimuMapViewIds.map(async (jimuMapViewId) => {
        const jimuMapViewInfo = mapInfo[jimuMapViewId]

        if (jimuMapViewInfo) {
          const {
            enableAttributeSelection,
            dataSourceItems
          } = jimuMapViewInfo

          if (enableAttributeSelection && dataSourceItems?.length > 0) {
            const keyPrefix = `widgets.${this.widgetId}.config.mapInfo.${jimuMapViewId}`
            const keys = await getKeysOfDataSourceItems(keyPrefix, dataSourceItems)

            if (keys?.length > 0) {
              const mapLabel = getMapDataSourceLabel(jimuMapViewId, appConfig)

              if (mapLabel) {
                const mapGroupKey: extensionSpec.TranslationKey = {
                  keyType: 'group',
                  key: keyPrefix,
                  label: mapLabel
                }

                keys.unshift(mapGroupKey)
                // Mark all direct children (sub-groups for each data source item) as belonging to this map group
                keys.forEach(k => {
                  if (k !== mapGroupKey && !k.groupKey) {
                    (k as extensionSpec.TranslationKeyGroup).groupKey = keyPrefix
                  }
                })
              }

              resultKeys.push(...keys)
            }
          }
        }
      })

      await Promise.all(promises)
    }

    return resultKeys
  }
}

function getMapDataSourceLabel (jimuMapViewId: string, appConfig: IMAppConfig): string {
  let resultLabel: string = ''

  if (jimuMapViewId && jimuMapViewId.includes('-')) {
    const parts = jimuMapViewId.split('-')

    if (parts.length === 2) {
      const mapDataSourceId = parts[1]

      if (mapDataSourceId) {
        const mapDataSourceJson = appConfig.dataSources?.[mapDataSourceId]
        resultLabel = mapDataSourceJson?.label || mapDataSourceJson?.sourceLabel
      }
    }
  }

  return resultLabel
}

async function getKeysOfDataSourceItems (keyPrefix: string, imDataSourceItems: ImmutableArray<DataSourceItem>): Promise<extensionSpec.TranslationKey[]> {
  const resultKeys: extensionSpec.TranslationKey[] = []
  const dsManager = DataSourceManager.getInstance()
  const dataSourceItemWithIndexArray: DataSourceItemWithIndex[] = []

  if (imDataSourceItems?.length > 0) {
    imDataSourceItems.forEach((imDataSourceItem, itemIndex) => {
      if (imDataSourceItem.sqlHint || imDataSourceItem.sqlExpression?.parts?.length > 0) {
        const dataSourceItemWithIndex: DataSourceItemWithIndex = {
          dataSourceItem: imDataSourceItem,
          itemIndex
        }

        dataSourceItemWithIndexArray.push(dataSourceItemWithIndex)
      }
    })

    if (dataSourceItemWithIndexArray.length > 0) {
      const dataSourceItems = dataSourceItemWithIndexArray.map(item => item.dataSourceItem)
      await createDataSources(dataSourceItems)

      dataSourceItemWithIndexArray.forEach((dataSourceItemWithIndex) => {
        const {
          dataSourceItem,
          itemIndex
        } = dataSourceItemWithIndex

        const dataSourceId = dataSourceItem?.useDataSource?.dataSourceId
        const ds = dsManager.getDataSource(dataSourceId)
        const dsLabel = ds?.getLabel() || ''
        const keysForSingleLayerDs: extensionSpec.TranslationKey[] = []

        if (dataSourceItem.sqlHint) {
          keysForSingleLayerDs.push({
            keyType: 'value',
            key: `${keyPrefix}.dataSourceItems[${itemIndex}].sqlHint`,
            label: {
              key: 'labelForAttribution',
              enLabel: defaultMessage.labelForAttribution
            },
            valueType: 'text'
          })
        }

        if (dataSourceItem.sqlExpression) {
          const sqlKeys = getKeysInSqlExprBuilder(dataSourceItem.sqlExpression, `${keyPrefix}.dataSourceItems[${itemIndex}].sqlExpression`)

          if (sqlKeys?.length > 0) {
            keysForSingleLayerDs.push(...sqlKeys)
          }
        }

        if (keysForSingleLayerDs?.length > 0) {
          const dsGroupKey = `${keyPrefix}.dataSourceItems[${itemIndex}]`
          keysForSingleLayerDs.unshift({
            keyType: 'group',
            key: dsGroupKey,
            label: dsLabel
          })
          // Mark all value children as belonging to this ds group
          keysForSingleLayerDs.forEach(k => {
            if (k.key !== dsGroupKey) {
              k.groupKey = dsGroupKey
            }
          })

          resultKeys.push(...keysForSingleLayerDs)
        }
      })
    }
  }

  return resultKeys
}

async function createDataSources (dataSourceItems: IMDataSourceItem[]) {
  if (dataSourceItems?.length > 0) {
    const dsManager = DataSourceManager.getInstance()
    const promises = dataSourceItems.map(async (dataSourceItem) => {
      try {
        await dsManager.createDataSourceByUseDataSource(dataSourceItem.useDataSource)
      } catch {
      }
    })
    await Promise.all(promises)
  }
}
