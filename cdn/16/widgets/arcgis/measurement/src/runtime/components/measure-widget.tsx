import { React, css, classNames, AppMode, type IMState, ReactRedux, hooks, focusElementInKeyboardMode, appActions, getAppStore, WidgetState, type ImmutableObject, type WidgetContext } from 'jimu-core'
import type { JimuMapView } from 'jimu-arcgis'
import { Button, defaultMessages as jimuUIMessages, type FlipOptions, Popper, type ShiftOptions, Typography } from 'jimu-ui'
import type { SystemOrAreaUnit, SystemOrLengthUnit } from '@arcgis/core/core/units'
import * as reactiveUtils from '@arcgis/core/core/reactiveUtils'
import SnappingOptions from '@arcgis/core/views/interactive/snapping/SnappingOptions'
import 'arcgis-map-components'
import { MeasurementArrangement, type IMConfig, type MeasureButton, type MeasureState } from '../../config'
import defaultMessages from '../translations/default'
import MeasureTools from './measure-tools'

export type MeasurementComponent =
  HTMLArcgisDistanceMeasurement2dElement |
  HTMLArcgisDirectLineMeasurement3dElement |
  HTMLArcgisAreaMeasurement2dElement |
  HTMLArcgisAreaMeasurement3dElement

interface MeasureWidgetProps {
  id: string
  useMapWidgetId?: string
  context: ImmutableObject<WidgetContext>
  config: IMConfig
  jimuMapView: JimuMapView
  rootRef: React.RefObject<HTMLDivElement>
}

const componentStyle = css`
arcgis-distance-measurement-2d, arcgis-area-measurement-2d, arcgis-direct-line-measurement-3d, arcgis-area-measurement-3d {
  width: 100%;
  --arcgis-internal-padding: 12px 16px;
  --calcite-color-foreground-1: var(--sys-color-surface-paper);
}
`

const getStyle = () => css`
&.measure-panel {
  border-top: 1px solid var(--sys-color-divider-secondary);
  overflow: auto;
  ${componentStyle}
  .select-to-start {
    padding: 12px 16px;
    p {
      line-height: 1.25;
    }
  }
  .measure-clear {
    padding: 0 16px 12px 16px;
    button {
      width: 100%;
      height: 32px;
    }
  }
}
`

const getPopperStyle = () => css`
.measure-popper {
  ${componentStyle}
}
`

const shiftOptions: ShiftOptions = {
  rootBoundary: 'viewport',
  padding: 0
}

const flipOptions: FlipOptions = {
  fallbackPlacements: ['top-start']
}

