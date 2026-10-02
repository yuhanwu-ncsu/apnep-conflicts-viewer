/** @jsx jsx */
import { React, ReactRedux, type AppMode, type IMState } from 'jimu-core'
import type { JimuMapView } from 'jimu-arcgis'
import { type DaylightConfig, DateOrSeason } from '../../../constraints'
import { useEnvDefault } from './utils/use-env-defaults'
import type SceneView from 'esri/views/SceneView'
import { getDefaultDaylightTimeParams, setDaylightTimeParams } from './utils/default-daylight-time-params'
import { setCustomStyleForWidget } from './utils/ui-utils'

export interface DaylightProps {
  jimuMapView: JimuMapView
  daylightConfig: DaylightConfig
  onUpdated: () => void

  appMode: AppMode
}
export const useDaylight = (props: DaylightProps) => {
  const { cacheDefaultLighting, restoreDefaultLighting } = useEnvDefault()
  const timeZoneInfo = ReactRedux.useSelector((state: IMState) => state?.appConfig?.attributes?.timezone)
  const { onUpdated } = props
  const widgetRef = React.useRef<HTMLArcgisDaylightElement>(null)

  // const _initEnv = React.useCallback((view: SceneView) => {
  //   view.environment.lighting.directShadowsEnabled = props.daylightConfig.isShowShadows ?? true
  // }, [props.daylightConfig])
  // stop playing, when appMode changes ,#11482
  React.useEffect(() => {
    if (widgetRef.current) {
      widgetRef.current.dayPlaying = false
      widgetRef.current.yearPlaying = false
    }
  }, [props.appMode])
  // first mount, cache default lighting
  React.useEffect(() => {
    const view = props.jimuMapView?.view as SceneView
    if (!view) {
      return
    }
    cacheDefaultLighting(view)
  },[props.jimuMapView.view, cacheDefaultLighting])

  //1
  const _updateWidget = React.useCallback((domRef: HTMLDivElement) => {
    const view = props.jimuMapView?.view as SceneView
    if (!view) {
      return null
    }

    cacheDefaultLighting(view)

    //_initEnv(view)

    const visibleElements = {
      timezone: props.daylightConfig.timezone,
      playButtons: props.daylightConfig.playButtons,
      datePicker: props.daylightConfig.datePicker,
      sunLightingToggle: props.daylightConfig.dateTimeToggle,
      shadowsToggle: props.daylightConfig.isShowShadows
    }

    const currentWidget: HTMLArcgisDaylightElement = document.createElement('arcgis-daylight')
    Object.assign(currentWidget, {
      hideHeader: true,
      view,
      hideTimezone: !visibleElements.timezone,
      hidePlayButtons: !visibleElements.playButtons,
      hideDatePicker: !visibleElements.datePicker,
      hideSunLightingToggle: !visibleElements.sunLightingToggle,
      hideShadowsToggle: !visibleElements.shadowsToggle,
      timeSliderSteps: props.daylightConfig.timeSliderSteps,
      playSpeedMultiplier: props.daylightConfig.playSpeedMultiplier,
      dateOrSeason: props.daylightConfig.dateOrSeason ?? DateOrSeason.Date,
    })

    setCustomStyleForWidget(currentWidget)

    widgetRef.current = currentWidget

    domRef.replaceChildren(widgetRef.current)

    currentWidget.componentOnReady().then(() => {
      if (widgetRef.current !== currentWidget) {
        return
      }

      onUpdated()

      const defaultTimeParams = getDefaultDaylightTimeParams(props.daylightConfig, timeZoneInfo)
      setDaylightTimeParams(currentWidget, defaultTimeParams)

      const autoPlay = props.daylightConfig.dateTimeAutoPlay
      if (props.daylightConfig.dateOrSeason === DateOrSeason.Season) {
        // currentWidget.yearPlaying = false
      } else {
        currentWidget.dayPlaying = autoPlay
      }
    }).catch(() => undefined)

    return widgetRef.current
  }, [props.jimuMapView, props.daylightConfig,
    //_initEnv,
    cacheDefaultLighting, onUpdated, timeZoneInfo])

  const _destroyWidget = React.useCallback(() => {
    restoreDefaultLighting(props.jimuMapView.view as SceneView)
  }, [props.jimuMapView,
    restoreDefaultLighting])

  // export interfaces
  return {
    // ref
    daylightRef: widgetRef.current,
    // update
    updateDaylightWidget: _updateWidget,
    // remove
    destroyDaylightWidget: _destroyWidget
  }
}
