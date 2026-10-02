import { ACTION_INDEXES } from '../actions/constants'
import type Action from '../actions/action'
import type { BaseListItemType, ListActionItem } from '../types'
import { isLayerFromRuntime, isWMTSSublayer } from './layer-utils'

export interface ActionGroups {
  [groupIndex: number]: ListActionItem[]
}

interface LegendPanelOptions {
  isTableList: boolean
  useMapWidget: boolean
  enableLegend: boolean
  showAllLegend: boolean
}

interface CustomizeLayerVisibilityOptions {
  listItem: BaseListItemType
  customizeLayerOption: any
  currentJimuLayerViewId?: string
}

export const applyLegendPanel = (listItem: BaseListItemType, options: LegendPanelOptions): void => {
  const shouldRenderLegendPanel = !options.isTableList && options.useMapWidget && options.enableLegend && listItem.layer.legendEnabled
  if (!shouldRenderLegendPanel) {
    return
  }

  if (typeof listItem.layer?.id === 'string' && listItem.layer.id.startsWith('jimu-draw')) {
    return
  }

  listItem.panel = {
    content: 'legend',
    // The JSAPI handles invisible layers and does not render selected state.
    // https://devtopia.esri.com/WebGIS/arcgis-js-api/issues/51484
    open: options.showAllLegend
  }
}

export const collectActionGroups = (listItem: BaseListItemType, isTableList: boolean, layerListActions: Action[]): ActionGroups => {
  const actionGroups: ActionGroups = {}
  layerListActions.forEach((actionObj) => {
    if (!actionObj.isValid(listItem, isTableList)) {
      return
    }

    if (!actionGroups[actionObj.group]) {
      actionGroups[actionObj.group] = []
    }

    actionGroups[actionObj.group].push({
      id: actionObj.id,
      title: actionObj.title,
      icon: actionObj.iconName,
      className: actionObj.className
    })
  })
  return actionGroups
}

export const filterActionGroupsByOptionAction = (actionGroups: ActionGroups, dataActionEnabled: boolean): ActionGroups => {
  const optionActionIndex = ACTION_INDEXES.Option
  const showOptionActions = [ACTION_INDEXES.Label, ACTION_INDEXES.Transparency, ACTION_INDEXES.Popup, ACTION_INDEXES.VisibilityRange, ACTION_INDEXES.ChangeSymbol]
  const nativeActionCount = Object.keys(actionGroups).length - 1

  // Keep native actions when data-action is disabled and no overflow menu is needed.
  if (!dataActionEnabled && nativeActionCount <= 1 && !showOptionActions.some(index => !!actionGroups[index])) {
    delete actionGroups[optionActionIndex]
    return actionGroups
  }

  if (!actionGroups[optionActionIndex]) {
    return actionGroups
  }

  // Use only the fake option action to open the custom popper.
  return { [optionActionIndex]: actionGroups[optionActionIndex] }
}

export const applyCustomizeLayerVisibility = (options: CustomizeLayerVisibilityOptions): void => {
  const { listItem, customizeLayerOption, currentJimuLayerViewId } = options
  if (!customizeLayerOption?.isEnabled) {
    return
  }

  const hiddenLayerSet = new Set(customizeLayerOption.hiddenJimuLayerViewIds)
  const showLayerSet = new Set(customizeLayerOption.showJimuLayerViewIds)

  if (hiddenLayerSet.has(currentJimuLayerViewId)) {
    listItem.hidden = true
  }

  if (customizeLayerOption.showJimuLayerViewIds) {
    listItem.hidden = !showLayerSet.has(currentJimuLayerViewId)
  }

  if (isLayerFromRuntime(listItem.layer)) {
    listItem.hidden = !(customizeLayerOption.showRuntimeAddedLayers ?? true)
  }

  if (isWMTSSublayer(listItem.layer)) {
    listItem.hidden = false
  }
}

export const assignSortedActionSections = (listItem: BaseListItemType, actionGroups: ActionGroups): void => {
  listItem.actionsSections = []
  Object.entries(actionGroups)
    .sort((entryA, entryB) => Number(entryA[0]) - Number(entryB[0]))
    .forEach(([, actions]) => {
      if (actions?.length) {
        listItem.actionsSections.push(actions)
      }
    })
}
