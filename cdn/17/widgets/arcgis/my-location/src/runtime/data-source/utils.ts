import Graphic from '@arcgis/core/Graphic'
import { type JimuLayerView, type JimuMapView, zoomToUtils } from 'jimu-arcgis'
import { DataSourceStatus, getAppStore,utils, type FeatureLayerDataSource } from 'jimu-core'
import type { TrackLine, TrackLinePoint, TrackPoint } from '../../config'
import { loadArcGISJSAPIModule } from 'jimu-core'

export enum Operations {
  CREATE = 'CREATE',
  ADD = 'ADD',
  DELETE = 'DELETE',
  UPDATE = 'UPDATE',
  CLEAR = 'CLEAR',
  REFRESH = 'REFRESH'
}

export const setShowRuntimeLayers = (jimuMapView: JimuMapView, dataSourceId: string, showRuntimeLayers: boolean) => {
  if (jimuMapView) {
    const layerView = jimuMapView.getJimuLayerViewByDataSourceId(dataSourceId)
    if (layerView) {
      layerView.layer.listMode = !showRuntimeLayers ? 'hide' : 'show'
    }
  }
}

// eslint-disable-next-line max-params
export const syncToMap = async (operation: Operations, dataSourceId: string, jimuMapView: JimuMapView, operGraphics: Graphic[], rendererObject: object, visible: boolean = true, showRuntimeLayers: boolean = true): Promise<JimuLayerView> => {
  if (!dataSourceId || !jimuMapView) {
    return
  }
  let layerView = jimuMapView.getJimuLayerViewByDataSourceId(dataSourceId)
  if (layerView) {
    if (operation === Operations.ADD) {
      await layerView.layer.applyEdits({
        addFeatures: operGraphics
      })
    } else if (operation === Operations.DELETE) {
      const fs = await layerView.layer.queryFeatures()
      const ids = operGraphics.map(o => o.attributes.OBJECTID)
      if (fs.features.length > 0) {
        const features = fs.features.filter(f => ids.includes(f.getObjectId()))
        if (features.length > 0) {
          await layerView.layer.applyEdits({
            deleteFeatures: features
          })
        }
      }
    } else if (operation === Operations.UPDATE) {
      await layerView.layer.applyEdits({
        updateFeatures: operGraphics
      })
    } else if (operation === Operations.CLEAR) {
      const fs = layerView.getLayerDataSource().getRecords().map((dr: any) => dr.toJson())
      await layerView.layer.applyEdits({
        deleteFeatures: fs.map(f => Graphic.fromJSON(f))
      })
    } else {
      // delete all then add new
      const fs = layerView.getLayerDataSource().getRecords().map(dr => dr.toJson())
      await layerView.layer.applyEdits({
        addFeatures: operGraphics,
        deleteFeatures: fs.map(f => Graphic.fromJSON(f))
      })
    }
    return
  }
  layerView = await jimuMapView.addLayerToMap(dataSourceId, dataSourceId + '__layer')
  layerView.layer.visible = visible
  // hide the layer in Editor widget
  layerView.layer._exb_not_editable = true
  // hide the runtime layers in the layer lists
  layerView.layer.listMode = !showRuntimeLayers ? 'hide' : 'show'
  if (rendererObject) {
    layerView.layer.renderer = rendererObject
  }
  return layerView
}

/**
 * remove layers from jimuMapView
 * @param jimuMapView JimuMapView
 * @param dataSourceId DataSourceID
 */
