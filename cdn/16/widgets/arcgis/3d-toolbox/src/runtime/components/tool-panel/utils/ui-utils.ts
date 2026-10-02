export const isSliceExcludeLayerUI = (layersMode): boolean => {
  let isSliceExcludeLayerUIFlag = false // exclude layer UI
  if (layersMode === 'exclude') {
    isSliceExcludeLayerUIFlag = true
  } else if (layersMode === 'none') {
    isSliceExcludeLayerUIFlag = false
  }

  return isSliceExcludeLayerUIFlag
}

export const isInNewSlicingUI = (state, isActive): boolean => {
  let isInNewSlicingUIFlag = false
  if (state === 'ready' && isActive) {
    isInNewSlicingUIFlag = true
  }

  return isInNewSlicingUIFlag
}

type ReadyWidgetElement = HTMLElement & {
  componentOnReady?: () => Promise<unknown>
}


export const setCustomStyleForWidget = async (widget: HTMLElement, customStyle?: React.CSSProperties) => {
  if (!widget) {
    return
  }

  // set default style for widget
  widget.classList.add('w-100')
  widget.style.setProperty('--arcgis-internal-padding', '12px 15px')

  try {
    await (widget as ReadyWidgetElement).componentOnReady?.()
    const esriWidget = widget.shadowRoot?.querySelector<HTMLElement>('.esri-widget')
    if (esriWidget) {
      esriWidget.style.setProperty('background-color', 'initial')
    }
  } catch (e) {
    console.error('Failed to set default style for widget', e)
  }


  // override default style with custom style
  if (customStyle) {
    Object.keys(customStyle).forEach((key) => {
      widget.style.setProperty(key, customStyle[key])
    })
  }

}