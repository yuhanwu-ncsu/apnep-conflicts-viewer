import { WidgetVersionManager } from 'jimu-core'

class VersionManager extends WidgetVersionManager {
  versions: any[] = [
    {
      version: '1.20.0',
      description:
        'The old viewerToolsEnabled property if configured, is used to define if Current Footprint, Additional Footprints and Additional Camera Locations tools are enabled. Also, if the viewerToolsEnabled property is false, then the action bar should not appear.',
      upgrader: (oldConfig) => {
        let newConfig = oldConfig
        const viewerToolsEnabled = Boolean(oldConfig.viewerToolsEnabled)
        const newSettingsDependentOnViewerTools = [
          'currentFootprintEnabled',
          'additionalFootprintsEnabled',
          'additionalCameraLocationsEnabled'
        ]

        newSettingsDependentOnViewerTools.forEach((setting) => {
          newConfig = newConfig.set(setting, viewerToolsEnabled)
        })

        if (viewerToolsEnabled) return newConfig

        const settingsForOtherActionBarElements = [
          'exploreImages2DEnabled',
          'exploreImages3DEnabled',
          'displayImagesEnabled',
          'mapImageConversionToolEnabled',
          'imageOverlaysEnabled',
          'directionalNavigationEnabled',
          'sequentialNavigationEnabled',
          'imageGalleryEnabled',
          'navigationToolEnabled',
          'measurementToolsEnabled',
          'imageEnahncementEnabled',
          'showPopupsActionEnabled'
        ]

        settingsForOtherActionBarElements.forEach((setting) => {
          newConfig = newConfig.set(setting, false)
        })

        return newConfig
      }
    }
  ]
}

export const versionManager: WidgetVersionManager = new VersionManager()
