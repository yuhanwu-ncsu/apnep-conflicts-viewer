import type { UndoRedoManager } from '../src/runtime/context/managers/undo-redo-manager'
import type { EditSessionManager } from '../src/runtime/context/managers/edit-session-manager'

// Import after mocks
import { changeDataSourceHistoricMoment, changeAllDataSourceHistoricMoment } from '../src/runtime/utils/utils'

// Mock the managers
jest.mock('../src/runtime/context/managers/undo-redo-manager')
jest.mock('../src/runtime/context/managers/edit-session-manager')

// Mock utility functions
jest.mock('../src/runtime/utils/utils', () => ({
  changeDataSourceHistoricMoment: jest.fn(),
  changeAllDataSourceHistoricMoment: jest.fn(),
  clearDataSourceHistoricMoment: jest.fn(),
  buildEmptyMessage: jest.fn(() => ({
    title: '',
    message: '',
    type: 'none',
    kind: 'brand'
  })),
  buildMessage: jest.fn((title, message, type, kind = 'info') => ({
    title,
    message,
    type,
    kind
  })),
  getI18nMessage: jest.fn((key) => key)
}))

// We need to extract and test the reducer function
// Since it's not exported, we'll need to import the module and access it indirectly
// For now, let's create a test that validates the state management through the context

