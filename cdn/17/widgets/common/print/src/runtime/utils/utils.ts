import type { IMPrintResultList, IMPrintTemplateProperties, PrintTemplateProperties, MapSurroundInfo, ElementOverrides } from '../../config'
import { LegendContentType, PrintExtentType, LayoutTypes, ReportTypes } from '../../config'
import { getUrlOfUseUtility, checkIsDsInUseMap, checkIsTableDs } from '../../utils/utils'
import { getPortalUrlByUtility } from '../../utils/service-util'
import { type JimuMapView, loadArcGISJSAPIModules } from 'jimu-arcgis'
import { type IMUseUtility, type ImmutableArray, DataSourceManager, DataSourceStatus, type UseDataSource, type JSAPILayerMixin, type DataSource } from 'jimu-core'

interface InitTemplatePropertiesParamsTypes {
  printTemplateProperties: IMPrintTemplateProperties
  mapView: JimuMapView
  locale: string
  utility: IMUseUtility
  useMapWidgetIds: ImmutableArray<string>
  widgetId: string
  isSupportReport?: boolean
}

export const getNewResultItemTitle = (title: string, printResultList: IMPrintResultList): string => {
  const currentTitles = new Set((printResultList || [])?.map(item => item?.title))
  if (!currentTitles.has(title)) return title

  let index = 1
  let newTitle = `${title} (${index})`
  while (currentTitles.has(newTitle)) {
    index++
    newTitle = `${title} (${index})`
  }
  return newTitle
}

/**
 * Get result id list
*/
export const getResultIdList = (printResultList: IMPrintResultList): string[] => {
  if (!printResultList) return []
  return printResultList?.asMutable()?.map(item => item.resultId)
}

/**
 * Get new dataSource config id
*/
export const getNewResultId = (printResultList: IMPrintResultList): string => {
  const resultIdList = getResultIdList(printResultList)
  if (!resultIdList || resultIdList?.length === 0) return 'result_0'
  const maxIndex = getConfigIndexMaxNumber(resultIdList)
  return `config_${maxIndex + 1}`
}

const getConfigIndexMaxNumber = (resultIdList: string[]) => {
  if (!resultIdList || resultIdList?.length === 0) return 0
  const idIndexData = resultIdList?.map(id => {
    const currentIndex = id?.split('_')?.pop()
    return currentIndex ? Number(currentIndex) : 0
  })
  return idIndexData?.sort((a, b) => b - a)?.[0]
}

export function getNewLayerIdByDs (dsId: string, widgetId: string): string {
  return `exb-print-layer-${widgetId}-${dsId}`
}

export function checkDsIsOutputDs (dataSourceId: string): boolean {
  const dsM = DataSourceManager.getInstance()
  return dsM.getDataSource(dataSourceId)?.getDataSourceJson()?.isOutputFromWidget
}

export async function getCredentialToken (useUtility: IMUseUtility) {
  if (!useUtility) return
  return loadArcGISJSAPIModules(['esri/kernel']).then(([esriNS]) => {
    return getUrlOfUseUtility(useUtility).then(printServiceUrl => {
      const credential = esriNS.id.findCredential(printServiceUrl)
      return Promise.resolve(credential?.token)
    })
  })
}

function checkIsOutputDsAvailable (dsId: string): boolean {
  const dsM = DataSourceManager.getInstance()
  const dsStatus = dsM.getDataSource(dsId)?.getStatus()
  return dsStatus !== DataSourceStatus.NotCreated && dsStatus !== DataSourceStatus.CreateError && dsStatus !== DataSourceStatus.LoadError && dsStatus !== DataSourceStatus.SaveError && dsStatus !== DataSourceStatus.NotReady
}

export function removeTemporarilyAddedLayers (elementOverrides: ElementOverrides, reportOptions: any, jimuMapView: JimuMapView, widgetId: string, useMapWidgetIds: ImmutableArray<string>, isSupportReport: boolean) {
  removeTemporarilyAddedElementOverridesLayers(elementOverrides, jimuMapView, widgetId, useMapWidgetIds)
  isSupportReport && removeTemporarilyAddedReportLayers(jimuMapView, reportOptions, widgetId, useMapWidgetIds)
}

