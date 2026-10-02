import { React, type FixedPositionSizeJson, Immutable, loadArcGISJSAPIModule } from 'jimu-core'
import type { AllWidgetSettingProps } from 'jimu-for-builder'
import { MapWidgetSelector, SettingSection, SettingRow } from 'jimu-ui/advanced/setting-components'
import { Switch, Label, Select, Option, Loading, LoadingType, CollapsablePanel, hooks, defaultMessages as jimuUIDefaultMessages, Tooltip, Button, Checkbox } from 'jimu-ui'
import type { CalciteScale, IMConfig, VersionInfos, DockedPosition } from '../config'
import { DEFAULT_FLOATING_LAYOUT_STYLE, DisplayType, LayoutType } from '../config'
import { type JimuMapView, JimuMapViewComponent } from 'jimu-arcgis'
import type WebMap from 'esri/WebMap'
import type { VersionIdentifier, VersionInfo } from 'esri/versionManagement/support/jsonTypes'
import type Collection from 'esri/core/Collection'
import { FixedPositionSize } from 'jimu-ui/advanced/style-setting-components'
import { SERVICE_NAME_REGEX, SCALE_OPTIONS, DISPLAY_TYPE_OPTIONS, DOCK_POSITION_OPTIONS, LAYOUT_TYPE_OPTIONS } from '../constants'
import defaultMessages from './translations/default'
import { InfoOutlined } from 'jimu-icons/outlined/suggested/info'

