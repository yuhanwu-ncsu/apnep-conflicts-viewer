import { i18n, ReactRedux, type AllWidgetProps, type IMState } from 'jimu-core'
import type { IMConfig } from '../config'
import { DropdownComponent } from './dropdown'
import { LanguageOptions } from './options'

const Widget = (props: AllWidgetProps<IMConfig>) => {
  const locale = ReactRedux.useSelector((state: IMState) => {
    return state.appContext.locale
  })

  const handleLocaleChange = (value: string): void => {
    i18n.changeLocale(value)
  }

  if (props.controllerWidgetId) {
    return <LanguageOptions onLocaleChange={handleLocaleChange} defaultLocale={locale} {...props} />
  }

  return <DropdownComponent onLocaleChange={handleLocaleChange} defaultLocale={locale} {...props} />
}

export default Widget
