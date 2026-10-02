import { type IMThemeVariables, css, type SerializedStyles } from 'jimu-core'
import { type StyleType, type StyleConfig, FontSizeType } from '../../config'

export function getStyle (theme: IMThemeVariables, styleType: StyleType, styleConfig: StyleConfig, isRTL: boolean, autoWidth: boolean, enableNavDS: boolean): SerializedStyles {
  let color
  // useful custom style
  //const backgroundColor = 'transparent'
  const containerColor = styleConfig.backgroundColor ? styleConfig.backgroundColor : theme.sys.color.surface.paper
  const containerOverlayColor = theme.sys.color.surface.overlay
  let fontSizeObj

  const noFountSize = ''
  let fontSizeUnit
  let baseFontSize
  let fontSize = noFountSize
  // useful custom style
  //let fontSizeH1 = noFountSize
  //let fontSizeH2 = noFountSize
  //let fontSizeLtH2 = noFountSize
  //let fontSizeBody = noFountSize
  //let fontSizeSmall = noFountSize
  // let font_size__header_text;

  // useful custom style
  //let isCustomStyle = false
  if (styleType === 'custom') {
    //isCustomStyle = !!styleConfig.textColor
    color = styleConfig.textColor ? styleConfig.textColor : theme.sys.color.surface.paperText
    fontSizeObj = styleConfig.fontSize

    if (fontSizeObj && fontSizeObj.distance !== 0 && styleConfig.fontSizeType !== FontSizeType.auto) {
      fontSizeUnit = fontSizeObj.unit
      baseFontSize = fontSizeObj.distance
      fontSize = baseFontSize + fontSizeUnit
      // useful custom style
      //fontSizeH1 = Math.round(baseFontSize * 1.428) + fontSizeUnit // 1.428em
      //fontSizeH2 = Math.round(baseFontSize * 1.142) + fontSizeUnit // 1.142em
      //fontSizeLtH2 = baseFontSize
      //fontSizeBody = Math.round(baseFontSize * 0.857) + fontSizeUnit // 0.857em
      //fontSizeSmall = Math.round(baseFontSize * 0.857) + fontSizeUnit
      // font_size__header_text = Math.round(baseFontSize * 1.143) + fontSizeUnit; //1.142em
    }
  } else if (styleType === 'syncWithTheme') {
    // baseFontSize = noFountSize
    color = theme.sys.color.surface.paperText
  } else {
    // baseFontSize = noFountSize
    //color = ''
    color = theme.sys.color.surface.paperText
  }
  const dropdownButtonColor = color || theme.sys.color.surface.paperText

  let warningIconRight = '10px'
  let warningIconLeft = 'auto'
  if (isRTL) {
    warningIconRight = 'auto'
    warningIconLeft = '10px'
  }

  // if(fontSizeObj && fontSizeObj.distance !== 0) {
  //  fontSizeUnit = fontSizeObj.unit;
  //  baseFontSize = fontSizeObj.distance;
  //  fontSize = baseFontSize + fontSizeUnit;
  //  fontSizeH1 = Math.round(baseFontSize * 1.428) + fontSizeUnit; //1.428em
  //  fontSizeH2 = Math.round(baseFontSize * 1.142) + fontSizeUnit; //1.142em
  //  fontSizeLtH2 = baseFontSize;
  //  fontSizeBody = Math.round(baseFontSize * 0.857) + fontSizeUnit; //0.857em
  //  fontSizeSmall = Math.round(baseFontSize * 0.857) + fontSizeUnit;
  //  //font_size__header_text = Math.round(baseFontSize * 1.143) + fontSizeUnit; //1.142em
  // } else {
  //  baseFontSize = noFountSize;
  //  fontSize = noFountSize;
  //  fontSizeH1 = noFountSize;
  //  fontSizeH2 = noFountSize;
  //  fontSizeLtH2 = noFountSize;
  //  fontSizeBody = noFountSize;
  //  fontSizeSmall = noFountSize;
  //  //font_size__header_text = 'unset';
  // }

  return css`
    .widget-featureInfo{
      overflow: auto;
      word-break: break-word;
      //border-radius: ${theme.sys.shape.shape2};
      border-radius: 0px;
      //min-width: min-content;
      //min-width: 210px;
      ${enableNavDS ? 'min-width: 210px' : 'min-width: min-content'};
      min-height: 53px;
      ${autoWidth ? 'width: max-content' : ''};
      height: 100%;
      background-color: ${containerColor};
      color: ${color};
      --calcite-color-text-1: ${color};
      --calcite-color-text-2: ${color};
      --calcite-color-text-3: ${color};
      font-size: ${fontSize};
      --calcite-font-size: ${fontSize};
      --calcite-font-size-0: ${fontSize};
      --calcite-font-size-1: ${fontSize};
      --calcite-font-size-2: ${fontSize};
      --calcite-font-size-sm: ${fontSize};
      --calcite-font-size-md: ${fontSize};
      --calcite-font-size-lg: ${fontSize};
      --calcite-color-foreground-1: ${containerColor};
      --calcite-color-foreground-2: ${containerOverlayColor};
      --arcgis-table-row-background-color: color-mix( in srgb, var(--sys-color-divider-primary) 5%, transparent);
      --arcgis-table-row-alt-background-color: color-mix( in srgb, var(--sys-color-divider-primary) 20%, transparent);

      .warning-icon{
        position: absolute;
        bottom: 10px;
        right: ${warningIconRight};
        left: ${warningIconLeft};
      }
      .data-inaccessible {
        display: flex;
        flex-direction: column;
        height: 100%;
        width: 100%;
      }
      .warning-inaccessible{
        width: 100%;
      }
      .header-section{
        //min-width: max-content;
        display: flex;
        justify-content: space-between;
        height: 40px;
        border-bottom: 1px solid #a8a8a8;
        background-color: ${containerColor};
      }
      .nav-section{
        min-width: 0;
        flex-shrink: 0;
        height: 40px;
        background-color: transparent;
        .nav-btn{
          margin: 0 5px;
          //color: ${theme.sys.color.primary.main};
          color: ${color};
        }
        .nav-btn:hover{
          //color: ${theme.sys.color.primary.light};
        }
        .nav-btn:disabled{
          color: ${theme.sys.color.action.disabled.text};
        }
        .nav-btn:focus{
          box-shadow: none;
        }
      }
      .header-operation-section {
        display: flex;
        min-width: 0;
        flex-grow: 2;
        justify-content: flex-end;
      }
      .data-source-selector {
        display: flex;
        min-width: 0;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        height: 40px;
        justify-content: flex-end;
        align-items: center;
        .jimu-dropdown {
          min-width: 0;
          .jimu-dropdown-button {
            //color: ${dropdownButtonColor};
            color: ${color};
          }
        }
        .data-action-dropdown-content{
        }
      }
      .header-control-section{
        min-width: 0;
        flex-shrink: 0;
        display: flex;
        justify-content: flex-end;
        align-items: center;
        height: 40px;
        //flex-grow: 2;
        margin: 0 10px;
        /*
        position: absolute;
        right: 0;
        */
        .clear-selection > button{
          color: ${color};
        }
        .clear-selection > button:disabled{
          color: ${theme.sys.color.action.disabled.text};
        }
      }
    }
  `
}
