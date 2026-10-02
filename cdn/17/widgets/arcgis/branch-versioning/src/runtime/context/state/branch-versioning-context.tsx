import { React } from 'jimu-core'
import { UndoRedoManager } from '../managers/undo-redo-manager'
import { EditSessionManager } from '../managers/edit-session-manager'
import { changeAllDataSourceHistoricMoment, changeDataSourceHistoricMoment, buildEmptyMessage } from '../../utils/utils'
import type { MessageParams } from '../../../config'

export { useBranchVersioningActions, type BranchVersioningActions } from '../hooks/use-branch-versioning-actions'

export interface BranchVersioningState {
  canUndo: boolean
  canRedo: boolean
  canReconcile: boolean
  canPost: boolean
  canSave: boolean
  canDiscard: boolean
  isReconciling: boolean
  isPosting: boolean
  isEditing: boolean
  showSaveDialog: boolean
  showDiscardDialog: boolean
  editSessionEnabled: boolean
  message: MessageParams
  undoRedoManager: UndoRedoManager
  editSessionManager: EditSessionManager
  versioningStates: Map<string, __esri.VersioningState>
  serviceVersions: Map<string, number>
}

const initialState: BranchVersioningState = {
  canUndo: false,
  canRedo: false,
  canReconcile: false,
  canPost: false,
  canSave: false,
  canDiscard: false,
  isReconciling: false,
  isPosting: false,
  editSessionEnabled: false,
  isEditing: false,
  showSaveDialog: false,
  showDiscardDialog: false,
  message: buildEmptyMessage(),
  undoRedoManager: new UndoRedoManager(),
  editSessionManager: new EditSessionManager(),
  versioningStates: new Map(),
  serviceVersions: new Map(),
}

type BranchVersioningAction =
  | { type: 'SET_EDIT_SESSION_ENABLED'; value: boolean }
  | { type: 'REGISTER_VERSIONING_STATE'; serviceUrl: string; versioningState: __esri.VersioningState }
  | { type: 'INITIALIZE_UNDO_REDO_STACK'; moment: number | string; serviceUrl: string }
  | { type: 'ADD_MOMENT'; moment: number | string; serviceUrl: string; layerIds: number[] }
  | { type: 'UNDO' }
  | { type: 'REDO' }
  | { type: 'SAVE' }
  | { type: 'DISCARD' }
  | { type: 'CLEAR_FORWARD_MOMENTS' }
  | { type: 'SET_SHOW_SAVE_DIALOG'; value: boolean }
  | { type: 'SET_SHOW_DISCARD_DIALOG'; value: boolean }
  | { type: 'SET_MESSAGE'; message: MessageParams }
  | { type: 'RECONCILE_START' }
  | { type: 'RECONCILE_COMPLETE'; success: boolean }
  | { type: 'POST_START' }
  | { type: 'POST_COMPLETE'; success: boolean }
  | { type: 'CLEAR_UNDO_REDO' }
  | { type: 'SET_SERVICE_VERSIONS'; serviceVersions: Map<string, number> }

const BranchVersioningStateContext = React.createContext<BranchVersioningState | undefined>(undefined)
const BranchVersioningDispatchContext = React.createContext<React.Dispatch<BranchVersioningAction> | undefined>(undefined)

interface BranchVersioningProviderProps {
  children: React.ReactNode
}

export const BranchVersioningProvider = (props: BranchVersioningProviderProps) => {
  const { children } = props

  const [state, dispatch] = React.useReducer(reducer, initialState)

  return (
    <BranchVersioningStateContext.Provider value={state}>
      <BranchVersioningDispatchContext.Provider value={dispatch}>
        {children}
      </BranchVersioningDispatchContext.Provider>
    </BranchVersioningStateContext.Provider>
  )
}

export const useBranchVersioningState = () => {
  const context = React.useContext(BranchVersioningStateContext)
  if (context === undefined) {
    throw new Error('useBranchVersioningState must be used within a BranchVersioningProvider')
  }
  return context
}

export const useBranchVersioningDispatch = () => {
  const context = React.useContext(BranchVersioningDispatchContext)
  if (context === undefined) {
    throw new Error('useBranchVersioningDispatch must be used within a BranchVersioningProvider')
  }
  return context
}

/**
 * Calculate button states based on undo/redo manager state
 */
const calculateButtonStates = (undoRedoManager: UndoRedoManager) => {
  const hasUndoItems = undoRedoManager.canUndo()
  const hasRedoItems = undoRedoManager.canRedo()

  return {
    canUndo: hasUndoItems,
    canRedo: hasRedoItems,
  }
}

// Reducer function to handle state updates
const reducer = (state: BranchVersioningState, action: BranchVersioningAction) => {
  switch (action.type) {
    case 'SET_EDIT_SESSION_ENABLED':
      return { ...state, editSessionEnabled: action.value }

    case 'REGISTER_VERSIONING_STATE': {
      const newStates = new Map(state.versioningStates)
      newStates.set(action.serviceUrl, action.versioningState)
      const canReconcile = Array.from(newStates.values()).some(vs => !vs.isDefault)
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
        isEditing: true,
        canSave: true,
        canDiscard: true
      }
    }

    case 'ADD_MOMENT': {
      const newUndoRedoManager = state.undoRedoManager.clone()
      newUndoRedoManager.add(action.moment, action.serviceUrl, action.layerIds)
      changeDataSourceHistoricMoment(action.moment, action.serviceUrl, action.layerIds)
      return {
        ...state,
        ...calculateButtonStates(newUndoRedoManager),
        undoRedoManager: newUndoRedoManager,
        canSave: true,
        canDiscard: true,
        canPost: false
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
        isEditing: false,
        canSave: false,
        canDiscard: false
      }
    }

    case 'DISCARD': {
      const newUndoRedoManager = state.undoRedoManager.clone()
      newUndoRedoManager.clear()
      return {
        ...state,
        ...calculateButtonStates(newUndoRedoManager),
        undoRedoManager: newUndoRedoManager,
        isEditing: false,
        canSave: false,
        canDiscard: false
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

    case 'SET_SHOW_SAVE_DIALOG':
      return {
        ...state,
        showSaveDialog: action.value
      }

    case 'SET_SHOW_DISCARD_DIALOG':
      return {
        ...state,
        showDiscardDialog: action.value
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
      if (action.success) {
        const newUndoRedoManager = state.undoRedoManager.clone()
        newUndoRedoManager.clear()

        // Check if any service is version 12.0 or earlier
        // Version 12.1+: Reconcile saves edits automatically, so disable save/discard but keep edit session active
        // Version 12.0 or earlier: Keep save/discard enabled after reconcile
        let hasLegacyVersion = false
        for (const [serviceUrl] of state.versioningStates) {
          const version = state.serviceVersions.get(serviceUrl)
          if (version !== undefined && version <= 12.0) {
            hasLegacyVersion = true
            break
          }
        }

        return {
          ...state,
          ...calculateButtonStates(newUndoRedoManager),
          undoRedoManager: newUndoRedoManager,
          isReconciling: false,
          isEditing: true,
          canSave: hasLegacyVersion,
          canDiscard: hasLegacyVersion,
          canPost: true
        }
      } else {
        return {
          ...state,
          isReconciling: false,
          isEditing: true,
          canSave: true,
          canDiscard: true,
          canPost: false
        }
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
          isEditing: false,
          canSave: false,
          canDiscard: false
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

    case 'SET_SERVICE_VERSIONS':
      return {
        ...state,
        serviceVersions: action.serviceVersions
      }
  }
}