export function removeTemporarilyAddedReportLayers (jimuMapView: JimuMapView, reportOptions: any, widgetId: string, useMapWidgetIds: ImmutableArray<string>) {
  if (!jimuMapView || !reportOptions || !useMapWidgetIds || !widgetId) return
  const reportSectionOverrides = reportOptions?.reportSectionOverrides || {}
  // eslint-disable-next-line @typescript-eslint/require-await
  Object.keys(reportSectionOverrides).forEach(async key => {
    const reportItem = reportSectionOverrides[key]
    removeTemporarilyAddedLayersFormMap(reportItem?.exbDatasource, jimuMapView, widgetId, useMapWidgetIds)
  })
}

export function removeTemporarilyAddedElementOverridesLayers (elementOverrides: ElementOverrides, jimuMapView: JimuMapView, widgetId: string, useMapWidgetIds: ImmutableArray<string>) {
  if (!jimuMapView || !elementOverrides || !useMapWidgetIds || !widgetId || Object.keys(elementOverrides)?.length === 0) return
  Object.keys(elementOverrides).forEach(key => {
    const elementOverridesItem = elementOverrides[key]
    removeTemporarilyAddedLayersFormMap(elementOverridesItem?.exbDataSource, jimuMapView, widgetId, useMapWidgetIds)
  })
}

async function removeTemporarilyAddedLayersFormMap (dataSource: UseDataSource[], jimuMapView: JimuMapView, widgetId: string, useMapWidgetIds: ImmutableArray<string>) {
  if (dataSource?.length > 0) {
    const isDsInUseMap = checkIsDsInUseMap(dataSource, useMapWidgetIds)
    const dsId = dataSource?.[0]?.dataSourceId
    if (!isDsInUseMap && jimuMapView) {
      const isTable = checkIsTableDs(dsId)
      if (isTable) {
        const tableLayer = await getTemporarilyTableLayer(dsId, widgetId)
        jimuMapView.view.map.tables.remove(tableLayer as any)
      } else {
        const layerId = getNewLayerIdByDs(dsId, widgetId)
        const layer = jimuMapView.view.map.findLayerById(layerId)
        if (layer) {
          jimuMapView.removeLayerFromMap(layerId)
        }
      }
    }
  }
}

async function checkUseDataSourceHasRecords (useDataSources: UseDataSource[]): Promise<boolean> {
  const useDataSource = useDataSources?.[0]
  const dsId = useDataSource?.dataSourceId
  if (!dsId) return true

  try {
    const dsM = DataSourceManager.getInstance()
    let ds = dsM.getDataSource(dsId)
    if (!ds && useDataSource) {
      ds = await dsM.createDataSourceByUseDataSource(useDataSource)
    }
    if (!ds) return true

    const query = (ds as any)?.query
    if (typeof query === 'function') {
      const queryResult = await query.call(ds, { pageSize: 1 })
      return (queryResult?.records?.length ?? 0) > 0
    }

    return true
  } catch (err) {
    // Keep report section visible when record check fails.
    return true
  }
}

async function initReportOptions (reportOptions, jimuMapView: JimuMapView, useMapWidgetIds: ImmutableArray<string>, widgetId: string): Promise<any> {
  const reportSectionOverrides = reportOptions?.reportSectionOverrides || {}
  await Promise.all(Object.keys(reportSectionOverrides).map(async key => {
    const reportItem = reportSectionOverrides[key]
    if (reportItem?.exbDatasource?.length > 0) {
      const hasRecords = await checkUseDataSourceHasRecords(reportItem?.exbDatasource)
      if (!hasRecords) {
        if (!reportOptions?.elementOverrides) {
          reportOptions.elementOverrides = {}
        }
        reportOptions.elementOverrides[key] = { visible: false }
      }

      const layerIdObj = await getLayerIdByDs(reportItem?.exbDatasource, jimuMapView, useMapWidgetIds, widgetId)
      reportSectionOverrides[key].sourceId = layerIdObj.layerId
      reportSectionOverrides[key].name = key
      if (layerIdObj.subLayerId || layerIdObj.subLayerId === 0) {
        reportSectionOverrides[key].subLayerId = layerIdObj.subLayerId
      }
      delete reportSectionOverrides[key].exbDatasource
      delete reportSectionOverrides[key].isDsOutputDs
    }
  }))
  reportOptions && (reportOptions.reportSectionOverrides = reportSectionOverrides)
  return Promise.resolve(reportOptions || {})
}

