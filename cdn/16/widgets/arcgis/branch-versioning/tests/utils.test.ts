import { DataSourceManager, DataSourceTypes, jimuHistory } from 'jimu-core'
import {
  getServiceName,
  normalizeServiceUrl,
  getApplyEditsType,
  getLrsApplyEditsResults,
  getFeatureServiceApplyEditsResults,
  getFeatureServiceLayerApplyEditsResults,
  buildEmptyMessage,
  buildMessage,
  getI18nMessage,
  changeDataSourceVersion,
  changeDataSourceHistoricMoment,
  changeAllDataSourceHistoricMoment,
  loadVersionManagementVersioningStates,
  changeDefaultVersion
} from '../src/runtime/utils/utils'
import { ApplyEditType, MessageType, AlertType } from '../src/config'

// Mock dependencies
jest.mock('jimu-core', () => ({
  DataSourceManager: {
    getInstance: jest.fn()
  },
  DataSourceTypes: {
    Map: 'MAP',
    WebMap: 'WEB_MAP',
    WebScene: 'WEB_SCENE',
    FeatureLayer: 'FEATURE_LAYER',
    SubtypeGroupLayer: 'SUBTYPE_GROUP_LAYER',
    SubtypeSublayer: 'SUBTYPE_SUBLAYER'
  },
  jimuHistory: {
    changeQueryObjectByDataSourceGDBVersion: jest.fn()
  },
  i18n: {
    getIntl: jest.fn(() => ({
      formatMessage: jest.fn((msg, values) => {
        if (values) {
          return `${msg.id} with ${JSON.stringify(values)}`
        }
        return msg.id
      })
    }))
  },
  FixedPosition: {
    TopLeft: 'TOP_LEFT',
    TopRight: 'TOP_RIGHT',
    BottomLeft: 'BOTTOM_LEFT',
    BottomRight: 'BOTTOM_RIGHT'
  }
}))

