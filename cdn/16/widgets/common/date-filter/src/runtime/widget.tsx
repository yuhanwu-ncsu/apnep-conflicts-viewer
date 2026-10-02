import { React, classNames, type DataSource, type AllWidgetProps, hooks, DataSourceStatus, dataSourceUtils, type UseDataSource, type ImmutableArray, Immutable } from 'jimu-core'
import { type JimuLayerView, JimuMapViewComponent, type JimuMapView, type JimuTable } from 'jimu-arcgis'
import { type DateType, FilterStyle, type IMConfig } from '../config'
import { Placeholder } from './components/placeholder'
import FilterDataSource from './components/filter-ds'
import DatePicker from './components/date-picker'
import {
   applyFiltersByData, type ApplyFiltersByDataProps, applyFiltersByMap, type ApplyFiltersByMapProps,
   getDatesForDefaultDay, syncToMapWidget
} from './components/utils'
import { isJimuLayerViewSupported, isJimuTableSupported } from '../utils/utils'
import { versionManager } from '../version-manager'

type DateFilterProps = AllWidgetProps<IMConfig>

const Widget = (props: DateFilterProps) => {
   const {
      id, label, icon, useDataSources, useMapWidgetIds, config,
      controllerWidgetId, autoWidth, autoHeight, layoutId, layoutItemId
   } = props
   const {
      filterStyle, selectionMode, defaultDay, autoApply, addSourceByData, layerConfigList, mapViewConfigList
   } = config
   const previousLayerConfigList = hooks.usePrevious(layerConfigList)
   const previousMapViewConfigList = hooks.usePrevious(mapViewConfigList)

   const currentFilteredDates = React.useRef<DateType>(null)

   // store layer dss from data layers
   const [dataSources, setDataSources] = React.useState<{ [dsId: string]: DataSource }>(null)
   const [notReadyOutputDsIds, setNotReadyOutputDsIds] = React.useState<string[]>([]) // for all not-ready output ds ids

   // active view from map widget
   const [activeJimuMapView, setActiveJimuMapView] = React.useState<JimuMapView>(null)
   const mapViewDsIdRef = React.useRef(null) // use ref to get latest value of mapViewDsId
   const [layerViews, setLayerViews] = React.useState<{ [lvId: string]: JimuLayerView }>(null) // only the time-aware layers from loaded layers.
   const [jimuTables, setJimuTables] = React.useState<{ [tableId: string]: JimuTable }>(null) // only the time-aware tables from loaded tables.

   const layerListenerRef = React.useRef<(jimuLayerView: JimuLayerView) => void>(null)
   const tableListenerRef = React.useRef<(jimuTable: JimuTable) => void>(null)

   const [datePickerVersion, setDatePickerVersion] = React.useState(0)
   const [clearVersion, setClearVersion] = React.useState(0)

   // all date layers/tables in sync mode.
   const [useDataSourcesInMapSyncMode, setUseDataSourcesInMapSyncMode] = React.useState<ImmutableArray<UseDataSource>>(null)
   const { clearFilterDataSourceIds } = dataSourceUtils.useClearDataSourceFilters(id, useDataSources?.length > 0 ? useDataSources : useDataSourcesInMapSyncMode)
   React.useEffect(() => {
      // filters from some dss are cleared, dates are applied
      if (clearFilterDataSourceIds.length > 0 && currentFilteredDates.current) {
         setClearVersion(clearVersion + 1)
         currentFilteredDates.current = null
         onDateChange(null)
      }
   // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [clearFilterDataSourceIds])

   /**
    * Apply date filters to all ready layer dss.
    */
   const onDateChange = (dates: DateType, usePrevious = false, sourceType = addSourceByData) => {
      if (sourceType) {
         const props: ApplyFiltersByDataProps = {
            widgetId: id,
            date: dates,
            selectionMode: selectionMode,
            dataSources: dataSources,
            notReadyOutputDsIds: notReadyOutputDsIds,
            layerConfigList: usePrevious ? previousLayerConfigList : layerConfigList
         }
         applyFiltersByData(props)
      } else {
         if (activeJimuMapView === null) {
            return
         }
         const props: ApplyFiltersByMapProps = {
            widgetId: id,
            date: dates,
            selectionMode: selectionMode,
            mapViewConfigList: usePrevious ? previousMapViewConfigList : mapViewConfigList,
            jimuMapView: activeJimuMapView,
            jimuLayerViews: layerViews,
            jimuTables: jimuTables
         }
         applyFiltersByMap(props)
      }
   }

   // from date picker
   const onDatePickerChange = (dates: DateType) => {
      currentFilteredDates.current = dates
      onDateChange(dates)
   }

   // get dates when auto apply is true
   const getCurrentFilterDates = () => {
      return autoApply && defaultDay ? getDatesForDefaultDay(defaultDay as any, selectionMode) : null
   }

   // initial auto apply filters when it's true
   React.useEffect(() => {
      currentFilteredDates.current = getCurrentFilterDates()
      if (currentFilteredDates.current) {
         onDateChange(currentFilteredDates.current)
      }
   // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [])

   // config changed
   React.useEffect(() => {
      setDatePickerVersion(datePickerVersion + 1) // to reset DatePicker to config state
   // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [config])

   // source mode is changed.
   hooks.useUpdateEffect(() => {
      // clear the filters from the previous mode
      currentFilteredDates.current = null
      onDateChange(null, true, !addSourceByData)
      // then clear dss related states
      setDataSources(null)
      setNotReadyOutputDsIds([])
      clearMapViewRelatedStates()
   }, [addSourceByData])

   // config list or map id is changed.
   hooks.useUpdateEffect(() => {
      if (!currentFilteredDates.current) { // the dates can from settings or runtime.
         return
      }
      currentFilteredDates.current = getCurrentFilterDates()
      if ( // field is changed -> update filters
         (layerConfigList && previousLayerConfigList?.length === layerConfigList?.length) ||
         // previousMapViewConfigList?.[activeJimuMapView.id] might be undefined when the previous webmap from map widget is removed.
         (mapViewConfigList && activeJimuMapView && previousMapViewConfigList?.[activeJimuMapView.id]?.layerConfigList.length === mapViewConfigList[activeJimuMapView.id].layerConfigList.length)
      ) {
         onDateChange(currentFilteredDates.current)
      } else { // length is changed, or map id is changed -> clear filters
         onDateChange(null, true)
      }
   }, [layerConfigList, useMapWidgetIds, mapViewConfigList])

   // config list or map id is changed -> ds list is changed -> update filters when autoApply is true
   hooks.useUpdateEffect(() => {
      if (currentFilteredDates.current) {
         onDateChange(currentFilteredDates.current)
      }
   }, [dataSources, layerViews, jimuTables])


   // style, or option is changed -> update filters (remove, update, add)
   hooks.useUpdateEffect(() => {
      currentFilteredDates.current = getCurrentFilterDates()
      onDateChange(currentFilteredDates.current)
   }, [filterStyle, selectionMode, defaultDay, autoApply])

   /**
    * Handle data source mode
    */
   // layer ds is created successful or failed.
   const onCreateDataSourceCreatedOrFailed = (dataSourceId: string, dataSource: DataSource, unMount = false) => {
      setDataSources(dataSources => {
         const newDataSources = Object.assign({}, dataSources)
         newDataSources[dataSourceId] = dataSource
         return newDataSources
      })
   }

   // output ds is ready or not.
   const onIsDataSourceNotReady = (dataSourceId: string, dataSourceStatus: DataSourceStatus) => {
      setNotReadyOutputDsIds(notReadyOutputDsIds => {
         let newOutputDss
         if (dataSourceStatus === DataSourceStatus.NotReady) {
            newOutputDss = notReadyOutputDsIds.includes(dataSourceId) ? notReadyOutputDsIds : notReadyOutputDsIds.concat(dataSourceId)
         } else {
            newOutputDss = notReadyOutputDsIds.includes(dataSourceId) ? notReadyOutputDsIds.filter(ds => ds !== dataSourceId) : notReadyOutputDsIds
         }
         return newOutputDss
      })
   }

   /**
    * Handle map widget mode
    */
   // clear related states when map id is changed.
   const clearMapViewRelatedStates = () => {
      setActiveJimuMapView(null)
      setLayerViews(null)
      setJimuTables(null)
      setUseDataSourcesInMapSyncMode(null)
      mapViewDsIdRef.current = ''
   }

   hooks.useUpdateEffect(() => {
      if (!useMapWidgetIds || useMapWidgetIds.length === 0) {
         clearMapViewRelatedStates()
      }
   }, [useMapWidgetIds])

   // active view is changed.
   const onActiveViewChange = (jimuMapView: JimuMapView) => {
      if (jimuMapView?.view && jimuMapView.dataSourceId) {
         setActiveJimuMapView(jimuMapView)
      } else {
         clearMapViewRelatedStates() // not affect the no map widget case
      }
   }

   React.useEffect(() => {
      if (activeJimuMapView === null) {
         return
      }
      mapViewDsIdRef.current = activeJimuMapView.dataSourceId

      const jimuLayerViewListener = (newJimuLayerView: JimuLayerView) => {
         updateJimuLayerViewsLoaded(newJimuLayerView.getJimuMapView())
      }
      layerListenerRef.current = jimuLayerViewListener
      activeJimuMapView.addJimuLayerViewCreatedListener(jimuLayerViewListener)

      const jimuTableListener = (_newJimuTable: JimuTable) => {
         updateJimuTablesLoaded(activeJimuMapView)
      }
      tableListenerRef.current = jimuTableListener
      activeJimuMapView.addJimuTableCreatedListener(jimuTableListener)

      updateJimuLayerViewsLoaded(activeJimuMapView)
      updateJimuTablesLoaded(activeJimuMapView)

      return () => {
         if (layerListenerRef.current) {
            activeJimuMapView.removeJimuLayerViewCreatedListener(layerListenerRef.current)
            layerListenerRef.current = null
         }
         if (tableListenerRef.current) {
            activeJimuMapView.removeJimuTableCreatedListener(tableListenerRef.current)
            tableListenerRef.current = null
         }
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [activeJimuMapView])

   const updateJimuLayerViewsLoaded = (jimuMapView: JimuMapView) => {
      const jimuLayerViewsLoaded = jimuMapView.getAllLoadedJimuLayerViews()
      const isSyncMode = syncToMapWidget(mapViewConfigList, activeJimuMapView.id)

      // filterd out all date-related layers
      const supportedLayerViews: { [lvId: string]: JimuLayerView } = {}
      jimuLayerViewsLoaded.forEach(layerView => {
         if (isSyncMode) { // keep all for sync mode
            if (!layerView.fromRuntime && isJimuLayerViewSupported(layerView)) {
               supportedLayerViews[layerView.id] = layerView
               createLayerDataSource(layerView)
            }
         } else { // keep selected for custom mode
            const configIds = mapViewConfigList?.[activeJimuMapView.id].layerConfigList.map(layerConfig => layerConfig.useDataSource.dataSourceId)
            if (configIds.includes(layerView.layerDataSourceId)) {
               supportedLayerViews[layerView.id] = layerView
               createLayerDataSource(layerView)
            }
         }
      })
      setLayerViews(supportedLayerViews)
   }

   const updateJimuTablesLoaded = async (jimuMapView: JimuMapView) => {
      const mapDs = jimuMapView.getMapDataSource()
      if (!mapDs) { // the mapDs could be null while mapView is ready.
         return
      }
      const loadedJimuTables = await jimuMapView.loadJimuTables()
      const isSyncMode = syncToMapWidget(mapViewConfigList, activeJimuMapView.id)

      // filterd out all date-related tables
      const supportedTables: { [tableId: string]: JimuTable } = {}
      loadedJimuTables.forEach(table => {
         const jimuTableId = table.id
         if (isSyncMode) { // keep all for sync mode
            if (isJimuTableSupported(table.table)) {
               supportedTables[jimuTableId] = table
               table.createTableDataSource()
            }
         } else { // keep selected for custom mode
            const configDsIds = mapViewConfigList?.[activeJimuMapView.id].layerConfigList.map(layerConfig => layerConfig.useDataSource.dataSourceId)
            if (configDsIds.includes(table.tableDataSourceId)) {
               supportedTables[jimuTableId] = table
               table.createTableDataSource()
            }
         }
      })
      setJimuTables(supportedTables)
   }

   // update layer/table useDataSources in sync mode
   React.useEffect(() => {
      const isSyncMode = activeJimuMapView && syncToMapWidget(mapViewConfigList, activeJimuMapView.id)
      if (!isSyncMode) {
         return
      }

      const useDssFromSyncMap: UseDataSource[] = []
      layerViews && Object.keys(layerViews).forEach(lvId => {
         const useDs = { dataSourceId: layerViews[lvId].layerDataSourceId } as UseDataSource
         useDssFromSyncMap.push(useDs)
      })
      jimuTables && Object.keys(jimuTables).forEach(tableId => {
         const useDs = { dataSourceId: jimuTables[tableId].tableDataSourceId } as UseDataSource
         useDssFromSyncMap.push(useDs)
      })
      setUseDataSourcesInMapSyncMode(Immutable(useDssFromSyncMap))
   }, [ mapViewConfigList, activeJimuMapView, layerViews, jimuTables])

   const createLayerDataSource = (layerView: JimuLayerView) => {
      if (mapViewDsIdRef.current) {
         layerView.createLayerDataSource()
      }
   }

   /**
   * Some rules:
   * 1. The widget will reset to the default state when:
   *    - Any changes to the data source, including the source mode is changed, sync to map widget mode is chanaged, and the selected layers are changed.
   *    - The options are changed.
   *    At the same time, the previous filters applied to the data sources should be cleared.
   * 2. The widget will keep the current state and only update the style UI when the filter style is changed.
   * 3. For performance popurse
   *    Only the created layer data sources will be applied when the widget is ready with `autoApply` mode, or pressing the `Apply` button manually.
   *    The other data sources will be applied automatically later when they are created successfully.
   */

   const hasData = useDataSources?.length || useMapWidgetIds?.length
   if (!hasData) {
      return (
         <Placeholder
            controllerWidgetId={controllerWidgetId}
            autoWidth={autoWidth}
            autoHeight={autoHeight}
         />
      )
   }

   const pickerStyle = (controllerWidgetId && filterStyle === FilterStyle.Icon) ? FilterStyle.Inline : filterStyle
   return (
      <div className={classNames('jimu-widget widget-date-filter', { 'overflow-auto': filterStyle === FilterStyle.Inline, 'p-1': filterStyle === FilterStyle.Input })}>
         {
            useMapWidgetIds?.length > 0 &&
            <JimuMapViewComponent
               useMapWidgetId={useMapWidgetIds[0]}
               onActiveViewChange={onActiveViewChange}
            />
         }
         {
            useDataSources?.length > 0 && useDataSources?.map((useDs) => {
               return (
                  <FilterDataSource
                     key={useDs.dataSourceId}
                     useDataSource={useDs}
                     onIsDataSourceNotReady={onIsDataSourceNotReady}
                     onCreateDataSourceCreatedOrFailed={onCreateDataSourceCreatedOrFailed}
                  />
               )
            })
         }
         <DatePicker
            label={label}
            icon={icon}
            style={pickerStyle}
            autoWidth={autoWidth}
            layoutId={layoutId}
            layoutItemId={layoutItemId}
            mode={selectionMode}
            defaultDay={defaultDay as any}
            autoApply={autoApply}
            version={datePickerVersion}
            clearVersion={clearVersion}
            onChange={onDatePickerChange}
         />
      </div>
   )
}
Widget.versionManager = versionManager

export default Widget
