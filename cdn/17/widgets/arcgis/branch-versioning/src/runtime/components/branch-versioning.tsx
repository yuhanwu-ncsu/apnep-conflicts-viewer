/** @jsx jsx */
import { React, type AllWidgetProps, jsx, getAppStore, hooks } from 'jimu-core'
import type { IMConfig } from '../../config'
import { DisplayType, VersioningStateEventType } from '../../config'
import { type JimuMapView, JimuMapViewComponent } from 'jimu-arcgis'
import { Paper, WidgetPlaceholder } from 'jimu-ui'
import { FloatingActionBar } from './floating-action-bar'
import { ActionBar } from './action-bar'
import { changeDataSourceVersion, changeDefaultVersion, getServiceName, loadVersionManagementVersioningStates, getServiceVersions } from '../utils/utils'
import defaultMessages from '../translations/default'
import iconSBR from '../../../icon.svg'
import { useBranchVersioningActions, useBranchVersioningState } from '../context/state/branch-versioning-context'
import { MessageDialog } from './message-dialog'
import { MessageAlert } from './message-alert'
import { getShellPanelStyle, getScrimStyle, getVersionManagementComponentStyle } from '../lib/style'
import 'calcite-components'
import 'arcgis-map-components'

// Configure asset path for arcgis-map-components at module level (runs once)
if (typeof window !== 'undefined' && (window as any).jimuConfig?.mapComponentsUrl) {
  import('@arcgis/map-components/dist/loader').then(({ defineCustomElements }) => {
    const mapComponentsUrl = (window as any).jimuConfig.mapComponentsUrl
    defineCustomElements(window, { resourcesUrl: mapComponentsUrl })
  }).catch((error) => {
    console.error('Failed to configure arcgis-map-components:', error)
  })
}

