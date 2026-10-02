import { type IMState, React, ReactRedux } from 'jimu-core'
import { getLocaleInfo } from '@arcgis/analysis-shared-utils'
import * as sharedUtils from './shared-utils'
import type { LocaleItem } from '@arcgis/analysis-ui-schema'

export const getAssetsPathByFolderName = sharedUtils.getAssetsPathByFolderName

export const getAnalysisComponentsAssetPath = sharedUtils.getAnalysisComponentsAssetPath

export const getAnalysisToolAppAssetPath = sharedUtils.getAnalysisToolAppAssetPath

export const useStrings = sharedUtils.useStrings

export const useHelpMapStrings = () => {
  return useStrings(`${getAnalysisComponentsAssetPath()}assets/help/helpmap.json`)
}

export const useHelpMapEnterpriseStrings = () => {
  return useStrings(`${getAnalysisComponentsAssetPath()}assets/help/helpmap_enterprise.json`)
}

export const useGPMessageStrings = (locale: string = getLocaleInfo().locale) => {
  return useStrings(`${getAnalysisToolAppAssetPath()}assets/t9n/gpmessage/gpmessage.t9n.${locale ?? 'en-US'}.json`)
}

export const useErrorMessageStrings = (locale: string = getLocaleInfo().locale) => {
  return useStrings(`${getAnalysisToolAppAssetPath()}assets/t9n/validation/errors.t9n.${locale ?? 'en-US'}.json`)
}

export const useToolInfoStrings = () => {
  const [toolStrings, setToolStrings] = React.useState<LocaleItem>({} as any)

  const locale = ReactRedux.useSelector((state: IMState) => {
    return state.appContext.locale
  })

  React.useEffect(() => {
    const elLocale = getLocaleInfo().locale
    sharedUtils.getToolInfoStringsByLocale(elLocale).then((strings) => {
      setToolStrings(strings)
    })
  }, [locale])

  return toolStrings
}

export const useCommonStrings = (locale: string = getLocaleInfo().locale) => {
  return sharedUtils.useCommonStringsByLocale(locale)
}

export const useWebToolsUnits = () => {
  const commonStrings = useCommonStrings()
  return (commonStrings?.webToolsUnits || {}) as { [key: string]: string }
}

let translatedRFTNamesMapCache = new Map()

export const useTranslatedRFTNamesMap = () => {
  const [translatedRFTNamesMap, setTranslatedRFTNamesMap] = React.useState<Map<string, string>>(translatedRFTNamesMapCache)

  React.useEffect(() => {
    if (translatedRFTNamesMap.size) {
      return
    }
    if (translatedRFTNamesMapCache.size) {
      setTranslatedRFTNamesMap(translatedRFTNamesMap)
      return
    }

    import('@arcgis/arcgis-raster-function-editor').then(({ getTranslatedRFTNamesMap }) => {
      getTranslatedRFTNamesMap().then((names) => {
        setTranslatedRFTNamesMap(names)
        translatedRFTNamesMapCache = names
      })
    })

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return translatedRFTNamesMap
}
