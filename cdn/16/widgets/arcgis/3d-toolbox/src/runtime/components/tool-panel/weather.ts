/** @jsx jsx */
import { React } from 'jimu-core'
import type { JimuMapView } from 'jimu-arcgis'
import * as reactiveUtils from 'esri/core/reactiveUtils'
import { type WeatherConfig, WeatherType } from '../../../constraints'
import { useEnvDefault } from './utils/use-env-defaults'
import type { ResourceHandle } from 'esri/core/Handles'
import type SceneView from 'esri/views/SceneView'
import type SunnyWeather from 'esri/views/3d/environment/SunnyWeather'
import type CloudyWeather from 'esri/views/3d/environment/CloudyWeather'
import type RainyWeather from 'esri/views/3d/environment/RainyWeather'
import type SnowyWeather from 'esri/views/3d/environment/SnowyWeather'
import type FoggyWeather from 'esri/views/3d/environment/FoggyWeather'
import { setCustomStyleForWidget } from './utils/ui-utils'

export interface WeatherProps {
  jimuMapView: JimuMapView
  weatherConfig: WeatherConfig
  onUpdated: () => void
}
export const useWeather = (props: WeatherProps) => {
  const { cacheDefaultWeather, restoreDefaultWeather } = useEnvDefault()

  const { onUpdated } = props
  const widgetRef = React.useRef<HTMLArcgisWeatherElement>(null)
  const DEFALUT_PARAMS = React.useMemo(() => {
    return {
      cloudCover: 0.5,
      precipitation: 0.5,
      fogStrength: 0.5
    }
  }, [])

  // handlers
  const envWatcher = React.useRef<ResourceHandle>(null)

  const setDefaultConfig = React.useCallback((type: WeatherType, view: SceneView) => {
    switch (type) {
      case WeatherType.Sunny:{
        const params = props.weatherConfig.sunnyConfig

        view.environment.weather = {
          type: type,
          cloudCover: params?.cloudCover ?? DEFALUT_PARAMS.cloudCover
        } as SunnyWeather
        break
      }
      case WeatherType.Cloudy:{
        const params = props.weatherConfig.cloudyConfig

        view.environment.weather = {
          type: type,
          cloudCover: params?.cloudCover ?? DEFALUT_PARAMS.cloudCover
        } as CloudyWeather
        break
      }
      case WeatherType.Rainy:{
        const params = props.weatherConfig.rainyConfig

        view.environment.weather = {
          type: type,
          cloudCover: params?.cloudCover ?? DEFALUT_PARAMS.cloudCover,
          precipitation: params?.precipitation ?? DEFALUT_PARAMS.precipitation
        } as RainyWeather
        break
      }
      case WeatherType.Snowy:{
        const params = props.weatherConfig.snowyConfig

        view.environment.weather = {
          type: type,
          cloudCover: params?.cloudCover ?? DEFALUT_PARAMS.cloudCover,
          precipitation: params?.precipitation ?? DEFALUT_PARAMS.precipitation
          //snowCover: params?.snowCover ?? 'disabled'
        } as SnowyWeather
        break
      }
      case WeatherType.Foggy:{
        const params = props.weatherConfig.foggyConfig

        view.environment.weather = {
          type: type,
          fogStrength: params?.fogStrength ?? DEFALUT_PARAMS.fogStrength
        } as FoggyWeather
        break
      }

      // eslint-disable-next-line @typescript-eslint/switch-exhaustiveness-check
      default: {
        break
      }
    }
  }, [props.weatherConfig, DEFALUT_PARAMS])

  //1
  const _updateWidget = React.useCallback((domRef: HTMLDivElement) => {
    const view = props.jimuMapView?.view as SceneView
    if (!view) {
      return null
    }

    cacheDefaultWeather(view)

    setDefaultConfig(props.weatherConfig.weatherType, view)

    const currentWidget: HTMLArcgisWeatherElement = document.createElement('arcgis-weather')
    Object.assign(currentWidget, {
      hideHeader: true,
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

      envWatcher.current?.remove()
      envWatcher.current = reactiveUtils.watch(() => (view?.environment?.weather?.type),
        () => {
          setDefaultConfig(view?.environment?.weather?.type as WeatherType, view)
        }
      )
    }).catch(() => undefined)

    return currentWidget
  }, [props.jimuMapView, props.weatherConfig.weatherType,
    setDefaultConfig,
    cacheDefaultWeather, onUpdated])

  const _destroyWidget = React.useCallback(() => {
    envWatcher?.current?.remove()
    envWatcher.current = null

    restoreDefaultWeather(props.jimuMapView.view as SceneView)
  }, [props.jimuMapView,
    restoreDefaultWeather])

  // export interfaces
  return {
    // ref
    weatherRef: widgetRef.current,
    // update
    updateWeatherWidget: _updateWidget,
    // remove
    destroyWeatherWidget: _destroyWidget
  }
}
