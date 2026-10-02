import { hooks } from 'jimu-core'
import type { AllWidgetSettingProps } from 'jimu-for-builder'
import { SettingSection, SettingRow } from 'jimu-ui/advanced/setting-components'
import { InputUnit } from 'jimu-ui/advanced/style-setting-components'
import { ThemeColorPicker } from 'jimu-ui/basic/color-picker'
import { DistanceUnits, defaultMessages as jimuUiMessages } from 'jimu-ui'
import { useTheme2 } from 'jimu-theme'
import type { IMConfig } from '../config'

const Setting = (props: AllWidgetSettingProps<IMConfig>) => {
  const { config, onSettingChange } = props
  const { iconColor, iconSize } = config

  const translate = hooks.useTranslation(jimuUiMessages)
  const theme = useTheme2()

  const handleIconColorChange = (value: string) => {
    onSettingChange({
      id: props.id,
      config: config.set('iconColor', value)
    })
  }

  const handleIconSizeChange = (value: { distance: number; unit: DistanceUnits }) => {
    onSettingChange({
      id: props.id,
      config: config.set('iconSize', value.distance)
    })
  }

  return (
    <div className='widget-setting-theme-mode jimu-widget-setting'>
      <SettingSection>
        <SettingRow label={translate('iconColor')} flow='no-wrap' truncateLabel>
          <ThemeColorPicker
            className='jimu-outline-inside'
            aria-label={translate('iconColor')}
            specificTheme={theme}
            value={iconColor}
            onChange={handleIconColorChange}
          />
        </SettingRow>
        <SettingRow label={translate('iconSize')} flow='no-wrap' truncateLabel>
          <InputUnit
            aria-label={translate('iconSize')}
            className='w-50'
            min={0}
            max={64}
            precision={0}
            applyDefaultValue={false}
            placeholder='16'
            value={{ distance: iconSize, unit: DistanceUnits.PIXEL }}
            onChange={handleIconSizeChange}
          />
        </SettingRow>
      </SettingSection>
    </div>
  )
}

export default Setting
