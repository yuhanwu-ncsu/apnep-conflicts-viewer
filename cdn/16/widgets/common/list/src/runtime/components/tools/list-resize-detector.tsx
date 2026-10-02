/** @jsx jsx */
import { jsx, React, hooks, ReactResizeDetector, appActions, lodash, ReactRedux, getAppStore } from 'jimu-core'
import type { IMState } from 'jimu-core'
import { ListLayoutType, LIST_CARD_MIN_SIZE, GRID_TEMPLATE_WIDTH } from '../../../config'
import type { ElementSize, IMConfig, WidgetRect, Status } from '../../../config'
import { isEqualNumber, getListHeight, getBottomToolH, getCardSizeNumberInConfig as getCardSizeNumberInConfigUtil } from '../../utils/utils'
import { useListRuntimeState, useListRuntimeDispatch } from '../../state'
const { useEffect, useRef } = React
interface Props {
  id: string
  showTopTools: boolean
  showBottomTools: boolean
  targetRef: any
  paginatorDiv: any
  config: IMConfig
  builderStatus: Status
  isScrollEnd: boolean
  isCurrentPageLastPage: boolean
  notAutoResizeCardSize: boolean
  loadNextPageWhenListSizeOrTotalCountChange: () => void
  updateCardToolPosition: () => void
  setListDivSize: () => void
  handleResizeCard: (newCardSize, resizeEnd: boolean, isTop?: boolean, isLeft?: boolean, isReplace?: boolean) => void
  updateHasGetListSizeByResizeDetector: (hasGetListSizeByResizeDetector: boolean) => void
}
const ListResizeDetector = (props: Props) => {
  const debounceOnResizeRef = useRef(null)
  const resizeTimeoutRef = useRef(null)
  const needRefreshListRef = useRef(null)
  const widgetRectRef = useRef(null)
  const isHasInitCurrentCardSizeRef = useRef(false)
  const scrollBarSizeRef = useRef<number>(null)
  const listRuntimeDispatch = useListRuntimeDispatch()

  const { isResizingCard, currentCardSize, widgetRect, scrollBarSize } = useListRuntimeState()
  const browserSizeMode = ReactRedux.useSelector((state: IMState) => state?.browserSizeMode)

  const { id, showTopTools, showBottomTools, targetRef, paginatorDiv, config, isScrollEnd, isCurrentPageLastPage, builderStatus, notAutoResizeCardSize } = props
  const { loadNextPageWhenListSizeOrTotalCountChange, updateCardToolPosition, setListDivSize, handleResizeCard, updateHasGetListSizeByResizeDetector } = props

  const onResize = hooks.useEventCallback((width, height) => {
    updateHasGetListSizeByResizeDetector(true)

    const newWidgetRect = { width, height }
    if (isResizingCard) {
      return
    }

    if (notAutoResizeCardSize) {
      //For grid list, when the list's width is set to Auto, and the width of the list item is a percentage,
      // the list uses a fixed width because the width of each list item cannot be calculated at this point.
      //https://devtopia.esri.com/Beijing-R-D-Center/ExperienceBuilder-Web-Extensions/issues/25108
      newWidgetRect.width = GRID_TEMPLATE_WIDTH
    }

    const cardSize = getNewCardSize(newWidgetRect.width, height)
    const notResetCardSize = cardSize.width < LIST_CARD_MIN_SIZE || cardSize.height < LIST_CARD_MIN_SIZE
    const isWidgetSizeChange = (newWidgetRect.width !== widgetRect.width || newWidgetRect.height !== widgetRect.height) && newWidgetRect.width !== 0 && newWidgetRect.height !== 0
    if (notResetCardSize && !isWidgetSizeChange) {
      return
    }

    widgetRectRef.current = newWidgetRect
    updateCurrentCardSize(cardSize)
    updateWidgetRect(newWidgetRect)
    editListSizeInRunTime(newWidgetRect)
    isHasInitCurrentCardSizeRef.current = true

    if (config.lockItemRatio) {
      clearTimeout(resizeTimeoutRef.current)
      resizeTimeoutRef.current = setTimeout(() => {
        handleResizeCard(cardSize, true, false, false, true)
      }, 500)
    }

    updateCardToolPosition()
    setListDivSize()

    if (!isCurrentPageLastPage && isScrollEnd) {
      loadNextPageWhenListSizeOrTotalCountChange()
    }
  })

  useEffect(() => {
    debounceOnResizeRef.current = lodash.debounce(
      ({ width, height }) => { onResize(width, height) },
      100
    )
  }, [onResize])

  const updateCurrentCardSize = (currentCardSize: ElementSize) => {
    listRuntimeDispatch({type: 'SET_CURRENT_CARD_SIZE', value: currentCardSize})
  }

  const updateWidgetRect= (size: ElementSize) => {
    listRuntimeDispatch({type: 'SET_WIDGET_RECT', value: size})
  }

  const editListSizeInRunTime = (widgetRect: ElementSize) => {
    getAppStore().dispatch(appActions.widgetStatePropChange(id, 'widgetRect', widgetRect))
  }

  const getCardSizeNumberInConfig = React.useCallback((widgetRect?: WidgetRect) => {
    return getCardSizeNumberInConfigUtil(config, builderStatus, browserSizeMode, widgetRect, scrollBarSize)
  }, [browserSizeMode, builderStatus, config, scrollBarSize])

  const getOldCardSizeWhenResize = hooks.useEventCallback((newWidgetRect): ElementSize => {
    //When the width and height are percentages, the Onresize method will be automatically called once when the List is loaded. At this time, the current List size should be used to obtain the oldCardSize
    if (!isHasInitCurrentCardSizeRef.current) {
      return getCardSizeNumberInConfig(newWidgetRect)
    } else {
      return currentCardSize
    }
  })

  const getNewCardSize = React.useCallback((width, height) => {
    const newWidgetRect = {
      width,
      height
    }
    const bottomToolH = getBottomToolH(paginatorDiv, showBottomTools)
    const listH = getListHeight(newWidgetRect, bottomToolH, showTopTools)
    const oldCardSize = getOldCardSizeWhenResize(newWidgetRect)
    const newDefaultCardSize = config.layoutType === ListLayoutType.GRID ? getCardSizeNumberInConfig(newWidgetRect) : currentCardSize

    const cardSize = {
      width: newDefaultCardSize.width,
      height: newDefaultCardSize.height
    }

    needRefreshListRef.current = !isEqualNumber(currentCardSize?.width, newDefaultCardSize?.width) || !isEqualNumber(currentCardSize?.height, newDefaultCardSize?.height)

    if (config.lockItemRatio && config.layoutType !== ListLayoutType.GRID) {
      const ratio = cardSize.width / cardSize.height
      switch (config?.layoutType) {
        case ListLayoutType.Column:
          cardSize.height = listH
          cardSize.width = listH * ratio
          if (!isEqualNumber(cardSize.width, oldCardSize.width)) {
            needRefreshListRef.current = true
          }
          break
        case ListLayoutType.Row:
          cardSize.height = width / ratio
          cardSize.width = width
          if (!isEqualNumber(cardSize.height, oldCardSize.height)) {
            needRefreshListRef.current = true
          }
          break
      }
    } else {
      switch (config?.layoutType) {
        case ListLayoutType.Column:
          cardSize.height = listH
          break
        case ListLayoutType.Row:
          cardSize.width = width
          break
        default:
          break
      }
    }
    return cardSize
  }, [config.layoutType, config.lockItemRatio, currentCardSize, getCardSizeNumberInConfig, getOldCardSizeWhenResize, paginatorDiv, showBottomTools, showTopTools])

  useEffect(() => {
    if (widgetRectRef.current && scrollBarSize !== scrollBarSizeRef.current) {
      scrollBarSizeRef.current = scrollBarSize
      onResize(widgetRectRef.current.width, widgetRectRef.current.height)
    }
  }, [onResize, scrollBarSize])

  return (
    <ReactResizeDetector
      targetRef={targetRef}
      handleWidth
      handleHeight
      onResize={debounceOnResizeRef.current}
    />
  )
}
export default ListResizeDetector