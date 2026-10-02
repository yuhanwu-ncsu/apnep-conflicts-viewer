import { React, hooks } from 'jimu-core'
import { Loading, LoadingType, defaultMessages } from 'jimu-ui'
import { Tree, TreeCollapseStyle, TreeItemActionType, type TreeItemType, TreeAlignmentType, TreeStyle, type UpdateTreeActionDataType, type _TreeItem } from 'jimu-ui/basic/list-tree'
import type { JimuLayerView, JimuLayerViews, JimuMapView } from 'jimu-arcgis'
import type { LayerInfo } from '../../config'
import VisibleOutlined from 'jimu-icons/svg/outlined/application/visible.svg'
import InvisibleOutlined from 'jimu-icons/svg/outlined/application/invisible.svg'

const sortTreeItem = (item: TreeItemType, jimuLayerViews: {
  [jimuLayerViewId: string]: JimuLayerView
}) => {
  if (!item.itemChildren || item.itemChildren.length === 0) {
    return item
  }
  // sort the children nodes
  item.itemChildren = item.itemChildren.sort((a, b) => { return jimuLayerViews[a.itemKey].index - jimuLayerViews[b.itemKey].index })
  // iterate the children
  item.itemChildren.forEach(child => sortTreeItem(child, jimuLayerViews))
  return item
}

const convertArrayToObject = (jimuLayerViewArray: JimuLayerView[]): JimuLayerViews => {
  const jimuLayerViews: JimuLayerViews = {}
  jimuLayerViewArray.forEach(jimuLayerView => {
    jimuLayerViews[jimuLayerView.id] = jimuLayerView
  })
  return jimuLayerViews
}

export interface TreeLayerListProps {
  className?: string
  jimuMapView: JimuMapView
  onChange: (jimuLayerViewIds: string[]) => void
  layerList?: LayerInfo[]
  /**
   * Whether to hide some types of jimuLayerView.
   * @param jimuLayerView: the current layer.
   * @param jimuLayerViews: all the layers that from a jimuMapView.
   * @default false
   */
  hideLayers?: (jimuLayerView: JimuLayerView, jimuLayerViews: JimuLayerViews) => boolean
  isMultiSelection?: boolean
  isAllowDeactivateLayers: boolean
  toggleLayerVisibility: boolean
  onToggleLayerVisibility?: (jimuLayerViewId: string) => void
  isRuntime?: boolean
}

