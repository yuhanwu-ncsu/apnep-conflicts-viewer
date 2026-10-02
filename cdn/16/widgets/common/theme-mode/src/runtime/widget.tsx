import { hooks, ReactRedux, type IMState, type AllWidgetProps, appActions, classNames } from 'jimu-core'
import { Button, Paper, Tooltip, hooks as uiHooks, defaultMessages as uiMessages, WidgetButton } from 'jimu-ui'
import type { IMConfig } from '../config'
import { isSharedTheme, styled, useTheme } from 'jimu-theme'
import defaultMessages from './translations/default'
import { DayFilled } from 'jimu-icons/filled/application/day'
import { NightFilled } from 'jimu-icons/filled/application/night'

const Root = styled(Paper)(() => {
  return {
    '.theme-mode-switcher-wrapper': {
      width: '100%',
      height: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }
  }
})

const Widget = (props: AllWidgetProps<IMConfig>) => {
  const { id, controllerWidgetId, config } = props
  const { iconSize = 16, iconColor = 'currentColor' } = config
  const theme = useTheme()
  const isClassicTheme = uiHooks.useClassicTheme()
  const notSupport = isClassicTheme || isSharedTheme(theme.uri)
  const isInBuilder = window.jimuConfig.isInBuilder
  const defaultThemeMode = theme.sys.color.mode
  const themeMode = ReactRedux.useSelector((state: IMState) => state.appRuntimeInfo?.themeMode ?? defaultThemeMode)

  const translate = hooks.useTranslation(defaultMessages, uiMessages)

  const dispatch = ReactRedux.useDispatch()
  const handleSwitchThemeMode = () => {
    if (isInBuilder || notSupport) {
      return
    }
    const newThemeMode = themeMode === 'light' ? 'dark' : 'light'
    dispatch(appActions.ThemeModeChanged(newThemeMode))
  }

  let label = themeMode === 'light' ? translate('lightModeLabel') : translate('darkModeLabel')
  if (isInBuilder || notSupport) {
    label = isInBuilder ? translate('previewOnlyTip') : translate('notSupportTip')
  }

  const sizeColor = controllerWidgetId ? {} : { size: iconSize, color: iconColor }
  const iconNode = <>
    <DayFilled {...sizeColor} className={classNames({ 'd-none': themeMode === 'dark' })} />
    <NightFilled {...sizeColor} className={classNames({ 'd-none': themeMode === 'light' })} />
  </>

  return (controllerWidgetId ?
    <WidgetButton widgetId={id} label={label} onClick={handleSwitchThemeMode}>
      {iconNode}
    </WidgetButton>
    :
    <Root className='widget-theme-mode-switcher jimu-widget' transparent={true} shape='shape1'>
      <div className='theme-mode-switcher-wrapper'>
        <Tooltip title={label}>
          <Button
            icon={true}
            variant='text'
            color='inherit'
            size='default'
            aria-label={label}
            className='jimu-outline-inside'
            onClick={handleSwitchThemeMode}
          >
            {iconNode}
          </Button>
        </Tooltip>
      </div>
    </Root>
  )
}

export default Widget
