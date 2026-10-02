import { React, getAppStore, appActions, WidgetState, type IMThemeVariables, Immutable, type ImmutableArray, DataSourceManager } from 'jimu-core'
import { wrapWidget, widgetRender, getInitState, getDefaultAppConfig, mockTheme } from 'jimu-for-test'
import ElevationProfileWidget from '../src/runtime/widget'
import defaultMessages from '../src/setting/translations/default'
import '@testing-library/jest-dom'
import { waitFor } from '@testing-library/react'
import { getUniqueElevationLayersId } from '../src/common/utils'
import GraphicsLayer from 'esri/layers/GraphicsLayer'
getAppStore().dispatch(appActions.updateStoreState(getInitState().merge({ appConfig: getDefaultAppConfig() })))
const Widget = wrapWidget(ElevationProfileWidget)
const render = widgetRender()

const ensureWidgetRuntimeState = (widgetId: string) => {
  getAppStore().dispatch(appActions.updateStoreState(
    getAppStore().getState().setIn(['widgetsRuntimeInfo', widgetId, 'state'], WidgetState.Opened)
  ))
}

const dss = {
  id: 'dataSource_1',
  type: 'ELEVATION_LAYER',
  isDataSourceSet: jest.fn().mockReturnValue(true),
  getChildDataSources: jest.fn().mockReturnValue([]),
  areChildDataSourcesCreated: jest.fn().mockReturnValue(true),
  childDataSourcesReady: jest.fn().mockResolvedValue(undefined),
  layer: {
    id: 'dataSource_1',
    title: 'Test',
    getLayerDefinition: jest.fn().mockReturnValue({
      geometryType: 'esriGeometryLine'
    }),
    type: 'elevation'
  }
}
const mockFnGetDataSource = jest.fn().mockImplementation(() => {
  return dss
})
DataSourceManager.getInstance().getDataSource = mockFnGetDataSource

