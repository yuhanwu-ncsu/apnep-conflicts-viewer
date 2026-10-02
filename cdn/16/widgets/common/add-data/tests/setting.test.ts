import { ItemTypeCategory } from 'jimu-ui/basic/item-selector'
import { supportedItemTypeCategories } from '../src/setting/setting'

describe('add-data setting - data type restriction', () => {
  it('contains knowledge graph category', () => {
    expect(supportedItemTypeCategories).toContain(ItemTypeCategory.KnowledgeGraph)
  })
})
