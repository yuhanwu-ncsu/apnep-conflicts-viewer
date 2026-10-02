import { loadArcGISMapComponents, ExBAddedJSAPIProperties } from 'jimu-core'
import { mockTheme } from 'jimu-for-test'
import { Widget } from '../src/runtime/widget'
import { ACTION_INDEXES } from '../src/runtime/actions/constants'
import VisibilityRange from '../src/runtime/actions/visibility-range'

jest.mock('jimu-core', () => {
  const jimuCore = (jest as any).requireActual('jimu-core')
  jimuCore.loadArcGISMapComponents = jest.fn().mockResolvedValue(undefined)
  return jimuCore
})

const createProps = (overrides = {}) => {
  return {
    id: 'map_layers_1',
    widgetId: 'map_layers_1',
    label: 'Map Layers',
    theme: mockTheme,
    config: {
      useMapWidget: true,
      enableLegend: true,
      showAllLegend: false,
      reorderLayers: false,
      useTickBoxes: false,
      customizeLayerOptions: {}
    },
    useMapWidgetIds: ['map_1'],
    enableDataAction: true,
    intl: {
      formatMessage: jest.fn().mockImplementation(({ id, defaultMessage }) => defaultMessage || id)
    },
    ...overrides
  } as any
}

describe('map-layers widget runtime', () => {
  const mockedLoadMapComponents = loadArcGISMapComponents as jest.MockedFunction<typeof loadArcGISMapComponents>

  beforeEach(() => {
    mockedLoadMapComponents.mockClear()
  })

  afterEach(() => {
    jest.restoreAllMocks()
    document.body.innerHTML = ''
  })

  it('sets legend panel and option action section for list items', () => {
    const widget = new Widget(createProps({
      config: {
        useMapWidget: true,
        enableLegend: true,
        showAllLegend: true,
        customizeLayerOptions: {}
      }
    }))

    ;(widget as any).layerListActions = [{
      id: 'option-action',
      title: 'Options',
      iconName: 'ellipsis',
      className: 'esri-icon-handle-horizontal',
      group: 100,
      isValid: jest.fn().mockReturnValue(true)
    }]

    const listItem: any = {
      layer: {
        id: 'layer-1',
        legendEnabled: true
      },
      actionsSections: []
    }

    widget.defineLayerListActionsGenerator(false)({ item: listItem })

    expect(listItem.panel).toEqual({
      content: 'legend',
      open: true
    })
    expect(listItem.actionsSections).toHaveLength(1)
    expect(listItem.actionsSections[0][0].id).toBe('option-action')
    expect(listItem.actionsSections[0][0].icon).toBe('ellipsis')
  })

  it('hides item using customizeLayerOptions hidden list', () => {
    const widget = new Widget(createProps({
      config: {
        useMapWidget: true,
        enableLegend: false,
        customizeLayerOptions: {
          'map_1-view_1': {
            isEnabled: true,
            hiddenJimuLayerViewIds: ['jlv_1']
          }
        }
      }
    }))

    ;(widget as any).state = {
      ...widget.state,
      jimuMapViewId: 'map_1-view_1'
    }
    ;(widget as any).jimuMapView = {
      getJimuLayerViewIdByAPILayer: jest.fn().mockReturnValue('jlv_1')
    }
    ;(widget as any).layerListActions = [{
      id: 'option-action',
      title: 'Options',
      iconName: 'ellipsis',
      className: 'esri-icon-handle-horizontal',
      group: 100,
      isValid: jest.fn().mockReturnValue(true)
    }]

    const listItem: any = {
      layer: {
        id: 'layer-1',
        legendEnabled: false
      },
      actionsSections: []
    }

    widget.defineLayerListActionsGenerator(false)({ item: listItem })

    expect(listItem.hidden).toBe(true)
  })

  it('applies customizeLayerOptions visibility for table list items', () => {
    const widget = new Widget(createProps({
      config: {
        useMapWidget: true,
        enableLegend: false,
        customizeLayerOptions: {
          'map_1-view_1': {
            isEnabled: true,
            showJimuLayerViewIds: ['table_jlv_1']
          }
        }
      }
    }))

    ;(widget as any).state = {
      ...widget.state,
      jimuMapViewId: 'map_1-view_1'
    }
    ;(widget as any).jimuMapView = {
      getJimuLayerViewIdByAPILayer: jest.fn().mockReturnValue('table_jlv_1')
    }
    ;(widget as any).layerListActions = [{
      id: 'option-action',
      title: 'Options',
      iconName: 'ellipsis',
      className: 'esri-icon-handle-horizontal',
      group: 100,
      isValid: jest.fn().mockReturnValue(true)
    }]

    const visibleTableItem: any = {
      layer: {
        id: 'table-1',
        legendEnabled: false
      },
      actionsSections: []
    }
    widget.defineLayerListActionsGenerator(true)({ item: visibleTableItem })
    expect(visibleTableItem.hidden).toBe(false)

    ;(widget as any).jimuMapView.getJimuLayerViewIdByAPILayer = jest.fn().mockReturnValue('table_jlv_2')
    const hiddenTableItem: any = {
      layer: {
        id: 'table-2',
        legendEnabled: false
      },
      actionsSections: []
    }
    widget.defineLayerListActionsGenerator(true)({ item: hiddenTableItem })
    expect(hiddenTableItem.hidden).toBe(true)
  })

  it('hides runtime layer when customize runtime visibility is disabled', () => {
    const widget = new Widget(createProps({
      config: {
        useMapWidget: true,
        enableLegend: false,
        customizeLayerOptions: {
          'map_1-view_1': {
            isEnabled: true,
            showRuntimeAddedLayers: false
          }
        }
      }
    }))

    ;(widget as any).state = {
      ...widget.state,
      jimuMapViewId: 'map_1-view_1'
    }
    ;(widget as any).jimuMapView = {
      getJimuLayerViewIdByAPILayer: jest.fn().mockReturnValue('jlv_1')
    }
    ;(widget as any).layerListActions = [{
      id: 'option-action',
      title: 'Options',
      iconName: 'ellipsis',
      className: 'esri-icon-handle-horizontal',
      group: 100,
      isValid: jest.fn().mockReturnValue(true)
    }]

    const listItem: any = {
      layer: {
        id: 'runtime-layer',
        legendEnabled: false,
        [ExBAddedJSAPIProperties.EXB_LAYER_FROM_RUNTIME]: true
      },
      actionsSections: []
    }

    widget.defineLayerListActionsGenerator(false)({ item: listItem })

    expect(listItem.hidden).toBe(true)
  })

  it('creates arcgis-layer-list and maps properties', async () => {
    const widget = new Widget(createProps({
      config: {
        useMapWidget: true,
        reorderLayers: true,
        useTickBoxes: true,
        enableLegend: false,
        customizeLayerOptions: {}
      }
    }))

    ;(widget.layerListContainerRef as any).current = document.createElement('div')

    const onTriggered = jest.spyOn(widget as any, 'onLayerListActionsTriggered')
    await widget.createLayerList({} as any)

    const layerList = (widget.layerListRef as any).current
    expect(layerList).toBeTruthy()
    expect(layerList.tagName).toBe('ARCGIS-LAYER-LIST')
    expect(layerList.dragEnabled).toBe(true)
    expect(layerList.visibilityAppearance).toBe('checkbox')
    expect(typeof layerList.listItemCreatedFunction).toBe('function')
    expect(typeof layerList.knowledgeGraphOptions?.listItemCreatedFunction).toBe('function')

    layerList.dispatchEvent(new CustomEvent('arcgisTriggerAction', { detail: {} }))
    expect(onTriggered).toHaveBeenCalledWith({})
    expect(mockedLoadMapComponents).toHaveBeenCalledTimes(1)
  })

  it('creates arcgis-table-list and maps properties', async () => {
    const widget = new Widget(createProps({
      config: {
        useMapWidget: true,
        reorderLayers: true,
        showTables: true,
        enableLegend: false,
        customizeLayerOptions: {}
      }
    }))

    ;(widget.tableListContainerRef as any).current = document.createElement('div')

    const onTriggered = jest.spyOn(widget as any, 'onLayerListActionsTriggered')
    const view = { map: { id: 'map-1' } }
    await widget.createTableList(view as any)

    const tableList = (widget.tableListRef as any).current
    expect(tableList).toBeTruthy()
    expect(tableList.tagName).toBe('ARCGIS-TABLE-LIST')
    expect(tableList.dragEnabled).toBe(true)
    expect(tableList.view).toBe(view)
    expect(tableList.map).toBe(view.map)
    expect(typeof tableList.listItemCreatedFunction).toBe('function')

    tableList.dispatchEvent(new CustomEvent('arcgisTriggerAction', { detail: {} }))
    expect(onTriggered).toHaveBeenCalledWith({}, true)
    expect(mockedLoadMapComponents).toHaveBeenCalledTimes(1)
  })

  it('applies customizeLayerOptions visibility for knowledge graph table list items', async () => {
    const widget = new Widget(createProps({
      config: {
        useMapWidget: true,
        reorderLayers: true,
        enableLegend: false,
        customizeLayerOptions: {
          'map_1-view_1': {
            isEnabled: true,
            showJimuLayerViewIds: ['kg_table_jlv_1']
          }
        }
      }
    }))

    ;(widget as any).state = {
      ...widget.state,
      jimuMapViewId: 'map_1-view_1'
    }
    ;(widget as any).jimuMapView = {
      getJimuLayerViewIdByAPILayer: jest.fn().mockReturnValue('kg_table_jlv_1')
    }
    ;(widget.layerListContainerRef as any).current = document.createElement('div')

    await widget.createLayerList({} as any)

    const layerList = (widget.layerListRef as any).current
    const visibleTableItem: any = {
      layer: {
        id: 'kg-table-1',
        legendEnabled: false
      },
      actionsSections: []
    }

    layerList.knowledgeGraphOptions.listItemCreatedFunction({ item: visibleTableItem })
    expect(visibleTableItem.hidden).toBe(false)

    ;(widget as any).jimuMapView.getJimuLayerViewIdByAPILayer = jest.fn().mockReturnValue('kg_table_jlv_2')
    const hiddenTableItem: any = {
      layer: {
        id: 'kg-table-2',
        legendEnabled: false
      },
      actionsSections: []
    }

    layerList.knowledgeGraphOptions.listItemCreatedFunction({ item: hiddenTableItem })
    expect(hiddenTableItem.hidden).toBe(true)
  })

  it('resolves option action from composedPath for popper state', () => {
    const widget = new Widget(createProps())
    const setState = jest.spyOn(widget, 'setState').mockImplementation((state: any) => {
      ;(widget as any).state = { ...(widget as any).state, ...state }
    })

    const container = document.createElement('div')
    ;(widget.layerListContainerRef as any).current = container

    widget.bindClickHandler()

    const actionElement = document.createElement('calcite-action')
    actionElement.setAttribute('data-action-id', 'option-action')
    actionElement.setAttribute('title', 'Options')
    const child = document.createElement('span')
    actionElement.appendChild(child)

    container.onclick({
      target: child,
      composedPath: () => [child, actionElement, container]
    } as any)

    expect(widget.optionBtnRef.current).toBe(actionElement)
    expect(setState).toHaveBeenCalledWith(expect.objectContaining({ isActionListPopperOpen: true, nativeActionPopper: null }))
  })

  it('prefers option button from composedPath as popper reference', () => {
    const widget = new Widget(createProps())
    const setState = jest.spyOn(widget, 'setState').mockImplementation((state: any) => {
      ;(widget as any).state = { ...(widget as any).state, ...state }
    })

    const container = document.createElement('div')
    ;(widget.layerListContainerRef as any).current = container

    widget.bindClickHandler()

    const actionElement = document.createElement('calcite-action')
    actionElement.setAttribute('data-action-id', 'option-action')
    actionElement.setAttribute('title', 'Options')
    const optionButton = document.createElement('button')
    const child = document.createElement('span')
    optionButton.appendChild(child)

    container.onclick({
      target: child,
      composedPath: () => [child, optionButton, actionElement, container]
    } as any)

    expect(widget.optionBtnRef.current).toBe(optionButton)
    expect(document.querySelector('.map-layers-option-action-anchor')).toBeNull()
    expect(setState).toHaveBeenCalledWith(expect.objectContaining({ isActionListPopperOpen: true, nativeActionPopper: null }))
  })

  it('creates light-dom proxy anchor when option button is in shadow root', () => {
    const widget = new Widget(createProps())
    const setState = jest.spyOn(widget, 'setState').mockImplementation((state: any) => {
      ;(widget as any).state = { ...(widget as any).state, ...state }
    })

    const container = document.createElement('div')
    ;(widget.layerListContainerRef as any).current = container

    widget.bindClickHandler()

    const actionElement = document.createElement('calcite-action')
    actionElement.setAttribute('data-action-id', 'option-action')
    actionElement.setAttribute('title', 'Options')
    const shadowRoot = actionElement.attachShadow({ mode: 'open' })
    const optionButton = document.createElement('button')
    optionButton.setAttribute('aria-label', 'Options')
    shadowRoot.appendChild(optionButton)
    const child = document.createElement('span')
    actionElement.appendChild(child)

    container.onclick({
      target: child,
      composedPath: () => [child, actionElement, container]
    } as any)

    expect(widget.optionBtnRef.current).toBeInstanceOf(HTMLElement)
    expect(widget.optionBtnRef.current).not.toBe(optionButton)
    expect(widget.optionBtnRef.current.classList.contains('map-layers-option-action-anchor')).toBe(true)
    expect(document.querySelector('.map-layers-option-action-anchor')).toBe(widget.optionBtnRef.current)
    expect(widget.optionBtnRef.current.parentElement).toBe(document.body)
    expect(setState).toHaveBeenCalledWith(expect.objectContaining({ isActionListPopperOpen: true, nativeActionPopper: null }))
  })

  it('cleans proxy anchor when action popper is toggled closed', () => {
    const widget = new Widget(createProps())
    jest.spyOn(widget, 'setState').mockImplementation((state: any) => {
      ;(widget as any).state = { ...(widget as any).state, ...state }
    })

    const container = document.createElement('div')
    ;(widget.layerListContainerRef as any).current = container

    widget.bindClickHandler()

    const actionElement = document.createElement('calcite-action')
    actionElement.setAttribute('data-action-id', 'option-action')
    actionElement.setAttribute('title', 'Options')
    const shadowRoot = actionElement.attachShadow({ mode: 'open' })
    const optionButton = document.createElement('button')
    optionButton.setAttribute('aria-label', 'Options')
    shadowRoot.appendChild(optionButton)
    const child = document.createElement('span')
    actionElement.appendChild(child)

    container.onclick({
      target: child,
      composedPath: () => [child, actionElement, container]
    } as any)

    expect(document.querySelector('.map-layers-option-action-anchor')).toBeTruthy()
    widget.onToggleActionsPopper()
    expect(document.querySelector('.map-layers-option-action-anchor')).toBeNull()
  })

  it('closes popper when clicking the same option action again even if button node changes', () => {
    const widget = new Widget(createProps())
    const setState = jest.spyOn(widget, 'setState').mockImplementation((state: any) => {
      ;(widget as any).state = { ...(widget as any).state, ...state }
    })

    const container = document.createElement('div')
    ;(widget.layerListContainerRef as any).current = container
    widget.bindClickHandler()

    const actionElement = document.createElement('calcite-action')
    actionElement.setAttribute('data-action-id', 'option-action')
    actionElement.setAttribute('title', 'Options')
    const firstButton = document.createElement('button')
    const firstChild = document.createElement('span')
    firstButton.appendChild(firstChild)

    container.onclick({
      target: firstChild,
      composedPath: () => [firstChild, firstButton, actionElement, container]
    } as any)

    expect((widget as any).state.isActionListPopperOpen).toBe(true)

    const secondButton = document.createElement('button')
    const secondChild = document.createElement('span')
    secondButton.appendChild(secondChild)

    container.onclick({
      target: secondChild,
      composedPath: () => [secondChild, secondButton, actionElement, container]
    } as any)

    expect((widget as any).state.isActionListPopperOpen).toBe(false)
    expect(setState).toHaveBeenLastCalledWith({ isActionListPopperOpen: false, nativeActionPopper: null })
  })

  it('updates anchor and popper version when switching to another option action while open', () => {
    const widget = new Widget(createProps())
    const setState = jest.spyOn(widget, 'setState').mockImplementation((state: any) => {
      ;(widget as any).state = { ...(widget as any).state, ...state }
    })

    const container = document.createElement('div')
    ;(widget.layerListContainerRef as any).current = container
    widget.bindClickHandler()

    const firstAction = document.createElement('calcite-action')
    firstAction.setAttribute('data-action-id', 'option-action')
    firstAction.setAttribute('title', 'Options')
    const firstButton = document.createElement('button')
    const firstChild = document.createElement('span')
    firstButton.appendChild(firstChild)

    container.onclick({
      target: firstChild,
      composedPath: () => [firstChild, firstButton, firstAction, container]
    } as any)

    expect((widget as any).state.isActionListPopperOpen).toBe(true)
    expect((widget as any).state.actionListPopperVersion).toBe(1)

    const secondAction = document.createElement('calcite-action')
    secondAction.setAttribute('data-action-id', 'option-action')
    secondAction.setAttribute('title', 'Options')
    const secondButton = document.createElement('button')
    const secondChild = document.createElement('span')
    secondButton.appendChild(secondChild)

    container.onclick({
      target: secondChild,
      composedPath: () => [secondChild, secondButton, secondAction, container]
    } as any)

    expect((widget as any).state.isActionListPopperOpen).toBe(true)
    expect((widget as any).state.actionListPopperVersion).toBe(2)
    expect((widget as any).optionBtnRef.current).toBe(secondButton)
    expect(setState).toHaveBeenLastCalledWith(expect.objectContaining({ isActionListPopperOpen: true, nativeActionPopper: null, actionListPopperVersion: 2 }))
  })

  it('ignores clickOutside toggle when target is option action', () => {
    const widget = new Widget(createProps())
    jest.spyOn(widget, 'setState').mockImplementation((state: any) => {
      ;(widget as any).state = { ...(widget as any).state, ...state }
    })

    const container = document.createElement('div')
    ;(widget.layerListContainerRef as any).current = container
    widget.bindClickHandler()

    const actionElement = document.createElement('calcite-action')
    actionElement.setAttribute('data-action-id', 'option-action')
    actionElement.setAttribute('title', 'Options')
    ;(widget as any).optionActionElementRef = actionElement
    ;(widget as any).state = { ...(widget as any).state, isActionListPopperOpen: true }
    const previousAnchor = document.createElement('button')
    ;(widget as any).optionBtnRef.current = previousAnchor

    widget.onToggleActionsPopper({
      target: actionElement,
      composedPath: () => [actionElement, container]
    } as any, 'clickOutside')

    expect((widget as any).state.isActionListPopperOpen).toBe(true)
    expect((widget as any).optionBtnRef.current).toBe(previousAnchor)
  })

  it('closes popper when clickOutside option action belongs to another widget', () => {
    const widget = new Widget(createProps())
    jest.spyOn(widget, 'setState').mockImplementation((state: any) => {
      ;(widget as any).state = { ...(widget as any).state, ...state }
    })

    const container = document.createElement('div')
    ;(widget.layerListContainerRef as any).current = container
    const otherWidgetContainer = document.createElement('div')

    const actionElement = document.createElement('calcite-action')
    actionElement.setAttribute('data-action-id', 'option-action')
    actionElement.setAttribute('title', 'Options')
    otherWidgetContainer.appendChild(actionElement)

    ;(widget as any).state = { ...(widget as any).state, isActionListPopperOpen: true, actionListDOM: { id: 'action-list' } as any }

    widget.onToggleActionsPopper({
      target: actionElement,
      composedPath: () => [actionElement, otherWidgetContainer, document.body]
    } as any, 'clickOutside')

    expect((widget as any).state.isActionListPopperOpen).toBe(false)
    expect((widget as any).state.actionListDOM).toBeNull()
  })

  it('ignores clickOutside option action from table list container', () => {
    const widget = new Widget(createProps())
    jest.spyOn(widget, 'setState').mockImplementation((state: any) => {
      ;(widget as any).state = { ...(widget as any).state, ...state }
    })

    const tableContainer = document.createElement('div')
    ;(widget.tableListContainerRef as any).current = tableContainer

    const actionElement = document.createElement('calcite-action')
    actionElement.setAttribute('data-action-id', 'option-action')
    actionElement.setAttribute('title', 'Options')
    tableContainer.appendChild(actionElement)

    ;(widget as any).state = { ...(widget as any).state, isActionListPopperOpen: true }
    const previousAnchor = document.createElement('button')
    ;(widget as any).optionBtnRef.current = previousAnchor

    widget.onToggleActionsPopper({
      target: actionElement,
      composedPath: () => [actionElement, tableContainer]
    } as any, 'clickOutside')

    expect((widget as any).state.isActionListPopperOpen).toBe(true)
    expect((widget as any).optionBtnRef.current).toBe(previousAnchor)
  })

  it('closes popper for regular clickOutside events', () => {
    const widget = new Widget(createProps())
    jest.spyOn(widget, 'setState').mockImplementation((state: any) => {
      ;(widget as any).state = { ...(widget as any).state, ...state }
    })

    const optionAnchor = document.createElement('button')
    ;(widget as any).optionBtnRef.current = optionAnchor
    ;(widget as any).state = { ...(widget as any).state, isActionListPopperOpen: true, actionListDOM: { id: 'action-list' } as any }

    widget.onToggleActionsPopper({
      target: document.createElement('div'),
      composedPath: () => [document.createElement('div'), document.body]
    } as any, 'clickOutside')

    expect((widget as any).state.isActionListPopperOpen).toBe(false)
    expect((widget as any).state.actionListDOM).toBeNull()
  })

  it('does not reopen immediately when clickOutside dismiss fires before same option click', () => {
    const widget = new Widget(createProps())
    jest.spyOn(widget, 'setState').mockImplementation((state: any) => {
      ;(widget as any).state = { ...(widget as any).state, ...state }
    })

    const container = document.createElement('div')
    ;(widget.layerListContainerRef as any).current = container
    widget.bindClickHandler()

    const actionElement = document.createElement('calcite-action')
    actionElement.setAttribute('data-action-id', 'option-action')
    actionElement.setAttribute('title', 'Options')
    const optionButton = document.createElement('button')
    const optionChild = document.createElement('span')
    optionButton.appendChild(optionChild)
    ;(widget as any).optionAnchorManager.ensure(optionButton)
    jest.spyOn(optionButton, 'getBoundingClientRect').mockReturnValue({
      left: 100,
      right: 132,
      top: 100,
      bottom: 132,
      width: 32,
      height: 32,
      x: 100,
      y: 100
    } as any)

    ;(widget as any).optionActionElementRef = actionElement
    ;(widget as any).state = { ...(widget as any).state, isActionListPopperOpen: true, actionListDOM: { id: 'action-list' } as any }

    widget.onToggleActionsPopper({ target: document.body, clientX: 110, clientY: 110 } as any, 'clickOutside')
    expect((widget as any).state.isActionListPopperOpen).toBe(false)

    container.onclick({
      target: optionChild,
      composedPath: () => [optionChild, optionButton, actionElement, container]
    } as any)

    expect((widget as any).state.isActionListPopperOpen).toBe(false)
  })

  it('does not reopen immediately when source anchor changes but option action is the same', () => {
    const widget = new Widget(createProps())
    jest.spyOn(widget, 'setState').mockImplementation((state: any) => {
      ;(widget as any).state = { ...(widget as any).state, ...state }
    })

    const container = document.createElement('div')
    ;(widget.layerListContainerRef as any).current = container
    widget.bindClickHandler()

    const actionElement = document.createElement('calcite-action')
    actionElement.setAttribute('data-action-id', 'option-action')
    actionElement.setAttribute('title', 'Options')
    const previousButton = document.createElement('button')
    const currentButton = document.createElement('button')
    const optionChild = document.createElement('span')
    currentButton.appendChild(optionChild)
    ;(widget as any).optionAnchorManager.ensure(previousButton)
    jest.spyOn(previousButton, 'getBoundingClientRect').mockReturnValue({
      left: 120,
      right: 152,
      top: 120,
      bottom: 152,
      width: 32,
      height: 32,
      x: 120,
      y: 120
    } as any)

    ;(widget as any).optionActionElementRef = actionElement
    ;(widget as any).state = { ...(widget as any).state, isActionListPopperOpen: true, actionListDOM: { id: 'action-list' } as any }

    widget.onToggleActionsPopper({ target: document.body, clientX: 130, clientY: 130 } as any, 'clickOutside')
    expect((widget as any).state.isActionListPopperOpen).toBe(false)

    container.onclick({
      target: optionChild,
      composedPath: () => [optionChild, currentButton, actionElement, container]
    } as any)

    expect((widget as any).state.isActionListPopperOpen).toBe(false)
  })

  it('does not reopen immediately when the option action node is recreated', () => {
    const widget = new Widget(createProps())
    jest.spyOn(widget, 'setState').mockImplementation((state: any) => {
      ;(widget as any).state = { ...(widget as any).state, ...state }
    })

    const container = document.createElement('div')
    ;(widget.layerListContainerRef as any).current = container
    widget.bindClickHandler()

    const previousActionElement = document.createElement('calcite-action')
    previousActionElement.setAttribute('data-action-id', 'option-action')
    previousActionElement.setAttribute('title', 'Options')
    const recreatedActionElement = document.createElement('calcite-action')
    recreatedActionElement.setAttribute('data-action-id', 'option-action')
    recreatedActionElement.setAttribute('title', 'Options')
    const currentButton = document.createElement('button')
    const optionChild = document.createElement('span')
    currentButton.appendChild(optionChild)
    ;(widget as any).optionAnchorManager.ensure(currentButton)
    jest.spyOn(currentButton, 'getBoundingClientRect').mockReturnValue({
      left: 160,
      right: 192,
      top: 160,
      bottom: 192,
      width: 32,
      height: 32,
      x: 160,
      y: 160
    } as any)

    ;(widget as any).optionActionElementRef = previousActionElement
    ;(widget as any).state = { ...(widget as any).state, isActionListPopperOpen: true, actionListDOM: { id: 'action-list' } as any }

    widget.onToggleActionsPopper({ target: document.body, clientX: 170, clientY: 170 } as any, 'clickOutside')
    expect((widget as any).state.isActionListPopperOpen).toBe(false)

    container.onclick({
      target: optionChild,
      composedPath: () => [optionChild, currentButton, recreatedActionElement, container]
    } as any)

    expect((widget as any).state.isActionListPopperOpen).toBe(false)
  })

  it('recreates layer list and destroys previous instance', async () => {
    const widget = new Widget(createProps({
      config: {
        useMapWidget: true,
        reorderLayers: true,
        useTickBoxes: true,
        enableLegend: false,
        customizeLayerOptions: {}
      }
    }))

    const container = document.createElement('div')
    ;(widget.layerListContainerRef as any).current = container

    const oldLayerList = document.createElement('arcgis-layer-list') as any
    oldLayerList.destroy = jest.fn().mockResolvedValue(undefined)
    oldLayerList.removeEventListener = jest.fn()
    container.appendChild(oldLayerList)
    ;(widget.layerListRef as any).current = oldLayerList

    await widget.createLayerList({} as any)

    expect(oldLayerList.removeEventListener).toHaveBeenCalledWith('arcgisTriggerAction', expect.any(Function))
    expect(oldLayerList.destroy).toHaveBeenCalled()
    expect(oldLayerList.isConnected).toBe(false)
    expect((widget.layerListRef as any).current).not.toBe(oldLayerList)
  })

  it('recreates table list and destroys previous instance', async () => {
    const widget = new Widget(createProps({
      config: {
        useMapWidget: true,
        reorderLayers: true,
        showTables: true,
        enableLegend: false,
        customizeLayerOptions: {}
      }
    }))

    const container = document.createElement('div')
    ;(widget.tableListContainerRef as any).current = container

    const oldTableList = document.createElement('arcgis-table-list') as any
    oldTableList.destroy = jest.fn().mockResolvedValue(undefined)
    oldTableList.removeEventListener = jest.fn()
    container.appendChild(oldTableList)
    ;(widget.tableListRef as any).current = oldTableList

    await widget.createTableList({ map: {} } as any)

    expect(oldTableList.removeEventListener).toHaveBeenCalledWith('arcgisTriggerAction', expect.any(Function))
    expect(oldTableList.destroy).toHaveBeenCalled()
    expect(oldTableList.isConnected).toBe(false)
    expect((widget.tableListRef as any).current).not.toBe(oldTableList)
  })

  it('prevents refresh when portalSelf changes and allows refresh when state/props are stable', () => {
    const props = createProps({ portalSelf: { id: 'current' }, isDesignMode: false })
    const widget = new Widget(props)

    const prevState = { ...widget.state }
    const prevProps = { ...props, portalSelf: { id: 'previous' } }
    expect(widget.needToPreventRefreshList(prevProps, prevState)).toBe(true)
    expect(widget.needToPreventRefreshList(props, prevState)).toBe(false)
  })

  it('prevents refresh when only popup mutable state changes', () => {
    const props = createProps({
      mutableStatePropsVersion: {
        'popup.layer-1': 2
      }
    })
    const widget = new Widget(props)

    const prevState = { ...widget.state }
    const prevProps = {
      ...props,
      mutableStatePropsVersion: {
        'popup.layer-1': 1
      }
    }

    expect(widget.needToPreventRefreshList(prevProps, prevState)).toBe(true)
  })

  it('allows refresh when non-popup mutable state changes', () => {
    const props = createProps({
      mutableStatePropsVersion: {
        other: 2
      }
    })
    const widget = new Widget(props)

    const prevState = { ...widget.state }
    const prevProps = {
      ...props,
      mutableStatePropsVersion: {
        other: 1
      }
    }

    expect(widget.needToPreventRefreshList(prevProps, prevState)).toBe(false)
  })

  it('allows refresh when popup mutable state changes with refresh input changes', () => {
    const props = createProps({
      mutableStatePropsVersion: {
        'popup.layer-1': 2
      }
    })
    const widget = new Widget(props)

    const prevState = { ...widget.state }
    const prevProps = {
      ...props,
      config: {
        ...props.config,
        reorderLayers: true
      },
      mutableStatePropsVersion: {
        'popup.layer-1': 1
      }
    }

    expect(widget.needToPreventRefreshList(prevProps, prevState)).toBe(false)
  })

  it('does not refresh the layer list when only popup mutable state changes', () => {
    const props = createProps({
      mutableStatePropsVersion: {
        'popup.layer-1': 2
      }
    })
    const widget = new Widget(props)
    const syncRendererSpy = jest.spyOn(widget, 'syncRenderer').mockResolvedValue(undefined)
    jest.spyOn(widget, 'bindClickHandler').mockImplementation(() => undefined)

    const prevState = { ...widget.state }
    const prevProps = {
      ...props,
      mutableStatePropsVersion: {
        'popup.layer-1': 1
      }
    }

    widget.componentDidUpdate(prevProps, prevState)

    expect(syncRendererSpy).not.toHaveBeenCalled()
  })

  it('resets poppers when enableDataAction changes in componentDidUpdate', () => {
    const props = createProps({ enableDataAction: true })
    const widget = new Widget(props)
    const setState = jest.spyOn(widget, 'setState').mockImplementation((state: any) => {
      ;(widget as any).state = { ...(widget as any).state, ...state }
    })
    const cleanupSpy = jest.spyOn((widget as any).optionAnchorManager, 'cleanup').mockImplementation(() => undefined)
    const bindSpy = jest.spyOn(widget, 'bindClickHandler').mockImplementation(() => undefined)
    const renderTableListSpy = jest.spyOn(widget, 'renderTableList').mockResolvedValue(undefined)

    const prevProps = { ...props, enableDataAction: false }
    const prevState = { ...widget.state }
    widget.componentDidUpdate(prevProps, prevState)

    expect(cleanupSpy).toHaveBeenCalled()
    expect(bindSpy).toHaveBeenCalled()
    expect(setState).toHaveBeenCalledWith({ isActionListPopperOpen: false, nativeActionPopper: null })
    expect(renderTableListSpy).not.toHaveBeenCalled()
  })

  it('rerenders table list only when showTables changes', () => {
    const props = createProps({
      config: {
        ...createProps().config,
        showTables: true
      }
    })
    const widget = new Widget(props)
    jest.spyOn(widget, 'setState').mockImplementation((state: any) => {
      ;(widget as any).state = { ...(widget as any).state, ...state }
    })
    const renderTableListSpy = jest.spyOn(widget, 'renderTableList').mockResolvedValue(undefined)
    const syncRendererSpy = jest.spyOn(widget, 'syncRenderer').mockResolvedValue(undefined)
    jest.spyOn(widget, 'bindClickHandler').mockImplementation(() => undefined)

    const prevProps = {
      ...props,
      config: {
        ...props.config,
        showTables: false
      }
    }
    const prevState = { ...widget.state }
    widget.componentDidUpdate(prevProps, prevState)

    expect(renderTableListSpy).toHaveBeenCalled()
    expect(syncRendererSpy).not.toHaveBeenCalled()
  })

  it('routes option action to action list popper with supported actions only', () => {
    jest.useFakeTimers()

    const widget = new Widget(createProps({ enableDataAction: true }))
    jest.spyOn(widget, 'setState').mockImplementation((state: any) => {
      ;(widget as any).state = { ...(widget as any).state, ...state }
    })

    const optionAction = {
      id: 'option-action',
      isValid: jest.fn().mockReturnValue(true)
    }
    const gotoAction = {
      id: 'goto',
      isValid: jest.fn().mockReturnValue(true),
      execute: jest.fn()
    }
    ;(widget as any).layerListActions = [optionAction, gotoAction]

    const listItem = { layer: { id: 'layer-1' } } as any
    widget.onLayerListActionsTriggered({ action: { id: 'option-action' }, item: listItem }, false)
    jest.runAllTimers()

    const actionListDOM = (widget as any).state.actionListDOM
    expect(actionListDOM).toBeTruthy()
    expect(actionListDOM.props.actionObjects).toHaveLength(1)
    expect(actionListDOM.props.actionObjects[0].id).toBe('goto')

    jest.useRealTimers()
  })

  it('routes native action to nativeActionPopper', () => {
    const widget = new Widget(createProps())
    jest.spyOn(widget, 'setState').mockImplementation((state: any) => {
      ;(widget as any).state = { ...(widget as any).state, ...state }
    })

    const nativeActionPopper = { id: 'native-popper' } as any
    const gotoAction = {
      id: 'goto',
      isValid: jest.fn().mockReturnValue(true),
      execute: jest.fn().mockReturnValue(nativeActionPopper)
    }
    ;(widget as any).layerListActions = [gotoAction]

    const listItem = { layer: { id: 'layer-1' } } as any
    widget.onLayerListActionsTriggered({ action: { id: 'goto' }, item: listItem }, false)

    expect(gotoAction.execute).toHaveBeenCalledWith(listItem)
    expect((widget as any).state.nativeActionPopper).toBe(nativeActionPopper)
  })

  it('hides item when whitelist does not include current layer view id', () => {
    const widget = new Widget(createProps({
      config: {
        useMapWidget: true,
        enableLegend: false,
        customizeLayerOptions: {
          'map_1-view_1': {
            isEnabled: true,
            showJimuLayerViewIds: ['jlv_visible']
          }
        }
      }
    }))

    ;(widget as any).state = {
      ...widget.state,
      jimuMapViewId: 'map_1-view_1'
    }
    ;(widget as any).jimuMapView = {
      getJimuLayerViewIdByAPILayer: jest.fn().mockReturnValue('jlv_hidden')
    }
    ;(widget as any).layerListActions = [{
      id: 'option-action',
      title: 'Options',
      className: 'esri-icon-handle-horizontal',
      group: 100,
      isValid: jest.fn().mockReturnValue(true)
    }]

    const listItem: any = {
      layer: {
        id: 'layer-1',
        legendEnabled: false
      },
      actionsSections: []
    }

    widget.defineLayerListActionsGenerator(false)({ item: listItem })
    expect(listItem.hidden).toBe(true)
  })

  it('keeps wmts sublayer visible even when runtime-layer hiding is enabled', () => {
    const widget = new Widget(createProps({
      config: {
        useMapWidget: true,
        enableLegend: false,
        customizeLayerOptions: {
          'map_1-view_1': {
            isEnabled: true,
            showRuntimeAddedLayers: false,
            showJimuLayerViewIds: ['jlv_visible']
          }
        }
      }
    }))

    ;(widget as any).state = {
      ...widget.state,
      jimuMapViewId: 'map_1-view_1'
    }
    ;(widget as any).jimuMapView = {
      getJimuLayerViewIdByAPILayer: jest.fn().mockReturnValue('jlv_hidden')
    }
    ;(widget as any).layerListActions = [{
      id: 'option-action',
      title: 'Options',
      className: 'esri-icon-handle-horizontal',
      group: 100,
      isValid: jest.fn().mockReturnValue(true)
    }]

    const listItem: any = {
      layer: {
        id: 'runtime-layer',
        legendEnabled: false,
        parent: {
          declaredClass: 'esri.layers.WMTSLayer',
          parent: null
        },
        [ExBAddedJSAPIProperties.EXB_LAYER_FROM_RUNTIME]: true
      },
      actionsSections: []
    }

    widget.defineLayerListActionsGenerator(false)({ item: listItem })
    expect(listItem.hidden).toBe(false)
  })

  it('keeps only option action in list when data action is enabled', () => {
    const widget = new Widget(createProps({ enableDataAction: true }))
    ;(widget as any).layerListActions = [
      {
        id: 'option-action',
        title: 'Options',
        iconName: 'ellipsis',
        className: 'esri-icon-handle-horizontal',
        group: ACTION_INDEXES.Option,
        isValid: jest.fn().mockReturnValue(true)
      },
      {
        id: 'goto',
        title: 'Go to',
        iconName: 'zoom-out-fixed',
        className: 'esri-icon-zoom-in-magnifying-glass',
        group: ACTION_INDEXES.Goto,
        isValid: jest.fn().mockReturnValue(true)
      }
    ]

    const listItem: any = {
      layer: {
        id: 'layer-1',
        legendEnabled: false
      },
      actionsSections: []
    }

    widget.defineLayerListActionsGenerator(false)({ item: listItem })
    expect(listItem.actionsSections).toHaveLength(1)
    expect(listItem.actionsSections[0]).toHaveLength(1)
    expect(listItem.actionsSections[0][0].id).toBe('option-action')
    expect(listItem.actionsSections[0][0].icon).toBe('ellipsis')
  })

  it('shows visibility range action without loading the deprecated ScaleRangeSlider widget', () => {
    const widget = new Widget(createProps({
      config: {
        useMapWidget: true,
        visibilityRange: true,
        customizeLayerOptions: {}
      }
    }))
    const action = new VisibilityRange(widget, 'Visibility range')
    const getModule = jest.spyOn(widget, 'getModule')

    expect(action.isValid({ layer: { id: 'layer-1' } } as any, false)).toBe(true)
    expect(getModule).not.toHaveBeenCalled()
    expect(action.isValid({ layer: { id: 'table-1' } } as any, true)).toBe(false)
  })

  it('opens visibility range web component popper for the selected layer', () => {
    const widget = new Widget(createProps({
      config: {
        useMapWidget: true,
        visibilityRange: true,
        customizeLayerOptions: {}
      }
    }))
    const action = new VisibilityRange(widget, 'Visibility range')
    const setState = jest.spyOn(widget, 'setState').mockImplementation(jest.fn())
    const listItem = { layer: { id: 'layer-1', title: 'Layer 1' } } as any

    action.execute(listItem)

    expect(setState).toHaveBeenCalledWith({
      nativeActionPopper: expect.objectContaining({
        props: expect.objectContaining({
          widget,
          listItem
        })
      })
    })
    const element = (setState as jest.Mock).mock.calls[0][0].nativeActionPopper
    expect(element.props.scaleRangeSliderClass).toBeUndefined()
  })

  it('removes option action when data action is disabled and no option-only native actions exist', () => {
    const widget = new Widget(createProps({ enableDataAction: false }))
    ;(widget as any).layerListActions = [
      {
        id: 'option-action',
        title: 'Options',
        iconName: 'ellipsis',
        className: 'esri-icon-handle-horizontal',
        group: ACTION_INDEXES.Option,
        isValid: jest.fn().mockReturnValue(true)
      },
      {
        id: 'goto',
        title: 'Go to',
        iconName: 'zoom-out-fixed',
        className: 'esri-icon-zoom-in-magnifying-glass',
        group: ACTION_INDEXES.Goto,
        isValid: jest.fn().mockReturnValue(true)
      }
    ]

    const listItem: any = {
      layer: {
        id: 'layer-1',
        legendEnabled: false
      },
      actionsSections: []
    }

    widget.defineLayerListActionsGenerator(false)({ item: listItem })
    expect(listItem.actionsSections).toHaveLength(1)
    expect(listItem.actionsSections[0]).toHaveLength(1)
    expect(listItem.actionsSections[0][0].id).toBe('goto')
    expect(listItem.actionsSections[0][0].icon).toBe('zoom-out-fixed')
  })

  it('uses information icon string when data action is disabled and only information remains', () => {
    const widget = new Widget(createProps({ enableDataAction: false }))
    ;(widget as any).layerListActions = [
      {
        id: 'option-action',
        title: 'Options',
        iconName: 'ellipsis',
        className: 'esri-icon-handle-horizontal',
        group: ACTION_INDEXES.Option,
        isValid: jest.fn().mockReturnValue(true)
      },
      {
        id: 'information',
        title: 'Information',
        iconName: 'information',
        className: 'esri-icon-description',
        group: ACTION_INDEXES.Information,
        isValid: jest.fn().mockReturnValue(true)
      }
    ]

    const listItem: any = {
      layer: {
        id: 'layer-1',
        legendEnabled: false
      },
      actionsSections: []
    }

    widget.defineLayerListActionsGenerator(false)({ item: listItem })
    expect(listItem.actionsSections).toHaveLength(1)
    expect(listItem.actionsSections[0]).toHaveLength(1)
    expect(listItem.actionsSections[0][0].id).toBe('information')
    expect(listItem.actionsSections[0][0].icon).toBe('information')
  })
})
