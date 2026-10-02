/** @jsx jsx */
import { jsx, React, classNames, AppMode, hooks, ReactRedux, lodash, defaultMessages as jimuCoreDefaultMessage } from 'jimu-core'
import type { DataRecord, UseDataSource, ImmutableArray, IMState } from 'jimu-core'
import { DistanceUnits, defaultMessages as jimuUiDefaultMessage } from 'jimu-ui'
import { ListLayoutType, Status, SelectionModeType, DYNAMIC_ROW_MIN_HEIGHT } from '../../../config'
import type { ListProps, ElementSize, ListItemData, AllRows, VisibleRows, VisibleCells, AllCells, ItemsRenderedOptions } from '../../../config'
import { getItemRowCount, getItemColumnCount, getItemSize } from '../../utils/list-element-util'
import { checkIsEditing, getCardSizeWidthUnitInConfig, getShouldUseDynamicRowHeight, intersectionObserver, recordToJSON } from '../../utils/utils'
import { List, Grid, useGridCallbackRef, useListCallbackRef, getScrollbarSize, useDynamicRowHeight } from 'react-window'
import { useTheme } from 'jimu-theme'
import defaultMessages from '../../translations/default'
import ListItem from './list-item'
import { LinkContainer } from 'jimu-ui/advanced/link-container'
import { useListRuntimeDispatch, useListRuntimeState } from '../../state'

const { useRef, useEffect, useState, Fragment } = React

interface Props {
  listProps: ListProps
  useDataSources: ImmutableArray<UseDataSource>
  LayoutEntry: any
  hideCardTool: boolean
  toggleCardTool: (hide?: boolean) => void
  handleListScroll: (uIEventHandler) => void
  setListOutDivRef: (ref: any) => void
  handleResizeCard: (newCardSize, resizeEnd?: boolean, isTop?: boolean, isLeft?: boolean, isReplace?: boolean) => void
  onItemsRendered: (option: ItemsRenderedOptions) => void
  setListRef: (ref) => void
  scrollToEndCallback: (isScrollEnd: boolean) => void
  selectRecordsAndPublishMessageAction: (records: DataRecord[]) => void
  getListSize: () => ElementSize
  handleListKeyUp: (e) => void
}

