import { type IMThemeVariables, css, type SerializedStyles } from 'jimu-core'

export function getStyle (theme: IMThemeVariables): SerializedStyles {
  return css`
    /*min-width: 300px;*/
    .tool-header {
      color: var(--sys-color-surface-overlay-text);

      .label {
        font-weight: 600;
        font-size: 1rem;
      }
    }

    .api-loader {
      position: absolute;
      height: 50%;
      left: 50%;
      z-index: 1;
    }

    .tool-content {
      min-width: 270px;
      min-height: 36px;
      overflow: auto;
      height: calc(100% - 30px);

      .esri-widget__heading {
        display: none;
      }

      /* min-height of widgets, for popper placement ,#13159 */
      .daylight-container {
        min-height: 200px;
      }
      .weather-container {
        min-height: 124px;
      }
      .shadowcast-container {
        min-height: 341px;
      }
      .lineofsight-container {
        min-height: 56px;
      }
      .slice-container {
        min-height: 56px;
      }

      .tool-footer {
        button {
          /*color: var(--sys-color-action);
          border: 1px solid var(--sys-color-action);*/
        }
      }

    }
  `
}
