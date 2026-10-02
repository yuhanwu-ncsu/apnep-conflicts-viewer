/** @jsx jsx */
import { React } from 'jimu-core'
import type SceneView from 'esri/views/SceneView'
import type SunLighting from 'esri/webscene/SunLighting'
import type VirtualLighting from 'esri/webscene/VirtualLighting'
import type SunnyWeather from 'esri/views/3d/environment/SunnyWeather'
import type CloudyWeather from 'esri/views/3d/environment/CloudyWeather'
import type RainyWeather from 'esri/views/3d/environment/RainyWeather'
import type SnowyWeather from 'esri/views/3d/environment/SnowyWeather'
import type FoggyWeather from 'esri/views/3d/environment/FoggyWeather'

type LightingDefaults = SunLighting | VirtualLighting
type WeatherDefaults = SunnyWeather | CloudyWeather | RainyWeather | SnowyWeather | FoggyWeather

const defaultLightingMap = new WeakMap<SceneView, LightingDefaults>()
const defaultWeatherMap = new WeakMap<SceneView, WeatherDefaults>()

// export interface EnvDefaultProps {
//   jimuMapView: JimuMapView
// }
export const useEnvDefault = (/*props: EnvDefaultProps*/) => {
  // 1.Lighting
  const cacheDefaultLighting = React.useCallback((view: SceneView) => {
    if (view && !defaultLightingMap.has(view)) {
      defaultLightingMap.set(view, view.environment.lighting.clone())
    }
  }, [])
  const getDefaultLighting = React.useCallback((view?: SceneView) => {
    if (!view) {
      return null
    }

    const defaultLighting = defaultLightingMap.get(view) || view.environment.lighting
    return defaultLighting?.clone() ?? null
  }, [])
  const restoreDefaultLighting = React.useCallback((view: SceneView) => {
    const defaultLighting = view ? defaultLightingMap.get(view) : null

    if (view && defaultLighting) {
      view.environment.lighting = defaultLighting.clone()
      defaultLightingMap.delete(view)
    }
  }, [])

  // 2.Weather
  const cacheDefaultWeather = React.useCallback((view: SceneView) => {
    if (view && !defaultWeatherMap.has(view)) {
      defaultWeatherMap.set(view, view.environment.weather.clone())
    }
  }, [])
  const restoreDefaultWeather = React.useCallback((view: SceneView) => {
    const defaultWeather = view ? defaultWeatherMap.get(view) : null

    if (view && defaultWeather) {
      view.environment.weather = defaultWeather.clone()
      defaultWeatherMap.delete(view)
    }
  }, [])

  // export interfaces
  return {
    // Lighting
    cacheDefaultLighting: cacheDefaultLighting,
    getDefaultLighting: getDefaultLighting,
    restoreDefaultLighting: restoreDefaultLighting,
    // Weather
    cacheDefaultWeather: cacheDefaultWeather,
    restoreDefaultWeather: restoreDefaultWeather
  }
}
