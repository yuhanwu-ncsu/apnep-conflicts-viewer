/** @jsx jsx */
import { hooks, jsx, React } from 'jimu-core'
import { buildEmptyMessage } from '../utils/utils'
import { CalciteScale, MessageType } from '../../config'
import { useBranchVersioningActions, useBranchVersioningState } from '../context/state/branch-versioning-context'
import defaultMessages from '../translations/default'
import ReactDOM from 'react-dom'
import 'calcite-components'

export function MessageDialog () {
  const state = useBranchVersioningState()
  const actions = useBranchVersioningActions()
  const getI18nMessage = hooks.useTranslation(defaultMessages)

  // Determine if the message dialog should be open based on the message type
  const isOpen = React.useMemo(() => {
    return state.message.type === MessageType.SAVE ||
      state.message.type === MessageType.DISCARD ||
      state.message.type === MessageType.RECONCILE_ERROR ||
      state.message.type === MessageType.RECONCILE_NO_ERROR
  }, [state.message])

  // Determine the label for the cancel button based on the message type
  const cancelLabel = React.useMemo(() => {
    switch (state.message.type) {
      case MessageType.SAVE:
      case MessageType.DISCARD:
      case MessageType.RECONCILE_ERROR:
        return getI18nMessage('cancelLabel')
      case MessageType.RECONCILE_NO_ERROR:
        return getI18nMessage('postLaterLabel')
      default:
        return getI18nMessage('cancelLabel')
    }
  }, [state.message.type, getI18nMessage])

  // Determine the label for the ok button based on the message type
  const saveLabel = React.useMemo(() => {
    switch (state.message.type) {
      case MessageType.SAVE:
        return getI18nMessage('saveLabel')
      case MessageType.DISCARD:
        return getI18nMessage('discardLabel')
      case MessageType.RECONCILE_ERROR:
        return getI18nMessage('okLabel')
      case MessageType.RECONCILE_NO_ERROR:
        return getI18nMessage('postLabel')
      default:
        return getI18nMessage('saveLabel')
    }
  }, [state.message.type, getI18nMessage])

  const onDoNotShowAgainChecked = (e: Event) => {
    const checked = (e.target as HTMLCalciteCheckboxElement).checked
    if (state.message.type === MessageType.SAVE) {
      actions.setShowSaveDialog(!checked)
    } else {
      actions.setShowDiscardDialog(!checked)
    }
  }

  // Clears message on close
  const onCancelClose = () => {
    actions.setMessage(buildEmptyMessage())
  }

  // Handle the save/ok action
  const onOkClose = () => {
    switch (state.message.type) {
      case MessageType.SAVE:
        actions.save()
        break
      case MessageType.DISCARD:
        actions.discard()
        break
      case MessageType.RECONCILE_NO_ERROR:
        actions.post()
        break
      default:
        break
    }
    actions.setMessage(buildEmptyMessage())
  }

  // Determine the scale of the dialog based on the message type
  const getMainScale = React.useMemo(() => {
    switch (state.message.type) {
      case MessageType.SAVE:
      case MessageType.DISCARD:
        return CalciteScale.SMALL
      case MessageType.RECONCILE_ERROR:
      case MessageType.RECONCILE_NO_ERROR:
        return CalciteScale.MEDIUM
      default:
        return CalciteScale.MEDIUM
    }
  }, [state.message.type])

  const dialog = (
    <calcite-dialog
      className='branch-versioning-dialog'
      id='dialog'
      scale={getMainScale}
      width='s'
      open={isOpen ? true : undefined}
      heading={state.message.title}
      escape-disabled
      outside-close-disabled
      oncalciteDialogClose={() => { onCancelClose() }}>

      {/* Message content */}
      <div className='branch-versioning-dialog-content'>
        <p style={{ whiteSpace: 'pre-wrap' }}>
          {state.message.message}
        </p>
        {state.message.type === MessageType.SAVE && (
          <calcite-checkbox
            label-text={getI18nMessage('doNotShowAgainLabel')}
            checked={!state.showSaveDialog}
            oncalciteCheckboxChange={(e) => { onDoNotShowAgainChecked(e) }} />
        )}
        {state.message.type === MessageType.DISCARD && (
          <calcite-checkbox
            label-text={getI18nMessage('doNotShowAgainLabel')}
            checked={!state.showDiscardDialog}
            oncalciteCheckboxChange={(e) => { onDoNotShowAgainChecked(e) }} />
        )}
      </div>

      {/* Only one button shown when message type is RECONCILE_ERROR */}
      {state.message.type !== MessageType.RECONCILE_ERROR && (
        <calcite-button slot='footer-end' appearance='outline' onClick={onCancelClose}>
            {cancelLabel}
        </calcite-button>
      )}

      {/* Primary action button */}
      <calcite-button slot='footer-end' onClick={onOkClose}>
          {saveLabel}
      </calcite-button>
    </calcite-dialog>
  )

  return ReactDOM.createPortal(dialog, document.fullscreenElement || document.body)
}
