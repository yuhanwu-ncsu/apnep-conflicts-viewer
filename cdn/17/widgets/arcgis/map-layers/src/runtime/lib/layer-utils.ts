import { ExBAddedJSAPIProperties } from 'jimu-core'

export const isWMTSSublayer = (layer: __esri.Layer): boolean => {
  let parentLayer = layer.parent
  const wmtsParentLayerType = 'esri.layers.WMTSLayer'

  while (parentLayer) {
    if (parentLayer.declaredClass === wmtsParentLayerType) {
      return true
    }
    parentLayer = (parentLayer as any).parent
  }

  return false
}

export const isLayerFromRuntime = (layer: __esri.Layer): boolean => {
  if (isWMTSSublayer(layer)) {
    return false
  }

  return !!layer[ExBAddedJSAPIProperties.EXB_LAYER_FROM_RUNTIME]
}
