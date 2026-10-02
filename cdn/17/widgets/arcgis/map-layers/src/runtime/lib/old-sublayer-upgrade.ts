import type { JimuMapView } from 'jimu-arcgis'

const specialLayerTypes = [
  'esri.layers.WMSLayer',
  'esri.layers.support.WMSSublayer',
  'esri.layers.WMTSLayer',
  'esri.layers.support.WMTSSublayer',
  'esri.layers.KMLLayer',
  'esri.layers.support.KMLSublayer',
  'esri.layers.CatalogLayer',
  'esri.layers.catalog.CatalogDynamicGroupLayer',
  'esri.layers.catalog.CatalogFootprintLayer',
  'esri.layers.KnowledgeGraphLayer',
  'esri.layers.knowledgeGraph.KnowledgeGraphSublayer',
  'esri.layers.LinkChartLayer',
  // The GroupLayer may contain special layers
  'esri.layers.GroupLayer'
]

const specialParentLayerTypes = [
  'esri.layers.WMSLayer',
  'esri.layers.WMTSLayer',
  'esri.layers.KMLLayer',
  'esri.layers.CatalogLayer',
  'esri.layers.KnowledgeGraphLayer',
  'esri.layers.LinkChartLayer'
]

export const getAllSpecialLayers = async (layerCollection, result = []) => {
  for (const layer of layerCollection) {
    // Only load types of layer above
    if (!specialLayerTypes.includes(layer.declaredClass)) {
      continue
    }
    // Call load so the layers/sublayers field is ready
    if (layer.load) {
      await layer.load()
    }
    result.push(layer) // Add current layer

    if (layer.layers) {
      await getAllSpecialLayers(layer.layers, result)
    } else if (layer.sublayers) {
      await getAllSpecialLayers(layer.sublayers, result)
    }
  }
  return result
}

// This is for compatible with app that toggle on customize layers before 1.18.0
export const collectOldVersionUnselectableSublayer = (layer: __esri.Layer, jmv: JimuMapView, oldSublayersSetMap: Map<string, Set<string>>): boolean => {
  const currentJimuLayerViewId = jmv.getJimuLayerViewIdByAPILayer(layer)
  let parentLayer = layer.parent
  while (parentLayer) {
    if (specialParentLayerTypes.includes(parentLayer.declaredClass)) {
      if (oldSublayersSetMap.has(jmv.id)) {
        oldSublayersSetMap.get(jmv.id).add(currentJimuLayerViewId)
      } else {
        const set = new Set<string>()
        set.add(currentJimuLayerViewId)
        oldSublayersSetMap.set(jmv.id, set)
      }
      return true
    }
    parentLayer = (parentLayer as any).parent
  }

  return false
}