interface InitElementOverridesOptions {
  elementOverrides: ElementOverrides
  jimuMapView: JimuMapView
  useMapWidgetIds: ImmutableArray<string>
  widgetId: string
  includeLegend: boolean
  legendContent?: LegendContentType
}

async function initElementOverrides (options: InitElementOverridesOptions): Promise<ElementOverrides> {
  const { elementOverrides, jimuMapView, useMapWidgetIds, widgetId, includeLegend, legendContent } = options
  await Promise.all(Object.keys(elementOverrides).map(async key => {
    const elementOverridesItem = updateFilterTypeOfElementOverrides(elementOverrides[key])
    const exbDataSource = elementOverridesItem?.exbDataSource
    if (exbDataSource?.length > 0) {
      const layerIdObj = await getLayerIdByDs(exbDataSource, jimuMapView, useMapWidgetIds, widgetId)
      if (elementOverridesItem.type === 'CIMGraphicElement' && elementOverridesItem?.dynamicTextElements) {
        const dynamicTextElements = elementOverridesItem?.dynamicTextElements
        const newDynamicTextElements = dynamicTextElements?.map(item => {
          item.sourceLayerId = layerIdObj.layerId
          if (layerIdObj.subLayerId || layerIdObj.subLayerId === 0) {
            (item as any).subLayerId = layerIdObj.subLayerId
          }
          return item
        })
        elementOverridesItem.dynamicTextElements = newDynamicTextElements
      } else {
        elementOverrides[key].sourceLayerId = layerIdObj.layerId
        if (layerIdObj.subLayerId || layerIdObj.subLayerId === 0) {
          elementOverrides[key].subLayerId = layerIdObj.subLayerId
        }
      }
      delete elementOverrides[key].exbDataSource
      delete elementOverrides[key].isDsOutputDs
    }

    //Init dynamic legend
    if (elementOverridesItem.type === 'CIMLegend') {
      elementOverrides[key] = initLegendOfElementOverrides(elementOverridesItem, includeLegend, legendContent)
    }
  }))
  return Promise.resolve(elementOverrides || {})
}

function initLegendOfElementOverrides (elementOverridesItem: MapSurroundInfo, includeLegend: boolean, legendContent?: LegendContentType): MapSurroundInfo {
  elementOverridesItem.visible = includeLegend
  if (legendContent && legendContent !== LegendContentType.FollowLayoutSettings) {
    const dynamicLegends = legendContent === LegendContentType.OnlyShowVisibleFeatures
    const defaultLegendItem = elementOverridesItem?.defaultLegendItem || {}
    if (Object.keys(defaultLegendItem).includes('dynamicLegends')) {
      elementOverridesItem.defaultLegendItem.dynamicLegends = dynamicLegends
    }
  }
  return elementOverridesItem
}

export function getDynamicLegendsWithElementOverrides (elementOverrides: ElementOverrides): boolean {
  let dynamicLegend = false
  Object.keys(elementOverrides).forEach(key => {
    const elementOverridesItem = elementOverrides[key]
    if (elementOverridesItem.type === 'CIMLegend') {
      if (elementOverridesItem.defaultLegendItem) {
        dynamicLegend = elementOverridesItem.defaultLegendItem.dynamicLegends || false
      }
    }
  })
  return dynamicLegend
}

function updateFilterTypeOfElementOverrides (elementOverridesItem: MapSurroundInfo): MapSurroundInfo {
  const exbDataSource = elementOverridesItem?.exbDataSource
  if (exbDataSource?.length > 0) {
    const dsId = exbDataSource?.[0]?.dataSourceId
    const dsM = DataSourceManager.getInstance()
    const ds = dsM.getDataSource(dsId)
    const selectedRecordIds = ds ? ds.getSelectedRecordIds() : []
    if (selectedRecordIds?.length > 0) {
      if (elementOverridesItem?.dynamicTextElements) {
        const newDynamicTextElements = elementOverridesItem.dynamicTextElements?.map(item => {
          item.filterType = 'selected'
          return item
        })
        elementOverridesItem.dynamicTextElements = newDynamicTextElements
      } else {
        elementOverridesItem.filterType = 'selected'
      }
    }
    return elementOverridesItem
  } else {
    return elementOverridesItem
  }
}

interface LayerIdOfDs {
  layerId: string,
  subLayerId?: string | number
}

