import { css, type SerializedStyles } from 'jimu-core'

export function getStyle (): SerializedStyles {
  return css`
    margin: 16px 0;

    .jimu-calcite-timezone {
      --calcite-combobox-input-background-color: var(--sys-color-action-input-field);
      --calcite-combobox-input-border-color: var(--sys-color-action-input-field);
    }
    .jimu-calcite-input-date-picker {
      --calcite-input-date-picker-background-color: var(--sys-color-action-input-field);
      --calcite-input-date-picker-border-color:var(--sys-color-action-input-field);
    }
    .jimu-calcite-timepicker {
      --calcite-input-time-picker-input-background-color: var(--sys-color-action-input-field);
      --calcite-input-time-picker-input-border-color: var(--sys-color-action-input-field);
    }

    .time-period-row {
      display: flex;
      align-items: center;
      width: 100%;
    }

    .time-period-label {
      width: 48px;
      overflow: hidden;
      text-overflow: ellipsis;
      margin-right: 2px;
      text-align: left;
    }

    .time-period-input {
      flex: 0 0 231px;
    }
  `
}