import BuilderOperations from '../src/tools/builder-operations'

describe('directions builder operations', () => {
  function createBuilder (): BuilderOperations {
    const builder = new BuilderOperations()
    builder.widgetId = 'widget_1'
    return builder
  }

  it('creates a translation group and label/hint keys for each locator', async () => {
    const appConfig = {
      widgets: {
        widget_1: {
          config: {
            searchConfig: {
              dataConfig: [
                { label: 'Home Locator', hint: 'Find home' },
                { label: 'Office Locator', hint: 'Find office' }
              ]
            }
          }
        }
      }
    } as any

    const keys = await createBuilder().getTranslationKey(appConfig)

    expect(keys).toEqual(expect.arrayContaining([
      {
        keyType: 'group',
        key: 'widgets.widget_1.config.searchConfig.dataConfig[0]',
        label: 'Home Locator'
      },
      {
        keyType: 'value',
        key: 'widgets.widget_1.config.searchConfig.dataConfig[0].label',
        groupKey: 'widgets.widget_1.config.searchConfig.dataConfig[0]',
        label: {
          key: 'label',
          enLabel: 'Label'
        },
        valueType: 'text'
      },
      {
        keyType: 'value',
        key: 'widgets.widget_1.config.searchConfig.dataConfig[0].hint',
        groupKey: 'widgets.widget_1.config.searchConfig.dataConfig[0]',
        label: {
          key: 'hint',
          enLabel: 'Hint'
        },
        valueType: 'text'
      },
      {
        keyType: 'group',
        key: 'widgets.widget_1.config.searchConfig.dataConfig[1]',
        label: 'Office Locator'
      },
      {
        keyType: 'value',
        key: 'widgets.widget_1.config.searchConfig.dataConfig[1].label',
        groupKey: 'widgets.widget_1.config.searchConfig.dataConfig[1]',
        label: {
          key: 'label',
          enLabel: 'Label'
        },
        valueType: 'text'
      },
      {
        keyType: 'value',
        key: 'widgets.widget_1.config.searchConfig.dataConfig[1].hint',
        groupKey: 'widgets.widget_1.config.searchConfig.dataConfig[1]',
        label: {
          key: 'hint',
          enLabel: 'Hint'
        },
        valueType: 'text'
      }
    ]))
  })

  it('omits hint key when locator hint is missing', async () => {
    const appConfig = {
      widgets: {
        widget_1: {
          config: {
            searchConfig: {
              dataConfig: [
                { hint: 'Find home' },
                { label: 'Office Locator' }
              ]
            }
          }
        }
      }
    } as any

    const keys = await createBuilder().getTranslationKey(appConfig)

    expect(keys).toEqual(expect.arrayContaining([
      {
        keyType: 'group',
        key: 'widgets.widget_1.config.searchConfig.dataConfig[0]',
        label: 'Locator 1'
      },
      {
        keyType: 'value',
        key: 'widgets.widget_1.config.searchConfig.dataConfig[0].label',
        groupKey: 'widgets.widget_1.config.searchConfig.dataConfig[0]',
        label: {
          key: 'label',
          enLabel: 'Label'
        },
        valueType: 'text'
      },
      {
        keyType: 'value',
        key: 'widgets.widget_1.config.searchConfig.dataConfig[0].hint',
        groupKey: 'widgets.widget_1.config.searchConfig.dataConfig[0]',
        label: {
          key: 'hint',
          enLabel: 'Hint'
        },
        valueType: 'text'
      },
      {
        keyType: 'group',
        key: 'widgets.widget_1.config.searchConfig.dataConfig[1]',
        label: 'Office Locator'
      },
      {
        keyType: 'value',
        key: 'widgets.widget_1.config.searchConfig.dataConfig[1].label',
        groupKey: 'widgets.widget_1.config.searchConfig.dataConfig[1]',
        label: {
          key: 'label',
          enLabel: 'Label'
        },
        valueType: 'text'
      },
    ]))
    expect(keys).not.toContainEqual({
      keyType: 'value',
      key: 'widgets.widget_1.config.searchConfig.dataConfig[1].hint',
      groupKey: 'widgets.widget_1.config.searchConfig.dataConfig[1]',
      label: {
        key: 'hint',
        enLabel: 'Hint'
      },
      valueType: 'text'
    })
  })

  it('keeps generating the global hint translation key', async () => {
    const appConfig = {
      widgets: {
        widget_1: {
          config: {
            searchConfig: {
              generalConfig: {
                hint: 'Search all'
              },
              dataConfig: []
            }
          }
        }
      }
    } as any

    const keys = await createBuilder().getTranslationKey(appConfig)

    expect(keys).toContainEqual({
      keyType: 'value',
      key: 'widgets.widget_1.config.searchConfig.generalConfig.hint',
      label: {
        key: 'hintForAll',
        enLabel: 'Hint applied to all search sources'
      },
      valueType: 'text'
    })
  })
})
