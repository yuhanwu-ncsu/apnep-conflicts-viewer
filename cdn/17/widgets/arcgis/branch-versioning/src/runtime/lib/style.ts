import { css, type SerializedStyles, FixedPosition } from 'jimu-core'
import { LayoutItemSizeModes } from 'jimu-layouts/layout-runtime'

// =============================================================================
// ACTION BAR STYLES
// =============================================================================

/** Style for discard action with error color */
export function getDiscardActionStyle (): SerializedStyles {
  return css`--calcite-ui-icon-color: var(--sys-color-error-main);`
}

/** Style for action tooltip with pre-wrap text */
export function getActionTooltipStyle (): SerializedStyles {
  return css`
    span {
      white-space: pre;
    }
  `
}

// =============================================================================
// FLOATING ACTION BAR STYLES
// =============================================================================

/** Base style for action bar */
export const actionBarStyle = css`
  width: 100%;
  background: var(--calcite-color-foreground-1);
  min-width: max-content;
`

/** Get CSS styles for positioning the floating action bar */
export function getPositionStyle (position: FixedPosition): SerializedStyles {
  switch (position) {
    case FixedPosition.TopLeft:
      return css`top: 0; left: 0; bottom: auto; right: auto;`
    case FixedPosition.TopRight:
      return css`top: 0; left: auto; bottom: auto; right: 0;`
    case FixedPosition.BottomLeft:
      return css`top: auto; left: 0; bottom: 0; right: auto;`
    case FixedPosition.BottomRight:
      return css`top: auto; left: auto; bottom: 0; right: 0;`
    case FixedPosition.TopCenter:
      return css`top: 0; left: 50%; bottom: auto; right: auto;`
    case FixedPosition.BottomCenter:
      return css`top: auto; left: 50%; bottom: 0; right: auto;`
    case FixedPosition.MiddleLeft:
      return css`top: 50%; left: 0; bottom: auto; right: auto;`
    case FixedPosition.MiddleRight:
      return css`top: 50%; left: auto; bottom: auto; right: 0;`
    case FixedPosition.MiddleCenter:
      return css`top: 50%; left: 50%; bottom: auto; right: auto;`
  }
}

/** Calculate CSS transform for floating action bar based on position and offsets */
export function getTransform (position: FixedPosition, offsetX: number, offsetY: number, widthMode?: string, heightMode?: string): string {
  let transform = ''

  if (widthMode !== LayoutItemSizeModes.Stretch) {
    if (offsetX !== 0) {
      transform = `translateX(${offsetX}px)`
    }
    if (position === FixedPosition.TopCenter || position === FixedPosition.MiddleCenter || position === FixedPosition.BottomCenter) {
      transform = transform ? `${transform} translateX(-50%)` : 'translateX(-50%)'
    }
  }

  if (heightMode !== LayoutItemSizeModes.Stretch) {
    if (offsetY !== 0) {
      transform = transform ? `${transform} translateY(${offsetY}px)` : `translateY(${offsetY}px)`
    }
    if (position === FixedPosition.MiddleLeft || position === FixedPosition.MiddleCenter || position === FixedPosition.MiddleRight) {
      transform = transform ? `${transform} translateY(-50%)` : 'translateY(-50%)'
    }
  }

  return transform
}

/** Get CSS styles for the floating action bar wrapper */
export function getFloatingWrapperStyle (
  position: FixedPosition,
  offsetX: number,
  offsetY: number,
  width: string,
  height: string,
  panelJson: any
): SerializedStyles {
  const positionStyle = getPositionStyle(position)
  const transform = getTransform(position, offsetX, offsetY, panelJson.widthMode, panelJson.heightMode)

  let widthModeStyle
  let heightModeStyle

  if (panelJson.widthMode === LayoutItemSizeModes.Stretch) {
    widthModeStyle = css`width: 100%; left: ${panelJson.left}; right: ${panelJson.right};`
  }

  if (panelJson.heightMode === LayoutItemSizeModes.Stretch) {
    heightModeStyle = css`height: 100%; top: ${panelJson.top}; bottom: ${panelJson.bottom};`
  }

  return css`
    ${positionStyle}
    position: fixed;
    width: ${width};
    height: ${height};
    ${widthModeStyle}
    ${heightModeStyle}
    transform: ${transform};
    cursor: move;
    pointer-events: auto;
    z-index: 1000;
  `
}

// =============================================================================
// VERSION MANAGEMENT COMPONENT STYLES
// =============================================================================

/** Style for calcite shell panel */
export function getShellPanelStyle (): SerializedStyles {
  return css`
    --calcite-shell-panel-max-height: 100%;
    --calcite-shell-panel-max-width: 100%;
  `
}

/** Style for calcite scrim with semi-transparent background */
export function getScrimStyle (): SerializedStyles {
  return css`
    --calcite-scrim-background: color-mix(in srgb, var(--sys-color-surface-paper) 50%, transparent);
  `
}

/** Style for arcgis-branch-versioning component */
export function getVersionManagementComponentStyle (): SerializedStyles {
  return css`
    width: 100%;
    height: 100%;
    min-width: 100%;
    min-height: 100%;
    display: block;
  `
}
