import { type DataSourceJson, DataSourceTypes } from 'jimu-core'

export interface WmtsSelectionOptions {
  wmtsLayerId: string
  wmtsTileMatrixSetId: string
  sourceLabel?: string
}

export interface WmtsDataSourceJson extends DataSourceJson {
  wmtsLayerId?: string
  wmtsTileMatrixSetId?: string
}

export const hasWmtsSelection = (dataSourceJson: DataSourceJson): dataSourceJson is WmtsDataSourceJson => {
  return dataSourceJson?.type === DataSourceTypes.WMTS &&
    !!(dataSourceJson as WmtsDataSourceJson)?.wmtsLayerId &&
    !!(dataSourceJson as WmtsDataSourceJson)?.wmtsTileMatrixSetId
}

export const applyWmtsSelectionToDataSourceJson = (
  dataSourceJson: DataSourceJson,
  options: WmtsSelectionOptions
): WmtsDataSourceJson => {
  return {
    ...dataSourceJson,
    sourceLabel: options.sourceLabel || dataSourceJson.sourceLabel,
    wmtsLayerId: options.wmtsLayerId,
    wmtsTileMatrixSetId: options.wmtsTileMatrixSetId
  }
}

export const createConfiguredWmtsLayer = (
  WMTSLayer: typeof __esri.WMTSLayer,
  dataSourceJson: WmtsDataSourceJson
): __esri.WMTSLayer => {
  return new WMTSLayer({
    url: dataSourceJson.url,
    title: dataSourceJson.label || dataSourceJson.sourceLabel,
    activeLayer: {
      id: dataSourceJson.wmtsLayerId,
      tileMatrixSetId: dataSourceJson.wmtsTileMatrixSetId
    }
  })
}
