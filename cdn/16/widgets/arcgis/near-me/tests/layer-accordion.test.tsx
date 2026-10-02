import { appActions, DataSourceManager, getAppStore, Immutable, type IMThemeVariables, JimuMapViewStatus, React } from 'jimu-core'
import { wrapWidget, widgetRender, mockTheme, getInitState, getDefaultAppConfig, mockSystemJs } from 'jimu-for-test'
import '@testing-library/jest-dom'
import { waitFor } from '@testing-library/dom'
import LayerAccordion from '../src/runtime/components/layer-accordion'
import type { LayersInfo, SearchSettings, AnalysisSettings } from '../src/config'
import { AnalysisTypeName } from '../src/config'
import type { AoiGeometries } from '../src/runtime/components/aoi-tool'
import Graphic from 'esri/Graphic'
import { MapViewManager, type JimuMapView } from 'jimu-arcgis'
import { FontFamilyValue } from 'jimu-ui'

const mockMv: JimuMapView = {
    id: 'mock-map-view',
    mapWidgetId: 'widget_1',
    isActive: true,
    dataSourceId: 'ds-test-123',
    status: JimuMapViewStatus.Loaded,
    view: {
        type: '3d'
    },
    jimuMapViewGroups: {
        widget_1: {
            jimuMapViews: {
                map1: {
                    dataSourceId: 'ds-test-123'
                }
            }
        }
    },
    destroy: jest.fn()
} as any

// Mock WebAssembly to prevent WASM loading issues
Object.defineProperty(globalThis, 'WebAssembly', {
    value: {
        instantiate: jest.fn().mockResolvedValue({
            instance: {
                exports: {}
            }
        }),
        compile: jest.fn().mockResolvedValue({}),
        Module: jest.fn(),
        RuntimeError: Error
    },
    writable: true
})

beforeAll(() => {
    jest.clearAllMocks()

    // Update your jimu-arcgis mock to include the missing method
    jest.mock('jimu-arcgis', () => ({
        geometryUtils: {
            projectToSpatialReference: jest.fn((geometry, targetSpatialReference) => { return Promise.resolve(geometry) }),
            // Mock other geometry utility functions
            createBuffer: jest.fn((geometry, distance, unit) => Promise.resolve({
                type: 'polygon',
                rings: [[[0, 0], [1, 0], [1, 1], [0, 1], [0, 0]]],
                spatialReference: geometry.spatialReference || { wkid: 4326 }
            })),
        },
        // Data source utilities
        DataSourceManager: {
            getInstance: jest.fn(() => ({
                getDataSource: jest.fn((id) => ({
                    id: id,
                    type: 'feature-layer',
                    layer: {
                        id: id,
                        title: `Mock Layer ${id}`,
                        url: `https://mock.arcgis.com/rest/services/layer/${id}`,
                        queryFeatures: jest.fn().mockResolvedValue({
                            features: [],
                            fields: []
                        })
                    },
                    getLayerDefinition: jest.fn().mockResolvedValue({
                        name: `Mock Layer ${id}`,
                        fields: [],
                        geometryType: 'esriGeometryPoint'
                    })
                })),
                getDataSources: jest.fn(() => []),
                createDataSourceByWidgetConfig: jest.fn(),
            }))
        },

        // Map view utilities - Updated with missing methods
        JimuMapViewComponent: jest.fn().mockImplementation(({ onActiveViewChange, children }) => {
            const mockMapView = {
                view: {
                    type: 'map-view',
                    map: {
                        layers: {
                            add: jest.fn(),
                            remove: jest.fn(),
                            removeAll: jest.fn(),
                            items: []
                        }
                    },
                    graphics: {
                        add: jest.fn(),
                        remove: jest.fn(),
                        removeAll: jest.fn(),
                        items: []
                    },
                    goTo: jest.fn().mockResolvedValue(true),
                    when: jest.fn().mockResolvedValue(true),
                    on: jest.fn(() => ({ remove: jest.fn() })),
                    center: { longitude: 0, latitude: 0 },
                    zoom: 10,
                    scale: 100000,
                    extent: {
                        xmin: -1, ymin: -1, xmax: 1, ymax: 1,
                        spatialReference: { wkid: 4326 }
                    }
                },
                jimuMapView: {
                    id: 'mock-map-view',
                    view: {}, // Same as above view
                    isActive: true,
                    status: 'LOADED',
                    // Add the missing method
                    getAllJimuLayerViews: jest.fn(() => [
                        {
                            id: 'mock-layer-view-1',
                            layer: {
                                id: 'mock-layer-1',
                                title: 'Mock Layer 1',
                                type: 'feature'
                            },
                            view: {
                                layer: {
                                    id: 'mock-layer-1',
                                    title: 'Mock Layer 1'
                                }
                            }
                        }
                    ]),
                    getJimuLayerViewByAPILayer: jest.fn((layer) => ({
                        id: `mock-layer-view-${layer.id}`,
                        layer: layer,
                        view: { layer: layer }
                    })),
                    addLayer: jest.fn(),
                    removeLayer: jest.fn(),
                    whenJimuLayerViewLoaded: jest.fn().mockResolvedValue({
                        id: 'mock-layer-view',
                        layer: { id: 'mock-layer', title: 'Mock Layer' }
                    })
                }
            }

            // Simulate calling onActiveViewChange when component mounts
            React.useEffect(() => {
                if (onActiveViewChange) {
                    onActiveViewChange(mockMapView.jimuMapView)
                }
                // eslint-disable-next-line react-hooks/exhaustive-deps
            }, [onActiveViewChange])
            return React.createElement('div', { 'data-testid': 'jimu-map-view' }, children)
        }),

        // Map view context - Updated with missing methods
        MapViewManager: {
            getInstance: jest.fn(() => ({
                getJimuMapViewById: jest.fn((id) => ({
                    id: id,
                    view: {
                        type: 'map-view',
                        map: {
                            layers: { add: jest.fn(), remove: jest.fn(), items: [] }
                        },
                        graphics: { add: jest.fn(), remove: jest.fn(), items: [] },
                        goTo: jest.fn().mockResolvedValue(true)
                    },
                    isActive: true,
                    status: 'LOADED',
                    // Add the missing method here too
                    getAllJimuLayerViews: jest.fn(() => [
                        {
                            id: 'mock-layer-view-1',
                            layer: {
                                id: 'mock-layer-1',
                                title: 'Mock Layer 1',
                                type: 'feature'
                            },
                            view: {
                                layer: {
                                    id: 'mock-layer-1',
                                    title: 'Mock Layer 1'
                                }
                            }
                        }
                    ]),
                    getJimuLayerViewByAPILayer: jest.fn((layer) => ({
                        id: `mock-layer-view-${layer.id}`,
                        layer: layer,
                        view: { layer: layer }
                    })),
                    addLayer: jest.fn(),
                    removeLayer: jest.fn(),
                    whenJimuLayerViewLoaded: jest.fn().mockResolvedValue({
                        id: 'mock-layer-view',
                        layer: { id: 'mock-layer', title: 'Mock Layer' }
                    })
                })),
                getAllJimuMapViews: jest.fn(() => []),
                publishJimuMapView: jest.fn()
            }))
        },
    }), { virtual: true })

    const dss = {
        id: 'dataSource_1',
        layer: {
            id: 'dataSource_1',
            title: 'Layer 1',
            getLayerDefinition: jest.fn().mockReturnValue({
                geometryType: 'esriGeometryLine'
            }),
            type: 'feature'
        },
        getLabel: jest.fn().mockReturnValue('Layer 1'),
        getIdField: jest.fn().mockReturnValue('OBJECTID'),
        query: jest.fn().mockResolvedValue({
            records: []
        }),
        getSchema: jest.fn().mockReturnValue(Promise.resolve({
            fields: [
                { name: 'OBJECTID', type: 'esriFieldTypeOID' },
                { name: 'GlobalID', type: 'esriFieldTypeGlobalID' },
                { name: 'like_field', type: 'esriFieldTypeString' },
                { name: 'dislike_field', type: 'esriFieldTypeString' },
                { name: 'creation_date', type: 'esriFieldTypeDate' },
                { name: 'Name', type: 'esriFieldTypeString' }
            ]
        })),
        getChildDataSources: jest.fn().mockReturnValue([]),
        isDataSourceSet: jest.fn().mockReturnValue(false),
        getGeometryType: jest.fn().mockReturnValue('esriGeometryPolygon'),
        getLayerDefinition: jest.fn().mockReturnValue({
            geometryType: 'esriGeometryLine'
        }),
        getDataSourceJson: jest.fn().mockReturnValue({
            isOutputFromWidget: true
        }),
        getMainDataSource: jest.fn().mockReturnValue({
            getDataView: jest.fn((viewId) => ({
                id: viewId,
                label: 'Output Data View',
                getLabel: jest.fn(() => 'Output Data View Label'),
                getLayerDefinition: jest.fn().mockReturnValue({
                    geometryType: 'esriGeometryLine'
                }),
                getDataSourceJson: jest.fn().mockReturnValue({
                    isOutputFromWidget: true
                }),
                getGeometryType: jest.fn().mockReturnValue('esriGeometryLine')
            })),
            getDataSourceJson: jest.fn().mockReturnValue({
                isOutputFromWidget: true
            }),
            getGeometryType: jest.fn().mockReturnValue('esriGeometryLine')
        })
    }
    const mockFnGetDataSource = jest.fn().mockImplementation(() => {
        return dss
    })
    DataSourceManager.getInstance().getDataSource = mockFnGetDataSource
    MapViewManager.getInstance().setJimuMapView(mockMv)
})

