import { DataSourceManager, DataSourceStatus, type FeatureLayerDataSource } from 'jimu-core'

import type { IMSearchConfig } from '../config'
import { getDirectionPointOutputDsId, getDirectionLineOutputDsId, getRouteOutputDsId, getStopOutputDsId } from '../utils'

export type DirectionsDataActionStateKey = 'directionsFromPoint' | 'directionsToPoint' | 'routeStops'

export interface DirectionsDataActionState {
  directionsFromPoint?: __esri.Point
  directionsToPoint?: __esri.Point
  routeStops?: __esri.Point[]
}

export interface SaveVisibilityConfig {
  hideLayerDetails: boolean
  hideSaveAsButton: boolean
  hideSaveButton: boolean
}

export function getSaveVisibilityConfig (enableRouteSaving?: boolean): SaveVisibilityConfig {
  const shouldHide = !(enableRouteSaving ?? true)
  return {
    hideLayerDetails: shouldHide,
    hideSaveAsButton: shouldHide,
    hideSaveButton: shouldHide
  }
}

export function getValidStopCount (layer: __esri.RouteLayer): number {
  if (!layer?.stops) {
    return 0
  }
  return layer.stops.filter((stop) => stop?.geometry !== null).length
}

export async function solveRouteIfPossible (options: {
  layer: __esri.RouteLayer
  getDirections: () => Promise<any>
  minStops?: number
}): Promise<boolean> {
  const { layer, getDirections, minStops = 2 } = options
  if (getValidStopCount(layer) < minStops) {
    return false
  }
  await getDirections()
  return true
}

export async function applyDataActionToLayer (options: {
  layer: __esri.RouteLayer
  mutableStateProps: DirectionsDataActionState
  searchConfig: IMSearchConfig
  resolveAddress: (point: __esri.Point, searchConfig: IMSearchConfig) => Promise<string>
}): Promise<DirectionsDataActionStateKey | null> {
  const { layer, mutableStateProps, searchConfig, resolveAddress } = options
  if (!layer || !mutableStateProps) {
    return null
  }

  const { directionsFromPoint, directionsToPoint, routeStops } = mutableStateProps
  if (directionsFromPoint) {
    const address = await resolveAddress(directionsFromPoint, searchConfig)
    layer.stops.at(0).geometry = directionsFromPoint
    layer.stops.at(0).name = address
    return 'directionsFromPoint'
  }

  if (directionsToPoint) {
    const address = await resolveAddress(directionsToPoint, searchConfig)
    const stopLength = layer.stops.length
    layer.stops.at(stopLength - 1).geometry = directionsToPoint
    layer.stops.at(stopLength - 1).name = address
    return 'directionsToPoint'
  }

  if (routeStops) {
    const stops = await Promise.all(routeStops.map(async stopPoint => {
      const addressName = await resolveAddress(stopPoint, searchConfig)
      return {
        geometry: stopPoint,
        name: addressName
      }
    }))
    layer.stops.removeAll()
    layer.stops.addMany(stops as any)
    return 'routeStops'
  }

  return null
}

export async function setOutputDssNotReady (widgetId: string) {
  try {
    const stopOutputDs = await DataSourceManager.getInstance().createDataSource(getStopOutputDsId(widgetId)) as FeatureLayerDataSource
    const routeOutputDs = await DataSourceManager.getInstance().createDataSource(getRouteOutputDsId(widgetId)) as FeatureLayerDataSource
    const directionPointOutputDs = await DataSourceManager.getInstance().createDataSource(getDirectionPointOutputDsId(widgetId)) as FeatureLayerDataSource
    const directionLineOutputDs = await DataSourceManager.getInstance().createDataSource(getDirectionLineOutputDsId(widgetId)) as FeatureLayerDataSource

    setDsNotReady(stopOutputDs)
    setDsNotReady(routeOutputDs)
    setDsNotReady(directionPointOutputDs)
    setDsNotReady(directionLineOutputDs)
  } catch (e) {
    console.log('Failed to create directions output data sources. ', e)
  }
}

export async function setOutputDssUnloadedAndSetLayer (widgetId: string, result: __esri.RouteLayerSolveResult) {
  try {
    const stopOutputDs = await DataSourceManager.getInstance().createDataSource(getStopOutputDsId(widgetId)) as FeatureLayerDataSource
    const routeOutputDs = await DataSourceManager.getInstance().createDataSource(getRouteOutputDsId(widgetId)) as FeatureLayerDataSource
    const directionPointOutputDs = await DataSourceManager.getInstance().createDataSource(getDirectionPointOutputDsId(widgetId)) as FeatureLayerDataSource
    const directionLineOutputDs = await DataSourceManager.getInstance().createDataSource(getDirectionLineOutputDsId(widgetId)) as FeatureLayerDataSource

    await createJSAPILayerForDs(stopOutputDs, 'point', convertToJSAPIGraphic(result.stops?.toArray()))
    await createJSAPILayerForDs(routeOutputDs, 'polyline', convertToJSAPIGraphic(result.routeInfo ? [result.routeInfo] : []))
    await createJSAPILayerForDs(directionPointOutputDs, 'point', convertToJSAPIGraphic(result.directionPoints?.toArray()))
    await createJSAPILayerForDs(directionLineOutputDs, 'polyline', convertToJSAPIGraphic(result.directionLines?.toArray()))

    setDsUnloaded(stopOutputDs)
    setDsUnloaded(routeOutputDs)
    setDsUnloaded(directionPointOutputDs)
    setDsUnloaded(directionLineOutputDs)
  } catch (e) {
    console.log('Failed to create directions output data sources. ', e)
  }
}

export function setDsNotReady (ds: FeatureLayerDataSource) {
  if (ds) {
    ds.setStatus(DataSourceStatus.NotReady)
    ds.setCountStatus(DataSourceStatus.NotReady)
  }
}

export function setDsUnloaded (ds: FeatureLayerDataSource) {
  if (ds) {
    ds.setStatus(DataSourceStatus.Unloaded)
    ds.setCountStatus(DataSourceStatus.Unloaded)
  }
}

export async function createJSAPILayerForDs (ds: FeatureLayerDataSource, geoType: 'point' | 'polyline', source: __esri.Graphic[]) {
  if (!ds) {
    return
  }
  await ds.setSourceFeatures(source, {
    id: ds.id,
    geometryType: geoType
  })
}

export function convertToJSAPIGraphic (res: __esri.Stop[] | __esri.RouteInfo[] | __esri.DirectionLine[] | __esri.DirectionPoint[]): __esri.Graphic[] {
  if (!res) {
    return []
  }
  return res.map((r: __esri.Stop | __esri.RouteInfo | __esri.DirectionLine | __esri.DirectionPoint) => r?.toGraphic()).filter(g => !!g)
}
