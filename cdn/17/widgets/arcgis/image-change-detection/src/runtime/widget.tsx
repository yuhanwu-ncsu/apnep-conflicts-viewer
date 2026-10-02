import { useState, useEffect, Fragment } from "react"
import type ImageryLayer from "@arcgis/core/layers/ImageryLayer.js"
import { type AllWidgetProps, SupportedJSAPILayerTypes } from "jimu-core"
import { type JimuMapView, JimuMapViewComponent } from "jimu-arcgis"
import { Paper } from "jimu-ui"

import type { IMConfig } from "../config"
import { ImageChangeDetection } from "./components/image-change-detection"
import { Placeholder } from "./components/placeholder"
import { getImageryLayer, isMapWidgetDataSourceEmpty }from '../utils'
import type MapView from "@arcgis/core/views/MapView"

const Widget = (props: AllWidgetProps<IMConfig>): React.ReactElement => {
  const { useMapWidgetIds, config } = props

  const [activeJimuMapView, setActiveJimuMapView] = useState<JimuMapView | null>(null)
  const [mapViewReady, setMapViewReady] = useState<boolean>(false)
  const [imageryLayers, setImageryLayers] = useState<ImageryLayer[]>([])

  const activeViewChangeHandler = (jmv: JimuMapView) => {
    if (jmv) {
      setActiveJimuMapView(jmv)
      jmv.whenJimuMapViewLoaded().then(() => {
        const layerIds = Object.keys(jmv.jimuLayerViews)
        const layers = layerIds
            .filter((layerViewId) => jmv.jimuLayerViews[layerViewId]?.layer?.type === SupportedJSAPILayerTypes.ImageryLayer)
            .map((layerViewId) => jmv.jimuLayerViews[layerViewId].layer)
        if (layers.length > 0) {
          setImageryLayers(layers as ImageryLayer[])
          setMapViewReady(true)
        }
      })
    }
  }

  useEffect(() => {
    if (!activeJimuMapView) return

    const updateLayerList = () => {
      const jmv = activeJimuMapView
      const layerIds = Object.keys(jmv.jimuLayerViews)
        const imglayers = layerIds
            .filter((layerViewId) => jmv.jimuLayerViews[layerViewId]?.layer?.type === SupportedJSAPILayerTypes.ImageryLayer)
            .map((layerViewId) => jmv.jimuLayerViews[layerViewId].layer)

        if (imglayers.length > 0) {
          const newLayer = imglayers[imglayers.length - 1] as ImageryLayer
          if (newLayer.id?.startsWith('result-change-detection')) {
            return // skip adding result layer to the list of imagery layers to select from
          }

          setImageryLayers(imglayers as ImageryLayer[])
        }
    }

    activeJimuMapView.addJimuLayerViewCreatedListener(updateLayerList)
    activeJimuMapView.addJimuLayerViewRemovedListener(updateLayerList)

    return () => {
      if (activeJimuMapView) {
        activeJimuMapView.removeJimuLayerViewCreatedListener(updateLayerList)
        activeJimuMapView.removeJimuLayerViewRemovedListener(updateLayerList)
      }
    }
  }, [activeJimuMapView])

  let fromImageryLayer: ImageryLayer | ImageryLayer[] | null
  let toImageryLayer: ImageryLayer | ImageryLayer[] | null
  if (imageryLayers.length === 0) {
    fromImageryLayer = null
    toImageryLayer = null
  } else if (imageryLayers.length === 1) {
    fromImageryLayer = imageryLayers
    toImageryLayer = imageryLayers
  } else {
    if (config.fromImageryLayerName.length > 0) {
      fromImageryLayer = getImageryLayer(config.fromImageryLayerName, imageryLayers)
    } else {
      fromImageryLayer = imageryLayers
    }
    if (config.toImageryLayerName.length > 0) {
      toImageryLayer = getImageryLayer(config.toImageryLayerName, imageryLayers)
    } else {
      toImageryLayer = imageryLayers
    }
  }
  const fromLayer = Array.isArray(fromImageryLayer)? fromImageryLayer : [fromImageryLayer]
  const toLayer = Array.isArray(toImageryLayer)? toImageryLayer : [toImageryLayer]

  // get all property values from config
  const methods = config.selectedMethodGroupNames as any
  const changeOfInterests = config.selectedChangeOfInterests as any
  const {selectedBands, resultMode, configuredResultName, methodGroupName} = config

  const hasMapWidgetSelected = useMapWidgetIds?.length > 0
  const mapWidgetId = useMapWidgetIds?.[0] ?? ''
  const isEmptyDataSource = isMapWidgetDataSourceEmpty(mapWidgetId)

  return (
    <Paper variant="flat" shape="none" className='jimu-widget'>
      <Fragment>
      {hasMapWidgetSelected && (
        <JimuMapViewComponent
          useMapWidgetId={useMapWidgetIds?.[0]}
          onActiveViewChange={activeViewChangeHandler}
        />
      )}

      {(!hasMapWidgetSelected || isEmptyDataSource) && <Placeholder/>}

      <div className="jimu-widget m-2" style={{overflowY: 'auto', overflowX: 'hidden'}}>
        {mapViewReady && activeJimuMapView && (<ImageChangeDetection
          view={activeJimuMapView.view as unknown as MapView}
          layers={imageryLayers}
          fromLayer={fromLayer}
          toLayer={toLayer}
          configuredMethods={methods}
          configuredChangeOfInterests={changeOfInterests}
          selectedBands={selectedBands}
          configuredResultMode={resultMode}
          currentMethodGroupName={methodGroupName}
          configuredResultName={configuredResultName}
          {...props}
        />)}
      </div>
      </Fragment>
    </Paper>
  )
}

export default Widget
