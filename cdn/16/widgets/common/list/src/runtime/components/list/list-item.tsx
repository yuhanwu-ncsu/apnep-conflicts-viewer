/** @jsx jsx */
import { jsx, React, lodash, AppMode, ReactRedux, Immutable, RepeatedDataSourceProvider, type IMState, type RepeatedDataSource } from 'jimu-core'
import ListCardViewer from './list-card-viewer'
import DynamicStyleResolver from './list-dynamic-style-resolver'
import type { ListItemData, IMDynamicStyleOfCard } from '../../../config'
import { ListLayoutType } from '../../../config'
import { getItemRowCount, getItemIndexByRowAndColumnIndex, getItemColumnCount } from '../../utils/list-element-util'
import { isProviderEqual, recordToJSON } from '../../utils/utils'
import { useListRuntimeState } from '../../state'
import MaskOfListItem from './list-item-mask'
import { useEffect } from 'react'
import type { RowComponentProps } from 'react-window'
const { useRef, useState, Fragment } = React
let ListCardEditor
interface Props {
  data: ListItemData[]
  index: number
  isScrolling: boolean
  style: any
  columnIndex?: number
  rowIndex?: number
}
const ListItem = (props: RowComponentProps<Props>) => {
  const appMode = ReactRedux.useSelector((state: IMState) => state?.appRuntimeInfo?.appMode)

  const { scrollBarSize, LayoutEntry } = useListRuntimeState()

  const { data, index, style, isScrolling, columnIndex, rowIndex } = props
  const currentItemIndexRef = useRef(0)
  const providerDataRef = useRef({} as RepeatedDataSource)
  const listStyleRef = useRef({})
  const memoizedItemPropsRef = useRef({} as any)
  const recordJSONRef = useRef(null)

  const [dynamicStyleOfCard, setDynamicStyleOfCard ] = useState(Immutable({}) as IMDynamicStyleOfCard)
  const [providerData, setProviderData] = useState({} as RepeatedDataSource)
  const [previewDynamicStyle, setPreviewDynamicStyle] = useState(false)

  if (!ListCardEditor) {
    const { builderSupportModules } = data?.[0] || {}
    ListCardEditor = builderSupportModules?.widgetModules?.ListCardEditor
  }

  const getNewCurrentItemIndex = React.useCallback((data, index, columnIndex, rowIndex): number => {
    if (!data?.[0]) return 0
    const { config, widgetRect, currentCardSize } = data[0]
    const getItemIndexByRowAndColumnIndexOption = {
      rowIndex: rowIndex || 0,
      columnIndex: columnIndex || 0,
      config,
      widgetRect,
      currentCardSize,
      scrollBarSize
    }
    const currentItemIndex = config?.layoutType === ListLayoutType.Row ? index : getItemIndexByRowAndColumnIndex(getItemIndexByRowAndColumnIndexOption)
    return currentItemIndex
  }, [scrollBarSize])

  const getIsEditor = React.useCallback((data, index, columnIndex, rowIndex) => {
    if (!data?.[0]) return false
    const currentItemIndex = getNewCurrentItemIndex(data, index, columnIndex, rowIndex)
    const isEditor = currentItemIndex === 0 && window.jimuConfig.isInBuilder && appMode === AppMode.Design
    return isEditor
  }, [appMode, getNewCurrentItemIndex])

  const getShowListItem = React.useCallback((data, index, columnIndex, rowIndex): boolean => {
    const currentItemIndex = getNewCurrentItemIndex(data, index, columnIndex, rowIndex)
    const showListItem = data?.length >= (currentItemIndex + 1)
    return showListItem
  }, [getNewCurrentItemIndex])

  currentItemIndexRef.current = getNewCurrentItemIndex(data, index, columnIndex, rowIndex)

  const isEditor = React.useMemo(() => {
    return getIsEditor(data, index, columnIndex, rowIndex)
  }, [columnIndex, data, getIsEditor, index, rowIndex])

  const isShowListItem = React.useMemo(() => {
    return getShowListItem(data, index, columnIndex, rowIndex)
  }, [columnIndex, data, getShowListItem, index, rowIndex])

  const currentItemIndex = React.useMemo(() => {
    return getNewCurrentItemIndex(data, index, columnIndex, rowIndex)
  }, [columnIndex, data, getNewCurrentItemIndex, index, rowIndex])

  const getListItemStyle = React.useCallback((data: ListItemData[]) => {
    if (!data?.[0]) return {}
    const { config } = data[0]
    let listItemStyle
    switch (config?.layoutType) {
      case ListLayoutType.Column:
        listItemStyle = {
          width: `${parseFloat(style.width) - config.space}px`,
          height: '100%'
        }
        break
      case ListLayoutType.Row:
        listItemStyle = {
          width: '100%',
          height: `${parseFloat(style.height) - config.space}px`
        }
        break
      case ListLayoutType.GRID:
        listItemStyle = {
          height: `${parseFloat(style.height) - config?.verticalSpace}px`,
          width: `${parseFloat(style?.width) - config?.horizontalSpace}px`
        }
        break
    }
    return listItemStyle
  }, [style])

  //The size of list item content
  const getStyleOfListItemCon = React.useCallback((data: ListItemData[]) => {
    if (!data?.[0]) return {}
    const { config, recordLength, widgetRect, currentCardSize } = data[0]
    let newStyle = style
    const currentColumnIndex = columnIndex || 0
    const currentRowIndex = rowIndex || 0
    const rowCount = getItemRowCount(recordLength, config, widgetRect, currentCardSize, scrollBarSize)
    const columnCount = getItemColumnCount(config, widgetRect, currentCardSize, scrollBarSize)
    const isLastItem = recordLength - 1 === index

    switch (config?.layoutType) {
      case ListLayoutType.Column:
        newStyle = {
          ...newStyle,
          width: isLastItem ? `${Math.floor(parseFloat(newStyle.width) - config.space)}px` : `${Math.floor(parseFloat(newStyle.width))}px`
        }
        break
      case ListLayoutType.Row:
        newStyle = {
          ...newStyle,
          height: isLastItem ? `${Math.floor(parseFloat(newStyle.height) - config.space)}px` : `${Math.floor(parseFloat(newStyle.height))}px`
        }
        break
      case ListLayoutType.GRID:
        newStyle = {
          ...newStyle,
          height: rowCount === (currentRowIndex + 1) ? `${Math.floor(parseFloat(newStyle.height) - config?.verticalSpace)}px` : `${Math.floor(parseFloat(newStyle.height))}px`,
          width: columnCount === (currentColumnIndex + 1) ? `${Math.floor(parseFloat(newStyle?.width) - config?.horizontalSpace)}px` : `${Math.floor(parseFloat(newStyle?.width))}px`
        }
        break
    }
    return newStyle
  }, [columnIndex, index, rowIndex, scrollBarSize, style])

  const handleDynamicStyleChange = (dynamicStyleOfCard: IMDynamicStyleOfCard) => {
    setDynamicStyleOfCard(dynamicStyleOfCard)
  }

  const itemProps = React.useCallback((data: ListItemData[], dynamicStyleOfCard: IMDynamicStyleOfCard) => {
    return {
      ...data[currentItemIndexRef.current],
      dynamicStyleOfCard: dynamicStyleOfCard
    }
  }, [])

  const updatePreviewDynamicStyle = (isPreview: boolean) => {
    setPreviewDynamicStyle(isPreview)
  }

  useEffect(() => {
    getNewProviderData(data)
  }, [data, index, columnIndex, rowIndex])

  const getNewProviderData = (data: ListItemData[]) => {
    const dataItem = data[currentItemIndexRef.current]
    const newProviderData = {
      widgetId: dataItem?.widgetId,
      dataSourceId: dataItem?.datasourceId,
      recordIndex: dataItem?.index,
      record: dataItem?.record
    }
    const notChange = isProviderEqual(newProviderData, providerDataRef.current)
    const recordsJSON = dataItem?.record ? recordToJSON(dataItem.record) : null
    const recordsChanged = !lodash.isDeepEqual(recordJSONRef.current, recordsJSON)
    if (!notChange || recordsChanged) {
      providerDataRef.current = newProviderData
      setProviderData(newProviderData)
      recordJSONRef.current = recordsJSON
    }
  }

  const showListCardEditor = React.useMemo(() => {
    return currentItemIndex === 0 && ListCardEditor && window.jimuConfig.isInBuilder && appMode !== AppMode.Express
  }, [appMode, currentItemIndex])

  const dataItem = React.useMemo(() => {
    return data[currentItemIndexRef.current]
  }, [data])

  const restDynamicStyleOfCardWhenDisableDynamicStyle = React.useCallback(() => {
    const cardConfigs = dataItem?.config?.cardConfigs
    if (!cardConfigs) return
    let newDynamicStyleOfCard = dynamicStyleOfCard
    let hadUpdateDynamicStyleOfCard = false
    Object.keys(cardConfigs).forEach(status => {
      const cardConfigItem = cardConfigs[status]
      if (!cardConfigItem?.enableDynamicStyle && dynamicStyleOfCard[status]) {
        newDynamicStyleOfCard = newDynamicStyleOfCard.set(status, null)
        hadUpdateDynamicStyleOfCard= true
      }
    })
    if (hadUpdateDynamicStyleOfCard) {
      setDynamicStyleOfCard(newDynamicStyleOfCard)
    }
  }, [dataItem?.config?.cardConfigs, dynamicStyleOfCard])

  useEffect(() => {
    restDynamicStyleOfCardWhenDisableDynamicStyle()
  }, [restDynamicStyleOfCardWhenDisableDynamicStyle])

  const memoizedItemProps = React.useMemo(() => {
    const newItemProps = {...itemProps(data, dynamicStyleOfCard)}
    if (lodash.isDeepEqual(memoizedItemPropsRef.current, newItemProps)) {
      return memoizedItemPropsRef.current
    } else {
      memoizedItemPropsRef.current = newItemProps
      return newItemProps
    }
  }, [data, dynamicStyleOfCard, itemProps])

  const enableDynamicStyle = React.useMemo(() => {
    const cardConfigs = dataItem?.config?.cardConfigs
    if (!cardConfigs) return false
    return Object.keys(cardConfigs).filter(status => {
      const cardConfigItem = cardConfigs[status]
      const dynamicStyleConfig = cardConfigItem?.dynamicStyleConfig || {}
      return cardConfigItem?.enableDynamicStyle && Object.keys(dynamicStyleConfig)?.length > 0
    })?.length > 0
  }, [dataItem?.config?.cardConfigs])

  const listStyle = React.useMemo(() => {
    const newListStyle = getListItemStyle(data)
    if (lodash.isDeepEqual(listStyleRef.current, newListStyle)) {
      return listStyleRef.current
    } else {
      listStyleRef.current = newListStyle
      return newListStyle
    }
  }, [data, getListItemStyle])

  return (<Fragment>
    {isShowListItem && <div style={getStyleOfListItemCon(data)}>
      <RepeatedDataSourceProvider data={providerData}>
        <Fragment>
          {/* In the builder, the ListCardEditor within the first list item cannot be unloaded, as this may cause children to be lost during animation execution, leading to animation problems.
          * This is a special handling method implemented to address animation issues. https://devtopia.esri.com/Beijing-R-D-Center/ExperienceBuilder/issues/26880
          */}
          {showListCardEditor && <ListCardEditor
            {...memoizedItemProps}
            listStyle={listStyle}
            itemIdex={currentItemIndexRef.current}
            isScrolling={isScrolling}
            previewDynamicStyle={previewDynamicStyle}
            className={!isEditor ? 'sr-only' : ''}
            LayoutEntry={LayoutEntry}
          />}
          {!isEditor && <ListCardViewer
            {...memoizedItemProps}
            listStyle={listStyle}
            itemIdex={currentItemIndexRef.current}
            isScrolling={isScrolling}
            previewDynamicStyle={previewDynamicStyle}
            LayoutEntry={LayoutEntry}
          />}
          {(dataItem?.record) && enableDynamicStyle && <Fragment>
            <DynamicStyleResolver
              cardConfig={dataItem?.config?.cardConfigs}
              id={dataItem?.widgetId}
              dynamicStyleOfCard={dynamicStyleOfCard}
              useDataSources={dataItem?.useDataSources}
              handleDynamicStyleChange={handleDynamicStyleChange}
            />
            <MaskOfListItem
              config={dataItem?.config}
              id={dataItem?.widgetId}
              recordIndex={currentItemIndexRef.current}
              previewDynamicStyle={previewDynamicStyle}
              updatePreviewDynamicStyle={updatePreviewDynamicStyle}
            />
          </Fragment>}
        </Fragment>
      </RepeatedDataSourceProvider>
      {dataItem?.shouldUseDynamicRowHeight && dataItem?.config?.space > 0 && (
        <div style={{ height: `${dataItem.config.space}px` }} />
      )}
    </div>}
  </Fragment>)
}

export default ListItem