async function getLayerIdByDs (useDataSources: UseDataSource[], jimuMapView: JimuMapView, useMapWidgetIds: ImmutableArray<string>, widgetId: string) {
  const isDsInUseMap = checkIsDsInUseMap(useDataSources, useMapWidgetIds)
  const dsId = useDataSources?.[0]?.dataSourceId
  let layerIdObj: LayerIdOfDs
  if (isDsInUseMap) {
    //Ds in use map
    const dsM = DataSourceManager.getInstance()
    const ds = dsM.getDataSource(dsId)
    if (!ds) {
      return dsM.createDataSourceByUseDataSource(useDataSources?.[0]).then((dataSource) => {
        layerIdObj = getLayerIdOfDsId(dsId)
        return Promise.resolve(layerIdObj)
      })
    } else {
      layerIdObj = getLayerIdOfDsId(dsId)
    }
  } else {
    //When the map does not use this ds, it needs to create a layer based on this ds.
    layerIdObj = {
      layerId: getNewLayerIdByDs(dsId, widgetId)
    }
    if (jimuMapView && !checkIsLayerInMap(layerIdObj.layerId, jimuMapView)) {
      await temporarilyAddLayersToMapByDsId(jimuMapView, dsId, widgetId)
    }
  }
  return Promise.resolve(layerIdObj)
}

function getLayerIdOfDsId (dsId: string): LayerIdOfDs {
  const isMapService = checkDsIsMapService(dsId)
  if (isMapService) {
    return getLayerIdOfMapService(dsId)
  } else {
    const dsManager = DataSourceManager.getInstance()
    const ds = dsManager.getDataSource(dsId)
    return {
      layerId: (ds as any)?.layer?.id || ''
    }
  }
}

function getLayerIdOfMapService (dsId: string): LayerIdOfDs {
  const dsManager = DataSourceManager.getInstance()
  const dataSource = dsManager.getDataSource(dsId)
  let layerParentIsMapService = false
  let layerIdOfMapService = (dataSource as any)?.layer?.id || ''
  const getCombinedLayerId = (ds: DataSource) => {
    if (!layerParentIsMapService) {
      const parentLayerId = (ds?.parentDataSource as any)?.layer?.id || ''
      layerIdOfMapService = `${parentLayerId}/${layerIdOfMapService}`
      if (ds?.parentDataSource?.type === 'MAP_SERVICE') {
        layerParentIsMapService = true
      } else if (ds?.parentDataSource?.parentDataSource) {
        getCombinedLayerId(ds?.parentDataSource?.parentDataSource)
      }
    }
  }
  getCombinedLayerId(dataSource)
  const allLayerIds = layerIdOfMapService.split('/')
  let subLayerId = allLayerIds[allLayerIds?.length - 1]
  subLayerId = isNaN(Number(subLayerId)) ? subLayerId : Number(subLayerId)
  return {
    layerId: allLayerIds[0],
    subLayerId: subLayerId ?? null
  }
}

function checkDsIsMapService (dsId: string): boolean {
  const dsManager = DataSourceManager.getInstance()
  let isLayerInMapService = false
  const checkIsMapService = (ds: DataSource) => {
    if (!isLayerInMapService) {
      if (ds?.parentDataSource?.type === 'MAP_SERVICE') {
        isLayerInMapService = true
      } else if (ds?.parentDataSource?.parentDataSource) {
        checkIsMapService(ds?.parentDataSource?.parentDataSource)
      }
    }
  }
  const dataSource = dsManager.getDataSource(dsId)
  checkIsMapService(dataSource)
  return isLayerInMapService
}

function checkIsLayerInMap (layerId: string, jimuMapView: JimuMapView) {
  const layerIds = jimuMapView.getAllJimuLayerViews().map(layerView => layerView?.layer?.id) || []
  const tableLayerIds = jimuMapView.view.map?.tables?.toArray()?.map(table => table?.id) || []
  return layerIds.concat(tableLayerIds).includes(layerId)
}

function checkIsAllLayersNoLabelingInfo (jimuMapView: JimuMapView) {
  const jimuLayerViews = jimuMapView.getAllJimuLayerViews()
  return jimuLayerViews.every(layerView => {
    const labelingInfo = layerView?.layer?.labelingInfo
    return !labelingInfo || labelingInfo.length === 0 || !layerView?.layer?.labelsVisible
  })
}

