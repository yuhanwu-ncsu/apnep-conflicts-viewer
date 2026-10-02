/** @jsx jsx */
import {jsx, React } from 'jimu-core'
import { useBranchVersioningActions, useBranchVersioningState } from '../context/state/branch-versioning-context'
import { buildEmptyMessage } from '../utils/utils'
import { MessageType } from '../../config'
import 'calcite-components'

export function MessageAlert () {
  const actions = useBranchVersioningActions()
  const state = useBranchVersioningState()

  // Determine if the alert should be open based on the message type. Only open when the message type is ALERT
  const isOpen = React.useMemo(() => {
    return state.message.type === MessageType.ALERT
  }, [state.message.type])

  // Determine the icon to display based on the message kind
  const icon = React.useMemo((): 'exclamation-mark-triangle' | 'check-circle' | 'information' => {
    switch (state.message?.kind) {
      case 'danger':
      case 'warning':
        return 'exclamation-mark-triangle'
      case 'brand':
      case 'success':
        return 'check-circle'
      case 'info':
        return 'information'
      default:
        return 'information'
    }
  }, [state.message?.kind])

  const onClose = () => {
    actions.setMessage(buildEmptyMessage())
  }

  // Alerts only show when message type is ALERT. They are intended for quick notifications to the user.
  return (
    <calcite-alert
      className='branch-versioning-notice'
      scale='m'
      placement='bottom'
      autoClose={true}
      open={isOpen}
      autoCloseDuration='fast'
      kind={state.message.kind || 'info'}
      icon={icon}
      label={state.message?.title || ''}
      oncalciteAlertClose={() => { onClose() }}
      role="alert"
    >
      <div slot='title'>{state.message?.title}</div>
      <div slot='message'>{state.message?.message}</div>
    </calcite-alert>
  )
}
