/**Utils form API: esri\widgets\Print\PrintViewModel.ts*/
export function updateLegendLayers (
  view,
  printTemplate,
  legendEnabled: boolean,
  dynamicLegendEnabled: boolean,
  LegendLayer
) {
  if (!printTemplate.layoutOptions) {
    return printTemplate
  }

  if (!legendEnabled) {
    printTemplate.layoutOptions.legendLayers = []
    return printTemplate
  }

  if (!view) {
    return printTemplate
  }

  const layerViews = getVisibleLayerViews(view)
  const legendLayers = []

  for (const layerView of layerViews) {
    if (layerView.legendEnabled) {
      legendLayers.push(
        new LegendLayer({
          layerId: layerView.layer.id,
          title: layerView.layer.title || undefined,
          dynamicLegend: dynamicLegendEnabled,
        }),
      )
    }
  }

  printTemplate.layoutOptions.legendLayers = legendLayers
  return printTemplate
}

function getVisibleLayerViews (view, scale?: number) {
  const allLayerViews = view.allLayerViews.items

  if (scale === view.scale) {
    return allLayerViews.filter((layerView) => !layerView.suspended)
  }

  const result = []
  for (const layerView of allLayerViews) {
    const parentLayerView = layerView.parent
    //Should not print the legend of draw layers
    const isLayersOfDraw = layerView.layer?.id?.includes('bookmark-layer-') || layerView.layer?.id?.includes('jimu-draw-groupLayer') || layerView.layer?.id?.includes('baGraphics')
    if (
      parentLayerView &&
      parentLayerView !== layerView.view &&
      (isCatalogLayerView2D(parentLayerView) || isGroupLayerView2D(parentLayerView)) &&
      !result.includes(parentLayerView)
    ) {
      // layer view is not visible if its parent layer view is not visible
      continue
    }
    if (
      layerView.visible &&
      layerView.visibleAtCurrentTimeExtent &&
      isInEffectiveScaleRange(layerView.layer.effectiveScaleRange, scale)
      && !isLayersOfDraw
    ) {
      // Note `isVisibleAtScale` is guarded since not all the
      // layerViews are LayerView2D instances, e.g., GroupLayerView
      result.push(layerView)
    }
  }
  return result
}

function isCatalogLayerView2D (layerView) {
  return layerView.layer.type === "catalog"
}

function isGroupLayerView2D (layerView) {
  return layerView.layer.type === "group"
}

function isInEffectiveScaleRange (effectiveScaleRange, viewScale: number): boolean {
  if (viewScale && effectiveScaleRange) {
    const { minScale, maxScale } = effectiveScaleRange

    if (isScaleRangeActive(minScale, maxScale)) {
      return scaleBoundsPredicate(viewScale, minScale, maxScale)
    }
  }

  return true
}

function isScaleRangeActive (minScale: number, maxScale: number): boolean {
  return (minScale != null && minScale > 0) || (maxScale != null && maxScale > 0)
}

function scaleBoundsPredicate (scale: number, minScale: number, maxScale: number): boolean {
  return scale == null || (scale >= maxScale && (minScale === 0 || scale <= minScale))
}