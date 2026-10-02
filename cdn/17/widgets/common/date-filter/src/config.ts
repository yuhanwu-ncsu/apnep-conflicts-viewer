import type { ImmutableArray, ImmutableObject, UseDataSource } from 'jimu-core'

export type DateType = string | string[]

export enum SelectionMode {
  Single = 'SINGLE',
  Range = 'RANGE'
}

export enum FilterStyle {
  Inline = 'INLINE',
  Icon = 'ICON',
  Input = 'INPUT'
}

export enum FilterRelationship {
  Before = 'BEFORE',
  After = 'AFTER',
  Intersect = 'INTERSECT' // by default
}


export interface LayerConfig {
  useDataSource?: UseDataSource
  startField: string
  endField?: string
}
export type IMLayerConfig = ImmutableObject<LayerConfig>
export type IMLayerConfigList = ImmutableArray<LayerConfig>

export interface MapViewConfig {
  customizeLayers: boolean
  customJimuLayerViewIds?: string[]
  layerConfigList?: IMLayerConfigList
  displayRuntimeLayers?: boolean
}

export interface MapViewConfigList {
  [jimuMapViewId: string]: MapViewConfig
}
export type IMMapViewConfigList = ImmutableObject<MapViewConfigList>

export interface config {
  /**
   * Whether to add source by data.
   * Two way to add data source: by data selector or by Map widget.
   * Default: true in full mode, false in express mode.
   */
  addSourceByData: boolean
  /**
   * Added layers.
   * Valid when addSourceByData is true.
   */
  layerConfigList?: IMLayerConfigList
  /**
   * map views config for selected map widget.
   * Valid when addSourceByData is false.
   */
  mapViewConfigList?: IMMapViewConfigList
  /**
   * The style of date filter widget.
   * Default: FilterStyle.Icon
   */
  filterStyle: FilterStyle
  /**
   * The selection mode of date filter widget.
   * Default: SelectionMode.Single
   */
  selectionMode: SelectionMode
  /**
   * The default day to locate.
   * It supports virtual date types, and exact date value in 'yyyy-mm-dd' patterns.
   * Default: 'today'
   */
  defaultDay: DateType
  /**
   * Whether to auto apply filter with the defaultDay.
   * Default: false
   */
  autoApply: boolean
}

export type IMConfig = ImmutableObject<config>
