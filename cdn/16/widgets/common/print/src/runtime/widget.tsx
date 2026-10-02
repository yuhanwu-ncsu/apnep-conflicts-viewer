/** @jsx jsx */
import { React, jsx, css, type AllWidgetProps, appActions, type IMState, ReactRedux, type ImmutableArray, hooks } from 'jimu-core'
import { WidgetPlaceholder, Paper, defaultMessages as jimuiDefaultMessage } from 'jimu-ui'
import { JimuMapViewComponent, type JimuMapView, type JimuMapViewGroup } from 'jimu-arcgis'
import { type IMConfig, ModeType, PrintResultState, type PrintTemplateProperties, type OutputDataSourceWarningOption } from '../config'
import widgetPrintOutlined from 'jimu-icons/svg/outlined/brand/widget-print.svg'
import defaultMessage from './translations/default'
import Classic from './component/classic'
import CompactPrint from './component/compact'
import { checkIsCustomTemplate, checkIsTemplateAvailable, getErrorRemindText, getUrlOfUseUtility } from '../utils/utils'
import { checkPremiumService } from '../utils/premium-service-util'
import { versionManager } from '../version-manager'
import OutputDataSourceListProps from './component/output-datasource-list'
const { useState, useRef, useEffect, useMemo } = React
type PrintProps = AllWidgetProps<IMConfig>

