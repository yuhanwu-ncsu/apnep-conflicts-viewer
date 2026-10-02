import { collectOldVersionUnselectableSublayer, getAllSpecialLayers } from '../src/runtime/lib/old-sublayer-upgrade'

describe('old-sublayer-upgrade', () => {
  it('collects special layers recursively and skips unsupported layer types', async () => {
    const nestedSublayer = {
      declaredClass: 'esri.layers.support.WMSSublayer',
      load: jest.fn().mockResolvedValue(undefined)
    }
    const specialLayer = {
      declaredClass: 'esri.layers.WMSLayer',
      load: jest.fn().mockResolvedValue(undefined),
      sublayers: [nestedSublayer]
    }
    const unsupportedLayer = {
      declaredClass: 'esri.layers.FeatureLayer',
      load: jest.fn().mockResolvedValue(undefined)
    }

    const result = await getAllSpecialLayers([unsupportedLayer, specialLayer])

    expect(result).toHaveLength(2)
    expect(result[0]).toBe(specialLayer)
    expect(result[1]).toBe(nestedSublayer)
    expect(unsupportedLayer.load).not.toHaveBeenCalled()
    expect(specialLayer.load).toHaveBeenCalled()
    expect(nestedSublayer.load).toHaveBeenCalled()
  })

  it('collects unselectable sublayer ids for legacy parent layer types', () => {
    const jmv = {
      id: 'jmv-1',
      getJimuLayerViewIdByAPILayer: jest.fn().mockReturnValue('jlv-1')
    }
    const layer = {
      parent: {
        declaredClass: 'esri.layers.WMTSLayer',
        parent: null
      }
    } as any
    const oldSublayersSetMap = new Map<string, Set<string>>()

    const isCollected = collectOldVersionUnselectableSublayer(layer, jmv as any, oldSublayersSetMap)

    expect(isCollected).toBe(true)
    expect(oldSublayersSetMap.get('jmv-1')).toBeTruthy()
    expect(oldSublayersSetMap.get('jmv-1').has('jlv-1')).toBe(true)
  })

  it('returns false when layer does not have supported legacy parent type', () => {
    const jmv = {
      id: 'jmv-1',
      getJimuLayerViewIdByAPILayer: jest.fn().mockReturnValue('jlv-1')
    }
    const layer = {
      parent: {
        declaredClass: 'esri.layers.FeatureLayer',
        parent: null
      }
    } as any
    const oldSublayersSetMap = new Map<string, Set<string>>()

    const isCollected = collectOldVersionUnselectableSublayer(layer, jmv as any, oldSublayersSetMap)

    expect(isCollected).toBe(false)
    expect(oldSublayersSetMap.size).toBe(0)
  })
})
