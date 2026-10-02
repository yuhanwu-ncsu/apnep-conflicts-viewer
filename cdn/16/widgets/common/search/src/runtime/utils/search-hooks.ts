import { React } from 'jimu-core'
import { isEmptyObject, getServiceItemDsId } from './utils'

interface ClearedDsFilterSearchServiceIdsOption {
  currentServiceList: { [key: string]: any }
  dataSourcesInfo: any
  widgetId: string
  enableFiltering: boolean
}

export const useConfigIdsWithClearDsFilter = (option: ClearedDsFilterSearchServiceIdsOption): Set<string> => {
  const { currentServiceList, dataSourcesInfo, widgetId, enableFiltering } = option
  const prevDsWidgetQueryRef = React.useRef({} as { [key: string]: any })
  const prevSearchServiceIdsRef = React.useRef(new Set<string>())

  return React.useMemo(() => {
    if (!enableFiltering) {
      prevDsWidgetQueryRef.current = {}
      if (prevSearchServiceIdsRef.current.size === 0) {
        return prevSearchServiceIdsRef.current
      }
      prevSearchServiceIdsRef.current = new Set<string>()
      return prevSearchServiceIdsRef.current
    }

    const dsToConfigIds = {} as { [key: string]: string[] }
    const nextDsWidgetQuery = {} as { [key: string]: any }
    const removedConfigIds = new Set<string>()

    for (const configId in currentServiceList) {
      const dsId = getServiceItemDsId(currentServiceList[configId])
      if (!dsId) continue
      if (!dsToConfigIds[dsId]) {
        dsToConfigIds[dsId] = []
      }
      dsToConfigIds[dsId].push(configId)
    }

    for (const dsId in dsToConfigIds) {
      const currentWidgetQuery = dataSourcesInfo?.[dsId]?.widgetQueries?.[widgetId]
      const preWidgetQuery = prevDsWidgetQueryRef.current?.[dsId]
      const hasChanged = preWidgetQuery !== currentWidgetQuery
      const isCleared = currentWidgetQuery == null || isEmptyObject(currentWidgetQuery)

      if (hasChanged && isCleared) {
        dsToConfigIds[dsId].forEach(configId => {
          removedConfigIds.add(configId)
        })
      }
      nextDsWidgetQuery[dsId] = currentWidgetQuery
    }

    prevDsWidgetQueryRef.current = nextDsWidgetQuery
    const prevSearchServiceIds = prevSearchServiceIdsRef.current
    const isSameResult =
      prevSearchServiceIds.size === removedConfigIds.size &&
      [...removedConfigIds].every(configId => prevSearchServiceIds.has(configId))

    if (isSameResult) {
      return prevSearchServiceIds
    }

    prevSearchServiceIdsRef.current = removedConfigIds
    return removedConfigIds
  }, [dataSourcesInfo, currentServiceList, widgetId, enableFiltering])
}
