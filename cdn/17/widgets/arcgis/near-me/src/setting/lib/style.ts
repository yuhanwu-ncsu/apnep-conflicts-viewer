import { type IMThemeVariables, css, type SerializedStyles, polished } from 'jimu-core'

export function getStyle (theme: IMThemeVariables): SerializedStyles {
  return css`
    .widget-setting-near-me {
      height: 100%;

      .map-selector-section .component-map-selector .form-control {
        width: 100%;
      }

      .nearme-analysis-tooltip {
        margin-bottom: 0rem!important;
        width: 177px;
      }

      .placeholder-container {
        height: calc(100vh - 468px);

        .placeholder {
          flex-direction: column;

          .icon {
            color: var(--ref-palette-neutral-800);
          }

          .hint {
            font-size: ${polished.rem(14)};
            font-weight: 500;
            color: var(--ref-palette-neutral-1000);
            max-width: ${polished.rem(160)};
          }
        }
      }

      .color-label {
        color: ${theme.ref.palette.neutral[900]};
      }

      .jimu-tree {
        width: 100%;
      }

      .data-item {
        display: flex;
        flex: 1;
        padding: 0.5rem 0.6rem;
        line-height: 23px;
        cursor: pointer;

        .data-item-name {
          word-break: break-word;
        }
      }
    }
  `
}

export function getMainSidePopperStyle (theme: IMThemeVariables): SerializedStyles {
  return css`
  .collapsibleLabel {
    margin-bottom: 0rem!important;
  }

  .warningMsg {
    padding: 0.25rem!important;
    margin-top: 20px;
    margin-left: 10px;
  }
`
}

export function getSearchSettingStyle (theme: IMThemeVariables): SerializedStyles {
  return css`
    .cursor-pointer {
      cursor: pointer;
    }

    .switchLabelWidth {
      width: calc(100% - 28px);
    }

    .nm-divider-top {
      border-top: 1px solid var(--ref-palette-neutral-700)
    }

    .color-label {
      color: ${theme.ref.palette.neutral[900]};
    }

    .onlyShowResultsLabel {
      width: calc(100% - 52px);
    }
  `
}

export function getAnalysisSettingStyle (theme: IMThemeVariables): SerializedStyles {
  return css`
  .alignTooltip {
    margin-right: -6px;
  }
  
  .disabled-label{
    color: ${theme.ref.palette.neutral[700]};
  }

  .labelStyle {
    justify-content: left!important;
  }

  .hideTooltip {
    display: none!important;
  }

  .nearme-analysis-list-items {
    .analysis-item {
      padding: 4px 2px 8px 2px;

      .layer-analysis-name {
        font-size: ${polished.rem(14)};
        font-weight: 400;
        flex: 1;
        min-width: 0;
       }

      .analysis-type-name {
        font-size: ${polished.rem(13)};
        padding-top: 10px;
        width: 165px;
      }
    }

    .cursor-pointer {
      cursor: pointer;
    }
  }

  .sort-field-section {
    display: flex;
    align-items: center;
    flex: 1;
    .sort-field-selector {
      background:${theme.sys.color.secondary.light};
      border-radius: 2px;
      flex: 1;
      width: 0
    }

    .order-button {
        cursor: pointer;
        text-align:right;
        margin-left: ${polished.rem(2)};
    }

    .order-button svg {
        margin-right:0;
    }
  }

  .sort-icon {
    & {
        margin-left:5px;
    }

    .sort-button-l {
      border-radius: 2px 0 0 2px;
      border-right:none;
    }

    .sort-button-r {
      border-radius: 0px 2px 2px 0px;
      border-left:none;
    }

    .sort-button {
      border-color: ${theme.sys.color.divider.primary};
    }

    svg {
      margin-right:0;
    }
  }

  .cursor-pointer {
    cursor: pointer;
  }

  .add-summary-field {
    height: ${polished.rem(40)};
    width: 100%;
    color: ${theme.sys.color.primary.light};
    font-size: ${polished.rem(14)};
    cursor: pointer;
    &:hover {
      .add-summary-field-icon-container {
        background-color: ${polished.rgba(theme.sys.color.primary.light, 0.8)};
      }
      color: ${polished.rgba(theme.sys.color.primary.light, 0.8)};
    }
    .add-summary-field-icon-container {
      width: 20px;
      height: 20px;
      background-color: ${theme.sys.color.primary.light};
      border-radius: 10px;
    }
    .add-summary-field-icon {
      color: ${theme.ref.palette.neutral[400]};
    }
  }

  .fieldName {
    width: 180px;
  }

  .nearme-summary-fields-list-items {
    flex: 1;
    max-height: 290px;
    overflow-y: auto;
    margin-bottom: 10px;
    margin-top: 3px;

    .labelAlign {
      width: calc(100% - 65px);
      max-width: 155px;
    }

    .jimu-tree-item.jimu-tree-item_dnd-true {
      height: auto;
      padding-top: 0rem;
  
      .jimu-tree-item__body {
        padding: 4px 0px 4px 0px;
      }
    }
  }

  .colorModesWidth {
    width: calc(100% - 30px);
  }

  .analysisTypeWidth { 
    width: calc(100% - 16px);
  }
  `
}