jest.mock('jimu-core', () => ({
  ...jest.requireActual('jimu-core'),
  geometryUtils: {
    createBuffer: jest.fn(() => Promise.resolve({}))
  }
}))
jest.mock('esri/intl', () => { return {} }, { virtual: true })
jest.mock('esri/geometry/Polyline', () => { return {} }, { virtual: true })
jest.mock('esri/geometry/SpatialReference', () => { return {} }, { virtual: true })
jest.mock('esri/core/units', () => { return {} }, { virtual: true })
jest.mock('esri/Graphic', () => {
  return {
    default: jest.fn().mockImplementation(() => {
      return {
        feature: {
          geometry: {
            getPoint: jest.fn(),
            paths: [[[2, 2], [3, 3]]]
          }
        }
      }
    })
  }
}, { virtual: true })
jest.mock('esri/widgets/Sketch/SketchViewModel', () => {
  return {
    default: jest.fn().mockImplementation((args) => {
      return {
        ...args,
        destroyed: false,
        on: jest.fn(),
        set: jest.fn(),
        update: jest.fn(),
        create: jest.fn(),
        cancel: jest.fn(),
        complete: jest.fn(),
        destroy: jest.fn(function () {
          this.destroyed = true
        })
      }
    })
  }
}, { virtual: true })
jest.mock('esri/Color', () => {
  return {
    default: jest.fn().mockImplementation(() => {
      return {
        toRgba: () => (null)
      }
    })
  }
}, { virtual: true })
jest.mock('esri/layers/GraphicsLayer', () => {
  return {
    default: jest.fn().mockImplementation(() => {
      return {
        graphics: {
          add: (e: any) => { return e },
          items: []
        },
        removeAll: () => (null),
        destroy: () => (null),
        add: () => (null),
        set: () => (null)
      }
    })
  }
}, { virtual: true })
jest.mock('esri/layers/FeatureLayer', () => {
  return {
    default: jest.fn().mockImplementation(() => {
      return {
        removeAll: () => (null),
        destroy: () => (null)
      }
    })
  }
}, { virtual: true })
jest.mock('esri/geometry/Point', () => { return {} }, { virtual: true })
jest.mock('esri/geometry/Extent', () => {
  return {
    default: jest.fn().mockImplementation((e) => {
      return e
    })
  }
}, { virtual: true })
jest.mock('esri/rest/support/Query', () => { return {} }, { virtual: true })
jest.mock('esri/rest/query', () => { return {} }, { virtual: true })
jest.mock('esri/geometry/operators/simplifyOperator', () => {
  return {
    isSimple: (geom) => { return true },
    execute: (geom) => { return geom }
  }
}, { virtual: true })
jest.mock('esri/geometry/operators/intersectionOperator', () => {
  return {
    isSimple: (geom) => { return true },
    execute: (geom1, geom2) => { return geom1 },
    executeMany: ([geom], geom1) => { return [geom] }
  }
}, { virtual: true })
jest.mock('esri/geometry/operators/intersectsOperator', () => {
  return {
    execute: (geom1, geom2) => { return true }
  }
}, { virtual: true })
jest.mock('esri/geometry/operators/equalsOperator', () => {
  return {
    execute: (geom1, geom2) => { return false }
  }
}, { virtual: true })
jest.mock('esri/geometry/operators/lengthOperator', () => {
  return {
    execute: (geom) => { return 2 }
  }
}, { virtual: true })
jest.mock('esri/geometry/operators/proximityOperator', () => {
  return {
    getNearestCoordinate: (geom, point) => { return point }
  }
}, { virtual: true })
jest.mock('esri/geometry/operators/geodeticLengthOperator', () => {
  return {
    isLoaded: () => (null),
    load: () => (null),
    execute: (geom) => { return 2 }
  }
}, { virtual: true })
jest.mock('esri/widgets/ElevationProfile/ElevationProfileViewModel', () => {
  return {
    default: jest.fn().mockImplementation(() => {
      return {
        destroy: () => (null),
        clear: () => (null)
      }
    })
  }
}, { virtual: true })
jest.mock('esri/analysis/ElevationProfileAnalysis', () => {
  return {
    default: jest.fn().mockImplementation(() => {
      return {
        profiles: [],
        geometry: null,
        input: null,
        view: null,
        destroy: jest.fn()
      }
    })
  }
}, { virtual: true })
jest.mock('esri/analysis/ElevationProfile/ElevationProfileLineGround', () => {
  return {
    default: jest.fn().mockImplementation((args) => args)
  }
}, { virtual: true })
jest.mock('esri/analysis/ElevationProfile/ElevationProfileLineQuery', () => {
  return {
    default: jest.fn().mockImplementation((args) => args)
  }
}, { virtual: true })
jest.mock('esri/analysis/ElevationProfile/ElevationProfileLineScene', () => {
  return {
    default: jest.fn().mockImplementation((args) => args)
  }
}, { virtual: true })
jest.mock('esri/analysis/ElevationProfile/ElevationProfileLineInput', () => {
  return {
    default: jest.fn().mockImplementation((args) => args)
  }
}, { virtual: true })
jest.mock('esri/core/reactiveUtils', () => {
  return {
    watch: jest.fn(),
    whenOnce: jest.fn().mockResolvedValue(undefined)
  }
}, { virtual: true })
jest.mock('esri/layers/ElevationLayer', () => { return {} }, { virtual: true })
jest.mock('esri/symbols/support/jsonUtils', () => {
  return {
    fromJSON: (sym) => { return {} }
  }
}, { virtual: true })
jest.mock('esri/geometry/Polyline', () => { return {} }, { virtual: true })
jest.mock('esri/geometry/SpatialReference', () => { return {} }, { virtual: true })
jest.mock('esri/core/promiseUtils', () => {
  return {
    isAbortError: jest.fn().mockReturnValue(false)
  }
}, { virtual: true })

const defaultElevationLayerSettings = {
  id: '',
  useDataSource: null,
  label: '',
  elevationLayerUrl: '',
  style: {
    lineType: 'solid-line',
    lineColor: '#808080',
    lineThickness: 3
  },
  displayStatistics: false,
  selectedStatistics: []
}

const volumetricObjId = getUniqueElevationLayersId()

const commonConfig = {
  useMapWidget: false,
  activeDataSource: 'default',
  generalSettings: {
    allowExport: true,
    isSelectToolActive: false,
    isDrawToolActive: false,
    showGridAxis: true,
    showAxisTitles: false,
    showLegend: true,
    buttonStyle: 'ICONTEXT'
  },
  configInfo: {
    default: {
      elevationLayersSettings: {
        addedElevationLayers: [defaultElevationLayerSettings],
        groundLayerId: '',
        linearUnit: '',
        elevationUnit: '',
        showVolumetricObjLineInGraph: false,
        volumetricObjSettingsOptions: {
          id: volumetricObjId,
          style: {
            lineType: 'solid-line',
            lineColor: '#cf4ccf',
            lineThickness: 3
          },
          volumetricObjLabel: defaultMessages.volumetricObjectsLabel,
          displayStatistics: true,
          selectedStatistics: []
        }
      }
    }
  }
}

