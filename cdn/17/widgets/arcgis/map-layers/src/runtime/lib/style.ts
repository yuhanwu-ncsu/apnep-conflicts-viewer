import { type IMThemeVariables, css, type SerializedStyles } from 'jimu-core'
import { utils } from 'jimu-theme'
import type { IMConfig } from '../../config'

export function getStyle (theme: IMThemeVariables, widgetConfig: IMConfig): SerializedStyles {
  const bodyFontFamily = utils.normalizeFontFamily(theme.sys.typography.body.fontFamily)

  return css`
    overflow: auto;
    .widget-layerlist {
      width: 100%;
      height: 100%;
      min-height: 32px;
      overflow-x: hidden;

      arcgis-layer-list {
        // Set the background color to transparent, let the Paper component decide the color
        --calcite-list-background-color: transparent;
      }

      --calcite-dropdown-background-color: var(--sys-color-surface-overlay);

      // Drag handler popper text
      --calcite-dropdown-item-text-color: var(--sys-color-surface-overlay-text);
      --calcite-dropdown-group-title-text-color: var(--sys-color-surface-overlay-text);
      --calcite-dropdown-item-background-color-hover: rgba(0, 0, 0, 0.2);
      --calcite-dropdown-item-text-color-press: var(--sys-color-surface-overlay-text);

      // Action hover text color, it should stay the same
      --calcite-color-text-1: var(--sys-color-action-text);
      // Action hover bg opacity
      --calcite-color-transparent-hover: rgba(0, 0, 0, 0.2);

      --calcite-list-background-color-hover: rgba(0, 0, 0, 0.2);

      // Action elements color
      --calcite-color-text-3: var(--sys-color-action-text);
      // ListItem color
      --calcite-list-label-text-color: var(--sys-color-surface-paper-text);
      // Action button color
      // Checkbox color and ... button color
      --calcite-action-text-color: var(--sys-color-surface-paper-text);
      --calcite-font-family: ${bodyFontFamily};

      // Let the Paper component decide the color
      --calcite-list-background-color: transparent;

      // Legend background
      --calcite-color-foreground-1: transparent;

      calcite-flow {
        calcite-flow-item {
          background: transparent;
          // Hover background border radius
          --calcite-corner-radius-sharp: 0;
        }
      }

      calcite-action {
        // Disabled Legend button's background
        --calcite-color-foreground-1: transparent;
        --calcite-opacity-disabled: 0.2;
      }

      calcite-list-item {
        --calcite-color-foreground-2: rgba(0, 0, 0, 0.2);
      }

      .esri-layer-list__item-action {
        outline-offset: -2px;
      }

      .table-list-divider {
        border-block-start: 1px solid var(--sys-color-divider-secondary);
        font-size: var(--calcite-font-size-0);
        font-weight: 500;
        padding: 20px 12px;
        height: 28px;
      }
    }
  `
}
