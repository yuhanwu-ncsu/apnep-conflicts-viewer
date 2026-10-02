import { loadArcGISJSAPIModule } from 'jimu-core'
import { getApplyEditsType, getFeatureServiceApplyEditsResults, getFeatureServiceLayerApplyEditsResults, getLrsApplyEditsResults, normalizeServiceUrl } from '../../utils/utils'
import type { BranchVersioningState } from '../state/branch-versioning-context'
import { ApplyEditType, type EditResult } from '../../../config'
import type { InterceptorActions } from '../hooks/use-branch-versioning-actions'

type DetectionType = 'by-object' | 'by-attribute'

export interface VersionOperationResult {
  versionName: string
  success: boolean
  moment: number | string | null
  hasConflicts?: boolean
  error?: string
  url?: string
}

export interface OperationResults {
  results: VersionOperationResult[]
  versioningStates: Map<string, __esri.VersioningState>
  allSuccessful: boolean
}

export interface requestResult {
  versioningStates?: Map<string, __esri.VersioningState>
  success: boolean
  error?: string
}

/**
 * Manages edit session interceptor and session state for version management
 */
export class EditSessionManager {
  private interceptorInstalled: boolean = false
  private sessionId: string | null = null
  private esriRequest: typeof __esri.request | null = null
  private esriConfig: typeof __esri.config | null = null

  /**
   * Check if interceptor is installed
   */
  isInterceptorInstalled (): boolean {
    return this.interceptorInstalled
  }

  /**
   * Lazy load esri/request module
   */
  private async getEsriRequest (): Promise<typeof __esri.request> {
    if (!this.esriRequest) {
      this.esriRequest = await loadArcGISJSAPIModule('esri/request')
    }
    return this.esriRequest
  }

  /**
   * Lazy load esri/config module
   */
  private async getEsriConfig (): Promise<typeof __esri.config> {
    if (!this.esriConfig) {
      this.esriConfig = await loadArcGISJSAPIModule('esri/config')
    }
    return this.esriConfig
  }

  /**
   * Get non-default versions that are in lock-write state (actively editing)
   * @param versioningStates Map of versioning states to check
   * @returns Array of versioning states that are actively being edited
   */
  private getEditableVersions (versioningStates: Map<string, __esri.VersioningState>): __esri.VersioningState[] {
    return Array.from(versioningStates.values()).filter(
      vs => !vs.isDefault && vs.state === 'lock-write'
    )
  }

  /**
   * Get non-default versions that are not in lock-write state
   * @param versioningStates Map of versioning states to check
   * @returns Array of versioning states that are not actively being edited
   */
  private getNonEditingVersions (versioningStates: Map<string, __esri.VersioningState>): __esri.VersioningState[] {
    return Array.from(versioningStates.values()).filter(
      vs => !vs.isDefault && vs.state !== 'lock-write'
    )
  }

  /**
   * Checks if the current edit is on the default version for a given service URL
   * @param versioningStates Map of versioning states to check
   * @param url Service URL to check against
   * @returns True if the current edit is on the default version for the given service URL, false otherwise
   */
  private isEditOnDefault (versioningStates: Map<string, __esri.VersioningState>, url: string): boolean {
    return Array.from(versioningStates.values()).some(
      versioningState => versioningState.featureServiceUrl === url && versioningState.isDefault
    )
  }

  /**
   * Delete forward edits for a specific version
   * @param url Service URL of the version
   * @param moment Historic moment to delete forward edits from
   * @returns True if the forward edits were successfully deleted, false otherwise
   */
  private async deleteForwardEdits (
    moment: number | string,
    versioningState: __esri.VersioningState
  ): Promise<requestResult> {

    if (!this.sessionId) {
      return { success: false, error: 'No session ID available' }
    }

    if (!versioningState) {
      return { success: false, error: 'No versioning state provided' }
    }

    if (!moment) {
      return { success: false, error: 'No moment provided' }
    }

    const esriRequest = await this.getEsriRequest()

    // Params
    const params = {
      sessionId: this.sessionId,
      moment,
      f: 'json'
    }

    // Construct the delete forward edits URL
    const currentVersion = versioningState.currentVersionInfo
    if (!currentVersion?.versionIdentifier?.guid) {
      return { success: false, error: 'Invalid version identifier' }
    }

    const url = versioningState.url
    const guid = currentVersion.versionIdentifier.guid.replace(/{|}/g, '')
    const vmsUrl = `${url}/versions/${guid}/deleteForwardEdits`

    // Request options
    const options = {
      query: params,
      method: 'post'
    } as __esri.RequestOptions

    try {
      const response = await esriRequest(vmsUrl, options)
      if (response?.data?.success) {
        return { success: true }
      } else {
        return { success: false, error: response?.data?.error?.message || 'Unknown error' }
      }
    } catch (error) {
      return { success: false, error: error?.message ? error.message : 'Unknown error' }
    }
  }

