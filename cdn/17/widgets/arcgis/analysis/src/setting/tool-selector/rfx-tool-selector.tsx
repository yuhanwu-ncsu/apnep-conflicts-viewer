/** @jsx jsx */
import { React, ReactRedux, jsx, hooks, type ImmutableArray, type IMState, FormattedMessage } from 'jimu-core'
import { defaultMessages as jimuiDefaultMessage } from 'jimu-ui'
import defaultMessages from '../translations/default'
import type { ToolConfig } from '../../config'
import { AnalysisEngine, type AnalysisToolItem, AnalysisType } from '@arcgis/analysis-ui-schema'
import type Portal from '@arcgis/core/portal/Portal'
import ToolSelectorUI from './tool-selector-ui'
import { canPerformRasterAnalysis } from '@arcgis/analysis-shared-utils'

export interface Props {
  disabled?: boolean
  toolList: ImmutableArray<ToolConfig>
  portal: Portal
  locale: string
  onWarningNoMap: () => void
  onChange: (toolName: string) => void
}

const RFxToolSelector = (props: Props): React.ReactElement => {
  const { disabled, toolList, portal, locale, onWarningNoMap, onChange } = props
  const translate = hooks.useTranslation(defaultMessages, jimuiDefaultMessage)

  const [toolsArray, setToolsArray] = React.useState<AnalysisToolItem[]>([])
  const [categories, setCategories] = React.useState<string[]>([])

  const [canPerformRaster, setCanPerformRaster] = React.useState(false)

  const hasCredits = ReactRedux.useSelector((state: IMState) => {
    return state.portalSelf?.availableCredits > 0
  })


  React.useEffect(() => {
    const getToolsAndCategories = async () => {
      try {
        const rasterEnabled = await canPerformRasterAnalysis(portal)
        setCanPerformRaster(rasterEnabled)
        if (rasterEnabled) {
          const { getFunctionsAndCategories } = await import('@arcgis/arcgis-raster-function-editor')
          const { rfxFunctions, rfxCategories } = await getFunctionsAndCategories()
          setCategories(rfxCategories)
          setToolsArray(rfxFunctions.map((rasterTool) => {
            return {
              analysisEngine: AnalysisEngine.Raster,
              categoryName: rasterTool.category,
              categoryTitle: rasterTool.categoryTitle,
              description: rasterTool.snippet,
              title: rasterTool.title,
              toolName: rasterTool.name,
              analysisType: AnalysisType.RasterFunction
            }
          }))
        }
      } catch (error) {
        console.log('Get raster functions and categories error', error)
      }
    }

    if (!portal || !hasCredits) {
      return
    }
    getToolsAndCategories()
  }, [portal, hasCredits])

  return (
    <ToolSelectorUI
      disabled={disabled} buttonDisabled={!hasCredits || !canPerformRaster}
      buttonDisabledWarningText={!hasCredits ? <FormattedMessage id='noCreditsTipForRfx' defaultMessage={defaultMessages.noCreditsTip}/> : <FormattedMessage
        id='noRasterPrivilegeTip'
        defaultMessage={defaultMessages.noRasterPrivilegeTip}
        values={{
          a: (chunks) => (<a target='_blank' href={`https://doc.arcgis.com/${locale}/arcgis-online/analyze/licensing-analysis-mv.htm`} rel="noopener noreferrer">{chunks}</a>)
        }}
      ></FormattedMessage>}
      buttonTitle={translate('addRasterTool')} sidePopperTitle={translate('selectTool')}
      toolsArray={toolsArray} categories={categories} toolList={toolList}
      icon={require('jimu-icons/svg/outlined/gis/raster-function.svg')}
      onSelectTool={onChange} onDisabledStateClick={onWarningNoMap} />
  )
}

export default RFxToolSelector
