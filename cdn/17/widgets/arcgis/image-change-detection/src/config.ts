import type { ImmutableObject } from 'seamless-immutable'
import type { ChangeOfInterest, ResultMode, MethodGroupName, SpectralBandSettingResults } from '@arcgis/imagery-components/dist/components/arcgis-imagery-change-detection/_utils/types'

type SpectralIndexSelection = {
  [key in ChangeOfInterest]?: boolean
}
export interface Config {
  enableFromImageryLayer: boolean,
  enableToImageryLayer: boolean,
  fromImageryLayerName: string,
  toImageryLayerName: string,
  fromImageryLayerBands: string[],
  toImageryLayerBands: string[],
  resultMode: ResultMode,
  selectedMethodGroupNames: MethodGroupName[],
  selectedChangeOfInterests?: ChangeOfInterest[],
  selectedBands: SpectralBandSettingResults,
  sameAsFrom: SpectralIndexSelection,
  configuredResultName: string,
  methodGroupName: MethodGroupName | null,
}

export type IMConfig = ImmutableObject<Config>
