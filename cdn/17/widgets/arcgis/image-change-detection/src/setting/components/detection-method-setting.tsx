import { useState } from 'react'
import { React, hooks } from 'jimu-core'
import { Checkbox, Label, Button, defaultMessages as jimuUIMessages } from 'jimu-ui'
import {SidePopper} from "jimu-ui/advanced/setting-components"
import { SettingOutlined } from 'jimu-icons/outlined/application/setting'
import type { MethodGroupName } from '@arcgis/imagery-components/dist/components/arcgis-imagery-change-detection/_utils/types'
import type { IMConfig } from '../../config'
import PopperContentSetting from './popper-content-setting'
import { allMethods } from './constants'
import defaultMessages from '../translations/default'

interface MethodProps {
    fromLayerName: string
    fromLayerBands: string[]
    toLayerName: string
    toLayerBands: string[]
    id: string
    config: IMConfig
    onSettingChange: (props: any) => void
}

const DetectionMethodSetting = (props: MethodProps): React.ReactElement => {
  const translate = hooks.useTranslation(jimuUIMessages, defaultMessages)

  const { config, onSettingChange, id } = props
  const [isPopperOpen, setIsPopperOpen] = useState(false)
  const [btnElement, setBtnElement] = useState<HTMLButtonElement | null>(null)

  const configuredMethods = config?.selectedMethodGroupNames || []

  const onMethodChange = (evt, methodName: MethodGroupName) => {
    const checked = evt.currentTarget.checked

    let newMethodSelection: MethodGroupName[]
    if (configuredMethods.includes(methodName)) {
      newMethodSelection = configuredMethods.filter(m => m !== methodName) as any
    } else {
      newMethodSelection = [...configuredMethods, methodName]
    }

    let currentMethodGroupName: MethodGroupName | null
    if (newMethodSelection.length > 0) {
      currentMethodGroupName = newMethodSelection[0]
    } else {
      currentMethodGroupName = null
    }

    if (methodName === 'image-index-change' && !checked) {
      const newBandSelections = {
        ...config.selectedBands ?? {},
        beforeLayer: {},
        afterLayer: {}
      }
      onSettingChange({
        id,
        config: config.set('selectedBands', newBandSelections)
                      .set('selectedMethodGroupNames', newMethodSelection)
                      .set('methodGroupName', currentMethodGroupName)
      })
    } else {
      onSettingChange({
        id,
        config: config.set('selectedMethodGroupNames', newMethodSelection)
                      .set('methodGroupName', currentMethodGroupName)
      })
    }
  }

  return (
    <div aria-label={translate("changeDetectionMethod")}>
      {allMethods.map((m, index) => {
        const isChecked = configuredMethods.includes(m.key)
        const isImageIndexChange = m.key === 'image-index-change'

        return (
          <div key={index} className="d-flex align-items-center border-bottom pb-2 mb-1 w-100">
            <Label className="d-flex align-items-center w-100" aria-label={translate(m.title)}>
            <Checkbox
              checked={isChecked}
              onChange={(evt) => { onMethodChange(evt, m.key) }}
              className="mt-1"
              aria-label={translate(m.title)}
              key={index}
            />
            <div className="ml-2 d-flex flex-column text-left">
              <span className="mb-0">{translate(m.title)}</span>
              <span className="text-disabled mb-1" style={{ fontSize: '12px', lineHeight: '1.3' }}>
                {translate(m.desc)}
              </span>
            </div>
            </Label>

            {isImageIndexChange && isChecked && (
              <Button
                size="sm"
                type="tertiary"
                icon
                title={translate("configureImageIndex")}
                aria-label={translate("configureImageIndex")}
                className="ml-auto align-self-center"
                onClick={() => {
                  setIsPopperOpen(!isPopperOpen)
                }}
                ref={setBtnElement}
              >
              <SettingOutlined />
              </Button>
            )}
          </div>
        )
      })}

      <SidePopper
        title={translate("configureImageIndexChange")}
        aria-label={translate("configureImageIndexChange")}
        isOpen={isPopperOpen} position='right'
        toggle={() => { setIsPopperOpen(false) }}
        trigger={btnElement ? [btnElement] : []}
      >
        <PopperContentSetting
          fromLayerName={props.fromLayerName}
          fromLayerBands={props.fromLayerBands}
          toLayerName={props.toLayerName}
          toLayerBands={props.toLayerBands}
          id={id}
          config={config}
          onSettingChange={onSettingChange}
        />
      </SidePopper>
    </div>
  )
}

export default DetectionMethodSetting