export function expressAddAnalysisPopperStyle (): SerializedStyles {
  return css`
        /* ========== Layout & Containers ========== */
        .table-wrapper {
          margin: auto;
        }
  
        .common-settings-table-wrapper {
          margin-top: 16px;
          overflow: hidden;
        }
  
        /* ========== Feature Table ========== */
        .feature-table {
          width: 100%;
          border-collapse: collapse;
          background: #2a2a2a;
          border: 1px solid #3a3a3a;
          table-layout: fixed;
        }
  
        /* Table Header */
        .feature-table thead {
          display: table;
          width: 100%;
        }
  
        .feature-table thead tr {
          border: 1px solid #3a3a3a;
        }
  
        .feature-table thead th {
          padding: 12px;
          background: #3a3939;
          border: 1px solid #3a3a3a;
          border-right: 1px solid #3a3a3a;
          border-bottom: 1px solid #3a3a3a;
          font-weight: 600;
          text-align: left;
          overflow: hidden;
        }
  
        .feature-table thead th:last-of-type {
          border-right: none;
        }
  
        .feature-table thead th:first-of-type {
          width: 46%;
        }
  
        .feature-table thead th:nth-of-type(2),
        .feature-table thead th:nth-of-type(3),
        .feature-table thead th:nth-of-type(4) {
          width: 18%;
        }
  
        /* Table Body */
        .feature-table tbody {
          display: block;
          max-height: 250px;
          overflow-y: auto;
        }
  
        .feature-table tbody tr {
          display: table;
          width: 100%;
          table-layout: fixed;
        }
  
        .feature-table .feature-group-row th {
          width: 100% !important;
          padding: 10px 12px;
          border-right: none;
          background: #323232;
          border-bottom: 1px solid #3a3a3a;
        }
  
        .feature-group-label {
          display: block;
          font-weight: 600;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          padding-left: 4px;
          margin: 0;
        }
  
        /* Table Cells */
        .feature-table tbody td,
        .feature-table tbody th[scope='row'] {
          padding: 12px;
          border-right: 1px solid #3a3a3a;
          border-bottom: 1px solid #3a3a3a;
          text-align: left;
          vertical-align: middle;
          background: #2a2a2a;
          font-weight: 400;
        }
  
        .feature-table tbody td:last-of-type {
          border-right: none;
        }
  
        .feature-table tbody tr:not(.feature-group-row) > th[scope='row'] {
          width: 46%;
        }
  
        .feature-table tbody tr:not(.feature-group-row) > td:nth-of-type(1),
        .feature-table tbody tr:not(.feature-group-row) > td:nth-of-type(2),
        .feature-table tbody tr:not(.feature-group-row) > td:nth-of-type(3) {
          width: 18%;
        }
  
        .analysis-cell-control {
          position: relative;
          display: flex;
          width: 100%;
          align-items: center;
          justify-content: center;
          gap: 6px;
          min-height: 24px;
          line-height: 1;
        }
  
        .analysis-cell-control .jimu-checkbox {
          margin: 0;
        }
  
        .analysis-warning-icon {
          position: absolute;
          left: calc(50% + 14px);
          top: 50%;
          transform: translateY(-50%);
          display: inline-flex;
          align-items: center;
        }
  
        /* ========== Feature Table Header Controls ========== */
        .feature-table-header {
          display: grid;
          align-items: center;
          grid-template-columns: 24px minmax(0, 1fr);
          column-gap: 6px;
          width: 100%;
          overflow: hidden;
        }
  
        .feature-table-header.has-info {
          grid-template-columns: 24px minmax(0, 1fr) 16px;
        }
  
        .feature-table-header .jimu-checkbox {
          min-width: 0;
        }
  
        .feature-table-header-label {
          display: block !important;
          min-width: 0;
          max-width: 100%;
          overflow: hidden !important;
          text-overflow: ellipsis !important;
          white-space: nowrap !important;
        }
  
        .feature-table-header-icon {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-width: 0;
          width: 16px;
        }
  
        /* ========== Common Settings Table ========== */
        .common-table {
          width: 100%;
          border-collapse: collapse;
          table-layout: fixed;
          background: #3a3939;
        }
  
        .common-table td {
          padding: 8px 12px;
          text-align: left;
          vertical-align: middle;
          overflow: hidden;
        }
  
        .common-table td:first-of-type {
          width: 55%;
        }
  
        .common-table td:nth-of-type(2) {
          width: 45%;
        }
  
        /* ========== Common Settings Items ========== */
        .common-setting-item {
          display: flex;
          align-items: center;
          gap: 8px;
          min-width: 0;
          width: 100%;
        }
  
        .common-setting-label {
          display: block;
          min-width: 0;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
  
        .common-setting-control {
          display: inline-flex;
          align-items: center;
          flex: 0 0 auto;
        }
  
        .highlight-color-setting {
          display: flex;
          align-items: center;
          gap: 8px;
          min-width: 0;
          width: 100%;
        }
  
        /* ========== Utilities ========== */
        .cursor-pointer {
          cursor: pointer;
        }
  
        /* ========== Heading Styles ========== */
        .analysis-popup-instruction {
          margin: 0 0 16px 0;
          padding: 0;
          font-size: 13px;
          font-weight: 500;
          letter-spacing: 0.2px;
        }
      `
}

