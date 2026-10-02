import { useState, useEffect, Fragment } from 'react'
import type { AllWidgetSettingProps } from 'jimu-for-builder'
import { type JimuMapView, JimuMapViewComponent } from 'jimu-arcgis'
import { SupportedJSAPILayerTypes, hooks, classNames } from 'jimu-core'
import { Alert, Tooltip, Button, Switch, Select, Radio, Label, defaultMessages as jimuUIMessages } from 'jimu-ui'
import { SettingSection, SettingRow, MapWidgetSelector } from 'jimu-ui/advanced/setting-components'
import { InfoOutlined } from 'jimu-icons/outlined/suggested/info'
import type ImageryLayer from '@arcgis/core/layers/ImageryLayer.js'
import { CalciteNotice } from '@esri/calcite-components-react'
import DetectionMethodSetting from './components/detection-method-setting'
import Placeholder from './components/placeholder'
import type { IMConfig } from '../config'
import defaultMessages from './translations/default'
import { getImageryLayer, getBandNames, getBandPair, isMapWidgetDataSourceEmpty, changeOfInterestToIndex } from '../utils'
import type { ResultMode, ChangeOfInterest, SpectralBandSettingResults } from '@arcgis/imagery-components/dist/components/arcgis-imagery-change-detection/_utils/types'
import { allCOIs } from './components/constants'
import { helpUtils } from 'jimu-for-builder'

export type WidgetSettingProps = AllWidgetSettingProps<IMConfig>

