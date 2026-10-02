import { React, type IMIconResult} from 'jimu-core'
import { Badge, Button, type FlipOptions, Icon, Popper } from 'jimu-ui'
import InlineDatePicker from './inline-date-picker'
import type { DateProps } from './types'

const FallbackFlipOptions: FlipOptions = {
  fallbackPlacements: ['bottom-start', 'bottom-end', 'top', 'left', 'right'],
  fallbackStrategy: 'bestFit'
}

interface IconDatePickerProps extends DateProps {
  label: string
  icon: string | IMIconResult
  version: number
}

export const IconDatePicker = (props: IconDatePickerProps) => {
  const { label, icon, defaultDate, autoApply, ...otherProps } = props
  const [ applied, setApplied ] = React.useState(autoApply)
  const [ isPopperOpen, setIsPopperOpen ] = React.useState(false)
  const iconRef = React.useRef<HTMLButtonElement>(null)

  const onTogglePopperByEvent = () => {
    setIsPopperOpen(!isPopperOpen)
  }

  const onTogglePopper = () => {
    setIsPopperOpen(false)
  }

  const onApplyChanged = (applied) => {
    setApplied(applied)
  }

  return (
    <div className='filter-widget-popper'>
      <Badge dot className='m-1' hideBadge={!applied} color='primary'>
        <Button
          icon size='sm' className='filter-widget-pill h-100'
          ref={ref => { iconRef.current = ref }}
          title={label}
          aria-label={label}
          variant='text'
          color='inherit'
          onClick={onTogglePopperByEvent}
          aria-pressed={applied}
          aria-haspopup='dialog'
          >
          <Icon
            size={16}
            icon={typeof icon === 'string' ? icon : icon.svg}
            color={typeof icon === 'string' ? 'inherit' : icon.properties.color}
          />
          </Button>
      </Badge>
      <Popper
          open={isPopperOpen}
          autoUpdate={true}
          keepMount
          toggle={onTogglePopper}
          arrowOptions={true}
          sizeOptions={false}
          flipOptions={FallbackFlipOptions}
          forceLatestFocusElements
          reference={iconRef}
          >
          <InlineDatePicker
            {...otherProps}
            isInPopper={true}
            label={label}
            defaultDate={defaultDate}
            autoApply={autoApply}
            isPopperClosed={!isPopperOpen}
            onApplyChanged={onApplyChanged}
          />
        </Popper>
    </div>
  )
}

export default IconDatePicker