// Mock ArcGIS core workers and WASM modules
jest.mock('esri/core/workers/workers', () => ({}), { virtual: true })

jest.mock('@arcgis/core/chunks/pe-wasm.js', () => ({
    __esModule: true,
    default: {},
    load: jest.fn().mockResolvedValue(true)
}), { virtual: true })

jest.mock('esri/geometry/operators/unionOperator', () => ({
    __esModule: true,
    default: {
        execute: jest.fn().mockReturnValue({}),
        isLoaded: jest.fn().mockReturnValue(true),
        load: jest.fn().mockResolvedValue(true)
    },
    execute: jest.fn().mockReturnValue({}),
    isLoaded: jest.fn().mockReturnValue(true),
    load: jest.fn().mockResolvedValue(true)
}), { virtual: true })

jest.mock('esri/geometry/operators/equalsOperator', () => ({
    __esModule: true,
    default: {
        execute: jest.fn().mockReturnValue(true),
        isLoaded: jest.fn().mockReturnValue(true),
        load: jest.fn().mockResolvedValue(true)
    },
    execute: jest.fn().mockReturnValue(true),
    isLoaded: jest.fn().mockReturnValue(true),
    load: jest.fn().mockResolvedValue(true)
}), { virtual: true })

jest.mock('esri/geometry/operators/intersectionOperator', () => ({
    __esModule: true,
    default: {
        execute: jest.fn().mockReturnValue({}),
        isLoaded: jest.fn().mockReturnValue(true),
        load: jest.fn().mockResolvedValue(true)
    },
    execute: jest.fn().mockReturnValue({}),
    isLoaded: jest.fn().mockReturnValue(true),
    load: jest.fn().mockResolvedValue(true)
}), { virtual: true })

jest.mock('esri/geometry/operators/geodeticAreaOperator', () => ({
    __esModule: true,
    default: {
        execute: jest.fn().mockReturnValue(1000),
        isLoaded: jest.fn().mockReturnValue(true),
        load: jest.fn().mockResolvedValue(true)
    },
    execute: jest.fn().mockReturnValue(1000),
    isLoaded: jest.fn().mockReturnValue(true),
    load: jest.fn().mockResolvedValue(true)
}), { virtual: true })

jest.mock('esri/geometry/operators/areaOperator', () => ({
    __esModule: true,
    default: {
        execute: jest.fn().mockReturnValue(1000),
        isLoaded: jest.fn().mockReturnValue(true),
        load: jest.fn().mockResolvedValue(true)
    },
    execute: jest.fn().mockReturnValue(1000),
    isLoaded: jest.fn().mockReturnValue(true),
    load: jest.fn().mockResolvedValue(true)
}), { virtual: true })

jest.mock('esri/geometry/operators/geodeticLengthOperator', () => ({
    __esModule: true,
    default: {
        execute: jest.fn().mockReturnValue(100),
        isLoaded: jest.fn().mockReturnValue(true),
        load: jest.fn().mockResolvedValue(true)
    },
    execute: jest.fn().mockReturnValue(100),
    isLoaded: jest.fn().mockReturnValue(true),
    load: jest.fn().mockResolvedValue(true)
}), { virtual: true })

jest.mock('esri/geometry/operators/geodesicProximityOperator', () => ({
    __esModule: true,
    default: {
        execute: jest.fn().mockReturnValue([100]),
        isLoaded: jest.fn().mockReturnValue(true),
        load: jest.fn().mockResolvedValue(true)
    },
    execute: jest.fn().mockReturnValue([100]),
    isLoaded: jest.fn().mockReturnValue(true),
    load: jest.fn().mockResolvedValue(true)
}), { virtual: true })