export const TreeLayerList = (props: TreeLayerListProps) => {
  const {
    jimuMapView, layerList = [], hideLayers, isMultiSelection = true, isAllowDeactivateLayers,
    toggleLayerVisibility, onToggleLayerVisibility, isRuntime = false
  } = props
  const translate = hooks.useTranslation(defaultMessages)
  const [rootItemJson, setRootItemJson] = React.useState<TreeItemType>(null)
  const [jimuLayerViews, setJimuLayerViews] = React.useState<JimuLayerViews>(null)
  const [isLoading, setIsLoading] = React.useState<boolean>(true)
  const [expandedIds, setExpandedIds] = React.useState([])

  const getLayerCommands = React.useCallback((layerObj: LayerInfo) => [
    {
      label: translate('visibility'),
      buttonAriaPressed: layerObj?.visible,
      iconProps: { icon: layerObj?.visible ? VisibleOutlined : InvisibleOutlined, size: 16 },
      action: () => {
        onToggleLayerVisibility?.(layerObj.layerId)
      }
    }
  ], [onToggleLayerVisibility, translate])

  const constructTree = React.useCallback((
    jimuLayerViews: { [jimuLayerViewId: string]: JimuLayerView },
    layerList: LayerInfo[],
    hideLayers: (jimuLayerView: JimuLayerView, jimuLayerViews: JimuLayerViews) => boolean,
    toggleLayerVisibility: boolean
  ) => {
    const treeJson = {
      itemKey: 'root item',
      itemStateTitle: 'root item',
      itemChildren: []
    }
    const treeItemByKey = {}
    const layerListIds = layerList?.map((layerInfo: LayerInfo) => layerInfo.layerId) || []
    const selectedIds = layerList?.filter((layerInfo: LayerInfo) => layerInfo.selected)?.map((layerInfo: LayerInfo) => layerInfo.layerId) || []
    layerList?.forEach((layerObj: LayerInfo) => {
      const key = layerObj.layerId
      const isSelected: boolean = selectedIds.length > 0 && selectedIds.includes(key)
      treeItemByKey[key] = {
        itemKey: key,
        itemStateTitle: layerObj.title,
        itemChildren: [],
        itemStateChecked: isAllowDeactivateLayers ? isSelected : false,
        isCheckboxDisabled: !layerObj.visible,
        itemStateCommands: toggleLayerVisibility ? getLayerCommands(layerObj) : [],
        itemStateExpanded: expandedIds.includes(key)
      }
    })
    for (const [key, val] of Object.entries(jimuLayerViews)) {
      if (!layerListIds.includes(key)) continue
      const { parentJimuLayerViewId: pId } = val
      if (jimuLayerViews[key].fromRuntime) {
        //To exclude the layers that added from Add Data widget
        if (isRuntime) {
          const treeItem = treeItemByKey[key]
          treeJson.itemChildren.push(treeItem)
        } else {
          continue
        }
      } else {
        const treeItem = treeItemByKey[key]
        if (!hideLayers) { //if hideLayers props is not defined
          if (pId === null) {
            treeJson.itemChildren.push(treeItem)
          } else {
            if (treeItemByKey[pId]) {
              // parent exists
              // Adjust the disabled status of the child node according to the parent node
              if (treeItemByKey[pId].isCheckboxDisabled && treeItemByKey[key]) treeItemByKey[key].isCheckboxDisabled = true
              treeItemByKey[pId].itemChildren.push(treeItemByKey[key])
              const haveSelectedChild = treeItemByKey[pId].itemChildren.some(child => child.itemStateChecked)
              const haveUnSelectedChild = treeItemByKey[pId].itemChildren.some(child => !child.itemStateChecked)
              treeItemByKey[pId].itemStateChecked = haveSelectedChild
              treeItemByKey[pId].indeterminate = haveSelectedChild && haveUnSelectedChild
            } else {
              // add parent item
              const curParentView = jimuLayerViews[pId]
              const curParentLayer = curParentView.layer
              const haveSelectedChild = treeItem.itemStateChecked
              // Adjust the disabled status of the child node according to the parent node
              if (!curParentLayer.visible && treeItemByKey[key]) treeItemByKey[key].isCheckboxDisabled = true
              const parentTreeItem = {
                itemKey: pId,
                itemStateTitle: curParentLayer.title,
                itemChildren: [treeItemByKey[key]],
                itemStateChecked: haveSelectedChild,
                isItemSelectable: true,
                indeterminate: false,
                isCheckboxDisabled: !curParentLayer.visible,
                itemStateCommands: toggleLayerVisibility ? getLayerCommands({ layerId: pId, visible: curParentLayer.visible } as LayerInfo) : [],
                itemStateExpanded: expandedIds.includes(pId)
              }
              treeItemByKey[pId] = parentTreeItem
              treeJson.itemChildren.push(parentTreeItem)
            }
          }
        } else if (!hideLayers(jimuLayerViews[key], jimuLayerViews)) {
          if (pId === null) {
            treeJson.itemChildren.push(treeItem)
          } else {
            treeItemByKey[pId].itemChildren.push(treeItem)
          }
        }
      }
    }
    const sortedTreeJson = sortTreeItem(treeJson, jimuLayerViews)
    return sortedTreeJson
  }, [expandedIds, isAllowDeactivateLayers, isRuntime,getLayerCommands])

  React.useEffect(() => {
    if (!jimuMapView) return
    setIsLoading(true)
    jimuMapView.whenJimuMapViewLoaded().then(() => {
      setIsLoading(false)
    })

    const loadedJimuLayerViews = jimuMapView.getAllJimuLayerViews()
    setJimuLayerViews(convertArrayToObject(loadedJimuLayerViews))

    const jimuLayerViewChangedListener = () => {
      const allJimuLayerViews = jimuMapView.getAllJimuLayerViews()
      setJimuLayerViews(convertArrayToObject(allJimuLayerViews))
    }

    jimuMapView.addJimuLayerViewCreatedListener(jimuLayerViewChangedListener)
    jimuMapView.addJimuLayerViewsVisibleChangeListener(jimuLayerViewChangedListener)

    return () => {
      jimuMapView?.removeJimuLayerViewCreatedListener(jimuLayerViewChangedListener)
      jimuMapView?.removeJimuLayerViewsVisibleChangeListener(jimuLayerViewChangedListener)
    }
  }, [jimuMapView])

  React.useEffect(() => {
    if (!jimuLayerViews || !layerList) return
    const initTree = constructTree(jimuLayerViews, layerList, hideLayers, toggleLayerVisibility)
    setRootItemJson(initTree)
  }, [constructTree, jimuLayerViews, layerList, hideLayers, toggleLayerVisibility])

  const handleUpdateLayerItem = (actionData: UpdateTreeActionDataType, refComponent: _TreeItem) => {
    if (actionData.updateType === TreeItemActionType.HandleExpandItem) {
      const layerViewId = actionData.currentItemJson?.itemKey
      const isExpanded = actionData.changeItemJson?.itemStateExpanded
      layerViewId && setExpandedIds(oldExpandedIds => {
        if (isExpanded) {
          return [...oldExpandedIds, layerViewId]
        } else {
          return oldExpandedIds.filter(id => id !== layerViewId)
        }
      })
    }
    if (actionData.updateType === TreeItemActionType.HandleCheckboxChanged) {
      const [currentItemJson] = actionData.itemJsons
      if (isMultiSelection) {
        const newSelectedIds = []
        layerList?.filter((layerInfo: LayerInfo) => layerInfo.selected)?.forEach((layerInfo: LayerInfo) => {
          newSelectedIds.push(layerInfo.layerId)
        })
        // group item
        if (currentItemJson.itemChildren && currentItemJson.itemChildren.length > 0) {
          if (currentItemJson.itemStateChecked) {
            currentItemJson.itemChildren.forEach(child => {
              if (!newSelectedIds.includes(child.itemKey)) {
                newSelectedIds.push(child.itemKey)
              }
            })
          } else if (currentItemJson.itemStateChecked === false) {
            currentItemJson.itemChildren.forEach(child => {
              const index = newSelectedIds.indexOf(child.itemKey)
              if (index > -1) {
                newSelectedIds.splice(index, 1)
              }
            })
          }
        } else {
          if (currentItemJson.itemStateChecked) {
            newSelectedIds.push(currentItemJson.itemKey)
          } else if (currentItemJson.itemStateChecked === false) {
            newSelectedIds.splice(newSelectedIds.indexOf(currentItemJson.itemKey), 1)
          }
        }
        props.onChange(newSelectedIds)
      } else {
        if (currentItemJson.itemStateChecked) {
          props.onChange([currentItemJson.itemKey])
        } else if (currentItemJson.itemStateChecked === false) {
          props.onChange([])
        }
      }
    }
  }

  return (
    <div className='tree-container'>
      {isLoading
        ? <Loading useAriaLive className='w-100 h-100' type={LoadingType.Secondary} />
        : <Tree
          size='sm'
          className='w-100'
          collapseStyle={TreeCollapseStyle.Arrow}
          dndEnabled={false}
          isMultiSelection={isAllowDeactivateLayers}
          checkboxLinkage={isAllowDeactivateLayers}
          onUpdateItem={handleUpdateLayerItem}
          rootItemJson={rootItemJson}
          treeAlignmentType={TreeAlignmentType.Intact}
          disableDoubleClickTitle={true}
          treeStyle={TreeStyle.Basic}
          singleLineText={true}
        />
      }
    </div>
  )
}