async function temporarilyAddLayersToMapByDsId (jimuMapView: JimuMapView, dsId: string, widgetId: string) {
  const newLayerId = getNewLayerIdByDs(dsId, widgetId)
  if (jimuMapView) {
    const layer = jimuMapView.view.map.findLayerById(newLayerId)
    const isOutputDs = checkDsIsOutputDs(dsId)
    if (!checkIsOutputDsAvailable(dsId)) {
      return
    }
    let jimuLayerView
    const isTable = checkIsTableDs(dsId)
    let capabilities
    const ds = DataSourceManager.getInstance().getDataSource(dsId)
    const dsLayer = (ds as any)._layer

    if (layer && isOutputDs) {
      jimuLayerView = jimuMapView.getJimuLayerViewByAPILayer(layer)
    } else if(isTable) {
      const tableLayer = await getTemporarilyTableLayer(dsId, widgetId)
      const isTableExistInMap = checkIsTableExistInMap(jimuMapView, tableLayer)
      if (!isTableExistInMap) {
        jimuMapView.view.map.tables.add(tableLayer as any)
      }
    } else {
      const isSelectionView = ds?.isDataView && ds?.dataViewId === 'selection'
      if (isSelectionView) {
        //The feature selection layer cannot be edited,
        // which will cause the layer.applyEdits in the fillEmptyFeatureLayers method to report an error,
        // so we need to temporarily handle it
        const capabilitiesOfLayer = dsLayer.sourceJSON.capabilities
        if (capabilitiesOfLayer && isMapServiceSublayer(capabilitiesOfLayer)) {
          capabilities = capabilitiesOfLayer
          dsLayer.sourceJSON.capabilities = initCapabilities(capabilities)
        }
      }
      jimuLayerView = await jimuMapView.addLayerToMap(dsId, newLayerId)
      capabilities && (dsLayer.sourceJSON.capabilities = capabilities)
      if (isSelectionView && !jimuLayerView.layer.outFields) {
        //If jimuLayerView.layer.outFields ==== null, the layerView.availableFields will be "['FID']",
        //this results in the API only being able to obtain the value of the FID field through `layerView.queryFeatures(layerView.createQuery())`,
        //and not being able to obtain the values of all fields, resulting in missing data in the report.
        //https://devtopia.esri.com/Beijing-R-D-Center/ExperienceBuilder-Web-Extensions/issues/16900#issuecomment-5741059
        jimuLayerView.layer.outFields = ['*']
      }
    }

    if (jimuLayerView) {
      //The API that generates `WebmapJson` uses `layerViews`, so we should make sure the `layerView` is loaded.
      await jimuMapView.whenJimuLayerViewLoaded(jimuLayerView.id)
      jimuLayerView.layer.opacity = 0
      await moveFeaturesToCenterWhenPrintUseOutputDsOfNearMe(jimuLayerView, jimuMapView)
      await jimuLayerView.whenCurrentLayerViewNotUpdating()
      await fillEmptyFeatureLayers(jimuLayerView, jimuMapView)
      await jimuLayerView.whenCurrentLayerViewNotUpdating()
    }
  }
}

function isMapServiceSublayer (capabilities: string): boolean {
  return !!capabilities
    ?.toLowerCase()
    .split(",")
    .map((value: string) => value.trim())
    .includes("map")
}

function initCapabilities (capabilities: string): string {
  return capabilities.split(",").filter(value => !value?.toLocaleLowerCase().trim().includes("map")).join(',')
}

function checkIsTableExistInMap (jimuMapView: JimuMapView, tableLayer) {
  const tableIds = jimuMapView.view.map.tables.map(table => table.id)
  return tableIds.includes(tableLayer?.id)
}

async function getTemporarilyTableLayer (dsId: string, widgetId: string) {
  const newLayerId = getNewLayerIdByDs(dsId, widgetId)
  const ds = DataSourceManager.getInstance().getDataSource(dsId)
  const tableLayer = await (ds as unknown as JSAPILayerMixin).createJSAPILayerByDataSource();
  (tableLayer as any).id = newLayerId;
  (tableLayer as any).opacity = 0
  return tableLayer
}

