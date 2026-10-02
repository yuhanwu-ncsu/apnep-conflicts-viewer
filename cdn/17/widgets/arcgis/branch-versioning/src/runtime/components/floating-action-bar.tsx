/** @jsx jsx */
import { React, jsx, type IMState, ReactRedux, AppMode, FixedPosition } from 'jimu-core'
import { DEFAULT_FLOATING_LAYOUT_STYLE, LayoutType } from '../../config'
import { getAppConfigAction } from 'jimu-for-builder'
import { LayoutItemSizeModes } from 'jimu-layouts/layout-runtime'
import { ActionBar } from './action-bar'
import { actionBarStyle, getFloatingWrapperStyle } from '../lib/style'
import type { IMConfig } from '../../config'
import ReactDOM from 'react-dom'

export interface FloatingActionBarProps {
  widgetId: string
  config: IMConfig
}

export const FloatingActionBar = (props: FloatingActionBarProps) => {
  const { widgetId, config } = props

  const isInBuilder = ReactRedux.useSelector((state: IMState) => state.appContext.isInBuilder)
  const appMode = ReactRedux.useSelector((state: IMState) => state.appRuntimeInfo.appMode)
  const isBuilder = isInBuilder && appMode !== AppMode.Run

  const nodeRef = React.useRef<HTMLDivElement>(null)
  const [isDragging, setIsDragging] = React.useState(false)
  const [dragStartPos, setDragStartPos] = React.useState({ x: 0, y: 0 })
  const [tempOffset, setTempOffset] = React.useState<{ x: number; y: number } | null>(null)

  const panelJson = config.editToolBar?.floatingPanelJson || DEFAULT_FLOATING_LAYOUT_STYLE
  const position = panelJson.position || FixedPosition.TopRight
  const offsetX = panelJson.offsetX || 0
  const offsetY = panelJson.offsetY || 0
  const width = panelJson.widthMode === LayoutItemSizeModes.Stretch ? '100%' : panelJson.width || '375px'
  const height = panelJson.heightMode === LayoutItemSizeModes.Stretch ? '100%' : panelJson.height || '75px'

  // Use temp offset during dragging for smooth updates, otherwise use config values
  const currentOffsetX = tempOffset?.x ?? offsetX
  const currentOffsetY = tempOffset?.y ?? offsetY

  // Handle mouse down event to start dragging
  const handleMouseDown = React.useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    setIsDragging(true)
    setDragStartPos({
      x: e.clientX,
      y: e.clientY
    })
  }, [])

  // Handle mouse move event to update position during dragging
  const handleMouseMove = React.useCallback((e: MouseEvent) => {
    if (!isDragging) return

    // Calculate delta from drag start position
    const deltaX = e.clientX - dragStartPos.x
    const deltaY = e.clientY - dragStartPos.y

    // Update local state for smooth dragging
    setTempOffset({
      x: offsetX + deltaX,
      y: offsetY + deltaY
    })
  }, [isDragging, dragStartPos, offsetX, offsetY])

  // Handle mouse up event to stop dragging
  const handleMouseUp = React.useCallback(() => {
    setIsDragging(false)

    // Save to config only in builder mode
    if (isBuilder && tempOffset) {
      const currentPanel = config.editToolBar?.floatingPanelJson || DEFAULT_FLOATING_LAYOUT_STYLE
      const updatedPanel = {
        ...currentPanel,
        offsetX: Math.round(tempOffset.x),
        offsetY: Math.round(tempOffset.y)
      }
      const newConfig = config.setIn(['editToolBar', 'floatingPanelJson'], updatedPanel)
      getAppConfigAction().editWidgetConfig(widgetId, newConfig).exec()
    }

    // In live mode, just clear temp offset (position resets on refresh)
    if (!isBuilder) {
      // Keep the temp offset for the session but don't save
    } else {
      setTempOffset(null)
    }
  }, [isBuilder, tempOffset, config, widgetId])

  // Handle dragging of the floating action bar
  React.useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
      return () => {
        document.removeEventListener('mousemove', handleMouseMove)
        document.removeEventListener('mouseup', handleMouseUp)
      }
    }
  }, [isDragging, handleMouseMove, handleMouseUp])

  // Get CSS styles for the floating action bar wrapper
  const wrapperStyle = React.useMemo(() => {
    return getFloatingWrapperStyle(position, currentOffsetX, currentOffsetY, width, height, panelJson)
  }, [position, currentOffsetX, currentOffsetY, width, height, panelJson])

  // Get CSS class for the floating action bar based on layout type
  const className = React.useMemo(() => {
    if (config.editToolBar.layoutType === LayoutType.VERTICAL) {
      return 'action-bar-container h-100 w-auto'
    } else {
      return 'action-bar-container w-100 h-auto'
    }
  }, [config.editToolBar.layoutType])

  // Render the floating action bar
  const content = (
    <div
      ref={nodeRef}
      css={wrapperStyle}
      className="floating-action-bar-wrapper"
      onMouseDown={handleMouseDown}
    >
      <ActionBar
        config={config}
        css={actionBarStyle}
        className={className}
        floating
      />
    </div>
  )
  const container = document.fullscreenElement || document.body
  return ReactDOM.createPortal(content, container)
}