const Setting = (props: WidgetSettingProps): React.ReactElement => {
  const { id, useMapWidgetIds, onSettingChange, config } = props

  const [isNoticeClosed, setIsNoticeClosed] = useState(false)
  const [imageryLayers, setImageryLayers] = useState<ImageryLayer[]>([])
  const [layerTitles, setLayerTitles] = useState<string[]>([])
  const [enableFromLayer, setEnableFromLayer] = useState(props.config.enableFromImageryLayer)
  const [enableToLayer, setEnableToLayer] = useState(props.config.enableToImageryLayer)
  const [resultMode, setResultMode] = useState<ResultMode>(config.resultMode)
  const [helpLink, setHelpLink] = useState('')
  const translate = hooks.useTranslation(jimuUIMessages, defaultMessages)

  const onMapWidgetSelected = (useMapWidgetIds: string[]) => {
    onSettingChange({ id, useMapWidgetIds })
  }

  const onEnableFromLayerChange = (isEnabled: boolean) => {
    setEnableFromLayer(isEnabled)

    if (!isEnabled) {
      const newBandSelections = {
        ...config.selectedBands,
        beforeLayer: {}
      }

      onSettingChange({
        id,
        config: config
                .set('selectedBands', newBandSelections)
                .set('fromImageryLayerName', '')
                .set('enableFromImageryLayer', isEnabled)
      })
    } else {
      onSettingChange({
        id,
        config: config.set('enableFromImageryLayer', isEnabled)
      })
    }
  }

  const onEnableToLayerChange = (isEnabled: boolean): void => {
    setEnableToLayer(isEnabled)

    if (!isEnabled) {
      const newBandSelections = {
        ...config.selectedBands,
        afterLayer: {}
      }

      onSettingChange({
        id,
        config: config.set('selectedBands', newBandSelections)
                      .set('toImageryLayerName', '')
                      .set('enableToImageryLayer', isEnabled)
      })
    } else {
      onSettingChange({
        id,
        config: config.set('enableToImageryLayer', isEnabled)
      })
    }
  }

  const onFromLayerChange = (evt) => {
    const value = evt.currentTarget.value
    const selectedLayer = getImageryLayer(value, imageryLayers)
    if (selectedLayer) {
      const fromLayerBands = getBandNames(selectedLayer)
      const selectedBands = initializeBandSelections('beforeLayer', fromLayerBands)
      const sameAsFrom = config.sameAsFrom || {}
      const newSameAsFrom = Object.keys(sameAsFrom).reduce((result, key) => {
        return {
          ...result,
          [key]: false
        }
      }, {})

      onSettingChange({
      id,
      config: props.config.set('selectedBands', selectedBands)
                          .set('fromImageryLayerName', value)
                          .set('fromImageryLayerBands', [...fromLayerBands])
                          .set('sameAsFrom', newSameAsFrom)
      })
    }
  }

  const onToLayerChange = (evt) => {
    const value = evt.currentTarget.value
    const selectedLayer = getImageryLayer(value, imageryLayers)
    if (selectedLayer) {
      const toLayerBands = getBandNames(selectedLayer)
      const selectedBands = initializeBandSelections('afterLayer', toLayerBands)

      const sameAsFrom = config.sameAsFrom || {}
      const newSameAsFrom = Object.keys(sameAsFrom).reduce((result, key) => {
        return {
          ...result,
          [key]: false
        }
      }, {})

      onSettingChange({
        id,
        config: props.config.set('selectedBands', selectedBands)
                            .set('toImageryLayerName', value)
                            .set('toImageryLayerBands', [...toLayerBands])
                            .set('sameAsFrom', newSameAsFrom)
      })
    }
  }

  const onLayerModeChange = (selectedResultMode: ResultMode) => {
    setResultMode(selectedResultMode)
    onSettingChange({
      id,
      config: config.set('resultMode', selectedResultMode)
    })
  }

  const activeViewChangeHandler = (jmv: JimuMapView) => {
    if (jmv) {
      jmv.whenJimuMapViewLoaded().then(() => {
        const layerIds = Object.keys(jmv.jimuLayerViews)
        const layers = layerIds
            .filter((layerViewId) => jmv.jimuLayerViews[layerViewId]?.layer?.type === SupportedJSAPILayerTypes.ImageryLayer)
            .map((layerViewId) => jmv.jimuLayerViews[layerViewId].layer)

        if (layers.length > 0) {
          const filteredLayers = layers.filter((layer) => !layer.id?.startsWith('result-change-detection'))
          setLayerTitles(filteredLayers.map((layer) => layer.title))
          const imglayers = filteredLayers as ImageryLayer[]
          setImageryLayers(imglayers)
        }
      })
    }
  }

  // for initializing selectedBands for selected layer
  const initializeBandSelections = (
    layer: 'beforeLayer' | 'afterLayer',
    bandNames: string[]
   ): SpectralBandSettingResults => {
      let newSelectedBands = {
        ...config.selectedBands,
        [layer]: config.selectedBands[layer] || {}
      }

      const imageIndexChecked = config.selectedMethodGroupNames?.includes('image-index-change')
      if (imageIndexChecked) {
        const cois = [...(config.selectedChangeOfInterests || [])] as ChangeOfInterest[]
        if (cois.length > 0) {
          cois.forEach(coi => {
            const si = changeOfInterestToIndex(coi)
            const coiItem = allCOIs.find(item => item.si === si)
            const bandData = coiItem? getBandPair(bandNames, coiItem.bands): {band1: '1', band2: '1'}

            newSelectedBands = {
              ...newSelectedBands,
              [layer]: {
                ...newSelectedBands[layer],
                [si]: {
                  ...bandData
                }
              }
            }
          })
        }
      }

    return newSelectedBands
  }

  const hasMapWidgetSelected = useMapWidgetIds?.length > 0
  const mapWidgetId = useMapWidgetIds?.[0] ?? ''
  const isEmptyDataSource = isMapWidgetDataSourceEmpty(mapWidgetId)

  useEffect(() => {
    helpUtils.getWidgetHelpLink('image-change-detection').then(url => {
      setHelpLink(url)
    })
  }, [])

  return (
    <div className='jimu-widget-setting'>
      <SettingSection className={classNames({ 'border-0': !hasMapWidgetSelected })} title={translate('selectMapWidget')} aria-label={translate('selectMapWidget')}>
        <SettingRow className='w-100'>
          <MapWidgetSelector
            useMapWidgetIds={useMapWidgetIds}
            onSelect={onMapWidgetSelected}
          />
        </SettingRow>

        {useMapWidgetIds && useMapWidgetIds.length === 1 && (
          <JimuMapViewComponent
            useMapWidgetId={useMapWidgetIds?.[0]}
            onActiveViewChange={activeViewChangeHandler}
          />
        )}
      </SettingSection>

      {hasMapWidgetSelected ? (
        <div className='w-100 mt-4'>
          {isEmptyDataSource && (
            <Alert
                type='warning'
                text={translate('noDataSourceWarning')}
                closable={false}
                withIcon={false}
                aria-label={translate('noDataSourceWarning')}
            />)
          }
        </div>
      ) : (
        <Placeholder
          text={translate('selectMapHint')}
          style={{ height: 'calc(100% - 6rem' }}
        />
      )}

      {hasMapWidgetSelected && (
        <Fragment>
          <SettingSection title={translate("presetImageryLayers")} aria-label={translate("presetImageryLayers")} >
            <SettingRow>
              {!isNoticeClosed && (
                <CalciteNotice style={{ fontSize: 'smaller' }} open={true} icon="lightbulb" closable
                  onCalciteNoticeClose={() => { setIsNoticeClosed(true) }}
                >
                  <div slot="message" style={{ fontSize: 'small' }}>{translate("inputHint")}</div>
                  <a slot="link" target="_blank" href={helpLink}>
                    {translate("readMore")}
                  </a>
                </CalciteNotice>
              )}
            </SettingRow>

            <SettingRow tag='label' label={translate("fromImageryLayer")} aria-label={translate("fromImageryLayer")} >
              <Switch className="can-x-switch"
                checked={enableFromLayer} aria-label={translate("fromImageryLayer")}
                onChange={(evt) => { onEnableFromLayerChange(evt.target.checked) } }
              />
              <Tooltip title={translate("setFromImagery")} placement="top">
                <Button type='tertiary' className='widget-help-btn' size='sm' icon aria-label={translate("setFromImagery")}>
                  <InfoOutlined />
                </Button>
              </Tooltip>
            </SettingRow>

            <div className="mt-1 mb-1">
              {enableFromLayer && layerTitles.length > 0 && (
                <Select className='w-100' size='sm' value={config.fromImageryLayerName || undefined} placeholder={translate("selectALayer")}
                  onChange={onFromLayerChange}>
                  {layerTitles.map((title, index) => (
                    <option key={index} value={title}>{title}</option>
                  ))}
                </Select>
              )}
            </div>

            <SettingRow tag='label' label={translate("toImageryLayer")} aria-label={translate("toImageryLayer")}>
              <Switch className="can-x-switch"
                checked={enableToLayer} aria-label={translate("toImageryLayer")}
                onChange={(evt) => { onEnableToLayerChange(evt.target.checked) } }
              />
              <Tooltip title={translate("setToImagery")} placement="top">
              <Button type='tertiary' className='widget-help-btn' size='sm' icon aria-label={translate("setToImagery")}>
                <InfoOutlined />
              </Button>
              </Tooltip>
            </SettingRow>

            <div className="mt-1 mb-1">
              {enableToLayer && layerTitles.length > 0 && (
                <Select className='w-100' size='sm' value={config.toImageryLayerName} placeholder={translate("selectALayer")}
                  onChange={onToLayerChange}>
                  {layerTitles.map((title, index) => (
                    <option key={index} value={title}>{title}</option>
                  ))}
                </Select>
              )}
            </div>
            </SettingSection>

            <SettingSection title={translate("resultLayerMode")} aria-label={translate("resultLayerMode")}>
            <SettingRow>
              <div className='d-flex flex-column align-items-start' aria-label={translate("resultLayerMode")} >
                <Label>
                  <Radio
                    name = "result-mode-group"
                    checked = {resultMode === 'multi-layer'}
                    className='mr-2'
                    style={{ cursor: 'pointer' }}
                    onChange={() => { onLayerModeChange('multi-layer') }}
                  />
                  <span className="ml-1 text-nowrap">{translate("multipleLayers")}</span>
                </Label>
                <Label className='mt-2'>
                  <Radio
                    name = "result-mode-group"
                    checked = {resultMode === 'single-layer'}
                    className='mr-2'
                    style={{ cursor: 'pointer' }}
                    onChange={() => { onLayerModeChange('single-layer') }}
                  />
                  <span className="ml-1 text-nowrap">{translate("singleLayer")}</span>
                </Label>
              </div>
            </SettingRow>
          </SettingSection>

          <SettingSection title={translate("changeDetectionMethod")} aria-label={translate("changeDetectionMethod")}>
            <DetectionMethodSetting
              fromLayerName={config.fromImageryLayerName}
              fromLayerBands={[...(config.fromImageryLayerBands || [])]}
              toLayerName={config.toImageryLayerName}
              toLayerBands={[...(config.toImageryLayerBands || [])]}
              id={id}
              config={config}
              onSettingChange={onSettingChange}
            />
          </SettingSection>
        </Fragment>
      )}
    </div>
  )
}

export default Setting