/**
 * Remind: remove it in next release
 * This is a temporary solution to the problem that if the features in Near Me are not loaded, it can not used in Print report.
 * Sow we need move the Features in near me to the center of the map when printing.
*/
async function moveFeaturesToCenterWhenPrintUseOutputDsOfNearMe (jimuLayerView, jimuMapView: JimuMapView) {
  const moveFeaturesToCenterWhenPrinting = jimuLayerView.layer?.customParameters?.moveFeaturesToCenterWhenPrinting
  if (!moveFeaturesToCenterWhenPrinting) return

  const featureSet = await jimuLayerView?.layer?.queryFeatures({ returnGeometry: true })
  const features = featureSet?.features || []
  if (features.length === 0) return

  const center = jimuMapView.view.extent?.center
  const layer = jimuLayerView?.layer

  if (layer.geometryType === 'point') {
    const [Graphic] = await loadArcGISJSAPIModules(['esri/Graphic'])
    const point = {
      type: 'point',
      x: center.x,
      y: center.y,
      spatialReference: jimuMapView.view.spatialReference
    }
    const newGraphics = features.map(f => {
      const graphic = new Graphic({
        attributes: f?.attributes || {},
        geometry: point
      })
      return graphic
    })
    await layer.applyEdits({ updateFeatures: newGraphics })
  } else if (layer.geometryType === 'polyline') {
    const [Graphic, Polyline] = await loadArcGISJSAPIModules(['esri/Graphic', 'esri/geometry/Polyline'])
    const paths = [
      [
        [jimuMapView.view.extent.center.x, jimuMapView.view.extent.center.y],
        [jimuMapView.view.extent.center.x + 5, jimuMapView.view.extent.center.y + 5]
      ]
    ]

    const line = new Polyline({
      hasZ: false,
      hasM: false,
      paths: paths,
      spatialReference: jimuMapView.view.spatialReference
    })

    const newGraphics = features.map(f => {
      const graphic = new Graphic({
        attributes: f?.attributes || {},
        geometry: line
      })
      return graphic
    })
    await layer.applyEdits({ updateFeatures: newGraphics })
  } else if (layer.geometryType === 'polygon') {
    const [Graphic, Polygon] = await loadArcGISJSAPIModules(['esri/Graphic', 'esri/geometry/Polygon'])
    const rings = [
      [
        [jimuMapView.view.extent.xmin, jimuMapView.view.extent.ymin],
        [jimuMapView.view.extent.xmin, jimuMapView.view.extent.ymax],
        [jimuMapView.view.extent.xmax, jimuMapView.view.extent.ymax],
        [jimuMapView.view.extent.xmin, jimuMapView.view.extent.ymin]
      ]
    ]

    const polygon = new Polygon({
      hasZ: false,
      hasM: false,
      rings: rings,
      spatialReference: jimuMapView.view.spatialReference
    })

    const newGraphics = features.map(f => {
      const graphic = new Graphic({
        attributes: f?.attributes || {},
        geometry: polygon
      })
      return graphic
    })
    await layer.applyEdits({ updateFeatures: newGraphics })
  }
}

