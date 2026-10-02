import { type IMState, ReactRedux, type Translation } from 'jimu-core'

export function useDefaultLocale (defaultLocale: string, locales: Translation[]): number {
  const mainLocale = ReactRedux.useSelector((state: IMState) => {
    const appConfig = state.appConfig
    return appConfig.mainLocale || 'en-us'
  })
  const optionList = locales ?? []

  if (optionList.length > 0) {
    let activeIndex = optionList.findIndex((translation) => {
      return translation.value === defaultLocale
    })
    if (activeIndex < 0) {
      activeIndex = optionList.findIndex((translation) => {
        return translation.value === mainLocale
      })
    }
    return activeIndex
  }

  return 0
}
