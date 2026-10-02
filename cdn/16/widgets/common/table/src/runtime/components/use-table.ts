import {
  type DataRecord, React, hooks, lodash, type ClauseValuePair, DataSourceStatus,
  dataSourceUtils, Immutable, type FeatureDataRecord, CONSTANTS, ReactRedux, type IMState, loadArcGISMapComponents
} from 'jimu-core'
import * as reactiveUtils from 'esri/core/reactiveUtils'
import type { ResourceHandle } from 'esri/core/Handles'
import { EditModeType, LayerHonorModeType, type LayersConfig, PagingType, ResponsiveType, SelectionModeType, TableDataActionType } from '../../config'
import { getDataSourceById, getTableDataSource } from '../../utils'
import { constructTableTemplate, getDsAccessibleInfo, getIsAdvancedPermission, getTimezone } from './utils'
import type { JimuMapView } from 'jimu-arcgis'
import type FeatureLayer from 'esri/layers/FeatureLayer'
import type AttributeTableTemplate from 'esri/tables/AttributeTableTemplate'
import type SubtypeSublayer from 'esri/layers/support/SubtypeSublayer'
import type { MapViewOrSceneView } from 'esri/views/MapViewOrSceneView'
import { useTheme } from 'jimu-theme'

interface UseTableOptions {
  dataInvalid: boolean
  layerConfig: LayersConfig
  activeView: JimuMapView
  tableContainer: React.RefObject<HTMLDivElement>
  canEditFeature: boolean
  selectQueryFlag: boolean
  tableShowColumns: ClauseValuePair[]
  dataActionRecords: DataRecord[]
  selectionViewIds?: string
  maxCount?: number
  sourceVersion? : string | number
  isMapMode: boolean
  tableSelectAsyncDs: (selectedIds: Array<string | number>) => void
  isSelfEditing: React.RefObject<boolean>
  activeTabId: string
  respectMapRange: boolean
  pagingStyle: PagingType
  pageSize: number
  widgetId: string
  // options can be override
  usedConfig: any
  isActionDsReady: boolean
}

