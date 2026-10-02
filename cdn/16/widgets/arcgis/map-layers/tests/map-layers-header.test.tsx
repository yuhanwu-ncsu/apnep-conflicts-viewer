import { act, fireEvent, render, waitFor } from '@testing-library/react'
import { mockTheme } from 'jimu-for-test'
import MapLayersHeader, { onFilterListItem } from '../src/runtime/components/map-layers-header'

jest.mock('jimu-core', () => {
  const jimuCore = (jest as any).requireActual('jimu-core')
  return {
    ...jimuCore,
    hooks: {
      ...jimuCore.hooks,
      useTranslation: () => (id: string) => id
    }
  }
})

jest.mock('jimu-ui', () => {
  return {
    Button: ({ children, onClick, ...rest }) => <button onClick={onClick} {...rest}>{children}</button>,
    Dropdown: ({ children, ...rest }) => <div {...rest}>{children}</div>,
    DropdownButton: ({ children, ...rest }) => <button {...rest}>{children}</button>,
    DropdownItem: ({ children, onClick, divider, ...rest }) => divider ? <div data-testid='divider'></div> : <button onClick={onClick} {...rest}>{children}</button>,
    DropdownMenu: ({ children, ...rest }) => <div {...rest}>{children}</div>,
    TextInput: ({ onChange, ...rest }) => <input aria-label='search-input' onChange={onChange} {...rest}></input>
  }
})

const createConfig = (overrides = {}) => {
  return {
    useMapWidget: true,
    searchLayers: true,
    layerBatchOptions: true,
    expandAllLayers: false,
    ...overrides
  } as any
}

describe('map-layers header helpers', () => {
  it('matches layer title and opens parent chain', () => {
    const root: any = { open: false, parent: null }
    const parent: any = { open: false, parent: root }
    const item: any = {
      open: false,
      parent,
      layer: {
        title: 'Road Network'
      }
    }

    const predicate = onFilterListItem('road')
    expect(predicate(item)).toBe(true)
    expect(parent.open).toBe(true)
    expect(root.open).toBe(true)
  })

  it('returns false when title does not match', () => {
    const item: any = {
      open: false,
      parent: null,
      layer: {
        title: 'Buildings'
      }
    }

    const predicate = onFilterListItem('road')
    expect(predicate(item)).toBe(false)
    expect(item.open).toBe(false)
  })

  it('returns true for empty search text', () => {
    const item: any = {
      layer: {
        title: 'Anything'
      }
    }

    const predicate = onFilterListItem('')
    expect(predicate(item)).toBe(true)
  })

  it('clears search filter and resets expand state when search is closed', async () => {
    jest.useFakeTimers()

    const child: any = { open: true, parent: null, layer: { title: 'Road Child' } }
    const parent: any = { open: true, parent: null, children: [child], layer: { title: 'Road Group' } }
    child.parent = parent

    const layerListRef: any = {
      current: {
        filterPredicate: null,
        operationalItems: [parent]
      }
    }
    const tableListRef: any = {
      current: {
        filterPredicate: null
      }
    }

    const { getByLabelText } = render(
      <MapLayersHeader
        theme={mockTheme as any}
        jimuMapViewId='jmv-1'
        layerListRef={layerListRef}
        tableListRef={tableListRef}
        headerKey='header-1'
        config={createConfig({ expandAllLayers: false })}
      />
    )

    fireEvent.click(getByLabelText('SearchLabel'))
    fireEvent.change(getByLabelText('search-input'), { target: { value: 'road' } })
    act(() => {
      jest.advanceTimersByTime(250)
    })

    await waitFor(() => {
      expect(typeof layerListRef.current.filterPredicate).toBe('function')
      expect(typeof tableListRef.current.filterPredicate).toBe('function')
    })

    fireEvent.click(getByLabelText('SearchLabel'))

    await waitFor(() => {
      expect(layerListRef.current.filterPredicate).toBeNull()
      expect(tableListRef.current.filterPredicate).toBeNull()
    })

    expect(parent.open).toBe(false)
    expect(child.open).toBe(false)
    jest.useRealTimers()
  })

  it('expands and collapses all layers through batch actions', () => {
    const child: any = { open: false, children: null, parent: null, layer: { title: 'Child' } }
    const parent: any = { open: false, children: [child], parent: null, layer: { title: 'Parent' } }
    child.parent = parent

    const layerListRef: any = {
      current: {
        filterPredicate: null,
        operationalItems: [parent]
      }
    }

    const { getByText } = render(
      <MapLayersHeader
        theme={mockTheme as any}
        jimuMapViewId='jmv-1'
        layerListRef={layerListRef}
        tableListRef={{ current: { filterPredicate: null } } as any}
        headerKey='header-2'
        config={createConfig({ searchLayers: false, layerBatchOptions: true, useMapWidget: false })}
      />
    )

    fireEvent.click(getByText('expandAllLayers'))
    expect(parent.open).toBe(true)
    expect(child.open).toBe(true)

    fireEvent.click(getByText('collapseAllLayers'))
    expect(parent.open).toBe(false)
    expect(child.open).toBe(false)
  })
})