  /**
   * Start editing sessions for all non-default versioning states
   * @param versioningStates Map of versioning states to start editing
   * @returns Request result indicating success or failure with updated versioning states
   */
  private async startEditSession (versioningStates: Map<string, __esri.VersioningState>): Promise<requestResult> {
    try {
      // Start editing sessions for all non-default versioning states
      const promises: Array<Promise<any>> = this.getNonEditingVersions(versioningStates).map(vs =>
        vs.startEditing()
      )

      // Get and check the results
      const results = await Promise.all(promises)
      for (const res of results) {
        if (!res.success) {
          // If any of the start editing operations failed, return an error
          return { versioningStates, success: false, error: res.error ? res.error.message : 'Unknown error' }
        }
      }

      // Good to go
      return { versioningStates, success: true }
    } catch (error) {
      return { versioningStates, success: false, error: error?.message ? error.message : 'Unknown error' }
    }
  }

  /**
   * Stop editing sessions for all non-default versioning states
   * @param versioningStates Map of versioning states to stop editing
   * @param save Whether to save changes before stopping the session
   * @returns Request result indicating success or failure
   */
  async stopEditSession (versioningStates: Map<string, __esri.VersioningState>, save: boolean): Promise<requestResult> {
    try {
      const promises: Array<Promise<any>> = this.getEditableVersions(versioningStates).map(vs =>
        vs.stopEditing(save)
      )

      const results = await Promise.all(promises)
      for (const res of results) {
        if (!res.success) {
          return { versioningStates, success: false, error: res.error ? res.error.message : 'Unknown error' }
        }
      }
      return { versioningStates, success: true }
    } catch (error) {
      return { versioningStates, success: false, error: error?.message ? error.message : 'Unknown error' }
    }
  }

  /**
   * Execute version operation (reconcile or post) for all editable versions
   */
  private async executeVersionOperation (
    versioningStates: Map<string, __esri.VersioningState>,
    operation: 'reconcile' | 'post'
  ): Promise<OperationResults> {
    const results: VersionOperationResult[] = []

    try {
      // Start editing sessions if not already started
      const startEditingResults = await this.startEditSession(versioningStates)
      if (!startEditingResults.success) {
        return {
          results: [{
            success: false,
            error: startEditingResults.error,
            versionName: '',
            moment: ''
          }],
          versioningStates,
          allSuccessful: false
        }
      }

      // Collect all versioning states that need to be processed
      const editableVersions = this.getEditableVersions(versioningStates)
      const statesToProcess = editableVersions.map(state => ({
        state,
        version: state.currentVersionInfo.versionIdentifier
      }))

      // Ensure version management services is loaded
      await Promise.all(
        statesToProcess.map(({ state }) => state.versionManagementService.load())
      )

      // Execute operations and collect results
      for (const { state, version } of statesToProcess) {
        try {
          if (operation === 'reconcile') {
            const params = {
              abortIfConflicts: true,
              conflictDetection: 'by-attribute' as DetectionType,
              withPost: false
            }
            const result = await state.versionManagementService.reconcile(version, params)
            results.push({
              url: state.featureServiceUrl,
              versionName: version.name,
              success: !result.hasConflicts,
              hasConflicts: result.hasConflicts,
              moment: result.moment.getTime()
            })
          } else {
            const result = await state.versionManagementService.post(version)
            results.push({
              url: state.featureServiceUrl,
              versionName: version.name,
              success: result.success,
              moment: result.moment ? result.moment.getTime() : null
            })
          }
        } catch (error) {
          const errorMessage = error?.message ? error.message : 'Unknown error'
          results.push({
            url: state.featureServiceUrl,
            versionName: version.name,
            success: false,
            error: errorMessage,
            moment: null
          })
        }
      }

      const allSuccessful = results.every(r => r.success)
      return { results, versioningStates, allSuccessful }
    } catch (error) {
      return { results, versioningStates, allSuccessful: false }
    }
  }

  /**
   * Reconcile all non-default versioning states
   * @param versioningStates Map of versioning states to reconcile
   */
  async reconcile (versioningStates: Map<string, __esri.VersioningState>): Promise<OperationResults> {
      return this.executeVersionOperation(versioningStates, 'reconcile')
  }

  /**
   * Post all non-default versioning states
   * @param versioningStates Map of versioning states to post
   */
  async post (versioningStates: Map<string, __esri.VersioningState>): Promise<OperationResults> {
    return this.executeVersionOperation(versioningStates, 'post')
  }