export const removeLayerFromJimuLayerViews = (jimuMapView: JimuMapView, dataSourceId: string) => {
  if (dataSourceId && jimuMapView) {
    const layerView = jimuMapView.getJimuLayerViewByDataSourceId(dataSourceId)
    if (layerView) {
      const dataSource = layerView.getLayerDataSource()
      jimuMapView.removeJimuLayerView(layerView)
      if (dataSource) {
        dataSource.clearRecords()
        dataSource?.setStatus(DataSourceStatus.NotReady)
        dataSource?.setCountStatus(DataSourceStatus.NotReady)
      }
    }
  }
}
export const updateToSource = (dataSource: FeatureLayerDataSource, graphics: Graphic[], geometryType: 'point' | 'multipoint' | 'polyline' | 'polygon' | 'multipatch' | 'mesh') => {
  if (graphics.length === 0) {
    dataSource.clearRecords()
    dataSource?.setStatus(DataSourceStatus.NotReady)
    dataSource?.setCountStatus(DataSourceStatus.NotReady)
    return
  }
  return dataSource?.setSourceFeatures(graphics, { geometryType })
}

export const createJimuLayerView = async (dataSourceId: string, jimuMapView: JimuMapView, rendererObject: object, visible: boolean = true, showRuntimeLayers: boolean = true): Promise<JimuLayerView> => {
  const layerView = await jimuMapView.addLayerToMap(dataSourceId, dataSourceId + '__layer')
  layerView.layer.visible = visible
  // hide the layer in Editor widget
  layerView.layer._exb_not_editable = true
  // hide the runtime layers in the layer lists
  layerView.layer.listMode = !showRuntimeLayers ? 'hide' : 'show'
  if (rendererObject) {
    layerView.layer.renderer = rendererObject
  }
  return Promise.resolve(layerView)
}
export const createDataSourceLayer = async (dataSource: FeatureLayerDataSource, graphics: Graphic[], geometryType: 'point' | 'polyline'): Promise<void> => {
  await dataSource?.setSourceFeatures(graphics, { geometryType })
  dataSource?.setStatus(DataSourceStatus.Unloaded)
  dataSource?.setCountStatus(DataSourceStatus.Unloaded)
  return Promise.resolve()
}

/** * Update the layer source with new features.
 * @param layer The FeatureLayer to update.
 * @param FeatureLayer The FeatureLayer module.
 * @param source The new source features to set.
 */
const updateLayerSource = (layer: __esri.FeatureLayer, FeatureLayer: typeof __esri.FeatureLayer, source: Graphic[]) => {
  const newLayer = new FeatureLayer({
    id: layer.id,
    fields: layer.fields,
    objectIdField: layer.objectIdField,
    geometryType: layer.geometryType,
    spatialReference: layer.spatialReference,
    source
  })
  layer.source = newLayer.source
  newLayer.destroy()
}

/**
 * Sync data to the layer based on the operation type.
 * @param dataSource The FeatureLayerDataSource to sync.
 * @param layer The FeatureLayer to sync to.
 * @param operation The operation type (ADD, DELETE, UPDATE, CLEAR, CREATE).
 * @param operGraphics The graphics to operate on.
 */
