import { Immutable, type extensionSpec, type IMAppConfig, type ImmutableArray, type ImmutableObject } from 'jimu-core'
import { defaultMessages as jimuUIMessages } from 'jimu-ui'
import { TableModeType, type LayersConfig, type IMConfig, type MapViewConfig } from '../config'

export default class BuilderOperations implements extensionSpec.BuilderOperationsExtension {
  id = 'table-builder-operation'
  widgetId: string

  getTranslationKey (appConfig: IMAppConfig): Promise<extensionSpec.TranslationKey[]> {
    const config = appConfig.widgets[this.widgetId].config as IMConfig
    const {
      tableMode,
      layersConfig = Immutable([]) as ImmutableArray<LayersConfig>,
      mapViewsConfig = Immutable({}) as ImmutableObject<MapViewConfig>
    } = config
    const keys: extensionSpec.TranslationKey[] = []
    if (tableMode === TableModeType.Layer) {
      const layersConfigKeys = getKeysInLayersConfig(layersConfig, `widgets.${this.widgetId}.config`)
      layersConfigKeys.length > 0 && keys.push(...layersConfigKeys)
    } else if (tableMode === TableModeType.Map) {
      if (mapViewsConfig) {
        for (const [jimuMapViewId, mapViewConfig] of Object.entries(mapViewsConfig)) {
          const layersConfigKeys = getKeysInLayersConfig(mapViewConfig.layersConfig, `widgets.${this.widgetId}.config.mapViewsConfig.${jimuMapViewId}`)
          layersConfigKeys.length > 0 && keys.push(...layersConfigKeys)
        }
      }
    }
    return Promise.resolve(keys)
  }
}

export function getKeysInLayersConfig (layersConfig: ImmutableArray<LayersConfig> = Immutable([]), path: string) {
  const keys: extensionSpec.TranslationKey[] = []
  layersConfig.forEach((layerConfig, layerIndex) => {
    const layerName = layerConfig.name
    const layerPath = `${path}.layersConfig[${layerIndex}]`
    const tableGroupKey = `${layerPath}.name`
    keys.push({
      keyType: 'group',
      key: tableGroupKey,
      label: layerName
    })
    keys.push({
      keyType: 'value',
      key: `${layerPath}.name`,
      groupKey: tableGroupKey,
      label: {
        key: 'label',
        values: { value: layerName },
        enLabel: jimuUIMessages.label
      },
      valueType: 'text'
    })
    if (layerConfig.enableSearch && layerConfig.searchHint) {
      keys.push({
        keyType: 'value',
        key: `${layerPath}.searchHint`,
        groupKey: tableGroupKey,
        label: {
          key: 'searchToolHint',
          values: { value: layerConfig.searchHint },
          enLabel: jimuUIMessages.searchToolHint
        },
        valueType: 'text'
      })
    }
  })
  return keys
}
