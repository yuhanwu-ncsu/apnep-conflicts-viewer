import { React, appActions, getAppStore } from 'jimu-core'
import { getInitState, widgetRender } from 'jimu-for-test'
import { fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import { DropdownComponent } from '../src/runtime/dropdown'

const manifest = require('../manifest.json')

const render = widgetRender()
const createWidgetProps = (onLocaleChange: jest.Mock) => ({
  config: {},
  defaultLocale: 'en-us',
  onLocaleChange,
  manifest,
  id: 'language-switcher_1',
  widgetId: 'language-switcher_1'
}) as any

describe('language switcher dropdown in builder', () => {
  beforeEach(() => {
    window.jimuConfig.isInBuilder = true
    getAppStore().dispatch(appActions.updateStoreState(getInitState().merge({
      appConfig: {
        mainLocale: 'en-us',
        translations: [
          { value: 'en-us', label: 'English' },
          { value: 'zh-cn', label: 'Chinese' }
        ]
      },
      builder: {
        isConfiguringTranslations: false
      }
    })))
  })

  test('keeps button enabled and shows (disabled) options when translation panel is not open', () => {
    const onLocaleChange = jest.fn()
    const { getByRole, getByTitle } = render(
      <DropdownComponent {...createWidgetProps(onLocaleChange)} />
    )

    // Button should be enabled when not configuring translations
    expect(getByRole('button')).not.toBeDisabled()
    fireEvent.click(getByRole('button'))

    // Items are always non-interactive in builder (disabled), but they are rendered
    expect(getByTitle('English')).toBeDisabled()
    expect(getByTitle('Chinese')).toBeDisabled()
  })

  test('disables locale options when translation panel is open', () => {
    getAppStore().dispatch(appActions.updateStoreState(getInitState().merge({
      appConfig: {
        mainLocale: 'en-us',
        translations: [
          { value: 'en-us', label: 'English' },
          { value: 'zh-cn', label: 'Chinese' }
        ]
      },
      builder: {
        isConfiguringTranslations: true
      }
    })))

    const onLocaleChange = jest.fn()
    const { getByRole, queryByTitle } = render(
      <DropdownComponent {...createWidgetProps(onLocaleChange)} />
    )

    expect(getByRole('button')).toBeDisabled()
    fireEvent.click(getByRole('button'))
    expect(queryByTitle('English')).toBeNull()
    expect(queryByTitle('Chinese')).toBeNull()
  })
})
