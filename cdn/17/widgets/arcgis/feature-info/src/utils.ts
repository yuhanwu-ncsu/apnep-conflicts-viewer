import { Immutable, type DataSource, DataSourceManager, uuidv1, AllDataSourceTypes, type UseDataSource, JSAPILayerTypes, CONSTANTS, SessionManager } from 'jimu-core'
import { loadArcGISJSAPIModules, MapViewManager } from 'jimu-arcgis'
import { DistanceUnits } from 'jimu-ui'
import { type IMConfig, StyleType, FontSizeType } from './config'

export const supportedDsTypes = Immutable([AllDataSourceTypes.FeatureLayer, AllDataSourceTypes.SceneLayer, AllDataSourceTypes.BuildingComponentSubLayer,
  AllDataSourceTypes.OrientedImageryLayer, AllDataSourceTypes.ImageryLayer, AllDataSourceTypes.SubtypeSublayer, AllDataSourceTypes.KnowledgeGraphSublayer])

export const supportedLayerTypes = Immutable([JSAPILayerTypes.FeatureLayer, JSAPILayerTypes.SceneLayer, JSAPILayerTypes.BuildingComponentSublayer,
  JSAPILayerTypes.OrientedImageryLayer, JSAPILayerTypes.ImageryLayer, JSAPILayerTypes.SubtypeSublayer])

export const supportedAllDsTypes = Immutable([
  AllDataSourceTypes.FeatureLayer, AllDataSourceTypes.SceneLayer, AllDataSourceTypes.WebMap, AllDataSourceTypes.WebScene, AllDataSourceTypes.MapService,
  AllDataSourceTypes.FeatureService, AllDataSourceTypes.SceneService, AllDataSourceTypes.GroupLayer, AllDataSourceTypes.BuildingComponentSubLayer,
  AllDataSourceTypes.BuildingGroupSubLayer, AllDataSourceTypes.BuildingSceneLayer, AllDataSourceTypes.OrientedImageryLayer, AllDataSourceTypes.ImageryLayer,
  AllDataSourceTypes.SubtypeGroupLayer, AllDataSourceTypes.SubtypeSublayer
])

export const batchDsTypes = Immutable([
  AllDataSourceTypes.WebMap, AllDataSourceTypes.WebScene, AllDataSourceTypes.MapService, AllDataSourceTypes.FeatureService,
  AllDataSourceTypes.SceneService, AllDataSourceTypes.GroupLayer, AllDataSourceTypes.BuildingGroupSubLayer, AllDataSourceTypes.BuildingSceneLayer,
  AllDataSourceTypes.SubtypeGroupLayer, AllDataSourceTypes.KnowledgeGraphLayer
])

export async function getFeatureLayer (dataSource) {
  return await loadArcGISJSAPIModules([
    'esri/layers/FeatureLayer'
  ]).then(modules => {
    const [FeatureLayer] = modules
    let featureLayer
    if (dataSource.layer) {
      // return Promise.resolve(dataSource.layer);
      featureLayer = dataSource.layer
    } else {
      if (dataSource.itemId) {
        featureLayer = new FeatureLayer({
          portalItem: {
            id: dataSource.itemId,
            portal: {
              url: dataSource.portalUrl
            }
          }
        })
      } else {
        featureLayer = new FeatureLayer({
          url: dataSource.url
        })
      }
    }

    // Bug: js-api does not enter the callback if there is no load method here.
    return featureLayer.load().then(async () => {
      return await Promise.resolve(featureLayer)
    })

    /*
    return new Promise((resolve, reject) => {
      featureLayer.when(() => {
        console.log("when");
        resolve(featureLayer);
      }, () => {
        reject();
        console.log("when error");
      })
    });
     */
  }).catch((e) => {
    console.warn(e)
    return null
  })
}

