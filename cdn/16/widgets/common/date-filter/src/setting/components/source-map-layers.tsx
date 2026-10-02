import { DataSourceManager, DataSourceTypes, type DataSource, Immutable, type ImmutableArray, type ImmutableObject, React, hooks } from 'jimu-core'
import type { JimuLayerView, JimuMapView, JimuTable } from 'jimu-arcgis'
import { Alert, type IconComponentProps } from 'jimu-ui'
import { LayerSetting, SettingRow } from 'jimu-ui/advanced/setting-components'
import { SourceLayerConfig } from './source-layer-config'
import { getFirstDateField, getStartAndEndDateFieldsFromLayerDs, isJimuLayerViewSupported, isJimuTableSupported } from '../../utils/utils'
import type { IMMapViewConfigList, LayerConfig, MapViewConfig } from '../../config'
import { getDefaultLayerConfig } from './utils'
import defaultMessages from './../translations/default'
import IconWarning from 'jimu-icons/svg/outlined/suggested/warning.svg'

interface SourceMapLayersProps {
  useMapWidgetIds: ImmutableArray<string>
  jimuMapViews: JimuMapView[]
  mapViewConfigList: IMMapViewConfigList
  onChange: (mapViewId: string, mapViewConfig: ImmutableObject<MapViewConfig>) => void
}

