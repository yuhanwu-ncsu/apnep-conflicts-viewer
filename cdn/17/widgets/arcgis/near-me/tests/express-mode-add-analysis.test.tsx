import { React, appActions, createIntl, getAppStore } from 'jimu-core'
import { mockTheme, widgetRender, wrapWidget, initGlobal, getInitState, getDefaultAppConfig } from 'jimu-for-test'
import '@testing-library/jest-dom'
import { act, fireEvent, waitFor } from '@testing-library/react'
import ExpressModeAddAnalysisPopper from '../src/setting/components/express-mode-add-analysis'
import { AnalysisTypeName } from '../src/config'

const mockLayerRegistry: { [id: string]: any } = {}

jest.mock('esri/intl', () => ({}), { virtual: true })

jest.mock('jimu-theme', () => {
  const actual = jest.requireActual('jimu-theme')
  return {
    ...actual,
    getTheme2: jest.fn().mockReturnValue(null)
  }
})

jest.mock('../src/common/utils', () => ({
  getAllFieldsNames: jest.fn().mockReturnValue(['OBJECTID', 'NAME']),
  getDisplayField: jest.fn().mockReturnValue('NAME'),
  getSelectedLayerInstance: jest.fn().mockImplementation((id: string) => {
    return mockLayerRegistry[id] || {
      id,
      getLabel: jest.fn().mockReturnValue(`Label_${id}`)
    }
  })
}))

jest.mock('jimu-ui/basic/color-picker', () => ({
  ThemeColorPicker: jest.fn().mockImplementation(({ value, onChange }) => (
    <input
      type='color'
      data-testid='theme-color-picker'
      value={value || ''}
      onChange={(e) => { onChange?.(e.target.value) }}
    />
  ))
}))

getAppStore().dispatch(appActions.updateStoreState(getInitState().merge({ appConfig: getDefaultAppConfig() })))
initGlobal()
window.locale = 'en'

const render = widgetRender(true, mockTheme as any)

type PopperInstance = InstanceType<typeof ExpressModeAddAnalysisPopper>
type PopperProps = React.ComponentProps<typeof ExpressModeAddAnalysisPopper>

const createLayer = (id: string, options: any = {}) => ({
  id,
  getMainDataSource: options.getMainDataSource,
  getDataSourceJson: options.getDataSourceJson,
  layer: options.layer,
  type: options.type
})

const baseLayers = [createLayer('layer_1'), createLayer('layer_2')] as any[]

const baseProps: PopperProps = {
  intl: createIntl({ locale: 'en' }),
  theme: mockTheme as any,
  isOpen: true,
  isActiveMapAreaSelected: false,
  selectedDs: 'root_ds',
  allFeatureLayers: baseLayers,
  layersInfoConfig: [],
  onClose: jest.fn(),
  onOkClick: jest.fn()
}

const getRefInstance = (ref: { current: PopperInstance | null }): PopperInstance => {
  return ref.current
}

const makeCheckboxChangeEvent = (checked: boolean): React.ChangeEvent<HTMLInputElement> => {
  return { target: { checked } as HTMLInputElement } as React.ChangeEvent<HTMLInputElement>
}

const createAnalysisInfoForType = (analysisType: AnalysisTypeName, overrides: { [key: string]: any } = {}) => {
  if (analysisType === AnalysisTypeName.Closest) {
    return {
      analysisId: 'closest-existing-id',
      analysisType,
      highlightResultsOnMap: true,
      highlightColorOnMap: '#f507f5',
      expandOnOpen: false,
      returnIntersectedPolygons: false,
      clipFeatures: false,
      fieldsToExport: ['OBJECTID', 'NAME'],
      includeApproxDistance: false,
      displayFeatureCount: true,
      ...overrides
    }
  }

  if (analysisType === AnalysisTypeName.Proximity) {
    return {
      analysisId: 'proximity-existing-id',
      analysisType,
      displayField: 'NAME',
      sortFeaturesByDistance: true,
      sortFeatures: {
        sortFeaturesByField: '',
        sortFeaturesOrder: 'ASC'
      },
      groupFeaturesEnabled: false,
      groupFeatures: {
        groupFeaturesByField: '',
        groupFeaturesOrder: 'ASC',
        sortGroupsByCount: false,
        noValueGroupLabel: ''
      },
      subGroupFeatures: {
        subGroupFeaturesByField: '',
        subGroupFeaturesOrder: 'ASC',
        sortSubGroupsByCount: false,
        noValueSubGroupLabel: ''
      },
      highlightResultsOnMap: true,
      highlightColorOnMap: '#f507f5',
      expandOnOpen: false,
      expandFeatureDetails: false,
      returnIntersectedPolygons: false,
      fieldsToExport: ['OBJECTID', 'NAME'],
      includeApproxDistance: false,
      displayFeatureCount: true,
      ...overrides
    }
  }

  return {
    analysisId: 'summary-existing-id',
    analysisType,
    isSingleColorMode: true,
    singleFieldColor: '#FFFFFF00',
    summaryFields: [],
    highlightResultsOnMap: true,
    highlightColorOnMap: '#f507f5',
    expandOnOpen: false,
    fieldsToExport: ['OBJECTID', 'NAME'],
    displayFeatureCount: true,
    ...overrides
  }
}

