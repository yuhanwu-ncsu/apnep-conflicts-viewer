/** @jsx jsx */
import { React, ReactRedux, type IMState } from 'jimu-core'
import type { JimuMapView } from 'jimu-arcgis'
import type SceneView from 'esri/views/SceneView'
import type { ShadowCastMode } from 'esri/analysis/ShadowCast/types'
import { ShadowCastVisType, type ShadowCastConfig } from '../../../constraints'
import { getDefaultShadowCastTimeParams, setShadowCastTimeParams } from './utils/default-shadowcast-time-params'
import { setCustomStyleForWidget } from './utils/ui-utils'
import { useEnvDefault } from './utils/use-env-defaults'

export interface ShadowCastProps {
  jimuMapView: JimuMapView
  shadowCastConfig: ShadowCastConfig
  onUpdated: () => void
}

const getShadowCastMode = (visType: ShadowCastConfig['visType']): ShadowCastMode => {
    switch (visType) {
      case ShadowCastVisType.Duration:
        return 'total-duration'
      case ShadowCastVisType.Discrete:
        return 'discrete'
      case ShadowCastVisType.Threshold:
        return 'min-duration'
    }
}

export const useShadowCast = (props: ShadowCastProps) => {
  const { getDefaultLighting } = useEnvDefault()
  const timeZoneInfo = ReactRedux.useSelector((state: IMState) => state?.appConfig?.attributes?.timezone)
  const { onUpdated } = props
  const widgetRef = React.useRef<HTMLArcgisShadowCastElement>(null)

  //1
  const _updateWidget = React.useCallback((domRef: HTMLDivElement) => {
    const view = props.jimuMapView?.view as SceneView
    if (!view) {
      return null
    }

    const currentWidget: HTMLArcgisShadowCastElement = document.createElement('arcgis-shadow-cast')
    Object.assign(currentWidget, {
      hideTimezone: !props.shadowCastConfig.timezone,
      hideDatePicker: !props.shadowCastConfig.datePicker,
      mode: getShadowCastMode(props.shadowCastConfig.visType),
      view
    })
    setCustomStyleForWidget(currentWidget)

    widgetRef.current = currentWidget
    domRef.replaceChildren(widgetRef.current)

    currentWidget.componentOnReady().then(() => {
      if (widgetRef.current !== currentWidget) {
        return
      }

      onUpdated()

      const defaultLighting = getDefaultLighting(view)
      const defaultTimeParams = getDefaultShadowCastTimeParams(props.shadowCastConfig, {timeZoneInfo, lighting: defaultLighting})
      setShadowCastTimeParams(currentWidget, defaultTimeParams)
    }).catch(() => undefined)

    return widgetRef.current
  }, [props.jimuMapView, props.shadowCastConfig, onUpdated, timeZoneInfo,getDefaultLighting])

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  const _destroyWidget = React.useCallback(() => {
  }, [])

  // export interfaces
  return {
    // ref
    shadowCastRef: widgetRef.current,
    // update
    updateShadowCastWidget: _updateWidget,
    // remove
    destroyShadowCastWidget: _destroyWidget
  }
}
