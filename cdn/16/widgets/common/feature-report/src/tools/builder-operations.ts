import type { extensionSpec, IMAppConfig } from 'jimu-core'
import type { IMConfig } from '../config'
import defaultMessages from '../setting/translations/default'

interface TranslationConfigItem {
  field: keyof Pick<IMConfig,
  | 'inputFeaturesLabel'
  | 'selectTemplateLabel'
  | 'reportSettingLabel'
  | 'showCreditsLabel'
  | 'generateReportLabel'
  | 'recentReportsLabel'
  | 'reportName'
  | 'inputFeatureTemplate'
  | 'fileOptionsLabel'
  | 'reportNameLabel'
  | 'saveToAGSAccountLabel'
  | 'outputFormatLabel'>
  label: string | extensionSpec.I18nLabel
  valueType: extensionSpec.TranslationKeyValue['valueType']
}

const translationConfigItems: TranslationConfigItem[] = [
  {
    field: 'inputFeaturesLabel',
    label: {
      key: 'inputFeatures',
      enLabel: defaultMessages.inputFeatures
    },
    valueType: 'text'
  },
  {
    field: 'selectTemplateLabel',
    label: {
      key: 'selectTemplate',
      enLabel: defaultMessages.selectPrintTemplate
    },
    valueType: 'text'
  },
  {
    field: 'reportSettingLabel',
    label: {
      key: 'reportSetting',
      enLabel: defaultMessages.reportSettings
    },
    valueType: 'text'
  },
  {
    field: 'showCreditsLabel',
    label: {
      key: 'showCredits',
      enLabel: defaultMessages.showCredits
    },
    valueType: 'text'
  },
  {
    field: 'generateReportLabel',
    label: {
      key: 'generateReport',
      enLabel: defaultMessages.generateReports
    },
    valueType: 'text'
  },
  {
    field: 'recentReportsLabel',
    label: {
      key: 'recentReports',
      enLabel: defaultMessages.recentReports
    },
    valueType: 'text'
  },
  {
    field: 'inputFeatureTemplate',
    label: 'Input feature template',
    valueType: 'text'
  },
  {
    field: 'reportName',
    label: 'Report name template',
    valueType: 'text'
  },
  {
    field: 'fileOptionsLabel',
    label: {
      key: 'fileOptions',
      enLabel: defaultMessages.reportSettingsFileOptions
    },
    valueType: 'text'
  },
  {
    field: 'reportNameLabel',
    label: {
      key: 'reportName',
      enLabel: defaultMessages.reportSettingsFileName
    },
    valueType: 'text'
  },
  {
    field: 'saveToAGSAccountLabel',
    label: {
      key: 'saveToAGSAccount',
      enLabel: defaultMessages.reportSettingsSaveLocation
    },
    valueType: 'text'
  },
  {
    field: 'outputFormatLabel',
    label: {
      key: 'outputFormat',
      enLabel: defaultMessages.reportSettingsFormat
    },
    valueType: 'text'
  }
]

export default class BuilderOperations implements extensionSpec.BuilderOperationsExtension {
  id = 'feature-report-builder-operation'
  widgetId: string

  getTranslationKey (appConfig: IMAppConfig): Promise<extensionSpec.TranslationKey[]> {
    const config = appConfig.widgets[this.widgetId]?.config as IMConfig
    const keys: extensionSpec.TranslationKey[] = []

    translationConfigItems.forEach(({ field, label, valueType }) => {
      if (!config?.[field]) {
        return
      }

      keys.push({
        keyType: 'value',
        key: `widgets.${this.widgetId}.config.${field}`,
        label,
        valueType
      })
    })

    return Promise.resolve(keys)
  }
}