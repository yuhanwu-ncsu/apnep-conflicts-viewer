import { hooks } from 'jimu-core'
import { getAppConfigAction, type SettingChangeFunction } from 'jimu-for-builder'
import { styled, useTheme } from 'jimu-theme'
import { Button, Icon, Tooltip, defaultMessages as jimuUIMessages } from 'jimu-ui'
import { SettingRow, SettingSection } from 'jimu-ui/advanced/setting-components'
import defaultMessages from './../translations/default'
import { FilterStyle, type IMConfig } from '../../config'

const SettingRowForStyle = styled(SettingRow)(({ theme }) => {
  return {
    marginTop: '10px',
    display: 'flex',
    justifyContent: 'space-between',
    '.jimu-btn': {
      padding: 0,
      background: theme.ref.palette.neutral[300],
      '&.active':{
        border: `2px solid ${theme.sys.color.primary.light}`
      }
    }
  }
})

interface StylesProps {
  widgetId: string,
  config: IMConfig,
  onSettingChange: SettingChangeFunction
}

export const Styles = (props: StylesProps) => {
  const { widgetId, config, onSettingChange } = props
  const { filterStyle } = config

  const i18n = hooks.useTranslation(defaultMessages, jimuUIMessages)
  const theme = useTheme()

  const onChange = (prop: string, value: any, newConfig = config) => {
    const widgetJson = {
      id: widgetId,
      config: newConfig.set(prop, value)
    }
    onSettingChange(widgetJson)
  }

  const changeStyle = (style: FilterStyle) => {
    if (style !== filterStyle) {
      let newConfig = config
      if (style === FilterStyle.Input) {
        newConfig = newConfig.set('autoApply', true)
      } else if (config.filterStyle === FilterStyle.Input) { // keep autoApply when switch between inline and icon.
        newConfig = newConfig.set('autoApply', false)
      }
      onChange('filterStyle', style, newConfig)
      // use offPanel in controller widget when style is not input.
      getAppConfigAction().editWidgetProperty(widgetId, 'inControllerUx', style === FilterStyle.Input ? 'inPanel': 'offPanel').exec()
    }
  }

  return (
    <SettingSection role='radiogroup' title={i18n('styles')} aria-label={i18n('styles')}>
      <SettingRowForStyle theme={theme}>
        <Tooltip title={i18n('styleInline')} placement='bottom'>
          <Button
            onClick={() => { changeStyle(FilterStyle.Inline) }}
            icon size='sm' type='tertiary'
            role='radio'
            active={filterStyle === FilterStyle.Inline}
            aria-checked={filterStyle === FilterStyle.Inline}
          >
            <Icon size={68} icon={require('./../assets/style_inline.svg')} autoFlip />
          </Button>
        </Tooltip>
        <Tooltip title={i18n('styleIcon')} placement='bottom'>
          <Button
            onClick={() => { changeStyle(FilterStyle.Icon) }}
            icon size='sm' type='tertiary'
            role='radio'
            active={filterStyle === FilterStyle.Icon}
            aria-checked={filterStyle === FilterStyle.Icon}
          >
            <Icon size={68} icon={require('./../assets/style_icon.svg')} autoFlip />
          </Button>
        </Tooltip>
        <Tooltip title={i18n('styleInput')} placement='bottom'>
          <Button
            onClick={() => { changeStyle(FilterStyle.Input) }}
            icon size='sm' type='tertiary'
            role='radio'
            active={filterStyle === FilterStyle.Input}
            aria-checked={filterStyle === FilterStyle.Input}
          >
            <Icon size={68} icon={require('./../assets/style_input.svg')} autoFlip />
          </Button>
        </Tooltip>
      </SettingRowForStyle>
    </SettingSection>
  )
}