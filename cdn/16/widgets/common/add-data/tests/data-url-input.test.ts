import { DataSourceTypes } from 'jimu-core'
import { getDsJsonFromUrl, SupportedUrlTypes } from '../src/runtime/components/add-data-popper/data-url-input'

describe('add-data data-url-input - WMTS options', () => {
  it('stores WMTS layer selection in ds json', async () => {
    const dsJson = await getDsJsonFromUrl(
      'wmts-ds-1',
      'https://example.com/wmts?request=GetCapabilities&service=WMTS',
      SupportedUrlTypes.WMTS,
      {
        wmtsLayerId: 'ortofoto',
        wmtsTileMatrixSetId: 'EPSG:5514',
        sourceLabel: 'Orthophoto'
      }
    ) as any

    expect(dsJson.type).toBe(DataSourceTypes.WMTS)
    expect(dsJson.sourceLabel).toBe('Orthophoto')
    expect(dsJson.wmtsLayerId).toBe('ortofoto')
    expect(dsJson.wmtsTileMatrixSetId).toBe('EPSG:5514')
  })

  it('keeps legacy WMTS ds json shape when selection is absent', async () => {
    const dsJson = await getDsJsonFromUrl(
      'wmts-ds-2',
      'https://example.com/wmts?request=GetCapabilities&service=WMTS',
      SupportedUrlTypes.WMTS
    ) as any

    expect(dsJson.type).toBe(DataSourceTypes.WMTS)
    expect(dsJson.wmtsLayerId).toBeUndefined()
    expect(dsJson.wmtsTileMatrixSetId).toBeUndefined()
  })
})
