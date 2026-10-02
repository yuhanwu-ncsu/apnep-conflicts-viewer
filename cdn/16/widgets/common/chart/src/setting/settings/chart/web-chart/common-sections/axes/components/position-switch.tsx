import { React, classNames, hooks } from 'jimu-core'
import { AdvancedButtonGroup, Button, type ButtonSize, defaultMessages } from 'jimu-ui'

interface PositionSwitchProps
  extends Omit<React.HtmlHTMLAttributes<HTMLDivElement>, 'onChange'> {
  /**
   * Defines the position of this component.
   * @default left
   */
  position?: 'left' | 'right'
  /**
   * Defines the size of this component.
   * @default sm
   */
  size?: ButtonSize
  /**
   * Indicates whether the chart is rotated.
   * @default false
   */
  rotated?: boolean
  /**
   * Invoked when position changes.
   * @param position
   * @event
   */
  onChange?: (position?: 'left' | 'right') => void
  /**
   * Disable the right position button.
   * @default false
   */
  rightDisabled?: boolean
}

export const PositionSwitch = (props: PositionSwitchProps) => {
  const {
    position = 'left',
    onChange,
    className,
    size = 'sm',
    rightDisabled = false,
    rotated = false,
    ...others
  } = props
  const translate = hooks.useTranslation(defaultMessages)

  const leftText = rotated ? translate('down') : translate('left')
  const rightText = rotated ? translate('up') : translate('right')

  return (
    <AdvancedButtonGroup
      size={size}
      className={classNames('setting--position-switch', className)}
      {...others}
    >
      <Button
        size={size}
        title={leftText}
        aria-label={leftText}
        type='default'
        active={position === 'left'}
        onClick={() => { onChange('left') }}
      >
        {leftText}
      </Button>
      <Button
        size={size}
        title={rightText}
        aria-label={rightText}
        type='default'
        disabled={rightDisabled}
        active={position === 'right'}
        onClick={() => { onChange('right') }}
      >
        {rightText}
      </Button>
    </AdvancedButtonGroup>
  )
}
