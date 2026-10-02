import { hooks, Immutable, React, DataSourceManager } from 'jimu-core'
import type { ImmutableArray, UseDataSource, ImmutableObject, DataSource } from 'jimu-core'
import { type JimuMapView, JimuMapViewComponent } from 'jimu-arcgis'
import type { SettingChangeFunction } from 'jimu-for-builder'
import { Button, Label, Radio, Tooltip } from 'jimu-ui'
import { MapWidgetSelector, SettingRow, SettingSection } from 'jimu-ui/advanced/setting-components'
import { getStartAndEndDateFieldsFromLayerDs, getUseDataSourcesFromLayerConfigList, getUseDataSourcesFromMapViewConfigList } from '../../utils/utils'
import defaultMessages from './../translations/default'
import { SourceMapLayers } from './source-map-layers'
import { SourceDataLayers } from './source-data-layers'
import type { IMLayerConfig, IMMapViewConfigList, MapViewConfig, IMConfig } from '../../config'
import { InfoOutlined } from 'jimu-icons/outlined/suggested/info'
import { getDefaultLayerConfig } from './utils'

interface SourceProps {
  widgetId: string,
  config: IMConfig,
  addSourceByData: boolean,
  // mode is data
  dataSources: { [dsId: string]: DataSource },
  // mode is map
  useMapWidgetIds: ImmutableArray<string>,
  mapViewConfigList: IMMapViewConfigList,
  hideBottomBorder: boolean,
  onSettingChange: SettingChangeFunction
}