const useTable = (props: UseTableOptions): [HTMLArcgisFeatureTableElement, boolean, string, AttributeTableTemplate, boolean] => {
  const {
    dataInvalid, layerConfig, activeView, tableContainer, canEditFeature, selectQueryFlag,
    tableShowColumns, dataActionRecords, selectionViewIds, maxCount, sourceVersion, isMapMode,
    tableSelectAsyncDs, isSelfEditing, activeTabId, respectMapRange, pagingStyle, pageSize, widgetId, usedConfig, isActionDsReady
  } = props
  const theme = useTheme()
  const [tableUsedLayer, setTableUsedLayer] = React.useState<FeatureLayer | SubtypeSublayer>()
  const [attributeTableTemplate, setAttributeTableTemplate] = React.useState<AttributeTableTemplate>()
  const [layerEditable, setLayerEditable] = React.useState<boolean>(false)
  const [isTableEditing, setIsTableEditing] = React.useState<boolean>(false)
  const [tableLoaded, setTableLoaded] = React.useState<boolean>(false)
  const [tableQueryingOrSyncing, setTableQueryingOrSyncing] = React.useState<boolean>(false)
  const [initGeometry, setInitGeometry] = React.useState(null)
  const [mapComponentsReady, setMapComponentsReady] = React.useState<boolean>(false)

  const tableRef = React.useRef<HTMLArcgisFeatureTableElement>(null)
  const tableDblClickRef = React.useRef<any>(null)
  const tableClickFnRef = React.useRef<any>(null)
  const tableKeyDownFnRef = React.useRef<any>(null)
  const timerFn = React.useRef(null)
  const usedDsIdRef = React.useRef<string>('')
  const ds = getDataSourceById(layerConfig?.useDataSource?.dataSourceId || layerConfig?.dataActionDataSource?.id)
  const dataSource = getTableDataSource(ds)
  // In some cases, such as chart output ds, need to get the jsapiLayer when the status is unloaded, so need this variable as a dependency
  const dsInfoStatus = ReactRedux.useSelector((state: IMState) => {
    return state.dataSourcesInfo?.[dataSource?.id]?.status
  })
  const previousDsInfoStatus = hooks.usePrevious(dsInfoStatus)
  const statusReady = (previousDsInfoStatus !== DataSourceStatus.Unloaded) && (dsInfoStatus === DataSourceStatus.Unloaded)
  const isOutputDsStatusReady = (dataSource?.dataViewId === CONSTANTS.OUTPUT_DATA_VIEW_ID) && statusReady
  const previousSourceVersion = hooks.usePrevious(sourceVersion)

  const destroyTable = React.useCallback(() => {
    // destroyed is not exist in web component, when call destroy, all the dom is removed
    if (tableRef.current?.removeEventListener) {
      if (tableClickFnRef.current) tableRef.current.removeEventListener('arcgisCellClick', tableClickFnRef.current)
      if (tableDblClickRef.current) tableRef.current.removeEventListener('arcgisCellDblClick', tableDblClickRef.current)
      if (tableKeyDownFnRef.current) tableRef.current.removeEventListener('arcgisCellKeydown', tableKeyDownFnRef.current)
    }

    if (tableRef.current) {
      tableRef.current.destroy?.()
      tableRef.current = null
    }
    if (tableContainer.current) {
      tableContainer.current.innerHTML = ''
    }
  }, [tableContainer])

  React.useEffect(() => {
    return () => {
      destroyTable()
    }
  }, [destroyTable])

  React.useEffect(() => {
    let isMounted = true
    // Map components may not be loaded in layer mode (no map widget), which can leave arcgis-feature-table undefined.
    const customElReady = typeof window !== 'undefined' && !!window.customElements?.get('arcgis-feature-table')
    if (customElReady) {
      setMapComponentsReady(true)
      return
    }
    loadArcGISMapComponents().then(() => {
      if (isMounted) setMapComponentsReady(true)
    }).catch((err) => {
      console.error('loadArcGISMapComponents error', err)
    })

    return () => {
      isMounted = false
    }
  }, [])

  React.useEffect(() => {
    if (usedDsIdRef.current !== dataSource?.id) {
      setTableUsedLayer(undefined)
      setAttributeTableTemplate(null)
      if(tableRef.current) destroyTable()
    }
  }, [dataSource?.id, activeTabId, destroyTable])

  const setTableMaxSizeSafely = React.useCallback((tableWidget: HTMLArcgisFeatureTableElement, size: number | null) => {
    if (!tableWidget) return
    try {
      (tableWidget as any).maxSize = size
    } catch {
      // Avoid crashing the component tree when the table instance is transitioning during mode changes.
    }
  }, [])

  React.useEffect(() => {
    if (!dataSource) return
    const sourceVersionChanged = sourceVersion !== previousSourceVersion
    if (sourceVersionChanged && isSelfEditing.current) {
      // Skip one table rebuild/refresh cycle for self edits.
      isSelfEditing.current = false
      return
    }

    async function fetchDsGeometry () {
      let geometry = null
      try {
        const dsParam: any = dataSource?.getCurrentQueryParams()
        geometry = await dataSourceUtils.changeJimuArcGISQueryToJSAPIQuery(dataSource, Immutable(dsParam)).then(res => {
          if (res && res.geometry) {
            return res.geometry
          } else {
            return null
          }
        })
      } catch (err) {
        console.log(err)
      }
      return geometry
    }

    async function fetchLayer () {
      let response
      try {
        if (dataActionRecords?.length > 0) {
          const result = await dataSourceUtils.createJSAPIFeatureLayerByRecords(dataSource, dataActionRecords as FeatureDataRecord[])
          response = result.layer
        } else {
          response = await dataSource?.createJSAPILayerByDataSource() as FeatureLayer | SubtypeSublayer
        }
      } catch (err) {
        console.log(err)
      }
      return response
    }

    const dsGeometry = fetchDsGeometry()
    Promise.resolve(dsGeometry).then(geoRes => {
      setInitGeometry(geoRes)
      // get layer after geometry is ready
      if (isMapMode && !layerConfig?.dataActionObject) {
        const jimuLayerViews = activeView?.getAllJimuLayerViews()
        const jimuTables = activeView?.getJimuTables()
        const currentLayerView = jimuLayerViews?.find(layerView => {
          // layerViewId: 'widget_1-dataSource_4-187938b7328-layer-2'
          // dsId: 'dataSource_4-187938b7328-layer-2'
          // layerDataSourceId: 'dataSource_4-187938b7328-layer-2'
          return layerView.layerDataSourceId === layerConfig?.useDataSource?.dataSourceId
        })
        const currentTableLayerView = jimuTables?.find(jimuTable => {
          const tableLayerId = jimuTable.id
          const prefixIndex = tableLayerId.indexOf('-')
          const tableLayerConfigId = tableLayerId.substring(prefixIndex + 1)
          return tableLayerConfigId === layerConfig?.useDataSource?.dataSourceId
        })
        const layerType = currentLayerView?.layer?.type
        const supportedLayerTypes = ['feature', 'subtype-sublayer', 'knowledge-graph-sublayer', 'sublayer']
        const isUnsupportedLayerType = !layerType || !supportedLayerTypes.includes(layerType)
        // activeView changed but layerConfig has not changed yet
        if (!currentLayerView && !currentTableLayerView) return
        // currentLayerView not exist: table layer or other special situation
        if ((!currentLayerView && currentTableLayerView) || isUnsupportedLayerType) {
          const usedLayer = fetchLayer()
          Promise.resolve(usedLayer).then(res => {
            setTableUsedLayer(res)
            const attributeTemplate = res?.attributeTableTemplate ? JSON.parse(JSON.stringify(res.attributeTableTemplate)) : null
            setAttributeTableTemplate(attributeTemplate)
          })
        } else {
          const mapLayer = currentLayerView?.layer as FeatureLayer | SubtypeSublayer
          setTableUsedLayer(mapLayer)
          const attributeTemplate = mapLayer?.attributeTableTemplate ? JSON.parse(JSON.stringify(mapLayer.attributeTableTemplate)) : null
          setAttributeTableTemplate(attributeTemplate)
        }
      } else {
        const usedLayer = fetchLayer()
        Promise.resolve(usedLayer).then(res => {
          setTableUsedLayer(res)
          const attributeTemplate = res?.attributeTableTemplate ? JSON.parse(JSON.stringify(res.attributeTableTemplate)) : null
          setAttributeTableTemplate(attributeTemplate)
        })
      }
    })
    usedDsIdRef.current = dataSource?.id
  }, [dataSource, isActionDsReady, sourceVersion, previousSourceVersion, activeView, isMapMode, isSelfEditing, layerConfig?.useDataSource?.dataSourceId,
    layerConfig?.dataActionObject, isOutputDsStatusReady, dataActionRecords, selectionViewIds
  ])

  React.useEffect(() => {
    const tableWidget = tableRef.current
    if (tableWidget) setTableMaxSizeSafely(tableWidget, maxCount)
  }, [maxCount, setTableMaxSizeSafely])

  React.useEffect(() => {
    if (typeof canEditFeature !== 'boolean') return
    async function checkLayerEditable () {
      // view in table: edit is meaningless
      if (layerConfig?.dataActionType === TableDataActionType.View) {
        setLayerEditable(false)
        return
      }
      // fetch to confirm whether it's a public source
      const accessible = await getDsAccessibleInfo(tableUsedLayer?.url)
      const isAdvancedPermission = await getIsAdvancedPermission(dataSource)
      // full editing privileges
      const fullEditingPrivileges = (tableUsedLayer as any)?.userHasFullEditingPrivileges
      // check layer capabilities for delete operation
      const layerEditingEnabled = tableUsedLayer?.editingEnabled ?? true
      const isHonorWebmap = layerConfig?.layerHonorMode === LayerHonorModeType.Webmap
      const isHonorTableSettings = layerConfig?.layerHonorMode === LayerHonorModeType.MapTable
      const canEdit = accessible || canEditFeature
      const normalEditPermission = (isHonorWebmap || isHonorTableSettings) ? canEdit : layerConfig?.enableEdit && canEdit
      let editable
      if (isAdvancedPermission || (fullEditingPrivileges && layerEditingEnabled)) {
        editable = true
      } else if (fullEditingPrivileges && !layerEditingEnabled) {
        editable = false
      } else {
        editable = normalEditPermission
      }
      setLayerEditable(editable)
    }
    checkLayerEditable()
  }, [tableUsedLayer, canEditFeature, dataSource, layerConfig])

  const resetTableExpression = React.useCallback(() => {
    const tableWidget = tableRef.current
    if (tableWidget?.layer) {
      const curQuery: any = dataSource && dataSource.getCurrentQueryParams()
      const sqlExpression = curQuery.where
      const tableInstance = tableWidget as any
      tableInstance.definitionExpression = sqlExpression
    }
  }, [dataSource])

  const bindTableClickEvent = React.useCallback(() => {
    const tableWidget = tableRef.current
    const selectMode = usedConfig?.selectMode
    if (!selectMode || !tableWidget) return
    // remove previous handler
    if (tableClickFnRef.current && tableWidget?.removeEventListener) {
      tableWidget.removeEventListener('arcgisCellClick', tableClickFnRef.current)
      tableClickFnRef.current = null
    }

    const rowClickFn = (event) => {
      if (!event.detail) return
      const { feature, objectId: thisId } = event.detail
      // click none-content cell (ed. title)
      if (!feature) return
      // edit mode cancel cell-click
      if (isTableEditing) return
      const originalSelected = tableWidget.highlightIds
      // Delay click function
      clearTimeout(timerFn.current)
      timerFn.current = setTimeout(() => {
        const objectId = thisId || feature.getObjectId()
        const thisSelected = originalSelected.includes(objectId)
        // attachment also has a row-click event, cause sth unexpected
        const isAttachmentEditing = (tableWidget as any).attachmentsViewOptions.objectId
        const isRelatedTable = tableWidget.relatedTable
        if (!isAttachmentEditing && !isRelatedTable) {
          if (selectMode === SelectionModeType.Single) {
            tableWidget.highlightIds.removeAll()
          }
          thisSelected
            ? tableWidget.highlightIds.remove(objectId)
            : tableWidget.highlightIds.add(objectId)
          const selectedIds = tableWidget.highlightIds?.toArray()
          if (selectedIds?.length === 0) {
            if (selectQueryFlag) tableWidget.filterBySelectionEnabled = false
            resetTableExpression()
          }
          tableSelectAsyncDs(selectedIds)
        } else {
          tableSelectAsyncDs([thisId || feature.getObjectId()])
        }
      }, 200)
    }
    tableClickFnRef.current = rowClickFn
    if (!isTableEditing) tableWidget.addEventListener('arcgisCellClick', rowClickFn)
    // dblclick cancel click event
    if (tableDblClickRef.current && tableWidget?.removeEventListener) {
      tableWidget.removeEventListener('arcgisCellDblClick', tableDblClickRef.current)
      tableDblClickRef.current = null
    }
    if (tableDblClickRef.current?.remove) tableDblClickRef.current.remove()
    const dblClickFn = () => {
      clearTimeout(timerFn.current)
    }
    tableDblClickRef.current = dblClickFn
    tableWidget.addEventListener('arcgisCellDblClick', dblClickFn)
  }, [isTableEditing, usedConfig?.selectMode, resetTableExpression, selectQueryFlag, tableSelectAsyncDs])

  const bindTableKeyDownEvent = React.useCallback(() => {
    const tableWidget = tableRef.current
    const selectMode = usedConfig?.selectMode
    if (!selectMode || !tableWidget) return
    // remove previous handler
    if (tableKeyDownFnRef.current && tableWidget?.removeEventListener) {
      tableWidget.removeEventListener('arcgisCellKeydown', tableKeyDownFnRef.current)
      tableKeyDownFnRef.current = null
    }

    const keyDownFn = (event) => {
      if (!event.detail) return
      const { feature, native, objectId: thisId } = event.detail
      // click none-content cell (ed. title)
      if (!feature) return
      // edit mode cancel cell-click
      if (isTableEditing) return
      const keyCode = native.keyCode
      // use shift+space key to select, enter key is used for enter edit mode(api)
      if (native.shiftKey && keyCode === 32) {
        const originalSelected = tableWidget.highlightIds
        const objectId = thisId || feature.getObjectId()
        const thisSelected = originalSelected.includes(objectId)
        // attachment also has a row-click event, cause sth unexpected
        const notAttachmentEditing = !(tableWidget as any).attachmentsViewOptions.objectId
        if (notAttachmentEditing) {
          if (selectMode === SelectionModeType.Single) {
            tableWidget.highlightIds.removeAll()
          }
          thisSelected
            ? tableWidget.highlightIds.remove(objectId)
            : tableWidget.highlightIds.add(objectId)
          const selectedIds = tableWidget.highlightIds?.toArray()
          if (selectedIds?.length === 0) {
            if (selectQueryFlag) tableWidget.filterBySelectionEnabled = false
            resetTableExpression()
          }
          tableSelectAsyncDs(selectedIds)
        } else {
          tableSelectAsyncDs([thisId || feature.getObjectId()])
        }
      }
    }
    tableKeyDownFnRef.current = keyDownFn
    if (!isTableEditing) tableWidget.addEventListener('arcgisCellKeydown', keyDownFn)
  }, [isTableEditing, usedConfig?.selectMode, resetTableExpression, selectQueryFlag, tableSelectAsyncDs])

  React.useEffect(() => {
    if (usedConfig?.enableSelect) {
      bindTableClickEvent()
      bindTableKeyDownEvent()
    } else {
      const tableWidget = tableRef.current
      if (tableClickFnRef.current && tableWidget?.removeEventListener) {
        tableWidget.removeEventListener('arcgisCellClick', tableClickFnRef.current)
        tableClickFnRef.current = null
      }
      if (tableKeyDownFnRef.current && tableWidget?.removeEventListener) {
        tableWidget.removeEventListener('arcgisCellKeydown', tableKeyDownFnRef.current)
        tableKeyDownFnRef.current = null
      }
      if (tableDblClickRef.current && tableWidget?.removeEventListener) {
        tableWidget.removeEventListener('arcgisCellDblClick', tableDblClickRef.current)
        tableDblClickRef.current = null
      }
    }
  }, [usedConfig?.enableSelect, isTableEditing, bindTableClickEvent, bindTableKeyDownEvent])

  const updateTableByConfig = React.useCallback((configChange?: boolean) => {
    const tableWidget = tableRef.current
    if (!layerConfig || !tableWidget) return
    const tableTemplate = constructTableTemplate(dataSource, layerConfig, usedConfig, tableShowColumns, attributeTableTemplate, configChange)
    const templateChange = !lodash.isDeepEqual(tableWidget.tableTemplate?.columnTemplates, tableTemplate?.columnTemplates)
    if (configChange || templateChange) tableWidget.tableTemplate = tableTemplate
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataSource, layerConfig, usedConfig, attributeTableTemplate])

  const updateTableCssVars = React.useCallback(() => {
    const tableWidget = tableRef.current
    if (!tableWidget) return
    tableWidget.style.setProperty('--calcite-color-brand', theme.sys.color.action.selected.default)
    tableWidget.style.setProperty('--calcite-color-foreground-1', `color-mix(in srgb, ${theme.sys.color.surface.paper} 80%, white)`)
    tableWidget.style.setProperty('--calcite-color-foreground-2', `color-mix(in srgb, ${theme.sys.color.action.selected.default} 50%, white)`)
    // indicators
    tableWidget.style.setProperty('--vaadin-text-color-disabled', theme.sys.color.surface.paperText)
    // indicators hover
    tableWidget.style.setProperty('--vaadin-text-color', `color-mix(in srgb, ${theme.sys.color.surface.paperText} 50%, white)`)
    // attachment
    tableWidget.style.setProperty('--calcite-button-text-color', theme.sys.color.surface.paperText)
    // arcade column hight
    tableWidget.style.setProperty('--calcite-font-line-height-fixed-xl', '28px')
    // cell border: var(--calcite-color-border-2): --sys-color-divider-secondary
    tableWidget.style.setProperty('--calcite-color-foreground-3', theme.sys.color.divider.secondary)
    // tableWidget.style.setProperty('--calcite-internal-button-background-color', theme.sys.color.surface.paper)
    // attachment list background color
    tableWidget.style.setProperty('--calcite-list-background-color', `color-mix(in srgb, ${theme.sys.color.surface.paper} 80%, white)`)
    tableWidget.style.setProperty('--calcite-list-background-color-hover', `color-mix(in srgb, ${theme.sys.color.surface.paper} 80%, transparent)`)
    // content link
    tableWidget.style.setProperty('--calcite-color-text-link', theme.sys.color.surface.paperText)
    // reset and attachment button
    tableWidget.style.setProperty('--calcite-color-brand-hover', `color-mix(in srgb, ${theme.sys.color.action.selected.default} 50%, white)`)
    // sort button & sort dropdown
    tableWidget.style.setProperty('--calcite-action-text-color', theme.sys.color.surface.paperText)
    tableWidget.style.setProperty('--calcite-dropdown-item-text-color', theme.sys.color.surface.paperText)

    // New API vars
     /** Text **/
    tableWidget.style.setProperty('--arcgis-internal-feature-table-text-color', theme.sys.color.surface.paperText)
    tableWidget.style.setProperty('--arcgis-internal-feature-table-text-color-hover', theme.sys.color.action.selected.text)
    /** Row background **/
    tableWidget.style.setProperty('--arcgis-internal-feature-table-row-background-color', `color-mix(in srgb, ${theme.sys.color.surface.paper} 80%, white)`)
    tableWidget.style.setProperty('--arcgis-internal-feature-table-row-background-color-hover', `color-mix(in srgb, ${theme.sys.color.action.selected.default} 50%, white)`)
    /** Selected row text **/
    tableWidget.style.setProperty('--arcgis-internal-feature-table-selected-row-text-color', theme.sys.color.action.selected.text)
    tableWidget.style.setProperty('--arcgis-internal-feature-table-selected-row-text-color-hover', theme.sys.color.action.selected.text)
    /** Selected row background **/
    /** background: 10% primary, hover: 20% primary **/
    tableWidget.style.setProperty('--arcgis-internal-feature-table-selected-row-background-color-primary', 'white')
    tableWidget.style.setProperty('--arcgis-internal-feature-table-selected-row-background-color-secondary', theme.sys.color.action.selected.default)
    /** Header font setting **/
    if (usedConfig?.headerFontSetting?.fontSize) {
      tableWidget.style.setProperty('--vaadin-grid-header-font-size', `${usedConfig?.headerFontSetting?.fontSize}px`)
    } else {
      tableWidget.style.removeProperty('--vaadin-grid-header-font-size')
    }
    if (usedConfig?.headerFontSetting?.bold) {
      tableWidget.style.setProperty('--arcgis-internal-feature-table-column-header-text-font-weight', 'bold')
    } else {
      tableWidget.style.removeProperty('--arcgis-internal-feature-table-column-header-text-font-weight')
    }
    if (usedConfig?.headerFontSetting?.color) {
      tableWidget.style.setProperty('--arcgis-internal-feature-table-column-header-text-color', usedConfig?.headerFontSetting?.color)
    } else {
      tableWidget.style.removeProperty('--arcgis-internal-feature-table-column-header-text-color')
    }
    // override header column background default color
    tableWidget.style.setProperty('--arcgis-internal-feature-table-column-header-background-color', theme.sys.color.surface.paper)
    if (usedConfig?.headerFontSetting?.backgroundColor) {
      tableWidget.style.setProperty('--arcgis-internal-feature-table-column-header-background-color', usedConfig?.headerFontSetting?.backgroundColor)
      tableWidget.style.setProperty('--arcgis-internal-feature-table-column-header-sorted-background-color', usedConfig?.headerFontSetting?.backgroundColor)
    } else {
      tableWidget.style.setProperty('--arcgis-internal-feature-table-column-header-background-color', theme.sys.color.surface.paper)
      tableWidget.style.setProperty('--arcgis-internal-feature-table-column-header-sorted-background-color', theme.sys.color.surface.paper)
    }
    /** Related record **/
    tableWidget.style.setProperty('--arcgis-internal-feature-table-background-color', theme.sys.color.surface.paper)
    tableWidget.style.setProperty('--arcgis-internal-feature-table-background-color-secondary', theme.sys.color.surface.paper)
    tableWidget.style.setProperty('--calcite-switch-handle-background-color', theme.sys.color.action.inputField.text)
    tableWidget.style.setProperty('--calcite-switch-background-color', theme.sys.color.action.inputField.default)
    tableWidget.style.setProperty('--calcite-switch-background-color-hover', theme.sys.color.action.hover)
    /** Pagination **/
    tableWidget.style.setProperty('--calcite-color-text-1', theme.sys.color.surface.paperText)
    tableWidget.style.setProperty('--calcite-color-text-3', theme.sys.color.surface.paperHint)
  }, [theme, usedConfig?.headerFontSetting])

  const updateTableColumns = React.useCallback(() => {
    const tableWidget = tableRef.current
    if (!layerConfig?.columnSetting || !tableWidget) return
    // Related data/attachment width
    const columnSetting = layerConfig.columnSetting
    const isFixed = columnSetting?.responsiveType === ResponsiveType.Fixed
    if (isFixed) {
      const fixedWidth = columnSetting.columnWidth || 200
      const tableColumns = tableWidget.columns?.toArray() || []
      tableColumns.forEach((column, index) => {
        const useColumn = column as any
        const isAttachments = useColumn.fieldName === 'EsriFeatureTableAttachmentsColumn'
        const isRelationShip = useColumn.fieldName.indexOf('EsriFeatureTableRelationshipColumn') >= 0
        if (isAttachments || isRelationShip) {
          setTimeout(() => {
            (tableRef.current.columns.toArray()[index] as any).width = fixedWidth
          }, 200)
        }
      })
    }
  }, [layerConfig?.columnSetting])

  React.useEffect(() => {
    if (tableLoaded) updateTableByConfig()
  }, [tableLoaded, updateTableByConfig])

  React.useEffect(() => {
    if (tableLoaded && !tableQueryingOrSyncing) updateTableColumns()
  }, [tableLoaded, tableQueryingOrSyncing, updateTableColumns])

  const { enableRelatedRecords, enableAttachments, enableSelect, editMode } = usedConfig
  const previousLayerConfig = hooks.usePrevious(layerConfig)
  const previousUsedConfig = hooks.usePrevious(usedConfig)
  const prevEnableRelatedRecords = hooks.usePrevious(enableRelatedRecords)
  const prevEnableAttachments = hooks.usePrevious(enableAttachments)
  const prevEditMode = hooks.usePrevious(editMode)
  const previousTableUsedLayer = hooks.usePrevious(tableUsedLayer)
  const prevPagingStyle = hooks.usePrevious(pagingStyle)
  const prevPageSize = hooks.usePrevious(pageSize)
  const preViousLayerEditable = hooks.usePrevious(layerEditable)

  const updateDataSourceEvent = React.useCallback((event) => {
    // only update data source when editing
    if (!tableRef.current?.isQueryingOrSyncing) return
    const { updatedFeatures, deletedFeatures } = event
    // There is no 'add' in api for now
    const updates = updatedFeatures && updatedFeatures.length > 0
    const deletes = deletedFeatures && deletedFeatures.length > 0
    if (!updates && !deletes) return
    // Mark source changes from table edits as self-edit.
    isSelfEditing.current = true

    if (updates) {
      const updateFeature = event?.edits?.updateFeatures?.[0]
      if (updateFeature) {
        const record = dataSource.buildRecord(updateFeature)
        dataSource.afterUpdateRecord(record)
      }
    }
    if (deletes) {
      const deleteFeatures = event?.edits?.deleteFeatures
      if (deleteFeatures?.length > 0) {
        const deleteIds = []
        deleteFeatures.forEach(deleteFeature => {
          const record = dataSource.buildRecord(deleteFeature)
          deleteIds.push(record.getId())
        })
        dataSource.afterDeleteRecordsByIds(deleteIds)
      }
    }
  }, [dataSource, isSelfEditing])

  if (dataInvalid) {
    if (tableUsedLayer) setTableUsedLayer(undefined)
    if (tableRef.current) destroyTable()
  } else {
    if (tableContainer.current && dataSource && tableUsedLayer && mapComponentsReady) {
      // for same ds different tab
      const activeChange = (layerConfig.id !== previousLayerConfig?.id)
        && (layerConfig?.useDataSource?.dataSourceId === previousLayerConfig?.useDataSource?.dataSourceId)
      const configChange = !lodash.isDeepEqual(layerConfig, previousLayerConfig) || !lodash.isDeepEqual(usedConfig, previousUsedConfig)
      const layerChange = !lodash.isDeepEqual(tableUsedLayer, previousTableUsedLayer)
      if (!tableRef.current || layerChange || activeChange) {
        destroyTable()
        tableRef.current = document.createElement('arcgis-feature-table')
        tableRef.current.classList.add(`exb-table-${widgetId}`)
        tableRef.current.layer = tableUsedLayer as any
        // During the api migration process, for unknown reasons, this attribute cannot be used
        if (activeView?.view) tableRef.current.view = activeView.view as unknown as MapViewOrSceneView
        if (maxCount) setTableMaxSizeSafely(tableRef.current, maxCount)
        tableRef.current.hideColumnDescriptions = true
        tableRef.current.paginationEnabled = pagingStyle === PagingType.Multiple
        tableRef.current.pageSize = pageSize || 50
        tableRef.current.attachmentsEnabled = enableAttachments
        tableRef.current.relatedRecordsEnabled = enableRelatedRecords
        setTableMaxSizeSafely(tableRef.current, null)
        // visibleElements
        tableRef.current.hideHeader = true
        tableRef.current.hideSelectionColumn = true
        // other settings
        tableRef.current.multipleSortEnabled = true
        tableRef.current.tableTemplate = constructTableTemplate(dataSource, layerConfig, usedConfig, tableShowColumns, attributeTableTemplate)
        tableRef.current.editingEnabled = layerEditable
        tableRef.current.timeZone = getTimezone(dataSource)
        // init extent filter
        tableRef.current.filterGeometry = initGeometry
        tableRef.current.autoSaveDisabled = editMode === EditModeType.Multiple
        tableRef.current.autoRefreshDisabled = true
        // theme var
        updateTableCssVars()
        tableContainer.current.appendChild(tableRef.current)
        // click event
        if (enableSelect) {
          bindTableClickEvent()
          bindTableKeyDownEvent()
        } else {
          const tableWidget = tableRef.current
          if (tableClickFnRef.current && tableWidget?.removeEventListener) {
            tableWidget.removeEventListener('arcgisCellClick', tableClickFnRef.current)
            tableClickFnRef.current = null
          }
          if (tableKeyDownFnRef.current && tableWidget?.removeEventListener) {
            tableWidget.removeEventListener('arcgisCellKeydown', tableKeyDownFnRef.current)
            tableKeyDownFnRef.current = null
          }
          if (tableDblClickRef.current && tableWidget?.removeEventListener) {
            tableWidget.removeEventListener('arcgisCellDblClick', tableDblClickRef.current)
            tableDblClickRef.current = null
          }
        }
      }
      const tableWidget = tableRef.current
      if (layerEditable !== preViousLayerEditable) {
        tableWidget.editingEnabled = layerEditable
      }
      if (prevEnableAttachments !== enableAttachments) {
        tableWidget.attachmentsEnabled = enableAttachments
        updateTableByConfig(true)
      }
      if (prevEnableRelatedRecords !== enableRelatedRecords) {
        tableWidget.relatedRecordsEnabled = enableRelatedRecords
        updateTableByConfig(true)
      }
      if (prevEditMode !== editMode) {
        const hasPendingEdits = tableWidget.hasPendingEdits
        if (hasPendingEdits) {
          tableWidget.discardPendingEdits()
        }
        tableWidget.autoSaveDisabled = editMode === EditModeType.Multiple
      }
      if (prevPagingStyle !== pagingStyle) {
        tableWidget.paginationEnabled = pagingStyle === PagingType.Multiple
      }
      if (prevPageSize !== pageSize) {
        tableWidget.pageSize = pageSize || 50
      }
      if (layerConfig && (layerConfig.id === previousLayerConfig?.id) && configChange) {
        updateTableByConfig(true)
      }
    }
  }

  React.useEffect(() => {
    updateTableCssVars()
  },[updateTableCssVars])

  // bind update ds event when tableUsedLayer changed
  React.useEffect(() => {
    let handle: ResourceHandle
    if (!tableUsedLayer) return
    if (tableUsedLayer.type === 'subtype-sublayer') {
      const subtypeGrouplayer = tableUsedLayer.parent
      if (subtypeGrouplayer.on) {
        handle = subtypeGrouplayer.on('edits', updateDataSourceEvent)
      }
    } else {
      if (tableUsedLayer.on) {
        handle = tableUsedLayer.on('edits', updateDataSourceEvent)
      }
    }
    // unbind the previous layer's event when tableUsedLayer changed
    return () => {
      handle?.remove()
    }
  },[tableUsedLayer, updateDataSourceEvent])

  const table = tableRef.current
  React.useEffect(() => {
    if (!table) return
    const syncTableRuntimeState = () => {
      setTableLoaded(table.state === 'loaded')
      setTableQueryingOrSyncing(!!table.isQueryingOrSyncing)
      const relatedTable = table.relatedTable
      if (relatedTable) {
        relatedTable.visibleElements.selectionColumn = false
      }
    }

    const onTablePropertyChange = (event: CustomEvent) => {
      const propertyName = event?.detail?.name
      if (!propertyName || propertyName === 'state' || propertyName === 'isQueryingOrSyncing' || propertyName === 'relatedTable') {
        syncTableRuntimeState()
      }
    }

    syncTableRuntimeState()
    table.addEventListener?.('arcgisPropertyChange', onTablePropertyChange as EventListener)

    return () => {
      table.removeEventListener?.('arcgisPropertyChange', onTablePropertyChange as EventListener)
    }
  }, [table])

  React.useEffect(() => {
    if (!table || !tableLoaded) return
    const watchTableEditing = reactiveUtils.watch(() => {
      const columns = table.allColumns?.length > 0 ? table.allColumns : table.columns?.toArray()
      return columns?.some(column => !!((column as any).editing || (column as any).editInfo)) || false
    }, editing => {
      setIsTableEditing(editing)
    }, { initial: true, sync: true })

    return () => {
      watchTableEditing?.remove()
    }
  }, [table, tableLoaded])

  // scale range listener
  React.useEffect(() => {
    let watchRendered: ResourceHandle
    if (!table) return
    const curMaxCount = dataSource?.getMaxRecordCount()
    if (respectMapRange) {
      const jimuLayerViews = activeView?.getAllJimuLayerViews()
      const currentLayerView = jimuLayerViews?.find(layerView => {
        return layerView.layerDataSourceId === layerConfig?.useDataSource?.dataSourceId
      })
      if (!currentLayerView) {
        if (table) setTableMaxSizeSafely(table, curMaxCount)
        return
      }
      watchRendered = reactiveUtils.watch(() => currentLayerView?.isLayerVisibleForRendering(), (rendered) => {
        if (rendered) {
          if (table) setTableMaxSizeSafely(table, curMaxCount)
        } else {
          if (table) setTableMaxSizeSafely(table, 0)
        }
      }, { initial: true, sync: true })
    } else {
      if (table) setTableMaxSizeSafely(table, curMaxCount)
    }

    return () => {
      watchRendered?.remove()
    }
  }, [table, dataSource, respectMapRange, activeView, layerConfig?.useDataSource?.dataSourceId, setTableMaxSizeSafely])

  return [tableRef.current, tableLoaded, usedDsIdRef.current, attributeTableTemplate, tableQueryingOrSyncing]
}

export default useTable
