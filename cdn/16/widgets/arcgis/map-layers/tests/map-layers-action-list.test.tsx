import { act, fireEvent, render, waitFor } from '@testing-library/react'
import { DataActionList } from 'jimu-ui'
import { ACTION_INDEXES } from '../src/runtime/actions/constants'
import MapLayersActionList from '../src/runtime/components/map-layers-action-list'

jest.mock('jimu-theme', () => {
  const Wrapper = require('react').forwardRef((props, ref) => <div ref={ref} {...props}></div>)
  return {
    styled: {
      div: () => Wrapper
    }
  }
})

jest.mock('jimu-ui', () => {
  return {
    DropdownItem: ({ children, onClick }) => <button data-testid='dropdown-item' onClick={onClick}>{children}</button>,
    DataActionList: jest.fn((props) => {
      return (
        <div data-testid='data-action-list'>
          <button data-testid='load-data-actions' onClick={() => props.whenListLoaded?.()}>load</button>
        </div>
      )
    })
  }
})

const createDeferred = () => {
  let resolvePromise!: (value?: any) => void
  let rejectPromise!: (value?: any) => void
  const promise = new Promise((resolve, reject) => {
    resolvePromise = resolve
    rejectPromise = reject
  })
  return { promise, resolve: resolvePromise, reject: rejectPromise }
}

describe('map-layers action list', () => {
  beforeEach(() => {
    ;(DataActionList as jest.Mock).mockClear()
  })

  it('loads DataActionList and appends remove action only after list loaded', async () => {
    const featureDS = {
      getLabel: jest.fn().mockReturnValue('Layer DS')
    }
    const mapDataSource = {
      getDataSourceByLayer: jest.fn().mockReturnValue(featureDS)
    }
    const listItem = { layer: { id: 'layer-1' } } as any
    const onActionListItemClick = jest.fn()

    const gotoAction = {
      id: 'goto',
      title: 'Goto',
      className: 'esri-icon',
      group: ACTION_INDEXES.Goto,
      execute: jest.fn()
    }
    const removeAction = {
      id: 'remove',
      title: 'Remove',
      className: 'esri-icon-trash',
      group: ACTION_INDEXES.Remove,
      execute: jest.fn()
    }

    const renderResult = render(
      <MapLayersActionList
        widgetId='widget-1'
        jimuMapView={null as any}
        mapDataSource={mapDataSource as any}
        actionObjects={[gotoAction as any, removeAction as any]}
        listItem={listItem}
        onActionListItemClick={onActionListItemClick}
        enableDataAction
        shouldHideEmptyList
      />
    )

    await waitFor(() => {
      expect(DataActionList).toHaveBeenCalled()
    })

    const dataActionProps = (DataActionList as jest.Mock).mock.calls[0][0]
    expect(dataActionProps.dataSets).toHaveLength(1)
    expect(dataActionProps.dataSets[0].name).toBe('Layer DS')
    expect(renderResult.queryByText('Remove')).toBeNull()

    act(() => {
      dataActionProps.whenListLoaded()
    })

    await waitFor(() => {
      expect(renderResult.getByText('Remove')).toBeTruthy()
    })

    const itemTexts = renderResult.getAllByTestId('dropdown-item').map(node => node.textContent ?? '')
    expect(itemTexts[itemTexts.length - 1]).toContain('Remove')
  })

  it('executes action and callback when action item is clicked', () => {
    const listItem = { layer: { id: 'layer-2' } } as any
    const onActionListItemClick = jest.fn()
    const execute = jest.fn()
    const gotoAction = {
      id: 'goto',
      title: 'Goto',
      className: 'esri-icon',
      group: ACTION_INDEXES.Goto,
      execute
    }

    const renderResult = render(
      <MapLayersActionList
        widgetId='widget-1'
        jimuMapView={null as any}
        mapDataSource={null as any}
        actionObjects={[gotoAction as any]}
        listItem={listItem}
        onActionListItemClick={onActionListItemClick}
        enableDataAction={false}
      />
    )

    fireEvent.click(renderResult.getByText('Goto'))
    expect(execute).toHaveBeenCalledWith(listItem)
    expect(onActionListItemClick).toHaveBeenCalled()
  })

  it('does not update DataActionList after unmount when datasource promise resolves late', async () => {
    const deferred = createDeferred()
    const jimuMapView = {
      getJimuLayerViewByAPILayer: jest.fn().mockReturnValue(null),
      getMapDataSource: jest.fn().mockReturnValue({
        createDataSourceByLayer: jest.fn().mockReturnValue(deferred.promise)
      })
    }
    const listItem = { layer: { id: 'layer-3' } } as any

    const { unmount } = render(
      <MapLayersActionList
        widgetId='widget-1'
        jimuMapView={jimuMapView as any}
        mapDataSource={null as any}
        actionObjects={[]}
        listItem={listItem}
        onActionListItemClick={jest.fn()}
        enableDataAction
      />
    )

    unmount()

    await act(async () => {
      deferred.resolve({
        getLabel: jest.fn().mockReturnValue('Late DS')
      })
      await deferred.promise
      await Promise.resolve()
    })

    expect(DataActionList).not.toHaveBeenCalled()
  })
})