jest.mock('esri/geometry/operators/lengthOperator', () => ({
    __esModule: true,
    default: {
        execute: jest.fn().mockReturnValue(100),
        isLoaded: jest.fn().mockReturnValue(true),
        load: jest.fn().mockResolvedValue(true)
    },
    execute: jest.fn().mockReturnValue(100),
    isLoaded: jest.fn().mockReturnValue(true),
    load: jest.fn().mockResolvedValue(true)
}), { virtual: true })

// Mock geometry engine to prevent WASM issues
jest.mock('esri/geometry/geometryEngine', () => ({
    buffer: jest.fn().mockReturnValue({}),
    intersects: jest.fn().mockReturnValue(true),
    distance: jest.fn().mockReturnValue(100),
    geodesicBuffer: jest.fn().mockReturnValue({})
}), { virtual: true })


jest.mock('esri/widgets/Sketch/SketchViewModel', () => ({
    default: jest.fn().mockImplementation((options = {}) => ({
        view: options.view || null,
        layer: options.layer || null,
        pointSymbol: options.pointSymbol || null,
        polylineSymbol: options.polylineSymbol || null,
        polygonSymbol: options.polygonSymbol || null,
        activeTool: null,
        state: 'ready',

        // Methods
        create: jest.fn(function (tool) {
            this.activeTool = tool
            this.state = 'active'
        }),
        complete: jest.fn(function () {
            this.state = 'complete'
        }),
        cancel: jest.fn(function () {
            this.state = 'ready'
            this.activeTool = null
        }),
        reset: jest.fn(function () {
            this.state = 'ready'
            this.activeTool = null
        }),

        // Event handling
        on: jest.fn((eventName, callback) => ({
            remove: jest.fn()
        })),

        // Properties that can be set
        set: jest.fn(function (property, value) {
            this[property] = value
        }),

        destroyed: false,
        destroy: jest.fn(function () {
            this.destroyed = true
        })
    }))
}), { virtual: true })

jest.mock('esri/Color', () => ({
    default: jest.fn().mockImplementation((color = '#000000') => {
        // Handle different color input formats
        let r = 0; let g = 0; let b = 0; let a = 1
        if (typeof color === 'string') {
            // Handle hex colors
            if (color.startsWith('#')) {
                const hex = color.slice(1)
                r = parseInt(hex.substr(0, 2), 16) || 0
                g = parseInt(hex.substr(2, 2), 16) || 0
                b = parseInt(hex.substr(4, 2), 16) || 0
                a = hex.length > 6 ? parseInt(hex.substr(6, 2), 16) / 255 : 1
            }
        } else if (Array.isArray(color)) {
            // Handle [r, g, b, a] format
            r = color[0] || 0
            g = color[1] || 0
            b = color[2] || 0
            a = color[3] !== undefined ? color[3] / 255 : 1
        }
        return {
            r,
            g,
            b,
            a,
            toHex: jest.fn(() => `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`),
            toRgb: jest.fn(() => `rgb(${r}, ${g}, ${b})`),
            toRgba: jest.fn(() => `rgba(${r}, ${g}, ${b}, ${a})`),
            // eslint-disable-next-line new-cap
            clone: jest.fn(() => new (jest.requireMock('esri/Color').default)([r, g, b, a * 255])),
            setColor: jest.fn(function (newColor) {
                // eslint-disable-next-line new-cap
                const newColorObj = new (jest.requireMock('esri/Color').default)(newColor)
                this.r = newColorObj.r
                this.g = newColorObj.g
                this.b = newColorObj.b
                this.a = newColorObj.a
            })
        }
    })
}), { virtual: true })

jest.mock('esri/symbols/support/jsonUtils', () => ({
    fromJSON: jest.fn((symbolJson) => {
        if (!symbolJson) return null
        // Return a mock symbol object based on the JSON
        return {
            type: symbolJson.type || 'simple-marker',
            color: symbolJson.color || [0, 0, 0, 255],
            outline: symbolJson.outline || { color: [0, 0, 0, 255], width: 1 },
            size: symbolJson.size || 12,
            style: symbolJson.style || 'solid',
            width: symbolJson.width || 1,
            clone: jest.fn().mockReturnThis(),
            toJSON: jest.fn().mockReturnValue(symbolJson)
        }
    }),
    toJSON: jest.fn((symbol) => {
        if (!symbol) return null
        return {
            type: symbol.type || 'simple-marker',
            color: symbol.color || [0, 0, 0, 255],
            outline: symbol.outline,
            size: symbol.size,
            style: symbol.style,
            width: symbol.width
        }
    })
}), { virtual: true })
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

jest.mock('esri/layers/GraphicsLayer', () => ({
    default: jest.fn().mockImplementation(() => ({
        graphics: {
            add: jest.fn(),
            remove: jest.fn(),
            removeAll: jest.fn(),
            items: [],
            length: 0
        },
        removeAll: jest.fn(),
        destroy: jest.fn(),
        add: jest.fn(),
        visible: true,
        opacity: 1
    }))
}), { virtual: true })


jest.mock('esri/geometry/SpatialReference', () => ({
    default: jest.fn().mockImplementation((options = {}) => ({
        wkid: options.wkid || 4326,
        wkt: options.wkt || null,
        latestWkid: options.latestWkid || options.wkid || 4326,
        isWGS84: options.wkid === 4326 || options.latestWkid === 4326,
        isWebMercator: options.wkid === 3857 || options.latestWkid === 3857,
        isGeographic: options.wkid === 4326 || options.latestWkid === 4326,
        unit: options.unit || 'meter',
        clone: jest.fn().mockReturnThis(),
        equals: jest.fn().mockReturnValue(true),
        toJSON: jest.fn().mockReturnValue({
            wkid: options.wkid || 4326,
            latestWkid: options.latestWkid || options.wkid || 4326
        })
    }))
}), { virtual: true })

jest.mock('esri/rest/locator', () => ({
    locationToAddress: jest.fn().mockResolvedValue({
        address: '123 Main St, City, State 12345',
        attributes: {},
        location: {
            type: 'point',
            x: -118.2437,
            y: 34.0522,
            spatialReference: { wkid: 4326 }
        },
        score: 100
    }),
    addressToLocations: jest.fn().mockResolvedValue([{
        address: '123 Main St, City, State 12345',
        attributes: {},
        extent: {
            xmin: -118.2447,
            ymin: 34.0512,
            xmax: -118.2427,
            ymax: 34.0532,
            spatialReference: { wkid: 4326 }
        },
        location: {
            type: 'point',
            x: -118.2437,
            y: 34.0522,
            spatialReference: { wkid: 4326 }
        },
        score: 100
    }]),
    suggest: jest.fn().mockResolvedValue([{
        text: 'Suggested Address',
        magicKey: 'mock-magic-key',
        isCollection: false
    }])
}), { virtual: true })

