import type { ChangeOfInterest, MethodGroupName } from '@arcgis/imagery-components/dist/components/arcgis-imagery-change-detection/_utils/types'

import fireSvg from '../assets/icons/fire-index-24.svg'
import waterSvg from '../assets/icons/water-drop-24.svg'
import vegetationSvg from '../assets/icons/vegetation-index-24.svg'
import builtUpSvg from '../assets/icons/building-index-24.svg'

interface MethodItem {
  key: MethodGroupName
  title: string
  desc: string
}

export const allMethods: MethodItem[] = [
    { key: 'spectral-change', title: 'spectralChangeTitle', desc: 'spectralChangeDesc' },
    { key: 'image-index-change', title: 'imageIndexChangeTitle', desc: 'imageIndexChangeDesc' },
    { key: 'pixel-value-change', title: 'pixelValueChangeTitle', desc: 'pixelValueChangeDesc' }
  ]

export type SpectralIndexName = 'NBR' | 'NDBI' | 'NDVI' | 'NDWI'

export interface COIItem {
  si: SpectralIndexName
  key: ChangeOfInterest
  title: string
  desc: string
  icon: string
  svg: string
  bands: string[]
  bandIds: string[]
}

export const allCOIs: COIItem[] = [
  {si: 'NDVI', key: 'vegetation', title: 'vegetationTitle', desc: 'vegetationDesc', icon: 'tree', svg: vegetationSvg, bands: ['Near infrared band', 'Red band'], bandIds: ['nirBand', 'redBand']},
  {si: 'NDWI', key: 'water', title: 'waterTitle', desc: 'waterDesc', icon: 'water-drop', svg: waterSvg, bands: ['Near infrared band', 'Green band'], bandIds: ['nirBand', 'greenBand']},
  {si: 'NBR', key: 'burn-scar', title: 'burnScarTitle', desc: 'burnScarDesc', icon: 'contour', svg: fireSvg, bands: ['Shortwave infrared band', 'Near infrared band'], bandIds: ['swirBand', 'nirBand']},
  {si: 'NDBI', key: 'built-up', title: 'builtUpTitle', desc: 'builtUpDesc', icon: 'government-building', svg: builtUpSvg, bands: ['Near infrared band', 'Shortwave infrared band'], bandIds: ['nirBand', 'swirBand']},
]
