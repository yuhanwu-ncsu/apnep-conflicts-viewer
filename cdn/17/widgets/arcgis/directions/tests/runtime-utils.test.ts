import { DataSourceManager, DataSourceStatus } from 'jimu-core'

import {
  applyDataActionToLayer,
  getSaveVisibilityConfig,
  setOutputDssNotReady,
  setOutputDssUnloadedAndSetLayer,
  solveRouteIfPossible
} from '../src/runtime/runtime-utils'
import { getDirectionLineOutputDsId, getDirectionPointOutputDsId, getRouteOutputDsId, getStopOutputDsId } from '../src/utils'

function createStopsCollection (items: Array<{ geometry: any, name: string }>) {
  return {
    items,
    at (index: number) {
      return this.items[index]
    },
    get length () {
      return this.items.length
    },
    filter (predicate) {
      return this.items.filter(predicate)
    },
    removeAll: jest.fn(function () {
      this.items = []
    }),
    addMany: jest.fn(function (newItems) {
      this.items.push(...newItems)
    })
  }
}

function createMockDs (id: string) {
  return {
    id,
    setStatus: jest.fn(),
    setCountStatus: jest.fn(),
    setSourceFeatures: jest.fn().mockResolvedValue(undefined)
  }
}

describe('directions runtime utils', () => {
  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('applies directionsFromPoint data action to first stop', async () => {
    const layer = {
      stops: createStopsCollection([
        { geometry: null, name: '' },
        { geometry: null, name: '' }
      ])
    } as any
    const point = { x: 1, y: 2 } as any
    const resolveAddress = jest.fn().mockResolvedValue('from-address')

    const result = await applyDataActionToLayer({
      layer,
      mutableStateProps: { directionsFromPoint: point },
      searchConfig: {} as any,
      resolveAddress
    })

    expect(result).toBe('directionsFromPoint')
    expect(layer.stops.at(0).geometry).toBe(point)
    expect(layer.stops.at(0).name).toBe('from-address')
  })

  it('applies directionsToPoint data action to last stop', async () => {
    const layer = {
      stops: createStopsCollection([
        { geometry: null, name: '' },
        { geometry: null, name: '' },
        { geometry: null, name: '' }
      ])
    } as any
    const point = { x: 3, y: 4 } as any
    const resolveAddress = jest.fn().mockResolvedValue('to-address')

    const result = await applyDataActionToLayer({
      layer,
      mutableStateProps: { directionsToPoint: point },
      searchConfig: {} as any,
      resolveAddress
    })

    expect(result).toBe('directionsToPoint')
    expect(layer.stops.at(2).geometry).toBe(point)
    expect(layer.stops.at(2).name).toBe('to-address')
  })

  it('applies routeStops data action and replaces all stops', async () => {
    const layer = {
      stops: createStopsCollection([
        { geometry: null, name: '' },
        { geometry: null, name: '' }
      ])
    } as any
    const pointA = { x: 1, y: 1 } as any
    const pointB = { x: 2, y: 2 } as any
    const resolveAddress = jest.fn().mockImplementation((point) => Promise.resolve(`addr-${point.x}`))

    const result = await applyDataActionToLayer({
      layer,
      mutableStateProps: { routeStops: [pointA, pointB] },
      searchConfig: {} as any,
      resolveAddress
    })

    expect(result).toBe('routeStops')
    expect(layer.stops.removeAll).toHaveBeenCalled()
    expect(layer.stops.addMany).toHaveBeenCalledTimes(1)
    const addedStops = (layer.stops.addMany as jest.Mock).mock.calls[0][0]
    expect(addedStops).toEqual([
      { geometry: pointA, name: 'addr-1' },
      { geometry: pointB, name: 'addr-2' }
    ])
  })

  it('solves route only when there are at least two valid stops', async () => {
    const layer = {
      stops: createStopsCollection([
        { geometry: { x: 1 }, name: 'A' },
        { geometry: null, name: 'B' }
      ])
    } as any
    const getDirections = jest.fn().mockResolvedValue(undefined)

    const firstTry = await solveRouteIfPossible({ layer, getDirections })
    expect(firstTry).toBe(false)
    expect(getDirections).not.toHaveBeenCalled()

    layer.stops.at(1).geometry = { x: 2 }
    const secondTry = await solveRouteIfPossible({ layer, getDirections })
    expect(secondTry).toBe(true)
    expect(getDirections).toHaveBeenCalledTimes(1)
  })

  it('returns save visibility config by enableRouteSaving flag', () => {
    const defaultConfig = getSaveVisibilityConfig(undefined)
    expect(defaultConfig.hideSaveButton).toBe(false)
    expect(defaultConfig.hideSaveAsButton).toBe(false)
    expect(defaultConfig.hideLayerDetails).toBe(false)

    const disabledConfig = getSaveVisibilityConfig(false)
    expect(disabledConfig.hideSaveButton).toBe(true)
    expect(disabledConfig.hideSaveAsButton).toBe(true)
    expect(disabledConfig.hideLayerDetails).toBe(true)
  })

  it('sets output data sources to NotReady status', async () => {
    const stopDs = createMockDs('stopDs')
    const routeDs = createMockDs('routeDs')
    const dirPointDs = createMockDs('dirPointDs')
    const dirLineDs = createMockDs('dirLineDs')
    const dsMap = {
      [getStopOutputDsId('w1')]: stopDs,
      [getRouteOutputDsId('w1')]: routeDs,
      [getDirectionPointOutputDsId('w1')]: dirPointDs,
      [getDirectionLineOutputDsId('w1')]: dirLineDs
    }
    jest.spyOn(DataSourceManager, 'getInstance').mockReturnValue({
      createDataSource: jest.fn().mockImplementation((id) => Promise.resolve(dsMap[id]))
    } as any)

    await setOutputDssNotReady('w1')

    expect(stopDs.setStatus).toHaveBeenCalledWith(DataSourceStatus.NotReady)
    expect(routeDs.setStatus).toHaveBeenCalledWith(DataSourceStatus.NotReady)
    expect(dirPointDs.setStatus).toHaveBeenCalledWith(DataSourceStatus.NotReady)
    expect(dirLineDs.setStatus).toHaveBeenCalledWith(DataSourceStatus.NotReady)
  })

  it('sets output data sources to Unloaded and updates feature sources', async () => {
    const stopDs = createMockDs('stopDs')
    const routeDs = createMockDs('routeDs')
    const dirPointDs = createMockDs('dirPointDs')
    const dirLineDs = createMockDs('dirLineDs')
    const dsMap = {
      [getStopOutputDsId('w2')]: stopDs,
      [getRouteOutputDsId('w2')]: routeDs,
      [getDirectionPointOutputDsId('w2')]: dirPointDs,
      [getDirectionLineOutputDsId('w2')]: dirLineDs
    }
    jest.spyOn(DataSourceManager, 'getInstance').mockReturnValue({
      createDataSource: jest.fn().mockImplementation((id) => Promise.resolve(dsMap[id]))
    } as any)

    const stopGraphic = { id: 'stopGraphic' }
    const routeGraphic = { id: 'routeGraphic' }
    const dirPointGraphic = { id: 'dirPointGraphic' }
    const dirLineGraphic = { id: 'dirLineGraphic' }
    const result = {
      stops: { toArray: () => [{ toGraphic: () => stopGraphic }] },
      routeInfo: { toGraphic: () => routeGraphic },
      directionPoints: { toArray: () => [{ toGraphic: () => dirPointGraphic }] },
      directionLines: { toArray: () => [{ toGraphic: () => dirLineGraphic }] }
    } as any

    await setOutputDssUnloadedAndSetLayer('w2', result)

    expect(stopDs.setSourceFeatures).toHaveBeenCalledWith([stopGraphic], { id: 'stopDs', geometryType: 'point' })
    expect(routeDs.setSourceFeatures).toHaveBeenCalledWith([routeGraphic], { id: 'routeDs', geometryType: 'polyline' })
    expect(dirPointDs.setSourceFeatures).toHaveBeenCalledWith([dirPointGraphic], { id: 'dirPointDs', geometryType: 'point' })
    expect(dirLineDs.setSourceFeatures).toHaveBeenCalledWith([dirLineGraphic], { id: 'dirLineDs', geometryType: 'polyline' })

    expect(stopDs.setStatus).toHaveBeenCalledWith(DataSourceStatus.Unloaded)
    expect(routeDs.setStatus).toHaveBeenCalledWith(DataSourceStatus.Unloaded)
    expect(dirPointDs.setStatus).toHaveBeenCalledWith(DataSourceStatus.Unloaded)
    expect(dirLineDs.setStatus).toHaveBeenCalledWith(DataSourceStatus.Unloaded)
  })

})
