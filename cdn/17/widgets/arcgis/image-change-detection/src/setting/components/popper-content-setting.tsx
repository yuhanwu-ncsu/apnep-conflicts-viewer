import { useState, } from 'react'
import { React, hooks } from 'jimu-core'
import { Checkbox, Label, Select, CollapsablePanel, Icon, defaultMessages as jimuUIMessages } from 'jimu-ui'
import {SettingRow, SettingSection} from "jimu-ui/advanced/setting-components"
import type { SpectralBandSettingResults } from '@arcgis/imagery-components/dist/components/arcgis-imagery-change-detection/_utils/types'
import type { IMConfig } from '../../config'
import { getBandPair, bandsEqual } from "../../utils"
import { allCOIs, type COIItem } from './constants'
import defaultMessages from '../translations/default'

interface PopperContentProps {
  fromLayerName: string
  fromLayerBands: string[]
  toLayerName: string
  toLayerBands: string[]
  id: string
  config: IMConfig
  onSettingChange: (props: any) => void
}

const PopperContentSetting = (props: PopperContentProps): React.ReactElement => {
  const translate = hooks.useTranslation(jimuUIMessages, defaultMessages)

  const {id, config, onSettingChange} = props
  const {selectedChangeOfInterests, selectedBands, fromImageryLayerName, toImageryLayerName} = config
  const [openedItemId, setOpenedItemId] = useState<string|null>(null)

  const isFromLayerProvided = fromImageryLayerName.length > 0
  const isToLayerProvided = toImageryLayerName.length > 0
  const isLayerProvided = isFromLayerProvided || isToLayerProvided

  const onCOIChange = (coi: COIItem, isChecked: boolean) => {
    const {si, key} = coi

    const currentSelected = selectedChangeOfInterests || []
    const selectedInterests = isChecked? [...currentSelected, key]
                              : currentSelected.filter((itemKey: string) => itemKey !== key)
    const resultName = selectedInterests.length > 0 ? `Result - ${selectedInterests[0]}` : 'Result - '

    let bandSelections: SpectralBandSettingResults = {
      beforeLayer: {...(selectedBands?.beforeLayer || {})},
      afterLayer: {...(selectedBands?.afterLayer || {})}
    }

    if (isChecked) {
      bandSelections = setBandSelections(
        coi,
        bandSelections,
        isFromLayerProvided,
        isToLayerProvided,
        props.fromLayerBands,
        props.toLayerBands
      )
    } else {
      const { [si]: removedBeforeLayer, ...nextBeforeLayer } = bandSelections.beforeLayer
      const { [si]: removedAfterLayer, ...nextAfterLayer } = bandSelections.afterLayer

      bandSelections = {
        beforeLayer: nextBeforeLayer,
        afterLayer: nextAfterLayer
      }

      if (openedItemId === key) {
        setOpenedItemId(null)
      }
    }

    onSettingChange({
      id,
      config: config.set('selectedChangeOfInterests', selectedInterests)
                    .set('selectedBands', bandSelections)
                    .set('configuredResultName', resultName)
    })
  }

  const handleOpenRequest = (coi: COIItem, isChecked: boolean) => {
    if (isChecked) {
      if (isLayerProvided) {
        setOpenedItemId(coi.key)
      }
    }
  }

  const setBandSelections = (
    coi: COIItem,
    bandSelections: SpectralBandSettingResults,
    isFromLayer: boolean,
    isToLayer: boolean,
    fromLayerBands: string[],
    toLayerBands: string[]
  ) => {
      const {bands, si} = coi
      const newBandSelections = {...bandSelections}

      if (isFromLayer && !newBandSelections.beforeLayer[si]) {
        newBandSelections.beforeLayer = {
          ...newBandSelections.beforeLayer,
          [si]: getBandPair(fromLayerBands, bands)
        }
      }

      if (isToLayer && !newBandSelections.afterLayer[si]) {
        newBandSelections.afterLayer = {
          ...newBandSelections.afterLayer,
          [si]: getBandPair(toLayerBands, bands)
        }
      }

      return newBandSelections
  }

  return (
    <div className='popper-content w-100 p-3'>
      <Label className='font-weight-bold mb-3' style={{fontSize: '1rem'}}>
        {translate("presetImageIndices")}
      </Label>

      {
        allCOIs.map((coi) => {
          const isChecked = selectedChangeOfInterests?.includes(coi.key)
          const isExpanded = openedItemId === coi.key

          const header = (
            <div onClick={(e) => { e.stopPropagation() }}>
              <Label className='d-flex align-items-center w-100' aria-label={translate(coi.title)}>
              <Checkbox checked={!!isChecked} className='mr-1' aria-label={translate(coi.title)}
              onChange={(e) => { onCOIChange(coi, e.target.checked) }} />

              <Icon icon={coi.svg} size={24}></Icon>

              <div className='d-flex flex-column text-left ml-2'>
                <span className='mb-0'>{translate(coi.title)}</span>
                <span className="text-disabled" style={{ fontSize: '11px', lineHeight: '1.2'}}>{translate(coi.desc)}</span>
              </div>
              </Label>
            </div>
          )

          return (
            <SettingSection>
              {isLayerProvided
              ?
              (<CollapsablePanel label={header}
              className='border-0 w-100'
              isOpen = {isExpanded && isChecked}
              onRequestOpen={() => {
                const checked = !!isChecked
                handleOpenRequest(coi, checked)
              }}
              onRequestClose={() => {
                setOpenedItemId(null) }}
              >
              <div className='mt-2 p-2'>
                <BandSelector
                  coi={coi}
                  fromLayerExists={isFromLayerProvided}
                  toLayerExists={isToLayerProvided}
                  fromLayerBands={props.fromLayerBands}
                  toLayerBands={props.toLayerBands}
                  id={props.id}
                  config={props.config}
                  translate={translate}
                  onSettingChange={props.onSettingChange}
                />
              </div>
              </CollapsablePanel>)
              :
              (<SettingRow className='w-100 mt-4'>
                {header}
              </SettingRow>)}
            </SettingSection>
          )
        })
      }
    </div>
  )
}