const createLayerAnalysisConfig = (analysisType: AnalysisTypeName, overrides: { [key: string]: any } = {}) => ([
  {
    label: 'Label_layer_1',
    useDataSource: {
      dataSourceId: 'layer_1',
      mainDataSourceId: 'layer_1',
      rootDataSourceId: 'root_ds'
    },
    analysisInfo: createAnalysisInfoForType(analysisType, overrides)
  }
])

const createClosestDuplicateConfig = () => createLayerAnalysisConfig(AnalysisTypeName.Closest)

const renderComponent = (props: Partial<PopperProps> = {}) => {
  const ref: { current: PopperInstance | null } = { current: null }
  const Wrapped: any = wrapWidget(ExpressModeAddAnalysisPopper as any, { theme: mockTheme, ref } as any)
  const mergedProps: any = { widgetId: 'expressModeAddAnalysis', ...baseProps, ...props }
  const utils = render(React.createElement(Wrapped, mergedProps))

  return {
    ref,
    rerenderWith: (nextProps: Partial<PopperProps>) => {
      const rerenderProps: any = { widgetId: 'expressModeAddAnalysis', ...baseProps, ...props, ...nextProps }
      utils.rerender(React.createElement(Wrapped, rerenderProps))
    },
    ...utils
  }
}

beforeEach(() => {
  jest.clearAllMocks()
  Object.keys(mockLayerRegistry).forEach((key) => { delete mockLayerRegistry[key] })

  mockLayerRegistry.layer_1 = { id: 'layer_1', getLabel: jest.fn().mockReturnValue('Label_layer_1') }
  mockLayerRegistry.layer_2 = { id: 'layer_2', getLabel: jest.fn().mockReturnValue('Label_layer_2') }
})