export const BranchVersioning = (props: AllWidgetProps<IMConfig>) => {
  const { config, id } = props
  const { manageVersionsEnabled, editSessionsEnabled, editToolBar } = config

  const [jimuMapView, setJimuMapView] = React.useState<JimuMapView>(null)
  const [view, setView] = React.useState<__esri.MapView>(null)
  const [urlStartUpVersion, setUrlStartUpVersion] = React.useState<{[dsId: string]: string}>({})
  const [showDefaultVersionNotice, setShowDefaultVersionNotice] = React.useState<boolean>(false)
  const [error, setError] = React.useState<string | null>(null)

  const vmsRef = React.useRef(null)
  const isFloating = config.editToolBar?.displayType === DisplayType.FLOATING
  const actions = useBranchVersioningActions()
  const state = useBranchVersioningState()
  const getI18nMessage = hooks.useTranslation(defaultMessages)

  // listen for window close or refresh. Notifies user if edits are not saved.
  React.useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (state.editSessionEnabled && state.isEditing) {
        event.preventDefault()
        event.returnValue = ''
      } else if (state.editSessionEnabled) {
        actions.cleanupEditSessionInterceptor()
      }
    }
    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload)
    }
  }, [actions, getI18nMessage, state.editSessionEnabled, state.isEditing])

  // Handle versioning state changes from the arcgis-version-management component
  const handleVersioningStateStateChanged = React.useCallback((event: CustomEvent) => {
    // We only need to listen for version switch events
    if (event.detail.type === VersioningStateEventType.SWITCHED) {
      if (event.detail && event.detail.versionIdentifier) {
        const versionName = event.detail.versionIdentifier.name
        const serviceUrl = event.detail.versioningState.featureServiceUrl || ''
        changeDataSourceVersion(versionName, serviceUrl)
      }
    }
    // Register or update versioning state in context
    const versioningState = event.detail.versioningState as __esri.VersioningState
    actions.registerVersioningState(versioningState.featureServiceUrl, versioningState)
  }, [actions])

  // Attach event listener to versioning state changes
  React.useEffect(() => {
    const vms = vmsRef.current
    if (vms) {
      vms.addEventListener('arcgisVersioningStateChanged', handleVersioningStateStateChanged)
      return () => {
        vms.removeEventListener('arcgisVersioningStateChanged', handleVersioningStateStateChanged)
      }
    }
  }, [handleVersioningStateStateChanged])

  // Read URL parameters on startup. Each service version is specified as serviceName:versionName
  // We can't use datasource id since a single web map can have multiple services configured.
  React.useEffect(() => {
    const queryObject = getAppStore().getState().queryObject
    if (queryObject?.data_version) {
      const urlVerStringList = queryObject.data_version
      const urlVerList = urlVerStringList.split(',')
      const startUpVersions: {[serviceName: string]: string} = {}
      urlVerList.forEach((ver) => {
        const delimiter = ':'
        const parts = ver.split(delimiter)
        const serviceName = parts.shift()
        const versionPart = parts.join(delimiter)
        startUpVersions[serviceName] = versionPart
      })
      setUrlStartUpVersion(startUpVersions)
    }
  }, [])

  // Switch to default versions when view and component are ready.
  React.useEffect(() => {
    const switchToDefaultVersions = async () => {
      if (!view || !vmsRef.current) {
        return
      }
      try {
        // Load versioning states from the arcgis-version-management component.
        const versionState = await loadVersionManagementVersioningStates()

        // Update version for each service. Updates both the versioning state and the data source.
        // The default version for each service can either be the service default version, a version
        // specified in the URL parameters, or a service configured in the settings.
        if (versionState) {
          for (const vs of versionState) {
            const serviceName = getServiceName(vs.featureServiceUrl) || ''
            const urlProvidedVersion = urlStartUpVersion[serviceName] || ''
            const updatedVs = await changeDefaultVersion(config, urlProvidedVersion, vs)

            // Register updated versioning state
            actions.registerVersioningState(updatedVs.featureServiceUrl, updatedVs)
          }

          // Set state based on config
          actions.setEditSessionEnabled(editSessionsEnabled || false)
          actions.setShowSaveDialog(config.editToolBar.showDialogOnSave)
          actions.setShowDiscardDialog(config.editToolBar.showDialogOnDiscard)

          // Get service versions from layer definitions and store in context
          const serviceVersions = getServiceVersions()
          actions.setServiceVersions(serviceVersions)
        }
      } catch (error) {
        setError((error as Error)?.message)
      }
    }

    switchToDefaultVersions()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [view, jimuMapView, config, urlStartUpVersion])

  // Setup edit session interceptor when edit sessions are enabled
  React.useEffect(() => {
    if (state.editSessionEnabled && !state.editSessionManager.isInterceptorInstalled()) {
      actions.setupEditSessionInterceptor()
    }

    return () => {
      if (state.editSessionManager.isInterceptorInstalled()) {
        actions.cleanupEditSessionInterceptor()
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.editSessionEnabled])

  // Update active view. Will trigger version loading effect
  const onActiveViewChange = (activeView: JimuMapView) => {
    if (!activeView) {
      return
    }
    setJimuMapView(activeView)
    setView(activeView.view as __esri.MapView)
  }

  // Checks if any default versions are selected
  const hasDefaultVersionSelected = React.useMemo(() => {
    if (state.versioningStates.size === 0) {
      return false
    }
    const hasDefaultsSelected = Array.from(state.versioningStates.values()).some((vs: __esri.VersioningState) => vs.isDefault)
    if (hasDefaultsSelected) {
      setShowDefaultVersionNotice(true)
    }
    return hasDefaultsSelected
  }, [state.versioningStates])

  // Display placeholder if no map selected
  if (!props.useMapWidgetIds || props.useMapWidgetIds.length === 0) {
    return (
      <WidgetPlaceholder icon={iconSBR} message={getI18nMessage('_widgetLabel')}/>
    )
  }

  return (
    <Paper
      className='widget-branch-versioning d-flex flex-column w-100 h-100'
      variant='flat'
    >
      <JimuMapViewComponent
        onActiveViewChange={onActiveViewChange}
        useMapWidgetId={props.useMapWidgetIds[0]}
      />

      {state.versioningStates.size === 0 && (
        <WidgetPlaceholder icon={iconSBR} message={getI18nMessage('_widgetLabel')}/>
      )}

      {/* Render floating action bar outside CalciteShell if floating mode */}
      {isFloating && editSessionsEnabled && (
        <FloatingActionBar
          widgetId={id}
          config={config}
        />
      )}

      <calcite-shell className="branch-versioning-shell w-100 h-100">
        <calcite-shell-panel
          className="w-100 h-100 d-flex flex-column"
          slot={config.editToolBar.dockedPosition}
          layout={editToolBar?.layoutType}
          display-mode="dock"
          css={getShellPanelStyle()}
        >
          {!isFloating && editSessionsEnabled && (
            <ActionBar
              config={config}
              className="action-bar-container"
            />
          )}
          <calcite-panel className="branch-versioning-panel w-100 flex-1">
            <div className="pad-contents w-100 h-auto pt-2 pb-2" style={{overflow: 'hidden'}}>
              {state.isEditing && (
                <calcite-scrim
                  css={getScrimStyle()}
                ></calcite-scrim>
              )}
              {hasDefaultVersionSelected && editSessionsEnabled && (
                <calcite-notice
                  className='pl-2 pr-2'
                  open={showDefaultVersionNotice}
                  oncalciteNoticeClose={() => { setShowDefaultVersionNotice(false) }}
                  kind="info"
                  icon='information'
                  closable
                  scale='s'
                >
                  <span slot="message">{getI18nMessage('defaultVersionsInUseMessage')}</span>
                </calcite-notice>
              )}
              {error && (
                <calcite-notice
                  className='pl-2 pr-2'
                  open={true}
                  closable={false}
                  kind="danger"
                  icon='exclamation-mark-triangle'
                  scale='s'
                >
                  <span slot="message">{error}</span>
                </calcite-notice>
              )}
              <arcgis-version-management
                ref={vmsRef}
                view={view}
                mode="dialog"
                allowEditingDisabled={!manageVersionsEnabled || state.isEditing}
                onarcgisVersioningStateChanged={(e) => { handleVersioningStateStateChanged(e) }}
                css={getVersionManagementComponentStyle()}
              />
            </div>
          </calcite-panel>
        </calcite-shell-panel>
      </calcite-shell>
      <MessageDialog/>
      <MessageAlert/>
    </Paper>
  )
}