const Widget = (props: PrintProps) => {
  const { id, config, dispatch, useMapWidgetIds, layoutId, layoutItemId, locale, controllerWidgetId } = props
  const nls = hooks.useTranslation(defaultMessage, jimuiDefaultMessage)
  const selectionIsSelf = ReactRedux.useSelector((state: IMState) => {
    const selection = state?.appRuntimeInfo?.selection
    const selectionIsSelf = !!(selection && selection.layoutId === layoutId && selection.layoutItemId === layoutItemId)
    return selectionIsSelf
  })
  const loadingPrintService = ReactRedux.useSelector((state: IMState) => state.widgetsState?.[id]?.loadingPrintService)
  const portalSelf = ReactRedux.useSelector((state: IMState) => state.portalSelf)

  const isSetLayoutRef = useRef(false)
  const showUtilityErrorRemindTimeoutRef = useRef(null)

  const [jimuMapView, setJimuMapView] = useState(null as JimuMapView)
  const [errorTip, setErrorTip] = useState(nls('printPlaceholder'))
  const [templateList, setTemplateList] = useState(null as ImmutableArray<PrintTemplateProperties>)
  const [selectedTemplateIndex, setSelectedTemplateIndex] = useState(0)
  const [outputDataSourceWarning, setOutputDataSourceWarning] = useState(null as OutputDataSourceWarningOption)
  const [showPlaceholder, setShowPlaceholder] = useState(false)
  const [showUtilityErrorRemind, setUtilityErrorRemind] = useState(false)
  const [printStatusMessage, setPrintStatusMessage] = useState(' ' as string)
  const [printServiceUrl, setPrintServiceUrl] = useState('')

  const [previewOverlayItem, setPreviewOverlayItem] = useState(null)

  const showPrintCredits = useMemo(() => {
    return checkPremiumService(printServiceUrl)
  }, [printServiceUrl])

  const printButtonLabel = useMemo(() => {
    return showPrintCredits ? nls('printWithCredits') : nls('_widgetLabel')
  }, [showPrintCredits, nls])

  const disablePrintByCreditsPermission = useMemo(() => {
    const user = portalSelf?.user
    const isSignedIn = !!user

    if (!showPrintCredits) {
      return false
    }

    if (!isSignedIn) {
      return false
    }

    const { availableCredits = 0, assignedCredits = 0, privileges } = user ?? {}
    const isSuspended = portalSelf?.state === 'suspended'
    const hasNegativeCreditBalance = portalSelf?.state === 'active' && availableCredits <= 0 && assignedCredits > 0
    const hasPrivileges = privileges?.includes('premium:user:print:customlayout')

    return hasNegativeCreditBalance || !hasPrivileges || isSuspended
  }, [showPrintCredits, portalSelf])

  const STYLE = css`
    .checkbox-con:hover {
      color: var(--sys-color-surface-paper-text);
    }
  `
  useEffect(() => {
    setListLayoutInWidgetState()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectionIsSelf])

  useEffect(() => {
    getTemplateList()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [config])

  useEffect(() => {
    loadingPrintService && setTemplateList(null)
  }, [loadingPrintService])

  useEffect(() => {
    let isCancelled = false
    if (!config?.useUtility) {
      setPrintServiceUrl('')
      return
    }

    getUrlOfUseUtility(config.useUtility?.asMutable({ deep: true })).then(serviceUrl => {
      if (!isCancelled) {
        setPrintServiceUrl(serviceUrl || '')
      }
    }).catch(() => {
      if (!isCancelled) {
        setPrintServiceUrl('')
      }
    })

    return () => {
      isCancelled = true
    }
  }, [config?.useUtility])

  const updatePreviewOverlayItem = (overlayItem) => {
    setPreviewOverlayItem(overlayItem)
  }

  const handlePrintStatusMessageChange = (printStatus: PrintResultState) => {
    switch (printStatus) {
      case PrintResultState.Loading:
        setPrintStatusMessage(nls('printing'))
        break
      case PrintResultState.Error:
        setPrintStatusMessage(nls('printError'))
        break
      case PrintResultState.Success:
        setPrintStatusMessage(nls('printSuccess'))
        break
    }
  }

  const getTemplateList = () => {
    const isCustomTemplate = checkIsCustomTemplate(config?.printServiceType, config?.printTemplateType)
    let template = isCustomTemplate ? config?.printCustomTemplate : config?.printOrgTemplate
    if (config?.supportCustomReport || config?.supportReport) {
      template = template?.filter(templateItem => {
        const isTemplateAvailable = checkIsTemplateAvailable(templateItem?.asMutable({ deep: true }), config)
        return isTemplateAvailable
      })
    }
    setTemplateList(template)
  }

  const setListLayoutInWidgetState = () => {
    if (layoutId && id && layoutItemId && !isSetLayoutRef.current && selectionIsSelf) {
      dispatch(
        appActions.widgetStatePropChange(id, 'layoutInfo', {
          layoutId,
          layoutItemId
        })
      )
      isSetLayoutRef.current = true
    }
  }

  const handleSelectedTemplateIndexChange = (index: number) => {
    setSelectedTemplateIndex(index)
  }

  const handleActiveViewChange = (jimuMapView: JimuMapView): void => {
    const notAddMap = !useMapWidgetIds || useMapWidgetIds?.length === 0
    // Async errors
    if ((jimuMapView === null || undefined === jimuMapView) && !notAddMap) {
      setErrorTip(nls('chooseMapTip'))
      setJimuMapView(null)
      return // skip null
    }

    if (!notAddMap && jimuMapView?.view?.type !== '2d') {
      setErrorTip(nls('chooseMapTip'))
      setJimuMapView(null)
      return // skip 2D
    }

    if (notAddMap) {
      setErrorTip(nls('printPlaceholder'))
    }

    setJimuMapView(jimuMapView)// 2d
  }

  const handleViewGroupCreate = (viewGroup: JimuMapViewGroup): void => {
    // setViewGroup(viewGroup)
  }

  // Render placeholder
  const renderWidgetPlaceholder = (): React.ReactElement => {
    return <WidgetPlaceholder name={nls('_widgetLabel')} icon={widgetPrintOutlined} message={getErrorTip()} />
  }

  const getErrorTip = (): string => {
    let errMsg = errorTip
    if (jimuMapView && (!config?.useUtility)) {
      errMsg = ''
    }
    return errMsg
  }

  const toggleUtilityErrorRemind = (isShow = false) => {
    setUtilityErrorRemind(isShow)
    if (isShow) {
      clearTimeout(showUtilityErrorRemindTimeoutRef.current)
      showUtilityErrorRemindTimeoutRef.current = setTimeout(() => {
        setUtilityErrorRemind(false)
      }, 5000)
    }
  }

  // Render map content
  const renderMapContent = () => {
    return (
      <JimuMapViewComponent
        useMapWidgetId={useMapWidgetIds?.[0]}
        onActiveViewChange={handleActiveViewChange}
        onViewGroupCreate={handleViewGroupCreate}
      />
    )
  }

  const checkShowPlaceholder = React.useCallback((jimuMapView?: JimuMapView, templateList?: ImmutableArray<PrintTemplateProperties>, config?: IMConfig) => {
    const { supportCustomReport, supportReport } = config
    let showPlaceholder = false
    if (!jimuMapView || !config?.useUtility) {
      showPlaceholder = true
      setShowPlaceholder(showPlaceholder)
      return
    }

    if (supportReport || supportCustomReport || showPrintCredits) {
      let noTemplateAvailable = true
      templateList?.forEach(templateItem => {
        const isTemplateAvailable = checkIsTemplateAvailable(templateItem?.asMutable({ deep: true }), config)
        if (isTemplateAvailable) {
          noTemplateAvailable = false
        }
      })
      if (noTemplateAvailable) {
        const remindText = getErrorRemindText(templateList?.[0]?.asMutable({ deep: true }), config, nls)
        errorTip && setErrorTip(remindText)
        showPlaceholder = true
      }
    }

    if (!templateList || templateList?.length === 0 || loadingPrintService) {
      showPlaceholder = true
      setErrorTip(null)
    }

    setShowPlaceholder(showPlaceholder)
  }, [nls, errorTip, loadingPrintService, showPrintCredits])

  const handleWarningLabelChange = (option: OutputDataSourceWarningOption) => {
    setOutputDataSourceWarning(option)
  }

  useEffect(() => {
    checkShowPlaceholder(jimuMapView, templateList, config)
  }, [templateList, config, jimuMapView, checkShowPlaceholder])

  return (
    <Paper transparent={config?.modeType === ModeType.Compact} className='jimu-widget widget-print' css={STYLE}>
      <div className='map'>
        <div>{renderMapContent()}</div>
      </div>

      {
        config?.modeType === ModeType.Classic && <div className='w-100 h-100'>
          {!showPlaceholder && <Classic
            printButtonLabel={printButtonLabel}
            disablePrintByCreditsPermission={disablePrintByCreditsPermission}
            outputDataSourceWarning={outputDataSourceWarning}
            handleSelectedTemplateIndexChange={handleSelectedTemplateIndexChange}
            useMapWidgetIds={useMapWidgetIds}
            id={id}
            locale={locale}
            config={config}
            jimuMapView={jimuMapView}
            templateList={templateList}
            showUtilityErrorRemind={showUtilityErrorRemind}
            previewOverlayItem={previewOverlayItem}
            toggleUtilityErrorRemind={toggleUtilityErrorRemind}
            updatePreviewOverlayItem={updatePreviewOverlayItem}
            handlePrintStatusMessageChange={handlePrintStatusMessageChange}
          />}
          {showPlaceholder && renderWidgetPlaceholder()}
        </div>
      }

      {
        config?.modeType === ModeType.Compact && <div className='w-100 h-100'>
          <CompactPrint
            printButtonLabel={printButtonLabel}
            disablePrintByCreditsPermission={disablePrintByCreditsPermission}
            showPlaceholder={showPlaceholder}
            outputDataSourceWarning={outputDataSourceWarning}
            useMapWidgetIds={useMapWidgetIds}
            id={id}
            config={config}
            locale={locale}
            jimuMapView={jimuMapView}
            templateList={templateList}
            controllerWidgetId={controllerWidgetId}
            errorTip={getErrorTip()}
            showUtilityErrorRemind={showUtilityErrorRemind}
            toggleUtilityErrorRemind={toggleUtilityErrorRemind}
            previewOverlayItem={previewOverlayItem}
            updatePreviewOverlayItem={updatePreviewOverlayItem}
            handlePrintStatusMessageChange={handlePrintStatusMessageChange}
          />
        </div>
      }

      {
        (config?.supportReport || config?.supportCustomReport) && <OutputDataSourceListProps id={id} reportOptions={templateList?.[selectedTemplateIndex]?.reportOptions} handleWarningLabelChange={handleWarningLabelChange}/>
      }
      <div role='alert' aria-live='assertive' className='sr-only'>{printStatusMessage}</div>
    </Paper>
  )
}
Widget.versionManager = versionManager
export default Widget
