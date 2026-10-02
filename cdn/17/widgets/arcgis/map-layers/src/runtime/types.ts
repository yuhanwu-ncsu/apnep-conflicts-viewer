import type Collection from '@arcgis/core/core/Collection'

export interface ListActionItem {
  id: string
  title: string
  icon?: string
  className?: string
}

export interface ListPanelConfig {
  content: 'legend'
  open?: boolean
}

export interface BaseListItemType {
  layer: __esri.Layer & {
    id?: string
    legendEnabled?: boolean
  }
  parent?: BaseListItemType | null
  children?: ListItemCollection<BaseListItemType> | null
  open?: boolean
  hidden?: boolean
  panel?: ListPanelConfig
  actionsSections?: ListActionItem[][]
}

export type ListItemCollection<T extends BaseListItemType> = Collection<T> | T[]
export interface LayerListItemType extends BaseListItemType {}
export interface TableListItemType extends BaseListItemType {}
export type AnyListItem = LayerListItemType | TableListItemType
export type LayerListItemCollection = ListItemCollection<LayerListItemType>
export type TableListItemCollection = ListItemCollection<TableListItemType>
