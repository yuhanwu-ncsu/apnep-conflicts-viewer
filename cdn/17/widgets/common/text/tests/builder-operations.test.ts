import BuilderOperations, { hasTranslatableText } from '../src/tools/builder-operations'
const defaultConfig = require('../config.json')

describe('text builder operations', () => {
  const createBuilder = (): BuilderOperations => {
    const builder = new BuilderOperations()
    builder.widgetId = 'widget_1'
    return builder
  }

  const createAppConfig = (text: string): any => ({
    widgets: {
      widget_1: {
        config: {
          text
        }
      }
    }
  })

  it('does not treat blank rich text as translatable text', () => {
    expect(hasTranslatableText('<p></p>')).toBe(false)
  })

  it('does not treat the default placeholder as translatable text', () => {
    expect(hasTranslatableText(defaultConfig.placeholder)).toBe(false)
    expect(hasTranslatableText(`<p><span>${defaultConfig.placeholder}</span></p>`)).toBe(false)
  })

  it('returns a text translation key for real text content', async () => {
    const keys = await createBuilder().getTranslationKey(createAppConfig('<p>Hello</p>'))

    expect(keys).toEqual([
      expect.objectContaining({
        key: 'widgets.widget_1.config.text',
        valueType: 'rich-text-with-plugins'
      })
    ])
  })

  it('skips text translation key for the default placeholder', async () => {
    const keys = await createBuilder().getTranslationKey(createAppConfig(`<p>${defaultConfig.placeholder}</p>`))

    expect(keys).toEqual([])
  })
})