describe('ExpressModeAddAnalysisPopper', () => {
  it('initializes with expected defaults and layer rows', () => {
    const { ref } = renderComponent()
    const instance = getRefInstance(ref)

    expect(instance.state.displayFeatureCount).toBe(true)
    expect(instance.state.highlightResultsOnMap).toBe(true)
    expect(instance.state.expandOnOpen).toBe(false)
    expect(instance.state.highlightColorOnMap).toBe('#f507f5')
    expect(instance.state.expressModeLayerAnalysis).toHaveLength(2)
    expect(instance.state.expressModeLayerAnalysis.every((layer: any) => !layer.enabled)).toBe(true)
    expect(instance.state.expressModeLayerAnalysis.every((layer: any) => !layer.closest && !layer.proximity && !layer.summary)).toBe(true)
  })

  it('toggles all layer enabled states through the layer header checkbox', () => {
    const { ref } = renderComponent()
    const instance = getRefInstance(ref)

    act(() => {
      instance.onLayerHeaderCheckBoxChange(true)
    })
    expect(instance.state.expressModeLayerAnalysis.every((layer: any) => layer.enabled)).toBe(true)
    expect(instance.state.isAllLayerChecked).toBe(true)

    act(() => {
      instance.onLayerHeaderCheckBoxChange(false)
    })
    expect(instance.state.expressModeLayerAnalysis.every((layer: any) => !layer.enabled)).toBe(true)
    expect(instance.state.isAllLayerChecked).toBe(false)
  })

  it('keeps closest selection disabled when active map area search is selected', () => {
    const { ref } = renderComponent({ isActiveMapAreaSelected: true })
    const instance = getRefInstance(ref)

    act(() => {
      instance.onClosestHeaderCheckBoxChange(true)
    })

    expect(instance.state.expressModeLayerAnalysis.every((layer: any) => !layer.closest)).toBe(true)
    expect(instance.state.isAllClosestChecked).toBe(false)
  })

  it('keeps row enabled state unchanged when only analysis type is selected', () => {
    const { ref } = renderComponent()
    const instance = getRefInstance(ref)

    act(() => {
      instance.proximityAnalysisStateChange(true, 0)
    })

    expect(instance.state.expressModeLayerAnalysis[0].proximity).toBe(true)
    expect(instance.state.expressModeLayerAnalysis[0].enabled).toBe(false)
  })

  it('filters duplicate analyses from payload output', () => {
    const { ref } = renderComponent({ layersInfoConfig: createClosestDuplicateConfig() as any })
    const instance = getRefInstance(ref)

    act(() => {
      instance.onLayerCheckBoxChange(true, 0)
    })

    const payload = instance.getAnalysisPayload()
    const layerOne = payload.layersInfo[0]

    expect(layerOne.closest).toBe(false)
    expect(layerOne.proximity).toBe(false)
    expect(layerOne.summary).toBe(false)
    expect(layerOne.enabled).toBe(false)
  })

  it('builds payload from selected analysis and common settings', () => {
    const { ref } = renderComponent()
    const instance = getRefInstance(ref)

    act(() => {
      instance.summaryAnalysisStateChange(true, 0)
      instance.displayFeatureCountStateChange(makeCheckboxChangeEvent(false))
      instance.highlightResultsOnMapOnChange(makeCheckboxChangeEvent(false))
      instance.onHighlightColorOnMapChange('#00ff00')
      instance.expandListOnChange(makeCheckboxChangeEvent(true))
    })

    act(() => {
      instance.onLayerCheckBoxChange(true, 0)
    })

    const payload = instance.getAnalysisPayload()

    expect(payload.layersInfo[0].summary).toBe(true)
    expect(payload.layersInfo[0].enabled).toBe(true)
    expect(payload.commonLayersInfo).toEqual({
      featureCount: false,
      highlightResultsOnMap: false,
      highlightColor: '#00ff00',
      expandAnalysisResults: true
    })
  })

  it('resets defaults when reopened from closed state', async () => {
    const { ref, rerenderWith } = renderComponent({ isOpen: false })
    const instance = getRefInstance(ref)

    act(() => {
      instance.displayFeatureCountStateChange(makeCheckboxChangeEvent(false))
      instance.summaryAnalysisStateChange(true, 0)
    })

    rerenderWith({ isOpen: true })

    await waitFor(() => {
      expect(instance.state.isAddNewAnalysisPopperActive).toBe(true)
      expect(instance.state.displayFeatureCount).toBe(true)
      expect(instance.state.expressModeLayerAnalysis.every((layer: any) => !layer.summary)).toBe(true)
    })
  })

  it('shows duplicate state again after reopening with an unchanged closest analysis', async () => {
    const { ref, rerenderWith } = renderComponent({ isOpen: false, layersInfoConfig: [] as any })
    const instance = getRefInstance(ref)

    rerenderWith({ isOpen: true, layersInfoConfig: createLayerAnalysisConfig(AnalysisTypeName.Closest) as any })

    await waitFor(() => {
      expect(instance.state.isAddNewAnalysisPopperActive).toBe(true)
      expect(instance.state.expressModeLayerAnalysis[0].isClosestDuplicate).toBe(true)
    })
  })

  it('keeps duplicate flags false after reopen when closest/proximity/summary were edited', async () => {
    const editedConfigs = [
      { config: createLayerAnalysisConfig(AnalysisTypeName.Closest), type: AnalysisTypeName.Closest },
      { config: createLayerAnalysisConfig(AnalysisTypeName.Proximity), type: AnalysisTypeName.Proximity },
      { config: createLayerAnalysisConfig(AnalysisTypeName.Summary), type: AnalysisTypeName.Summary }
    ]

    for (const item of editedConfigs) {
      const { ref, rerenderWith } = renderComponent({ isOpen: false, layersInfoConfig: [] as any })
      const instance = getRefInstance(ref)

      rerenderWith({
        isOpen: true,
        layersInfoConfig: item.config as any,
        editedAnalysisLocalKeys: [`layer_1|${item.type}`]
      })

      await waitFor(() => {
        expect(instance.state.isAddNewAnalysisPopperActive).toBe(true)
      })

      const row = instance.state.expressModeLayerAnalysis[0]
      expect(row.isClosestDuplicate).toBe(false)
      expect(row.isProximityDuplicate).toBe(false)
      expect(row.isSummaryDuplicate).toBe(false)
    }
  })

  it('sets duplicate flags true after reopen when closest/proximity/summary are unchanged', async () => {
    const unchangedConfigs = [
      { config: createLayerAnalysisConfig(AnalysisTypeName.Closest), flag: 'isClosestDuplicate' },
      { config: createLayerAnalysisConfig(AnalysisTypeName.Proximity), flag: 'isProximityDuplicate' },
      { config: createLayerAnalysisConfig(AnalysisTypeName.Summary), flag: 'isSummaryDuplicate' }
    ]

    for (const item of unchangedConfigs) {
      const { ref, rerenderWith } = renderComponent({ isOpen: false, layersInfoConfig: [] as any })
      const instance = getRefInstance(ref)

      rerenderWith({ isOpen: true, layersInfoConfig: item.config as any })

      await waitFor(() => {
        expect(instance.state.isAddNewAnalysisPopperActive).toBe(true)
      })

      const row = instance.state.expressModeLayerAnalysis[0]
      expect(row[item.flag]).toBe(true)
    }
  })

  it('returns group label from datasource chain and map layer fallback', () => {
    const { ref } = renderComponent()
    const instance = getRefInstance(ref)

    mockLayerRegistry.group_parent = {
      id: 'group_parent',
      type: 'grouplayer',
      getLabel: jest.fn().mockReturnValue('Parent Group'),
      getMainDataSource: jest.fn().mockReturnValue({ id: 'root_ds' }),
      getDataSourceJson: jest.fn().mockReturnValue({})
    }

    const dsChainLayer: any = createLayer('layer_ds_chain', {
      getMainDataSource: jest.fn().mockReturnValue(mockLayerRegistry.group_parent),
      getDataSourceJson: jest.fn().mockReturnValue({})
    })

    const mapParentLayer: any = createLayer('layer_map_fallback', {
      getMainDataSource: jest.fn().mockReturnValue(null),
      getDataSourceJson: jest.fn().mockReturnValue({}),
      layer: {
        parent: {
          type: 'group',
          title: 'Map Parent Group',
          parent: null
        }
      }
    })

    expect(instance.getGroupLabelForLayer(dsChainLayer)).toBe('Parent Group')
    expect(instance.getGroupLabelForLayer(mapParentLayer)).toBe('Map Parent Group')
  })

  it('calls close immediately and ok callback after timeout when confirming', () => {
    jest.useFakeTimers()

    const onClose = jest.fn()
    const onOkClick = jest.fn()
    const { ref } = renderComponent({ onClose, onOkClick })
    const instance = getRefInstance(ref)

    act(() => {
      instance.summaryAnalysisStateChange(true, 0)
      instance.onOkButtonClicked()
    })

    expect(onClose).toHaveBeenCalledTimes(1)
    expect(onOkClick).not.toHaveBeenCalled()

    act(() => {
      jest.advanceTimersByTime(110)
    })

    expect(onOkClick).toHaveBeenCalledTimes(1)
    expect(onOkClick.mock.calls[0][0]).toHaveProperty('layersInfo')
    expect(onOkClick.mock.calls[0][0]).toHaveProperty('commonLayersInfo')

    jest.useRealTimers()
  })

  it('renders layer labels and toggles color picker visibility from UI interaction', async () => {
    const { getByText, getByTestId, queryByTestId } = renderComponent()

    expect(getByText('Label_layer_1')).toBeInTheDocument()
    expect(getByText('Label_layer_2')).toBeInTheDocument()
    expect(queryByTestId('theme-color-picker')).toBeInTheDocument()

    fireEvent.click(getByTestId('highlightResultsOnMapLabel'))

    await waitFor(() => {
      expect(queryByTestId('theme-color-picker')).not.toBeInTheDocument()
    })
  })
})
