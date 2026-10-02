import type { extensionSpec, IMAppConfig } from 'jimu-core'
import defaultMessages from '../setting/translations/default'
import { SwipeMode, SwipeStyle, type IMConfig } from '../config'

export default class BuilderOperations implements extensionSpec.BuilderOperationsExtension {
  id = 'swipe-builder-operation'
  widgetId: string

  getTranslationKey (appConfig: IMAppConfig): Promise<extensionSpec.TranslationKey[]> {
    const config = appConfig.widgets[this.widgetId].config as IMConfig
    const { swipeMode, swipeStyle } = config
    const keys: extensionSpec.TranslationKey[] = []
    const path = `widgets.${this.widgetId}.config`
    if (swipeMode === SwipeMode.SwipeBetweenLayers && (swipeStyle === SwipeStyle.SimpleHorizontal || swipeStyle === SwipeStyle.SimpleVertical)) {
      if (config.leadingLayersAlias) {
        keys.push({
          keyType: 'value',
          key: `${path}.leadingLayersAlias`,
          label: {
            key: 'leadingLayersAlias',
            enLabel: defaultMessages.leadingLayersAlias
          },
          valueType: 'text'
        })
      }
      if (config.trailingLayersAlias) {
        keys.push({
          keyType: 'value',
          key: `${path}.trailingLayersAlias`,
          label: {
            key: 'trailingLayersAlias',
            enLabel: defaultMessages.trailingLayersAlias
          },
          valueType: 'text'
        })
      }
    }
    return Promise.resolve(keys)
  }
}
