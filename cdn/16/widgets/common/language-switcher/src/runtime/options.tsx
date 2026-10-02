import { type IMState, React, hooks, css, ReactRedux, type AllWidgetProps, type Translation, i18n } from 'jimu-core'
import type { IMConfig } from '../config'
import { Button, Icon } from 'jimu-ui'
import { styled } from 'jimu-theme'
import defaultMessages from './translations/default'
import checkOutlined from 'jimu-icons/svg/outlined/application/check.svg'
import type { SwitcherProps } from './types'
import { useDefaultLocale } from './use-default-locale'
import { useOptionList } from './use-option-list'

const TipDiv = styled('div')({
  width: 'calc(100% - 32px)',
  wordWrap: 'break-word',
  whiteSpace: 'pre-wrap',
  textAlign: 'start',
  marginLeft: '1rem'
})

const RootButtonGroup = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'stretch',
  maxWidth: '400px',
  background: 'var(--sys-color-surface-overlay)',
  '.btn': {
    justifyContent: 'flex-start',
    borderRadius: 0
  },
  '.btn.disabled': {
    color: 'var(--ref-palette-neutral-600)',
    backgroundColor: 'transparent'
  },
  '.btn:not(.disabled)': {
    marginTop: '4px',
    marginBottom: '4px',
    paddingTop: 0,
    paddingBottom: 0
  }
})

export function LanguageOptions (props: AllWidgetProps<IMConfig> & SwitcherProps): React.JSX.Element {
  const { defaultLocale, onLocaleChange, manifest } = props
  const translate = hooks.useTranslation(defaultMessages)
  const locales = ReactRedux.useSelector((state: IMState) => {
    const appConfig = state.appConfig
    return appConfig.translations
  })
  const mainLocale = ReactRedux.useSelector((state: IMState) => {
    const appConfig = state.appConfig
    return appConfig.mainLocale || 'en-us'
  })
  const portalLocale = i18n.findLocale(mainLocale, manifest.translatedLocales) || mainLocale
  const options = locales ?? [{ value: mainLocale, label: translate(`locale_${portalLocale}`) }]
  const optionList = useOptionList(defaultLocale, options as Translation[])
  const activeIndex = useDefaultLocale(defaultLocale, optionList)
  const [selectedIndex, setSelectedIndex] = React.useState(activeIndex)

  React.useEffect(() => {
    setSelectedIndex(activeIndex)
  }, [activeIndex])

  const handleLocaleChange = (e, index: number): void => {
    e.stopPropagation()
    setSelectedIndex(index)
    onLocaleChange(optionList[index].value)
  }

  return (
    <RootButtonGroup>
      {window.jimuConfig.isInBuilder && (
        <Button className='border-bottom' disabled css={css`border-color: var(--sys-color-divider-secondary)`}>
          <TipDiv>{translate('previewTip')}</TipDiv>
        </Button>
      )}
      {optionList.map((locale: Translation, index: number) => {
        return (
          <Button
            className='border-0 jimu-outline-inside'
            key={locale.value}
            aria-label={locale.label}
            title={locale.label}
            disabled={window.jimuConfig.isInBuilder}
            onClick={(e) => { handleLocaleChange(e, index) }}
          >
            <Icon className='mr-1' icon={checkOutlined} size="s" css={css`visibility: ${selectedIndex === index ? 'visible' : 'hidden'}`} />
            <div className='text-truncate'>{locale.label}</div>
          </Button>
        )
      })}
    </RootButtonGroup>
  )
}


