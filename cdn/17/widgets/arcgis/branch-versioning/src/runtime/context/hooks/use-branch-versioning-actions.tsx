import { React } from 'jimu-core'
import { buildMessage, changeAllDataSourceHistoricMoment, changeDataSourceHistoricMoment, getI18nMessage } from '../../utils/utils'
import { AlertType, MessageType, type MessageParams } from '../../../config'
import { useBranchVersioningState, useBranchVersioningDispatch } from '../state/branch-versioning-context'
import type { VersionOperationResult } from '../managers/edit-session-manager'

export interface InterceptorActions {
  initializeUndoRedoStack: (moment: number | string, serviceUrl: string) => void
  addMoment: (moment: number | string, serviceUrl: string, layerIds?: number[]) => void
  clearForwardMoments: () => void
  registerVersioningState: (serviceUrl: string, versioningState: __esri.VersioningState) => void
}

export interface BranchVersioningActions {
  setEditSessionEnabled: (enabled: boolean) => void
  registerVersioningState: (serviceUrl: string, versioningState: __esri.VersioningState) => void
  initializeUndoRedoStack: (moment: number | string, serviceUrl: string) => void
  addMoment: (moment: number | string, serviceUrl?: string, layerIds?: number[]) => void
  undo: () => void
  redo: () => void
  save: () => Promise<void>
  discard: () => Promise<void>
  reconcile: () => Promise<void>
  post: () => Promise<void>
  clearForwardMoments: () => void
  setShowSaveDialog: (value: boolean) => void
  setShowDiscardDialog: (value: boolean) => void
  setMessage: (message: MessageParams) => void
  setupEditSessionInterceptor: () => Promise<void>
  cleanupEditSessionInterceptor: () => Promise<void>
  setServiceVersions: (serviceVersions: Map<string, number>) => void
}

/**
 * Build reconcile result message
 */
const buildReconcileMessage = (
  allSuccessful: boolean,
  results: VersionOperationResult[]
): { title: string; message: string; type: MessageType; kind?: AlertType } => {
  if (allSuccessful) {
    return {
      title: getI18nMessage('reconcileLabel'),
      message: getI18nMessage('reconcileComplete'),
      type: MessageType.RECONCILE_NO_ERROR
    }
  }

  const failedResults = results.filter(r => !r.success)
  const title = getI18nMessage('reconcileLabel')

  let message = ''
  failedResults.forEach(r => {
    message += getI18nMessage('reconcileConflictDetails', {
      versionName: r.versionName,
      conflictDetails: r.error || getI18nMessage('reconcileConflicts')
    }) + '\n'
  })

  message += '\n' + getI18nMessage('reconcileContactAdmin')

  return { title, message, type: MessageType.RECONCILE_ERROR }
}

/**
 * Build post result message
 */
const buildPostMessage = (
  allSuccessful: boolean,
  results: VersionOperationResult[]
): { title: string; message: string; type: MessageType; kind: AlertType } => {
  const title = getI18nMessage('postLabel')

  if (allSuccessful) {
    return {
      title,
      message: getI18nMessage('postSuccess'),
      type: MessageType.ALERT,
      kind: AlertType.SUCCESS
    }
  }

  const failedResults = results.filter(r => !r.success)
  const message = failedResults
    .map(r => getI18nMessage('postErrorDetails', {
      versionName: r.versionName,
      errorMessage: r.error ?? 'Unknown error'
    }))
    .join('\n')

  return {
    title,
    message,
    type: MessageType.ALERT,
    kind: AlertType.DANGER
  }
}

