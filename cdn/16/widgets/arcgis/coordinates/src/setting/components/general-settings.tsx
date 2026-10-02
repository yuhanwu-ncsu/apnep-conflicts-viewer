import { React, css, hooks, type ImmutableObject } from 'jimu-core'
import { SettingRow, SettingSection } from 'jimu-ui/advanced/setting-components'
import { Label, NumericInput, Radio, Switch } from 'jimu-ui'
import defaultMessages from '../translations/default'
import { DisplayOrderType, type CoordinateConfig, type IMConfig } from '../../config'

interface GeneralSettingsProps {
  level: 'widget' | 'layer'
  config: IMConfig | ImmutableObject<CoordinateConfig>
  onPropertyChange: (name: string, value: any) => void
}

const getCollapsableStyle = () => css`
  &.general-settings-area {
    margin-top: 16px;
  }
`

const GeneralSettings = (props: GeneralSettingsProps): React.ReactElement => {
  const { level, config, onPropertyChange } = props
  const isWidgetLevel = level === 'widget'
  const {
    coordinateDecimal, altitudeDecimal, showSeparators, displayOrder
  } = isWidgetLevel ? config as IMConfig : config as ImmutableObject<CoordinateConfig>
  const translate = hooks.useTranslation(defaultMessages)
  const displayOptions = translate('displayOptions')
  const coordinateDecimalLabel = translate('coordinateDecimal')
  const altitudeDecimalLabel = translate('altitudeDecimal')
  const showSeparatorsLabel = translate('showSeparators')
  const displayOrderLabel = translate('displayOrder')
  const loLaMode = translate('loLaMode')
  const laLoMode = translate('laLoMode')

  const handleCoordinateDecimal = (valueInt: number) => {
    onPropertyChange('coordinateDecimal', valueInt)
  }

  const handleAltitudeDecimal = (valueInt: number) => {
    onPropertyChange('altitudeDecimal', valueInt)
  }

  const generalSettings = (
    <div className='general-settings-area' css={getCollapsableStyle()}>
      <SettingRow flow='wrap' label={coordinateDecimalLabel}>
        <NumericInput
          size='sm'
          value={coordinateDecimal}
          precision={0}
          min={0}
          max={10}
          onChange={handleCoordinateDecimal}
          aria-label={coordinateDecimalLabel}
          className='w-100'
        />
      </SettingRow>
      <SettingRow flow='wrap' label={altitudeDecimalLabel}>
        <NumericInput
          size='sm'
          value={altitudeDecimal}
          precision={0}
          min={0}
          max={10}
          onChange={handleAltitudeDecimal}
          aria-label={altitudeDecimalLabel}
          className='w-100'
        />
      </SettingRow>
      <SettingRow tag='label' label={showSeparatorsLabel}>
        <Switch
          className='can-x-switch'
          checked={showSeparators}
          data-key='showSeparators'
          onChange={evt => {
            onPropertyChange('showSeparators', evt.target.checked)
          }}
        />
      </SettingRow>
      <SettingRow flow='wrap' label={displayOrderLabel}>
        <div role='radiogroup' className='mb-4' aria-label={displayOrderLabel}>
          <Label className='d-flex align-items-center'>
            <Radio
              style={{ cursor: 'pointer' }}
              name='displayOrderType'
              className='mr-2'
              checked={displayOrder === DisplayOrderType.xy}
              onChange={() => { onPropertyChange('displayOrder', DisplayOrderType.xy) }}
            />
            {loLaMode}
          </Label>
          <Label className='d-flex align-items-center'>
            <Radio
              style={{ cursor: 'pointer' }}
              name='displayOrderType'
              className='mr-2'
              checked={displayOrder === DisplayOrderType.yx}
              onChange={() => { onPropertyChange('displayOrder', DisplayOrderType.yx) }}
            />
            {laLoMode}
          </Label>
        </div>
      </SettingRow>
    </div>
  )

  return isWidgetLevel
    ? <SettingSection
      title={displayOptions}
      role='group'
      aria-label={displayOptions}
    >
      {generalSettings}
    </SettingSection>
    : generalSettings
}

export default GeneralSettings