const ListComponent = (props: Props) => {
  const theme = useTheme()
  const nls = hooks.useTranslation(defaultMessages, jimuUiDefaultMessage, jimuCoreDefaultMessage)
  const listOutDivRef = useRef<HTMLDivElement>(null)
  const canClickLinkRef = useRef(true)
  const browserSizeModeRef = useRef(null)
  const appModeRef = useRef(null)
  const isScrollEndRef = useRef(false)
  const propsOfListItemRef = useRef({} as any)
  const recordsJSONRef = useRef(null)

  const listRuntimeDispatch = useListRuntimeDispatch()
  const { dataSource, records, currentCardSize, widgetRect, pageSize, showLoading, isShowEditingMask, scrollBarSize: scrollBarSizeInState } = useListRuntimeState()


  const dynamicRowHeight = useDynamicRowHeight({
    defaultRowHeight: 50
  })

  const browserSizeMode = ReactRedux.useSelector((state: IMState) => state?.browserSizeMode)
  const queryObject = ReactRedux.useSelector((state: IMState) => state?.queryObject)
  const appMode = ReactRedux.useSelector((state: IMState) => state?.appRuntimeInfo?.appMode)
  const isRTL = ReactRedux.useSelector((state: IMState) => state.appContext.isRTL)

  browserSizeModeRef.current = browserSizeMode
  appModeRef.current = appMode

  const { useDataSources, listProps, hideCardTool, LayoutEntry } = props
  const { id, config, selectionIsInSelf, builderStatus, builderSupportModules } = listProps
  const { handleListScroll, handleResizeCard, handleListKeyUp, selectRecordsAndPublishMessageAction, toggleCardTool, setListOutDivRef, onItemsRendered, setListRef, scrollToEndCallback } = props

  const [hoverIndex, setHoverIndex] = useState(-1)
  const [grid, setGrid] = useGridCallbackRef(null)
  const [list, setList] = useListCallbackRef(null)
  const [scrollBarSize] = useState(getScrollbarSize)

  const shouldUseDynamicRowHeight = React.useMemo(() => {
    return getShouldUseDynamicRowHeight(config?.layoutType, config?.autoHeight, config?.itemStyle)
  }, [config?.layoutType, config?.autoHeight, config?.itemStyle])

  const handleItemChange = React.useCallback((itemRecord: DataRecord) => {
    if (!dataSource || !itemRecord || !itemRecord?.getId) return

    let selectedRecords = dataSource.getSelectedRecords() || []
    if (
      config.cardConfigs[Status.Selected].selectionMode &&
      config.cardConfigs[Status.Selected].selectionMode !==
      SelectionModeType.None
    ) {
      const recordId = itemRecord?.getId()
      const record = selectedRecords.find(record => record.getId() === recordId)
      if (config.cardConfigs[Status.Selected].selectionMode === SelectionModeType.Single) {
        if (record) {
          selectRecordsAndPublishMessageAction([])
          listRuntimeDispatch({type: 'SET_SHOW_SELECTION_ONLY', value: false})
        } else {
          selectRecordsAndPublishMessageAction([itemRecord])
        }
      } else {
        if (record) {
          selectedRecords = selectedRecords.filter(
            record => record.getId() !== recordId
          )
        } else {
          selectedRecords = selectedRecords.concat([itemRecord])
        }
        selectRecordsAndPublishMessageAction(selectedRecords)
      }
    }
  }, [config, dataSource, listRuntimeDispatch, selectRecordsAndPublishMessageAction])

  const updateCanClickLinkWhenClickItem = React.useCallback((itemRecord: DataRecord) => {
    if (!dataSource || !itemRecord || !itemRecord?.getId) return
    const selectedRecords = dataSource.getSelectedRecords() || []
    if (config.cardConfigs[Status.Selected].selectionMode && config.cardConfigs[Status.Selected].selectionMode !== SelectionModeType.None) {
      const recordId = itemRecord?.getId()
      const recordHasBeenSelected = selectedRecords.find(record => record.getId() === recordId)
      if (recordHasBeenSelected) {
        canClickLinkRef.current = false
      } else {
        canClickLinkRef.current = true
      }
    }
  }, [dataSource, config])


  const isEditing = React.useCallback((listProps: ListProps): boolean => {
    const { config, selectionIsInSelf, selectionIsSelf } = listProps
    return checkIsEditing(appMode, config, selectionIsSelf, selectionIsInSelf)
  }, [appMode])

  const handleListMouseLeave = React.useCallback(() => {
    if (isEditing(listProps)) return
    setHoverIndex(-1)
  }, [isEditing, listProps])

  const handleListMouseMove = React.useCallback((itemIndex: number) => {
    if (isEditing(listProps)) return
    if (itemIndex === hoverIndex) return
    setHoverIndex(itemIndex)
  }, [hoverIndex, isEditing, listProps])

  const getCardSizeWidthUnitByConfig = React.useCallback(() => {
    return getCardSizeWidthUnitInConfig(config, builderStatus, browserSizeMode)
  }, [config, builderStatus, browserSizeMode])

  const selectSelf = React.useCallback(() => {
    window.jimuConfig.isInBuilder && builderSupportModules.widgetModules.selectSelf(id)
  }, [builderSupportModules, id])

  const selectCard = React.useCallback(() => {
    if (selectionIsInSelf) {
      selectSelf()
    }
  }, [selectSelf, selectionIsInSelf])

  const setDynamicRowHeight = React.useCallback((height: number) => {
    const newHeight = Math.max(height, DYNAMIC_ROW_MIN_HEIGHT)
    listRuntimeDispatch({ type: 'SET_DYNAMIC_ROW_HEIGHT', value: newHeight })
  }, [listRuntimeDispatch])

  const otherProps = React.useMemo(() => {
    const { id, config, builderSupportModules, layouts } = listProps
    const isWidthPercentage = getCardSizeWidthUnitByConfig()?.width?.unit === DistanceUnits.PERCENTAGE
    return {
      id: id,
      widgetId: id,
      config: config,
      recordLength: records?.length || 0,
      widgetRect: widgetRect,
      currentCardSize: currentCardSize,
      useDataSources: useDataSources,
      handleListMouseMove: handleListMouseMove,
      handleListMouseLeave: handleListMouseLeave,

      browserSizeMode: browserSizeModeRef.current,
      isRTL: isRTL,
      builderSupportModules: builderSupportModules,
      interact: window.jimuConfig.isInBuilder && builderSupportModules?.widgetModules?.interact,
      appMode: appModeRef.current,
      theme: theme,
      LayoutEntry: LayoutEntry,
      layouts: layouts,
      datasourceId: dataSource?.id,
      isWidthPercentage: isWidthPercentage,
      formatMessage: nls,
      selectCard: selectCard,
      handleResizeCard: handleResizeCard,
      onChange: handleItemChange,
      updateCanClickLinkWhenClickItem: updateCanClickLinkWhenClickItem,
      toggleCardTool: toggleCardTool,
      setDynamicRowHeight: setDynamicRowHeight
    }
  }, [LayoutEntry, currentCardSize, dataSource?.id, getCardSizeWidthUnitByConfig, handleItemChange, handleListMouseLeave, handleListMouseMove, handleResizeCard, isRTL, listProps, nls, records?.length, selectCard, setDynamicRowHeight, theme, toggleCardTool, updateCanClickLinkWhenClickItem, useDataSources, widgetRect])

  const columnWidth = React.useCallback((index: number): number => {
    const space = (config?.layoutType === ListLayoutType.Column ? config?.space : config?.horizontalSpace) || 0
    const cardWidth = currentCardSize?.width || 0
    const size = cardWidth + space
    return size
  }, [currentCardSize, config])

  const rowHeight = (cardHeight: number, space: number = 0): number | string => {
    //Prevents pixel differences when browsers render sizes less than 1 px
    return Math.floor(cardHeight) + space
  }

  const scrollToEndCallbackFn = React.useCallback((isScrollEnd: boolean) => {
    if (!isScrollEnd) {
      setTimeout(() => {
        isScrollEndRef.current = isScrollEnd
      }, 1000)
    } else {
      isScrollEndRef.current = isScrollEnd
    }
    scrollToEndCallback(isScrollEnd)
  }, [scrollToEndCallback])

  const addBottomBoundary = React.useCallback(() => {
    const bottomBoundaryId = `bottomBoundary${id}`
    if (!listOutDivRef.current || document.getElementById(bottomBoundaryId)) return
    const bottomBoundary = document.createElement('div')
    bottomBoundary.id = bottomBoundaryId
    bottomBoundary.className = `bottom-boundary`
    bottomBoundary.setAttribute('data-testid', 'bottom-boundary')
    const listScrollContent = listOutDivRef.current.querySelectorAll('div[aria-hidden="true"]')[0]

    listScrollContent.appendChild(bottomBoundary)
    intersectionObserver(
      document.getElementById(bottomBoundaryId),
      listOutDivRef.current,
      scrollToEndCallbackFn
    )
  }, [id, scrollToEndCallbackFn])

  const setOuterRef = React.useCallback((ref) => {
    setListOutDivRef(ref)
    listOutDivRef.current = ref
    addBottomBoundary()
  }, [addBottomBoundary, setListOutDivRef])

  const changeIsCanClickLink = (): boolean => {
    return canClickLinkRef.current
  }

  const changeIsResizingCard = React.useCallback((isResizingCard: boolean) => {
    listRuntimeDispatch({type: 'SET_IS_RESIZING_CARD', value: isResizingCard})
  }, [listRuntimeDispatch])

  const handleKeyDown = React.useCallback((e) => {
    if (e.key === 'ArrowDown' && (isScrollEndRef.current || showLoading)) {
      e.preventDefault()
    }
  }, [showLoading])

  const getItemsByRecords = React.useCallback((records, listProps, hoverIndex: number, hideCardTool: boolean): ListItemData[] => {
    const { config, selectionIsInSelf, selectionIsSelf, builderStatus } = listProps
    const selectedRecords = (!dataSource || !config.isItemStyleConfirm) ? [] : dataSource.getSelectedRecordIds()
    const selectedRecordIds = selectedRecords
    return (
      records && records.map((record, index) => {
        const editProps = {
          hideCardTool: hideCardTool,
          selectionIsList: selectionIsSelf,
          selectionIsInList: selectionIsInSelf,
          isEditing: isEditing(listProps),
          builderStatus: builderStatus,
          lockItemRatio: config.lockItemRatio,
          changeIsResizingCard: changeIsResizingCard
        }
        return {
          index,
          isHover: hoverIndex === index,
          record: config.isItemStyleConfirm ? record : undefined,
          shouldUseDynamicRowHeight: shouldUseDynamicRowHeight,
          ...otherProps,
          active:
            !record.fake &&
            config.isItemStyleConfirm &&
            dataSource &&
            selectedRecordIds.includes(record.getId()),
          ...editProps
        }
      })
    )
  }, [dataSource, isEditing, changeIsResizingCard, shouldUseDynamicRowHeight, otherProps])

  const onRowsRendered = React.useCallback((visibleRows: VisibleRows, allRows: AllRows) => {
    onItemsRendered({ row: { visibleRows, allRows } })
  }, [onItemsRendered])

  const onCellsRendered = React.useCallback((visibleCells: VisibleCells, allCells: AllCells) => {
    onItemsRendered({ grid: { allCells, visibleCells } })
  }, [onItemsRendered])

  const classNamesOfList = React.useMemo(() => {
    return classNames('widget-list-list', { 'hide-list': !records || records?.length === 0, 'hide-will-change': isShowEditingMask })
  }, [records, isShowEditingMask])

  const overscanCount = React.useMemo(() => {
    const isDesign = (window.jimuConfig.isInBuilder && appMode === AppMode.Design)
    const overscanCount = isDesign ? 0 : pageSize
    return overscanCount
  }, [appMode, pageSize])

  const propsOfListItem = React.useMemo(() => {
    const newPropsOfListItem = {
      data: getItemsByRecords(records, listProps, hoverIndex, hideCardTool)
    }
    const recordsJSON = records?.map(record => recordToJSON(record))
    const isRecordChanged = !lodash.isDeepEqual(recordsJSONRef.current, recordsJSON)
    if (!isRecordChanged && lodash.isDeepEqual(propsOfListItemRef.current, newPropsOfListItem)) {
      return propsOfListItemRef.current
    } else {
      recordsJSONRef.current = recordsJSON
      propsOfListItemRef.current = newPropsOfListItem
      return newPropsOfListItem
    }
  }, [getItemsByRecords, hideCardTool, hoverIndex, listProps, records])

  useEffect(() => {
    const listRef = config?.layoutType === ListLayoutType.Row ? list : grid
    if (listRef?.element) {
      setListRef(listRef)
      setOuterRef(listRef.element.parentElement)
    }
  }, [list, grid, config?.layoutType, setOuterRef, setListRef])

  useEffect(() => {
    setHoverIndex(-1)
  }, [appMode])

  useEffect(() => {
    const newScrollBarSize = config?.scrollBarOpen ? scrollBarSize + 1 : 0
    listRuntimeDispatch({type: 'SET_SCROLL_BAR_SIZE', value: newScrollBarSize})
  }, [scrollBarSize, config?.scrollBarOpen, listRuntimeDispatch])

  useEffect(() => {
    addBottomBoundary()
  }, [addBottomBoundary, records])

  const columnCount = React.useMemo(() => {
    if (config?.layoutType === ListLayoutType.Column) {
      return records.length
    } else if (config?.layoutType === ListLayoutType.GRID) {
      return getItemColumnCount(config, widgetRect, currentCardSize, scrollBarSizeInState)
    }
  }, [config, currentCardSize, records, scrollBarSizeInState, widgetRect])

  return (<Fragment>
    <div className='widget-list-link-con position-relative' data-testid='listContainer' onKeyDown={handleKeyDown} onKeyUp={handleListKeyUp}>
      <LinkContainer
        widgetId={id}
        appMode={appMode}
        linkParam={config.linkParam}
        queryObject={queryObject}
        useDataSources={useDataSources}
        changeIsCanClickLink={changeIsCanClickLink}
      >
        {/* Row item custom height */}
        {(config?.layoutType === ListLayoutType.Row && !shouldUseDynamicRowHeight) && <List
          className={classNamesOfList}
          rowComponent={ListItem}
          listRef={setList}
          rowCount={records.length}
          overscanCount={overscanCount}
          rowProps={propsOfListItem}
          dir={isRTL ? 'rtl' : 'ltr'}
          rowHeight={getItemSize(config, currentCardSize)}
          onRowsRendered={onRowsRendered}
          onScroll={handleListScroll}
          role='listbox'
          aria-label={nls('listArea')}
        />}
        {/* Row item auto height */}
        {(config?.layoutType === ListLayoutType.Row && shouldUseDynamicRowHeight) && <List
          className={classNamesOfList}
          rowComponent={ListItem}
          listRef={setList}
          rowCount={records.length}
          overscanCount={overscanCount}
          rowProps={propsOfListItem}
          dir={isRTL ? 'rtl' : 'ltr'}
          rowHeight={dynamicRowHeight}
          onRowsRendered={onRowsRendered}
          onScroll={handleListScroll}
          role='listbox'
          aria-label={nls('listArea')}
        />}
        {config?.layoutType === ListLayoutType.Column && <Grid
          className={classNamesOfList}
          cellComponent={ListItem}
          gridRef={setGrid}
          cellProps={propsOfListItem}
          columnWidth={columnWidth}
          rowHeight={'100%'}
          dir={isRTL ? 'rtl' : 'ltr'}
          rowCount={1}
          columnCount={columnCount}
          overscanCount={overscanCount}
          onCellsRendered={onCellsRendered}
          onScroll={handleListScroll}
          role='listbox'
          aria-label={nls('listArea')}
        />}
        {config?.layoutType === ListLayoutType.GRID && <Grid
          className={classNamesOfList}
          cellComponent={ListItem}
          gridRef={setGrid}
          cellProps={propsOfListItem}
          overscanCount={overscanCount}
          dir={isRTL ? 'rtl' : 'ltr'}
          columnWidth={columnWidth}
          rowHeight={rowHeight(currentCardSize.height, config?.verticalSpace)}
          rowCount={getItemRowCount(records.length, config, widgetRect, currentCardSize, scrollBarSizeInState)}
          columnCount={columnCount}
          onCellsRendered={onCellsRendered}
          onScroll={handleListScroll}
          role='listbox'
          aria-label={nls('listArea')}
        />}
      </LinkContainer>
    </div>
  </Fragment>)
}

export default ListComponent