  /**
   * Set up the esri request interceptor for edit sessions
   * @param getState Function to get current branch versioning state
   * @param actions Branch versioning actions
   */
  async setupInterceptor (
    getState: () => BranchVersioningState,
    actions: InterceptorActions
  ): Promise<void> {
    const state = getState()
    if (this.interceptorInstalled || !state.editSessionEnabled) {
      return
    }

    const esriConfig = await this.getEsriConfig()
    const vmsInterceptor = {
      urls: [/(startEditing|applyEdits)/i],
      before: async (request: any) => {
        const isStartEditing = /startEditing/i.test(request.url)
        const isApplyEdits = /applyEdits/i.test(request.url)
        const state = getState()

        // Only proceed if edit sessions are enabled.
        if (!state.editSessionEnabled) {
          return
        }

        // Capture session ID from startEditing response.
        if (isStartEditing) {
          if (request?.requestOptions?.query?.sessionId) {
            this.sessionId = request.requestOptions.query.sessionId
          }
        }

        // ApplyEdit call. Supports Feature Service, Feature Service Layer, and LRS formats.
        if (isApplyEdits) {
          try {
            const featureServiceUrl = normalizeServiceUrl(request.url)

            // Add null check for versioning state
            const versioningState = state.versioningStates.get(featureServiceUrl)
            if (!versioningState) {
              return
            }

            // Bail if this is an edit to a default version
            if (this.isEditOnDefault(state.versioningStates, featureServiceUrl)) {
              return
            }

            // Start edit session if not already started
            if (!state.isEditing) {
              const startEditingResults = await this.startEditSession(state.versioningStates)
              if (!startEditingResults.success) {
                throw new Error(startEditingResults.error)
              }

              // Update versioning states
              for (const vs of startEditingResults.versioningStates) {
                actions.registerVersioningState(vs[0], vs[1])
              }
            }

            // Delete forward edits if we can redo (user made edits after undo)
            if (state.canRedo) {
              // Get all initial moments (one per service)
              const initialMoments = state.undoRedoManager.initialMoments()

              // For each service, delete forward edits from its most current moment
              for (const initMoment of initialMoments) {
                // Find the most current historic moment for this service
                const currentMoment = state.undoRedoManager.getServiceCurrentMoment(initMoment.serviceUrl)
                if (!currentMoment) {
                  continue
                }

                // Get the versioning state for this service
                const serviceVersioningState = state.versioningStates.get(initMoment.serviceUrl)
                if (!serviceVersioningState) {
                  continue
                }

                // Delete forward edits for this service
                const deleteResult = await this.deleteForwardEdits(
                  currentMoment.moment,
                  serviceVersioningState
                )
                if (!deleteResult.success) {
                  throw new Error(deleteResult.error)
                }
              }

              actions.clearForwardMoments()
            }

            // Attach the session ID to the request if available
            if (this.sessionId) {
              request.requestOptions.query.sessionId = this.sessionId
              request.requestOptions.query.returnEditMoment = true
              request.requestOptions.query.returnServiceEditsOption = 'originalAndCurrentFeatures'
            }
          } catch (error) {
            throw new Error(error?.message ? error.message : 'Failed to start editing session')
          }
        }
      },
      after: (response: any) => {
        const isStartEditing = /startEditing/i.test(response.url)
        const isApplyEdits = /applyEdits/i.test(response.url)
        const state = getState()
        const normalizedUrl = normalizeServiceUrl(response.url)

        // Only proceed if edit sessions are enabled.
        if (!state.editSessionEnabled) {
          return
        }

        // Start editing response. Initialize undo/redo stack with current moment..
        if (isStartEditing) {
          if (response?.data?.success === true) {
            const moment = response.data.moment
            actions.initializeUndoRedoStack(moment, normalizedUrl)
          }
        }

        // ApplyEdits response.
        if (isApplyEdits && response?.data) {
          const applyEditsType = getApplyEditsType(response.url)
          let editResults: EditResult

          // If edit is on the default version, nothing is added to the undo/redo stack
          if (this.isEditOnDefault(state.versioningStates, normalizedUrl)) {
            return
          }

          // Extract layer ids that were edited. This allows us to selectively refresh only
          // those layers during undo/redo operations.
          if (applyEditsType === ApplyEditType.LRS) {
            editResults = getLrsApplyEditsResults(response)
          }
          else if (applyEditsType === ApplyEditType.SERVICE) {
            editResults = getFeatureServiceApplyEditsResults(response)
          } else if (applyEditsType === ApplyEditType.LAYER) {
            editResults = getFeatureServiceLayerApplyEditsResults(response)
          }

          // Add to undo/redo stack
          if (editResults) {
            actions.addMoment(editResults.moment, normalizedUrl, editResults.layerIds)
          }
        }
      }
    }

    esriConfig.request.interceptors.splice(0, 0, vmsInterceptor)
    this.interceptorInstalled = true
  }

  /**
   * Clean up the interceptor
   */
  async cleanupInterceptor (): Promise<void> {
    if (!this.interceptorInstalled) {
      return
    }

    this.interceptorInstalled = false
    const esriConfig = await this.getEsriConfig()
    const index = esriConfig.request.interceptors.findIndex(
      (i: any) => i.urls && i.urls.some((u: RegExp) => u.toString().includes('startEditing') || u.toString().includes('applyEdits'))
    )

    if (index > -1) {
      esriConfig.request.interceptors.splice(index, 1)
    }
  }
}
