import { useEffect, useState } from "react"
import type { AllWidgetProps } from "jimu-core"
import { Loading, LoadingType } from "jimu-ui"
import { defineCustomElements } from "@arcgis/imagery-components/dist/loader"
import type { IMConfig } from "../../config"
import { getImageryComponentsAssetsPath } from "../../utils"
import type ImageryLayer from "@arcgis/core/layers/ImageryLayer.js"
import type MapView from "@arcgis/core/views/MapView"
import type {
  MethodGroupName,
  ChangeOfInterest,
  ResultMode,
  SpectralBandSettingResults
} from "@arcgis/imagery-components/dist/components/arcgis-imagery-change-detection/_utils/types"

interface ImageChangeDetectionProps extends AllWidgetProps<IMConfig> {
  view: MapView
  layers: ImageryLayer[]
  fromLayer?: ImageryLayer[]
  toLayer?: ImageryLayer[]
  configuredMethods: MethodGroupName[]
  configuredChangeOfInterests: ChangeOfInterest[]
  selectedBands: SpectralBandSettingResults
  configuredResultMode: ResultMode
  currentMethodGroupName: MethodGroupName
  configuredResultName?: string
}

export const ImageChangeDetection = (props: ImageChangeDetectionProps): React.ReactElement => {
  const { context: { folderUrl },
          layers, view, fromLayer, toLayer,
          configuredChangeOfInterests, configuredMethods,
          selectedBands, configuredResultMode, currentMethodGroupName, configuredResultName
  } = props

  const [hasComponentDefined, setHasComponentDefined] = useState(false)

  useEffect(() => {
    defineCustomElements({
      resourcesUrl: getImageryComponentsAssetsPath(folderUrl),
    })
    setHasComponentDefined(true)
  }, [folderUrl])

  return (
    <div className="d-flex flex-grow-1 overflow-auto">
      {hasComponentDefined ? (
        <arcgis-imagery-change-detection
          view={view}
          layers={layers}
          beforeLayers={fromLayer}
          afterLayers={toLayer}
          selectedMethodGroupNames={configuredMethods}
          selectedChangeOfInterests={configuredChangeOfInterests}
          selectedBands={selectedBands}
          resultMode={configuredResultMode}
          methodGroupName={currentMethodGroupName}
          currentResultLayerName={configuredResultName}
          panelHeading=""
        />
      ) : (
        <Loading type={LoadingType.Secondary} />
      )}
    </div>
  )
}
