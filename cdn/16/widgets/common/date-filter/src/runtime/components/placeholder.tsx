import { css, hooks } from 'jimu-core'
import { WidgetPlaceholder } from 'jimu-ui'
import defaultMessages from '../translations/default'
const widgetIcon = require('../../../icon.svg')

const WIDGET_WIDTH = '298px'
const WIDGET_HEIGHT = '390px'

interface PlaceholderProps {
  autoWidth: boolean
  autoHeight: boolean
  controllerWidgetId: string
}

export const Placeholder = (props: PlaceholderProps) => {
  const { controllerWidgetId, autoWidth, autoHeight } = props

  const i18n = hooks.useTranslation(defaultMessages)
  const isOnPanel = controllerWidgetId

  return (
    <WidgetPlaceholder
      className='filter-placeholder'
      icon={widgetIcon}
      css={css`
        width: ${isOnPanel ? 'inherit' : autoWidth ? WIDGET_WIDTH : '100%' };
        height: ${isOnPanel ? 'inherit' : autoHeight ? WIDGET_HEIGHT : '100%'};
      `}
      name={i18n('_widgetLabel')}
    />
  )
}