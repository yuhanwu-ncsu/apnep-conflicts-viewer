import { render, waitFor, cleanup, act } from '@testing-library/react'
import '@testing-library/jest-dom'
import Widget from '../src/runtime/widget'
import { solveRouteIfPossible } from '../src/runtime/runtime-utils'

jest.mock('arcgis-map-components', () => ({}), { virtual: true })

const mockMap = {
  findLayerById: jest.fn(() => null),
  remove: jest.fn(),
  add: jest.fn()
}

const mockView = {
  map: mockMap,
  when: jest.fn().mockResolvedValue(true)
}

const mockJimuMapView = {
  id: 'jimu_map_view_1',
  view: mockView,
  whenJimuLayerViewLoaded: jest.fn()
}

jest.mock('jimu-arcgis', () => {
  const React = require('react')
  return {
    JimuMapViewComponent: jest.fn().mockImplementation(({ onActiveViewChange }) => {
      React.useEffect(() => {
        onActiveViewChange?.(mockJimuMapView)
      }, [onActiveViewChange])
      return <div data-testid='mock-map-view' />
    })
  }
})

jest.mock('esri/layers/RouteLayer', () => {
  return {
    __esModule: true,
    default: jest.fn().mockImplementation(function MockRouteLayer (options: any) {
      this.id = options.id
      this.url = options.url
      this.title = options.title
      this.listMode = 'show'
      this.load = jest.fn().mockResolvedValue(this)
      this.loaded = true
      this.loadStatus = 'loaded'
      this.stops = {
        length: 2,
        at: jest.fn((index: number) => ({ geometry: null, name: '', index })),
        filter: jest.fn(() => []),
        removeAll: jest.fn(),
        addMany: jest.fn()
      }
    })
  }
})

jest.mock('esri/rest/support/PointBarrier', () => jest.fn(), { virtual: true })
jest.mock('esri/rest/support/PolylineBarrier', () => jest.fn(), { virtual: true })
jest.mock('esri/rest/support/PolygonBarrier', () => jest.fn(), { virtual: true })

jest.mock('../src/utils', () => ({
  getDefaultOrgUnit: jest.fn(() => 'metric'),
  convertSearchConfigToJSAPISearchProperties: jest.fn().mockResolvedValue({ includeDefaultSources: true, sources: [] }),
  getUrlOfUseUtility: jest.fn(() => 'https://routedev.arcgis.com/arcgis/rest/services/World/Route/NAServer/Route_World'),
  getAddressFromSources: jest.fn().mockResolvedValue('address')
}))

jest.mock('../src/runtime/runtime-utils', () => {
  const actual = jest.requireActual('../src/runtime/runtime-utils')
  return {
    ...actual,
    applyDataActionToLayer: jest.fn().mockResolvedValue(null),
    setOutputDssNotReady: jest.fn(),
    setOutputDssUnloadedAndSetLayer: jest.fn(),
    solveRouteIfPossible: jest.fn().mockResolvedValue(false)
  }
})

jest.mock('jimu-core', () => {
  const actual = jest.requireActual('jimu-core')
  return {
    ...actual,
    hooks: {
      ...actual.hooks,
      useTranslation: () => (id: string) => id
    },
    getAppStore: () => ({
      getState: () => ({
        appConfig: {
          utilities: {
            routeUtil: { id: 'routeUtil' },
            searchUtil: { id: 'searchUtil' }
          }
        }
      })
    }),
    MutableStoreManager: {
      getInstance: () => ({
        updateStateValue: jest.fn()
      })
    },
    ReactRedux: {
      ...actual.ReactRedux,
      useSelector: (selector: any) => selector({ resourceSessions: {} })
    },
    UtilityManager: {
      getInstance: () => ({
        getUtilityJson: jest.fn(() => ({ url: 'https://example.com' }))
      })
    },
    ServiceManager: {
      getInstance: () => ({
        fetchArcGISServerInfo: jest.fn().mockResolvedValue({})
      })
    }
  }
})

