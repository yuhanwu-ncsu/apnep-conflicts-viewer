/** @jsx jsx */
import { jsx, React, hooks, css } from 'jimu-core'
import type { BrowserSizeMode, SizeModeLayoutJson } from 'jimu-core'
import { LayoutItemSizeModes, defaultMessages as jimuLayoutsDefaultMessages } from 'jimu-layouts/layout-runtime'
import { SettingRow } from 'jimu-ui/advanced/setting-components'
import { SizeEditor } from 'jimu-ui/advanced/style-setting-components'
import { Slider, Checkbox, utils as uiUtils, DistanceUnits, defaultMessages as jimuUIDefaultMessages } from 'jimu-ui'
import { MyNumericInput } from '../../my-input'
import type { IMConfig, CardSize, Status } from '../../../../config'
import { ListLayoutType, LIST_CARD_MIN_SIZE, DirectionType, ItemStyle } from '../../../../config'
import { getCardSizeUnit } from '../../../utils/utils'
import { handleResizeCard } from '../../../../common-builder-support'
import ItemSizeLabel from './item-size-label'
import defaultMessages from '../../../translations/default'

const { useState, useEffect, useMemo } = React
const customHeightModes = [LayoutItemSizeModes.Custom]
const autoCustomHeightModes = [LayoutItemSizeModes.Auto, LayoutItemSizeModes.Custom]
const sizeEditorInputStyle = css`
  .size-editor {
    .style-setting--input-unit {
      input {
        text-align: left;
        padding-left: 6px;
      }
    }
  }
`

interface Props {
  id: string
  config: IMConfig
  browserSizeMode: BrowserSizeMode
  builderStatus: Status
  showCardSetting: Status
  layouts: { [name: string]: SizeModeLayoutJson }
  onPropertyChange: (name, value) => void
  handleFormChange: (evt) => void
  handleCheckboxChange: (dataField: string) => void
}

