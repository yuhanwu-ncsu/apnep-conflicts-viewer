import type OrientedImageryLayer from '@arcgis/core/layers/OrientedImageryLayer'
import type OrientedImageryViewer from '@arcgis/core/widgets/OrientedImageryViewer'
import type { ImmutableObject } from 'jimu-core'
import type defaultI18nSettingMessages from './setting/translations/default'

export interface SettingInfo {
  name: keyof Config
  labelKey: keyof typeof defaultI18nSettingMessages
  subTools?: SettingInfo[]
}

export interface SettingSectionInfo {
  sectionName: string
  sectionNameLabelKey?: keyof typeof defaultI18nSettingMessages
  toggles: SettingInfo[]
}

export interface OiViewerVisibleElements {
  menu: boolean
  header: boolean
  closeButton: boolean
  searchTools: boolean
  exploreImages: boolean
  exploreImages3D: boolean
  showSelectedImage: boolean
  overlays: boolean
  currentFootprintToggle: boolean
  additionalFootprintToggle: boolean
  additionalCameraLocationsToggle: boolean
  mapImageConversionTool: boolean
  imageNavigationTools: boolean
  directionalNavigation: boolean
  sequentialNavigation: boolean
  navigationTool: boolean
  imageGallery: boolean
  measurementTools: boolean
  utilityTools: boolean
  enhancementTool: boolean
  showPopupsAction: boolean
  imageOverlays: boolean
  dataCaptureEnabled: boolean
  superimpose: boolean
}

export interface OiViewerWithVisibleElements extends Omit<OrientedImageryViewer, 'visibleElements'> {
  dataCaptureEnabled: boolean
  visibleElements: OiViewerVisibleElements
  preloadMedia: boolean
}

export interface OiLayerInstance {
  id: string
  layer: OrientedImageryLayer
}

export interface Config {
  viewerToolsEnabled: boolean
  imageEnahncementEnabled: boolean
  imageGalleryEnabled: boolean
  mapImageConversionToolEnabled: boolean
  showPopupsActionEnabled: boolean
  superimposeEnabled: boolean
  navigationToolEnabled: boolean
  directionalNavigationEnabled: boolean
  sequentialNavigationEnabled: boolean
  measurementToolsEnabled: boolean
  imageOverlaysEnabled: boolean
  dataCaptureEnabled: boolean
  navigateToExtentEnabled: boolean
  exploreImages2DEnabled: boolean
  exploreImages3DEnabled: boolean
  displayImagesEnabled: boolean
  currentFootprintEnabled: boolean
  additionalFootprintsEnabled: boolean
  additionalCameraLocationsEnabled: boolean
}

export type IMConfig = ImmutableObject<Config>

export type OiViewerVisibleElement = Extract<keyof OiViewerVisibleElements, string>
export type IMConfigKey = Extract<keyof IMConfig, string>

export type ConfigToVisibleElementMap = {
  readonly [K in OiViewerVisibleElement]?: readonly IMConfigKey[]
}
