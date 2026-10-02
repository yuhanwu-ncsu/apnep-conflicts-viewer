import type { extensionSpec, IMAppConfig } from 'jimu-core'
import { FlyItemMode, type RouteItemConfig, type Config } from '../config'


export default class BuilderOperations implements extensionSpec.BuilderOperationsExtension {
  id = 'fly-controller-builder-operation'
  widgetId: string

  getTranslationKey (appConfig: IMAppConfig): Promise<extensionSpec.TranslationKey[]> {
    const keys: extensionSpec.TranslationKey[] = []
    const res = this._getRouteConfig(appConfig.widgets[this.widgetId].config)

    if (res.routeConfigIdx >= 0 && res.routeConfig) {
      // console.log("===========")
      // skip empty routes
      if (res.routeConfig.routes.length <= 0) return

      res.routeConfig.routes.forEach((route, routeIdx) => {
        // skip !isInUse
        if (!route.isInUse) return
        const routeName = route.displayName ?? ''
        // L0 routes
        keys.push({
          keyType: 'value',
          key: `widgets.${this.widgetId}.config.itemsList[${res.routeConfigIdx}].routes[${routeIdx}].displayName`,
          label: {
            key: 'i18nNameFor',
            values: { value: routeName },
            enLabel: `Name for "${routeName}"`
          },
          valueType: 'text'
        })
      })
    }

    return Promise.resolve(keys)
  }

  _getRouteConfig (allConfig: Config): { routeConfig: RouteItemConfig; routeConfigIdx: number } {
    const itemsListConfig = allConfig.itemsList
    const idx = itemsListConfig.findIndex(item => (item.name === FlyItemMode.Route && item.isInUse)) ?? null
    return {
      routeConfigIdx: idx,
      routeConfig: idx >= 0 ? (itemsListConfig[idx] as RouteItemConfig) : null
    }
  }
}