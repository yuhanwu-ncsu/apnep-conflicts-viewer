import { React, configTranslationUtils, i18n, type Translation } from 'jimu-core'

export function useOptionList (defaultLocale: string, locales: Translation[]): Translation[] {
  const [resultLocales, setResultLocales] = React.useState([])

  const fetchLocales = React.useEffectEvent(() => {
    const localeKeys = locales.map(locale => locale.value)
    const portalLocale = i18n.findLocale(defaultLocale, localeKeys)
    if (portalLocale) {
      const sortedLocales = [...locales]
      sortedLocales.sort((a, b) => a.label.localeCompare(b.label))
      setResultLocales(sortedLocales)
      return
    }
    // defaultLocale is not in the locales array, try to find it from supportedLanguages
    configTranslationUtils.getConfigTranslationSupportedLanguages().then(supportedLanguages => {
      const { fullSupport, partialSupport } = supportedLanguages
      const allLocales = [...fullSupport, ...partialSupport]
      const allLocaleKeys = allLocales.map(locale => locale.value)
      const portalLocale = i18n.findLocale(defaultLocale, allLocaleKeys)
      if (portalLocale) {
        const targetItem = allLocales.find(locale => locale.value === portalLocale)
        const result = [...locales, targetItem]
        result.sort((a, b) => a.label.localeCompare(b.label))
        setResultLocales(result)
      }
    })
  })

  React.useEffect(() => {
    fetchLocales()
  }, [])

  return resultLocales
}

