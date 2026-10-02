/** @jsx jsx */
import { React, jsx, defaultMessages as jimuCoreDefaultMessage, hooks } from 'jimu-core'
import { Checkbox, defaultMessages as jimuUiDefaultMessage } from 'jimu-ui'
import type { MapSurroundInfo, ElementOverrides } from '../../../config'
import { getElementOverridesOptions, getTranslationNameForElementOverridesOption } from '../../../utils/utils'
import defaultMessage from '../../translations/default'
import SettingRow from '../setting-row'
const { useState, useEffect, useCallback, Fragment } = React

interface Props {
  elementOverrides: ElementOverrides
  handleSelectedTemplateSettingChange: (keys: string[], value: any) => void
}

const ScaleBarSetting = (props: Props) => {
  const nls = hooks.useTranslation(defaultMessage, jimuUiDefaultMessage, jimuCoreDefaultMessage)
  const { elementOverrides, handleSelectedTemplateSettingChange } = props
  const [scaleBarElementOverridesOptions, setScaleBarElementOverridesOptions] = useState([] as MapSurroundInfo[])

  useEffect(() => {
    const newElementOverridesOptions = getElementOverridesOptions(elementOverrides)
    const newScaleBarElementOverridesOptions = (newElementOverridesOptions?.scaleBar || [])?.filter(scaleBarOption => (scaleBarOption?.enableInExb as any) !== false)
    setScaleBarElementOverridesOptions(newScaleBarElementOverridesOptions)
  }, [elementOverrides])

  const handleScaleBarVisibleChange = useCallback((key: string, value: boolean) => {
    handleSelectedTemplateSettingChange(['layoutOptions', 'elementOverrides', key, 'visible'], value)
  }, [handleSelectedTemplateSettingChange])

  return (
    <Fragment>
      {scaleBarElementOverridesOptions.map((scaleBarOption, index) => {
        return (<SettingRow key={index}>
          <div
            title={getTranslationNameForElementOverridesOption(scaleBarOption, nls, true)}
            aria-label={getTranslationNameForElementOverridesOption(scaleBarOption, nls, true)}
            className='w-100 align-items-center d-flex checkbox-con'
            onClick={() => { handleScaleBarVisibleChange(scaleBarOption.name, !scaleBarOption?.visible) }}
          >
            <Checkbox
              title={getTranslationNameForElementOverridesOption(scaleBarOption, nls, true)}
              className='lock-item-ratio'
              checked={scaleBarOption?.visible}
            />
            <div className='text-left ml-2 f-grow-1'>
              {getTranslationNameForElementOverridesOption(scaleBarOption, nls, true)}
            </div>
          </div>
        </SettingRow>)
      })}
    </Fragment>
  )
}

export default ScaleBarSetting