/**
 * When the feature collection data in the current extent is empty,
 * the print api will ignore this feature collection layer when generating WebmapJson,
 * this will cause report error in the print request, so in order to deal with this problem, we need to insert a piece of data into this empty feature layer.
 * Related issue: https://devtopia.esri.com/Beijing-R-D-Center/ExperienceBuilder-Web-Extensions/issues/17583
*/
async function fillEmptyFeatureLayers (jimuLayerView, jimuMapView: JimuMapView) {
  if (!jimuLayerView?.view?.queryFeatureCount || !jimuLayerView?.whenCurrentLayerViewNotUpdating) return false
  await jimuLayerView.whenCurrentLayerViewNotUpdating()
  const extent = jimuMapView?.view?.extent
  const layer = jimuLayerView?.layer
  const featureSetCount = await jimuLayerView?.layer?.queryFeatureCount({
    geometry: extent
  })

  if (featureSetCount === 0 && layer.geometryType === 'point') {
    const point = {
      type: 'point',
      x: jimuMapView.view.extent.center.x,
      y: jimuMapView.view.extent.center.y,
      spatialReference: jimuMapView.view.spatialReference
    }
    const defaultAttributes = {}
    const date = new Date()
    //It is recommended in issue https://devtopia.esri.com/Beijing-R-D-Center/ExperienceBuilder/issues/24609
    //to use `Graphic.getObjectId()` instead of `layer.objectIdField`,
    // however, since this is dummy data, we can directly use `layer.objectIdField`.
    defaultAttributes[layer.objectIdField] = date.getTime()
    await loadArcGISJSAPIModules(['esri/Graphic']).then(([Graphic]) => {
      const pointGraphic = new Graphic({
        geometry: point,
        attributes: defaultAttributes
      })

      return layer.applyEdits({
        addFeatures: [pointGraphic]
      }).then(() => {
        return Promise.resolve(true)
      })
    })
  } else if (featureSetCount === 0 && layer.geometryType === 'polyline') {
    const defaultAttributes = {}
    const date = new Date()
    defaultAttributes[layer.objectIdField] = date.getTime()
    await loadArcGISJSAPIModules(['esri/Graphic', 'esri/geometry/Polyline']).then(([Graphic, Polyline]) => {
      const paths = [
        [
          [jimuMapView.view.extent.center.x, jimuMapView.view.extent.center.y],
          [jimuMapView.view.extent.center.x + 5, jimuMapView.view.extent.center.y + 5]
        ]
      ]

      const line = new Polyline({
        hasZ: false,
        hasM: false,
        paths: paths,
        spatialReference: jimuMapView.view.spatialReference
      })

      const lineGraphic = new Graphic({
        geometry: line,
        attributes: defaultAttributes
      })

      return layer.applyEdits({
        addFeatures: [lineGraphic]
      }).then(() => {
        return Promise.resolve(true)
      })
    })
  } else if (featureSetCount === 0 && layer.geometryType === 'polygon') {
    const defaultAttributes = {}
    const date = new Date()
    defaultAttributes[layer.objectIdField] = date.getTime()
    await loadArcGISJSAPIModules(['esri/Graphic', 'esri/geometry/Polygon']).then(([Graphic, Polygon]) => {
      const rings = [
        [
          [jimuMapView.view.extent.xmin, jimuMapView.view.extent.ymin],
          [jimuMapView.view.extent.xmin, jimuMapView.view.extent.ymax],
          [jimuMapView.view.extent.xmax, jimuMapView.view.extent.ymax],
          [jimuMapView.view.extent.xmin, jimuMapView.view.extent.ymin]
        ]
      ]

      const poly = new Polygon({
        hasZ: false,
        hasM: false,
        rings: rings,
        spatialReference: jimuMapView.view.spatialReference
      })

      const polyGraphic = new Graphic({
        geometry: poly,
        attributes: defaultAttributes
      })

      return layer.applyEdits({
        addFeatures: [polyGraphic]
      }).then(() => {
        return Promise.resolve(true)
      })
    })
  } else {
    return Promise.resolve(true)
  }
}