// internal BandSelector
interface BandSelectorProps {
    coi: COIItem
    fromLayerExists: boolean
    fromLayerBands: string[]
    toLayerExists: boolean
    toLayerBands: string[]
    id: string
    config: IMConfig
    translate: (id: string) => string
    onSettingChange: (props: any) => void
}

const BandSelector = (props: BandSelectorProps): React.ReactElement => {
  const {fromLayerExists, toLayerExists, fromLayerBands, toLayerBands,
         coi, id, config, translate, onSettingChange} = props

  const {selectedBands, sameAsFrom} = config

  const band11Ind = config.selectedBands?.beforeLayer?.[coi.si]?.band1 || ''
  const band12Ind = config.selectedBands?.beforeLayer?.[coi.si]?.band2 || ''
  const band21Ind = config.selectedBands?.afterLayer?.[coi.si]?.band1 || ''
  const band22Ind = config.selectedBands?.afterLayer?.[coi.si]?.band2 || ''

  const currentBand11Value = band11Ind ? fromLayerBands[parseInt(band11Ind) - 1] : fromLayerBands[0] || ''
  const currentBand12Value = band12Ind ? fromLayerBands[parseInt(band12Ind) - 1] : fromLayerBands[0] || ''
  const currentBand21Value = band21Ind ? toLayerBands[parseInt(band21Ind) - 1] : toLayerBands[0] || ''
  const currentBand22Value = band22Ind ? toLayerBands[parseInt(band22Ind) - 1] : toLayerBands[0] || ''

  const [currentBand11, setCurrentBand11] = useState<string>(currentBand11Value)
  const [currentBand12, setCurrentBand12] = useState<string>(currentBand12Value)
  const [currentBand21, setCurrentBand21] = useState<string>(currentBand21Value)
  const [currentBand22, setCurrentBand22] = useState<string>(currentBand22Value)
  const [isSameAs, setIsSameAs] = useState(sameAsFrom[coi.key])

  const getBandValue = (bandName: string, bandNames: string[]): string => {
    const bandIndex = bandNames.findIndex((band) => band === bandName)
    return bandIndex >= 0 ? (bandIndex + 1).toString() : ''
  }

  const updateBandSelections = (
    bandSelections: SpectralBandSettingResults,
    layerKey: 'beforeLayer' | 'afterLayer',
    bandKey: 'band1' | 'band2',
    selectedBandName: string,
    bandNames: string[]
  ): SpectralBandSettingResults => {
    const bandValue = getBandValue(selectedBandName, bandNames)
    const si = coi.si

    return {
      ...bandSelections,
      [layerKey]: {
        ...(bandSelections[layerKey] || {}),
        [si]: {
          ...(bandSelections[layerKey]?.[si] || {}),
          [bandKey]: bandValue
        }
      }
    }
  }

  const handleBand11Change = (value: string) => {
    setCurrentBand11(value)
    const newBandSelection = updateBandSelections(selectedBands, 'beforeLayer', 'band1', value, fromLayerBands)

    if (isSameAs) {
      setCurrentBand21(value)
      const newBandSelection2 = updateBandSelections(newBandSelection, 'afterLayer', 'band1', value, toLayerBands)
      onSettingChange({
        id,
        config: config.set('selectedBands', newBandSelection2)
      })
    } else {
      onSettingChange({
        id,
        config: config.set('selectedBands', newBandSelection)
      })
    }
  }

  const handleBand12Change = (value: string) => {
    setCurrentBand12(value)
    const newBandSelection = updateBandSelections(selectedBands, 'beforeLayer', 'band2', value, fromLayerBands)

    if (isSameAs) {
      setCurrentBand22(value)
      const newBandSelection2 = updateBandSelections(newBandSelection, 'afterLayer', 'band2', value, toLayerBands)
      onSettingChange({
        id,
        config: config.set('selectedBands', newBandSelection2)
      })
    } else {
      onSettingChange({
        id,
        config: config.set('selectedBands', newBandSelection)
      })
    }
  }

  const handleBand21Change = (value: string) => {
    setCurrentBand21(value)
    setIsSameAs(false)
    const nextBandSelections = updateBandSelections(selectedBands, 'afterLayer', 'band1', value, toLayerBands)
    onSettingChange({
      id,
      config: config.set('selectedBands', nextBandSelections)
    })

    if (isSameAs) {
      setIsSameAs(false)
      const nextSameAsFrom = {
        ...(sameAsFrom || {}),
        [coi.key]: false
      }
      onSettingChange({
        id,
        config: config.set('sameAsFrom', nextSameAsFrom)
      })
    }
  }

  const handleBand22Change = (value: string) => {
    setCurrentBand22(value)
    setIsSameAs(false)
    const nextBandSelections = updateBandSelections(selectedBands, 'afterLayer', 'band2', value, toLayerBands)
    onSettingChange({
      id,
      config: config.set('selectedBands', nextBandSelections)
    })

    if (isSameAs) {
      setIsSameAs(false)
      const nextSameAsFrom = {
        ...(config.sameAsFrom || {}),
        [coi.key]: false
      }
      onSettingChange({
        id,
        config: config.set('sameAsFrom', nextSameAsFrom)
      })
    }
  }

  const handleSameAsChange = (isChecked: boolean) => {
    setIsSameAs(isChecked)

    const newSameAs = {
      ...sameAsFrom,
      [coi.key]: isChecked
    }

    if (isChecked) {
      setCurrentBand21(currentBand11)
      setCurrentBand22(currentBand12)
      const newBandSelection1 = updateBandSelections(selectedBands, 'afterLayer', 'band1', currentBand11, toLayerBands)
      const newBandSelection2 = updateBandSelections(newBandSelection1, 'afterLayer', 'band2', currentBand12, toLayerBands)
      onSettingChange({
        id,
        config: config.set('selectedBands', newBandSelection2).set('sameAsFrom', newSameAs)
      })
    } else {
      onSettingChange({
      id,
      config: config.set('sameAsFrom', newSameAs)
    })
    }
  }

  const sameBands = fromLayerBands.length > 0 && toLayerBands.length > 0 && bandsEqual(fromLayerBands, toLayerBands)

  const isChecked = config.sameAsFrom?.[coi.key]

  return (
    <div className='band-selector-container'>
      {fromLayerExists && (
        <div className='mb-2'>
          <div className='font-weight-bold'>{translate("fromImageryLayer")}</div>
          <div className='mt-2'>

            <Label>{translate(coi.bandIds[0])}</Label>
            <Select value={currentBand11} aria-label={translate("selectABand")}
              onChange={(e) => { handleBand11Change(e.target.value) }}>
              {fromLayerBands.map((band, index) => (
                <option key={index} value={band} >{band}</option>
              ))}
            </Select>

            <Label className='mt-2'>{translate(coi.bandIds[1])}</Label>
            <Select value={currentBand12} aria-label={translate("selectABand")}
              onChange={(e) => { handleBand12Change(e.target.value) }}>
              {fromLayerBands.map((band, index) => (
                <option key={index} value={band} >{band}</option>
              ))}
            </Select>
          </div>
        </div>
      )}

      {toLayerExists && (
        <div className='mb-2'>
          <div className='font-weight-bold'>{translate("toImageryLayer")}</div>

          {sameBands && (
            <div className='mt-2 d-flex justify-content-center'>
              <Label>
                <Checkbox checked={isChecked} className='mr-2' aria-label={translate("sameAs")}
                  onChange={(e) => { handleSameAsChange(e.target.checked) }}
                />
                {translate("sameAs")}
              </Label>
            </div>
          )}

          <div className='mt-2'>
            <Label>{translate(coi.bandIds[0])}</Label>
            <Select value={currentBand21} aria-label={translate("selectABand")}
              onChange={(e) => { handleBand21Change(e.target.value) }} >
              {toLayerBands.map((band, index) => (
                <option key={index} value={band}>{band}</option>
              ))}
            </Select>

            <Label className='mt-2'>{translate(coi.bandIds[1])}</Label>
            <Select value={currentBand22} aria-label={translate("selectABand")}
              onChange={(e) => { handleBand22Change(e.target.value) }}>
              {toLayerBands.map((band, index) => (
                <option key={index} value={band}>{band}</option>
              ))}
            </Select>
          </div>
        </div>
      )}
    </div>
  )
}

export default PopperContentSetting
