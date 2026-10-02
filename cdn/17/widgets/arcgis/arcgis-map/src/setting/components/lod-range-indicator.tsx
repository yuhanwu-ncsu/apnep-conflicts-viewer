import { React, css, clamp, classNames, hooks, loadArcGISJSAPIModule } from 'jimu-core'
import type { ScaleRange } from '../../config'
import defaultMessages from '../translations/default'
import type ScaleRangeSliderViewModel from '@arcgis/core/widgets/ScaleRangeSlider/ScaleRangeSliderViewModel.js'

interface LodRangeIndicatorProps {
  mapName: string
  scaleRangeSlider: HTMLArcgisSliderScaleRangeElement
  scaleRangleLimit: ScaleRange
  lodScaleRange: ScaleRange
  className?: string
}

export function LodRangeIndicator (props: LodRangeIndicatorProps) {
  const scaleRangeSlider = props.scaleRangeSlider
  const scaleRangleLimit = props.scaleRangleLimit
  const minScaleLimit = scaleRangleLimit?.minScale
  const maxScaleLimit = scaleRangleLimit?.maxScale
  const lodScaleRange = props.lodScaleRange
  const lodMinScale = lodScaleRange?.minScale
  const lodMaxScale = lodScaleRange?.maxScale
  const mapName = props.mapName
  const minScale = scaleRangeSlider?.minScale
  const maxScale = scaleRangeSlider?.maxScale
  const referenceElement = scaleRangeSlider?.referenceElement as (HTMLArcgisMapElement | HTMLArcgisSceneElement)
  const view: ScaleRangeSliderViewModel['view'] = referenceElement?.view

  const [, setIsScaleRangeSliderViewModelClassLoaded] = React.useState<boolean>(false)
  const ScaleRangeSliderViewModelClassRef = React.useRef<typeof ScaleRangeSliderViewModel>(null)
  const scaleRangeSliderViewModelRef = React.useRef<ScaleRangeSliderViewModel>(null)

  React.useEffect(() => {
    let destroyed = false

    async function doJob () {
      const ScaleRangeSliderViewModelClass = await loadArcGISJSAPIModule('esri/widgets/ScaleRangeSlider/ScaleRangeSliderViewModel')

      if (!destroyed) {
        ScaleRangeSliderViewModelClassRef.current = ScaleRangeSliderViewModelClass
        setIsScaleRangeSliderViewModelClassLoaded(true)
      }
    }

    doJob()

    return () => {
      destroyed = true
    }
  }, [])

  updateScaleRangeSliderViewModelRef(
    scaleRangeSliderViewModelRef,
    ScaleRangeSliderViewModelClassRef.current,
    view,
    minScaleLimit,
    maxScaleLimit,
    minScale,
    maxScale
  )

  React.useEffect(() => {
    return () => {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      const viewModel = scaleRangeSliderViewModelRef.current

      if (viewModel && !viewModel.destroyed) {
        viewModel.destroy()
      }
    }
  }, [])

  const scaleRangeSliderViewModel = scaleRangeSliderViewModelRef.current
  const sliderViewModel = scaleRangeSliderViewModel?.sliderViewModel
  let isValid = false
  let leftRatio = 0
  let rightRatio = 0

  if (
    isValidScale(minScaleLimit) &&
    isValidScale(maxScaleLimit) &&
    minScaleLimit > maxScaleLimit &&
    isValidScale(lodMinScale) &&
    isValidScale(lodMaxScale) &&
    lodMinScale >= lodMaxScale &&
    scaleRangeSliderViewModel &&
    scaleRangeSliderViewModel.view &&
    !scaleRangeSliderViewModel.destroyed &&
    sliderViewModel
  ) {
    isValid = true
    const finalLodMinScale = clamp(lodMinScale, maxScaleLimit, minScaleLimit)
    const finalLodMaxScale = clamp(lodMaxScale, maxScaleLimit, minScaleLimit)
    const sliderMaxValue = sliderViewModel.max
    // slider length from left lod anchor to component left
    const distFromLeftLodAnchorToComponentLeft = scaleRangeSliderViewModel.mapScaleToSlider(finalLodMinScale)
    // slider length from right lod anchor to component left
    const distFromRightLodAnchorToComponentLeft = scaleRangeSliderViewModel.mapScaleToSlider(finalLodMaxScale)
    leftRatio = clamp(distFromLeftLodAnchorToComponentLeft / sliderMaxValue * 100, 0, 100)
    rightRatio = clamp(distFromRightLodAnchorToComponentLeft / sliderMaxValue * 100, 0, 100)
  }

  const translate = hooks.useTranslation(defaultMessages)
  const mapLabel = mapName ? translate('hoverMapName', {
    mapName
  }) : ''

  const style = css`
    position: relative;
    height: 8px;

    .full-line {
      position: absolute;
      width: 100%;
      height: 2px;
      top: 3px;
      background: var(--ref-palette-neutral-600);
    }

    .lod-segment {
      position: absolute;
      height: 2px;
      top: 3px;
      left: ${leftRatio}%;
      right: ${100 - rightRatio}%;
      background: var(--ref-palette-neutral-900);
    }

    .lod-anchor {
      position: absolute;
      width: 2px;
      height: 8px;
      background: var(--ref-palette-neutral-900);
    }

    .left-lod-anchor {
      left: ${leftRatio}%;
      right: auto;
      margin-left: 0px;
    }

    .right-lod-anchor {
      left: ${rightRatio}%;
      right: auto;
      margin-left: 0px;
    }
  `

  return (
   <div className={classNames('lod-range-indicator', props.className)} css={style} title={mapLabel}>
     <div className='full-line'></div>
     {
      isValid &&
      <React.Fragment>
        <div className='lod-segment'></div>
        <div className='lod-anchor left-lod-anchor'></div>
        <div className='lod-anchor right-lod-anchor'></div>
      </React.Fragment>
     }
   </div>
  )
}

function isValidScale (scale: number): boolean {
  return typeof scale === 'number' && scale >= 0
}

// eslint-disable-next-line max-params
function updateScaleRangeSliderViewModelRef (
  ref: React.RefObject<ScaleRangeSliderViewModel>,
  ScaleRangeSliderViewModelClass: typeof ScaleRangeSliderViewModel,
  view: ScaleRangeSliderViewModel['view'],
  minScaleLimit: number,
  maxScaleLimit: number,
  minScale: number,
  maxScale: number
) {
  if (ref.current) {
    const scaleRangeSliderViewModel = ref.current

    if (scaleRangeSliderViewModel.view !== view) {
      scaleRangeSliderViewModel.view = view
    }

    if (scaleRangeSliderViewModel.minScaleLimit !== minScaleLimit) {
      scaleRangeSliderViewModel.minScaleLimit = minScaleLimit
    }

    if (scaleRangeSliderViewModel.maxScaleLimit !== maxScaleLimit) {
      scaleRangeSliderViewModel.maxScaleLimit = maxScaleLimit
    }

    if (scaleRangeSliderViewModel.minScale !== minScale) {
      scaleRangeSliderViewModel.minScale = minScale
    }

    if (scaleRangeSliderViewModel.maxScale !== maxScale) {
      scaleRangeSliderViewModel.maxScale = maxScale
    }
  } else if (ScaleRangeSliderViewModelClass && view) {
    ref.current = new ScaleRangeSliderViewModelClass({
      maxScale,
      maxScaleLimit,
      minScale,
      minScaleLimit,
      view
    })
  }
}
