import { type DateTimeFieldFormatProperties, dateUtils, EsriFieldType, WidgetVersionManager, type WidgetUpgradeInfo, Immutable } from 'jimu-core'

export class VersionManager extends WidgetVersionManager {
  versions: any[] = [{
    version: '1.16.0',
    description: 'Upgrade my location setting config for selectedFields, and use output dataSources with fields',
    upgradeFullInfo: true,
    upgrader: (oldInfo: WidgetUpgradeInfo) => {
      const changedFields = {
        ObjectID: 'OBJECTID',
        Time: 'location_timestamp',
        Altitude: 'altitude',
        Speed: 'speed',
        LineId: 'LineID'
      }
      let newConfig = oldInfo.widgetJson.config
      if (newConfig?.selectedFields) {
        const selectedFields = newConfig.selectedFields
        const newSelectedFields = [...newConfig.selectedFields]

        selectedFields.forEach((field, index) => {
          if (Object.keys(changedFields).includes(field)) {
            newSelectedFields[index] = changedFields[field]
          }
        })
        newConfig = newConfig.setIn(['selectedFields'], newSelectedFields)
      }
      const widgetOutputDataSources = oldInfo.widgetJson.outputDataSources
      let outputDataSources = oldInfo.outputDataSourceJsons
      if (outputDataSources) {
        widgetOutputDataSources.forEach((outputDataSource) => {
          // update fields
          const fields = outputDataSources[outputDataSource].schema.fields
          const newFields = { ...fields }
          Object.keys(fields).forEach((fieldName) => {
            if (Object.keys(changedFields).includes(fieldName)) {
              const newFieldObj = { ...fields[fieldName] }
              if (newFieldObj.name === outputDataSources[outputDataSource].schema.idField) {
                newFieldObj.esriType = EsriFieldType.OID
              }
              newFieldObj.name = changedFields[fieldName]
              newFieldObj.jimuName = changedFields[fieldName]
              delete newFields[fieldName]
              newFields[changedFields[fieldName]] = newFieldObj
            }
          })
          outputDataSources = outputDataSources.setIn([outputDataSource, 'schema', 'fields'], newFields)
          // update scheme idField
          if (Object.keys(changedFields).includes(outputDataSources[outputDataSource].schema.idField)) {
            outputDataSources = outputDataSources.setIn([outputDataSource, 'schema', 'idField'], changedFields[outputDataSources[outputDataSource].schema.idField])
          }
        })
      }

      const widgetJson = oldInfo.widgetJson.set('config', newConfig)
      const updatedInfo = { widgetJson, outputDataSourceJsons: outputDataSources }
      return updatedInfo
    }
  }, {
    version: '1.20.0',
    description: 'Upgrade appConfig for my location, replace schema fields format prop with fieldFormat",',
    upgradeFullInfo: true,
    upgrader: (oldInfo: WidgetUpgradeInfo) => {
      const changedFields = [
        'location_timestamp',
        'StartTime',
        'EndTime'
      ]
      const widgetOutputDataSources = oldInfo.widgetJson.outputDataSources
      let outputDataSources = oldInfo.outputDataSourceJsons
      if (outputDataSources) {
        widgetOutputDataSources.forEach((outputDataSource) => {
          // update fields
          const fields = outputDataSources[outputDataSource].schema.fields
          const newFields = { ...fields }
          Object.keys(fields).forEach((fieldName) => {
            if (changedFields.includes(fieldName)) {
              const newFieldObj = { ...fields[fieldName] }
              delete newFieldObj.format
              newFieldObj.fieldFormat = Immutable(dateUtils.DATE_TIME_DEFAULT_ESRI_FORMAT as DateTimeFieldFormatProperties)
              newFields[fieldName] = newFieldObj
            }
          })
          outputDataSources = outputDataSources.setIn([outputDataSource, 'schema', 'fields'], newFields)
        })
      }
      const updatedInfo = { widgetJson: oldInfo.widgetJson, outputDataSourceJsons: outputDataSources }
      return updatedInfo
    }
  }]
}

export const versionManager: WidgetVersionManager = new VersionManager()
