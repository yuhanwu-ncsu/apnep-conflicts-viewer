import { hooks, React, type AllWidgetProps } from 'jimu-core'
import { defaultMessages as jimuiDefaultMessage } from 'jimu-ui'
import type { IMConfig } from '../config'
import { versionManager } from '../version-manager'
import { MenuNavigation } from './menu-navigation'
import { useMenuType, useFullConfig } from '../utils'

type MenuProps = AllWidgetProps<IMConfig>

const Widget = (props: MenuProps) => {
  const {
    id,
    config,
    theme,
    a11yLandmark,
    addToA11ySkip,
    label,
    a11yLabel
  } = props

  const translate = hooks.useTranslation(jimuiDefaultMessage)

  const menuType = useMenuType(config)
  const fullConfig = useFullConfig(config, menuType, translate)
  const ariaLabel = a11yLabel || label

  return (
    <div className='widget-menu jimu-widget'>
      <MenuNavigation {...fullConfig.asMutable()} theme={theme} a11yLandmark={a11yLandmark} addToA11ySkip={addToA11ySkip} ariaLabel={ariaLabel} widgetId={id} />
    </div>
  )
}

Widget.versionManager = versionManager

export default Widget
