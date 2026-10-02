import { React, Immutable, getAppStore, appActions, WIDGET_PREFIX_FOR_A11Y_SKIP } from 'jimu-core'
import ButtonWidget from '../src/runtime/widget'
import { wrapWidget, widgetRender, getInitState, getDefaultAppConfig } from 'jimu-for-test'
import '@testing-library/jest-dom'
getAppStore().dispatch(appActions.updateStoreState(getInitState().merge({ appConfig: getDefaultAppConfig() })))

const render = widgetRender(false)
const Widget = wrapWidget(ButtonWidget)
describe('button widget test', function () {
  describe('default config', function () {
    const config = Immutable({
      functionConfig: {
        text: 'Please configure link',
        toolTip: '',
        linkParam: {
        }
      },
      styleConfig: {
        themeStyle: {
          quickStyleType: 'default'
        }
      }
    })

    it('button widget should be render', () => {
      const { queryBySelector } = render(<Widget config={config}/>)
      expect(queryBySelector('.widget-button-link')).not.toBeNull()
    })
  })

  describe('test value config', function () {
    const config = Immutable({
      functionConfig: {
        text: 'textTest',
        toolTip: 'testToolTip',
        linkParam: {
          value: 'detail-page',
          linkType: 'PAGE'
        }
      },
      styleConfig: {
        themeStyle: {
          quickStyleType: 'default'
        }
      }
    })

    it('button widget should be render', () => {
      const renderResult = render(<Widget config={config}/>)

      expect(renderResult.queryBySelector('.widget-button-link')).toBeInTheDocument()
      expect(renderResult.queryByText('textTest')).toBeInTheDocument() //text ok
      expect(renderResult.queryByTitle('testToolTip')).toBeInTheDocument() // toolTip ok
      // renderResult.queryBySelector('.widget-button-link').getAttribute('href'); // link ok
    })
  })

  describe('aria-label fallback behavior', function () {
    it('uses toolTip as aria-label when a11yLabel is empty', () => {
      const config = Immutable({
        functionConfig: {
          text: 'Click me',
          toolTip: 'my tooltip',
          linkParam: {}
        },
        styleConfig: { themeStyle: { quickStyleType: 'default' } }
      })
      const { getByRole } = render(<Widget config={config} />)
      expect(getByRole('button')).toHaveAttribute('aria-label', 'my tooltip')
    })

    it('uses text as aria-label fallback when toolTip is empty and a11yLabel is empty', () => {
      const config = Immutable({
        functionConfig: {
          text: 'my text',
          toolTip: '',
          linkParam: {}
        },
        styleConfig: { themeStyle: { quickStyleType: 'default' } }
      })
      const { getByRole } = render(<Widget config={config} />)
      expect(getByRole('button')).toHaveAttribute('aria-label', 'my text')
    })
  })

  describe('a11yLabel prop priority', function () {
    it('a11yLabel overrides toolTip and text as the button aria-label', () => {
      const config = Immutable({
        functionConfig: {
          text: 'button text',
          toolTip: 'tooltip value',
          linkParam: {}
        },
        styleConfig: { themeStyle: { quickStyleType: 'default' } }
      })
      const { getByRole } = render(<Widget config={config} a11yLabel='custom a11y label' />)
      expect(getByRole('button')).toHaveAttribute('aria-label', 'custom a11y label')
    })

    it('a11yLabel overrides text when toolTip is empty', () => {
      const config = Immutable({
        functionConfig: {
          text: 'button text',
          toolTip: '',
          linkParam: {}
        },
        styleConfig: { themeStyle: { quickStyleType: 'default' } }
      })
      const { getByRole } = render(<Widget config={config} a11yLabel='screen reader label' />)
      expect(getByRole('button')).toHaveAttribute('aria-label', 'screen reader label')
    })
  })

  describe('skip target placement', function () {
    it('applies the skip target id to the inner link instead of the outer widget container', () => {
      const config = Immutable({
        functionConfig: {
          text: 'button text',
          toolTip: '',
          linkParam: {}
        },
        styleConfig: { themeStyle: { quickStyleType: 'default' } }
      })
      const { getByRole, queryBySelector } = render(<Widget id='button_1' config={config} addToA11ySkip />)

      expect(getByRole('button')).toHaveAttribute('id', `${WIDGET_PREFIX_FOR_A11Y_SKIP}button_1`)
      expect(getByRole('button')).toHaveAttribute('tabindex', '0')
      expect(queryBySelector('.widget-button')).not.toHaveAttribute('id', `${WIDGET_PREFIX_FOR_A11Y_SKIP}button_1`)
    })
  })
})