//Since Surfaces are not available in mock theme we are overriding it
const theme = {
  ...mockTheme,
  surfaces: [{ bg: '#fff' }, { bg: '#fff' }]
} as unknown as IMThemeVariables

describe('Validate availability of Draw and Select tool depending on available data sources and selectable line layers', () => {
  it('If the map is not selected through selector or None is selected then widget placeholder should be shown', function () {
    const { queryByTestId } = render(<Widget theme={theme} config={commonConfig} layouts={{} as any} />)
    expect(queryByTestId('widgetPlaceholder')).toBeInTheDocument()
  })

  it('If the map is selected through a selector and no web map/scene is found in the Map widget then only the Draw tool should be available.', async function () {
    const widgetId = 'widget_1'
    ensureWidgetRuntimeState(widgetId)
    const useMapWidgetId: ImmutableArray<string> = Immutable(['widget_1'])
    const config = {
      ...commonConfig,
      useMapWidget: true,
      activeDataSource: 'default',
      configInfo: {
        default: {
          profileSettings: {
            isProfileSettingsEnabled: false,
            isCustomizeOptionEnabled: false,
            layers: [],
            selectionModeOptions: {
              selectionMode: 'multiple',
              style: {
                lineType: 'dotted-line',
                lineColor: '#fcfc03',
                lineThickness: 3
              }
            }
          },
          assetSettings: {
            isAssetSettingsEnabled: false,
            layers: [],
            assetIntersectingBuffer: {
              enabled: false,
              bufferDistance: 10,
              bufferUnits: '',
              bufferSymbol: {
                type: 'esriSFS',
                color: [239, 132, 38, 128],
                outline: {
                  type: 'esriSLS',
                  color: [184, 115, 59, 255],
                  width: 1.5,
                  style: 'esriSLSSolid'
                },
                style: 'esriSFSSolid'
              }
            }
          }
        }
      }
    }
    const ref: { current: HTMLElement } = { current: null }
    const Widget = wrapWidget(ElevationProfileWidget as any, { theme: mockTheme, ref } as any)
    const { queryByTestId, getByTestId } = render(<Widget id={widgetId} useMapWidgetIds={useMapWidgetId} theme={theme} config={config} layouts={{} as any} />)
    const jimuMapview = {
      dataSourceId: 'dataSource_1',
      mapWidgetId: 'widget_2',
      maxLayerIndex: 2,
      view: {
        type: '2d',
        goTo: jest.fn(),
        on: jest.fn(),
        hitTest: jest.fn().mockResolvedValue({ results: [] }),
        analyses: {
          add: jest.fn(),
          remove: jest.fn()
        },
        whenAnalysisView: jest.fn().mockResolvedValue({ progress: 1, results: [], analysis: { clear: jest.fn() }, effectiveDisplayUnits: { distance: 'feet', elevation: 'feet' } }),
        map: {
          add: jest.fn(),
          addMany: jest.fn(),
          layers: { toArray: () => [] },
          findLayerById: jest.fn(),
          ground: { opacity: 1 }
        }
      },
      whenAllJimuLayerViewLoaded: jest.fn().mockResolvedValue(undefined),
      clearSelectedFeatures: jest.fn(),
      addJimuLayerViewRemovedListener: jest.fn()
    }
    await (ref.current as any).activeViewChangeHandler(jimuMapview)
    await waitFor(() => {
      expect(queryByTestId('drawButton')).toBeInTheDocument()
      expect(getByTestId('drawButton')).toHaveClass('front-section')
      expect(getByTestId('selectButton')).toHaveClass('hidden')
    })
  })

  it('Only show draw tool if there are no selectable lines in the map/scene.', async function () {
    const widgetId = 'widget_1'
    ensureWidgetRuntimeState(widgetId)
    const useMapWidgetId: ImmutableArray<string> = Immutable(['widget_1'])
    const config = {
      ...commonConfig,
      useMapWidget: true,
      activeDataSource: 'dataSource_1',
      configInfo: {
        dataSource_1: {
          profileSettings: {
            isProfileSettingsEnabled: false,
            isCustomizeOptionEnabled: false,
            layers: [],
            selectionModeOptions: {
              selectionMode: 'multiple',
              style: {
                lineType: 'dotted-line',
                lineColor: '#fcfc03',
                lineThickness: 3
              }
            }
          },
          assetSettings: {
            isAssetSettingsEnabled: false,
            layers: [],
            assetIntersectingBuffer: {
              enabled: false,
              bufferDistance: 10,
              bufferUnits: '',
              bufferSymbol: {
                type: 'esriSFS',
                color: [239, 132, 38, 128],
                outline: {
                  type: 'esriSLS',
                  color: [184, 115, 59, 255],
                  width: 1.5,
                  style: 'esriSLSSolid'
                },
                style: 'esriSFSSolid'
              }
            }
          }
        }
      }
    }
    const jimuMapview = {
      dataSourceId: 'dataSource_1',
      mapWidgetId: 'widget_2',
      maxLayerIndex: 2,
      view: {
        type: '2d',
        goTo: jest.fn(),
        on: jest.fn(),
        hitTest: jest.fn().mockResolvedValue({ results: [] }),
        analyses: {
          add: jest.fn(),
          remove: jest.fn()
        },
        whenAnalysisView: jest.fn().mockResolvedValue({ progress: 1, results: [], analysis: { clear: jest.fn() }, effectiveDisplayUnits: { distance: 'feet', elevation: 'feet' } }),
        map: {
          add: jest.fn(),
          addMany: jest.fn(),
          layers: { toArray: () => [] },
          findLayerById: jest.fn(),
          ground: { opacity: 1 }
        }
      },
      whenAllJimuLayerViewLoaded: jest.fn().mockResolvedValue(undefined),
      clearSelectedFeatures: jest.fn(),
      addJimuLayerViewRemovedListener: jest.fn()
    }
    const ref: { current: HTMLElement } = { current: null }
    const Widget = wrapWidget(ElevationProfileWidget as any, { theme: mockTheme, ref } as any)
    const { getByTestId } = render(<Widget id={widgetId} useMapWidgetIds={useMapWidgetId} theme={theme} config={config} layouts={{} as any} />)
    await (ref.current as any).activeViewChangeHandler(jimuMapview)
    await waitFor(() => {
      expect(getByTestId('drawButton')).toHaveClass('front-section')
      expect(getByTestId('selectButton')).toHaveClass('hidden')
    })
  })
})

