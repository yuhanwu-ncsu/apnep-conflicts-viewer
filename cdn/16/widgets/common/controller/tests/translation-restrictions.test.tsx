import { appActions, getAppStore, BrowserSizeMode } from 'jimu-core'
import { getInitState } from 'jimu-for-test'
import AddWidget from '../src/tools/add-widget'
import ManageWidgets from '../src/tools/manage-widgets'

jest.mock('../src/runtime/builder/utils', () => ({
  getIsItemAccepted: jest.fn(() => () => true),
  widgetStatePropChange: jest.fn(),
  widgetToolbarStateChange: jest.fn(),
  getIsInController: jest.fn(() => false)
}))

jest.mock('../src/runtime/common/layout-utils', () => ({
  getWidgetChildLayoutJson: jest.fn(() => ({ order: [] }))
}))

const toolPanelProps: any = {
  layoutItem: {
    widgetId: 'controller_1'
  }
}

const baseState = {
  appStateInBuilder: {
    appConfig: {
      mainSizeMode: BrowserSizeMode.Large,
      widgets: {
        controller_1: {
          layouts: {
            controller: { LARGE: 'layout_1' }
          }
        }
      },
      layouts: {
        layout_1: { order: ['child-1'] }
      }
    },
    browserSizeMode: BrowserSizeMode.Large
  },
  browserSizeMode: BrowserSizeMode.Large,
  builder: {
    isConfiguringTranslations: false
  }
}

describe('controller translation restrictions', () => {
  beforeEach(() => {
    getAppStore().dispatch(appActions.updateStoreState(getInitState().merge(baseState)))
  })

  describe('add-widget tool', () => {
    let tool: AddWidget

    beforeEach(() => {
      tool = new AddWidget()
    })

    test('disabled() returns false when not configuring translations', () => {
      expect(tool.disabled()).toBe(false)
    })

    test('disabled() returns true when configuring translations', () => {
      getAppStore().dispatch(appActions.updateStoreState(getInitState().merge({
        ...baseState,
        builder: { isConfiguringTranslations: true }
      })))

      expect(tool.disabled()).toBe(true)
    })

    test('getSettingPanel() returns null when configuring translations', () => {
      getAppStore().dispatch(appActions.updateStoreState(getInitState().merge({
        ...baseState,
        builder: { isConfiguringTranslations: true }
      })))

      expect(tool.getSettingPanel(toolPanelProps)).toBeNull()
    })

    test('getSettingPanel() returns component when not configuring translations', () => {
      expect(tool.getSettingPanel(toolPanelProps)).not.toBeNull()
    })
  })

  describe('manage-widgets tool', () => {
    let tool: ManageWidgets

    beforeEach(() => {
      tool = new ManageWidgets()
    })

    test('disabled() returns false when not configuring translations (with widgets)', () => {
      expect(tool.disabled(toolPanelProps)).toBe(false)
    })

    test('disabled() returns true when configuring translations', () => {
      getAppStore().dispatch(appActions.updateStoreState(getInitState().merge({
        ...baseState,
        builder: { isConfiguringTranslations: true }
      })))

      expect(tool.disabled(toolPanelProps)).toBe(true)
    })

    test('getSettingPanel() returns null when configuring translations', () => {
      getAppStore().dispatch(appActions.updateStoreState(getInitState().merge({
        ...baseState,
        builder: { isConfiguringTranslations: true }
      })))

      expect(tool.getSettingPanel(toolPanelProps)).toBeNull()
    })

    test('getSettingPanel() returns component when not configuring translations', () => {
      expect(tool.getSettingPanel(toolPanelProps)).not.toBeNull()
    })
  })
})

