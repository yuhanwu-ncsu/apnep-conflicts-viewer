
import type ImageryLayer from "@arcgis/core/layers/ImageryLayer.js"
import { MapViewManager } from 'jimu-arcgis'

export const getImageryComponentsAssetsPath = (widgetUrl: string): string => {
  return `${widgetUrl}dist/imagery-components-assets/assets`
}

export const isMapWidgetDataSourceEmpty = (mapWidgetId: string): boolean => {
  if (!mapWidgetId) {
    return true
  }
  const mapViews = MapViewManager.getInstance().getJimuMapViewGroup(mapWidgetId)?.jimuMapViews
  if (!mapViews) {
    return true
  }
  const isEmpty = (Object.keys(mapViews).length === 1 && !Object.values(mapViews)?.[0]?.dataSourceId)
  return isEmpty
}

export function getImageryLayer (layerTitle: string, imageryLayers: ImageryLayer[]): ImageryLayer | null {
  if (layerTitle.length === 0 || imageryLayers.length === 0) {
    return null
  }
  for (const layer of imageryLayers) {
    if (layer.title === layerTitle) {
      return layer
    }
  }
  return null
}

export const getBandNames = (layer: ImageryLayer): string[] => {
  const bandInfos = layer.serviceRasterInfo?.bandInfos
  if (!bandInfos?.length) {
    return []
  }
  const bandNames = bandInfos.map((bandInfo) => bandInfo.name)
  return bandNames
}

export const findBandIndex = (bandNames: string[],targetBand: string): number => {
  const cleanup = (str: string) =>
    str.toLowerCase().replace(/[\s\-_]/g, '').replace(/band$/, '')

  const cleanedTarget = cleanup(targetBand)
  let allowedKeywords: string[] = []
  if (cleanedTarget === 'nearinfrared' || cleanedTarget === 'nir') {
    allowedKeywords = ['nearinfrared', 'nir']
  } else if (cleanedTarget === 'shortwaveinfrared' || cleanedTarget === 'swir') {
    allowedKeywords = ['shortwaveinfrared', 'swir']
  } else if (cleanedTarget === 'rededge') {
    allowedKeywords = ['rededge']
  } else if (cleanedTarget === 'red') {
    allowedKeywords = ['red']
  } else if (cleanedTarget === 'green') {
    allowedKeywords = ['green']
  } else if (cleanedTarget === 'blue') {
    allowedKeywords = ['blue']
  } else {
    allowedKeywords = [cleanedTarget]
  }

  return bandNames.findIndex((bandName) => {
    const cleanedBand = cleanup(bandName)

    return allowedKeywords.some((keyword) => {
      if (keyword === 'red') {
        return cleanedBand.includes('red') &&
              !cleanedBand.includes('edge') &&
              !cleanedBand.includes('infrared')
      }
      if (keyword === 'nir' || keyword === 'nearinfrared') {
        return cleanedBand.includes(keyword) && !cleanedBand.includes('swir')
      }
      return cleanedBand.includes(keyword)
    })
  })
}

export const getBandPair = (bandNames: string[], spectralBands: string[]) => {
  const band1Index = findBandIndex(bandNames, spectralBands[0])
  const band2Index = findBandIndex(bandNames, spectralBands[1])
  return {
    band1: band1Index >= 0? (band1Index+1).toString():'1',
    band2: band2Index >= 0? (band2Index+1).toString():'1',
  }
}

export const changeOfInterestToIndex = (coi: string) => {
  switch (coi) {
    case 'vegetation':
      return 'NDVI'
    case 'water':
      return 'NDWI'
    case 'burn-scar':
      return 'NBR'
    case 'built-up':
      return 'NDBI'
    default:
      return 'NDVI'
  }
}

export const bandsEqual = (arr1: string[], arr2: string[]): boolean => {
  if (arr1.length !== arr2.length) {
    return false
  }
  return arr1.every((val, index) => val === arr2[index])
}