// Hook to access branch versioning actions
export const useBranchVersioningActions = (): BranchVersioningActions => {
  const state = useBranchVersioningState()
  const dispatch = useBranchVersioningDispatch()

  // Use a ref to always get the current state
  const stateRef = React.useRef(state)
  React.useEffect(() => {
    stateRef.current = state
  }, [state])

  return React.useMemo(() => ({
    setEditSessionEnabled: (enabled: boolean) => {
      dispatch({ type: 'SET_EDIT_SESSION_ENABLED', value: enabled })
    },

    registerVersioningState: (serviceUrl: string, versioningState: __esri.VersioningState) => {
      dispatch({ type: 'REGISTER_VERSIONING_STATE', serviceUrl, versioningState })
    },

    initializeUndoRedoStack: (moment: number | string, serviceUrl: string) => {
      dispatch({ type: 'INITIALIZE_UNDO_REDO_STACK', moment, serviceUrl })
    },

    addMoment: (moment: number | string, serviceUrl?: string, layerIds?: number[]) => {
      dispatch({ type: 'ADD_MOMENT', moment, serviceUrl, layerIds })
    },

    undo: () => {
      dispatch({ type: 'UNDO' })
    },

    redo: () => {
      dispatch({ type: 'REDO' })
    },

    save: async () => {
      try {
        const result = await state.editSessionManager.stopEditSession(state.versioningStates, true)
        if (!result.success) {
          dispatch({
            type: 'SET_MESSAGE',
            message: {
              title: getI18nMessage('saveLabel'),
              type: MessageType.ALERT,
              kind: AlertType.DANGER,
              message: result.error || 'Failed to save changes'
            }
          })
          return
        }
        changeAllDataSourceHistoricMoment('', state.versioningStates)
        dispatch({ type: 'SAVE' })
        dispatch({
          type: 'SET_MESSAGE',
          message: {
            title: getI18nMessage('saveLabel'),
            type: MessageType.ALERT,
            kind: AlertType.SUCCESS,
            message: getI18nMessage('saveSuccess')
          }
        })
      } catch (error) {
        dispatch({
          type: 'SET_MESSAGE',
          message: {
            title: getI18nMessage('saveLabel'),
            type: MessageType.ALERT,
            kind: AlertType.DANGER,
            message: error?.message || 'Failed to save changes'
          }
        })
      }
    },

    discard: async () => {
      try {
        const result = await state.editSessionManager.stopEditSession(state.versioningStates, false)
        if (!result.success) {
          dispatch({
            type: 'SET_MESSAGE',
            message: {
              title: getI18nMessage('discardLabel'),
              type: MessageType.ALERT,
              kind: AlertType.DANGER,
              message: result.error || 'Failed to discard changes'
            }
          })
          return
        }
        changeAllDataSourceHistoricMoment('', state.versioningStates)
        dispatch({ type: 'DISCARD' })
        dispatch({
          type: 'SET_MESSAGE',
          message: {
            title: getI18nMessage('discardLabel'),
            type: MessageType.ALERT,
            kind: AlertType.SUCCESS,
            message: getI18nMessage('discardSuccess')
          }
        })
      } catch (error) {
        dispatch({
          type: 'SET_MESSAGE',
          message: {
            title: getI18nMessage('discardLabel'),
            type: MessageType.ALERT,
            kind: AlertType.DANGER,
            message: error?.message || 'Failed to discard changes'
          }
        })
      }
    },

    reconcile: async () => {
      dispatch({ type: 'RECONCILE_START' })
      try {
        const operationResults = await state.editSessionManager.reconcile(state.versioningStates)

        // Check if any reconcile operations took place
        if (operationResults.results.length === 0) {
          dispatch({
            type: 'SET_MESSAGE',
            message: buildMessage(
              getI18nMessage('reconcileLabel'),
              getI18nMessage('noVersionsToReconcile'),
              MessageType.ALERT,
              AlertType.INFO
            )
          })
          dispatch({ type: 'RECONCILE_COMPLETE', success: false })
          return
        }

        // Build and dispatch message
        const messageParams = buildReconcileMessage(
          operationResults.allSuccessful,
          operationResults.results
        )
        dispatch({
          type: 'SET_MESSAGE',
          message: buildMessage(
            messageParams.title,
            messageParams.message,
            messageParams.type,
            messageParams.kind
          )
        })

        // Update reconcile date on each successfully reconciled version
        operationResults.results.forEach(r => {
          if (r.success) {
            const entry = Array.from(operationResults.versioningStates.entries()).find(([, v]) => {
              return v.featureServiceUrl === r.url
            })

            if (entry) {
              const [serviceUrl, vs] = entry
              vs.currentVersionInfo.reconcileDate = r.moment as number
              dispatch({ type: 'REGISTER_VERSIONING_STATE', serviceUrl, versioningState: vs })
              changeDataSourceHistoricMoment(r.moment, vs.featureServiceUrl, [], true)
            }
          }
        })

        dispatch({ type: 'RECONCILE_COMPLETE', success: operationResults.allSuccessful })
      } catch (error) {
        const message = buildMessage(
          getI18nMessage('reconcileLabel'),
          error instanceof Error ? error.message : 'An error occurred during reconcile. Please try again.',
          MessageType.ALERT,
          AlertType.DANGER
        )
        dispatch({ type: 'SET_MESSAGE', message })
        dispatch({ type: 'RECONCILE_COMPLETE', success: false })
      }
    },

    post: async () => {
      dispatch({ type: 'POST_START' })
      try {
        const operationResults = await state.editSessionManager.post(state.versioningStates)

        // Check if any post operations took place
        if (operationResults.results.length === 0) {
          dispatch({
            type: 'SET_MESSAGE',
            message: buildMessage(
              getI18nMessage('postLabel'),
              getI18nMessage('noVersionsToPost'),
              MessageType.ALERT,
              AlertType.INFO
            )
          })
          dispatch({ type: 'POST_COMPLETE', success: false })
          return
        }

        if (operationResults.allSuccessful) {
          const result = await state.editSessionManager.stopEditSession(state.versioningStates, false)
          if (!result.success) {
            dispatch({
              type: 'SET_MESSAGE',
              message: {
                title: getI18nMessage('saveLabel'),
                type: MessageType.ALERT,
                kind: AlertType.DANGER,
                message: result.error || 'Failed to save changes'
              }
            })
            return
          }
          changeAllDataSourceHistoricMoment('', state.versioningStates)
        }

        // Build and dispatch message
        const messageParams = buildPostMessage(
          operationResults.allSuccessful,
          operationResults.results
        )
        dispatch({
          type: 'SET_MESSAGE',
          message: buildMessage(
            messageParams.title,
            messageParams.message,
            messageParams.type,
            messageParams.kind
          )
        })

        dispatch({ type: 'POST_COMPLETE', success: operationResults.allSuccessful })
      } catch (error) {
        dispatch({
          type: 'SET_MESSAGE',
          message: buildMessage(
            getI18nMessage('postLabel'),
            error instanceof Error ? error.message : 'An error occurred during post. Please try again.',
            MessageType.ALERT,
            AlertType.DANGER
          )
        })
        dispatch({ type: 'POST_COMPLETE', success: false })
      }
    },

    clearForwardMoments: () => {
      dispatch({ type: 'CLEAR_FORWARD_MOMENTS' })
    },

    setShowSaveDialog: (value: boolean) => {
      dispatch({ type: 'SET_SHOW_SAVE_DIALOG', value })
    },

    setShowDiscardDialog: (value: boolean) => {
      dispatch({ type: 'SET_SHOW_DISCARD_DIALOG', value })
    },

    setMessage: (message: MessageParams) => {
      dispatch({ type: 'SET_MESSAGE', message })
    },

    setupEditSessionInterceptor: async () => {
      const interceptorActions: InterceptorActions = {
        initializeUndoRedoStack: (moment: number | string, serviceUrl: string) => {
          dispatch({ type: 'INITIALIZE_UNDO_REDO_STACK', moment, serviceUrl })
        },
        addMoment: (moment: number | string, serviceUrl: string, layerIds?: number[]) => {
          dispatch({ type: 'ADD_MOMENT', moment, serviceUrl, layerIds })
        },
        clearForwardMoments: () => {
          dispatch({ type: 'CLEAR_FORWARD_MOMENTS' })
        },
        registerVersioningState: (serviceUrl: string, versioningState: __esri.VersioningState) => {
          dispatch({ type: 'REGISTER_VERSIONING_STATE', serviceUrl, versioningState })
        }
      }
      await state.editSessionManager.setupInterceptor(() => stateRef.current, interceptorActions)
    },

    cleanupEditSessionInterceptor: async () => {
      await state.editSessionManager.cleanupInterceptor()
    },

    setServiceVersions: (serviceVersions: Map<string, number>) => {
      dispatch({ type: 'SET_SERVICE_VERSIONS', serviceVersions })
    }
  }), [dispatch, state, stateRef])
}