jest.mock('esri/widgets/Features', () => ({
    default: jest.fn().mockImplementation(() => ({
        features: [],
        selectedFeatureIndex: 0,
        viewModel: {
            features: [],
            selectedFeatureIndex: 0
        },
        open: jest.fn(function (options) {
            this.features = options?.features || []
            this.selectedFeatureIndex = 0
            return Promise.resolve()
        }),
        close: jest.fn(),
        destroy: jest.fn(),
        when: jest.fn().mockResolvedValue(true)
    }))
}), { virtual: true })
jest.mock('esri/geometry/Polygon', () => ({
    default: jest.fn().mockImplementation((options) => ({
        type: 'polygon',
        rings: options?.rings || [[[0, 0], [1, 0], [1, 1], [0, 1], [0, 0]]],
        spatialReference: options?.spatialReference || { wkid: 4326 },
        hasZ: options?.hasZ || false,
        hasM: options?.hasM || false,
        cache: {},
        extent: {
            xmin: 0,
            ymin: 0,
            xmax: 1,
            ymax: 1,
            spatialReference: { wkid: 4326 }
        },
        // Common polygon methods
        clone: jest.fn().mockReturnValue({
            type: 'polygon',
            rings: options?.rings || [[[0, 0], [1, 0], [1, 1], [0, 1], [0, 0]]],
            spatialReference: options?.spatialReference || { wkid: 4326 },
            hasZ: options?.hasZ || false,
            hasM: options?.hasM || false
        }),
        toJSON: jest.fn().mockReturnValue({
            rings: options?.rings || [[[0, 0], [1, 0], [1, 1], [0, 1], [0, 0]]],
            spatialReference: options?.spatialReference || { wkid: 4326 }
        }),
        addRing: jest.fn(),
        removeRing: jest.fn(),
        insertRing: jest.fn(),
        getPoint: jest.fn().mockReturnValue({
            type: 'point',
            x: 0.5,
            y: 0.5,
            spatialReference: { wkid: 4326 }
        }),
        setPoint: jest.fn(),
        getCentroid: jest.fn().mockReturnValue({
            type: 'point',
            x: 0.5,
            y: 0.5,
            spatialReference: { wkid: 4326 }
        })
    }))
}), { virtual: true })
jest.mock('esri/Graphic', () => ({
    default: jest.fn().mockImplementation((options) => ({
        geometry: options?.geometry || {
            type: 'point',
            x: 0,
            y: 0,
            spatialReference: { wkid: 4326 }
        },
        attributes: options?.attributes || {},
        symbol: options?.symbol || null,
        popupTemplate: options?.popupTemplate || null
    }))
}), { virtual: true })

jest.mock('esri/core/reactiveUtils', () => ({
    watch: jest.fn((target, properties, callback) => ({
        remove: jest.fn()
    })),
    on: jest.fn((target, event, callback) => ({
        remove: jest.fn()
    })),
    when: jest.fn().mockResolvedValue(true)
}), { virtual: true })

jest.mock('esri/layers/FeatureLayer', () => ({
    default: jest.fn().mockImplementation(() => ({
        id: 'mock-feature-layer',
        title: 'Mock Feature Layer',
        visible: true,
        opacity: 1,
        removeAll: jest.fn(),
        destroy: jest.fn(),
        queryFeatures: jest.fn().mockResolvedValue({
            features: [],
            fields: []
        }),
        getFieldDomain: jest.fn().mockReturnValue(null),
        getField: jest.fn().mockReturnValue(null)
    }))
}), { virtual: true })

jest.mock('esri/widgets/FeatureForm', () => ({
    default: jest.fn().mockImplementation(() => ({
        feature: null,
        viewModel: {
            feature: null,
            layer: null
        },
        on: jest.fn(),
        destroy: jest.fn(),
        submit: jest.fn().mockResolvedValue(true)
    }))
}), { virtual: true })
// Rest of your existing mocks...
mockSystemJs()
getAppStore().dispatch(appActions.updateStoreState(getInitState().merge({ appConfig: getDefaultAppConfig() })))

// Mock ResizeObserver
window.ResizeObserver = jest.fn().mockImplementation(() => ({
    observe: jest.fn(),
    unobserve: jest.fn(),
    disconnect: jest.fn()
}))

// Mock fetch for any external resource loading
global.fetch = jest.fn(() =>
    Promise.resolve({
        ok: true,
        arrayBuffer: () => Promise.resolve(new ArrayBuffer(0))
    })
) as jest.Mock

// Mock LayersInfo for Proximity Analysis
const mockProximityLayersInfo: LayersInfo = {
    useDataSource: {
        dataSourceId: 'ds-test-123',
        mainDataSourceId: 'ds-test-123',
        dataViewId: 'view-test-123'
    },
    label: 'Test Proximity Layer',
    analysisInfo: {
        analysisId: 'proximity-analysis-1',
        analysisType: AnalysisTypeName.Proximity,
        displayField: 'NAME',
        sortFeaturesByDistance: true,
        sortFeatures: {
            sortFeaturesByField: 'NAME',
            sortFeaturesOrder: 'ASC'
        },
        groupFeaturesEnabled: false,
        groupFeatures: {
            groupFeaturesByField: '',
            groupFeaturesOrder: 'ASC',
            sortGroupsByCount: false,
            noValueGroupLabel: 'No Value'
        },
        subGroupFeatures: {
            subGroupFeaturesByField: '',
            subGroupFeaturesOrder: 'ASC',
            sortSubGroupsByCount: false,
            noValueSubGroupLabel: 'No Value'
        },
        highlightResultsOnMap: true,
        highlightColorOnMap: '#00ffff',
        expandOnOpen: true,
        expandFeatureDetails: true,
        returnIntersectedPolygons: false,
        clipFeatures: false,
        fieldsToExport: ['OBJECTID', 'NAME', 'TYPE'],
        includeApproxDistance: true,
        displayFeatureCount: true
    }
}

