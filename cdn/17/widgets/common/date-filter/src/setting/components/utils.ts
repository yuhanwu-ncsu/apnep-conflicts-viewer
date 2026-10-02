import type { DataSource, UseDataSource } from 'jimu-core'
import type { LayerConfig } from '../../config'
import { getStartAndEndDateFieldsFromLayerDs } from '../../utils/utils'


export function getDefaultLayerConfig (dataSource: DataSource, useDataSource?: UseDataSource, checkDateFieldsCount = false): LayerConfig {
  const { startField, endField } = getStartAndEndDateFieldsFromLayerDs(dataSource, checkDateFieldsCount)
  if (!startField) {
    return null
  }
  useDataSource = useDataSource || getUseDataSourceByDataSource(dataSource)
  // useDataSource.fields = [startField.jimuName] // todo when selection view ds is supported
  const layerItem: LayerConfig = {
    useDataSource: useDataSource,
    startField: startField?.jimuName,
    endField: endField?.jimuName || null
  }
  return layerItem
}

function getUseDataSourceByDataSource (ds: DataSource): UseDataSource {
  const dataSourceId = ds.id
  const mainDs = ds.getMainDataSource()
  const rootDs = ds.getRootDataSource()
  const mainDataSourceId = mainDs ? mainDs.id : dataSourceId
  const rootDataSourceId = rootDs ? rootDs.id : ''
  return {
    dataSourceId,
    mainDataSourceId,
    rootDataSourceId
  }
}
