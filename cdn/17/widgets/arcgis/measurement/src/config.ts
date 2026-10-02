import type { ImmutableObject } from 'jimu-core'
import type { AreaUnit, LengthUnit, MeasurementSystem, SystemOrAreaUnit, SystemOrLengthUnit } from '@arcgis/core/core/units'

export interface Config {
  enableDistance: boolean
  defaultDistanceUnit: SystemOrLengthUnit
  enableArea: boolean
  defaultAreaUnit: SystemOrAreaUnit
  arrangement: MeasurementArrangement
  disableSnapping: boolean
}

export enum MeasurementArrangement {
  Classic = 'CLASSIC',
  Toolbar = 'TOOLBAR'
}

export const measurementSystemList: Array<{ key: string, value: MeasurementSystem }> = [
  { key: 'unitsLabelMetric', value: 'metric' },
  { key: 'unitsLabelImperial', value: 'imperial' }
]

export const lengthUnitList: Array<{ key: string, value: LengthUnit }> = [
  { key: 'unitsInches', value: 'inches' },
  { key: 'unitsLabelFeet', value: 'feet' },
  { key: 'unitsLabelYards', value: 'yards' },
  { key: 'unitsLabelMiles', value: 'miles' },
  { key: 'unitsLabelNauticalMiles', value: 'nautical-miles' },
  { key: 'unitsLabelFeetUS', value: 'us-feet' },
  { key: 'unitsMillimeters', value: 'millimeters' },
  { key: 'unitsCentimeters', value: 'centimeters' },
  { key: 'unitsDecimeters', value: 'decimeters' },
  { key: 'unitsLabelMeters', value: 'meters' },
  { key: 'unitsLabelKilometers', value: 'kilometers' }
]
export const areaUnitList: Array<{ key: string, value: AreaUnit }> = [
  { key: 'unitsLabelSquareInches', value: 'square-inches' },
  { key: 'unitsLabelSquareFeet', value: 'square-feet' },
  { key: 'unitsLabelSquareYards', value: 'square-yards' },
  { key: 'unitsLabelSquareMiles', value: 'square-miles' },
  { key: 'unitsLabelSquareNauticalMiles', value: 'square-nautical-miles' },
  { key: 'unitsLabelSquareFeetUS', value: 'square-us-feet' },
  { key: 'unitsLabelSquareMillimeters', value: 'square-millimeters' },
  { key: 'unitsLabelSquareCentimeters', value: 'square-centimeters' },
  { key: 'unitsLabelSquareDecimeters', value: 'square-decimeters' },
  { key: 'unitsLabelSquareMeters', value: 'square-meters' },
  { key: 'unitsLabelSquareKilometers', value: 'square-kilometers' },
  { key: 'unitsLabelAcres', value: 'acres' },
  { key: 'unitsLabelAres', value: 'ares' },
  { key: 'unitsLabelHectares', value: 'hectares' }
]

export interface MeasureButton {
  name: 'measureDistance' | 'measureArea' | ''
  icon: string
  enabled: boolean
}

export type MeasureState = 'disabled' | 'ready' | 'measuring' | 'measured' | 'unsupported'

export type IMConfig = ImmutableObject<Config>
