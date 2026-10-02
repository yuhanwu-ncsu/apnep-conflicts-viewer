import { hooks, React } from 'jimu-core'
import type { AllWidgetSettingProps } from 'jimu-for-builder'
import { InfoOutlined } from 'jimu-icons/outlined/suggested/info'
import { defaultMessages as jimuUIDefaultMessages, Label, Option, Select, Tooltip } from 'jimu-ui'
import { MapWidgetSelector, SettingRow, SettingSection } from 'jimu-ui/advanced/setting-components'
import type { IMConfig } from '../config'
import defaultMessages from './translations/default'

export default function Setting (props: AllWidgetSettingProps<IMConfig>) {
  const { useMapWidgetIds } = props
  const getI18nMessage = hooks.useTranslation(
    defaultMessages,
    jimuUIDefaultMessages,
  )

  const handleMapSelect = (useMapWidgetIds: string[]) => {
    props.onSettingChange({
      id: props.id,
      useMapWidgetIds,
    })
  }

  const handleDefaultExtentOptionChange = (evt: React.ChangeEvent<HTMLSelectElement>) => {
    props.onSettingChange({
      id: props.id,
      config: props.config.set("extentToValidate", evt.currentTarget.value)
    })
  }

  const setMapSettings = () => {
    return (
      <SettingSection>
        <SettingRow>
          <Label tabIndex={0} aria-label={getI18nMessage("selectMapWidget")} title={getI18nMessage("selectMapWidget")}
            className='w-100 d-flex'>
            <div className='text-truncate flex-grow-1 title2 text-paper'>
              {getI18nMessage("selectMapWidget")}
            </div>
          </Label>
          <Tooltip role={'tooltip'} tabIndex={0} aria-label={getI18nMessage("selectMapWidget") + ' ' + getI18nMessage("selectMapWidgetHint")}
            title={getI18nMessage("selectMapWidgetHint")} showArrow placement='top'>
            <div className='title3 text-default d-inline'>
              <InfoOutlined />
            </div>
          </Tooltip>
        </SettingRow>
        <SettingRow>
          <MapWidgetSelector
            onSelect={handleMapSelect}
            useMapWidgetIds={useMapWidgetIds}
            aria-label={getI18nMessage("selectMapWidget")}
          ></MapWidgetSelector>
        </SettingRow>
      </SettingSection>
    )
  }

  const setDefaultExtentSettings = () => {
    return(
      <SettingSection>
        <SettingRow>
          <Label tabIndex={0} aria-label={getI18nMessage("selectDefaultExtentOption")} title={getI18nMessage("selectDefaultExtentOption")}
            className='w-100 d-flex'>
            <div className='text-truncate flex-grow-1 title2 text-paper'>
              {getI18nMessage("selectDefaultExtentOption")}
            </div>
          </Label>
        </SettingRow>
        <SettingRow>
          <Select value={props.config.extentToValidate} onChange={handleDefaultExtentOptionChange}>
            <Option key="current" value="current">
              {getI18nMessage("currentExtent")}
            </Option>
            <Option key="entire" value="entire">
              {getI18nMessage("entireExtent")}
            </Option>
          </Select>
        </SettingRow>
      </SettingSection>
    )
  }

  return (
    <div>
      {setMapSettings()}
      {setDefaultExtentSettings()}
    </div>
  )
}