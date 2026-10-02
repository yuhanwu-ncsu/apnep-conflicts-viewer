import { renderHook, waitFor } from '@testing-library/react'
import FeatureSnappingLayerSource from '@arcgis/core/views/interactive/snapping/FeatureSnappingLayerSource'
import useEditor from '../src/runtime/components/use-editor'
import { SnapSettingMode } from '../src/config'

jest.mock('@arcgis/core/views/interactive/sketch/SketchTooltipOptions', () => ({
  __esModule: true,
  default: jest.fn().mockImplementation((options) => ({ ...options, __type: 'tooltip' }))
}))

jest.mock('@arcgis/core/views/interactive/sketch/SketchLabelOptions', () => ({
  __esModule: true,
  default: jest.fn().mockImplementation((options) => ({ ...options, __type: 'label' }))
}))

jest.mock('@arcgis/core/views/interactive/snapping/SnappingOptions', () => ({
  __esModule: true,
  default: jest.fn().mockImplementation((options) => ({ ...options, __type: 'snapping' }))
}))

jest.mock('@arcgis/core/views/interactive/snapping/FeatureSnappingLayerSource', () => ({
  __esModule: true,
  default: jest.fn().mockImplementation((options) => ({ ...options, __type: 'feature-source' }))
}))

jest.mock('../src/runtime/components/utils', () => ({
  constructUneditableInfo: jest.fn((layer) => ({ layer, enabled: false })),
  getDefaultSnapSources: jest.fn(),
  getEditorLayerInfo: jest.fn(),
  isEditableLayerView: jest.fn(),
  updateDataSourceAfterEdit: jest.fn()
}))

jest.mock('../src/utils', () => ({
  SUPPORTED_JIMU_LAYER_TYPES: ['feature'],
  getDataSourceById: jest.fn(),
  getEditDataSource: jest.fn((ds) => ds),
  getFlatFormElements: jest.fn((elements) => elements || [])
}))

const runtimeUtils = require('../src/runtime/components/utils')
const getDefaultSnapSourcesMock = runtimeUtils.getDefaultSnapSources as jest.Mock
const getEditorLayerInfoMock = runtimeUtils.getEditorLayerInfo as jest.Mock
const isEditableLayerViewMock = runtimeUtils.isEditableLayerView as jest.Mock

