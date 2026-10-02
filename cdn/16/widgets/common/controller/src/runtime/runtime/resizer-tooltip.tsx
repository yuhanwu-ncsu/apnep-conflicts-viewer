import { React, hooks, classNames } from 'jimu-core'
import { Icon, Tooltip } from 'jimu-ui'
import defaultMessages from '../translations/default'

export interface ResizerTooltipProps {
  isRuntime: boolean
  isResizing: boolean
}

const ResizerTooltip = React.memo((props: ResizerTooltipProps) => {
  const { isRuntime, isResizing } = props
  const translate = hooks.useTranslation(defaultMessages)
  const resizeIcon = isRuntime ? require('../assets/icons/resizer-runtime.svg') : require('../assets/icons/resizer-builder.svg')
  const resizer = <div className={classNames('resize-handle d-flex', {'p-1': isRuntime})}><Icon icon={resizeIcon} size={isRuntime ? 10 : 16} currentColor={false} /></div>
  return isRuntime ? resizer : <Tooltip disabled={isResizing} title={translate('resizerTooltip')}>{resizer}</Tooltip>
})

export default ResizerTooltip