export async function initTemplateProperties (params: InitTemplatePropertiesParamsTypes): Promise<PrintTemplateProperties> {
  const { printTemplateProperties, mapView, locale, utility, isSupportReport, useMapWidgetIds, widgetId } = params
  try {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-boolean-literal-compare
    const isRemoveTitleText = printTemplateProperties?.hasTitleText === false
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-boolean-literal-compare
    const isRemoveLegend = printTemplateProperties?.hasLegend === false
    let newTemplateProperties = printTemplateProperties
      .without('enableTitle', 'enableAuthor', 'enableOutputSpatialReference', 'enableMapPrintExtents', 'enableQuality', 'enableMapSize', 'enableFeatureAttribution', 'enableCopyright',
        'enableLegend', 'enableMapAttribution', 'enableCustomTextElements', 'enableDatumTransformation', 'hasAuthorText', 'hasCopyrightText', 'hasTitleText', 'selectedFormatList', 'mapFrameSize', 'mapFrameUnit', 'legendEnabled',
        'templateId', 'printExtentType', 'customTextElementEnableList'
      )
    switch (printTemplateProperties?.printExtentType) {
      case PrintExtentType.CurrentMapExtent:
        newTemplateProperties = newTemplateProperties.set('scalePreserved', false)
        break
      case PrintExtentType.CurrentMapScale:
        newTemplateProperties = newTemplateProperties.set('outScale', mapView?.view?.scale).set('scalePreserved', true)
        break
      case PrintExtentType.SetMapScale:
        newTemplateProperties = newTemplateProperties.set('scalePreserved', true)
        break
    }
    let templateProperties = newTemplateProperties?.asMutable({ deep: true })
    if (isRemoveTitleText) {
      delete templateProperties?.layoutOptions?.titleText
    }
    if (isRemoveLegend) {
      delete templateProperties?.layoutOptions?.legendLayers
    }

    if (checkIsAllLayersNoLabelingInfo(mapView)) {
      //When all layers have no `labelingInfo`, `templateProperties.showLabels` will be set to `false`
      //https://devtopia.esri.com/Beijing-R-D-Center/ExperienceBuilder-Web-Extensions/issues/29179
      templateProperties.showLabels = false
    }

    const includeLegend = printTemplateProperties?.layoutOptions?.legendLayers
    if (includeLegend) {
      //The API will print all legends by default.
      //If the Print widget needs to print the legend, we only need to set layoutOption.legendLayers to null, and the Print API will automatically print the legend.
      //If we don't need to print the legend, we need to set layoutOption.legendLayers to []
      templateProperties.layoutOptions.legendLayers = null
    } else {
      templateProperties.layoutOptions.legendLayers = []
    }

    templateProperties.showLabels = true

    if (printTemplateProperties.layoutTypes === LayoutTypes.CustomLayout || printTemplateProperties.reportTypes === ReportTypes.CustomReport) {
      templateProperties = await initCustomReportOrCustomLayout(templateProperties, utility)
    }

    if (isSupportReport) {
      //Init reportOptions
      const newReportOptions = await initReportOptions(templateProperties?.reportOptions, mapView, useMapWidgetIds, widgetId)
      templateProperties.reportOptions = newReportOptions
    }

    const elementOverrides = templateProperties?.layoutOptions?.elementOverrides || {}
    if (Object.keys(elementOverrides)?.length > 0) {
      const newElementOverrides = await initElementOverrides({
        elementOverrides,
        jimuMapView: mapView,
        useMapWidgetIds,
        widgetId,
        includeLegend: !!includeLegend,
        legendContent: templateProperties?.legendContent
      })
      templateProperties.layoutOptions.elementOverrides = newElementOverrides
    }

    if (!templateProperties?.wkid) {
      templateProperties.wkid = mapView?.view?.spatialReference?.wkid
    }

    // init Date of customTextElements
    templateProperties = initCustomTextElements(templateProperties, locale)


    return Promise.resolve(templateProperties)
  } catch (err) {
    console.error(err)
    removeTemporarilyAddedLayers(printTemplateProperties?.layoutOptions?.elementOverrides, printTemplateProperties?.reportOptions, mapView, widgetId, useMapWidgetIds, isSupportReport)
    return Promise.resolve(null)
  }
}

async function initCustomReportOrCustomLayout (printTemplateProperties: PrintTemplateProperties, utility: IMUseUtility): Promise<PrintTemplateProperties> {
  const newPrintTemplateProperties = printTemplateProperties
  return loadArcGISJSAPIModules(['esri/portal/PortalItem']).then(modules => {
    const [PortalItem] = modules
    return getPortalUrlByUtility(utility).then(portalUrl => {
      if (printTemplateProperties.layoutTypes === LayoutTypes.CustomLayout && printTemplateProperties.customLayoutItem?.id) {
        const layoutItem = new PortalItem({
          id: printTemplateProperties.customLayoutItem.id,
          portal: portalUrl
        })
        newPrintTemplateProperties.layoutItem = layoutItem
      }

      if (printTemplateProperties.reportTypes === ReportTypes.CustomReport && printTemplateProperties.customReportItem?.id) {
        const reportItem = new PortalItem({
          id: printTemplateProperties.customReportItem.id,
          portal: portalUrl
        })
        newPrintTemplateProperties.reportItem = reportItem
      }

      delete newPrintTemplateProperties.customLayoutItem
      delete newPrintTemplateProperties.customReportItem
      delete newPrintTemplateProperties.layoutTypes
      delete newPrintTemplateProperties.reportTypes
      return Promise.resolve(newPrintTemplateProperties)
    })
  }, err => {
    return Promise.resolve(newPrintTemplateProperties)
  }).catch(err => {
    return Promise.resolve(newPrintTemplateProperties)
  })
}

function initCustomTextElements (templateProperties: PrintTemplateProperties, locale: string): PrintTemplateProperties {
  const customTextElements = templateProperties.layoutOptions?.customTextElements || []
  let hasDate = false
  customTextElements.forEach(el => {
    if (el.date) {
      hasDate = true
    }
  })

  if (!hasDate) {
    customTextElements.push({ Date: new Date().toLocaleString(locale) })
  }
  templateProperties.layoutOptions.customTextElements = customTextElements
  return templateProperties
}