export default function Setting (props: AllWidgetSettingProps<IMConfig>) {
  const { config, id, useMapWidgetIds } = props
  const { defaultVersions, manageVersionsEnabled, editSessionsEnabled, editToolBar } = config
  const [services, setServices] = React.useState<VersionInfos[]>([])
  const [loading, setLoading] = React.useState<boolean>(false)
  const [jimuMapViews, setJimuMapViews] = React.useState<JimuMapView[]>([])
  const [defaultVersionIdentifiers, setDefaultVersionIdentifiers] = React.useState<{ [key: string]: VersionIdentifier }>({})
  const getI18nMessage = hooks.useTranslate(defaultMessages, jimuUIDefaultMessages)

  // Helper to update props
  const updateProps = React.useCallback((key: string, value: any) => {
    props.onSettingChange({
      id: id,
      config: config.set(key, value)
    })
  }, [config, id, props])

  // Handle map widget selection
  const onMapSelect = (useMapWidgetIds: string[]) => {
    props.onSettingChange({
      id: id,
      useMapWidgetIds
    })
  }

  // Load services and their versions when map widget is selected
  React.useEffect(() => {
    const loadServicesAndVersions = async () => {
      if (!useMapWidgetIds?.length || jimuMapViews.length === 0) {
        setServices([])
        return
      }

      setLoading(true)
      try {
        const defaultVersionIdentifiers: { [key: string]: VersionIdentifier } = {}
        const serviceInfos: VersionInfos[] = []
        const utils = await loadArcGISJSAPIModule('esri/versionManagement/utils')

        // Iterate through each map view to get versioned services
        for (const jimuMapView of jimuMapViews) {
          if (!jimuMapView?.view) continue

          const webMap = jimuMapView.view.map as WebMap
          const versioningStates: Collection<__esri.VersioningState> = await utils.createVersioningStates(webMap, false)

          for (const versioningState of versioningStates) {
            try {
              await versioningState.load()
              const fullUrl = versioningState.featureServiceUrl
              const serviceName = fullUrl.match(SERVICE_NAME_REGEX)?.[1] || fullUrl
              const versionInfo: VersionInfo[] = await versioningState.getVersionInfos(true)
              const versions = versionInfo.map(info => info.versionIdentifier)
              const defaultVersion = versioningState.defaultVersionIdentifier

              defaultVersionIdentifiers[serviceName] = versioningState.defaultVersionIdentifier
              serviceInfos.push({ serviceName, default: defaultVersion, versionIdentifiers: versions })
            } catch (error) {
              continue
            }
          }
        }
        setDefaultVersionIdentifiers(defaultVersionIdentifiers)
        setServices(serviceInfos)
      } catch (error) {
        setServices([])
      } finally {
        setLoading(false)
      }
    }

    loadServicesAndVersions()
  }, [jimuMapViews, useMapWidgetIds])

  // Initialize default versions in config if not set
  React.useEffect(() => {
    if (Object.keys(defaultVersionIdentifiers).length === 0) return

    const existingDefaults = defaultVersions || {}
    const updatedDefaultVersions: { [key: string]: VersionIdentifier } = { ...existingDefaults }
    let hasChanges = false

    // Only add defaults for services that don't have a configured version yet
    Object.keys(defaultVersionIdentifiers).forEach((key) => {
      if (!existingDefaults[key]) {
        updatedDefaultVersions[key] = defaultVersionIdentifiers[key]
        hasChanges = true
      }
    })

    if (hasChanges) {
      updateProps('defaultVersions', updatedDefaultVersions)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultVersionIdentifiers])

  // Handle service version change
  const onServiceVersionChange = (serviceName: string, versionName: string) => {
    const updatedDefaultVersions: { [key: string]: VersionIdentifier } = { ... (defaultVersions || {}) }
    const versionInfos = services.find((service) => service.serviceName === serviceName)
    const versionInfo = versionInfos?.versionIdentifiers.find((v) => v.name === versionName)

    if (!versionInfo) return

    if (versionName) {
      updatedDefaultVersions[serviceName] = versionInfo
    } else {
      updatedDefaultVersions[serviceName] = versionInfos.default
    }

    updateProps('defaultVersions', updatedDefaultVersions)
  }

  // Get the selected version for a service
  const getSelectedVersion = (serviceName: string): string => {
    if (!defaultVersions) return ''
    const versionInfo = defaultVersions[serviceName]
    return versionInfo?.name || ''
  }

  // Handle toggle button click
  const onToggleButton = (buttonKey: string) => {
    if (buttonKey === 'manageVersionsEnabled') {
      updateProps('manageVersionsEnabled', !manageVersionsEnabled)
    }
    else if (buttonKey === 'editSessionsEnabled') {
      updateProps('editSessionsEnabled', !editSessionsEnabled)
    }
    else {
      const updateEditToolBar = editToolBar.asMutable({ deep: true })
      updateEditToolBar[buttonKey] = !updateEditToolBar[buttonKey]
      if (!updateEditToolBar.saveEnabled) {
        updateEditToolBar.discardEnabled = false
        updateEditToolBar.undoEnabled = false
        updateEditToolBar.redoEnabled = false
      }
      if (!updateEditToolBar.undoEnabled) {
        updateEditToolBar.redoEnabled = false
      }
      if (!updateEditToolBar.reconcileEnabled) {
        updateEditToolBar.postEnabled = false
      }
      updateProps('editToolBar', { ...updateEditToolBar })
    }
  }

  // Helper to update edit toolbar properties
  const updateEditToolBar = (updates: Partial<typeof editToolBar>) => {
    const updateEditToolBar = editToolBar || {}
    updateProps('editToolBar', { ...updateEditToolBar, ...updates })
  }

  // Handle scale change
  const onScaleChange = (value: CalciteScale) => { updateEditToolBar({ scale: value }) }

  // Handle display type change
  const onDisplayTypeChange = (value: string) => { updateEditToolBar({ displayType: value as DisplayType }) }

  // Handle dock position change
  const onDockPositionChange = (value: string) => {
    const layoutType = value === 'panel-top' || value === 'panel-bottom'
      ? LayoutType.HORIZONTAL
      : LayoutType.VERTICAL

    updateEditToolBar({ dockedPosition: value as DockedPosition, layoutType })
  }

  // Handle layout type change
  const onLayoutTypeChange = (value: string) => {
    if (editToolBar?.displayType === DisplayType.FLOATING) {
      // Swap width and height for floating layout change
      const floatingPanelJson = editToolBar?.floatingPanelJson?.asMutable({ deep: true })
      const currentWidth = floatingPanelJson?.width
      const currentHeight = floatingPanelJson?.height
      floatingPanelJson.width = currentHeight
      floatingPanelJson.height = currentWidth
      updateEditToolBar({ layoutType: value as LayoutType, floatingPanelJson: Immutable(floatingPanelJson) })
    } else {
      updateEditToolBar({ layoutType: value as LayoutType })
    }
  }

  // Handle floating panel position change
  const onFloatingPositionChange = (fixedPositionSizeJson: Immutable.ImmutableObject<FixedPositionSizeJson>) => {
    updateEditToolBar({ floatingPanelJson: fixedPositionSizeJson })
  }

  // Initialize map views
  const initializeMapViews = async (views: { [viewId: string]: JimuMapView }) => {
    const viewArr = Object.values(views)
    const promises = viewArr.map(async (jimuMapView) => {
      await jimuMapView.whenJimuMapViewLoaded()
      await jimuMapView.whenAllJimuLayerViewLoaded()
    })
    await Promise.allSettled(promises)
    return viewArr
  }

  // Handle map view creation
  const onViewsCreate = React.useCallback(
    async (views: { [viewId: string]: JimuMapView }) => {
      setJimuMapViews([])
      const viewArr = await initializeMapViews(views)
      setJimuMapViews(viewArr)
    }, []
  )

  // Render loading indicator for services versions
  const renderLoader = () => {
    return (
      <SettingRow aria-label={getI18nMessage('loadingLabel')} >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ position: 'relative', width: '16px', height: '16px' }}>
            <Loading type={LoadingType.Donut} width={16} height={16} />
          </div>
          <Label className="label3" centric>{getI18nMessage('loadingLabel')}</Label>
        </div>
      </SettingRow>
    )
  }

  // Render error message for no map widget selected or no versioned services found
  const renderError = (message: string) => {
    return (
      <SettingRow aria-label={message} >
        <Label>{message}</Label>
      </SettingRow>
    )
  }

  // Render default versions for each service
  const renderDefaultVersions = () => {
    return services.map((service) => (
      <SettingRow key={service.serviceName} flow='wrap' label={service.serviceName} aria-label={service.serviceName} >
        <Select
          value={getSelectedVersion(service.serviceName)}
          onChange={(e) => { onServiceVersionChange(service.serviceName, e.target.value) }}
          placeholder={getI18nMessage('selectDefaultVersion')}
          style={{ width: '100%' }}
          aria-label={`${getI18nMessage('selectDefaultVersion')} ${getI18nMessage('for')} ${service.serviceName}`}
        >
          {renderVersionOptions(service)}
        </Select>
      </SettingRow>
    ))
  }

  // Render version options for a service
  const renderVersionOptions = (service: VersionInfos) => {
    return service.versionIdentifiers.map((version) => (
      <Option key={version.name} value={version.name}>
        {version.name}
      </Option>
    ))
  }

  // Render a switch with optional tooltip
  const renderSwitch = (label: string, checked: boolean, prop: string, tooltip?: string) => {
    return (
      <SettingRow flow='no-wrap' label={label } aria-label={label}>
        <Switch
          aria-label={label}
          checked={checked}
          onChange={() => { onToggleButton(prop) }}
          title={label}
        />
        {tooltip && (
          <Tooltip
            enterDelay={100}
            enterNextDelay={0}
            enterTouchDelay={700}
            leaveDelay={0}
            leaveTouchDelay={1500}
            offsetOptions={4}
            placement="auto"
            role="tooltip"
            title={getI18nMessage(tooltip)}>
            <Button
              icon
              variant="text"
              aria-label={label}>
               <InfoOutlined />
            </Button>
          </Tooltip>
        )}
      </SettingRow>
    )
  }

  const renderCheckBox = (label: string, value: boolean, prop: string) => {
    return (
      <SettingRow flow='no-wrap' aria-label={label}>
        <Label centric check>
          <Checkbox
            checked={value}
            className="mr-2"
            onChange={(e) => { onToggleButton(prop) }}
          />
          {label}
        </Label>
      </SettingRow>
    )
  }

  const renderSelect = (
    label: string,
    value: string | CalciteScale,
    options: ReadonlyArray<{ label?: string, labelKey?: string, value: string | number | CalciteScale }>,
    onChange: (value: any) => void
  ) => {
    return (
      <SettingRow flow="wrap" label={label} aria-label={label} role='group'>
        <Select
          value={String(value)}
          onChange={(e) => { onChange(e.target.value) }}
          aria-label={label}
        >
          {options.map(opt => (
            <Option key={String(opt.value)} value={String(opt.value)}>
              {opt.labelKey ? getI18nMessage(opt.labelKey) : (opt.label ?? String(opt.value))}
            </Option>
          ))}
        </Select>
      </SettingRow>
    )
  }

  const versionedServicesAvailable = React.useMemo(() => {
    return !loading && services.length > 0
  }, [loading, services])

  return (
    <div className="m-2">
      <SettingSection title={getI18nMessage('selectMapWidget')} aria-label={getI18nMessage('selectMapWidget')} role='group'>
        <SettingRow>
          <MapWidgetSelector onSelect={onMapSelect} useMapWidgetIds={useMapWidgetIds} aria-label={getI18nMessage('selectMapWidget')}></MapWidgetSelector>
        </SettingRow>
      </SettingSection>

      <JimuMapViewComponent
        useMapWidgetId={useMapWidgetIds?.[0]}
        onViewsCreate={onViewsCreate}
      />

      {/* default versions settings. Displays message if no versioned services are available or if no map widget is selected */}
      <SettingSection title={getI18nMessage('defaultVersions')} aria-label={getI18nMessage('defaultVersions')} role='group'>
        {loading && renderLoader()}
        {!loading && services.length === 0 && useMapWidgetIds?.length > 0 &&
          renderError(getI18nMessage('noVersionedServices'))}
        {!loading && services.length === 0 && !useMapWidgetIds?.length &&
          renderError(getI18nMessage('selectMapWidgetPrompt'))}
        {!loading && services.length > 0 && renderDefaultVersions()}
        {versionedServicesAvailable && (
          <>
          {renderSwitch(getI18nMessage('manageVersionsEnabled'), manageVersionsEnabled || false, 'manageVersionsEnabled', 'manageVersionsEnabledTooltip')}
          {renderSwitch(getI18nMessage('editSessionsEnabled'), editSessionsEnabled || false, 'editSessionsEnabled', 'editSessionsEnabledTooltip')}
          </>
        )}
      </SettingSection>

      {/* toolbar tool settings */}
      {editSessionsEnabled && versionedServicesAvailable && (
        <SettingSection className='px-4' aria-label={getI18nMessage('editToolbarSettings')} role='group'>
          <CollapsablePanel
            role="group"
            level={1}
            type="default"
            wrapperClassName="mt-3"
            label={getI18nMessage('editToolbarSettings')}
            defaultIsOpen={false}
            disabled={false}
            aria-label={getI18nMessage('editToolbarTools')}
          >
            {renderSwitch(getI18nMessage('saveEnabled'), editToolBar?.saveEnabled || false, 'saveEnabled', "saveTooltip")}
            {renderSwitch(getI18nMessage('discardEnabled'), editToolBar?.discardEnabled || false, 'discardEnabled', "discardTooltip")}
            {renderSwitch(getI18nMessage('undoEnabled'), editToolBar?.undoEnabled || false, 'undoEnabled', "undoTooltip")}
            {renderSwitch(getI18nMessage('redoEnabled'), editToolBar?.redoEnabled || false, 'redoEnabled', "redoTooltip")}
            {renderSwitch(getI18nMessage('reconcileEnabled'), editToolBar?.reconcileEnabled || false, 'reconcileEnabled', "reconcileTooltip")}
            {renderSwitch(getI18nMessage('postEnabled'), editToolBar?.postEnabled || false, 'postEnabled', "postTooltip")}
            {editToolBar?.saveEnabled && (
              renderCheckBox(getI18nMessage('showDialogOnSave'), editToolBar?.showDialogOnSave || false, 'showDialogOnSave')
            )}
            {editToolBar?.discardEnabled && (
              renderCheckBox(getI18nMessage('showDialogOnDiscard'), editToolBar?.showDialogOnDiscard || false, 'showDialogOnDiscard')
            )}
          </CollapsablePanel>
        </SettingSection>
      )}

      {/* toolbar display settings */}
      {editSessionsEnabled && versionedServicesAvailable && (
        <SettingSection className='px-4' aria-label={getI18nMessage('editToolbarDisplay')} role='group'>
          <CollapsablePanel
            role="group"
            level={1}
            type="default"
            wrapperClassName="mt-3"
            label={getI18nMessage('editToolbarDisplay')}
            defaultIsOpen={false}
            disabled={false}
            aria-label={getI18nMessage('editToolbarDisplay')}
          >
            {renderSelect(getI18nMessage('scale'), editToolBar?.scale || 'm', SCALE_OPTIONS, onScaleChange)}
            {renderSelect(getI18nMessage('displayType'), editToolBar?.displayType || DisplayType.DOCKED, DISPLAY_TYPE_OPTIONS, onDisplayTypeChange)}

            {editToolBar?.displayType === DisplayType.DOCKED && (
              renderSelect(getI18nMessage('dockPosition'), editToolBar?.dockedPosition || 'panel-top', DOCK_POSITION_OPTIONS, onDockPositionChange)
            )}

              {editToolBar?.displayType === DisplayType.FLOATING && (
                <>
                {renderSelect(getI18nMessage('layoutType'), editToolBar?.layoutType || LayoutType.HORIZONTAL, LAYOUT_TYPE_OPTIONS, onLayoutTypeChange)}
                <SettingRow flow='wrap' label={getI18nMessage('defaultPosition')} aria-label={getI18nMessage('defaultPosition')} role='group'>
                  <FixedPositionSize
                    fixedPositionSizeJson={editToolBar?.floatingPanelJson || Immutable(DEFAULT_FLOATING_LAYOUT_STYLE)}
                    onChange={onFloatingPositionChange}
                  />
                </SettingRow>
                </>
              )}
          </CollapsablePanel>
        </SettingSection>
      )}
    </div>
  )
}