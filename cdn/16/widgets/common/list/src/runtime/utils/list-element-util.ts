import type { BrowserSizeMode } from 'jimu-core'
import { Immutable } from 'jimu-core'
import { TextAlignValue, DistanceUnits } from 'jimu-ui'
import { LIST_CARD_MIN_SIZE, SCROLL_BAR_WIDTH, ListLayoutType } from '../../config'
import type { IMConfig, ElementSize, WidgetRect, Status } from '../../config'
import { getCardSizeWidthUnitInConfig } from './utils'

interface GetItemIndexByRowAndColumnIndexOption {
  rowIndex: number
  columnIndex: number
  config: IMConfig
  widgetRect: WidgetRect
  currentCardSize: ElementSize
  scrollBarSize: number
}


export const getItemSize = (config: IMConfig, currentCardSize: ElementSize) => {
  const isHorizon = config?.layoutType === ListLayoutType.Column
  const space = config?.layoutType === ListLayoutType.GRID ? config?.verticalSpace : config?.space
  const itemWidth = currentCardSize.width + space
  const itemHeight = currentCardSize.height + space
  const size = isHorizon ? itemWidth : itemHeight
  return size
}

export const getItemColumnCount = (config: IMConfig, widgetRect: WidgetRect, currentCardSize: ElementSize, scrollBarSize = SCROLL_BAR_WIDTH) => {
  let listWidth = (widgetRect && widgetRect.width) || LIST_CARD_MIN_SIZE
  listWidth = listWidth - scrollBarSize
  const cardWidth = currentCardSize.width + config?.horizontalSpace
  //The actual width of the last column is currentCardSize.width
  //'listWidth-4' is for the width of the scroll bar
  //The space in the last column should be removed
  return Math.floor((listWidth - currentCardSize.width) / cardWidth + 1) || 1
  // return Math.floor((listWidth + config?.horizontalSpace) / (currentCardSize.width + config?.horizontalSpace)) || 1
}

export const getItemRowCount = (recordsLength: number, config: IMConfig, widgetRect: WidgetRect, currentCardSize: ElementSize, scrollBarSize = SCROLL_BAR_WIDTH) => {
  return Math.ceil(recordsLength / getItemColumnCount(config, widgetRect, currentCardSize, scrollBarSize)) || 1
}

export const getItemIndexByRowAndColumnIndex = (option: GetItemIndexByRowAndColumnIndexOption) => {
  const { rowIndex, columnIndex, config, widgetRect, currentCardSize, scrollBarSize } = option
  const columnCount = getItemColumnCount(config, widgetRect, currentCardSize, scrollBarSize)
  return rowIndex * columnCount + columnIndex
}

export const getListContentLeftPadding = (config: IMConfig, widgetRect: WidgetRect, currentCardSize: ElementSize, scrollBarSize = SCROLL_BAR_WIDTH) => {
  return getPaddingOfListContent(config, widgetRect, currentCardSize, 'left', scrollBarSize)
}

export const getListContentRightPadding = (config: IMConfig, widgetRect: WidgetRect, currentCardSize: ElementSize, scrollBarSize = SCROLL_BAR_WIDTH) => {
  return getPaddingOfListContent(config, widgetRect, currentCardSize, 'right', scrollBarSize)
}

export const getPaddingOfListContent = (config: IMConfig, widgetRect: WidgetRect, currentCardSize: ElementSize, direction: 'left' | 'right', scrollBarSize = SCROLL_BAR_WIDTH) => {
  const listWidth = (widgetRect && widgetRect.width) || LIST_CARD_MIN_SIZE
  const rowWidth = getItemColumnCount(config, widgetRect, currentCardSize, scrollBarSize) * (currentCardSize.width + config?.horizontalSpace) - config?.horizontalSpace
  let padding
  const maxPadding = listWidth - rowWidth - scrollBarSize
  switch (config?.gridAlignment) {
    case TextAlignValue.LEFT:
      padding = direction === 'left' ? 0 : maxPadding
      break
    case TextAlignValue.RIGHT:
      padding = direction === 'left' ? maxPadding : 0
      break
    default:
      padding = (listWidth - rowWidth - scrollBarSize) / 2
      break
  }
  if (config?.layoutType === ListLayoutType.GRID) {
    return padding > 0 ? padding : 0
  } else {
    return 0
  }
}
export const initNewCardSize = (newCardSize: ElementSize, config: IMConfig, builderStatus: Status, browserSizeMode: BrowserSizeMode, widgetRect: WidgetRect, scrollBarSize = SCROLL_BAR_WIDTH) => {
  //If the original width and height are percentages, px will be converted to percentages during resize, and then set to config
  let cardSize = Immutable(newCardSize)
  const cardSizeWidthUnit = getCardSizeWidthUnitInConfig(config, builderStatus, browserSizeMode)
  if (cardSizeWidthUnit.width.unit === DistanceUnits.PERCENTAGE) {
    cardSize = cardSize.set('width', `${(newCardSize.width * 100) / (widgetRect.width + config?.horizontalSpace - scrollBarSize)}%`)
  }
  if (cardSizeWidthUnit.height.unit === DistanceUnits.PERCENTAGE) {
    cardSize = cardSize.set('height', `${newCardSize.height * 100 / widgetRect.height}%`)
  }
  return cardSize?.asMutable({ deep: true })
}

interface GetListVisibleStartIndexOption {
  lastScrollOffset: number
  config: IMConfig
  currentCardSize: ElementSize
  columnCount: number
  completelyVisibleItem?: boolean
}

export function getListVisibleStartIndex (option: GetListVisibleStartIndexOption): number {
  const { lastScrollOffset, config, currentCardSize, columnCount, completelyVisibleItem } = option
  const itemSize = getItemSize(config, currentCardSize)
  const base = (lastScrollOffset * 1.0) / itemSize
  let index = completelyVisibleItem ? Math.ceil(base) : Math.floor(base)
  const mo = completelyVisibleItem ? 0 : (base - index) * itemSize
  const space = config?.layoutType === ListLayoutType.GRID ? config?.verticalSpace : config?.space
  index = config?.layoutType === ListLayoutType.GRID ? index * columnCount : index
  if (mo > itemSize - space) {
    index = config?.layoutType === ListLayoutType.GRID ? index + columnCount : index + 1
  }
  return index
}

interface GetListVisibleEndIndexOption {
  lastScrollOffset: number
  config: IMConfig
  currentCardSize: ElementSize
  columnCount: number
  listItemContentSize: ElementSize
}

export function getListVisibleEndIndex (option: GetListVisibleEndIndexOption): number {
  const { lastScrollOffset, config, currentCardSize, columnCount, listItemContentSize } = option
  const itemSize = getItemSize(config, currentCardSize)
  const isHorizon = config?.layoutType === ListLayoutType.Column
  const contentSize = isHorizon ? listItemContentSize.width : listItemContentSize.height
  const base = ((lastScrollOffset + contentSize) * 1.0) / itemSize
  let index = Math.floor(base)
  const mo = (base - index) * itemSize
  const space = config?.layoutType === ListLayoutType.GRID ? config?.verticalSpace : config?.space
  index = config?.layoutType === ListLayoutType.GRID ? index * columnCount - 1 : index

  if (index < 0) {
    index = 0
  }

  if (mo > itemSize - space) {
    index = config?.layoutType === ListLayoutType.GRID ? index + columnCount : index + 1
  }
  return index
}
