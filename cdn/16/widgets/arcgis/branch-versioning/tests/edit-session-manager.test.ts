import { EditSessionManager } from '../src/runtime/context/managers/edit-session-manager'
import { loadArcGISJSAPIModule } from 'jimu-core'

// Mock jimu-core
jest.mock('jimu-core', () => ({
  loadArcGISJSAPIModule: jest.fn(),
  FixedPosition: {
    TopLeft: 'TOP_LEFT',
    TopRight: 'TOP_RIGHT',
    BottomLeft: 'BOTTOM_LEFT',
    BottomRight: 'BOTTOM_RIGHT'
  }
}))

// Mock utils
jest.mock('../src/runtime/utils/utils', () => ({
  getApplyEditsType: jest.fn(),
  getFeatureServiceApplyEditsResults: jest.fn(),
  getFeatureServiceLayerApplyEditsResults: jest.fn(),
  getLrsApplyEditsResults: jest.fn(),
  normalizeServiceUrl: jest.fn((url: string) => url.split('?')[0])
}))

describe('EditSessionManager', () => {
  let editSessionManager: EditSessionManager
  let mockVersioningState: any
  let mockEsriRequest: jest.Mock
  let mockEsriConfig: any

  beforeEach(() => {
    editSessionManager = new EditSessionManager()

    // Reset mocks
    jest.clearAllMocks()

    // Mock esri request
    mockEsriRequest = jest.fn()

    // Mock esri config
    mockEsriConfig = {
      request: {
        interceptors: []
      }
    }

    // Setup mock versioning state
    mockVersioningState = {
      url: 'https://services.arcgis.com/testVersion/VersionManagementServer',
      featureServiceUrl: 'https://services.arcgis.com/test/FeatureServer',
      isDefault: false,
      state: 'lock-write',
      currentVersionInfo: {
        versionIdentifier: {
          guid: '{12345678-1234-1234-1234-123456789012}',
          name: 'testVersion'
        },
        reconcileDate: null
      },
      versionManagementService: {
        load: jest.fn().mockResolvedValue(undefined),
        reconcile: jest.fn(),
        post: jest.fn()
      },
      startEditing: jest.fn().mockResolvedValue({ success: true }),
      stopEditing: jest.fn().mockResolvedValue({ success: true })
    }

    // Mock loadArcGISJSAPIModule
    ;(loadArcGISJSAPIModule as jest.Mock).mockImplementation((moduleName: string) => {
      if (moduleName === 'esri/request') {
        return Promise.resolve(mockEsriRequest)
      }
      if (moduleName === 'esri/config') {
        return Promise.resolve(mockEsriConfig)
      }
      return Promise.resolve({})
    })
  })

  describe('isInterceptorInstalled', () => {
    it('should return false initially', () => {
      expect(editSessionManager.isInterceptorInstalled()).toBe(false)
    })

    it('should return true after interceptor is set up', async () => {
      const state = {
        editSessionEnabled: true,
        versioningStates: new Map(),
        isEditing: false,
        canRedo: false,
        undoRedoManager: { peek: jest.fn() }
      }
      const actions = {
        registerVersioningState: jest.fn(),
        clearForwardMoments: jest.fn(),
        initializeUndoRedoStack: jest.fn(),
        addMoment: jest.fn()
      }

      await editSessionManager.setupInterceptor(() => state as any, actions as any)
      expect(editSessionManager.isInterceptorInstalled()).toBe(true)
    })
  })

  describe('stopEditSession', () => {
    it('should stop editing sessions for non-default versioning states', async () => {
      const versioningStates = new Map([
        ['test1', mockVersioningState]
      ])

      const result = await editSessionManager.stopEditSession(versioningStates, true)

      expect(result.success).toBe(true)
      expect(mockVersioningState.stopEditing).toHaveBeenCalledWith(true)
    })

    it('should not stop editing for default versions', async () => {
      const defaultVersioningState = {
        ...mockVersioningState,
        isDefault: true
      }
      const versioningStates = new Map([
        ['test1', defaultVersioningState]
      ])

      const result = await editSessionManager.stopEditSession(versioningStates, true)

      expect(result.success).toBe(true)
      expect(defaultVersioningState.stopEditing).not.toHaveBeenCalled()
    })

    it('should not stop editing if not in lock-write state', async () => {
      const readVersioningState = {
        ...mockVersioningState,
        state: 'read'
      }
      const versioningStates = new Map([
        ['test1', readVersioningState]
      ])

      const result = await editSessionManager.stopEditSession(versioningStates, false)

      expect(result.success).toBe(true)
      expect(readVersioningState.stopEditing).not.toHaveBeenCalled()
    })

    it('should return error if stopEditing fails', async () => {
      const failingVersioningState = {
        ...mockVersioningState,
        stopEditing: jest.fn().mockResolvedValue({
          success: false,
          error: { message: 'Stop editing failed' }
        })
      }
      const versioningStates = new Map([
        ['test1', failingVersioningState]
      ])

      const result = await editSessionManager.stopEditSession(versioningStates, true)

      expect(result.success).toBe(false)
      expect(result.error).toBe('Stop editing failed')
    })

    it('should handle exceptions during stop editing', async () => {
      const throwingVersioningState = {
        ...mockVersioningState,
        stopEditing: jest.fn().mockRejectedValue(new Error('Network error'))
      }
      const versioningStates = new Map([
        ['test1', throwingVersioningState]
      ])

      const result = await editSessionManager.stopEditSession(versioningStates, true)

      expect(result.success).toBe(false)
      expect(result.error).toBe('Network error')
    })
  })

  describe('reconcile', () => {
    it('should reconcile non-default versioning states successfully', async () => {
      const reconcileResult = {
        hasConflicts: false,
        moment: new Date('2026-01-01T00:00:00.000Z')
      }
      mockVersioningState.versionManagementService.reconcile.mockResolvedValue(reconcileResult)

      const versioningStates = new Map([
        ['test1', mockVersioningState]
      ])

      const result = await editSessionManager.reconcile(versioningStates)

      expect(result.allSuccessful).toBe(true)
      expect(result.results).toHaveLength(1)
      expect(result.results[0]).toEqual({
        url: 'https://services.arcgis.com/test/FeatureServer',
        versionName: 'testVersion',
        success: true,
        hasConflicts: false,
        moment: reconcileResult.moment.getTime()
      })
      expect(mockVersioningState.versionManagementService.load).toHaveBeenCalled()
      expect(mockVersioningState.versionManagementService.reconcile).toHaveBeenCalledWith(
        mockVersioningState.currentVersionInfo.versionIdentifier,
        {
          abortIfConflicts: true,
          conflictDetection: 'by-attribute',
          withPost: false
        }
      )
    })

    it('should report conflicts when reconcile detects them', async () => {
      const reconcileResult = {
        hasConflicts: true,
        moment: new Date('2026-01-01T00:00:00.000Z')
      }
      mockVersioningState.versionManagementService.reconcile.mockResolvedValue(reconcileResult)

      const versioningStates = new Map([
        ['test1', mockVersioningState]
      ])

      const result = await editSessionManager.reconcile(versioningStates)

      expect(result.allSuccessful).toBe(false)
      expect(result.results[0].success).toBe(false)
      expect(result.results[0].hasConflicts).toBe(true)
    })

    it('should skip default versions during reconcile', async () => {
      const defaultVersioningState = {
        ...mockVersioningState,
        isDefault: true
      }
      const versioningStates = new Map([
        ['test1', defaultVersioningState]
      ])

      const result = await editSessionManager.reconcile(versioningStates)

      expect(result.results).toHaveLength(0)
      expect(defaultVersioningState.versionManagementService.reconcile).not.toHaveBeenCalled()
    })

    it('should handle reconcile errors', async () => {
      mockVersioningState.versionManagementService.reconcile.mockRejectedValue(
        new Error('Reconcile failed')
      )

      const versioningStates = new Map([
        ['test1', mockVersioningState]
      ])

      const result = await editSessionManager.reconcile(versioningStates)

      expect(result.allSuccessful).toBe(false)
      expect(result.results[0]).toEqual({
        url: 'https://services.arcgis.com/test/FeatureServer',
        versionName: 'testVersion',
        success: false,
        error: 'Reconcile failed',
        moment: null
      })
    })

    it('should handle multiple versioning states', async () => {
      const reconcileResult1 = {
        hasConflicts: false,
        moment: new Date('2026-01-01T00:00:00.000Z')
      }
      const reconcileResult2 = {
        hasConflicts: false,
        moment: new Date('2026-01-02T00:00:00.000Z')
      }

      const mockVersioningState2 = {
        ...mockVersioningState,
        currentVersionInfo: {
          versionIdentifier: {
            guid: '{87654321-4321-4321-4321-210987654321}',
            name: 'testVersion2'
          },
          reconcileDate: null
        },
        versionManagementService: {
          load: jest.fn().mockResolvedValue(undefined),
          reconcile: jest.fn().mockResolvedValue(reconcileResult2)
        }
      }

      mockVersioningState.versionManagementService.reconcile.mockResolvedValue(reconcileResult1)

      const versioningStates = new Map([
        ['test1', mockVersioningState],
        ['test2', mockVersioningState2]
      ])

      const result = await editSessionManager.reconcile(versioningStates)

      expect(result.allSuccessful).toBe(true)
      expect(result.results).toHaveLength(2)
      expect(result.results[0].versionName).toBe('testVersion')
      expect(result.results[1].versionName).toBe('testVersion2')
    })
  })

  describe('post', () => {
    it('should post non-default versioning states successfully', async () => {
      const postResult = {
        success: true,
        moment: new Date('2026-01-01T00:00:00.000Z')
      }
      mockVersioningState.versionManagementService.post.mockResolvedValue(postResult)

      const versioningStates = new Map([
        ['test1', mockVersioningState]
      ])

      const result = await editSessionManager.post(versioningStates)

      expect(result.allSuccessful).toBe(true)
      expect(result.results).toHaveLength(1)
      expect(result.results[0]).toEqual({
        url: 'https://services.arcgis.com/test/FeatureServer',
        versionName: 'testVersion',
        success: true,
        moment: postResult.moment.getTime()
      })
      expect(mockVersioningState.versionManagementService.load).toHaveBeenCalled()
      expect(mockVersioningState.versionManagementService.post).toHaveBeenCalledWith(
        mockVersioningState.currentVersionInfo.versionIdentifier
      )
    })

    it('should handle post without moment', async () => {
      const postResult = {
        success: true,
        moment: null
      }
      mockVersioningState.versionManagementService.post.mockResolvedValue(postResult)

      const versioningStates = new Map([
        ['test1', mockVersioningState]
      ])

      const result = await editSessionManager.post(versioningStates)

      expect(result.allSuccessful).toBe(true)
      expect(result.results[0].moment).toBeNull()
    })

    it('should skip default versions during post', async () => {
      const defaultVersioningState = {
        ...mockVersioningState,
        isDefault: true
      }
      const versioningStates = new Map([
        ['test1', defaultVersioningState]
      ])

      const result = await editSessionManager.post(versioningStates)

      expect(result.results).toHaveLength(0)
      expect(defaultVersioningState.versionManagementService.post).not.toHaveBeenCalled()
    })

    it('should handle post errors', async () => {
      mockVersioningState.versionManagementService.post.mockRejectedValue(
        new Error('Post failed')
      )

      const versioningStates = new Map([
        ['test1', mockVersioningState]
      ])

      const result = await editSessionManager.post(versioningStates)

      expect(result.allSuccessful).toBe(false)
      expect(result.results[0]).toEqual({
        url: 'https://services.arcgis.com/test/FeatureServer',
        versionName: 'testVersion',
        success: false,
        error: 'Post failed',
        moment: null
      })
    })

    it('should handle failed post results', async () => {
      const postResult = {
        success: false,
        moment: null
      }
      mockVersioningState.versionManagementService.post.mockResolvedValue(postResult)

      const versioningStates = new Map([
        ['test1', mockVersioningState]
      ])

      const result = await editSessionManager.post(versioningStates)

      expect(result.allSuccessful).toBe(false)
      expect(result.results[0].success).toBe(false)
    })
  })

  describe('setupInterceptor', () => {
    it('should not install interceptor if already installed', async () => {
      const state = {
        editSessionEnabled: true,
        versioningStates: new Map(),
        isEditing: false,
        canRedo: false,
        undoRedoManager: { peek: jest.fn() }
      }
      const actions = {
        registerVersioningState: jest.fn(),
        clearForwardMoments: jest.fn(),
        initializeUndoRedoStack: jest.fn(),
        addMoment: jest.fn()
      }

      await editSessionManager.setupInterceptor(() => state as any, actions as any)
      const initialLength = mockEsriConfig.request.interceptors.length

      await editSessionManager.setupInterceptor(() => state as any, actions as any)

      expect(mockEsriConfig.request.interceptors.length).toBe(initialLength)
    })

    it('should not install interceptor if edit sessions are disabled', async () => {
      const state = {
        editSessionEnabled: false,
        versioningStates: new Map(),
        isEditing: false,
        canRedo: false,
        undoRedoManager: { peek: jest.fn() }
      }
      const actions = {
        registerVersioningState: jest.fn(),
        clearForwardMoments: jest.fn(),
        initializeUndoRedoStack: jest.fn(),
        addMoment: jest.fn()
      }

      await editSessionManager.setupInterceptor(() => state as any, actions as any)

      expect(mockEsriConfig.request.interceptors.length).toBe(0)
      expect(editSessionManager.isInterceptorInstalled()).toBe(false)
    })

    it('should install interceptor when conditions are met', async () => {
      const state = {
        editSessionEnabled: true,
        versioningStates: new Map(),
        isEditing: false,
        canRedo: false,
        undoRedoManager: { peek: jest.fn() }
      }
      const actions = {
        registerVersioningState: jest.fn(),
        clearForwardMoments: jest.fn(),
        initializeUndoRedoStack: jest.fn(),
        addMoment: jest.fn()
      }

      await editSessionManager.setupInterceptor(() => state as any, actions as any)

      expect(mockEsriConfig.request.interceptors.length).toBe(1)
      expect(editSessionManager.isInterceptorInstalled()).toBe(true)
      const interceptor = mockEsriConfig.request.interceptors[0]
      expect(interceptor.urls).toBeDefined()
      expect(interceptor.before).toBeDefined()
      expect(interceptor.after).toBeDefined()
    })
  })

  describe('cleanupInterceptor', () => {
    it('should remove installed interceptor', async () => {
      const state = {
        editSessionEnabled: true,
        versioningStates: new Map(),
        isEditing: false,
        canRedo: false,
        undoRedoManager: { peek: jest.fn() }
      }
      const actions = {
        registerVersioningState: jest.fn(),
        clearForwardMoments: jest.fn(),
        initializeUndoRedoStack: jest.fn(),
        addMoment: jest.fn()
      }

      await editSessionManager.setupInterceptor(() => state as any, actions as any)
      expect(mockEsriConfig.request.interceptors.length).toBe(1)

      await editSessionManager.cleanupInterceptor()

      expect(mockEsriConfig.request.interceptors.length).toBe(0)
      expect(editSessionManager.isInterceptorInstalled()).toBe(false)
    })

    it('should do nothing if interceptor is not installed', async () => {
      await editSessionManager.cleanupInterceptor()

      expect(mockEsriConfig.request.interceptors.length).toBe(0)
      expect(editSessionManager.isInterceptorInstalled()).toBe(false)
    })
  })
})