describe('utils', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('getServiceName', () => {
    it('should extract service name from feature server URL', () => {
      const url = 'https://example.com/rest/services/MyService/FeatureServer'
      expect(getServiceName(url)).toBe('MyService')
    })

    it('should extract service name with case insensitivity', () => {
      const url = 'https://example.com/rest/services/TestService/featureserver'
      expect(getServiceName(url)).toBe('TestService')
    })

    it('should return original URL if pattern does not match', () => {
      const url = 'https://example.com/invalid/url'
      expect(getServiceName(url)).toBe(url)
    })

    it('should handle URLs with layer IDs', () => {
      const url = 'https://example.com/rest/services/MyService/FeatureServer/0'
      expect(getServiceName(url)).toBe('MyService')
    })
  })

  describe('normalizeServiceUrl', () => {
    it('should normalize LRS URLs', () => {
      const url = 'https://example.com/rest/services/MyService/MapServer/exts/LRServer/applyEdits'
      const expected = 'https://example.com/rest/services/MyService/FeatureServer'
      expect(normalizeServiceUrl(url)).toBe(expected)
    })

    it('should normalize VersionManagementServer URLs', () => {
      const url = 'https://example.com/rest/services/MyService/VersionManagementServer/versions/123/startEditing'
      const expected = 'https://example.com/rest/services/MyService/FeatureServer'
      expect(normalizeServiceUrl(url)).toBe(expected)
    })

    it('should normalize regular FeatureServer URLs', () => {
      const url = 'https://example.com/rest/services/MyService/FeatureServer/0/applyEdits'
      const expected = 'https://example.com/rest/services/MyService/FeatureServer'
      expect(normalizeServiceUrl(url)).toBe(expected)
    })

    it('should return URL as-is if already normalized', () => {
      const url = 'https://example.com/rest/services/MyService/FeatureServer'
      expect(normalizeServiceUrl(url)).toBe(url)
    })

    it('should return original URL if no pattern matches', () => {
      const url = 'https://example.com/invalid/url'
      expect(normalizeServiceUrl(url)).toBe(url)
    })
  })

  describe('getApplyEditsType', () => {
    it('should identify LRS applyEdits URLs', () => {
      const url = 'https://example.com/MapServer/exts/LRServer/applyEdits'
      expect(getApplyEditsType(url)).toBe(ApplyEditType.LRS)
    })

    it('should identify layer applyEdits URLs', () => {
      const url = 'https://example.com/FeatureServer/5/applyEdits'
      expect(getApplyEditsType(url)).toBe(ApplyEditType.LAYER)
    })

    it('should identify service applyEdits URLs', () => {
      const url = 'https://example.com/FeatureServer/applyEdits'
      expect(getApplyEditsType(url)).toBe(ApplyEditType.SERVICE)
    })

    it('should be case insensitive', () => {
      const url = 'https://example.com/featureserver/3/applyedits'
      expect(getApplyEditsType(url)).toBe(ApplyEditType.LAYER)
    })
  })

  describe('getLrsApplyEditsResults', () => {
    it('should extract edit moment and layer IDs from LRS response', () => {
      const response = {
        data: {
          editMoment: 1234567890,
          editResults: [
            { id: 1 },
            { id: 2 },
            { id: 3 }
          ]
        }
      }
      const result = getLrsApplyEditsResults(response)
      expect(result.moment).toBe(1234567890)
      expect(result.layerIds).toEqual([1, 2, 3])
    })

    it('should handle missing editMoment', () => {
      const response = {
        data: {
          editResults: [{ id: 1 }]
        }
      }
      const result = getLrsApplyEditsResults(response)
      expect(result.moment).toBeUndefined()
      expect(result.layerIds).toEqual([1])
    })

    it('should handle empty editResults', () => {
      const response = {
        data: {
          editMoment: 1234567890,
          editResults: []
        }
      }
      const result = getLrsApplyEditsResults(response)
      expect(result.moment).toBe(1234567890)
      expect(result.layerIds).toEqual([])
    })

    it('should handle missing editResults', () => {
      const response = {
        data: {
          editMoment: 1234567890
        }
      }
      const result = getLrsApplyEditsResults(response)
      expect(result.moment).toBe(1234567890)
      expect(result.layerIds).toEqual([])
    })

    it('should convert string IDs to numbers', () => {
      const response = {
        data: {
          editResults: [
            { id: '1' },
            { id: '2' }
          ]
        }
      }
      const result = getLrsApplyEditsResults(response)
      expect(result.layerIds).toEqual([1, 2])
    })
  })

  describe('getFeatureServiceApplyEditsResults', () => {
    it('should extract edit moment and layer IDs from feature service response', () => {
      const response = {
        data: [
          { id: 1, editMoment: 1234567890 },
          { id: 2 },
          { id: 3 }
        ]
      }
      const result = getFeatureServiceApplyEditsResults(response)
      expect(result.moment).toBe(1234567890)
      expect(result.layerIds).toEqual([1, 2, 3])
    })

    it('should use first editMoment found', () => {
      const response = {
        data: [
          { id: 1, editMoment: 1234567890 },
          { id: 2, editMoment: 9999999999 }
        ]
      }
      const result = getFeatureServiceApplyEditsResults(response)
      expect(result.moment).toBe(1234567890)
    })

    it('should handle empty data array', () => {
      const response = { data: [] }
      const result = getFeatureServiceApplyEditsResults(response)
      expect(result.moment).toBeUndefined()
      expect(result.layerIds).toEqual([])
    })

    it('should handle non-array data', () => {
      const response = { data: null }
      const result = getFeatureServiceApplyEditsResults(response)
      expect(result.moment).toBeUndefined()
      expect(result.layerIds).toEqual([])
    })
  })

  describe('getFeatureServiceLayerApplyEditsResults', () => {
    it('should extract edit moment and layer ID from layer response', () => {
      const response = {
        url: 'https://example.com/FeatureServer/5/applyEdits',
        data: {
          editMoment: 1234567890
        }
      }
      const result = getFeatureServiceLayerApplyEditsResults(response)
      expect(result.moment).toBe(1234567890)
      expect(result.layerIds).toEqual([5])
    })

    it('should handle missing editMoment', () => {
      const response = {
        url: 'https://example.com/FeatureServer/5/applyEdits',
        data: {}
      }
      const result = getFeatureServiceLayerApplyEditsResults(response)
      expect(result.moment).toBeUndefined()
      expect(result.layerIds).toEqual([])
    })

    it('should handle missing URL', () => {
      const response = {
        data: {
          editMoment: 1234567890
        }
      }
      const result = getFeatureServiceLayerApplyEditsResults(response)
      expect(result.moment).toBe(1234567890)
      expect(result.layerIds).toEqual([])
    })

    it('should parse layer ID from URL', () => {
      const response = {
        url: 'https://example.com/FeatureServer/123/applyEdits',
        data: {
          editMoment: 1234567890
        }
      }
      const result = getFeatureServiceLayerApplyEditsResults(response)
      expect(result.layerIds).toEqual([123])
    })
  })

  describe('buildEmptyMessage', () => {
    it('should build empty message with default values', () => {
      const message = buildEmptyMessage()
      expect(message).toEqual({
        title: '',
        message: '',
        type: MessageType.NONE,
        kind: AlertType.BRAND
      })
    })
  })

  describe('buildMessage', () => {
    it('should build message with provided values', () => {
      const message = buildMessage('Test Title', 'Test Message', MessageType.ALERT, AlertType.SUCCESS)
      expect(message).toEqual({
        title: 'Test Title',
        message: 'Test Message',
        type: MessageType.ALERT,
        kind: AlertType.SUCCESS
      })
    })

    it('should use default kind if not provided', () => {
      const message = buildMessage('Test Title', 'Test Message', MessageType.ALERT)
      expect(message).toEqual({
        title: 'Test Title',
        message: 'Test Message',
        type: MessageType.ALERT,
        kind: AlertType.BRAND
      })
    })
  })

  describe('getI18nMessage', () => {
    it('should get internationalized message by ID', () => {
      const message = getI18nMessage('testId')
      expect(message).toBe('testId')
    })

    it('should support message interpolation', () => {
      const message = getI18nMessage('testId', { name: 'John', count: 5 })
      expect(message).toContain('testId')
      expect(message).toContain('name')
      expect(message).toContain('John')
    })
  })

  describe('changeDataSourceVersion', () => {
    it('should change GDB version for matching feature layers', () => {
      const mockChangeGDBVersion = jest.fn()
      const mockFeatureLayer = {
        type: DataSourceTypes.FeatureLayer,
        layer: { url: 'https://example.com/rest/services/TestService/FeatureServer' },
        changeGDBVersion: mockChangeGDBVersion,
        getLayerDefinition: jest.fn(() => ({ id: 1 }))
      }

      const mockDataSource = {
        type: DataSourceTypes.WebMap,
        getAllChildDataSources: jest.fn(() => [mockFeatureLayer])
      }

      const mockDsManager = {
        getDataSources: jest.fn(() => ({ ds1: mockDataSource }))
      }

      ;(DataSourceManager.getInstance as jest.Mock).mockReturnValue(mockDsManager)

      changeDataSourceVersion('sde.DEFAULT', 'https://example.com/rest/services/TestService/FeatureServer')

      expect(mockChangeGDBVersion).toHaveBeenCalledWith('sde.DEFAULT')
      expect(jimuHistory.changeQueryObjectByDataSourceGDBVersion).toHaveBeenCalledWith('TestService', 'sde.DEFAULT')
    })

    it('should not update non-matching feature layers', () => {
      const mockChangeGDBVersion = jest.fn()
      const mockFeatureLayer = {
        type: DataSourceTypes.FeatureLayer,
        layer: { url: 'https://different.com/FeatureServer' },
        changeGDBVersion: mockChangeGDBVersion,
        getLayerDefinition: jest.fn(() => ({ id: 1 }))
      }

      const mockDataSource = {
        type: DataSourceTypes.WebMap,
        getAllChildDataSources: jest.fn(() => [mockFeatureLayer])
      }

      const mockDsManager = {
        getDataSources: jest.fn(() => ({ ds1: mockDataSource }))
      }

      ;(DataSourceManager.getInstance as jest.Mock).mockReturnValue(mockDsManager)

      changeDataSourceVersion('sde.DEFAULT', 'https://example.com/FeatureServer')

      expect(mockChangeGDBVersion).not.toHaveBeenCalled()
    })
  })

  describe('changeDataSourceHistoricMoment', () => {
    it('should change historic moment for all layers when no layerIds provided', () => {
      const mockChangeHistoricMoment = jest.fn()
      const mockFeatureLayer = {
        type: DataSourceTypes.FeatureLayer,
        layer: { url: 'https://example.com/FeatureServer' },
        changeHistoricMoment: mockChangeHistoricMoment,
        getLayerDefinition: jest.fn(() => ({ id: 1 }))
      }

      const mockDataSource = {
        type: DataSourceTypes.WebMap,
        getAllChildDataSources: jest.fn(() => [mockFeatureLayer])
      }

      const mockDsManager = {
        getDataSources: jest.fn(() => ({ ds1: mockDataSource }))
      }

      ;(DataSourceManager.getInstance as jest.Mock).mockReturnValue(mockDsManager)

      changeDataSourceHistoricMoment(1234567890, 'https://example.com/FeatureServer')

      expect(mockChangeHistoricMoment).toHaveBeenCalledWith(1234567890)
    })

    it('should change historic moment only for specified layer IDs', () => {
      const mockChangeHistoricMoment1 = jest.fn()
      const mockChangeHistoricMoment2 = jest.fn()

      const mockFeatureLayer1 = {
        type: DataSourceTypes.FeatureLayer,
        layer: { url: 'https://example.com/FeatureServer' },
        changeHistoricMoment: mockChangeHistoricMoment1,
        getLayerDefinition: jest.fn(() => ({ id: 1 }))
      }

      const mockFeatureLayer2 = {
        type: DataSourceTypes.FeatureLayer,
        layer: { url: 'https://example.com/FeatureServer' },
        changeHistoricMoment: mockChangeHistoricMoment2,
        getLayerDefinition: jest.fn(() => ({ id: 2 }))
      }

      const mockDataSource = {
        type: DataSourceTypes.WebMap,
        getAllChildDataSources: jest.fn(() => [mockFeatureLayer1, mockFeatureLayer2])
      }

      const mockDsManager = {
        getDataSources: jest.fn(() => ({ ds1: mockDataSource }))
      }

      ;(DataSourceManager.getInstance as jest.Mock).mockReturnValue(mockDsManager)

      changeDataSourceHistoricMoment(1234567890, 'https://example.com/FeatureServer', [1])

      expect(mockChangeHistoricMoment1).toHaveBeenCalledWith(1234567890)
      expect(mockChangeHistoricMoment2).not.toHaveBeenCalled()
    })

    it('should perform full refresh when specified', () => {
      const mockChangeHistoricMoment = jest.fn()
      const mockFeatureLayer = {
        type: DataSourceTypes.FeatureLayer,
        layer: { url: 'https://example.com/FeatureServer' },
        changeHistoricMoment: mockChangeHistoricMoment,
        getLayerDefinition: jest.fn(() => ({ id: 2 }))
      }

      const mockDataSource = {
        type: DataSourceTypes.WebMap,
        getAllChildDataSources: jest.fn(() => [mockFeatureLayer])
      }

      const mockDsManager = {
        getDataSources: jest.fn(() => ({ ds1: mockDataSource }))
      }

      ;(DataSourceManager.getInstance as jest.Mock).mockReturnValue(mockDsManager)

      changeDataSourceHistoricMoment(1234567890, 'https://example.com/FeatureServer', [1], true)

      expect(mockChangeHistoricMoment).toHaveBeenCalledWith(1234567890)
    })
  })

  describe('changeAllDataSourceHistoricMoment', () => {
    it('should change historic moment for all versioning states', () => {
      const mockChangeHistoricMoment = jest.fn()
      const mockFeatureLayer = {
        type: DataSourceTypes.FeatureLayer,
        layer: { url: 'https://example.com/FeatureServer' },
        changeHistoricMoment: mockChangeHistoricMoment,
        getLayerDefinition: jest.fn(() => ({ id: 1 }))
      }

      const mockDataSource = {
        type: DataSourceTypes.WebMap,
        getAllChildDataSources: jest.fn(() => [mockFeatureLayer])
      }

      const mockDsManager = {
        getDataSources: jest.fn(() => ({ ds1: mockDataSource }))
      }

      ;(DataSourceManager.getInstance as jest.Mock).mockReturnValue(mockDsManager)

      const versioningStates = new Map([
        ['url1', { featureServiceUrl: 'https://example.com/FeatureServer' } as any]
      ])

      changeAllDataSourceHistoricMoment(1234567890, versioningStates)

      expect(mockChangeHistoricMoment).toHaveBeenCalledWith(1234567890)
    })
  })

  describe('loadVersionManagementVersioningStates', () => {
    it('should load versioning states from component', async () => {
      const mockVersioningStates = {} as __esri.Collection<__esri.VersioningState>
      const mockComponent = {
        componentOnReady: jest.fn().mockResolvedValue(undefined),
        state: 'ready',
        versioningStates: mockVersioningStates
      }

      document.querySelector = jest.fn().mockReturnValue(mockComponent)

      const result = await loadVersionManagementVersioningStates()

      expect(result).toBe(mockVersioningStates)
      expect(mockComponent.componentOnReady).toHaveBeenCalled()
    })

    it('should wait for component to finish loading', async () => {
      const mockVersioningStates = {} as __esri.Collection<__esri.VersioningState>
      const mockComponent = {
        componentOnReady: jest.fn().mockResolvedValue(undefined),
        state: 'loading',
        versioningStates: mockVersioningStates
      }

      document.querySelector = jest.fn().mockReturnValue(mockComponent)

      setTimeout(() => {
        mockComponent.state = 'ready'
      }, 150)

      const result = await loadVersionManagementVersioningStates()

      expect(result).toBe(mockVersioningStates)
    })

    it('should throw error when component not found', async () => {
      document.querySelector = jest.fn().mockReturnValue(null)

      await expect(loadVersionManagementVersioningStates()).rejects.toThrow()
    })

    it('should throw error when component state is failed', async () => {
      const mockComponent = {
        componentOnReady: jest.fn().mockResolvedValue(undefined),
        state: 'failed'
      }

      document.querySelector = jest.fn().mockReturnValue(mockComponent)

      await expect(loadVersionManagementVersioningStates()).rejects.toThrow()
    })
  })

  describe('changeDefaultVersion', () => {
    it('should change to URL provided version', async () => {
      const mockChangeVersion = jest.fn().mockResolvedValue(undefined)
      const mockVs = {
        featureServiceUrl: 'https://example.com/rest/services/TestService/FeatureServer',
        versionInfos: [
          { versionIdentifier: { name: 'sde.DEFAULT' } },
          { versionIdentifier: { name: 'sde.VERSION1' } }
        ],
        defaultVersionIdentifier: { name: 'sde.DEFAULT' },
        changeVersion: mockChangeVersion
      } as any

      const mockConfig = {
        defaultVersions: {}
      } as any

      const mockFeatureLayer = {
        layer: { url: 'https://example.com/rest/services/TestService/FeatureServer' },
        changeGDBVersion: jest.fn(),
        getLayerDefinition: jest.fn(() => ({ id: 1 }))
      }

      const mockDataSource = {
        type: DataSourceTypes.WebMap,
        getAllChildDataSources: jest.fn(() => [mockFeatureLayer])
      }

      const mockDsManager = {
        getDataSources: jest.fn(() => ({ ds1: mockDataSource }))
      }

      ;(DataSourceManager.getInstance as jest.Mock).mockReturnValue(mockDsManager)

      const result = await changeDefaultVersion(mockConfig, 'sde.VERSION1', mockVs)

      expect(mockChangeVersion).toHaveBeenCalledWith({ name: 'sde.VERSION1' })
      expect(result).toBe(mockVs)
    })

    it('should return undefined when vs is not provided', async () => {
      const mockConfig = {} as any
      const result = await changeDefaultVersion(mockConfig, '', null)
      expect(result).toBeUndefined()
    })

    it('should use configured default version when no URL version provided', async () => {
      const mockChangeVersion = jest.fn().mockResolvedValue(undefined)
      const mockVs = {
        featureServiceUrl: 'https://example.com/rest/services/TestService/FeatureServer',
        versionInfos: [
          { versionIdentifier: { name: 'sde.DEFAULT' } },
          { versionIdentifier: { name: 'sde.CONFIG_VERSION' } }
        ],
        defaultVersionIdentifier: { name: 'sde.DEFAULT' },
        changeVersion: mockChangeVersion
      } as any

      const mockConfig = {
        defaultVersions: {
          TestService: { name: 'sde.CONFIG_VERSION' }
        }
      } as any

      const mockFeatureLayer = {
        layer: { url: 'https://example.com/rest/services/TestService/FeatureServer' },
        changeGDBVersion: jest.fn(),
        getLayerDefinition: jest.fn(() => ({ id: 1 }))
      }

      const mockDataSource = {
        type: DataSourceTypes.WebMap,
        getAllChildDataSources: jest.fn(() => [mockFeatureLayer])
      }

      const mockDsManager = {
        getDataSources: jest.fn(() => ({ ds1: mockDataSource }))
      }

      ;(DataSourceManager.getInstance as jest.Mock).mockReturnValue(mockDsManager)

      await changeDefaultVersion(mockConfig, '', mockVs)

      expect(mockChangeVersion).toHaveBeenCalledWith({ name: 'sde.CONFIG_VERSION' })
    })

    it('should fallback to service default version', async () => {
      const mockChangeVersion = jest.fn().mockResolvedValue(undefined)
      const mockVs = {
        featureServiceUrl: 'https://example.com/rest/services/TestService/FeatureServer',
        versionInfos: [
          { versionIdentifier: { name: 'sde.DEFAULT' } }
        ],
        defaultVersionIdentifier: { name: 'sde.DEFAULT' },
        changeVersion: mockChangeVersion
      } as any

      const mockConfig = {
        defaultVersions: {}
      } as any

      const mockFeatureLayer = {
        layer: { url: 'https://example.com/rest/services/TestService/FeatureServer' },
        changeGDBVersion: jest.fn(),
        getLayerDefinition: jest.fn(() => ({ id: 1 }))
      }

      const mockDataSource = {
        type: DataSourceTypes.WebMap,
        getAllChildDataSources: jest.fn(() => [mockFeatureLayer])
      }

      const mockDsManager = {
        getDataSources: jest.fn(() => ({ ds1: mockDataSource }))
      }

      ;(DataSourceManager.getInstance as jest.Mock).mockReturnValue(mockDsManager)

      await changeDefaultVersion(mockConfig, '', mockVs)

      expect(mockChangeVersion).toHaveBeenCalledWith({ name: 'sde.DEFAULT' })
    })

    it('should throw error on changeVersion failure', async () => {
      const mockVs = {
        featureServiceUrl: 'https://example.com/rest/services/TestService/FeatureServer',
        versionInfos: [
          { versionIdentifier: { name: 'sde.VERSION1' } }
        ],
        changeVersion: jest.fn().mockRejectedValue(new Error('Failed to change version'))
      } as any

      const mockConfig = {} as any

      const mockDsManager = {
        getDataSources: jest.fn(() => ({}))
      }

      ;(DataSourceManager.getInstance as jest.Mock).mockReturnValue(mockDsManager)

      await expect(changeDefaultVersion(mockConfig, 'sde.VERSION1', mockVs)).rejects.toThrow('Failed to change version')
    })
  })
})