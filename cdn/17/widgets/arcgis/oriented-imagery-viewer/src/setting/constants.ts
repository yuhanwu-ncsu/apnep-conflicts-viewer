import type { SettingInfo, SettingSectionInfo } from '../config'

export const settingSectionsInfo: SettingSectionInfo[] = [
  {
    sectionName: 'searchTools',
    sectionNameLabelKey: 'searchToolsLabel',
    toggles: [
      {
        name: 'exploreImages2DEnabled',
        labelKey: 'exploreImages2DToggleLabel'
      },
      {
        name: 'exploreImages3DEnabled',
        labelKey: 'exploreImages3DToggleLabel'
      },
      {
        name: 'displayImagesEnabled',
        labelKey: 'displayImagesToggleLabel'
      }
    ]
  },
  {
    sectionName: 'graphicTools',
    sectionNameLabelKey: 'graphicToolsLabel',
    toggles: [
      {
        name: 'currentFootprintEnabled',
        labelKey: 'currentFootprintToggleLabel'
      },
      {
        name: 'additionalFootprintsEnabled',
        labelKey: 'additionalFootprintsToggleLabel'
      },
      {
        name: 'additionalCameraLocationsEnabled',
        labelKey: 'additionalCameraLocationsToggleLabel'
      },
      {
        name: 'mapImageConversionToolEnabled',
        labelKey: 'mapImageConversionToolToggleLabel'
      },
      {
        name: 'imageOverlaysEnabled',
        labelKey: 'imageOverlaysToggleLabel',
        subTools: [
          {
            name: 'dataCaptureEnabled',
            labelKey: 'digitizationToggleLabel'
          }
        ]
      }
    ]
  },
  {
    sectionName: 'imageNavigation',
    sectionNameLabelKey: 'imageNavigationLabel',
    toggles: [
      {
        name: 'directionalNavigationEnabled',
        labelKey: 'directionalNavigationToggleLabel'
      },
      {
        name: 'sequentialNavigationEnabled',
        labelKey: 'sequentialNavigationToggleLabel'
      },
      {
        name: 'imageGalleryEnabled',
        labelKey: 'imageGalleryToolToggleLabel'
      },
      {
        name: 'navigationToolEnabled',
        labelKey: 'navigationToolToggleLabel'
      }
    ]
  },
  {
    sectionName: 'measurementTools',
    sectionNameLabelKey: undefined,
    toggles: [
      {
        name: 'measurementToolsEnabled',
        labelKey: 'measurementToolsToggleLabel'
      }
    ]
  },
  {
    sectionName: 'utilityTools',
    sectionNameLabelKey: 'utilityToolsLabel',
    toggles: [
      {
        name: 'imageEnahncementEnabled',
        labelKey: 'imageEnhancementToolToggleLabel'
      },
      {
        name: 'showPopupsActionEnabled',
        labelKey: 'showPopupsActionToggleLabel'
      },
      {
        name: 'superimposeEnabled',
        labelKey: 'superimposeToggleLabel'
      }
    ]
  },
  {
    sectionName: 'configureExtents',
    sectionNameLabelKey: 'configureExtentsLabel',
    toggles: [
      {
        name: 'navigateToExtentEnabled',
        labelKey: 'navigateToExtentLabel'
      }
    ]
  }
]

export const extentSettingsInfo: SettingInfo[] = [
  {
    name: 'navigateToExtentEnabled',
    labelKey: 'navigateToExtentLabel'
  }
]
