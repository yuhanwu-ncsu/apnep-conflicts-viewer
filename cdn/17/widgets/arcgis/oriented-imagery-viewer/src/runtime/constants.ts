import type { ConfigToVisibleElementMap } from '../config'

export const visibleElementToConfigMap = {
  searchTools: ['exploreImages2DEnabled', 'exploreImages3DEnabled', 'displayImagesEnabled'],
  overlays: [
    'currentFootprintEnabled',
    'additionalFootprintsEnabled',
    'additionalCameraLocationsEnabled',
    'mapImageConversionToolEnabled',
    'imageOverlaysEnabled'
  ],
  imageNavigationTools: [
    'directionalNavigationEnabled',
    'sequentialNavigationEnabled',
    'imageGalleryEnabled',
    'navigationToolEnabled'
  ],
  measurementTools: ['measurementToolsEnabled'],
  utilityTools: ['imageEnahncementEnabled', 'showPopupsActionEnabled', 'superimposeEnabled'],
  exploreImages: ['exploreImages2DEnabled'],
  exploreImages3D: ['exploreImages3DEnabled'],
  showSelectedImage: ['displayImagesEnabled'],
  currentFootprintToggle: ['currentFootprintEnabled'],
  additionalCameraLocationsToggle: ['additionalCameraLocationsEnabled'],
  additionalFootprintToggle: ['additionalFootprintsEnabled'],
  mapImageConversionTool: ['mapImageConversionToolEnabled'],
  directionalNavigation: ['directionalNavigationEnabled'],
  sequentialNavigation: ['sequentialNavigationEnabled'],
  navigationTool: ['navigationToolEnabled'],
  imageGallery: ['imageGalleryEnabled'],
  enhancementTool: ['imageEnahncementEnabled'],
  showPopupsAction: ['showPopupsActionEnabled'],
  imageOverlays: ['imageOverlaysEnabled'],
  superimpose: ['superimposeEnabled']
} satisfies ConfigToVisibleElementMap
