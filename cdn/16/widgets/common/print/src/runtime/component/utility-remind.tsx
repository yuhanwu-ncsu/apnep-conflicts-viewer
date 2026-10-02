/** @jsx jsx */
import { React, jsx, hooks, css, defaultMessages as jimCoreDefaultMessage, ReactRedux, type IMState } from 'jimu-core'
import { Alert, defaultMessages as jimuUiDefaultMessage } from 'jimu-ui'

interface Props {
  utilityId?: string
  toggleUtilityErrorRemind?: (isShow?: boolean) => void
  show?: boolean
  showPrintPermissionRemind?: boolean
  onClose?: () => void
}

const STYLE = css`
  & .utility-err-remind-con {
    bottom: 6px;
  }
`

const UtilityErrorRemind = (props: Props) => {
  const nls = hooks.useTranslation(jimuUiDefaultMessage, jimCoreDefaultMessage)
  const { utilityId, toggleUtilityErrorRemind, show = true, showPrintPermissionRemind = false, onClose } = props

  const text = ReactRedux.useSelector((state: IMState) => {
    const utilityStates = state?.appRuntimeInfo?.utilityStates as any
    if (utilityStates?.[utilityId]?.isSignInError === true) {
      return nls('signInErrorDefault')
    } else if (utilityStates?.[utilityId]?.success === false) {
      return nls('utilityNotAvailable')
    }
  })

  const remindText = React.useMemo(() => {
    return showPrintPermissionRemind ? nls('signInErrorDefault') : text
  }, [nls, showPrintPermissionRemind, text])

  if (!show) {
    return null
  }

  const handleClose = () => {
    onClose?.()
    toggleUtilityErrorRemind?.(false)
  }

  return (
    <div className='position-relative w-100' css={STYLE}>
      <div className='position-absolute w-100 utility-err-remind-con'>
        <Alert
          buttonType='tertiary'
          className='w-100'
          type='warning'
          withIcon
          closable
          onClose={handleClose}
          text={remindText}
        />
      </div>
    </div>
  )
}

export default UtilityErrorRemind
