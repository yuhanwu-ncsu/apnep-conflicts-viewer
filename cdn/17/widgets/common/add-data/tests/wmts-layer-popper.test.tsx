import type { ReactNode, RefObject } from 'react'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import * as jimuCore from 'jimu-core'
import { IntlProvider } from 'react-intl'
import { WmtsLayerPopper } from '../src/runtime/components/add-data-popper/wmts-layer-popper'

jest.mock('jimu-core', () => {
  const actual = jest.requireActual('jimu-core')
  return {
    ...actual,
    loadArcGISJSAPIModule: jest.fn(actual.loadArcGISJSAPIModule)
  }
})

jest.mock('jimu-ui', () => {
  const actual = jest.requireActual('jimu-ui')
  return {
    ...actual,
    Popper: ({ children }: { children: ReactNode }) => <div>{children}</div>,
    PanelHeader: ({ title }: { title: ReactNode }) => <div>{title}</div>,
    Tooltip: ({ children }: { children: ReactNode }) => <>{children}</>,
    Dropdown: ({ children }: { children: ReactNode }) => <div>{children}</div>,
    DropdownButton: ({ children, ...rest }: any) => <button {...rest}>{children}</button>,
    DropdownMenu: ({ children }: { children: ReactNode }) => <div>{children}</div>,
    DropdownItem: ({ children, onClick, active }: any) => <button data-active={active} onClick={onClick}>{children}</button>
  }
})

const mockedLoadArcGISJSAPIModule = jimuCore.loadArcGISJSAPIModule as jest.MockedFunction<typeof jimuCore.loadArcGISJSAPIModule>

describe('add-data wmts-layer-popper', () => {
  afterEach(() => {
    mockedLoadArcGISJSAPIModule.mockReset()
    jest.restoreAllMocks()
  })

  it('shows the matrix dropdown before layer selection and resets to the first matrix set for the chosen layer', async () => {
    class MockWMTSLayer {
      sublayers = {
        toArray: () => ([
          {
            id: 'layer-a',
            title: 'Layer A',
            tileMatrixSets: {
              toArray: () => ([
                { id: 'EPSG:3857', title: 'Web Mercator' },
                { id: 'EPSG:5514', title: 'Krovak' }
              ])
            }
          },
          {
            id: 'layer-b',
            title: 'Layer B',
            tileMatrixSets: {
              toArray: () => ([
                { id: 'EPSG:4326', title: 'Global CRS84' }
              ])
            }
          }
        ])
      }
      load = jest.fn().mockResolvedValue(undefined)
    }

    mockedLoadArcGISJSAPIModule.mockResolvedValue(MockWMTSLayer as any)

    const onConfirm = jest.fn()
    const reference = {
      current: {
        getBoundingClientRect: () => ({ width: 240, height: 600 })
      }
    } as RefObject<HTMLElement>

    render(
      <IntlProvider locale='en' messages={{}}>
        <WmtsLayerPopper
          open
          url='https://example.com/wmts'
          reference={reference}
          translate={(id) => id}
          onConfirm={onConfirm}
          onClose={jest.fn()}
          onError={jest.fn()}
          failedToFetchMessage='failed'
        />
      </IntlProvider>
    )

    await waitFor(() => {
      expect(mockedLoadArcGISJSAPIModule).toHaveBeenCalledWith('esri/layers/WMTSLayer')
    })

    expect(screen.getByText('selectLayerToAdd')).toBeTruthy()
    const radios = await screen.findAllByRole('radio')
    expect(radios).toHaveLength(2)
    expect(screen.getAllByText('Web Mercator')).toHaveLength(2)

    fireEvent.click(screen.getByText('Layer B'))
    expect(screen.getAllByText('Global CRS84')).toHaveLength(2)
    fireEvent.click(screen.getByRole('button', { name: 'ok' }))

    expect(onConfirm).toHaveBeenCalledWith({
      wmtsLayerId: 'layer-b',
      wmtsTileMatrixSetId: 'EPSG:4326',
      sourceLabel: 'Layer B'
    })
  })
})