export function flattenDataSources (ds: DataSource) {
  const flatDataSources = []
  const recursionGetDs = (dataSource: DataSource) => {
    // isDataSourceSet is false represents the ds is leaf node
    if (dataSource.isDataSourceSet()) {
      const childDataSources = dataSource.getChildDataSources()
      childDataSources.forEach(ds => {
        recursionGetDs(ds)
      })
    } else {
      flatDataSources.push(dataSource)
    }
  }
  recursionGetDs(ds)
  return flatDataSources
}

export function isSupportedDataType (dataSource): boolean {
  return supportedDsTypes.includes(dataSource?.type) && !dataSource?.dataSourceJson?.isHidden && dataSource?.getSchema()?.fields
}

export function createDefaultUseDataSource (dataSource) {
  return Immutable({
    dataSourceId: dataSource.id,
    mainDataSourceId: dataSource.getMainDataSource()?.id,
    dataViewId: dataSource.dataViewId,
    rootDataSourceId: dataSource.getRootDataSource()?.id
  } as UseDataSource)
}

export function createDefaultDSConfig (dataSourceId: string, label?: string) {
  const dataSource = DataSourceManager.getInstance().getDataSource(dataSourceId)
  return {
    id: uuidv1(),
    label: label || dataSource?.getLabel() || dataSourceId,
    useDataSourceId: dataSourceId,
    contentConfig: {
      title: true,
      fields: true,
      media: true,
      attachments: true,
      lastEditInfo: true
    }
  }
}

export function getDefaultConfig (): IMConfig {
  return Immutable({
    useMapWidget: true,
    limitGraphics: false,
    maxGraphics: 0,
    noDataMessage: '',
    styleType: StyleType.usePopupDefined,
    style: {
      textColor: '',
      fontSizeType: FontSizeType.auto,
      fontSize: {
        distance: 14,
        unit: DistanceUnits.PIXEL
      },
      backgroundColor: ''
    },
    dsNavigator: true,
    featureNavigator: true,
    showCount: true,
    clearSelection: true,
    dsConfigs: [],
    dsConfigsOfMapWidget: []
  })
}

// cache layer object promises to avoid create multiple times
// layer object key is 'dataSourceId_userName', or 'dataSourceId_' for anonymous or no needs login data source.
const layerObjectPromises: { [layerObjectKey: string]: any } = {}
export function getLayerObject (dataSourceParam) {
  // if the data source is a selection view, get layer object from it's main data source to get full capabilities, such as 'supportsAttachment'
  const dataSource = dataSourceParam.isDataView && dataSourceParam.dataViewId === CONSTANTS.SELECTION_DATA_VIEW_ID ? dataSourceParam.getMainDataSource() : dataSourceParam
  const sm = SessionManager.getInstance()
  const session = sm.getSessionByUrl(dataSource.url || '')
  const userName = session?.username || ''
  const layerObjectKey = `${dataSource.id}_${userName}`

  if (!layerObjectPromises[layerObjectKey]) {
    layerObjectPromises[layerObjectKey] = dataSource.createJSAPILayerByDataSource().then((layerObject) => {
      return layerObject.load().then(() => {
        // temporarily fix popupTemplate lost issue for subtype-sublayer, should be fixed in data source in future
        if (dataSource.layer?.popupTemplate && !layerObject.popupTemplate) {
          layerObject.popupTemplate = dataSource.layer.popupTemplate
        }
        return Promise.resolve(layerObject)
      })
    })
  }
  return layerObjectPromises[layerObjectKey]
}

export function getViewByDataSourceId (dataSourceId: string) {
  const dataSource = DataSourceManager.getInstance().getDataSource(dataSourceId)
  const rootDataSource = dataSource.getRootDataSource()
  const mapViewManger = MapViewManager.getInstance()
  const jimuMapView = mapViewManger.getAllJimuMapViews().find(jimuMapView => jimuMapView.dataSourceId === rootDataSource?.id)
  return jimuMapView?.view || null
}
