import { React, hooks } from 'jimu-core'
import defaultMessages from '../../../../../../../translations/default'
import { styled } from 'jimu-theme'
import { Label, Radio, Tooltip, Button, defaultMessages as jimUiDefaultMessage } from 'jimu-ui'
import { SettingRow } from 'jimu-ui/advanced/setting-components'
import { WarningOutlined } from 'jimu-icons/outlined/suggested/warning'

interface StyleSourceSelectorProps {
  value: boolean
  onChange?: (value: boolean) => void
  children?: React.ReactNode
  colorMatchAllowed?: boolean
  className?: string
}

const StyledTooltip = styled(Tooltip)({
  width: '295px'
})

const StyleSourceSelector = (props: StyleSourceSelectorProps): React.ReactElement => {
  const { value, onChange, colorMatchAllowed: allowed, children, className } = props

  const [updating, setUpdating] = React.useState(false)
  const visibility = (!allowed && allowed != null) && value && !updating
  const translate = hooks.useTranslation(defaultMessages, jimUiDefaultMessage)

  React.useEffect(() => {
    setUpdating(false)
  }, [allowed])

  const handleColorMatchChange = (value: boolean): void => {
    onChange?.(value)
    setUpdating(true)
  }

  return (
    <SettingRow level={2} label={translate('seriesStyle')} flow='wrap' role='radiogroup' aria-label={translate('seriesStyle')} className={className}>
      <div className='d-flex justify-content-between w-100 align-items-center'>
        <Label title={translate('useLayerColor')} className='d-flex align-items-center text-truncate hint-default title3 mt-1 mb-1'>
          <Radio
            name='series-style'
            className='mr-2'
            aria-label={translate('useLayerColor')}
            style={{ cursor: 'pointer' }}
            onChange={() => { handleColorMatchChange(true) }}
            checked={value}
          />
          {translate('useLayerColor')}
        </Label>
        {visibility && <StyledTooltip placement='top-end' enterDelay={200} leaveDelay={500} interactive={true} title={translate('useLayerColorWarning')}>
          <Button className='warning-button p-0' variant='text' color='warning' icon disableHoverEffect={true} disableRipple={true}>
            <WarningOutlined />
          </Button>
        </StyledTooltip>}
      </div>
      <div className='d-flex justify-content-between w-100 align-items-center'>
        <Label title={translate('custom')} className='flex-shrink-0 d-flex align-items-center text-truncate hint-default title3 mt-1 mb-1'>
          <Radio
            name='series-style'
            className='mr-2'
            style={{ cursor: 'pointer' }}
            aria-label={translate('custom')}
            onChange={() => { handleColorMatchChange(false) }}
            checked={!value}
          />
          {translate('custom')}
        </Label>
        {children}
      </div>
    </SettingRow>
  )
}

export default StyleSourceSelector