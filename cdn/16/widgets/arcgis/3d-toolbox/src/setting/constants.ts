import { DefaultTimeSettingMode } from "../constraints"

export const TimeSettingModeOptions = [
  {
    value: DefaultTimeSettingMode.SyncWithScene,
    labelTranslateKey: 'syncWithScene'
  },
  {
    value: DefaultTimeSettingMode.SyncWithApp,
    labelTranslateKey: 'syncWithApp'
  },
  {
    value: DefaultTimeSettingMode.SyncWithCurrentDateAndTime,
    labelTranslateKey: 'syncWithCurrentDateAndTime'
  },
  {
    value: DefaultTimeSettingMode.Custom,
    labelTranslateKey: 'custom'
  }
]

