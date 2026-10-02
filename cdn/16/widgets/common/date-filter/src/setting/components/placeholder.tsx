import { classNames, hooks, polished, React } from 'jimu-core'
import { styled } from 'jimu-theme'
import { ClickOutlined } from 'jimu-icons/outlined/application/click'

const PlaceholderRoot = styled('div')(({ theme }) => {
  return {
    display: 'flex',
    flexFlow: 'column',
    justifyContent: 'center',
    height: 'calc(100vh - 540px)', //TODO: TBD - whether to show or hide the hint in layer mode.
    overflow: 'hidden',
    '.empty-placeholder-inner': {
      padding: '0px 16px',
      flexDirection: 'column',
      alignItems: 'center',
      display: 'flex',
      '.empty-placeholder-text': {
        color: theme.ref.palette.neutral[1000],
        fontSize: polished.rem(14),
        marginTop: 16,
        textAlign: 'center'
      },
      '.empty-placeholder-icon': {
        color: theme.ref.palette.neutral[800]
      }
    }
  }
})

interface PlaceholderProps {
  addSourceByData: boolean,
}

export const Placeholder = ({ addSourceByData }: PlaceholderProps) => {
  const i18n = hooks.useTranslation()

  const label = React.useMemo(() => {
    return addSourceByData ? 'selectDataPlaceholder' : 'selectMapHint'
  }, [addSourceByData])

  return (
    <PlaceholderRoot className={classNames('empty-placeholder w-100 flex-grow-1 text-center', { 'add-ds-by-data': addSourceByData })} >
        <div className='empty-placeholder-inner'>
          <div className='empty-placeholder-icon'><ClickOutlined size={48} /></div>
          <div className='empty-placeholder-text' id='filter-blank-msg'>
            {i18n(label)}
          </div>
      </div>
    </PlaceholderRoot>
  )
}