// Mock LayersInfo for Closest Analysis
const mockClosestLayersInfo: LayersInfo = {
    useDataSource: {
        dataSourceId: 'ds-test-456',
        mainDataSourceId: 'ds-test-456',
        dataViewId: 'view-test-456'
    },
    label: 'Test Closest Layer',
    analysisInfo: {
        analysisId: 'closest-analysis-1',
        analysisType: AnalysisTypeName.Closest,
        highlightResultsOnMap: true,
        highlightColorOnMap: '#ff00ff',
        expandOnOpen: true,
        returnIntersectedPolygons: false,
        fieldsToExport: ['OBJECTID', 'NAME'],
        includeApproxDistance: true,
        displayFeatureCount: true
    }
}

// Mock LayersInfo for Summary Analysis
const mockSummaryLayersInfo: LayersInfo = {
    useDataSource: {
        dataSourceId: 'ds-test-789',
        mainDataSourceId: 'ds-test-789',
        dataViewId: 'view-test-789'
    },
    label: 'Test Summary Layer',
    analysisInfo: {
        analysisId: 'summary-analysis-1',
        analysisType: AnalysisTypeName.Summary,
        isSingleColorMode: false,
        singleFieldColor: '#0079c1',
        selectedColorStrip: ['#0079c1', '#00c1ff', '#00ffd1'],
        summaryFields: [
            {
                fieldLabel: 'Total Count',
                fieldColor: '#0079c1',
                summaryFieldInfo: {
                    summaryBy: 'count',
                    showSeparator: true,
                    numberFormattingOption: 'none',
                    significantDigits: 2
                } as any
            }
        ],
        highlightResultsOnMap: false,
        highlightColorOnMap: '#ffff00',
        expandOnOpen: true,
        fieldsToExport: ['OBJECTID'],
        displayFeatureCount: true
    }
}

// Mock SearchSettings
const mockSearchSettings: SearchSettings = {
    headingLabel: 'Search Location',
    bufferDistance: 100,
    distanceUnits: 'meters',
    showDistanceSettings: true,
    sketchTools: {
        showPoint: true,
        showPolyline: true,
        showPolygon: true
    },
    activeToolWhenWidgetOpens: 'point',
    searchByActiveMapArea: false,
    includeFeaturesOutsideMapArea: false,
    headingLabelStyle: {
        fontFamily: FontFamilyValue.AVENIRNEXT,
        fontBold: false,
        fontItalic: false,
        fontUnderline: false,
        fontStrike: false,
        fontColor: '#000000',
        fontSize: '14px'
    },
    showInputAddress: true
}

// Mock AnalysisSettings
const mockAnalysisSettings: AnalysisSettings = {
    layersInfo: [mockProximityLayersInfo, mockClosestLayersInfo, mockSummaryLayersInfo],
    displayAnalysisIcon: true,
    displayMapSymbols: true,
    showDistFromInputLocation: true,
    onlyShowLayersResult: false,
    displayAllLayersResult: true,
    displayAllLayersResultOnMap: true,
    enableProximitySearch: true,
    saveFeatures: {
        saveInputLocation: false,
        pointFeature: {
            enabled: false,
            useDataSource: null
        },
        polylineFeature: {
            enabled: false,
            useDataSource: null
        },
        polygonFeature: {
            enabled: false,
            useDataSource: null
        },
        searchAreaFeature: {
            enabled: false,
            useDataSource: null
        }
    }
}

// Mock AoiGeometries
const mockAoiGeometries: AoiGeometries = {
    incidentGeometry: {
        type: 'point',
        x: -118.2437,
        y: 34.0522,
        spatialReference: { wkid: 4326 }
    } as any,
    incidentGeometry4326: {
        type: 'point',
        x: -118.2437,
        y: 34.0522,
        spatialReference: { wkid: 4326 }
    } as any,
    bufferGeometry: {
        type: 'polygon',
        rings: [[
            [-118.2450, 34.0530],
            [-118.2420, 34.0530],
            [-118.2420, 34.0510],
            [-118.2450, 34.0510],
            [-118.2450, 34.0530]
        ]],
        spatialReference: { wkid: 4326 }
    } as any,
    geodesicBuffer: {
        type: 'polygon',
        rings: [[
            [-118.2450, 34.0530],
            [-118.2420, 34.0530],
            [-118.2420, 34.0510],
            [-118.2450, 34.0510],
            [-118.2450, 34.0530]
        ]],
        spatialReference: { wkid: 4326 }
    } as any,
    distanceUnit: 'meters',
    bufferDistance: 100
}

// Mock JimuMapView
const mockMapView = {
    view: {
        spatialReference: { wkid: 102100 },
        extent: {
            center: {
                x: -13160000,
                y: 4040000
            }
        },
        map: {
            layers: {
                add: jest.fn(),
                remove: jest.fn()
            }
        }
    },
    dataSourceId: 'map-ds-1',
    id: 'map-view-1',
    isActive: true
} as any

// Mock incident graphic
const mockIncidentGraphic = new Graphic({
    geometry: {
        type: 'point',
        x: -118.2437,
        y: 34.0522,
        spatialReference: { wkid: 4326 }
    } as any,
    attributes: {
        OBJECTID: 1,
        NAME: 'Test Location'
    }
})

// Mock graphics layer
const mockGraphicsLayer = {
    type: 'graphics',
    graphics: {
        add: jest.fn(),
        remove: jest.fn(),
        removeAll: jest.fn()
    }
} as any

// Mock UseDataSource array
const mockUseDataSources = Immutable([
    {
        dataSourceId: 'ds-test-123',
        mainDataSourceId: 'ds-test-123',
        fields: ['OBJECTID', 'NAME', 'TYPE', 'ADDRESS']
    },
    {
        dataSourceId: 'ds-test-456',
        mainDataSourceId: 'ds-test-456',
        fields: ['OBJECTID', 'NAME', 'CATEGORY']
    },
    {
        dataSourceId: 'ds-test-789',
        mainDataSourceId: 'ds-test-789',
        fields: ['OBJECTID', 'STATUS', 'COUNT']
    }
])

// Theme setup
const theme = {
    ...mockTheme,
    surfaces: [{ bg: '#fff' }, { bg: '#fff' }]
} as unknown as IMThemeVariables

const render = widgetRender()