export function MeasureWidget (props: MeasureWidgetProps): React.ReactElement {
  const { id, useMapWidgetId, context, config, jimuMapView, rootRef } = props
  const {
    enableDistance = true,
    enableArea = true,
    defaultDistanceUnit = 'metric',
    defaultAreaUnit = 'metric',
    disableSnapping = false,
    arrangement = MeasurementArrangement.Classic
  } = config
  const translate = hooks.useTranslation(jimuUIMessages, defaultMessages)

  const [activeButton, setActiveButton] = React.useState<MeasureButton['name']>('')
  const [measureState, setMeasureState] = React.useState<MeasureState>('disabled')
  const [hasInput, setHasInput] = React.useState<boolean>(false)
  const distance2dRef = React.useRef<HTMLArcgisDistanceMeasurement2dElement>(null)
  const area2dRef = React.useRef<HTMLArcgisAreaMeasurement2dElement>(null)
  const directLine3dRef = React.useRef<HTMLArcgisDirectLineMeasurement3dElement>(null)
  const area3dRef = React.useRef<HTMLArcgisAreaMeasurement3dElement>(null)

  // #region unit
  const applyDistanceUnit = React.useCallback((unit: SystemOrLengthUnit) => {
    if (distance2dRef.current) {
      distance2dRef.current.unit = unit
    }
    if (directLine3dRef.current) {
      directLine3dRef.current.unit = unit
    }
  }, [])

  const applyAreaUnit = React.useCallback((unit: SystemOrAreaUnit) => {
    if (area2dRef.current) {
      area2dRef.current.unit = unit
    }
    if (area3dRef.current) {
      area3dRef.current.unit = unit
    }
  }, [])

  const handleChangeDistanceUnit = React.useCallback((unit: SystemOrLengthUnit) => {
    applyDistanceUnit(unit)
  }, [applyDistanceUnit])

  const handleChangeAreaUnit = React.useCallback((unit: SystemOrAreaUnit) => {
    applyAreaUnit(unit)
  }, [applyAreaUnit])


  const handleDistanceMeasureReady = React.useCallback(() => {
    applyDistanceUnit(defaultDistanceUnit)
  }, [applyDistanceUnit, defaultDistanceUnit])

  const handleAreaMeasureReady = React.useCallback(() => {
    applyAreaUnit(defaultAreaUnit)
  }, [applyAreaUnit, defaultAreaUnit])

  React.useEffect(() => {
    applyDistanceUnit(defaultDistanceUnit)
    applyAreaUnit(defaultAreaUnit)
  }, [applyAreaUnit, applyDistanceUnit, defaultAreaUnit, defaultDistanceUnit])
  // #endregion

  const activeTool = React.useMemo<MeasurementComponent>(() => {
    const is2d = jimuMapView?.view?.type === '2d'
    const is3d = jimuMapView?.view?.type === '3d'
    const toolMap = {
      '2d': {
        measureDistance: distance2dRef,
        measureArea: area2dRef
      },
      '3d': {
        measureDistance: directLine3dRef,
        measureArea: area3dRef
      }
    }
    const type = is2d ? '2d' : is3d ? '3d' : null
    const ref = type && activeButton ? toolMap[type][activeButton] : null
    return ref?.current ?? null
  }, [activeButton, jimuMapView])

  const handleSelectTool = React.useCallback((measureButton: MeasureButton) => {
    if (measureButton.name === activeButton) {
      setActiveButton('')
      if (useMapWidgetId) {
        getAppStore().dispatch(appActions.releaseAutoControlMapWidget(useMapWidgetId))
      }
    } else {
      setActiveButton(measureButton.name)
      if (useMapWidgetId) {
        getAppStore().dispatch(appActions.requestAutoControlMapWidget(useMapWidgetId, id))
      }
    }
  }, [activeButton, id, useMapWidgetId])

  const isDesignMode = ReactRedux.useSelector((state: IMState) => state.appRuntimeInfo.appMode === AppMode.Design)
  const isClosed = ReactRedux.useSelector((state: IMState) => state.widgetsRuntimeInfo[id].state === WidgetState.Closed)
  const isControlMapWidget = ReactRedux.useSelector((state: IMState) => state.mapWidgetsInfo[useMapWidgetId]?.autoControlWidgetId === id)
  React.useEffect(() => {
    setActiveButton('')
  }, [arrangement, enableArea, enableDistance, isClosed, isDesignMode, jimuMapView, useMapWidgetId])

  React.useEffect(() => {
    if (!isControlMapWidget) {
      setActiveButton('')
    }
  }, [isControlMapWidget])

  const prevToolRef = React.useRef<MeasurementComponent>(null)
  React.useEffect(() => {
    setHasInput(false)
    // if previous tool is measuring or ready, clear it
    const prevTool = prevToolRef.current
    if (['ready', 'measuring'].includes(prevTool?.state)) {
      prevTool.clear()
    }
    prevToolRef.current = activeTool
    // start measuring when newly set activeTool's state is not measured
    if (activeTool && activeTool.state !== 'measured') {
      activeTool.start()
    }
    const watchProp = reactiveUtils.watch(
      () => {
        const analysis = activeTool?.analysis
        return {
          state: activeTool?.state,
          hasInput: analysis?.type === 'direct-line-measurement' ? !!analysis?.startPoint : !!analysis?.geometry,
        }
      },
      ({ state, hasInput }) => {
        setMeasureState(state || 'disabled')
        setHasInput(hasInput)
      },
      { initial: true }
    )
    return () => {
      watchProp.remove()
    }
  }, [activeTool])

  // configure snapping options when activeTool, disableSnapping changed
  const jimuMapViewRef = hooks.useLatest(jimuMapView)
  React.useEffect(() => {
    const is2d = jimuMapViewRef.current?.view?.type === '2d'
    if (activeTool && activeTool.state === 'ready' && is2d && 'snappingOptions' in activeTool) {
      // DistanceMeasurement2D and AreaMeasurement2D disabled snapping by default
      if (disableSnapping) {
        activeTool.snappingOptions = new SnappingOptions({ enabled: false })
      } else {
        const featureSources = jimuMapViewRef.current.getSnappingLayers()
          .map(layer => ({enabled: true, layer}))
        const snappingOptions = {
          enabled: true,
          selfEnabled: true,
          gridEnabled: true,
          featureEnabled: true,
          featureSources
        }
        activeTool.snappingOptions = new SnappingOptions(snappingOptions)
      }
    }
  }, [activeTool, disableSnapping, jimuMapViewRef])

  const isToolbarArrangement = arrangement === MeasurementArrangement.Toolbar
  const popperRef = React.useRef<HTMLDivElement>(null)
  React.useEffect(() => {
    // popper keep same width with root
    if (rootRef.current && popperRef.current && isToolbarArrangement && !isDesignMode) {
      popperRef.current.style.width = rootRef.current.offsetWidth + 'px'
    }
  }, [isToolbarArrangement, isDesignMode, rootRef])

  const originIsClickHighlight = React.useMemo(() => jimuMapView?.isClickHighlightEnabled?.(), [jimuMapView])
  React.useEffect(() => {
    if (originIsClickHighlight) {
      if (['ready', 'measuring'].includes(measureState)) {
        jimuMapView.disableClickHighlight()
      } else {
        jimuMapView.enableClickHighlight()
      }
    }
  }, [jimuMapView, measureState, originIsClickHighlight])


  const currentPageId = ReactRedux.useSelector((state: IMState) => state.appRuntimeInfo.currentPageId)
  const originalPageIdRef = React.useRef(currentPageId)
  const isOtherPage = currentPageId !== originalPageIdRef.current

  const handleClear = React.useCallback(() => {
    if (rootRef.current) {
      const activeButtonDom: HTMLButtonElement = rootRef.current.querySelector('.measure-tool.active')
      activeButtonDom && focusElementInKeyboardMode(activeButtonDom)
    }
    activeTool && activeTool.clear()
  }, [activeTool, rootRef])

  const mapComponent2d = jimuMapView?.view?.type === '2d' ? jimuMapView?.mapComponent : null
  const mapComponent3d = jimuMapView?.view?.type === '3d' ? jimuMapView?.mapComponent : null
  const measurementComponent = <>
    <arcgis-distance-measurement-2d
      ref={distance2dRef}
      referenceElement={mapComponent2d}
      hideUnitSelect={isToolbarArrangement}
      onarcgisReady={handleDistanceMeasureReady}
      className={classNames({ 'd-none': !mapComponent2d || activeButton !== 'measureDistance' })}
    ></arcgis-distance-measurement-2d>
    <arcgis-area-measurement-2d
      ref={area2dRef}
      referenceElement={mapComponent2d}
      hideUnitSelect={isToolbarArrangement}
      onarcgisReady={handleAreaMeasureReady}
      className={classNames({ 'd-none': !mapComponent2d || activeButton !== 'measureArea' })}
    ></arcgis-area-measurement-2d>
    <arcgis-direct-line-measurement-3d
      ref={directLine3dRef}
      referenceElement={mapComponent3d}
      hideUnitSelect={isToolbarArrangement}
      onarcgisReady={handleDistanceMeasureReady}
      className={classNames({ 'd-none': !mapComponent3d || activeButton !== 'measureDistance' })}
    ></arcgis-direct-line-measurement-3d>
    <arcgis-area-measurement-3d
      ref={area3dRef}
      referenceElement={mapComponent3d}
      hideUnitSelect={isToolbarArrangement}
      onarcgisReady={handleAreaMeasureReady}
      className={classNames({ 'd-none': !mapComponent3d || activeButton !== 'measureArea' })}
    ></arcgis-area-measurement-3d>
  </>

  return <React.Fragment>
    <MeasureTools
      ref={rootRef}
      config={config}
      context={context}
      activeButton={activeButton}
      onSelectTool={handleSelectTool}
      onChangeDistanceUnit={handleChangeDistanceUnit}
      onChangeAreaUnit={handleChangeAreaUnit}
      onClear={handleClear}
    />
    {!isToolbarArrangement && <div className='measure-panel' css={getStyle()}>
      {measurementComponent}
      {activeButton === '' && <div aria-label={translate('selectToStart')} className='select-to-start' role='presentation'>
        <Typography component='p' variant='label1' id='selectToStart'>
          {translate('selectToStart')}
        </Typography>
      </div>}
      {activeButton !== '' && (measureState === 'measured' || (measureState === 'measuring' && hasInput)) && <div className='measure-clear'>
        <Button
          type='secondary'
          onClick={handleClear}
          aria-label={translate('clearMeasurement')}
        >
          {translate('clearMeasurement')}
        </Button>
      </div>}
    </div>}
    {isToolbarArrangement && !isDesignMode && <Popper
      className={classNames('bg-paper border-0', { 'd-none': isOtherPage })}
      overflowHidden
      reference={rootRef.current}
      placement='bottom-start'
      open={activeButton !== ''}
      keepMount={true}
      shiftOptions={shiftOptions}
      flipOptions={flipOptions}
      offsetOptions={5}
      css={getPopperStyle()}
    >
      <div ref={popperRef} className='measure-popper'>
        {measurementComponent}
      </div>
    </Popper>}
  </React.Fragment>
}