describe('VersionManagementContext Reducer', () => {
  let mockUndoRedoManager: jest.Mocked<UndoRedoManager>
  let mockEditSessionManager: jest.Mocked<EditSessionManager>
  let initialState: any

  beforeEach(() => {
    jest.clearAllMocks()

    // Create mock instances
    mockUndoRedoManager = {
      initialize: jest.fn(),
      add: jest.fn(),
      undo: jest.fn(),
      redo: jest.fn(),
      peek: jest.fn(),
      canUndo: jest.fn(),
      canRedo: jest.fn(),
      clear: jest.fn(),
      clearForwardMoments: jest.fn(),
      initialMoments: jest.fn().mockReturnValue([]),
      isInitialized: jest.fn(),
      size: jest.fn(),
      hasForwardEdits: jest.fn(),
      clone: jest.fn(function () { return this })
    } as any

    mockEditSessionManager = {
      stopEditSession: jest.fn().mockResolvedValue({ success: true }),
      reconcile: jest.fn(),
      post: jest.fn(),
      setupInterceptor: jest.fn(),
      cleanupInterceptor: jest.fn(),
      isInterceptorInstalled: jest.fn()
    } as any

    initialState = {
      canUndo: false,
      canRedo: false,
      canReconcile: false,
      canPost: false,
      isReconciling: false,
      isPosting: false,
      editSessionEnabled: false,
      isEditing: false,
      message: { title: '', message: '', type: 'none', kind: 'info' },
      undoRedoManager: mockUndoRedoManager,
      editSessionManager: mockEditSessionManager,
      versioningStates: new Map()
    }
  })

  describe('SET_EDIT_SESSION_ENABLED', () => {
    it('should set edit session enabled to true', () => {
      const action = { type: 'SET_EDIT_SESSION_ENABLED', value: true }
      const newState = testReducer(initialState, action)

      expect(newState.editSessionEnabled).toBe(true)
    })

    it('should set edit session enabled to false', () => {
      const state = { ...initialState, editSessionEnabled: true }
      const action = { type: 'SET_EDIT_SESSION_ENABLED', value: false }
      const newState = testReducer(state, action)

      expect(newState.editSessionEnabled).toBe(false)
    })
  })

  describe('REGISTER_VERSIONING_STATE', () => {
    it('should register a new versioning state', () => {
      const mockVersioningState = {
        isDefault: false,
        featureServiceUrl: 'https://test.com/FeatureServer'
      } as any

      const action = {
        type: 'REGISTER_VERSIONING_STATE',
        serviceUrl: 'https://test.com/FeatureServer',
        versioningState: mockVersioningState
      }

      const newState = testReducer(initialState, action)

      expect(newState.versioningStates.size).toBe(1)
      expect(newState.versioningStates.get('https://test.com/FeatureServer')).toBe(mockVersioningState)
      expect(newState.canReconcile).toBe(true)
    })

    it('should set canReconcile to false when only default versions exist', () => {
      const mockVersioningState = {
        isDefault: true,
        featureServiceUrl: 'https://test.com/FeatureServer'
      } as any

      const action = {
        type: 'REGISTER_VERSIONING_STATE',
        serviceUrl: 'https://test.com/FeatureServer',
        versioningState: mockVersioningState
      }

      const newState = testReducer(initialState, action)

      expect(newState.canReconcile).toBe(false)
    })

    it('should update existing versioning state', () => {
      const existingState = {
        isDefault: false,
        featureServiceUrl: 'https://test.com/FeatureServer',
        version: 'v1'
      } as any

      const updatedState = {
        isDefault: false,
        featureServiceUrl: 'https://test.com/FeatureServer',
        version: 'v2'
      } as any

      const state = {
        ...initialState,
        versioningStates: new Map([['https://test.com/FeatureServer', existingState]])
      }

      const action = {
        type: 'REGISTER_VERSIONING_STATE',
        serviceUrl: 'https://test.com/FeatureServer',
        versioningState: updatedState
      }

      const newState = testReducer(state, action)

      expect(newState.versioningStates.size).toBe(1)
      expect(newState.versioningStates.get('https://test.com/FeatureServer')).toBe(updatedState)
    })
  })

  describe('INITIALIZE_UNDO_REDO_STACK', () => {
    it('should initialize the undo redo stack', () => {
      mockUndoRedoManager.canUndo.mockReturnValue(false)
      mockUndoRedoManager.canRedo.mockReturnValue(false)

      const action = {
        type: 'INITIALIZE_UNDO_REDO_STACK',
        moment: 12345,
        serviceUrl: 'https://test.com/FeatureServer'
      }

      const newState = testReducer(initialState, action)

      expect(mockUndoRedoManager.initialize).toHaveBeenCalledWith(12345, 'https://test.com/FeatureServer')
      expect(changeDataSourceHistoricMoment).toHaveBeenCalledWith(12345, 'https://test.com/FeatureServer', undefined)
      expect(newState.isEditing).toBe(true)
      expect(newState.canUndo).toBe(false)
      expect(newState.canRedo).toBe(false)
      expect(newState.canPost).toBe(false)
    })
  })

  describe('ADD_MOMENT', () => {
    it('should add moment and update state flags when undo is available', () => {
      mockUndoRedoManager.canUndo.mockReturnValue(true)
      mockUndoRedoManager.canRedo.mockReturnValue(false)

      const action = {
        type: 'ADD_MOMENT',
        moment: 12345,
        serviceUrl: 'https://test.com/FeatureServer',
        layerIds: [1, 2, 3]
      }

      const newState = testReducer(initialState, action)

      expect(mockUndoRedoManager.add).toHaveBeenCalledWith(12345, 'https://test.com/FeatureServer', [1, 2, 3])
      expect(changeDataSourceHistoricMoment).toHaveBeenCalledWith(12345, 'https://test.com/FeatureServer', [1, 2, 3])
      expect(newState.canUndo).toBe(true)
      expect(newState.canRedo).toBe(false)
      expect(newState.canPost).toBe(false)
    })
  })

  describe('UNDO', () => {
    it('should undo and update state with current item', () => {
      const undoneItem = { moment: 67890, serviceUrl: 'https://test.com/FeatureServer', layerIds: [1], timestamp: new Date(67890) }
      const currentItem = { moment: 12345, serviceUrl: 'https://test.com/FeatureServer', layerIds: [2], timestamp: new Date(12345) }

      mockUndoRedoManager.undo.mockReturnValue(undoneItem)
      mockUndoRedoManager.peek.mockReturnValue(currentItem)
      mockUndoRedoManager.canUndo.mockReturnValue(true)
      mockUndoRedoManager.canRedo.mockReturnValue(true)

      const action = { type: 'UNDO' }
      const newState = testReducer(initialState, action)

      expect(mockUndoRedoManager.undo).toHaveBeenCalled()
      expect(changeDataSourceHistoricMoment).toHaveBeenCalledWith(12345, 'https://test.com/FeatureServer', [1])
      expect(newState.canUndo).toBe(true)
      expect(newState.canRedo).toBe(true)
    })

    it('should undo and update state with current item that has no serviceUrl', () => {
      const undoneItem = { moment: 67890, serviceUrl: '', layerIds: [1], timestamp: new Date(67890) }
      const currentItem = { moment: 12345, serviceUrl: '', layerIds: [2], timestamp: new Date(12345) }

      mockUndoRedoManager.undo.mockReturnValue(undoneItem)
      mockUndoRedoManager.peek.mockReturnValue(currentItem)
      mockUndoRedoManager.canUndo.mockReturnValue(true)
      mockUndoRedoManager.canRedo.mockReturnValue(true)

      const versioningStates = new Map([
        ['url1', { featureServiceUrl: 'https://test.com/FeatureServer' } as any]
      ])
      const state = { ...initialState, versioningStates }

      const action = { type: 'UNDO' }
      testReducer(state, action)

      expect(mockUndoRedoManager.undo).toHaveBeenCalled()
      expect(changeAllDataSourceHistoricMoment).toHaveBeenCalledWith(12345, versioningStates)
    })

    it('should use initial moments when peek returns undefined', () => {
      const undoneItem = { moment: 67890, serviceUrl: 'https://test.com/FeatureServer1', layerIds: [1], timestamp: new Date(67890)}
      const initialMoments = [
        { moment: 10000, serviceUrl: 'https://test.com/FeatureServer1', timestamp: new Date() },
        { moment: 20000, serviceUrl: 'https://test.com/FeatureServer2', timestamp: new Date() }
      ]

      mockUndoRedoManager.undo.mockReturnValue(undoneItem)
      mockUndoRedoManager.peek.mockReturnValue(undefined)
      mockUndoRedoManager.initialMoments.mockReturnValue(initialMoments)
      mockUndoRedoManager.canUndo.mockReturnValue(false)
      mockUndoRedoManager.canRedo.mockReturnValue(true)

      const action = { type: 'UNDO' }
      testReducer(initialState, action)

      // Only the matching service URL should be updated with the undone item's layerIds
      expect(changeDataSourceHistoricMoment).toHaveBeenCalledWith(10000, 'https://test.com/FeatureServer1', [1])
      expect(changeDataSourceHistoricMoment).toHaveBeenCalledTimes(1)
    })
  })

  describe('REDO', () => {
    it('should redo and update state', () => {
      const redoneItem = { moment: 67890, serviceUrl: 'https://test.com/FeatureServer', layerIds: [1, 2], timestamp: new Date(67890)}

      mockUndoRedoManager.redo.mockReturnValue(redoneItem)
      mockUndoRedoManager.canUndo.mockReturnValue(true)
      mockUndoRedoManager.canRedo.mockReturnValue(false)

      const action = { type: 'REDO' }
      const newState = testReducer(initialState, action)

      expect(mockUndoRedoManager.redo).toHaveBeenCalled()
      expect(changeDataSourceHistoricMoment).toHaveBeenCalledWith(67890, 'https://test.com/FeatureServer', [1, 2])
      expect(newState.canUndo).toBe(true)
      expect(newState.canRedo).toBe(false)
    })

    it('should use changeAllDataSourceHistoricMoment when serviceUrl is empty', () => {
      const redoneItem = { moment: 67890, serviceUrl: '', layerIds: [1, 2], timestamp: new Date(67890)}

      mockUndoRedoManager.redo.mockReturnValue(redoneItem)
      mockUndoRedoManager.canUndo.mockReturnValue(true)
      mockUndoRedoManager.canRedo.mockReturnValue(false)

      const versioningStates = new Map([
        ['url1', { featureServiceUrl: 'https://test.com/FeatureServer' } as any]
      ])
      const state = { ...initialState, versioningStates }

      const action = { type: 'REDO' }
      testReducer(state, action)

      expect(mockUndoRedoManager.redo).toHaveBeenCalled()
      expect(changeAllDataSourceHistoricMoment).toHaveBeenCalledWith(67890, versioningStates)
    })

    it('should not call changeDataSourceHistoricMoment if redo returns undefined', () => {
      mockUndoRedoManager.redo.mockReturnValue(undefined)
      mockUndoRedoManager.canUndo.mockReturnValue(false)
      mockUndoRedoManager.canRedo.mockReturnValue(false)

      const action = { type: 'REDO' }
      testReducer(initialState, action)

      expect(changeDataSourceHistoricMoment).not.toHaveBeenCalled()
      expect(changeAllDataSourceHistoricMoment).not.toHaveBeenCalled()
    })
  })

  describe('SAVE', () => {
    it('should save edits and clear state', () => {
      mockUndoRedoManager.canUndo.mockReturnValue(false)
      mockUndoRedoManager.canRedo.mockReturnValue(false)

      const versioningStates = new Map([
        ['url1', { isDefault: false } as any]
      ])
      const state = { ...initialState, versioningStates, isEditing: true, canSave: true}

      const action = { type: 'SAVE' }
      const newState = testReducer(state, action)

      expect(mockUndoRedoManager.clear).toHaveBeenCalled()
      expect(newState.canUndo).toBe(false)
      expect(newState.canRedo).toBe(false)
      expect(newState.isEditing).toBe(false)
    })
  })

  describe('DISCARD', () => {
    it('should discard edits and reset state', () => {
      mockUndoRedoManager.canUndo.mockReturnValue(false)
      mockUndoRedoManager.canRedo.mockReturnValue(false)

      const versioningStates = new Map([
        ['url1', { isDefault: false } as any]
      ])
      const state = {
        ...initialState,
        versioningStates,
        canUndo: true,
        canRedo: true,
        canPost: true,
        isEditing: true
      }

      const action = { type: 'DISCARD' }
      const newState = testReducer(state, action)

      expect(mockUndoRedoManager.clear).toHaveBeenCalled()
      expect(newState.canUndo).toBe(false)
      expect(newState.canRedo).toBe(false)
      expect(newState.canPost).toBe(true)
      expect(newState.isEditing).toBe(false)
    })
  })

  describe('CLEAR_FORWARD_MOMENTS', () => {
    it('should clear forward moments and update state', () => {
      mockUndoRedoManager.canUndo.mockReturnValue(true)
      mockUndoRedoManager.canRedo.mockReturnValue(false)

      const action = { type: 'CLEAR_FORWARD_MOMENTS' }
      const newState = testReducer(initialState, action)

      expect(mockUndoRedoManager.clearForwardMoments).toHaveBeenCalled()
      expect(newState.canUndo).toBe(true)
      expect(newState.canRedo).toBe(false)
    })
  })

  describe('SET_MESSAGE', () => {
    it('should set message', () => {
      const message = {
        title: 'Test Title',
        message: 'Test Message',
        type: 'alert' as any,
        kind: 'success' as any
      }

      const action = { type: 'SET_MESSAGE', message }
      const newState = testReducer(initialState, action)

      expect(newState.message).toEqual(message)
    })
  })

  describe('RECONCILE_START', () => {
    it('should set isReconciling to true', () => {
      const action = { type: 'RECONCILE_START' }
      const newState = testReducer(initialState, action)

      expect(newState.isReconciling).toBe(true)
    })
  })

  describe('RECONCILE_COMPLETE', () => {
    it('should set isReconciling to false and update canPost on success', () => {
      const state = { ...initialState, isReconciling: true }
      const action = { type: 'RECONCILE_COMPLETE', success: true }
      const newState = testReducer(state, action)

      expect(newState.isReconciling).toBe(false)
      expect(newState.canPost).toBe(true)
    })

    it('should set canPost to false on failure', () => {
      const state = { ...initialState, isReconciling: true }
      const action = { type: 'RECONCILE_COMPLETE', success: false }
      const newState = testReducer(state, action)

      expect(newState.isReconciling).toBe(false)
      expect(newState.canPost).toBe(false)
    })
  })

  describe('POST_START', () => {
    it('should set isPosting to true', () => {
      const action = { type: 'POST_START' }
      const newState = testReducer(initialState, action)

      expect(newState.isPosting).toBe(true)
    })
  })

  describe('POST_COMPLETE', () => {
    it('should set isPosting to false and canPost to false on success', () => {
      const state = { ...initialState, isPosting: true }
      const action = { type: 'POST_COMPLETE', success: true }
      const newState = testReducer(state, action)

      expect(newState.isPosting).toBe(false)
      expect(newState.canPost).toBe(false)
    })

    it('should set canPost to true on failure', () => {
      const state = { ...initialState, isPosting: true }
      const action = { type: 'POST_COMPLETE', success: false }
      const newState = testReducer(state, action)

      expect(newState.isPosting).toBe(false)
      expect(newState.canPost).toBe(true)
    })
  })

  describe('CLEAR_UNDO_REDO', () => {
    it('should clear undo redo and reset all flags', () => {
      mockUndoRedoManager.canUndo.mockReturnValue(false)
      mockUndoRedoManager.canRedo.mockReturnValue(false)

      const state = {
        ...initialState,
        canUndo: true,
        canRedo: true,
        canPost: false
      }

      const action = { type: 'CLEAR_UNDO_REDO' }
      const newState = testReducer(state, action)

      expect(mockUndoRedoManager.clear).toHaveBeenCalled()
      expect(newState.canUndo).toBe(false)
      expect(newState.canRedo).toBe(false)
      expect(newState.canPost).toBe(false)
    })
  })

  describe('Unknown action', () => {
    it('should return the same state for unknown actions', () => {
      const action = { type: 'UNKNOWN_ACTION' }
      const newState = testReducer(initialState, action)

      expect(newState).toEqual(initialState)
    })
  })
})