export const SourceMapLayers = (props: SourceMapLayersProps) => {
  const {
    useMapWidgetIds, jimuMapViews, mapViewConfigList = Immutable({}) as IMMapViewConfigList,
    onChange
  } = props
  const mapWidgetId = useMapWidgetIds?.[0]
  const [mapEmpty, setMapEmpty] = React.useState(true)
  // active map view id
  const [activeMapViewId, setActiveMapViewId] = React.useState<string>(null)
  // layers and tables from jimuMapViews
  const [jimuLayerViews, setJimuLayerViews] = React.useState<{ [mapViewId: string]: JimuLayerView[] }>(null)
  const [jimuTables, setJimuTables] = React.useState<{ [mapViewId: string]: JimuTable[] }>(null)
  // layers and tables from active jimuMapView
  const [activeJimuLayerViews, setActiveJimuLayerViews] = React.useState<JimuLayerView[]>([])
  const [activeJimuTables, setActiveJimuTables] = React.useState<JimuTable[]>([])
  // the current active layer and table
  const [activeJimuLayerView, setActiveJimuLayerView] = React.useState<JimuLayerView>(null)
  const [activeJimuTable, setActiveJimuTable] = React.useState<JimuTable>(null)
  // cache pending layer item click
  const [pendingLayerItemClick, setPendingLayerItemClick] = React.useState<{jlvId: string, jmvId: string}>(null)

  // layer and table listener refs
  const layerListenerRef = React.useRef<{ [mapViewId: string]: (jimuLayerView: JimuLayerView) => void }>({})
  const tableListenerRef = React.useRef<{ [mapViewId: string]: (jimuTable: JimuTable) => void }>({})

  const i18n = hooks.useTranslation(defaultMessages)

  /**
   * Load all layers and tables from jimuMapViews,
   * Show alert for these two cases:
   * 1. no webmap ds (jimuMapView.dataSourceId is ''), the alert is from layer setting component.
   * 2. no date-related field in layer/table from webmaps, the alert is custmized by current component.
   */
  React.useEffect(() => {
    if (!jimuMapViews) {
      return
    }
    const layerListeners = layerListenerRef.current
    const tableListeners = tableListenerRef.current
    // check empty webmap
    const isMapEmpty = Object.keys(jimuMapViews).length === 1 && !Object.values(jimuMapViews)[0].dataSourceId
    setMapEmpty(isMapEmpty)
    if (isMapEmpty) {
      setJimuLayerViews(null)
      setJimuTables(null)
      return
    }

    setJimuLayerViews({})
    setJimuTables({})

    jimuMapViews.forEach(jimuMapView => {
      let layerViewListener = layerListeners[jimuMapView.id]
      if (!layerViewListener) {
        layerViewListener = (_newJimuLayerView: JimuLayerView) => {
          updateJimuLayerViewsLoaded(jimuMapView)
        }
        layerListeners[jimuMapView.id] = layerViewListener
        jimuMapView.addJimuLayerViewCreatedListener(layerViewListener)
      }

      let tableListener = tableListeners[jimuMapView.id]
      if (!tableListener) {
        tableListener = (_newJimuTable: JimuTable) => {
          updateJimuTablesLoaded(jimuMapView)
        }
        tableListeners[jimuMapView.id] = tableListener
        jimuMapView.addJimuTableCreatedListener(tableListener)
      }

      updateJimuLayerViewsLoaded(jimuMapView)
      updateJimuTablesLoaded(jimuMapView)
    })

    return () => {
      jimuMapViews.forEach(jimuMapView => {
        const layerListener = layerListeners[jimuMapView.id]
        if (layerListener) {
          jimuMapView.removeJimuLayerViewCreatedListener(layerListener)
          delete layerListeners[jimuMapView.id]
        }

        const tableListener = tableListeners[jimuMapView.id]
        if (tableListener) {
          jimuMapView.removeJimuTableCreatedListener(tableListener)
          delete tableListeners[jimuMapView.id]
        }
      })
    }
  }, [jimuMapViews])

  const updateJimuLayerViewsLoaded = async (jimuMapView: JimuMapView) => {
    const supportedLayerViews = jimuMapView.getAllLoadedJimuLayerViews().filter(layerView => {
      return !layerView.fromRuntime && isJimuLayerViewSupported(layerView)
    })
    const promises = supportedLayerViews.map(lv => lv.createLayerDataSource())
    try {
      await Promise.all(promises)
    } catch (e) {
      console.log(e) // some SceneLayer can't create data source, it is as expected, just log it
    }
    const filteredLayerViews = supportedLayerViews.filter(lv => !!lv?.getLayerDataSource())
    setJimuLayerViews(prevJimuLayerViews => {
      return {
        ...(prevJimuLayerViews || {}),
        [jimuMapView.id]: filteredLayerViews
      }
    })
  }

  const updateJimuTablesLoaded = async (jimuMapView: JimuMapView) => {
    const loadedTables = await jimuMapView.loadJimuTables()
    const supportedTables = loadedTables.filter(table => {
      return table.table?.visible && isJimuTableSupported(table.table)
    })
    setJimuTables(prevJimuTables => {
      return {
        ...(prevJimuTables || {}),
        [jimuMapView.id]: supportedTables
      }
    })
  }

  const noSupportedLayerOrTable = React.useMemo(() => {
    if (mapEmpty || !jimuLayerViews || !jimuTables) {
      return false
    }
    const layerCount = Object.values(jimuLayerViews).flat().length + Object.values(jimuTables).flat().length
    return layerCount === 0
  }, [mapEmpty, jimuLayerViews, jimuTables])

  React.useEffect(() => {
    if (!activeMapViewId || !jimuLayerViews || !jimuTables) { // TODO: loading state
      return
    }
    setActiveJimuLayerViews(jimuLayerViews[activeMapViewId])
    setActiveJimuTables(jimuTables[activeMapViewId])
  }, [activeMapViewId, jimuLayerViews, jimuTables])

  // webMap item click, create layer data sources
  const handleMapItemClick = React.useCallback((dsId: string) => {
    const mapViewId = `${mapWidgetId}-${dsId}`
    setActiveMapViewId(mapViewId)
  }, [mapWidgetId])

  // Layer custom
  const isCustomizeEnabled = !!mapViewConfigList[activeMapViewId]?.customizeLayers

  // enable when runtime layer option is supported
  // const displayRuntimeLayers = mapViewConfigList[activeMapViewId]?.displayRuntimeLayers === undefined ? true : mapViewConfigList[activeMapViewId]?.displayRuntimeLayers
  // const onDisplayRuntimeLayers = React.useCallback((enable: boolean) => {
  //   const mapViewConfig: ImmutableObject<MapViewConfig> = mapViewConfigList[activeMapViewId] || Immutable({customizeLayers: false})
  //   onChange(activeMapViewId, mapViewConfig.set('displayRuntimeLayers', enable))
  // }, [activeMapViewId, mapViewConfigList, onChange])

  const selectedLayerViewIds = React.useMemo(() => {
    const layerIds = {}
    for (const [mapViewId, config] of Object.entries(mapViewConfigList || {})) {
      if (config.customizeLayers) {
        layerIds[mapViewId] = config.customJimuLayerViewIds || Immutable([])
      }
    }
    return layerIds
  }, [mapViewConfigList])

  // all JimuLayerViews that can show in JimuLayerViewSelector, include ancestorLayerViews case
  const allAvailableLayerViewIds = React.useMemo(() => {
    const layerViewIds: string[] = []
    activeJimuLayerViews?.forEach(layerView => {
      const layerDs = layerView?.getLayerDataSource()
      if (getFirstDateField(layerDs)) {
        layerViewIds.push(layerView.id)
      }
      const ancestorLayerViews = layerView.getAllAncestorJimuLayerViews()
      ancestorLayerViews.forEach(ancestorLayerView => {
        const ancestorLayerDs = ancestorLayerView?.getLayerDataSource()
        if (getFirstDateField(ancestorLayerDs)) {
          layerViewIds.push(ancestorLayerView.id)
        }
      })
    })
    return layerViewIds
  }, [activeJimuLayerViews])

  const allAvailableTableIds = React.useMemo(() => {
    return activeJimuTables?.map(table => table.id) || []
  }, [activeJimuTables])

  const handleToggleCustomize = React.useCallback(async (checked: boolean) => {
    const mapViewConfig: ImmutableObject<MapViewConfig> = mapViewConfigList[activeMapViewId] || Immutable({customizeLayers: false})
    if (checked) {
      const customJimuLayerViewIds = []
      const newLayersConfig = []
      const dsList: DataSource[] = []
      for (const layerView of activeJimuLayerViews) {
        try {
          const layerDs = await layerView.getOrCreateLayerDataSource()
          dsList.push(layerDs)
        } catch (error) {
          continue
        }
      }
      activeJimuTables.forEach(jimuTable => {
        const tableDs = jimuTable.getTableDataSource()
        dsList.push(tableDs)
      })

      // check all dss, ignoring normal layer with multiple date fields
      dsList.forEach(ds => {
        const layerConfig = getDefaultLayerConfig(ds, null, true)
        if (layerConfig) {
          newLayersConfig.push(layerConfig)
          customJimuLayerViewIds.push(jimuMapViews[0].mapWidgetId + '-' + ds.id) // save view ids
        }
      })
      onChange(activeMapViewId, mapViewConfig
        .set('customizeLayers', true)
        .set('displayRuntimeLayers', true)
        .set('customJimuLayerViewIds', customJimuLayerViewIds)
        .set('layerConfigList', newLayersConfig))
    } else {
      onChange(activeMapViewId, mapViewConfig
        .set('customizeLayers', false)
        .set('displayRuntimeLayers', true)
        .set('customJimuLayerViewIds', [])
        .set('layerConfigList', []))
    }
  }, [jimuMapViews, activeMapViewId, mapViewConfigList, activeJimuLayerViews, activeJimuTables, onChange])

  const disableLayers = React.useCallback((jimuLayerView: JimuLayerView) => {
    return !allAvailableLayerViewIds.includes(jimuLayerView.id)
  }, [allAvailableLayerViewIds])

  const disableTables = React.useCallback((jimuTableId: string) => {
    return !allAvailableTableIds.includes(jimuTableId)
  }, [allAvailableTableIds])

  const getLayerCustomIcon = React.useCallback((jimuLayerViewId: string, jimuMapViewId: string) => {
    if (jimuLayerViewId && jimuMapViewId && jimuLayerViews && jimuTables && mapViewConfigList) {
      const layerViews = Object.values(jimuLayerViews).flat()
      const tables = Object.values(jimuTables).flat()
      let dsId = layerViews.find(lv => lv.id === jimuLayerViewId)?.layerDataSourceId
      if (!dsId) { // table case
        const jimuTable = tables.find(t => t.id === jimuLayerViewId)
        dsId = jimuTable?.tableDataSourceId
      }
      const layerConfig = mapViewConfigList[jimuMapViewId].layerConfigList.find(lc => lc.useDataSource.dataSourceId === dsId)
      if (layerConfig && !layerConfig.startField) {
        return { icon: IconWarning, color: 'var(--sys-color-warning-light)', title: i18n('noDateFieldsAreDefined') } as IconComponentProps
      }
    }
    return null
  }, [mapViewConfigList, jimuLayerViews, jimuTables, i18n])

  const handleSelectedLayerIdChange = React.useCallback(async (selectedViewIds: string[]) => {
    const mapViewConfig = mapViewConfigList[activeMapViewId]
    const layerConfigList = mapViewConfig.layerConfigList
    const newLayerConfigList: LayerConfig[] = layerConfigList.asMutable({ deep: true })
    const isAdded = selectedViewIds.length > layerConfigList.length
    if (isAdded) { // one or multiple layers/tables added
      const existingDsIds = layerConfigList.map(lc => lc.useDataSource.dataSourceId)
      for (const selectedViewId of selectedViewIds) {
        const layerView = activeJimuLayerViews.find(lv => lv.id === selectedViewId)
        const jimuTable = activeJimuTables.find(table => table.id === selectedViewId)
        let ds
        if (layerView) {
          try {
            ds = (await layerView.getOrCreateLayerDataSource()) as any
          } catch (error) {
            console.log(error)
          }
        } else if (jimuTable) {
          ds = jimuTable.getTableDataSource()
        }
        // add new layer config
        if (ds && !existingDsIds.includes(ds.id)) {
          let layerConfig = getDefaultLayerConfig(ds, null)
          const { startField } = getStartAndEndDateFieldsFromLayerDs(ds, true)
          if (!startField) { // select ds, but not set date fields for normal layer with multiple date fields
            layerConfig = { ...layerConfig, startField: null }
          }
          newLayerConfigList.push(layerConfig)
        }
      }
    } else { // removed
      layerConfigList.some((layerConfig, index) => {
        const layerConfigDsId = layerConfig.useDataSource.dataSourceId
        const layerView = activeJimuLayerViews.find(lv => lv.layerDataSourceId === layerConfigDsId)
        if (layerView && !selectedViewIds.includes(layerView.id)) {
          newLayerConfigList.splice(index, 1)
          return true
        }
        const table = activeJimuTables.find(t => t.tableDataSourceId === layerConfigDsId)
        if (table && !selectedViewIds.includes(table.id)) {
          newLayerConfigList.splice(index, 1)
          return true
        }
        return false
      })
    }
    onChange(activeMapViewId, mapViewConfig
      .set('customJimuLayerViewIds', selectedViewIds)
      .set('layerConfigList', newLayerConfigList))
  }, [activeMapViewId, mapViewConfigList, activeJimuLayerViews, activeJimuTables, onChange])

  // Click layer item in the list
  const handleLayerItemClick = React.useCallback((jlvId: string, jmvId: string) => {
    if (!jimuLayerViews || !jimuTables) {
      setPendingLayerItemClick({ jlvId, jmvId }) // cache the click params, and retry when data ready
      return
    }
    // layer
    const layerViews = Object.values(jimuLayerViews).flat()
    const activeLayerView = layerViews.find(v => v.id === jlvId)
    if (activeLayerView) {
      setActiveJimuLayerView(activeLayerView)
      setActiveJimuTable(null)

    } else { // table
      const tables = Object.values(jimuTables).flat()
      const activeTable = tables.find(v => v.id === jlvId)
      if (activeTable) {
        setActiveJimuLayerView(null)
        setActiveJimuTable(activeTable)
      }
    }
    // the current item is from another map view
    if (jmvId !== activeMapViewId) {
      setActiveMapViewId(jmvId)
    }

    // clear pending
    setPendingLayerItemClick(null)
  }, [activeMapViewId, jimuLayerViews, jimuTables])

  // Listen for data readiness and automatically retry pending clicks
  React.useEffect(() => {
    if (pendingLayerItemClick && jimuLayerViews && jimuTables) {
      handleLayerItemClick(pendingLayerItemClick.jlvId, pendingLayerItemClick.jmvId)
    }
  }, [pendingLayerItemClick, jimuLayerViews, jimuTables, handleLayerItemClick])

  // Layer config change
  const onFieldsChange = (startField: string, endField: string) => {
    const newLayerConfig = activeLayerConfig.set('startField', startField).set('endField', endField)
    const activeIndex = mapViewConfigList[activeMapViewId].layerConfigList.findIndex(l => l.useDataSource.dataSourceId === newLayerConfig.useDataSource.dataSourceId)
    const newLayerConfigList = Immutable.setIn(mapViewConfigList[activeMapViewId].layerConfigList, [activeIndex] , newLayerConfig)
    const mapViewConfig = mapViewConfigList[activeMapViewId]
    onChange(activeMapViewId, mapViewConfig.set('layerConfigList', newLayerConfigList))
  }

  // active layer config
  const activeLayerConfig = React.useMemo(() => {
    if (!jimuMapViews || (!activeJimuLayerView && !activeJimuTable)) {
      return null
    }
    const dsId = activeJimuLayerView ? activeJimuLayerView.layerDataSourceId : activeJimuTable.tableDataSourceId
    const layerConfig = mapViewConfigList[activeMapViewId]?.layerConfigList.find(l => l.useDataSource.dataSourceId === dsId)
    return Immutable(layerConfig)
  }, [jimuMapViews, activeMapViewId, mapViewConfigList, activeJimuLayerView, activeJimuTable])

  // active data source
  const activeDs = React.useMemo(() => {
    if (!activeLayerConfig) {
      return null
    }
    let ds = DataSourceManager.getInstance().getDataSource(activeLayerConfig.useDataSource.dataSourceId)
    if (ds?.type === DataSourceTypes.SceneLayer || ds?.type === DataSourceTypes.BuildingComponentSubLayer) {
      ds = (ds as any).getAssociatedDataSource()
    }
    return ds
  }, [activeLayerConfig])

  return (
    <React.Fragment>
      <SettingRow>
        <LayerSetting
          // Map items
          mapWidgetId={mapWidgetId}
          mapViewId={activeMapViewId}
          keepLastTimeMap={true}
          onMapItemClick={handleMapItemClick}
          isJlvLoading={!jimuMapViews || !activeMapViewId || !activeJimuLayerViews} // layer views & dss are not ready (including tables)
          // Layer custom
          isCustomizeEnabled={isCustomizeEnabled}
          isShowRuntimeAddedLayerEnabled={false}
          showRuntimeAddedLayerOption={false}
          selectedValues={selectedLayerViewIds}
          disableLayers={disableLayers}
          disableTables={disableTables}
          getLayerCustomIcon={getLayerCustomIcon}
          showTable={true}
          onToggleCustomize={handleToggleCustomize}
          onSelectedLayerIdChange={handleSelectedLayerIdChange}
          // Layer order & config
          showSelectedLayers={true}
          dndEnabled={false}
          onLayerItemClick={handleLayerItemClick}
        >
          <SourceLayerConfig
            addDataByData={false}
            useDataSource={activeLayerConfig?.useDataSource}
            dataSource={activeDs}
            startField={activeLayerConfig?.startField}
            endField={activeLayerConfig?.endField}
            onFieldsChange={onFieldsChange}
          />
        </LayerSetting>
      </SettingRow>
      {
        !mapEmpty && noSupportedLayerOrTable &&
        <SettingRow className='mt-0'>
          <Alert
            closable={false}
            className='w-100 mt-4'
            form='basic'
            text={i18n('noSupportedLayersInMapWidgetTip')}
            type='warning'
            withIcon={false}
          />
        </SettingRow>
      }
    </React.Fragment>
  )
}
