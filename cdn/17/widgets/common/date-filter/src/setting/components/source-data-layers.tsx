import { classNames, type DataSource, hooks, Immutable, React, urlUtils } from 'jimu-core'
import { styled } from 'jimu-theme'
import { Alert, Button, defaultMessages as jimuUIMessages } from 'jimu-ui'
import { SettingRow, SettingSection, SidePopper } from 'jimu-ui/advanced/setting-components'
import { List, TreeItemActionType } from 'jimu-ui/basic/list-tree'
import defaultMessages from './../translations/default'
import type { IMLayerConfig, IMLayerConfigList } from '../../config'
import { SourceLayerConfig } from './source-layer-config'
import { PlusOutlined } from 'jimu-icons/outlined/editor/plus'
import { CloseOutlined } from 'jimu-icons/outlined/editor/close'

interface SourceDataLayersProps {
  layerConfigList: IMLayerConfigList,
  dataSources: { [dsId: string]: DataSource },
  hideBottomBorder: boolean
  onDataSourceChange: (allSelectedDs: any[], index: number) => void
  onLayerConfigChange: (currentLayerConfig: IMLayerConfig, index: number) => void
}

export const SourceDataLayers = (props: SourceDataLayersProps) => {
  const { layerConfigList = Immutable([]), dataSources, hideBottomBorder, onDataSourceChange, onLayerConfigChange } = props
  const [showPanel, setShowPanel] = React.useState(false)
  const [currentIndex, setCurrentIndex] = React.useState(null)
  const [popperFocusNode, setPopperFocusNode] = React.useState(null)

  const currentLayerConfig = layerConfigList[currentIndex] as IMLayerConfig
  const dataSource = dataSources?.[currentLayerConfig?.useDataSource?.dataSourceId]

  const sidePopperTrigger = React.useRef<any>(null) // add button, or the selected layer item
  const i18n = hooks.useTranslation(defaultMessages, jimuUIMessages)

  const isEditingState = layerConfigList.length === currentIndex && showPanel

  const onShowLayerConfigPanel = (index: number, newAdded: boolean) => {
    setSidePopperAnchor(index, newAdded)
    if (index === currentIndex) {
      setShowPanel(!showPanel)
    } else {
      setShowPanel(true)
      setCurrentIndex(index)
    }
  }

  const setSidePopperAnchor = (index?: number, newAdded = false) => {
    let node: any
    if (newAdded) {
      node = sidePopperTrigger.current.getElementsByClassName('add-filter-btn')[0]
    } else {
      node = sidePopperTrigger.current.getElementsByClassName('jimu-tree-item__body')[index]
    }
    setPopperFocusNode(node)
  }

  const onCloseFilterItemPanel = () => {
    setShowPanel(false)
    setCurrentIndex(null)
  }

  const removeFilterItem = (index: number) => {
    onLayerConfigChange(null, index)
    onCloseFilterItemPanel()
  }

  const onFieldsChange = (startField: string, endField: string) => {
    const newLayerConfig = currentLayerConfig.set('startField', startField).set('endField', endField)
    onLayerConfigChange(newLayerConfig, currentIndex)
  }

  const itemsJson = React.useMemo(() => {
    return layerConfigList.map((layerConfig, index) => {
      return {
        itemKey: index + '',
        itemStateChecked: showPanel && currentIndex === index,
        itemStateDetailContent: layerConfig,
      }
    })
  }, [layerConfigList, showPanel, currentIndex])

  return (
    <SettingSection
      className={classNames('pt-1', { 'border-0': hideBottomBorder })}
      ref={sidePopperTrigger}
    >
      <SettingRow>
        <Button
          type='primary'
          className='w-100 text-default add-filter-btn flex-shrink-1'
          aria-label={i18n('selectData')}
          aria-describedby={'selectLayerDesc filter-blank-msg'}
          onClick={() => { onShowLayerConfigPanel(layerConfigList.length, true) }}
        >
          <div className='w-100 px-2 text-truncate'>
            <PlusOutlined className='mr-1' />
            {i18n('selectData')}
          </div>
        </Button>
      </SettingRow>
      {
        // no data hint
        hideBottomBorder && !isEditingState &&
        <SettingRow label={<span id='selectLayerDesc'>{i18n('dateFieldHint')}</span>} flow='wrap' />
      }
      {
        layerConfigList.length > 0 &&
        <SettingRow>
          <div className='layer-list-container w-100'>
            <List
              itemsJson={itemsJson as any}
              onClickItemBody={(actionData, refComponent) => {
                const { itemJsons } = refComponent.props
                const currentItemJson = itemJsons[0]
                const listItemJsons = itemJsons[1] as any
                const index = listItemJsons.indexOf(currentItemJson)
                onShowLayerConfigPanel(index, false)
              }}
              overrideItemBlockInfo={({ itemBlockInfo }) => {
                return {
                  name: TreeItemActionType.RenderOverrideItem,
                  children: [{
                    name: TreeItemActionType.RenderOverrideItemDroppableContainer,
                    children: [{
                      name: TreeItemActionType.RenderOverrideItemDraggableContainer,
                      children: [{
                        name: TreeItemActionType.RenderOverrideItemBody,
                        children: [{
                          name: TreeItemActionType.RenderOverrideItemDragHandle
                        }, {
                          name: TreeItemActionType.RenderOverrideItemMainLine
                        }]
                      }]
                    }]
                  }]
                }
              }}
              renderOverrideItemMainLine={(actionData, refComponent) => {
                const key = parseInt(refComponent.props.itemJsons[0].itemKey)
                const layerDsId = layerConfigList[key]?.useDataSource?.dataSourceId
                return <LayerItem
                  index={key}
                  layerName={dataSources?.[layerDsId]?.getLabel()}
                  hasDateField={!!layerConfigList[key]?.startField}
                  removeFilterItem={removeFilterItem}
                />
              }}
            />
          </div>
        </SettingRow>
      }
      {
        isEditingState &&
        <SettingRow>
          <div className='w-100'><EmptyLayerItem index={currentIndex} /></div>
        </SettingRow>
      }
      <SidePopper
        position='right'
        title={i18n('selectData')}
        isOpen={showPanel && !urlUtils.getAppIdPageIdFromUrl().pageId}
        trigger={sidePopperTrigger?.current}
        backToFocusNode={popperFocusNode}
        toggle={onCloseFilterItemPanel}
      >
        <SourceLayerConfig
          addDataByData={true}
          useDataSource={currentLayerConfig?.useDataSource}
          dataSource={dataSource}
          onDataSourceChange={(allSelectedDs) => { onDataSourceChange(allSelectedDs, currentIndex) }}
          startField={currentLayerConfig?.startField}
          endField={currentLayerConfig?.endField}
          onFieldsChange={onFieldsChange}
        />
      </SidePopper>
    </SettingSection>
  )
}