const RowColumnLayoutSetting = (props: Props) => {
  const nls = hooks.useTranslation(defaultMessages, jimuUIDefaultMessages, jimuLayoutsDefaultMessages)

  const { id, config, browserSizeMode, builderStatus, showCardSetting, layouts } = props
  const { onPropertyChange, handleFormChange, handleCheckboxChange } = props

  const [cardSize, setCardSize] = useState(getCardSizeUnit({config, builderStatus, browserSizeMode}))
  const [isVertical, setIsVertical] = useState(true)

  useEffect(() => {
    const cardSize = getCardSizeUnit({config, builderStatus, browserSizeMode})
    setCardSize(cardSize)
  }, [config, builderStatus, browserSizeMode])

  useEffect(() => {
    const isVertical = config?.layoutType ? config?.layoutType === ListLayoutType.Row : config.direction === DirectionType.Vertical
    setIsVertical(isVertical)
  }, [config])


  const handleItemSizeChange = hooks.useEventCallback((value) => {
    let valueInt = value?.distance
    const isHorizon = config?.layoutType === ListLayoutType.Column || config.direction === DirectionType.Horizon
    const oldCardSize = getCardSizeUnit({config, builderStatus, browserSizeMode})
    const ratio = oldCardSize.width.distance / oldCardSize.height.distance
    const newCardSize = getCardSize()
    if (isNaN(valueInt)) return
    valueInt = valueInt < LIST_CARD_MIN_SIZE ? LIST_CARD_MIN_SIZE : valueInt
    if (isHorizon) {
      newCardSize.width = `${valueInt}px`
      if (config.lockItemRatio) {
        newCardSize.height = `${valueInt / ratio}px`
      }
    } else {
      newCardSize.height = `${valueInt}px`
      if (config.lockItemRatio) {
        newCardSize.width = `${valueInt * ratio}px`
      }
    }
    const resizeOption = {
      widgetId: id,
      widgetConfig: config,
      browserSizeMode: browserSizeMode,
      newCardSize: newCardSize
    }
    handleResizeCard(resizeOption).exec()
  })

  const handleHeightModeChange = hooks.useEventCallback((mode: LayoutItemSizeModes) => {
    onPropertyChange('autoHeight', mode === LayoutItemSizeModes.Auto)
  })

  const getCardSize = hooks.useEventCallback((): CardSize => {
    const oldCardSize = getCardSizeUnit({config, builderStatus, browserSizeMode})
    return {
      width: uiUtils.stringOfLinearUnit(oldCardSize.width),
      height: uiUtils.stringOfLinearUnit(oldCardSize.height)
    }
  })

  const handleSpaceChange = (valueFloat: number) => {
    if (!valueFloat && valueFloat !== 0) {
      onPropertyChange('space', 0)
    }
    onPropertyChange('space', valueFloat)
  }

  const showAutoHeightSetting = useMemo(() => {
    const autoHeightSupportedStyles = [ItemStyle.Style10, ItemStyle.Style11, ItemStyle.Style12]
    return config?.layoutType === ListLayoutType.Row && autoHeightSupportedStyles.includes(config?.itemStyle)
  }, [config?.layoutType, config?.itemStyle])

  const isAutoHeight = useMemo(() => {
    return !!showAutoHeightSetting && !!config?.autoHeight
  }, [showAutoHeightSetting, config?.autoHeight])

  return (<div className='mt-4'>
      <SettingRow
        flow='wrap'
        label={<ItemSizeLabel config={config} browserSizeMode={browserSizeMode} showCardSetting={showCardSetting} layouts={layouts}/>}
        role='group'
        aria-label={(isVertical ? nls('itemHeight') : nls('itemWidth'))}
      >
        <div
          className='w-100'
          css={sizeEditorInputStyle}
          aria-describedby='sizeDescribeByMessage'
          role='group'
          aria-label={(isVertical ? nls('itemHeight') : nls('itemWidth'))}
        >
          <SizeEditor
            label={isVertical ? 'H' : 'W'}
            mode={isAutoHeight ? LayoutItemSizeModes.Auto : LayoutItemSizeModes.Custom}
            disableModeSelect={!showAutoHeightSetting}
            disabled={config.lockItemRatio}
            sizeModes={showAutoHeightSetting ? autoCustomHeightModes : customHeightModes}
            availableUnits={[DistanceUnits.PIXEL]}
            value={isVertical ? cardSize.height : cardSize.width}
            onModeChange={handleHeightModeChange}
            onChange={handleItemSizeChange}
          />
        </div>
      </SettingRow>
      {!isAutoHeight && (
        <SettingRow label=''>
          <div title={nls('lockItemRatio')} className='d-flex w-100 align-items-center cursor-pointer' aria-label={nls('lockItemRatio')} style={{ paddingLeft: 0, paddingRight: 0 }} onClick={() => { handleCheckboxChange('lockItemRatio') }}>
            <Checkbox
              className='lock-item-ratio test'
              data-field='lockItemRatio'
              checked={config.lockItemRatio || false}
              aria-label={nls('lockItemRatio')}
            />
            <div className='lock-item-ratio-label text-left'>
              {nls('lockItemRatio')}
            </div>
          </div>
        </SettingRow>
      )}
      <SettingRow
        flow='wrap'
        label={(isVertical ? nls('verticalSpacing') : nls('horizontalSpacing')) + ' (px)'}
        role='group'
        aria-label={(isVertical ? nls('verticalSpacing') : nls('horizontalSpacing')) + ' (px)'}
      >
        <div className='d-flex justify-content-between w-100 align-items-center'>
          <Slider
            style={{ width: '60%' }}
            data-field='space'
            onChange={handleFormChange}
            value={config.space || 0}
            title='0-50'
            min={0}
            max={50}
          />
          <MyNumericInput
            style={{ width: '25%' }}
            value={config.space || 0}
            min={0}
            max={50}
            title='0-50'
            onChange={handleSpaceChange}
          />
        </div>
      </SettingRow>
    </div>
  )
}
export default RowColumnLayoutSetting