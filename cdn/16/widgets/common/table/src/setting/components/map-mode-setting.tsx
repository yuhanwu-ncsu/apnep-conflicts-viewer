import { React, type ImmutableArray, type ImmutableObject, hooks, type UseDataSource, Immutable, type IMState, ReactRedux } from 'jimu-core'
import { Alert, Button, Checkbox, defaultMessages as jimuUIMessages, Label, Switch, Tooltip } from 'jimu-ui'
import { MapWidgetSelector, SettingRow } from 'jimu-ui/advanced/setting-components'
import { type SettingChangeFunction, messageActionCycleUtils } from 'jimu-for-builder'
import type { JimuMapView } from 'jimu-arcgis'
import type { IMConfig, MapViewConfig, MapViewsConfig } from '../../config'
import TableMapLayers from './table-map-layers'
import defaultMessages from '../translations/default'
import { InfoOutlined } from 'jimu-icons/outlined/suggested/info'

interface MapModeSettingProps {
  widgetId: string
  config: IMConfig
  useMapWidgetIds: ImmutableArray<string>
  mapEmpty: boolean
  jimuMapViews: JimuMapView[]
  activeMapView: JimuMapView
  useDataSources: ImmutableArray<UseDataSource>
  onSettingChange: SettingChangeFunction
  onPropertyChange: (name: string, value: any) => void
}

const MapModeSetting = (props: MapModeSettingProps) => {
  const { widgetId, config, useMapWidgetIds, mapEmpty, jimuMapViews, useDataSources, onSettingChange, onPropertyChange } = props
  const defaultMapViewsConfig = Immutable({}) as ImmutableObject<MapViewsConfig>
  const { mapViewsConfig = defaultMapViewsConfig, respectMapRange, enableMapExtentFilter, defaultExtentFilterEnabled } = config
  const hasMap = useMapWidgetIds?.length > 0
  const translate = hooks.useTranslation(jimuUIMessages, defaultMessages)
  const [isMapFilterDisabled, setIsMapFilterDisabled] = React.useState(false)

  const widgetAppConfig = ReactRedux.useSelector((state: IMState) => {
    const appConfig = state?.appStateInBuilder?.appConfig
    return appConfig
  })

  React.useEffect(() => {
    const timer = window.setTimeout(() => {
      if (useMapWidgetIds?.length > 0) {
        const toBeCheckConfig = widgetAppConfig.setIn(['widgets', widgetId, 'config', 'enableMapExtentFilter'], true)
        const haveCircle = messageActionCycleUtils.checkCycleForTable(toBeCheckConfig, widgetId)
        if (haveCircle) {
          setIsMapFilterDisabled(true)
        } else {
          setIsMapFilterDisabled(false)
        }
      } else {
        setIsMapFilterDisabled(false)
      }
    }, 200)

    return () => {
      window.clearTimeout(timer)
    }
  }, [widgetAppConfig, widgetId, useMapWidgetIds])


  const onMapWidgetSelected = (useMapWidgetIds: string[]) => {
    // check message action circle
    let newConfig
    if (enableMapExtentFilter && useMapWidgetIds?.length > 0) {
      const toBeCheckConfig = widgetAppConfig.setIn(['widgets', widgetId, 'useMapWidgetIds'], useMapWidgetIds)
      const haveCircle = messageActionCycleUtils.checkCycleForTable(toBeCheckConfig, widgetId)
      if (haveCircle) {
        setIsMapFilterDisabled(true)
        newConfig = config.set('mapViewsConfig', {}).set('enableMapExtentFilter', false).set('defaultExtentFilterEnabled', false)
      } else {
        setIsMapFilterDisabled(false)
        newConfig = config.set('mapViewsConfig', {})
      }
    } else {
      setIsMapFilterDisabled(false)
      newConfig = config.set('mapViewsConfig', {})
    }
    onSettingChange({
      id: widgetId,
      config: newConfig,
      useMapWidgetIds
    })
  }

  const handleMapViewConfigChange = React.useCallback((mapViewId: string, mapViewConfig: ImmutableObject<MapViewConfig>, useDs?: UseDataSource[]) => {
    onSettingChange({
      id: widgetId,
      config: config.setIn(['mapViewsConfig', mapViewId], mapViewConfig),
      useDataSources: useDs
    })
  }, [config, onSettingChange, widgetId])

  const mapLabel = widgetAppConfig?.widgets?.[useMapWidgetIds?.[0]]?.label || translate('map')
  const filterMapExtentLabel = isMapFilterDisabled
  ? <div className='w-100 d-flex tip-container'>
    <Label className='tip-text' for='table-map-filter-switch' title={translate('enableMapExtentFilter')}>{translate('enableMapExtentFilter')}</Label>
    <Tooltip title={translate('messageExtentChangeWarning', { data: mapLabel, map: mapLabel })} showArrow placement='bottom'>
      <Button icon type='tertiary' className='d-inline jimu-outline-inside' disableHoverEffect={true} disableRipple={true}>
        <InfoOutlined />
      </Button>
    </Tooltip>
  </div>
  : translate('enableMapExtentFilter')

  return <React.Fragment>
    <SettingRow>
      <MapWidgetSelector
        useMapWidgetIds={useMapWidgetIds}
        onSelect={onMapWidgetSelected}
      />
    </SettingRow>
    {hasMap && !mapEmpty &&
      <TableMapLayers
        widgetId={widgetId}
        config={config}
        useMapWidgetIds={useMapWidgetIds}
        mapEmpty={mapEmpty}
        mapViewsConfig={mapViewsConfig || defaultMapViewsConfig}
        jimuMapViews={jimuMapViews}
        useDataSources={useDataSources}
        onChange={handleMapViewConfigChange}
      />
    }
    {hasMap && mapEmpty &&
      <SettingRow>
        <Alert tabIndex={0} type='warning' className='warningMsg' open text={translate('noWebMapWebSceneTip')} />
      </SettingRow>
    }
    <SettingRow tag='label' label={translate('respectMapRangeLabel')}>
      <Switch
        className='can-x-switch'
        checked={respectMapRange}
        onChange={(evt) => { onPropertyChange('respectMapRange', evt.target.checked) }}
        aria-label={translate('respectMapRangeLabel')}
      />
    </SettingRow>
    <SettingRow tag='label' label={filterMapExtentLabel}>
      <Switch
        id='table-map-filter-switch'
        className='can-x-switch'
        checked={enableMapExtentFilter}
        onChange={evt => { onPropertyChange('enableMapExtentFilter', evt.target.checked) }}
        aria-label={translate('enableMapExtentFilter')}
        disabled={isMapFilterDisabled}
      />
    </SettingRow>
    {enableMapExtentFilter &&
      <SettingRow>
        <Label className='d-flex align-items-center ml-2'>
          <Checkbox
            checked={defaultExtentFilterEnabled}
            className='mr-1'
            onChange={evt => { onPropertyChange('defaultExtentFilterEnabled', evt.target.checked) }}
          />
          {translate('defaultEnabled')}
        </Label>
      </SettingRow>
    }
  </React.Fragment>
}

export default MapModeSetting