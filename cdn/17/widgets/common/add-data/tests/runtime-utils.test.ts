import * as jimuCore from 'jimu-core'
import { DataSourceManager, DataSourceTypes, ExportFormat, Immutable, MessageManager } from 'jimu-core'
import { createDataSourcesByDataOptions } from '../src/runtime/utils'

jest.mock('jimu-core', () => {
  const actual = jest.requireActual('jimu-core')
  return {
    ...actual,
    loadArcGISJSAPIModule: jest.fn(actual.loadArcGISJSAPIModule)
  }
})

jest.mock('../src/runtime/kml-utils', () => ({
  applyFeatureCollectionToChildDataSources: jest.fn(),
  applyGroupLayerForChildDataSourceJsons: jest.fn().mockResolvedValue(undefined),
  clearFeatureCollectionCache: jest.fn(),
  extractFeatureCollectionDataFromChildDataSourceJsons: jest.fn((dataSourceJson) => ({ dataSourceJson, itemData: null }))
}))

const mockedLoadArcGISJSAPIModule = jimuCore.loadArcGISJSAPIModule as jest.MockedFunction<typeof jimuCore.loadArcGISJSAPIModule>

describe('add-data runtime utils', () => {
  afterEach(() => {
    mockedLoadArcGISJSAPIModule.mockReset()
    jest.restoreAllMocks()
  })

  it('creates kg layer ds and keeps kg sublayer children ready', async () => {
    const childDataSourceJson = Immutable({
      id: 'kg-sub-1',
      type: DataSourceTypes.KnowledgeGraphSublayer,
      sourceLabel: 'entity'
    })
    const childDs = {
      id: 'kg-sub-1',
      getDataSourceJson: jest.fn(() => childDataSourceJson)
    }

    const childDataSourcesReady = jest.fn().mockResolvedValue(undefined)
    const mainDs = {
      id: 'kg-layer-1',
      isDataSourceSet: jest.fn(() => true),
      areChildDataSourcesCreated: jest.fn(() => false),
      childDataSourcesReady,
      getChildDataSources: jest.fn(() => [childDs]),
      getAllChildDataSources: jest.fn(() => [childDs]),
      getDataSourceJson: jest.fn(() => Immutable({
        id: 'kg-layer-1',
        type: DataSourceTypes.KnowledgeGraphLayer,
        sourceLabel: 'kg layer'
      }))
    }

    const updateDataSourceByDataSourceJson = jest.fn()
    jest.spyOn(DataSourceManager, 'getInstance').mockReturnValue({
      createDataSource: jest.fn().mockResolvedValue(mainDs),
      updateDataSourceByDataSourceJson
    } as any)

    const publishMessage = jest.fn()
    jest.spyOn(MessageManager, 'getInstance').mockReturnValue({
      publishMessage
    } as any)

    const dataSources = await createDataSourcesByDataOptions(
      [{
        order: 0,
        dataSourceJson: {
          id: 'kg-layer-1',
          type: DataSourceTypes.KnowledgeGraphLayer,
          sourceLabel: 'kg layer',
          url: 'https://sampleserver7.arcgisonline.com/server/rest/services/Hosted/BumbleBees/KnowledgeGraphServer'
        }
      }],
      'widget_1',
      {
        disableExport: false,
        notAllowedExportFormat: [ExportFormat.Item]
      } as any
    )

    expect(dataSources).toHaveLength(1)
    expect(dataSources[0]).toBe(mainDs)
    expect(childDataSourcesReady).toHaveBeenCalledTimes(1)
    const childTypes = mainDs.getAllChildDataSources().map((ds: any) => ds.getDataSourceJson().type)
    expect(childTypes).toContain(DataSourceTypes.KnowledgeGraphSublayer)
    expect(updateDataSourceByDataSourceJson).toHaveBeenCalled()
    expect(publishMessage).toHaveBeenCalled()
  })

  it('rebuilds configured WMTS layers from cached ds json', async () => {
    class MockWMTSLayer {
      url: string
      title: string
      activeLayer: { id: string, tileMatrixSetId: string }

      constructor (props: { url: string, title: string, activeLayer: { id: string, tileMatrixSetId: string } }) {
        Object.assign(this, props)
      }
    }

    mockedLoadArcGISJSAPIModule.mockResolvedValue(MockWMTSLayer as any)

    const mainDs = {
      id: 'wmts-layer-1',
      isDataSourceSet: jest.fn(() => false),
      areChildDataSourcesCreated: jest.fn(() => true),
      getAllChildDataSources: jest.fn(() => []),
      getDataSourceJson: jest.fn(() => Immutable({
        id: 'wmts-layer-1',
        type: DataSourceTypes.WMTS,
        sourceLabel: 'Orthophoto'
      }))
    }

    const createDataSource = jest.fn().mockResolvedValue(mainDs)
    jest.spyOn(DataSourceManager, 'getInstance').mockReturnValue({
      createDataSource,
      updateDataSourceByDataSourceJson: jest.fn()
    } as any)

    jest.spyOn(MessageManager, 'getInstance').mockReturnValue({
      publishMessage: jest.fn()
    } as any)

    await createDataSourcesByDataOptions(
      [{
        order: 0,
        dataSourceJson: {
          id: 'wmts-layer-1',
          type: DataSourceTypes.WMTS,
          sourceLabel: 'Orthophoto',
          url: 'https://example.com/wmts',
          wmtsLayerId: 'ortofoto',
          wmtsTileMatrixSetId: 'EPSG:5514'
        } as any
      }],
      'widget_1',
      {
        disableExport: false,
        notAllowedExportFormat: [ExportFormat.Item]
      } as any
    )

    expect(mockedLoadArcGISJSAPIModule).toHaveBeenCalledWith('esri/layers/WMTSLayer')
    expect(createDataSource).toHaveBeenCalledTimes(1)
    expect(createDataSource.mock.calls[0][0].layer).toBeInstanceOf(MockWMTSLayer)
    expect(createDataSource.mock.calls[0][0].layer.activeLayer).toEqual({
      id: 'ortofoto',
      tileMatrixSetId: 'EPSG:5514'
    })
  })
})
