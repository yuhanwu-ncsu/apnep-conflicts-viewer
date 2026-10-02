/** @jsx jsx */
import { React, jsx, css, classNames, hooks, type IMUseUtility } from 'jimu-core'
import { Button, Loading, LoadingType, defaultMessages as jimuUiDefaultMessage } from 'jimu-ui'
import { PrintResultState, type IMPrintResultListItemType } from '../../../config'
import defaultMessage from '../../translations/default'
import { PageOutlined } from 'jimu-icons/outlined/data/page'
import { getCredentialToken } from '../../utils/utils'
import { WrongOutlined } from 'jimu-icons/outlined/suggested/wrong'
import ResultItemAction from '../result-item-action'
const { useEffect, useState } = React

interface Props {
  useUtility: IMUseUtility
  printResult: IMPrintResultListItemType
  restPrint: () => void
  onCanClosePopperChange?: (canClose: boolean) => void
}

const Result = (props: Props) => {
  const nls = hooks.useTranslation(defaultMessage, jimuUiDefaultMessage)

  const { printResult, useUtility, restPrint, onCanClosePopperChange } = props
  const [credentialToken, setCredentialToken] = useState(null)

  const STYLE = css`
    .error-link, .error-link:hover {
      color: var(--sys-color-surface-paper-text);
      & svg {
        color: var(--sys-color-error-dark);
      }
    }
    a.result-button{
      color: inherit;
      &:hover {
        color: inherit;
        background: none;
        text-decoration: underline;
      }
    }
  `

  useEffect(() => {
    getCredentialToken(useUtility).then(token => {
      setCredentialToken(token)
    })
  }, [useUtility])

  const renderResultItemIcon = () => {
    switch (printResult?.state) {
      case PrintResultState.Loading:
        return <div><Loading useAriaLive type={LoadingType.Donut} width={16} height={16}/></div>
      case PrintResultState.Success:
        return (<PageOutlined/>)
      case PrintResultState.Error:
        return (<span title={nls('uploadImageError')}><WrongOutlined /></span>)
    }
  }

  return (
    <div className='d-flex flex-column h-100 w-100 result-con' css={STYLE}>
      <div className='d-flex align-items-center'>
        <Button
          href={credentialToken ? `${printResult?.url}?token=${credentialToken}` : printResult?.url}
          disabled={!printResult?.url}
          target='_blank'
          size='sm'
          aria-label={printResult?.title}
          tag={printResult?.url ? 'a' : 'div'}
          type='tertiary'
          className={classNames('d-flex p-0 align-items-center result-button flex-grow-1', { 'error-link': printResult?.state === PrintResultState.Error })}
        >
          {renderResultItemIcon()}
          <div className='ml-2 flex-grow-1 text-left' title={printResult?.title}>{printResult?.title}</div>
        </Button>
        <ResultItemAction
          item={printResult}
          showRemoveButton={false}
          onCanClosePopperChange={onCanClosePopperChange}
        />
      </div>
      <div className='flex-grow-1 d-flex align-items-end'>
        <div className='flex-grow-1'></div>
        <Button type='primary' aria-label={nls('reset')} title={nls('reset')} onClick={restPrint}>{nls('reset')}</Button>
      </div>
    </div>
  )
}

export default Result
