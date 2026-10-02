const CORRUPTED_EXTENT_THRESHOLD = 1e300
const EXTENT_KEYS = ['xmin', 'ymin', 'xmax', 'ymax'] as const

type ExtentKey = typeof EXTENT_KEYS[number]

interface AnalyzeLayer {
  extent?: {
    [key in ExtentKey]?: unknown
  }
}

interface AnalyzeData {
  publishParameters?: {
    layers?: AnalyzeLayer[]
  }
}

export function isInvalidShapefileExtentValue (value: unknown): boolean {
  return typeof value !== 'number' || Number.isNaN(value) || !Number.isFinite(value) || Math.abs(value) >= CORRUPTED_EXTENT_THRESHOLD
}

export function isCorruptedShapefileAnalyzeResponse (analyzeData: AnalyzeData | null | undefined): boolean {
  const layers = analyzeData?.publishParameters?.layers
  if (!Array.isArray(layers)) {
    return false
  }

  return layers.some((layer) => {
    const extent = layer?.extent
    if (!extent) {
      return false
    }

    return EXTENT_KEYS.some((key) => {
      const value = extent[key]
      return value != null && isInvalidShapefileExtentValue(value)
    })
  })
}

export function shouldStopUploadForCorruptedShapefile (isShapefile: boolean, analyzeData: AnalyzeData | null | undefined): boolean {
  return isShapefile && isCorruptedShapefileAnalyzeResponse(analyzeData)
}