describe('Validate output datasource', function () {
  it('Validate output data source is updated, along with units, when units are changed', function () {
    const useMapWidgetId: ImmutableArray<string> = Immutable(['widget_1'])
    const config = {
      useMapWidget: true,
      activeDataSource: 'default',
      configInfo: {
        default: {
          elevationLayersSettings: {
            linearUnit: 'meters',
            elevationUnit: 'kilometers'
          }
        }
      }
    }
    const mockProfileResult = {
      effectiveUnits: {
        distance: 'feet',
        elevation: 'feet'
      },
      statistics: {
        maxDistance: 44.62399383527127,
        minElevation: 184.65636384069427,
        maxElevation: 186.96316218884527,
        avgElevation: 185.890602259591,
        elevationGain: 2.306798348150997,
        elevationLoss: 0,
        maxPositiveSlope: 2.295458596162128,
        maxNegativeSlope: null,
        avgPositiveSlope: 2.295458596162128,
        avgNegativeSlope: null
      }
    }
    const ref: { current: HTMLElement } = { current: null }
    const Widget = wrapWidget(ElevationProfileWidget as any, { theme: mockTheme, ref } as any)
    void render(<Widget useMapWidgetIds={useMapWidgetId} theme={theme} config={config} layouts={{} as any} />)

    // Mock the _analysisView property with effectiveDisplayUnits
    const analysisView = {
      effectiveDisplayUnits: {
        distance: 'feet',
        elevation: 'feet'
      }
    };
    (ref.current as any)._analysisView = analysisView

    const statsResultMetersKms = (ref.current as any).outputStatisticsValueDisplay(
      mockProfileResult,
      config.configInfo.default.elevationLayersSettings.elevationUnit,
      config.configInfo.default.elevationLayersSettings.linearUnit,
      false
    )
    expect(statsResultMetersKms).toHaveLength(10)
    expect(statsResultMetersKms[0]).toHaveProperty('statName')
    expect(statsResultMetersKms[0]).toHaveProperty('statValue')

    // Update _analysisView for miles test
    const analysisViewMiles = {
      effectiveDisplayUnits: {
        distance: 'miles',
        elevation: 'kilometers'
      }
    };
    (ref.current as any)._analysisView = analysisViewMiles
    const statsResultMilesKms = (ref.current as any).outputStatisticsValueDisplay(
      mockProfileResult,
      'kilometers',
      'miles',
      false
    )
    expect(statsResultMilesKms).toHaveLength(10)
    expect(statsResultMilesKms[0]).toHaveProperty('statName')
    expect(statsResultMilesKms[0]).toHaveProperty('statValue')
  })
})