// Default mock props for LayerAccordion
const mockProximityProps = {
    theme,
    key: 1,
    widgetId: 'widget-test-123',
    analysisIcon: { icon: 'test-icon', size: 16 } as any,
    label: 'Test Proximity Analysis',
    featureCount: 25,
    isExpanded: true,
    isListView: false,
    children: [],
    onToggle: jest.fn(),
    selectRecord: jest.fn(),
    clearRecord: jest.fn(),
    highlightFeature: jest.fn(),
    onUpdateDataActionDataSet: jest.fn(),
    onUpdateProximityCountDataActionDataSet: jest.fn(),
    createHighlightGraphicsForLayer: jest.fn(),
    onAllFeaturesFetched: jest.fn(),
    onGroupSubGroupInfoUpdated: jest.fn(),
    onRemoveLayerAccordion: jest.fn(),
    index: 0,
    dsId: 'ds-test-123',
    analysisId: 'proximity-analysis-1',
    analysisType: AnalysisTypeName.Proximity,
    layerInfo: mockProximityLayersInfo,
    showExportButton: true,
    canToggle: true,
    mapView: mockMapView,
    searchSettings: mockSearchSettings,
    analysisSettings: mockAnalysisSettings,
    displayMapSymbol: true,
    aoiGeometries: mockAoiGeometries,
    folderUrl: 'https://example.com/folder',
    useDataSources: mockUseDataSources,
    incidentGraphic: mockIncidentGraphic,
    isReturnOneAnalysisResult: false,
    graphicLayer: mockGraphicsLayer,
    groupSubGroupFeaturesObj: null,
    whereClause: undefined,
    shouldRetrieveFeaturesOnLoad: false,
    idsToExclude: []
}

const mockClosestProps = {
    ...mockProximityProps,
    key: 2,
    label: 'Test Closest Analysis',
    featureCount: 1,
    dsId: 'ds-test-456',
    analysisId: 'closest-analysis-1',
    analysisType: AnalysisTypeName.Closest,
    layerInfo: mockClosestLayersInfo
}

describe('Return Intersected Polygons', () => {
    it('isReturnIntersectedPolygonsCase should return true when enabled from config and layer is polygon layer', async () => {
        const ref: { current: HTMLElement } = { current: null }
        const Widget = wrapWidget(LayerAccordion as any, { theme: mockTheme, ref } as any)
        const props = {
            ...mockProximityProps,
            layerInfo: {
                ...mockProximityProps.layerInfo,
                analysisInfo: {
                    ...mockProximityProps.layerInfo.analysisInfo,
                    returnIntersectedPolygons: true
                }
            }
        }
        render(<Widget {...props} theme={theme} />)
        await waitFor(() => {
            const isReturnIntersectedPolygonsCase = (ref.current as any).isReturnIntersectedPolygonsCase()
            expect(isReturnIntersectedPolygonsCase).toBe(true)
        }, { timeout: 100 })
    })
})

describe('Sorting Configuration', () => {
    it('Should return "distance" when sortFeaturesByDistance is enabled for proximity', () => {
        const ref: { current: HTMLElement } = { current: null }
        const Widget = wrapWidget(LayerAccordion as any, { theme: mockTheme, ref } as any)
        render(<Widget {...mockProximityProps} theme={theme} />)

        waitFor(() => {
            const sortingField = (ref.current as any).getConfiguredSortingField()
            expect(sortingField).toBe('distance')
        }, { timeout: 100 })
    })

    it('Should return "distance" for closest analysis', () => {
        const ref: { current: HTMLElement } = { current: null }
        const Widget = wrapWidget(LayerAccordion as any, { theme: mockTheme, ref } as any)
        render(<Widget {...mockClosestProps} theme={theme} />)

        waitFor(() => {
            const sortingField = (ref.current as any).getConfiguredSortingField()
            expect(sortingField).toBe('distance')
        }, { timeout: 100 })
    })

    it('Should return configured field when sortFeaturesByDistance is disabled', () => {
        const ref: { current: HTMLElement } = { current: null }
        const Widget = wrapWidget(LayerAccordion as any, { theme: mockTheme, ref } as any)
        const layerInfo = {
            ...mockProximityLayersInfo,
            analysisInfo: {
                ...mockProximityLayersInfo.analysisInfo,
                sortFeaturesByDistance: false
            }
        }
        const props = { ...mockProximityProps, layerInfo }
        render(<Widget {...props} theme={theme} />)

        waitFor(() => {
            const sortingField = (ref.current as any).getConfiguredSortingField()
            expect(sortingField).toBe('NAME')
        }, { timeout: 100 })
    })

    it('Should get sorted features according to field type and sort order', () => {
        const ref: { current: HTMLElement } = { current: null }
        const Widget = wrapWidget(LayerAccordion as any, { theme: mockTheme, ref } as any)
        const layerInfo = {
            ...mockProximityLayersInfo,
            analysisInfo: {
                ...mockProximityLayersInfo.analysisInfo,
                sortFeaturesByDistance: false,
                sortFeatures: {
                    sortFeaturesByField: 'NAME',
                    sortFeaturesOrder: 'DESC'
                }
            }
        }
        const props = { ...mockProximityProps, layerInfo }
        render(<Widget {...props} theme={theme} />)
        waitFor(() => {
            const features = [
                { attributes: { NAME: 'Alpha' } },
                { attributes: { NAME: 'Charlie' } },
                { attributes: { NAME: 'Bravo' } }
            ]
            const sortedFeatures = (ref.current as any).getSortedFeatures(features)
            expect(sortedFeatures[0].attributes.NAME).toBe('Charlie')
            expect(sortedFeatures[1].attributes.NAME).toBe('Bravo')
            expect(sortedFeatures[2].attributes.NAME).toBe('Alpha')
        }, { timeout: 100 })
    })

})

describe('Where Clause Generation', () => {
    it('Should generate correct where clause for string field', () => {
        const ref: { current: HTMLElement } = { current: null }
        const Widget = wrapWidget(LayerAccordion as any, { theme: mockTheme, ref } as any)
        const props = { ...mockProximityProps, groupSubGroupFeaturesObj: { field: 'TYPE', sortOrder: 'ASC', sortByCount: true, noValueLabel: 'Uncategorized' } }
        render(<Widget {...props} theme={theme} />)

        waitFor(() => {
            const group = { value: 'Commercial', fieldType: 'STRING' }
            const whereClause = (ref.current as any).getWhereClause(group, 'TYPE')
            expect(whereClause).toBe("TYPE = 'Commercial'")
        }, { timeout: 100 })
    })

    it('Should generate correct where clause for numeric field', () => {
        const ref: { current: HTMLElement } = { current: null }
        const Widget = wrapWidget(LayerAccordion as any, { theme: mockTheme, ref } as any)
        render(<Widget {...mockProximityProps} theme={theme} />)

        waitFor(() => {
            const group = { value: 123, fieldType: 'NUMBER' }
            const whereClause = (ref.current as any).getWhereClause(group, 'ID')
            expect(whereClause).toBe('ID = 123')
        }, { timeout: 100 })
    })

    it('Should generate correct where clause for null value', () => {
        const ref: { current: HTMLElement } = { current: null }
        const Widget = wrapWidget(LayerAccordion as any, { theme: mockTheme, ref } as any)
        render(<Widget {...mockProximityProps} theme={theme} />)

        waitFor(() => {
            const group = { value: null, fieldType: 'STRING' }
            const whereClause = (ref.current as any).getWhereClause(group, 'TYPE')
            expect(whereClause).toBe('TYPE IS NULL')
        }, { timeout: 100 })
    })

    it('Should generate correct where clause for null value', () => {
        const ref: { current: HTMLElement } = { current: null }
        const Widget = wrapWidget(LayerAccordion as any, { theme: mockTheme, ref } as any)
        const props = {
            ...mockProximityProps,
            whereClause: "TYPE = 'Commercial'",
            groupSubGroupFeaturesObj: { field: 'CATEGORY', sortOrder: 'DESC', sortByCount: false, noValueLabel: 'No Category' }
        }
        render(<Widget {...props} theme={theme} />)

        waitFor(() => {
            const group = { value: 'Retail', fieldType: 'STRING' }
            const whereClause = (ref.current as any).getWhereClause(group, 'CATEGORY')
            expect(whereClause).toContain("TYPE = 'Commercial'")
            expect(whereClause).toContain("CATEGORY = 'Retail'")
            expect(whereClause).toContain('AND')
        }, { timeout: 100 })
    })
})