export function getGeneralSettingStyle (theme: IMThemeVariables): SerializedStyles {
  return css`
    .jimu-symbol-selector {
      width: 25px;
      height: 25px;
    }

    .promptMessageLabel {
      width: 92%;
      margin-bottom: 0.2rem!important;
    }
  `
}

export function getExpressionBuilderPanelStyle (theme: IMThemeVariables): SerializedStyles {
  return css`
    .component-main-data-and-view {
      display: none;
    }

    .component-expression-builder .expression-editor-helper {
      height: calc(100% - 25px)!important;
    }

    .component-expression-builder .statistics-tab div {
      padding-top: 0px!important;
    }

    .expression-editor-container div {
      padding: 0px!important;
    }

    .component-expression-editor .exp-editor-helper-tab {
      margin-left: 0px!important;
      margin-right: 0px!important;
    }

    .component-field-selector .item-selector-search {
      margin-top: 18px!important;
    }
  `
}

export function getSidePanelStyle (theme: IMThemeVariables): SerializedStyles {
  return css`
    position: absolute;
    top: 0;
    bottom: 0;
    width: 259px;
    height: 100%;
    padding-bottom: 1px;
    border-right: 1px solid ${theme.ref.palette.white};
    border-bottom: 1px solid ${theme.ref.palette.white};

    .setting-container {
      height: calc(100% - 52px);
      overflow: auto;
    }
`
}

export function getColorSelectorStyle (theme: IMThemeVariables): SerializedStyles {
  return css`
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    color: var(--ref-palette-neutral-1100);
    > .color-list {
      width: 100%;
      flex-grow: 1;
      overflow-y: auto;
      max-height: 562px;
    }
    > .footer {
      height: 57px;
      width: 100%;
      border-top: 1px solid #6a6a6a;
      > div {
        display: flex;
        width: 100%;
        justify-content: space-between;
      }
    }

    .colorItemStyle {
      display: flex;
      width: 100%;
      justify-content: space-between;
      label {
        width: 88%;
        flex-grow: 1;
        display: inline-flex;
        justify-content: space-between;
        .label {
          max-width: 70%;
        }
      }
    }
`
}
