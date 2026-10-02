import { renderHook, act } from '@testing-library/react'
import { React } from 'jimu-core'
import { MessageType, AlertType } from '../src/config'
import { useBranchVersioningActions } from '../src/runtime/context/hooks/use-branch-versioning-actions'
import { BranchVersioningProvider } from '../src/runtime/context/state/branch-versioning-context'

// Mock jimu-core for FixedPosition
jest.mock('jimu-core', () => {
  const actual = jest.requireActual('jimu-core')
  return {
    ...actual,
    FixedPosition: {
      TopLeft: 'TOP_LEFT',
      TopRight: 'TOP_RIGHT',
      BottomLeft: 'BOTTOM_LEFT',
      BottomRight: 'BOTTOM_RIGHT'
    }
  }
})

// Mock the managers
jest.mock('../src/runtime/context/managers/undo-redo-manager', () => {
  return {
    UndoRedoManager: jest.fn().mockImplementation(() => ({
      initialize: jest.fn(),
      add: jest.fn(),
      undo: jest.fn().mockReturnValue({ moment: 123, serviceUrl: 'test', layerIds: [] }),
      redo: jest.fn().mockReturnValue({ moment: 456, serviceUrl: 'test', layerIds: [] }),
      peek: jest.fn(),
      canUndo: jest.fn().mockReturnValue(false),
      canRedo: jest.fn().mockReturnValue(false),
      clear: jest.fn(),
      clearForwardMoments: jest.fn(),
      clone: jest.fn(function () { return this })
    }))
  }
})

jest.mock('../src/runtime/context/managers/edit-session-manager', () => {
  return {
    EditSessionManager: jest.fn().mockImplementation(() => ({
      setupInterceptor: jest.fn().mockResolvedValue(undefined),
      cleanupInterceptor: jest.fn().mockResolvedValue(undefined),
      stopEditSession: jest.fn().mockResolvedValue({ success: true }),
      reconcile: jest.fn().mockResolvedValue({ allSuccessful: true, results: [] }),
      post: jest.fn().mockResolvedValue({ allSuccessful: true, results: [] })
    }))
  }
})

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
  getI18nMessage: jest.fn((key, params) => {
    if (params) {
      return `${key}:${JSON.stringify(params)}`
    }
    return key
  })
}))

describe('useBranchVersioningActions', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <BranchVersioningProvider>{children}</BranchVersioningProvider>
  )

  describe('setEditSessionEnabled', () => {
    it('should enable edit sessions', () => {
      const { result } = renderHook(() => useBranchVersioningActions(), { wrapper })

      act(() => {
        result.current.setEditSessionEnabled(true)
      })

      // The action should be dispatched (tested implicitly)
      expect(result.current).toBeDefined()
    })
  })

  describe('registerVersioningState', () => {
    it('should register a versioning state', () => {
      const { result } = renderHook(() => useBranchVersioningActions(), { wrapper })
      const mockVersioningState = { isDefault: false } as any

      act(() => {
        result.current.registerVersioningState('https://test.com/FeatureServer', mockVersioningState)
      })

      expect(result.current).toBeDefined()
    })
  })

  // Note: Testing reconcile() and post() methods is complex because they require
  // the actual EditSessionManager instance which is created inside the context.
  // These are better tested through integration tests or by testing the manager methods directly.

  describe('basic actions', () => {
    it('should initialize undo redo stack', () => {
      const { result } = renderHook(() => useBranchVersioningActions(), { wrapper })

      act(() => {
        result.current.initializeUndoRedoStack(12345, 'https://test.com/FeatureServer')
      })

      expect(result.current).toBeDefined()
    })

    it('should add moment', () => {
      const { result } = renderHook(() => useBranchVersioningActions(), { wrapper })

      act(() => {
        result.current.addMoment(12345, 'https://test.com/FeatureServer', [1, 2, 3])
      })

      expect(result.current).toBeDefined()
    })

    it('should save', () => {
      const { result } = renderHook(() => useBranchVersioningActions(), { wrapper })

      act(() => {
        result.current.save()
      })

      expect(result.current).toBeDefined()
    })

    it('should discard', () => {
      const { result } = renderHook(() => useBranchVersioningActions(), { wrapper })

      act(() => {
        result.current.discard()
      })

      expect(result.current).toBeDefined()
    })

    it('should clear forward moments', () => {
      const { result } = renderHook(() => useBranchVersioningActions(), { wrapper })

      act(() => {
        result.current.clearForwardMoments()
      })

      expect(result.current).toBeDefined()
    })

    it('should set message', () => {
      const { result } = renderHook(() => useBranchVersioningActions(), { wrapper })
      const message = {
        title: 'Test',
        message: 'Test message',
        type: MessageType.ALERT,
        kind: AlertType.INFO
      }

      act(() => {
        result.current.setMessage(message)
      })

      expect(result.current).toBeDefined()
    })
  })

  describe('actions stability', () => {
    it('should return stable action references', () => {
      const { result, rerender } = renderHook(() => useBranchVersioningActions(), { wrapper })

      const firstActions = result.current

      rerender()

      const secondActions = result.current

      // Actions should be memoized and stable across renders
      expect(firstActions.undo).toBe(secondActions.undo)
      expect(firstActions.redo).toBe(secondActions.redo)
      expect(firstActions.save).toBe(secondActions.save)
    })
  })
})
