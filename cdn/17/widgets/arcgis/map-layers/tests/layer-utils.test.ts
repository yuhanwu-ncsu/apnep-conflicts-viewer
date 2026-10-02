import { ExBAddedJSAPIProperties } from 'jimu-core'
import { isLayerFromRuntime, isWMTSSublayer } from '../src/runtime/lib/layer-utils'

describe('layer-utils', () => {
  it('detects WMTS sublayer by parent chain', () => {
    const layer = {
      parent: {
        declaredClass: 'esri.layers.GroupLayer',
        parent: {
          declaredClass: 'esri.layers.WMTSLayer',
          parent: null
        }
      }
    } as any

    expect(isWMTSSublayer(layer)).toBe(true)
  })

  it('returns false for runtime detection when layer is WMTS sublayer', () => {
    const layer = {
      parent: {
        declaredClass: 'esri.layers.WMTSLayer',
        parent: null
      },
      [ExBAddedJSAPIProperties.EXB_LAYER_FROM_RUNTIME]: true
    } as any

    expect(isLayerFromRuntime(layer)).toBe(false)
  })

  it('returns true for runtime detection on non-WMTS runtime layer', () => {
    const layer = {
      parent: null,
      [ExBAddedJSAPIProperties.EXB_LAYER_FROM_RUNTIME]: true
    } as any

    expect(isLayerFromRuntime(layer)).toBe(true)
  })
})