describe('useEditor', () => {
  const featureSourceMock = FeatureSnappingLayerSource as unknown as jest.Mock
  const removeMock = jest.fn()
  const layer = {
    id: 'layer-1',
    type: 'feature',
    url: 'https://example.com/layer/0',
    on: jest.fn(() => ({ remove: jest.fn() })),
    relationships: []
  }
  const layerView = {
    id: 'jlv-1',
    layer,
    layerDataSourceId: 'ds-1',
    fromRuntime: false,
    isLayerVisible: jest.fn(() => true),
    getOrCreateLayerDataSource: jest.fn().mockResolvedValue({ id: 'ds-1' })
  }
  const createMapView = (type = '2d') => ({
    id: 'map-1',
    view: {
      type,
      map: {
        allLayers: {
          toArray: () => [layer],
          on: jest.fn(() => ({ remove: removeMock }))
        },
        allTables: {
          toArray: () => []
        },
        layers: {}
      }
    },
    getAllJimuLayerViews: jest.fn(() => [layerView]),
    addJimuLayerViewsVisibleChangeListener: jest.fn(),
    removeJimuLayerViewsVisibleChangeListener: jest.fn(),
    addJimuLayerViewCreatedListener: jest.fn(),
    removeJimuLayerViewCreatedListener: jest.fn(),
    addJimuLayerViewRemovedListener: jest.fn(),
    removeJimuLayerViewRemovedListener: jest.fn(),
    getDataSourceIdByAPILayer: jest.fn()
  })

  beforeEach(() => {
    jest.clearAllMocks()
    getDefaultSnapSourcesMock.mockReturnValue([{ layer: { id: 'snap-layer' }, enabled: true }])
    getEditorLayerInfoMock.mockResolvedValue({
      showUpdateBtn: true,
      editorLayerInfo: {
        layer,
        enabled: true,
        addEnabled: true,
        updateEnabled: true,
        deleteEnabled: true,
        formTemplate: { elements: [] }
      }
    })
    isEditableLayerViewMock.mockReturnValue(true)
  })

  it('should hide merge button when batch editing is disabled', async () => {
    const jimuMapView: any = createMapView('2d')
    const config: any = {
      batchEditing: false,
      selfSnapping: false,
      featureSnapping: true,
      gridSnapping: false,
      defaultSelfEnabled: false,
      defaultFeatureEnabled: true,
      snapSettingMode: SnapSettingMode.Flexible,
      defaultSnapLayers: ['ds-1'],
      tooltip: true,
      defaultTooltipEnabled: true,
      segmentLabel: true,
      defaultSegmentLabelEnabled: false,
      templateFilter: true,
      initialReshapeMode: true,
      advancedEditingTools: true,
      splitButton: true,
      mergeButton: true,
      mapViewsConfig: {}
    }

    const editor: any = { view: jimuMapView.view }
    const { result } = renderHook(() => useEditor({ config, jimuMapView, canEditFeature: true, editor }))

    await waitFor(() => {
      expect(result.current.layerInfos).toHaveLength(1)
    })

    expect(featureSourceMock).toHaveBeenCalledWith({ layer: { id: 'snap-layer' }, enabled: true })
    expect(result.current.hideMergeButton).toBe(true)
    expect(result.current.hideSplitButton).toBe(false)
    expect(result.current.hideSnappingControlsElementsLayerList).toBe(false)
    expect(result.current.supportingWidgetDefaults.sketch.defaultUpdateOptions.tool).toBe('reshape')
  })

  it('should show merge button when batch editing is enabled', async () => {
    const jimuMapView: any = createMapView('2d')
    const config: any = {
      batchEditing: true,
      selfSnapping: false,
      featureSnapping: true,
      gridSnapping: false,
      defaultSelfEnabled: false,
      defaultFeatureEnabled: true,
      snapSettingMode: SnapSettingMode.Flexible,
      defaultSnapLayers: ['ds-1'],
      tooltip: true,
      defaultTooltipEnabled: true,
      segmentLabel: true,
      defaultSegmentLabelEnabled: false,
      templateFilter: true,
      initialReshapeMode: true,
      advancedEditingTools: true,
      splitButton: true,
      mergeButton: true,
      mapViewsConfig: {}
    }

    const editor: any = { view: jimuMapView.view }
    const { result } = renderHook(() => useEditor({ config, jimuMapView, canEditFeature: true, editor }))

    await waitFor(() => {
      expect(result.current.layerInfos).toHaveLength(1)
    })

    expect(result.current.hideMergeButton).toBe(false)
  })

  it('should hide advanced editing buttons when advanced tools are disabled', async () => {
    const jimuMapView: any = createMapView('3d')
    const config: any = {
      selfSnapping: false,
      featureSnapping: false,
      gridSnapping: false,
      tooltip: false,
      segmentLabel: true,
      templateFilter: false,
      initialReshapeMode: false,
      advancedEditingTools: false,
      splitButton: true,
      mergeButton: true,
      mapViewsConfig: {}
    }

    const editor: any = { view: jimuMapView.view }
    const { result } = renderHook(() => useEditor({ config, jimuMapView, canEditFeature: true, editor }))

    await waitFor(() => {
      expect(result.current.layerInfos).toHaveLength(1)
    })

    expect(result.current.hideSplitButton).toBe(true)
    expect(result.current.hideMergeButton).toBe(true)
    expect(result.current.hideSettingsMenu).toBe(false)
    expect(result.current.supportingWidgetDefaults.sketch.defaultUpdateOptions.tool).toBe('transform')
  })

  it('should control grid snapping hide props by gridSnapping state', async () => {
    const jimuMapView: any = createMapView('2d')
    const config: any = {
      selfSnapping: false,
      featureSnapping: false,
      gridSnapping: true,
      defaultSelfEnabled: false,
      defaultFeatureEnabled: false,
      defaultGridEnabled: true,
      snapSettingMode: SnapSettingMode.Flexible,
      defaultSnapLayers: ['ds-1'],
      tooltip: false,
      segmentLabel: false,
      templateFilter: false,
      initialReshapeMode: false,
      advancedEditingTools: true,
      splitButton: true,
      mergeButton: true,
      mapViewsConfig: {}
    }

    const editor: any = { view: jimuMapView.view }
    const { result } = renderHook(() => useEditor({ config, jimuMapView, canEditFeature: true, editor }))

    await waitFor(() => {
      expect(result.current.layerInfos).toHaveLength(1)
    })

    expect(result.current.hideSnappingControlsElementsGridControls).toBe(false)
    expect(result.current.hideSnappingControlsElementsGridEnabledToggle).toBe(false)
    expect(result.current.hideSnappingControlsElementsEnabledToggle).toBe(false)
  })

  it('should update tooltip, label and snapping options independently', async () => {
    const jimuMapView: any = createMapView('2d')
    const editor: any = { view: jimuMapView.view }
    const config: any = {
      selfSnapping: false,
      featureSnapping: true,
      gridSnapping: false,
      defaultSelfEnabled: false,
      defaultFeatureEnabled: true,
      defaultGridEnabled: false,
      snapSettingMode: SnapSettingMode.Flexible,
      defaultSnapLayers: ['ds-1'],
      tooltip: true,
      defaultTooltipEnabled: false,
      segmentLabel: true,
      defaultSegmentLabelEnabled: false,
      templateFilter: true,
      initialReshapeMode: true,
      advancedEditingTools: true,
      splitButton: true,
      mergeButton: true,
      mapViewsConfig: {}
    }

    const { result, rerender } = renderHook((props: any) => useEditor(props), {
      initialProps: { config, jimuMapView, canEditFeature: true, editor }
    })

    await waitFor(() => {
      expect(result.current.layerInfos).toHaveLength(1)
      expect(editor.tooltipOptions).toEqual({ enabled: false, __type: 'tooltip' })
      expect(editor.labelOptions).toEqual({ enabled: false, __type: 'label' })
      expect(editor.snappingOptions).toEqual(expect.objectContaining({ __type: 'snapping', featureEnabled: true }))
    })

    const initialTooltipOptions = editor.tooltipOptions
    const initialLabelOptions = editor.labelOptions
    const initialSnappingOptions = editor.snappingOptions

    rerender({ config: { ...config, defaultTooltipEnabled: true }, jimuMapView, canEditFeature: true, editor })

    await waitFor(() => {
      expect(editor.tooltipOptions).not.toBe(initialTooltipOptions)
      expect(editor.tooltipOptions).toEqual({ enabled: true, __type: 'tooltip' })
    })

    editor.labelOptions.enabled = true
    editor.snappingOptions.selfEnabled = true

    expect(editor.labelOptions).toBe(initialLabelOptions)
    expect(editor.labelOptions.enabled).toBe(true)
    expect(editor.snappingOptions).toBe(initialSnappingOptions)
    expect(editor.snappingOptions.selfEnabled).toBe(true)

    const tooltipOptionsAfterTooltipChange = editor.tooltipOptions

    rerender({ config: { ...config, defaultTooltipEnabled: true, defaultSegmentLabelEnabled: true }, jimuMapView, canEditFeature: true, editor })

    await waitFor(() => {
      expect(editor.labelOptions).not.toBe(initialLabelOptions)
      expect(editor.labelOptions).toEqual({ enabled: true, __type: 'label' })
    })

    expect(editor.tooltipOptions).toBe(tooltipOptionsAfterTooltipChange)
    expect(editor.snappingOptions).toBe(initialSnappingOptions)
    expect(editor.snappingOptions.selfEnabled).toBe(true)

    editor.tooltipOptions.enabled = false

    rerender({ config: { ...config, defaultTooltipEnabled: true, defaultSegmentLabelEnabled: true, defaultSelfEnabled: true }, jimuMapView, canEditFeature: true, editor })

    await waitFor(() => {
      expect(editor.snappingOptions).not.toBe(initialSnappingOptions)
      expect(editor.snappingOptions).toEqual(expect.objectContaining({ __type: 'snapping', selfEnabled: true, featureEnabled: true }))
    })

    expect(editor.tooltipOptions).toBe(tooltipOptionsAfterTooltipChange)
    expect(editor.tooltipOptions.enabled).toBe(false)
    expect(editor.labelOptions).toEqual({ enabled: true, __type: 'label' })
  })
})