import { fireEvent } from '@testing-library/react'
import { React, appActions, AppMode, getAppStore, Immutable } from 'jimu-core'
import { getInitState, widgetRender, wrapWidget } from 'jimu-for-test'
import TextWidget from '../src/runtime/widget'
import '@testing-library/jest-dom'
const initState = getInitState()
getAppStore().dispatch(appActions.updateStoreState(initState))

const config = {
  text: 'foo'
}

const manifest = { name: 'text' } as any

let render

describe('<TextWidget />', () => {
  beforeAll(() => {
    render = widgetRender()
  })

  it('Should render without any issues', () => {
    const Widget = wrapWidget(TextWidget as any, {
      config: config,
      manifest: manifest
    })
    const { queryByTestId } = render(<Widget widgetId='Widget_1' />)
    expect(queryByTestId('text-widget')).toHaveClass('widget-text')
  })

  it('does not write preview rich text back to appConfig during translation preview', () => {
    const editWidget = jest.fn().mockReturnValue({ exec: jest.fn() })
    const getAppConfigAction = jest.fn(() => ({ editWidget }))
    const RichEditor = (props: any) => {
      return <button data-testid='complete-rich-text' onClick={() => { props.onComplete('<p>Preview translated</p>', '') }} />
    }
    const Widget = wrapWidget(TextWidget as any, {
      manifest,
      builderSupportModules: {
        jimuForBuilderLib: {
          getAppConfigAction
        },
        widgetModules: {
          Editor: RichEditor,
          builderUtils: {
            getExpressionParts: jest.fn(() => []),
            getInvalidDataSourceIds: jest.fn(() => [])
          }
        }
      } as any
    })

    getAppStore().dispatch(appActions.updateStoreState(getInitState().merge({
      appContext: {
        isInBuilder: true,
        locale: 'en',
        translatedLocale: 'en',
        isRTL: false
      },
      builder: {
        isConfiguringTranslations: true
      },
      appRuntimeInfo: {
        appMode: AppMode.Design,
        selection: {
          layoutId: 'layout_1',
          layoutItemId: '0'
        }
      },
      appConfig: {
        widgets: {
          Widget_1: {
            id: 'Widget_1',
            uri: 'widgets/common/text/',
            config: Immutable({
              text: '<p>Preview translated</p>',
              placeholder: '',
              style: {}
            })
          }
        },
        layouts: {
          layout_1: {
            id: 'layout_1',
            content: {
              0: {
                id: '0',
                widgetId: 'Widget_1'
              }
            }
          }
        }
      },
      widgetsRuntimeInfo: {
        Widget_1: {
          isInlineEditing: true
        }
      }
    } as any)))

    const { getByTestId } = render(<Widget widgetId='Widget_1' />)
    fireEvent.click(getByTestId('complete-rich-text'))

    expect(getAppConfigAction).not.toHaveBeenCalled()
    expect(editWidget).not.toHaveBeenCalled()
  })
})
