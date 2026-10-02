import { Immutable } from 'jimu-core'
import { LayerHonorModeType } from '../src/config'
import { getKeysInLayersConfig } from '../src/tools/builder-operations'

describe('getKeysInLayersConfig', () => {
  it('returns empty array when layersConfig is empty', () => {
    const result = getKeysInLayersConfig(Immutable([]), 'widgets.test.config')
    expect(result).toEqual([])
  })

  it('returns empty array when layerHonorMode is not Custom', () => {
    const layersConfig = Immutable([
      {
        layerHonorMode: LayerHonorModeType.Webmap,
        groupedFields: [],
        name: 'Layer1'
      }
    ] as any)
    const result = getKeysInLayersConfig(layersConfig, 'widgets.test.config')
    expect(result).toEqual([])
  })

  it('returns empty array when groupedFields is empty', () => {
    const layersConfig = Immutable([
      {
        layerHonorMode: LayerHonorModeType.Custom,
        groupedFields: [],
        name: 'Layer1'
      }
    ] as any)
    const result = getKeysInLayersConfig(layersConfig, 'widgets.test.config')
    expect(result).toEqual([])
  })

  it('returns keys for layer name and groupedFields with groupKey and subDescription', () => {
    const layersConfig = Immutable([
      {
        layerHonorMode: LayerHonorModeType.Custom,
        groupedFields: [
          {
            groupKey: 'group1',
            alias: 'GroupAlias',
            name: 'GroupName',
            children: [
              {
                subDescription: 'Child description',
                alias: 'ChildAlias',
                name: 'ChildName',
                groupKey: undefined,
                children: []
              }
            ],
            subDescription: 'Group description'
          }
        ],
        name: 'Layer1'
      }
    ] as any)
    const result = getKeysInLayersConfig(layersConfig, 'widgets.test.config', true)
    expect(result.length).toBe(6)
    expect(result[0]).toMatchObject({
      keyType: 'group',
      key: 'widgets.test.config.layersConfig[0]'
    })
    expect(result[1]).toMatchObject({
      keyType: 'value',
      key: 'widgets.test.config.layersConfig[0].name',
      groupKey: 'widgets.test.config.layersConfig[0]'
    })
    expect(result[2]).toMatchObject({
      keyType: 'group',
      key: 'widgets.test.config.layersConfig[0].groupedFields[0]',
      groupKey: 'widgets.test.config.layersConfig[0]'
    })
    expect(result[3]).toMatchObject({
      keyType: 'value',
      key: 'widgets.test.config.layersConfig[0].groupedFields[0].name',
      groupKey: 'widgets.test.config.layersConfig[0].groupedFields[0]'
    })
    expect(result[4]).toMatchObject({
      key: 'widgets.test.config.layersConfig[0].groupedFields[0].subDescription',
      groupKey: 'widgets.test.config.layersConfig[0].groupedFields[0]',
      label: {
        key: 'groupDescription',
        values: { value: 'GroupAlias' },
        enLabel: 'Description for group "GroupAlias"'
      }
    })
    expect(result[5]).toMatchObject({
      key: 'widgets.test.config.layersConfig[0].groupedFields[0].children[0].subDescription',
      groupKey: 'widgets.test.config.layersConfig[0].groupedFields[0]',
      label: {
        key: 'fieldDescription',
        values: { value: 'ChildAlias' },
        enLabel: 'Description for field "ChildAlias"'
      }
    })
  })

  it('returns key for groupedFields with only subDescription', () => {
    const layersConfig = Immutable([
      {
        layerHonorMode: LayerHonorModeType.Custom,
        groupedFields: [
          {
            groupKey: undefined,
            alias: 'FieldAlias',
            name: 'FieldName',
            children: [],
            subDescription: 'Field description'
          }
        ],
        name: 'Layer2'
      }
    ] as any)
    const result = getKeysInLayersConfig(layersConfig, 'widgets.test.config', true)
    expect(result.length).toBe(3)
    expect(result[0]).toMatchObject({
      keyType: 'group',
      key: 'widgets.test.config.layersConfig[0]'
    })
    expect(result[1]).toMatchObject({
      key: 'widgets.test.config.layersConfig[0].name',
      groupKey: 'widgets.test.config.layersConfig[0]'
    })
    expect(result[2]).toMatchObject({
      key: 'widgets.test.config.layersConfig[0].groupedFields[0].subDescription',
      groupKey: 'widgets.test.config.layersConfig[0]',
      label: {
        key: 'fieldDescription',
        values: { value: 'FieldAlias' },
        enLabel: 'Description for field "FieldAlias"'
      }
    })
  })

  it('does not create layer group when no field key and no label key', () => {
    const layersConfig = Immutable([
      {
        layerHonorMode: LayerHonorModeType.Custom,
        groupedFields: [],
        name: 'Layer3'
      }
    ] as any)
    const result = getKeysInLayersConfig(layersConfig, 'widgets.test.config', false)
    expect(result).toEqual([])
  })
})