export const Source = (props: SourceProps) => {
  const {
    widgetId, config, mapViewConfigList, hideBottomBorder, addSourceByData, dataSources: propDataSources, useMapWidgetIds,
    onSettingChange
  } = props
  const { layerConfigList } = config
  const [jimuMapViews, setJimuMapViews] = React.useState<JimuMapView[]>(null)
  const dsManager = DataSourceManager.getInstance()
  const i18n = hooks.useTranslation(defaultMessages)

  const [ dataSources, setDataSources ] = React.useState<{ [dsId: string]: DataSource }>(propDataSources)

  React.useEffect(() => {
    setDataSources(propDataSources)
  }, [propDataSources])

  // Clear the previous configuration when mode is changed.
  const setSourceMode = (addSourceByData) => {
    onSettingChange({
      id: widgetId,
      useDataSources: [],
      config: getConfigWithoutLayerAndMapData(addSourceByData),
      useMapWidgetIds: null
    })
  }

  const getConfigWithoutLayerAndMapData = (byData: boolean) => {
    return config.without('layerConfigList').without('mapViewConfigList').set('addSourceByData', byData)
  }

  //#region Data source mode: data
  // TODO: when ds view is changed, keep the selected fields.
  const onDataSourceChange = async (useDss: UseDataSource[], index: number) => {
    let newConfig = config
    const currentUseDs = useDss[0]
    const currentDs = await dsManager.createDataSourceByUseDataSource(Immutable(currentUseDs))

    // update dataSources in state
    const newDsState = dataSources
    newDsState[currentUseDs.dataSourceId] = currentDs
    setDataSources(newDsState)

    // get default layer config
    const newLayerConfig = getDefaultLayerConfig(currentDs, currentUseDs)
    const { startField } = getStartAndEndDateFieldsFromLayerDs(currentDs, true)
    if (!startField) {
      newLayerConfig.startField = null
    }
    const previousLayerConfig = newConfig.layerConfigList?.[index]
    if (previousLayerConfig) { // update
      // keep fields if only ds view is changed
      const isViewChanged = currentUseDs.mainDataSourceId === previousLayerConfig.useDataSource.mainDataSourceId
      if (isViewChanged) {
        newLayerConfig.startField = previousLayerConfig.startField
        newLayerConfig.endField = previousLayerConfig.endField
      }
      newConfig = newConfig.setIn(['layerConfigList', index + ''], newLayerConfig)
    } else { // new added
      newConfig = newConfig.set('layerConfigList', (newConfig.layerConfigList || []).concat(newLayerConfig))
    }

    const widgetUseDss = getUseDataSourcesFromLayerConfigList(newConfig.layerConfigList)
    onSettingChange({
      id: widgetId,
      config: newConfig,
      useDataSources: widgetUseDss
    })
  }

  const onLayerConfigChange = (currentLayerConfig: IMLayerConfig, index: number) => {
    let newLayerConfigList
    if (currentLayerConfig) { // update
      newLayerConfigList = Immutable.setIn(layerConfigList, [index], currentLayerConfig)
    } else { // remove the current one
      newLayerConfigList = layerConfigList.asMutable({ deep: true })
      newLayerConfigList.splice(index, 1)
    }
    const newConfig = config.set('layerConfigList', newLayerConfigList)
    const widgetUseDss = getUseDataSourcesFromLayerConfigList(newLayerConfigList)
    onSettingChange({
      id: widgetId,
      config: newConfig,
      useDataSources: widgetUseDss
    })
  }
  //#endregion

  // #region Data source mode: map widget
  const onMapWidgetSelected = (useMapWidgetIds: string[]) => {
    onSettingChange({
      id: widgetId,
      config: getConfigWithoutLayerAndMapData(false),
      useMapWidgetIds: useMapWidgetIds,
      useDataSources: undefined // it should be undefined for default sync mode
    })
  }

  const onJimuViewsCreate = (viewsObjects: { [jimuMapViewIds: string]: JimuMapView }) => {
    setJimuMapViews(null)
    const allJimuMapViews = Object.values(viewsObjects)
    const promises = allJimuMapViews.map(async (jimuMapView) => {
      await jimuMapView.whenJimuMapViewLoaded()
    })
    Promise.allSettled(promises).then(() => {
      setJimuMapViews(allJimuMapViews)
    })
  }

  const onMapViewsConfigChange = React.useCallback((mapViewId: string, mapViewConfig: ImmutableObject<MapViewConfig>) => {
    const newMapViewConfigList = (config.mapViewConfigList ?? (Immutable({}) as IMMapViewConfigList)).set(mapViewId, mapViewConfig)
    const useDss = mapViewConfig.customizeLayers ? getUseDataSourcesFromMapViewConfigList(newMapViewConfigList) : undefined // keep undefined for sync mode
    onSettingChange({
      id: widgetId,
      config: config.set('mapViewConfigList', newMapViewConfigList),
      useDataSources: useDss
    })
  }, [config, onSettingChange, widgetId])
  //#endregion

  return (
    <React.Fragment>
      <SettingSection
        role='group'
        className='border-0'
        aria-label={i18n('source')}
        title={
          <div className='d-flex justify-content-between'>
            <div>{i18n('source')}</div>
            <Tooltip showArrow={true} placement='right' title={i18n('selectDataSourceLabel')}>
              <Button icon type='tertiary' size='sm' className='ml-2 p-0 jimu-outline-inside' disableHoverEffect={true} disableRipple={true}>
                <InfoOutlined />
              </Button>
            </Tooltip>
          </div>
        }
      >
        <SettingRow>
          <Label className='source-label' check>
            <Radio
              name='time-setting-radio'
              style={{ cursor: 'pointer' }}
              className='mr-2 align-text-bottom'
              checked={addSourceByData}
              onChange={evt => { setSourceMode(true) }}
            />
            {i18n('addSourceByData')}
          </Label>
        </SettingRow>
        <SettingRow className='mt-2'>
          <Label className='source-label' check>
            <Radio
              name='time-setting-radio'
              style={{ cursor: 'pointer' }}
              className='mr-2 align-text-bottom'
              checked={!addSourceByData}
              onChange={evt => { setSourceMode(false) }}
            />
            {i18n('addSourceByMapWidget')}
          </Label>
        </SettingRow>
      </SettingSection>
      {
        addSourceByData
          ? <SourceDataLayers
            hideBottomBorder={hideBottomBorder}
            layerConfigList={layerConfigList}
            dataSources={dataSources}
            onDataSourceChange={onDataSourceChange}
            onLayerConfigChange={onLayerConfigChange}
          />
          : <SettingSection className='pt-1'>
            <JimuMapViewComponent
              useMapWidgetId={useMapWidgetIds?.[0]}
              onViewsCreate={onJimuViewsCreate}
            />
            <SettingRow>
              <MapWidgetSelector onSelect={onMapWidgetSelected} useMapWidgetIds={useMapWidgetIds} />
            </SettingRow>
            {
              useMapWidgetIds?.length > 0 &&
              <SourceMapLayers
                useMapWidgetIds={useMapWidgetIds}
                jimuMapViews={jimuMapViews}
                mapViewConfigList={mapViewConfigList}
                onChange={onMapViewsConfigChange}
              />
            }
          </SettingSection>
      }
    </React.Fragment>
  )
}
