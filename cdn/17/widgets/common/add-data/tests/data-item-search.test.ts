import { DataSourceTypes, SupportedItemTypes as JimuSupportedItemTypes } from 'jimu-core'
import { addDataSupportedItemTypes, getDsJsonFromItem } from '../src/runtime/components/add-data-popper/data-item-search'

describe('add-data data-item-search - KG support', () => {
  it('includes knowledge graph layer item type in supported item list', () => {
    expect(addDataSupportedItemTypes).toContain(JimuSupportedItemTypes.KnowledgeGraphLayer)
  })

  it('creates kg layer ds json when selecting a kg item', async () => {
    const dsJson = await getDsJsonFromItem('kg-ds-1', {
      id: 'kg-item-1',
      title: 'Knowledge graph sample',
      type: JimuSupportedItemTypes.KnowledgeGraphLayer,
      url: 'https://sampleserver7.arcgisonline.com/server/rest/services/Hosted/BumbleBees/KnowledgeGraphServer',
      portalUrl: 'https://www.arcgis.com'
    } as any)

    expect(dsJson).toBeTruthy()
    expect(dsJson.type).toBe(DataSourceTypes.KnowledgeGraphLayer)
    expect(dsJson.itemId).toBe('kg-item-1')
  })
})
