import type { extensionSpec, IMAppConfig } from 'jimu-core'
import { type IMConfig, BasemapsType } from '../config'
import { isBasemapFromUrl } from '../utils'

export default class BuilderOperations implements extensionSpec.BuilderOperationsExtension {
  id = 'basemap-gallery-builder-operation'
  widgetId: string

  getTranslationKey (appConfig: IMAppConfig): Promise<extensionSpec.TranslationKey[]> {
    const widgetConfig = appConfig.widgets[this.widgetId].config as IMConfig
    const customBasemaps = widgetConfig.customBasemaps
    const keys: extensionSpec.TranslationKey[] = []
    if (widgetConfig.basemapsType === BasemapsType.Custom && customBasemaps?.length > 0) {
      customBasemaps.forEach((basemapInfo, index) => {
        if (isBasemapFromUrl(basemapInfo)) {
          keys.push({
            keyType: 'value',
            key: `widgets.${this.widgetId}.config.customBasemaps[${index}].title`,
            label: {
              key: 'i18nLabelFor',
              values: { value: basemapInfo.title },
              enLabel: `Label for "${basemapInfo.title}"`
            },
            valueType: 'text'
          })
        }
      })
    }

    return Promise.resolve(keys)
  }
}