/**
 * Layer item in the layer list
 */
const LayerItemRoot = styled('div')(({ theme }) => {
  return {
    display: 'flex',
    flex: 1,
    padding: '0.375rem 0.25rem',
    cursor: 'pointer',
    '.layer-name':{
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      display: '-webkit-box',
      WebkitBoxOrient: 'vertical',
      wordBreak: 'break-word',
      WebkitLineClamp: 2,
      lineHeight: 1.3,
    }
  }
})

interface LayerItemProps {
  layerName: string,
  index: number,
  hasDateField: boolean,
  removeFilterItem: (index: number) => void
}

const LayerItem = ({layerName, index, hasDateField, removeFilterItem}: LayerItemProps) => {
  const i18n = hooks.useTranslation(defaultMessages, jimuUIMessages)
  return <LayerItemRoot key={index} className='layer-item align-items-center'>
    <div className='layer-name flex-grow-1'>{layerName}</div>
    {
      !hasDateField &&
      <Alert
        className='mr-2'
        variant='text'
        form='tooltip'
        size='small'
        type='warning'
        text={i18n('noDateFieldsAreDefined')}
      >
      </Alert>
    }
    <Button
      icon
      size='sm'
      type="tertiary"
      disableRipple
      disableHoverEffect
      className='p-0 flex-shrink-0'
      title={i18n('delete')}
      aria-label={i18n('delete')}
      onClick={(evt) => { evt.stopPropagation(); removeFilterItem(index) }}
      onKeyDown={evt => {
        if (evt.key === 'Enter' || evt.key === ' ') {
          evt.preventDefault()
          evt.stopPropagation()
        }
      }}
      onKeyUp={(evt) => {
        if (evt.key === 'Enter' || evt.key === ' ') {
          evt.stopPropagation()
          removeFilterItem(index)
        }
      }}
    >
      <CloseOutlined />
    </Button>
  </LayerItemRoot>
}

/**
 * Empty layer item when adding a new layer
 */
interface EmptyLayerItemProps {
  index: number,
}
const EmptyLayerItem = ({index}: EmptyLayerItemProps) => {
  return (
    <List
      itemsJson={[{
        itemKey: index + '',
        itemStateChecked: true,
        itemStateTitle: '......',
        itemStateCommands: []
      }]}
      dndEnabled={false}
      isItemFocused={() => true}
      overrideItemBlockInfo={(itemBlockInfo) => {
        return {
          name: TreeItemActionType.RenderOverrideItem,
          children: [{
            name: TreeItemActionType.RenderOverrideItemDroppableContainer,
            children: [{
              name: TreeItemActionType.RenderOverrideItemDraggableContainer,
              children: [{
                name: TreeItemActionType.RenderOverrideItemBody,
                children: [
                  {
                    name: TreeItemActionType.RenderOverrideItemMainLine,
                    children: [{
                      name: TreeItemActionType.RenderOverrideItemDragHandle
                    }, {
                      name: TreeItemActionType.RenderOverrideItemIcon
                    }, {
                      name: TreeItemActionType.RenderOverrideItemTitle
                    }]
                  }]
              }]
            }]
          }]
        }
      }}
    />
  )

}