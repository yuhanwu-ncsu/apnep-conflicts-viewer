/** @jsx jsx */
import { type IMThemeVariables, React, css, getAppStore, jsx, polished } from 'jimu-core'
import { FloatingPanel } from 'jimu-ui'
import type Widget from '../widget'
import { useTheme } from 'jimu-theme'
import type { LayerListItemType } from '../types'
import 'arcgis-map-components'

interface Props {
  widget: Widget
  listItem: LayerListItemType
}

type ScaleRangeSliderElement = HTMLElement & {
  view?: __esri.MapView | __esri.SceneView
  layer?: __esri.Layer
  region?: __esri.ScaleRangeSliderProperties['region']
  minScale?: number
  maxScale?: number
  destroy?: () => Promise<void>
}

const validRegions = [
  'AE', 'AR', 'AT', 'AU', 'BE', 'BG', 'BO', 'BR', 'CA', 'CH', 'CI', 'CL', 'CN', 'CO', 'CR', 'CZ', 'DE',
  'DK', 'EE', 'EG', 'ES', 'FI', 'FR', 'GB', 'GL', 'GR', 'GT', 'HK', 'ID', 'IE', 'IL', 'IN', 'IQ', 'IS', 'IT',
  'JP', 'KE', 'KR', 'KW', 'LI', 'LT', 'LU', 'LV', 'MA', 'MG', 'ML', 'MO', 'MX', 'MY', 'NI', 'NL', 'NO', 'NZ',
  'PE', 'PL', 'PR', 'PT', 'RO', 'RU', 'RW', 'SE', 'SG', 'SK', 'SR', 'SV', 'TH', 'TN', 'TW', 'US', 'VE', 'VI', 'ZA'
]

export const getScaleRegion = (locale?: string): __esri.ScaleRangeSliderProperties['region'] => {
  const region = locale?.split('-')?.pop()?.toUpperCase()
  return region && validRegions.includes(region) ? region as __esri.ScaleRangeSliderProperties['region'] : 'US'
}

const { useState, useCallback, useRef, useEffect } = React

const getStyle = (theme: IMThemeVariables) => {
  return css`
    .visibility-range-container {
      min-width: 342px;
      .visibility-range-panel-title {
        display: block;
        -webkit-box-orient: vertical;
        word-break: break-all;
        white-space: normal;
        -webkit-line-clamp: 1;
        font-size: ${polished.rem(14)};
        padding: 1rem 1rem 0 1rem;
      }
      .scale-range-slider-container {
        padding: 1rem;
        arcgis-scale-range-slider {
          --calcite-button-text-color: var(--sys-color-surface-overlay-text);
          --calcite-dropdown-item-background-color-hover: var(--sys-color-action-hover);
          --arcgis-scale-range-slider-segment-color: var(--sys-color-action-selected);
          display: block;
          background-color: unset;
          color: unset;
          font-family: ${theme.sys.typography.body.fontFamily};
        }
      }
    }
  `
}

export default function VisibilityRangeSlider (props: Props) {
  const { widget, listItem } = props
  const [isOpen, setIsOpen] = useState(true)
  const sliderContainerRef = useRef<HTMLDivElement>(null)
  const theme = useTheme()

  useEffect(() => {
    const container = sliderContainerRef.current
    if (!container) {
      return
    }

    const scaleRangeSlider = document.createElement('arcgis-scale-range-slider') as ScaleRangeSliderElement
    scaleRangeSlider.className = 'scale-range-slider'
    scaleRangeSlider.view = widget.jmvFromMap.view
    scaleRangeSlider.layer = listItem.layer as __esri.Layer
    scaleRangeSlider.region = getScaleRegion(getAppStore().getState()?.appContext?.locale)

    const onScalePropertyChange = (event: CustomEvent<{ name: string }>) => {
      if (event.detail?.name === 'minScale' || event.detail?.name === 'maxScale') {
        const layer = listItem.layer as any
        layer.minScale = scaleRangeSlider.minScale
        layer.maxScale = scaleRangeSlider.maxScale
      }
    }

    scaleRangeSlider.addEventListener('arcgisPropertyChange', onScalePropertyChange as EventListener)
    container.replaceChildren(scaleRangeSlider)

    return () => {
      scaleRangeSlider.removeEventListener('arcgisPropertyChange', onScalePropertyChange as EventListener)
      scaleRangeSlider.remove()
      scaleRangeSlider.destroy?.()
    }
  }, [listItem.layer, widget.jmvFromMap.view])

  const onHeaderClose = useCallback(() => {
    setIsOpen(false)
    widget.setState({ nativeActionPopper: null })
  }, [widget])

  return (
    <FloatingPanel
      toggle={(event, type) => { type !== 'clickOutside' && onHeaderClose() }}
      headerTitle={widget.translate('visibilityRange')}
      reference={widget.optionBtnRef.current}
      open={isOpen}
      className='visibility-range-panel'
      autoSize
      onHeaderClose={onHeaderClose}
      css={getStyle(theme)}
    >
      <div className='visibility-range-container'>
        <span title={listItem.layer.title} className='visibility-range-panel-title'>{listItem.layer.title}</span>
        <div className='scale-range-slider-container'>
          <div ref={sliderContainerRef}></div>
        </div>
      </div>
    </FloatingPanel>
  )
}
