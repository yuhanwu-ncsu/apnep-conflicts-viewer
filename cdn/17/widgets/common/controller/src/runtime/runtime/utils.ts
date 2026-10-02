import { appActions, getAppStore } from 'jimu-core'
import { getWidgetChildLayoutJson } from '../common/layout-utils'
import { BASE_LAYOUT_NAME } from '../../common/consts'

export const getWidgetCardNode = (widgetId: string): HTMLButtonElement => {
  const node = document.querySelector(`.widget-controller .avatar-card[data-widgetid='${widgetId}']`)
  return node as HTMLButtonElement
}

export const getWidgetButtonNode = (widgetId: string): HTMLButtonElement => {
  const node = document.querySelector(`.widget-controller .avatar-card[data-widgetid='${widgetId}'] button`)
  return node as HTMLButtonElement
}

export const getMoreButtonNode = (controllerId: string): HTMLButtonElement => {
  const node = document.querySelector(`[data-widgetid='${controllerId}'] .popup-more-card button`)
  return node as HTMLButtonElement
}

export const selectWidget = (widgetId: string, controllerId: string) => {
  const layout = getWidgetChildLayoutJson(controllerId, BASE_LAYOUT_NAME)
  const layoutItemId = Object.keys(layout.content).find(itemId => layout.content[itemId].widgetId === widgetId)
  getAppStore().dispatch(appActions.selectionChanged({ layoutId: layout.id, layoutItemId }))
}

export const toggleWidget = (controllerId: string, widgetId: string, openingWidgets: string[], keepOneOpened: boolean, isSelect: boolean = false) => {
  if (keepOneOpened) {
    getAppStore().dispatch(appActions.closeWidgets(openingWidgets))
    if (!openingWidgets.includes(widgetId)) {
      getAppStore().dispatch(appActions.openWidget(widgetId))
      isSelect && selectWidget(widgetId, controllerId)
    }
  } else {
    if (!openingWidgets.includes(widgetId)) {
      getAppStore().dispatch(appActions.openWidget(widgetId))
      isSelect && selectWidget(widgetId, controllerId)
    } else {
      getAppStore().dispatch(appActions.closeWidget(widgetId))
    }
  }
}