describe('Validate buffer', function () {
  it('When buffer is enabled, valid buffer is generated', async function () {
    const useMapWidgetId: ImmutableArray<string> = Immutable(['widget_1'])
    const config = {
      useMapWidget: true,
      activeDataSource: 'default',
      configInfo: {
        default: {
          elevationLayersSettings: {
            linearUnit: 'meters',
            elevationUnit: 'kilometers'
          }
        }
      }
    }
    const ref: { current: HTMLElement } = { current: null }
    const Widget = wrapWidget(ElevationProfileWidget as any, { theme: mockTheme, ref } as any)
    render(<Widget useMapWidgetIds={useMapWidgetId} theme={theme} config={config} layouts={{} as any} />)

    const mockElevationProfileAnalysis = {
      geometry: {
        type: 'polyline',
        paths: [
          [[8155703.266454776, 2159222.1716818446], [8156030.25691993, 2159355.037278883]]
        ],
        spatialReference: {
          latestWkid: 3857,
          wkid: 102100,
          isGeographic: false,
          isWGS84: false,
          isWebMercator: true
        }
      },
      clear: jest.fn(),
      destroy: jest.fn()
    }
    ; (ref.current as any)._selectedBufferValues = {
      enabled: true,
      bufferDistance: 10,
      bufferUnits: 'feet',
      bufferSymbol: {}
    }
    ; (ref.current as any)._elevationProfileAnalysis = mockElevationProfileAnalysis
    ; (ref.current as any)._analysisView = {
      effectiveDisplayUnits: {
        distance: 'feet',
        elevation: 'feet'
      }
    }
    await (ref.current as any).createBufferGraphics()
    expect((ref.current as any)._bufferGraphics).not.toBe(null)
  })

  it('When buffer is disabled, buffer is not generated', async function () {
    const useMapWidgetId: ImmutableArray<string> = Immutable(['widget_1'])
    const config = {
      useMapWidget: true,
      activeDataSource: 'default',
      configInfo: {
        default: {
          elevationLayersSettings: {
            linearUnit: 'meters',
            elevationUnit: 'kilometers'
          }
        }
      }
    }
    const ref: { current: HTMLElement } = { current: null }
    const Widget = wrapWidget(ElevationProfileWidget as any, { theme: mockTheme, ref } as any)
    render(<Widget useMapWidgetIds={useMapWidgetId} theme={theme} config={config} layouts={{} as any} />)

    const mockElevationProfileAnalysis = {
      geometry: {
        type: 'polyline',
        paths: [
          [[8155703.266454776, 2159222.1716818446], [8156030.25691993, 2159355.037278883]]
        ]
      },
      clear: jest.fn(),
      destroy: jest.fn()
    }
    ; (ref.current as any)._selectedBufferValues = {
      enabled: false,
      bufferDistance: -1,
      bufferUnits: 'feet',
      bufferSymbol: {}
    }
    ; (ref.current as any)._elevationProfileAnalysis = mockElevationProfileAnalysis
    ; (ref.current as any)._analysisView = {
      effectiveDisplayUnits: {
        distance: 'feet',
        elevation: 'feet'
      }
    }
    await (ref.current as any).createBufferGraphics()
    expect((ref.current as any)._bufferGraphics).toBe(null)
  })
})

