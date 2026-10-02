/** @jsx jsx */
import { type UseDataSource, React, jsx, type ImmutableArray, Immutable, getAppStore, hooks } from 'jimu-core'
import { FloatingPanel, defaultMessages as jimuUIMessages } from 'jimu-ui'
import type { JimuMapView, JimuMapViewGroup } from 'jimu-arcgis'
import { JimuMap } from 'jimu-ui/advanced/map'
import { useTheme } from 'jimu-theme'
import type SceneView from 'esri/views/SceneView'
import type SliceAnalysis from 'esri/analysis/SliceAnalysis'
import type { Tool3D, SliceConfig } from '../../../constraints'
import defaultMessages from '../../translations/default'
import { getPanelHeaderStyles, getPoperStyle } from './style'
import { useSliceAnalysis } from '../../../common/use-slice-analysis'
import { ConfirmPopper } from './components/confirm-popper'
import { BottomBtns } from './components/bottom-btns'
import { getDefalutSize, getWidgetPosition } from './components/ui-utils'

interface Props {
  useMapWidgetIds: ImmutableArray<string>
  useDataSources?: ImmutableArray<UseDataSource>
  specifiedJimuMapId: string
  //
  isShowMapPopper?: boolean
  onShowMapPopperChange: (isShow: boolean) => void
  //
  toolConfig: Tool3D
  onPresetAnalysisChange: (config: any) => void
}

export interface SizeObj {
  width: number
  height: number
}

