/** @jsx jsx */
import { React } from 'jimu-core'
import type { JimuMapView } from 'jimu-arcgis'
import type SceneView from 'esri/views/SceneView'
import type SliceAnalysis from 'esri/analysis/SliceAnalysis'
import type { SliceConfig } from '../../../constraints'
import { useSliceAnalysis } from '../../../common/use-slice-analysis'
import { setCustomStyleForWidget } from './utils/ui-utils'

export interface SliceProps {
  jimuMapView: JimuMapView
  sliceConfig?: SliceConfig
  onUpdated: () => void
  onShowCancelSlicingBtn: (isShow: boolean) => void
  onShowResetSliceBtn: (isShow: boolean) => void
}
export const useSlice = (props: SliceProps) => {
  const { onUpdated, onShowResetSliceBtn, onShowCancelSlicingBtn } = props
  const widgetRef = React.useRef<HTMLArcgisSliceElement>(null)
  const currentSliceAnalysisRef = React.useRef<SliceAnalysis>(null)
  const sliceStateHandlerRef = React.useRef<(() => void) | null>(null)

  const { excludeGroundSurface , tiltEnabled } = props.sliceConfig ?? {}

  // hooks for slice analysis
  const { hasPresetAnalysisForThisMap, getAnalysisFromConfig, addAnalysesToView, removeAnalysesFromView } = useSliceAnalysis({
    jimuMapView: props.jimuMapView,
    sliceConfig: props.sliceConfig
  })

  const syncSliceFooterUI = React.useCallback((sliceState: HTMLArcgisSliceElement['state'], hasPresetAnalysis: boolean) => {
    onShowCancelSlicingBtn(sliceState === 'slicing')

    if (!hasPresetAnalysis) {
      onShowResetSliceBtn(false)
      return
    }

    onShowResetSliceBtn(sliceState !== 'slicing' && sliceState !== 'excludingLayer')
  }, [onShowCancelSlicingBtn, onShowResetSliceBtn])

  const applyInitialSliceConfig = React.useCallback((widget: HTMLArcgisSliceElement, analysis: SliceAnalysis | null) => {
    if (analysis) {
      widget.analysis = analysis
    }

    widget.excludeGroundSurface = excludeGroundSurface
    widget.tiltEnabled = tiltEnabled
  }, [excludeGroundSurface, tiltEnabled])

  //1
  const _updateWidget = React.useCallback((domRef: HTMLDivElement) => {
    const view = props.jimuMapView?.view as SceneView
    if (!view) {
      return null
    }
    const hasPresetAnalysisForThisMapFlag = hasPresetAnalysisForThisMap(props.jimuMapView?.dataSourceId) // analysisConfig can only be used for a specific map ,#12673

    // preset analysis
    if (hasPresetAnalysisForThisMapFlag) {
      currentSliceAnalysisRef.current = getAnalysisFromConfig()
    } else {
      currentSliceAnalysisRef.current = null
    }

    const currentWidget: HTMLArcgisSliceElement = document.createElement('arcgis-slice')
    Object.assign(currentWidget, {
      view
    })
    setCustomStyleForWidget(currentWidget)

    const handleSliceStateChange = (event: CustomEvent<{ name: 'analysis' | 'state' }>) => {
      if (event.detail.name !== 'state' || widgetRef.current !== currentWidget) {
        return
      }
      syncSliceFooterUI(currentWidget.state, hasPresetAnalysisForThisMapFlag)
    }
    currentWidget.addEventListener('arcgisPropertyChange', handleSliceStateChange as EventListener)
    sliceStateHandlerRef.current = () => {
      currentWidget.removeEventListener('arcgisPropertyChange', handleSliceStateChange as EventListener)
    }

    widgetRef.current = currentWidget
    domRef.replaceChildren(widgetRef.current)

    currentWidget.componentOnReady().then(() => {
      if (widgetRef.current !== currentWidget) {
        return
      }
      applyInitialSliceConfig(currentWidget, currentSliceAnalysisRef.current)

      onUpdated()
      syncSliceFooterUI(currentWidget.state, hasPresetAnalysisForThisMapFlag)

      addAnalysesToView(hasPresetAnalysisForThisMapFlag, currentSliceAnalysisRef.current, props.jimuMapView.dataSourceId)
    }).catch(() => undefined)

    return widgetRef.current
  }, [props.jimuMapView,
    hasPresetAnalysisForThisMap, getAnalysisFromConfig, addAnalysesToView,
    onUpdated, syncSliceFooterUI, applyInitialSliceConfig])

  const _destroyWidget = React.useCallback(() => {
    removeAnalysesFromView(currentSliceAnalysisRef.current)

    // reset btns
    onShowResetSliceBtn(false)
    onShowCancelSlicingBtn(false)

    sliceStateHandlerRef.current?.()
    sliceStateHandlerRef.current = null
    currentSliceAnalysisRef.current = null
  }, [removeAnalysesFromView, onShowResetSliceBtn, onShowCancelSlicingBtn])

  // export interfaces
  return {
    // ref
    sliceRef: widgetRef.current,
    // update
    updateSliceWidget: _updateWidget,
    // remove
    destroySliceWidget: _destroyWidget
  }
}
