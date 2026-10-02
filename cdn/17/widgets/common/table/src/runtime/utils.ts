import { css, privilegeUtils, type IMThemeVariables, type SerializedStyles } from 'jimu-core'

/**
 * Function to get global table tool css
 * @param {IMThemeVariables} theme used theme
 * @returns {SerializedStyles} style for table tool
 */
export function getGlobalTableTools (theme: IMThemeVariables): SerializedStyles {
  return css`
    .esri-button-menu__item .esri-button-menu__item-label{
      padding: 4px 15px !important;
    }
    .table-popup-search{
      .search-icon{
        z-index: 2;
      }
      .popup-search-input{
        border-radius: 2px;
        .input-wrapper{
          height: 30px;
        }
      }
    }
    .table-action-option{
      width: 100%;
      display: inline-flex;
      flex-direction: row;
      .table-action-option-tab{
        margin: auto 8px;
      }
      .table-action-option-close{
        flex: 1;
        button{
          :hover {
            color: ${theme.sys.color.action.default};
          }
          float: right;
        }
      }
    }
    .esri-popover--open{
      z-index: 1005 !important;
      .esri-date-picker__calendar{
        background-color: ${theme.sys.color.action.default};
      }
    }
  `
}

export const getPrivilege = async () => {
  const exbAccess = await privilegeUtils.checkExbAccess(privilegeUtils.CheckTarget.Experience)
  return exbAccess?.capabilities?.canEditFeature
}

export const minusStringArray = (array1: string[], array2: string[]) => {
  const lengthFlag = array1.length > array2.length
  const arr1 = lengthFlag ? array1 : array2
  const arr2 = lengthFlag ? array2 : array1
  return arr1.filter(item => {
    const hasField = arr2.some(ele => {
      return ele === item
    })
    return !hasField
  })
}

export const areArraysEqual = (arr1: string[], arr2: string[]) =>{
  if (arr1.length !== arr2.length) return false
  return arr1.every((value, index) => value === arr2[index])
}