describe('directions runtime widget', () => {
  const originalCreateElement = document.createElement.bind(document)
  let directionsStates: string[]
  let directionsElements: any[]

  function attachDirectionsShadowRoot (ele: HTMLElement): ShadowRoot {
    const shadowRoot = ele.attachShadow({ mode: 'open' })
    const addStopButton = originalCreateElement('calcite-button')
    addStopButton.className = 'esri-directions__add-stop-button'
    shadowRoot.appendChild(addStopButton)

    const editRouteButton = originalCreateElement('calcite-button')
    editRouteButton.className = 'esri-directions__edit-route-button'
    shadowRoot.appendChild(editRouteButton)

    return shadowRoot
  }

  function expectDirectionsActionButtonsStyled (directionsEle: HTMLElement) {
    const addStopButton = directionsEle.shadowRoot?.querySelector<HTMLElement>('.esri-directions__add-stop-button')
    const editRouteButton = directionsEle.shadowRoot?.querySelector<HTMLElement>('.esri-directions__edit-route-button')

    expect(addStopButton).toBeTruthy()
    expect(editRouteButton).toBeTruthy()
    expect(addStopButton.style.getPropertyValue('--calcite-button-background-color')).toBe('var(--sys-color-action)')
    expect(addStopButton.style.getPropertyValue('--calcite-button-text-color')).toBe('var(--sys-color-action-text)')
    expect(editRouteButton.style.getPropertyValue('--calcite-button-background-color')).toBe('var(--sys-color-action)')
    expect(editRouteButton.style.getPropertyValue('--calcite-button-text-color')).toBe('var(--sys-color-action-text)')
  }

  beforeEach(() => {
    jest.clearAllMocks()
    directionsStates = []
    directionsElements = []
    jest.spyOn(document, 'createElement').mockImplementation((tagName: string, options?: ElementCreationOptions) => {
      if (String(tagName).toLowerCase() === 'arcgis-directions') {
        const ele: any = originalCreateElement('arcgis-directions', options)
        attachDirectionsShadowRoot(ele)
        ele.componentOnReady = jest.fn().mockResolvedValue(ele)
        ele.destroy = jest.fn().mockResolvedValue(undefined)
        ele.getDirections = jest.fn().mockResolvedValue({ routeInfo: {} })
        ele.state = directionsStates.shift() ?? 'ready'
        ele.lastRoute = null
        directionsElements.push(ele)
        return ele
      }
      return originalCreateElement(tagName as any, options)
    })
  })

  afterEach(() => {
    jest.useRealTimers()
    ;(document.createElement as jest.Mock).mockRestore()
    cleanup()
  })

  function createProps (enableRouteSaving?: boolean, mutableStateProps?: any): any {
    return {
      id: 'widget_3',
      widgetId: 'widget_3',
      label: 'Directions',
      useMapWidgetIds: ['map_widget_1'],
      autoHeight: false,
      mutableStateProps,
      config: {
        enableRouteSaving,
        showRuntimeLayers: true,
        unit: 'metric',
        routeConfig: {
          useUtility: {
            utilityId: 'routeUtil'
          },
          barrierLayers: {}
        },
        searchConfig: {
          dataConfig: [
            {
              useUtility: {
                utilityId: 'searchUtil'
              }
            }
          ],
          generalConfig: {},
          suggestionConfig: {}
        }
      }
    }
  }

  it('creates arcgis-directions and binds route layer/view', async () => {
    render(<Widget {...createProps(false)} />)

    await waitFor(() => {
      expect(document.querySelector('arcgis-directions')).toBeInTheDocument()
    })

    const directionsEle = document.querySelector('arcgis-directions') as any
    expect(directionsEle).toBeTruthy()
    expect(directionsEle.view).toBe(mockView as any)
    expect(directionsEle.layer).toBeTruthy()
    expect(directionsEle.hideSaveButton).toBe(true)
    expect(directionsEle.hideSaveAsButton).toBe(true)
    expect(directionsEle.hideLayerDetails).toBe(true)
    expectDirectionsActionButtonsStyled(directionsEle)
    expect(mockMap.add).toHaveBeenCalled()
  })

  it('keeps save controls visible when route saving is enabled', async () => {
    render(<Widget {...createProps(true)} />)

    await waitFor(() => {
      expect(document.querySelector('arcgis-directions')).toBeInTheDocument()
    })

    const directionsEle = document.querySelector('arcgis-directions') as any
    expect(directionsEle.hideSaveButton).toBe(false)
    expect(directionsEle.hideSaveAsButton).toBe(false)
    expect(directionsEle.hideLayerDetails).toBe(false)
  })

  it('does not render directions component when map widget is not configured', async () => {
    const props = createProps(true)
    props.useMapWidgetIds = []
    render(<Widget {...props} />)

    await waitFor(() => {
      expect(document.querySelector('arcgis-directions')).not.toBeInTheDocument()
    })
  })

  it('refreshes the directions component once for action flow when current state is error', async () => {
    directionsStates = ['error', 'ready']

    render(<Widget {...createProps(true, {})} />)

    await waitFor(() => {
      expect(solveRouteIfPossible).toHaveBeenCalledTimes(1)
    })

    expect(directionsElements).toHaveLength(2)
    expect(directionsElements[0].destroy).toHaveBeenCalledTimes(1)
    expect(directionsElements[1].layer).toBe(directionsElements[0].layer)
    expectDirectionsActionButtonsStyled(directionsElements[1])
  })

  it('refreshes only once and returns without solving when the refreshed action state stays error', async () => {
    jest.useFakeTimers()
    directionsStates = ['error', 'error']

    render(<Widget {...createProps(true, {})} />)

    await act(async () => {
      await Promise.resolve()
    })

    await act(async () => {
      jest.advanceTimersByTime(10100)
      await Promise.resolve()
    })

    expect(directionsElements).toHaveLength(2)
    expect(directionsElements[0].destroy).toHaveBeenCalledTimes(1)
    expect(directionsElements[1].destroy).not.toHaveBeenCalled()
    expect(solveRouteIfPossible).not.toHaveBeenCalled()
  })
})
