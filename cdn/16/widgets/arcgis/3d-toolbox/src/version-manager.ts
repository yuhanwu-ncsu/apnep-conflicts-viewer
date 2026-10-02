import { BaseVersionManager } from 'jimu-core'

import { upgrader as upgrader_1_21_0 } from './common/version-manager-utils/1.21.0'


class VersionManager extends BaseVersionManager {
  versions = [{
    version: '1.11.0',
    description: 'support version manager for Slice ,#12467',
    upgrader: (oldConfig) => {
      const DEFAULT_SLICE_CONFIG = { // default config for 1.11
        id: 'slice',
        enable: false, // hidden for config update
        activedOnLoad: false,
        config: {
          tiltEnabled: false,
          excludeGroundSurface: true,
          analyses: []
        }
      }

      const toolsConfig = oldConfig.tools.concat([DEFAULT_SLICE_CONFIG]) // add default slice config
      oldConfig = oldConfig.setIn(['tools'], toolsConfig)

      return oldConfig
    }
  },{
    version: '1.21.0',
    description: 'support default time setting for Daylight ans ShadowCast',
    upgrader: upgrader_1_21_0
  }]
}
export const versionManager: BaseVersionManager = new VersionManager()
