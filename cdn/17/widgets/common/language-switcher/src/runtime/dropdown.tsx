import { type IMState, React, ReactRedux, hooks, css, type AllWidgetProps, type Translation, i18n } from 'jimu-core'
import { isTranslationEditingRestrictedInState } from 'jimu-for-builder'
import type { IMConfig } from '../config'
import { Dropdown, DropdownButton, DropdownItem, DropdownMenu, Icon } from 'jimu-ui'
import defaultMessages from './translations/default'
import { styled } from 'jimu-theme'
import type { SwitcherProps } from './types'
import { useDefaultLocale } from './use-default-locale'
import { useOptionList } from './use-option-list'
import { DEFAULT_ICON } from './default-icon'

const TipDiv = styled('div')({
  width: 'calc(100% - 32px)',
  wordWrap: 'break-word',
  textAlign: 'start',
  whiteSpace: 'pre-wrap'
})

export function DropdownComponent (props: AllWidgetProps<IMConfig> & SwitcherProps): React.JSX.Element {
  const { config, defaultLocale, onLocaleChange, manifest } = props
  const { icon, useIcon, type } = config
  const showIconOnly = type !== 'dropdown'
  const translate = hooks.useTranslation(defaultMessages)
  const locales = ReactRedux.useSelector((state: IMState) => {
    const appConfig = state.appConfig
    return appConfig.translations
  })
  const mainLocale = ReactRedux.useSelector((state: IMState) => {
    const appConfig = state.appConfig
    return appConfig.mainLocale || 'en-us'
  })
  const isTranslationDropdownRestricted = ReactRedux.useSelector((state: IMState) => {
    return isTranslationEditingRestrictedInState(state, 'language-switcher-dropdown')
  })
  const portalLocale = i18n.findLocale(mainLocale, manifest.translatedLocales) || mainLocale
  const options = locales ?? [{ value: mainLocale, label: translate(`locale_${portalLocale}`) }]
  const optionList = useOptionList(defaultLocale, options as Translation[])
  const activeIndex = useDefaultLocale(defaultLocale, optionList)
  const [selectedIndex, setSelectedIndex] = React.useState(activeIndex)

  const selectedIcon = icon || DEFAULT_ICON
  React.useEffect(() => {
    setSelectedIndex(activeIndex)
  }, [activeIndex])

  const handleLocaleChange = (index: number): void => {
    setSelectedIndex(index)
    onLocaleChange(optionList[index].value)
  }

  return (
    <div className="d-flex align-items-center">
      <Dropdown
        activeIcon
        menuItemCheckMode="singleCheck"
        menuRole="listbox"
        size="sm"
      >
        <DropdownButton
          className='jimu-outline-inside'
          icon={showIconOnly}
          type={showIconOnly ? 'tertiary' : 'default'}
          arrow={!showIconOnly}
          aria-haspopup={showIconOnly ? 'menu' : true}
          aria-label={translate('_widgetLabel')}
          disabled={isTranslationDropdownRestricted}
        >
          {!showIconOnly && (
            <div className='d-flex'>
              {useIcon && <Icon className='mr-1' icon={selectedIcon.svg} size={selectedIcon.properties?.size} color={selectedIcon.properties?.color}/> }
              <span>{optionList[selectedIndex]?.label || ''}</span>
            </div>
          )}
          {showIconOnly && <Icon icon={selectedIcon.svg} size={selectedIcon.properties?.size} color={selectedIcon.properties?.color}/> }
        </DropdownButton>
        <DropdownMenu css={css`max-width: 400px;`}>
          {window.jimuConfig.isInBuilder && (
            <DropdownItem className='border-bottom' disabled css={css`border-color: var(--sys-color-divider-secondary)`}>
              <TipDiv>{translate('previewTip')}</TipDiv>
            </DropdownItem>
          )}
          {optionList.map((locale: Translation, index: number) => {
            return (
              <DropdownItem
                key={locale.value}
                aria-label={locale.label}
                title={locale.label}
                disabled={window.jimuConfig.isInBuilder}
                active={selectedIndex === index}
                onClick={() => { handleLocaleChange(index) }}
              >
                <div className='text-truncate'>{locale.label}</div>
              </DropdownItem>
            )
          })}
        </DropdownMenu>
      </Dropdown>
    </div>
  )
}