describe('Calculate length and area', () => {
    it('Should calculate length using geodetic and planar operators based on spatial reference', () => {
        const ref: { current: HTMLElement } = { current: null }
        const Widget = wrapWidget(LayerAccordion as any, { theme: mockTheme, ref } as any)
        const props = { ...mockProximityProps, isExpanded: false }
        render(<Widget {...props} theme={theme} />)

        const featureRecords = [
            {
                feature: {
                    geometry: {
                        type: 'polyline',
                        spatialReference: { wkid: 4326, isWebMercator: false, isGeographic: true }
                    }
                }
            },
            {
                feature: {
                    geometry: {
                        type: 'polyline',
                        spatialReference: { wkid: 3857, isWebMercator: false, isGeographic: false }
                    }
                }
            }
        ] as any

        waitFor(() => {
            const result = (ref.current as any).getLength(featureRecords, null as any, 'meters')
            expect(result).toBe(200)
        }, { timeout: 100 })
    })

    it('Should calculate area using geodetic and planar operators based on spatial reference', () => {
        const ref: { current: HTMLElement } = { current: null }
        const Widget = wrapWidget(LayerAccordion as any, { theme: mockTheme, ref } as any)
        const props = { ...mockProximityProps, isExpanded: false }
        render(<Widget {...props} theme={theme} />)
        const featureRecords = [
            {
                feature: {
                    geometry: {
                        type: 'polygon',
                        spatialReference: { wkid: 4326, isWebMercator: false, isGeographic: true }
                    }
                }
            },
            {
                feature: {
                    geometry: {
                        type: 'polygon',
                        spatialReference: { wkid: 3857, isWebMercator: false, isGeographic: false }
                    }
                }
            }
        ] as any
        waitFor(() => {
            const result = (ref.current as any).getArea(featureRecords, null as any, 'meters')
            expect(result).toBe(2000)
        }, { timeout: 100 })
    })
})

describe('Closest Record Selection', () => {
    it('Should return closest record from multiple records', () => {
        const ref: { current: HTMLElement } = { current: null }
        const Widget = wrapWidget(LayerAccordion as any, { theme: mockTheme, ref } as any)
        const props = { ...mockProximityProps, isExpanded: false }
        render(<Widget {...props} theme={theme} />)

        waitFor(() => {
            const records = [
                {
                    feature: {
                        distance: 100,
                        geometry: { type: 'point', x: 0, y: 0 }
                    },
                    getFeature: jest.fn(() => ({ geometry: { type: 'point', x: 0, y: 0 } } as any))
                },
                {
                    feature: {
                        distance: 50,
                        geometry: { type: 'point', x: 1, y: 1 }
                    },
                    getFeature: jest.fn(() => ({ geometry: { type: 'point', x: 1, y: 1 } } as any))
                },
                {
                    feature: {
                        distance: 75,
                        geometry: { type: 'point', x: 2, y: 2 }
                    },
                    getFeature: jest.fn(() => ({ geometry: { type: 'point', x: 2, y: 2 } } as any))
                }
            ] as any
            const result = (ref.current as any).getClosestRecord(records)
            expect(result.length).toBe(1)
            expect(result[0].feature.distance).toBe(50)
        }, { timeout: 100 })
    })
})

describe('Plan Route Button Visibility', () => {
    it('Should show Plan Route when all conditions are met for proximity analysis', () => {
        const ref: { current: HTMLElement } = { current: null }
        const Widget = wrapWidget(LayerAccordion as any, { theme: mockTheme, ref } as any)
        render(<Widget {...mockProximityProps} theme={theme} />)

        waitFor(() => {
            const mockFeatureRecord = { feature: { geometry: { type: 'point' } } } as any
            const canShow = (ref.current as any).canShowPlanRouteButton(mockFeatureRecord, AnalysisTypeName.Proximity, true)
            expect(canShow).toBe(true)
        }, { timeout: 100 })
    })

    it('Should return false for summary analysis', () => {
        const ref: { current: HTMLElement } = { current: null }
        const Widget = wrapWidget(LayerAccordion as any, { theme: mockTheme, ref } as any)
        render(<Widget {...mockProximityProps} theme={theme} />)

        waitFor(() => {
            const mockFeatureRecord = { feature: { geometry: { type: 'point' } } } as any
            const canShow = (ref.current as any).canShowPlanRouteButton(mockFeatureRecord, AnalysisTypeName.Summary, true)
            expect(canShow).toBe(false)
        }, { timeout: 100 })
    })

    it('Should return false when geometry is not point', () => {
        const ref: { current: HTMLElement } = { current: null }
        const Widget = wrapWidget(LayerAccordion as any, { theme: mockTheme, ref } as any)
        render(<Widget {...mockProximityProps} theme={theme} />)

        waitFor(() => {
            const mockFeatureRecord = { feature: { geometry: { type: 'polygon' } } } as any
            const canShow = (ref.current as any).canShowPlanRouteButton(mockFeatureRecord, AnalysisTypeName.Proximity, true)
            expect(canShow).toBe(false)
        }, { timeout: 100 })
    })

    it('Should return false when incidentGraphic is not present', () => {
        const ref: { current: HTMLElement } = { current: null }
        const Widget = wrapWidget(LayerAccordion as any, { theme: mockTheme, ref } as any)
        const props = { ...mockProximityProps, incidentGraphic: null }
        render(<Widget {...props} theme={theme} />)

        waitFor(() => {
            const mockFeatureRecord = { feature: { geometry: { type: 'point' } } } as any
            const canShow = (ref.current as any).canShowPlanRouteButton(mockFeatureRecord, AnalysisTypeName.Proximity, true)
            expect(canShow).toBe(false)
        }, { timeout: 100 })
    })
})

