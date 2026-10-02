import { React, ErrorBoundary, hooks, ReactRedux, type IMState, AppMode, getAppStore, LayoutItemType, appActions } from 'jimu-core'
import { WidgetButtonContext } from 'jimu-ui'
import { searchUtils } from 'jimu-layouts/layout-runtime'
import { loadWidgetClass } from '.'

export interface WidgetInControllerProps {
  widgetId: string
  showTooltip: boolean
}

export function WidgetInController (props: WidgetInControllerProps) {
  const { widgetId, showTooltip } = props
  const cancelable = hooks.useCancelablePromiseMaker()

  const [WidgetClass, setWidgetClass] = React.useState<React.ComponentType<any>>(null)

  React.useEffect(() => {
    setWidgetClass(null)
    const promise = cancelable(loadWidgetClass(widgetId))
    promise.then((widgetClass) => {
      setWidgetClass(widgetClass)
    }, (error) => {
      console.error(error?.message ?? error)
    })
  }, [cancelable, widgetId])

  const layoutInfo = ReactRedux.useSelector((state: IMState) => {
    const widgetsJson = state.appConfig.widgets
    const sizeMode = state.browserSizeMode
    return widgetId ? widgetsJson?.[widgetId]?.parent?.[sizeMode]?.[0] : undefined
  })

  const isDesignMode = ReactRedux.useSelector((state: IMState) => {
    return state.appRuntimeInfo.appMode === AppMode.Design
  })

  const selectWidget = React.useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const state = getAppStore().getState()
    const layoutInfo = searchUtils.getLayoutInfosHoldContent(state.appConfig, LayoutItemType.Widget, widgetId, state.browserSizeMode)?.[0]
    if (layoutInfo) {
      getAppStore().dispatch(appActions.selectionChanged(layoutInfo))
    }
    e.stopPropagation()
  }, [widgetId])

  return WidgetClass &&
    <ErrorBoundary>
      <WidgetButtonContext.Provider value={{ showTooltip, isDesignMode }}>
        <div className='widget-in-controller' onClick={selectWidget}>
        <WidgetClass widgetId={widgetId} layoutId={layoutInfo?.layoutId} layoutItemId={layoutInfo?.layoutItemId} />
        </div>
      </WidgetButtonContext.Provider>
    </ErrorBoundary>
}