export const syncDataToLayer = async (dataSource: FeatureLayerDataSource, layer: __esri.FeatureLayer, operation: Operations, operGraphics: Graphic[], isNeedToUpdateDS: boolean = true): Promise<void> => {
  if (!layer) {
    console.error('The layer is not found.')
    return
  }
  let newSource = layer.source.toArray()
  const FeatureLayer: typeof __esri.FeatureLayer = await loadArcGISJSAPIModule('esri/layers/FeatureLayer')
  const ids = operGraphics?.map(o => o.attributes.OBJECTID)
  if (operation === Operations.ADD) {
    await layer.applyEdits({
      addFeatures: operGraphics
    })
    if (isNeedToUpdateDS) {
      dataSource.afterAddRecord(dataSource.buildRecord(operGraphics[0]?.clone()))
    }
    newSource = newSource.concat(operGraphics)
    updateLayerSource(layer, FeatureLayer, newSource)
  } else if (operation === Operations.DELETE) {
    await layer.applyEdits({
      deleteFeatures: operGraphics
    })
    if (isNeedToUpdateDS) {
      dataSource.afterDeleteRecordsByIds(ids)
    }
    newSource = newSource.filter(f => !ids.includes(f.attributes.OBJECTID))
    updateLayerSource(layer, FeatureLayer, newSource)
  } else if (operation === Operations.UPDATE) {
    await layer.applyEdits({
      updateFeatures: operGraphics
    })
    if (isNeedToUpdateDS) {
      dataSource.afterUpdateRecords(operGraphics.map(g => dataSource.buildRecord(g.clone())))
    }
    newSource = newSource.map(f => {
      const updatedGraphic = operGraphics.find(g => g.attributes.OBJECTID === f.attributes.OBJECTID)
      return updatedGraphic ? updatedGraphic.clone() : f
    })
    updateLayerSource(layer, FeatureLayer, newSource)
  } else if (operation === Operations.CLEAR) {
    const fs = await layer.queryFeatures()
    await layer.applyEdits({
      deleteFeatures: fs.features
    })
    if (isNeedToUpdateDS) {
      dataSource.afterDeleteRecordsByIds(fs.features.map(f => f.getObjectId()))
    }
    newSource = []
    updateLayerSource(layer, FeatureLayer, newSource)
  } else if (operation === Operations.CREATE) {
    await layer.applyEdits({
      addFeatures: operGraphics
    })
    if (isNeedToUpdateDS) {
      dataSource.afterAddRecord(dataSource.buildRecord(operGraphics[0]?.clone()))
    }
    newSource = newSource.concat(operGraphics)
    updateLayerSource(layer, FeatureLayer, newSource)
  }
}

export const zoomToGraphics = (jimuMapView: JimuMapView, graphics: Graphic[], scale: number, zoomToLocation: boolean) => {
  if (jimuMapView) {
    if (zoomToLocation) {
      zoomToUtils.zoomTo(jimuMapView.view, graphics, { scale })
    } else {
      jimuMapView.view.goTo({
        target: graphics,
        scale: jimuMapView.view.scale
      }).catch((error) => {
        console.error('Error zooming to graphics:', error)
      })
    }
  }
}

export const getPointGraphic = (model: TrackPoint | TrackLinePoint): Graphic => {
  const attributes = model
  const geometry = {
    type: 'point',
    x: model.Longitude,
    y: model.Latitude
  }
  return Graphic.fromJSON({ geometry, attributes: { ...attributes } })
}

export const getLineGraphic = (line: TrackLine, points: TrackLinePoint[]): Graphic => {
  const paths = points.map(t => [t.Longitude, t.Latitude])
  if (points.length === 1) {
    paths.push([points[0].Longitude, points[0].Latitude])
  }
  const geometry = {
    type: 'polyline',
    paths: [paths]
  }
  return Graphic.fromJSON({ geometry, attributes: { ...line } })
}

/**
 * create highlight graphics layer id by widget id
 * @param widgetId  widget id
 * @returns {string} GraphicsLayerId
 */
export const getHighLightGraphicsLayerId = (widgetId: string): string => {
  return `${widgetId}-point-of-sight-track-layer`
}

export function getWidgetObjectIdKey (widgetId: string, dataSourceId: string) {
  const appId = window.jimuConfig?.isBuilder ? getAppStore().getState().appStateInBuilder?.appId : getAppStore().getState().appId
  return `exb-${appId}-${widgetId}-${dataSourceId}-key`
}

/**
 * Get dataSource new feature object id
 * @param dataSourceKey dataSource key
 * @returns oid
 */
export const getObjectId = (dataSourceKey: string, reset: boolean = false): number => {
  if (reset) {
    utils.setLocalStorage(dataSourceKey, '1')
    return 1
  }
  const oid = utils.readLocalStorage(dataSourceKey) ?? '0'
  const nextOid = Number(oid) + 1
  utils.setLocalStorage(dataSourceKey, nextOid.toString())
  return nextOid
}
