import type FormTemplate from '@arcgis/core/form/FormTemplate'
import { getFlatFormElements } from '../src/utils/index'
import { constructFormElements, getCreationAttributes, getDefaultSnapSources, updateDataSourceAfterEdit } from '../src/runtime/components/utils'

describe('edit widget utils test cases', () => {
  describe('getFlatFormElements', () => {
    it('should return empty array for empty input', () => {
      expect(getFlatFormElements([])).toEqual([])
      expect(getFlatFormElements(null)).toEqual([])
      expect(getFlatFormElements(undefined)).toEqual([])
    })

    it('should flatten a flat array', () => {
      const elements = [
        { label: 'A', type: 'field' },
        { label: 'B', type: 'field' }
      ] as FormTemplate['elements']
      expect(getFlatFormElements(elements)).toEqual(elements)
    })

    it('should flatten nested elements', () => {
      const elements = [
        { label: 'A', type: 'group', elements: [
          { label: 'B', type: 'field' },
          { label: 'C', type: 'field' },
          { label: 'D', type: 'field' },
        ]},
        { label: 'E', type: 'field' },
      ] as FormTemplate['elements']
      const flat = getFlatFormElements(elements)
      expect(flat.map(e => e.label)).toEqual(['B', 'C', 'D', 'E'])
    })
  })
  describe('getDefaultSnapSources', () => {
    it('should not throw for null/undefined inputs', () => {
      expect(() => getDefaultSnapSources(null as any)).not.toThrow()
      expect(() => getDefaultSnapSources(undefined as any)).not.toThrow()
      expect(() => getDefaultSnapSources(undefined as any, undefined as any)).not.toThrow()
      expect(() => getDefaultSnapSources(null as any, [] as any)).not.toThrow()
    })

    it('should return an array for null/undefined inputs', () => {
      const r1 = getDefaultSnapSources(null as any)
      const r2 = getDefaultSnapSources(undefined as any)
      const r3 = getDefaultSnapSources(undefined as any, undefined as any)

      expect(Array.isArray(r1)).toBe(true)
      expect(Array.isArray(r2)).toBe(true)
      expect(Array.isArray(r3)).toBe(true)
    })

    it('should return selected layers based on the 2nd param (defaultSnapLayers)', () => {
      const layer1 = { id: 'layer-1' }
      const layer2 = { id: 'layer-2' }
      const jimuMapViewMock: any = {
        jimuLayerViews: {
          lv1: { layerDataSourceId: 'ds-1', layer: layer1 },
          lv2: { layerDataSourceId: 'ds-2', layer: layer2 }
        }
      }

      const result = getDefaultSnapSources(jimuMapViewMock, ['ds-2'] as any)
      expect(result).toEqual([{ layer: layer2, enabled: true }])
    })

    it('should return empty array when defaultSnapLayers is missing/empty', () => {
      const jimuMapViewMock: any = {
        jimuLayerViews: {
          lv1: { layerDataSourceId: 'ds-1', layer: { id: 'layer-1' } }
        }
      }

      expect(getDefaultSnapSources(jimuMapViewMock, undefined as any)).toEqual([])
      expect(getDefaultSnapSources(jimuMapViewMock, [] as any)).toEqual([])
    })

    it('should return a deterministic result for the same input', () => {
      const jimuMapViewMock: any = {
        jimuLayerViews: {
          lv1: { layerDataSourceId: 'ds-1', layer: { id: 'layer-1' } },
          lv2: { layerDataSourceId: 'ds-2', layer: { id: 'layer-2' } }
        }
      }
      const defaultSnapLayers: any = ['ds-1', 'ds-2']
      const a = getDefaultSnapSources(jimuMapViewMock, defaultSnapLayers)
      const b = getDefaultSnapSources(jimuMapViewMock, defaultSnapLayers)
      expect(a).toEqual(b)
    })

    it('should not mutate the provided input object', () => {
      const layer1 = { id: 'layer-1' }
      const input: any = {
        jimuLayerViews: {
          lv1: { layerDataSourceId: 'ds-1', layer: layer1 }
        },
        extra: { nested: { value: 1 } }
      }
      const defaultSnapLayers: any = ['ds-1']
      const beforeInput = JSON.parse(JSON.stringify(input))
      const beforeLayers = JSON.parse(JSON.stringify(defaultSnapLayers))

      getDefaultSnapSources(input, defaultSnapLayers)

      expect(input).toEqual(beforeInput)
      expect(defaultSnapLayers).toEqual(beforeLayers)
    })

    it('should return empty array when there is no jimuLayerViews', () => {
      const input: any = { view: { map: { layers: [] } } }
      const result = getDefaultSnapSources(input, ['ds-1'] as any)
      expect(result).toEqual([])
    })
  })

  describe('updateDataSourceAfterEdit', () => {
    it('should sync add, update and delete records back to data source', () => {
      const buildRecord = jest.fn((feature) => ({ id: feature.getObjectId(), feature }))
      const afterAddRecord = jest.fn()
      const afterUpdateRecords = jest.fn()
      const afterDeleteRecordsByIds = jest.fn()
      const originalFeature = {
        attributes: {
          objectId: 2,
          name: 'original',
          kept: 'yes'
        }
      }
      const dataSource: any = {
        buildRecord,
        afterAddRecord,
        afterUpdateRecords,
        afterDeleteRecordsByIds,
        getRecordById: jest.fn(() => ({ feature: originalFeature }))
      }
      const addFeature: any = {
        attributes: { objectId: 1, name: 'added' },
        getObjectId: () => 1
      }
      const updateFeature: any = {
        attributes: { objectId: 2, name: 'updated' },
        getObjectId: () => 2
      }

      updateDataSourceAfterEdit(dataSource, {
        addFeatures: [addFeature],
        updateFeatures: [updateFeature],
        deleteFeatures: [{ objectId: 3 }, { globalId: 'g-4' } as any]
      })

      expect(afterAddRecord).toHaveBeenCalledWith({ id: 1, feature: addFeature })
      expect(updateFeature.attributes).toEqual({ objectId: 2, name: 'updated', kept: 'yes' })
      expect(afterUpdateRecords).toHaveBeenCalledWith([{ id: 2, feature: updateFeature }])
      expect(afterDeleteRecordsByIds).toHaveBeenCalledWith([3, 'g-4'])
    })
  })

  describe('constructFormElements', () => {
    it('should preserve existing field element config when a field is inside group', () => {
      const existingFieldElement: any = {
        fieldName: 'field_1',
        valueExpression: '$feature.field_1',
        editableExpression: 'editableTrue',
        clone: jest.fn().mockImplementation(function () {
          return {
            ...this
          }
        })
      }

      const groupedFields: any = [
        {
          groupKey: 1,
          jimuName: '',
          name: 'Group 1',
          children: [
            {
              jimuName: 'field_1',
              name: 'Field 1',
              alias: 'Field 1',
              subDescription: 'desc in group',
              editAuthority: true
            }
          ]
        }
      ]

      constructFormElements(groupedFields, [], [existingFieldElement])
      expect(existingFieldElement.clone).toHaveBeenCalled()
    })
  })

  describe('getCreationAttributes', () => {
    it('should return cloned prototype attributes for standard feature template', () => {
      const template: any = {
        prototype: {
          attributes: {
            status: 'new',
            priority: 1
          }
        }
      }

      const result = getCreationAttributes(template)
      expect(result).toEqual({ status: 'new', priority: 1 })
      expect(result).not.toBe(template.prototype.attributes)
    })

    it('should return shared feature defaultValues for shared feature template', () => {
      const template: any = {
        templateId: 't-1',
        type: 'feature',
        definition: {
          defaultValues: {
            name: 'ESRI',
            code: '001'
          }
        }
      }

      expect(getCreationAttributes(template)).toEqual({ name: 'ESRI', code: '001' })
    })

    it('should return empty object for shared group template', () => {
      const template: any = {
        templateId: 't-2',
        type: 'group',
        definition: {}
      }

      expect(getCreationAttributes(template)).toEqual({})
    })

    it('should return empty object for shared preset template', () => {
      const template: any = {
        templateId: 't-3',
        type: 'preset',
        definition: {}
      }

      expect(getCreationAttributes(template)).toEqual({})
    })

    it('should return empty object for invalid or empty template input', () => {
      expect(getCreationAttributes(undefined as any)).toEqual({})
      expect(getCreationAttributes(null as any)).toEqual({})
      expect(getCreationAttributes({} as any)).toEqual({})
    })
  })
})