export const MapPopper = React.memo((props: Props) => {
  const theme = useTheme()
  const translate = hooks.useTranslation(defaultMessages, jimuUIMessages)

  // refs
  const sliceWidgetHostRef = React.useRef<HTMLDivElement>(null)
  const sliceWidgetRef = React.useRef<HTMLArcgisSliceElement>(null)
  const currentSliceAnalysisRef = React.useRef<SliceAnalysis>(null)
  const sliceStateHandlerRef = React.useRef<(() => void) | null>(null)

  // States
  const [jimuMapViewState, setJimuMapViewState] = React.useState<JimuMapView>(null)
  //const [jimuMapViewsState, setJimuMapViewsState] = React.useState<{ [id: string]: JimuMapView }>(null)
  const [apiLoadedState, setApiLoadedState] = React.useState<boolean>(false)
  const [is3DViewState, setIs3DViewState] = React.useState<boolean>(false)
  const [isShowConfirmWinState, setIsShowConfirmWinState] = React.useState<boolean>(false)

  // save btns
  const [isSavedFlagState, setIsSavedFlagState] = React.useState<boolean>(true)

  // hooks for slice analysis
  const {
    getAnalysisFromConfig, setPresetAnalysisInConfig, clearPresetAnalysisInConfig, hasPresetAnalysisForThisMap,
    addAnalysesToView, removeAnalysesFromView
  } = useSliceAnalysis({
    jimuMapView: jimuMapViewState,
    sliceConfig: props.toolConfig.config as SliceConfig
  })

  // states observer for Save/Saved btn
  const removeSlicedStateHandler = React.useCallback(() => {
    sliceStateHandlerRef.current?.()
    sliceStateHandlerRef.current = null
  }, [])
  const watchSlicedState = React.useCallback((widget: HTMLArcgisSliceElement, hasPresetAnalysisForThisMapFlag: boolean) => {
    let firstSlicedFlag = true // for skip slice when first loaded
    let shouldSkipInitialSlicingFlag = !hasPresetAnalysisForThisMapFlag

    const handleStateChange = (event: CustomEvent<{ name: 'analysis' | 'state' }>) => {
      if (event.detail.name !== 'state' || sliceWidgetRef.current !== widget) {
        return
      }

      if (widget.state === 'slicing') {
        if (shouldSkipInitialSlicingFlag) {
          shouldSkipInitialSlicingFlag = false
          return
        }
        setIsSavedFlagState(false)
        return
      }

      if (widget.state === 'sliced') {
        const isSkip = hasPresetAnalysisForThisMapFlag && firstSlicedFlag
        firstSlicedFlag = false

        if (!isSkip) {
          setIsSavedFlagState(false)
        }
      }
    }

    widget.addEventListener('arcgisPropertyChange', handleStateChange as EventListener)
    sliceStateHandlerRef.current = () => {
      widget.removeEventListener('arcgisPropertyChange', handleStateChange as EventListener)
    }
  }, [])

  const applyInitialSliceConfig = React.useCallback((widget: HTMLArcgisSliceElement, analysis: SliceAnalysis | null) => {
    const { excludeGroundSurface, tiltEnabled } = props.toolConfig.config as SliceConfig

    if (analysis) {
      widget.analysis = analysis
    }

    widget.excludeGroundSurface = excludeGroundSurface
    widget.tiltEnabled = tiltEnabled
  }, [props.toolConfig.config])

  // slice widget
  const resetSliceWidget = React.useCallback((isCheckConfigFlag: boolean) => {
    const host = sliceWidgetHostRef.current
    const view = jimuMapViewState?.view as SceneView
    if (!host || !view) {
      return
    }

    setApiLoadedState(false)
    removeSlicedStateHandler()

    // remove current analyses
    removeAnalysesFromView(currentSliceAnalysisRef.current)
    currentSliceAnalysisRef.current = null
    // remove widget
    if (sliceWidgetRef.current) {
      sliceWidgetRef.current.destroy()
    }

    const hasPresetAnalysisForThisMapFlag = isCheckConfigFlag && hasPresetAnalysisForThisMap(jimuMapViewState?.dataSourceId)
    if (hasPresetAnalysisForThisMapFlag) {
      // analysisConfig can only be used for a specific map ,#12673
      currentSliceAnalysisRef.current = getAnalysisFromConfig()
    }

    const currentWidget: HTMLArcgisSliceElement = document.createElement('arcgis-slice')
    Object.assign(currentWidget, {
      view
    })
    currentWidget.hidden = true

    sliceWidgetRef.current = currentWidget
    host.replaceChildren(currentWidget)

    currentWidget.componentOnReady().then(() => {
      if (sliceWidgetRef.current !== currentWidget) {
        return
      }

      applyInitialSliceConfig(currentWidget, currentSliceAnalysisRef.current)

      if (hasPresetAnalysisForThisMapFlag) { // analysisConfig can only be used for a specific map ,#12673
        // 1.set preset analysis to mapView
        addAnalysesToView(hasPresetAnalysisForThisMapFlag, currentSliceAnalysisRef.current, jimuMapViewState?.dataSourceId)
      } else {
        // 2.on preset analysis in config
        void currentWidget.start()
      }

      watchSlicedState(currentWidget, hasPresetAnalysisForThisMapFlag)
      setApiLoadedState(true)
    }).catch(() => undefined)

    // drawing flag
    //setIsDrawingSliceFlagState(true)
  }, [jimuMapViewState?.dataSourceId, jimuMapViewState?.view,
    removeSlicedStateHandler, watchSlicedState, applyInitialSliceConfig,
    hasPresetAnalysisForThisMap, getAnalysisFromConfig, addAnalysesToView, removeAnalysesFromView])

  const getSliceWidget = (): HTMLArcgisSliceElement => {
    return sliceWidgetRef.current
  }

  // related to map
  React.useEffect(() => {
    if (jimuMapViewState && is3DViewState) {
      resetSliceWidget(true) // start slice
    }
  }, [jimuMapViewState, is3DViewState,
    resetSliceWidget])

  // map
  const handleActiveViewChange = (jimuMapView: JimuMapView): void => {
    if (jimuMapView !== jimuMapViewState) {
      if (jimuMapView.view?.type === '3d') {
        setIs3DViewState(true)
      } else {
        setIs3DViewState(false)
      }
    }

    setJimuMapViewState(jimuMapView)
  }

  const handleViewGroupCreate = (viewGroup: JimuMapViewGroup): void => {
    //props.onMapPopperViewGroupUpdate(viewGroup)
  }

  // popper
  const { onShowMapPopperChange } = props
  const handleClickClose = React.useCallback((): void => {
    if (!isSavedFlagState) {
      setIsShowConfirmWinState(true) // show confirm popper
    } else {
      onShowMapPopperChange(false)
    }
  }, [onShowMapPopperChange, isSavedFlagState])
  // confirm
  const handleConfirmWinYes = (): void => {
    onShowMapPopperChange(false)
  }
  const handleConfirmWinCancel = (): void => {
    setIsShowConfirmWinState(false)
  }

  // unmount
  hooks.useUnmount(() => {
    removeSlicedStateHandler()

    if (sliceWidgetRef.current) {
      sliceWidgetRef.current.destroy()
    }

    if (sliceWidgetHostRef.current) {
      sliceWidgetHostRef.current.innerHTML = ''
    }
  })

  const useMapWidget = props.useMapWidgetIds && props.useMapWidgetIds[0]
  const config = getAppStore().getState().appStateInBuilder.appConfig
  // const isRTL = getAppStore().getState().appStateInBuilder.appContext.isRTL;
  if (!config.widgets[useMapWidget]) {
    return null
  }

  const useDataSource = config.widgets[useMapWidget].useDataSources
  const toolConfig = {
    canZoom: true,
    canHome: true,
    // canSearch: true,
    canCompass: true,
    canLayers: true
  }
  // if (props.jimuMapView?.dataSourceId) {
  //   const initialMapDataSourceID = props.jimuMapView?.dataSourceId

  const jimuMapConfig = Immutable({} as any)/*.set('initialMapDataSourceID', initialMapDataSourceID)*/.set('toolConfig', toolConfig)
  return (
    <div className='w-100'>
      {props.isShowMapPopper && <FloatingPanel
        onHeaderClose={handleClickClose}
        defaultPosition={getWidgetPosition(props.useMapWidgetIds[0])}
        headerTitle={translate('setDefaultSlice')}
        size={getDefalutSize(props.useMapWidgetIds[0]).innerSize}
        minSize={{ width: 770, height: 850 }}
        disableResize
        css={getPanelHeaderStyles(theme)}
        className='surface-2'
        disableActivateOverlay
        dragBounds='body'
        autoFocus={false}// 508
      >
        <div className='rounded-1 w-100 h-100' css={getPoperStyle}>
          <div className='popper-content'>
            <div className='map-container' style={{ height: '600px', width: '700px' }}>
              <JimuMap
                id={props.specifiedJimuMapId}// `fly__${props.useMapWidgetIds[0]}`
                useDataSources={useDataSource}
                jimuMapConfig={jimuMapConfig}
                onActiveViewChange={handleActiveViewChange}
                onViewGroupCreate={handleViewGroupCreate}
              />
              <div ref={sliceWidgetHostRef} style={{ display: 'none' }}></div>
            </div>

            {/* ConfirmWindow */}
            {isShowConfirmWinState && <ConfirmPopper
              innerSize={getDefalutSize(props.useMapWidgetIds[0]).innerSize}
              onConfirmWinYes={handleConfirmWinYes}
              onConfirmWinCancel={handleConfirmWinCancel}
            ></ConfirmPopper>}

            <div className='popper-footer d-flex'>
              {/* right-tools */}
              <BottomBtns
                jimuMapViewState={jimuMapViewState}
                apiLoadedState={apiLoadedState}
                getSliceWidget={getSliceWidget}
                //
                isSavedFlagState={isSavedFlagState}
                setIsSavedFlagState={setIsSavedFlagState}
                resetSliceWidget={resetSliceWidget}
                //
                setPresetAnalysisInConfig={setPresetAnalysisInConfig}
                clearPresetAnalysisInConfig={clearPresetAnalysisInConfig}
                onPresetAnalysisChange={props.onPresetAnalysisChange}
              ></BottomBtns>
            </div>
          </div>
        </div>
      </FloatingPanel>}
    </div>
  )
})