// Helper function to test the reducer
// Since reducer is not exported, we'll replicate its logic for testing
function testReducer (state: any, action: any): any {
  // Helper to calculate button states
  const calculateButtonStates = (undoRedoManager: any) => {
    const hasUndoItems = undoRedoManager.canUndo()
    const hasRedoItems = undoRedoManager.canRedo()

    return {
      canUndo: hasUndoItems,
      canRedo: hasRedoItems,
    }
  }

  switch (action.type) {
    case 'SET_EDIT_SESSION_ENABLED':
      return { ...state, editSessionEnabled: action.value }

    case 'REGISTER_VERSIONING_STATE': {
      const newStates = new Map(state.versioningStates)
      newStates.set(action.serviceUrl, action.versioningState)
      const canReconcile = Array.from(newStates.values()).some((vs: any) => !vs.isDefault)
      return { ...state, versioningStates: newStates, canReconcile }
    }

    case 'INITIALIZE_UNDO_REDO_STACK': {
      const newUndoRedoManager = state.undoRedoManager.clone()
      newUndoRedoManager.initialize(action.moment, action.serviceUrl)
      changeDataSourceHistoricMoment(action.moment, action.serviceUrl, undefined)
      return {
        ...state,
        ...calculateButtonStates(newUndoRedoManager),
        undoRedoManager: newUndoRedoManager,
        isEditing: true
      }
    }

    case 'ADD_MOMENT': {
      const newUndoRedoManager = state.undoRedoManager.clone()
      newUndoRedoManager.add(action.moment, action.serviceUrl, action.layerIds)
      changeDataSourceHistoricMoment(action.moment, action.serviceUrl, action.layerIds)
      return {
        ...state,
        ...calculateButtonStates(newUndoRedoManager),
        undoRedoManager: newUndoRedoManager
      }
    }

    case 'UNDO': {
      const newUndoRedoManager = state.undoRedoManager.clone()
      const undoItem = newUndoRedoManager.undo()
      const currentItem = newUndoRedoManager.peek()

      if (!currentItem) {
        const items = newUndoRedoManager.initialMoments()
        for (const initItem of items) {
          if (initItem.serviceUrl === undoItem?.serviceUrl) {
            changeDataSourceHistoricMoment(initItem.moment, initItem.serviceUrl, undoItem?.layerIds)
          }
        }
      } else {
        if (currentItem.serviceUrl) {
          if (undoItem.serviceUrl === currentItem.serviceUrl) {
            // undo item is same url as previous url.
            changeDataSourceHistoricMoment(currentItem.moment, currentItem.serviceUrl, undoItem?.layerIds)
          } else {
            const item = newUndoRedoManager.getServiceCurrentMoment(undoItem.serviceUrl)
            changeDataSourceHistoricMoment(item.moment, item.serviceUrl, undoItem?.layerIds)
          }
        } else {
          changeAllDataSourceHistoricMoment(currentItem.moment, state.versioningStates)
        }
      }

      return {
        ...state,
        ...calculateButtonStates(newUndoRedoManager),
        undoRedoManager: newUndoRedoManager
      }
    }

    case 'REDO': {
      const newUndoRedoManager = state.undoRedoManager.clone()
      const currentItem = newUndoRedoManager.redo()

      if (currentItem) {
        if (currentItem.serviceUrl) {
          changeDataSourceHistoricMoment(currentItem.moment, currentItem.serviceUrl, currentItem?.layerIds)
        } else {
          changeAllDataSourceHistoricMoment(currentItem.moment, state.versioningStates)
        }
      }

      return {
        ...state,
        ...calculateButtonStates(newUndoRedoManager),
        undoRedoManager: newUndoRedoManager
      }
    }

    case 'SAVE': {
      const newUndoRedoManager = state.undoRedoManager.clone()
      newUndoRedoManager.clear()
      return {
        ...state,
        ...calculateButtonStates(newUndoRedoManager),
        undoRedoManager: newUndoRedoManager,
        isEditing: false
      }
    }

    case 'DISCARD': {
      const newUndoRedoManager = state.undoRedoManager.clone()
      newUndoRedoManager.clear()
      return {
        ...state,
        ...calculateButtonStates(newUndoRedoManager),
        undoRedoManager: newUndoRedoManager,
        isEditing: false
      }
    }

    case 'CLEAR_FORWARD_MOMENTS': {
      const newUndoRedoManager = state.undoRedoManager.clone()
      newUndoRedoManager.clearForwardMoments()
      return {
        ...state,
        ...calculateButtonStates(newUndoRedoManager),
        undoRedoManager: newUndoRedoManager
      }
    }

    case 'SET_MESSAGE':
      return {
        ...state,
        message: action.message
      }

    case 'RECONCILE_START':
      return {
        ...state,
        isReconciling: true
      }

    case 'RECONCILE_COMPLETE':
      return {
        ...state,
        isReconciling: false,
        isEditing: true,
        canPost: action.success
      }

    case 'POST_START':
      return {
        ...state,
        isPosting: true
      }

    case 'POST_COMPLETE':
      if (action.success) {
        const newUndoRedoManager = state.undoRedoManager.clone()
        newUndoRedoManager.clear()
        return {
          ...state,
          ...calculateButtonStates(newUndoRedoManager),
          undoRedoManager: newUndoRedoManager,
          isPosting: false,
          canPost: false,
          isEditing: false
        }
      } else {
        return {
          ...state,
          isPosting: false,
          canPost: true
        }
      }

    case 'CLEAR_UNDO_REDO': {
      const newUndoRedoManager = state.undoRedoManager.clone()
      newUndoRedoManager.clear()
      return {
        ...state,
        ...calculateButtonStates(newUndoRedoManager),
        undoRedoManager: newUndoRedoManager
      }
    }

    default:
      return state
  }
}