describe('Export Functionality', () => {
    it('Should have export button enabled in props when configured', () => {
        const ref: { current: HTMLElement } = { current: null }
        const Widget = wrapWidget(LayerAccordion as any, { theme: mockTheme, ref } as any)
        render(<Widget {...mockProximityProps} theme={theme} />)

        waitFor(() => {
            expect((ref.current as any).props.showExportButton).toBe(true)
        }, { timeout: 100 })
    })

    it('Should have export button hidden when not configured', () => {
        const ref: { current: HTMLElement } = { current: null }
        const Widget = wrapWidget(LayerAccordion as any, { theme: mockTheme, ref } as any)
        const props = { ...mockProximityProps, showExportButton: false }
        render(<Widget {...props} theme={theme} />)

        waitFor(() => {
            expect((ref.current as any).props.showExportButton).toBe(false)
        }, { timeout: 100 })
    })
})

describe('Map Configuration', () => {
    it('Should display map symbol when enabled from configuration', () => {
        const ref: { current: HTMLElement } = { current: null }
        const Widget = wrapWidget(LayerAccordion as any, { theme: mockTheme, ref } as any)
        render(<Widget {...mockProximityProps} theme={theme} />)
        waitFor(() => {
            expect((ref.current as any).props.displayMapSymbol).toBe(true)
        }, { timeout: 100 })
    })

    it('Should have valid graphics layer available', () => {
        const ref: { current: HTMLElement } = { current: null }
        const Widget = wrapWidget(LayerAccordion as any, { theme: mockTheme, ref } as any)
        render(<Widget {...mockProximityProps} theme={theme} />)
        waitFor(() => {
            expect((ref.current as any).props.graphicLayer).toBeDefined()
            expect((ref.current as any).props.graphicLayer.type).toBe('graphics')
        }, { timeout: 100 })
    })
})

describe('Feature Exclusion', () => {
    it('Should handle excluded feature IDs', () => {
        const ref: { current: HTMLElement } = { current: null }
        const Widget = wrapWidget(LayerAccordion as any, { theme: mockTheme, ref } as any)
        const props = { ...mockProximityProps, idsToExclude: [1, 2, 3, 5, 8] }
        render(<Widget {...props} theme={theme} />)
        waitFor(() => {
            expect((ref.current as any).props.idsToExclude).toEqual([1, 2, 3, 5, 8])
            expect((ref.current as any).props.idsToExclude.length).toBe(5)
        }, { timeout: 100 })
    })

    it('Should show retrieve all icon when feature count is more than max record count', () => {
        const ref: { current: HTMLElement } = { current: null }
        const Widget = wrapWidget(LayerAccordion as any, { theme: mockTheme, ref } as any)
        const props = { ...mockProximityProps, featureCount: 11000 }
        render(<Widget {...props} theme={theme} />)
        waitFor(() => {
            expect((ref.current as any).props.featureCount).toBe(11000)
            expect((ref.current as any).state.showRetriveAll).toBe(true)
        }, { timeout: 100 })
    })

    it('Should not show retrieve all icon when feature count is less than max record count', () => {
        const ref: { current: HTMLElement } = { current: null }
        const Widget = wrapWidget(LayerAccordion as any, { theme: mockTheme, ref } as any)
        const props = { ...mockProximityProps, featureCount: 5000 }
        render(<Widget {...props} theme={theme} />)
        waitFor(() => {
            expect((ref.current as any).props.featureCount).toBe(5000)
            expect((ref.current as any).state.showRetriveAll).toBe(false)
        }, { timeout: 100 })
    })

    it('Should show showmaxRecordCountInfoMsg when feature count is more than max record count and retrieve all is not clicked', () => {
        const ref: { current: HTMLElement } = { current: null }
        const Widget = wrapWidget(LayerAccordion as any, { theme: mockTheme, ref } as any)
        const props = { ...mockProximityProps, featureCount: 11000 }
        render(<Widget {...props} theme={theme} />)
        waitFor(() => {
            const showInfoMessage = (ref.current as any).handleMaxRecordCountInfoMsg()
            expect(showInfoMessage).toBe(true)
        }, { timeout: 100 })
    })

    it('Should not show showmaxRecordCountInfoMsg when feature count is less than max record count', () => {
        const ref: { current: HTMLElement } = { current: null }
        const Widget = wrapWidget(LayerAccordion as any, { theme: mockTheme, ref } as any)
        const props = { ...mockProximityProps, featureCount: 5000 }
        render(<Widget {...props} theme={theme} />)
        waitFor(() => {
            const showInfoMessage = (ref.current as any).handleMaxRecordCountInfoMsg()
            expect(showInfoMessage).toBe(false)
        }, { timeout: 100 })
    })

    it('Should show progress icon when export button is clicked', () => {
        const ref: { current: HTMLElement } = { current: null }
        const Widget = wrapWidget(LayerAccordion as any, { theme: mockTheme, ref } as any)
        const props = { ...mockProximityProps, featureCount: 11000 }
        render(<Widget {...props} theme={theme} />)
            ; (ref.current as any).prepareExportData(true)
        waitFor(() => {
            expect((ref.current as any).state.exportProgress).toBeGreaterThan(0)
        }, { timeout: 200 })
    })

    it('Should show the loading (three dots) when accordion is expanded', () => {
        const ref: { current: HTMLElement } = { current: null }
        const Widget = wrapWidget(LayerAccordion as any, { theme: mockTheme, ref } as any)
        const props = { ...mockProximityProps, featureCount: 100 }
        render(<Widget {...props} theme={theme} />)
            ; (ref.current as any).expandAnalysisResults()
        waitFor(() => {
            expect((ref.current as any).state.isLoading).toBe(true)
        }, { timeout: 200 })
    })
})

describe('Approximate Distance Display', () => {
    it('Approximate distance should be shown if enabled from configuration', () => {
        const ref: { current: HTMLElement } = { current: null }
        const Widget = wrapWidget(LayerAccordion as any, { theme: mockTheme, ref } as any)
        render(<Widget {...mockProximityProps} theme={theme} />)
        const showApproxDistance = (ref.current as any).displayApproximateDistanceUI(mockProximityLayersInfo)
        expect(showApproxDistance).toBe(true)
    })
})