describe('Validate for volumetric objects', function () {
  it('Validate Volumetric Objects are read when enabled', function async () {
    const useMapWidgetId: ImmutableArray<string> = Immutable(['widget_1'])
    const config = {
      useMapWidget: true,
      activeDataSource: 'ds2',
      configInfo: {
        ds2: {
          elevationLayersSettings: {
            showVolumetricObjLineInGraph: true,
            volumetricObjSettingsOptions: {
              id: volumetricObjId,
              style: {
                lineType: 'solid-line',
                lineColor: '#cf4ccf',
                lineThickness: 3
              },
              volumetricObjLabel: defaultMessages.volumetricObjectsLabel,
              displayStatistics: true,
              selectedStatistics: []
            }
          }
        }
      }
    }
    const ref: { current: HTMLElement } = { current: null }
    const Widget = wrapWidget(ElevationProfileWidget as any, { theme: mockTheme, ref } as any)
    render(<Widget useMapWidgetIds={useMapWidgetId} theme={theme} config={config} layouts={{} as any} />)

    // Mock the JimuMapView with 3d scene type
    const mockJimuMapView = {
      view: {
        type: '3d'
      }
    }

    const updateViewProfile = (ref.current as any).checkForVolumetricObjects(mockJimuMapView)
    expect(updateViewProfile).not.toBe(null)
    expect(updateViewProfile).toHaveProperty('id')
    expect(updateViewProfile).toHaveProperty('color')
    expect(updateViewProfile).toHaveProperty('title')
  })

  it('Validate no visible profiles for volumetric objects when it is disabled', function async () {
    const useMapWidgetId: ImmutableArray<string> = Immutable(['widget_1'])
    const config = {
      useMapWidget: true,
      activeDataSource: 'ds2',
      configInfo: {
        ds2: {
          elevationLayersSettings: {
            showVolumetricObjLineInGraph: false,
            volumetricObjSettingsOptions: {
              id: volumetricObjId,
              style: {
                lineType: 'solid-line',
                lineColor: '#cf4ccf',
                lineThickness: 3
              },
              volumetricObjLabel: defaultMessages.volumetricObjectsLabel,
              displayStatistics: true,
              selectedStatistics: []
            }
          }
        }
      }
    }
    const ref: { current: HTMLElement } = { current: null }
    const Widget = wrapWidget(ElevationProfileWidget as any, { theme: mockTheme, ref } as any)
    render(<Widget useMapWidgetIds={useMapWidgetId} theme={theme} config={config} layouts={{} as any} />)
    // Mock the JimuMapView with 3d scene type
    const mockJimuMapView = {
      view: {
        type: '3d'
      }
    }

    const updateViewProfile = (ref.current as any).checkForVolumetricObjects(mockJimuMapView)
    expect(updateViewProfile).toBe(null)
  })
})

const style = {
  lineType: 'dotted-line',
  lineColor: '#fcfc03',
  lineThickness: 3
}

const mockDrawingLayer = new GraphicsLayer()

describe('Validate the highlight next selectable line option', function () {
  it('Should apply the highlight next selectable settings configured style to the next selectable graphics on the map (if next selectable option is enabled in config)', function async () {
    const config = {
      ...commonConfig,
      activeDataSource: 'dataSource_1',
      configInfo: {
        dataSource_1: {
          profileSettings: {
            selectionModeOptions: {
              selectionMode: 'multiple',
              style: style
            }
          }
        }
      }
    }
    const useMapWidgetId: ImmutableArray<string> = Immutable(['widget_1'])
    const ref: { current: HTMLElement } = { current: null }
    const Widget = wrapWidget(ElevationProfileWidget as any, { theme: mockTheme, ref } as any)
    render(<Widget useMapWidgetIds={useMapWidgetId} theme={theme} config={config} />)
    ; (ref.current as any).createDrawingLayers()
    ; (ref.current as any)._drawingLayer = mockDrawingLayer
    expect((ref.current as any).state.selectionModeOptions.selectionMode).toEqual(config.configInfo.dataSource_1.profileSettings.selectionModeOptions.selectionMode)
  })

  it('Should clear next selectable line graphic if next selectable option is disabled in config', function async () {
    const customConfig = {
      ...commonConfig,
      activeDataSource: 'dataSource_1',
      configInfo: {
        dataSource_1: {
          profileSettings: {
            selectionModeOptions: {
              selectionMode: 'single',
              style: style
            }
          }
        }
      }
    }
    const useMapWidgetId: ImmutableArray<string> = Immutable(['widget_1'])
    const ref: { current: HTMLElement } = { current: null }
    const Widget = wrapWidget(ElevationProfileWidget as any, { theme: mockTheme, ref } as any)
    render(<Widget useMapWidgetIds={useMapWidgetId} theme={theme} config={customConfig} />)
    ; (ref.current as any).createDrawingLayers()
    ; (ref.current as any)._drawingLayer = mockDrawingLayer
    expect((ref.current as any).state.selectionModeOptions.selectionMode).toEqual(customConfig.configInfo.dataSource_1.profileSettings.selectionModeOptions.selectionMode)
    expect((ref.current as any)._nextPossibleSelectionLayer.graphics.items).toHaveLength(0)
  })
})
