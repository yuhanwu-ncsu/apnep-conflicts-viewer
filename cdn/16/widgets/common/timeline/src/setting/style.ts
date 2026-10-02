import { type IMThemeVariables, css, type SerializedStyles, polished } from 'jimu-core'

export function getStyleForTimePanel (theme: IMThemeVariables): SerializedStyles {
  return css`
    height: calc(100% - ${polished.rem(50)});
    overflow: auto;

    .date-label {
      color: ${theme.ref.palette.neutral[1000]};
    }
    .time-step-details {
      margin-top: 0.75rem !important;
    }
  `
}

export function getStyleForWidget (theme: IMThemeVariables): SerializedStyles {
  return css`
    &.show-disabled-mask {
      position: relative;
      overflow-y: hidden;
      .disabled-mask {
        position: absolute;
        top: 0;
        background-color: transparent;
        .mask-bg {
          width: 100%;
          height: 100%;
          background-color: #000;
          opacity: 0.5;
        }
        .alert-container {
          position: absolute;
          left: 10px;
          top: 16px;
        }
      }
    }

    .style-container{
      display: flex;
      justify-content: space-between;
      .jimu-btn {
        padding: 0;
        background: ${theme.ref.palette.neutral[300]};
        &.active{
          background: ${theme.ref.palette.neutral[300]};
          outline: 2px solid ${theme.sys.color.primary.main};
        }
      }
    }
    .autoplay-label{
      color: ${theme.ref.palette.neutral[900]};
    }

    .empty-placeholder {
      display: flex;
      flex-flow: column;
      justify-content: center;
      height: calc(100vh - 552px);
      overflow: hidden;
      &.add-ds-by-data {
        height: calc(100vh - 565px);
      }
      .empty-placeholder-inner {
        padding: 0px 16px;
        flex-direction: column;
        align-items: center;
        display: flex;
        .empty-placeholder-text {
          color: ${theme.ref.palette.neutral[1000]};
          font-size: ${polished.rem(14)};
          margin-top: 16px;
          text-align: center;
        }
        .empty-placeholder-icon {
          color: ${theme.ref.palette.neutral[800]};
        }
      }
    }

    .honor-label {
      color: ${theme.ref.palette.neutral[1100]};
    }
  `
}

export function getRowLabelStyle (width: number): SerializedStyles {
  return css`
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    width: ${width}px;
  `
}
