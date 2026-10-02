import { React, classNames, hooks } from 'jimu-core'
import { CollapsablePanel, defaultMessages, type CollapsablePanelProps, Button } from 'jimu-ui'
import editOutlined from 'jimu-icons/svg/outlined/editor/edit.svg'
import { styled } from 'jimu-theme'
import { MinusCircleOutlined } from 'jimu-icons/outlined/editor/minus-circle'

interface DeletableLabelProps {
  className?: string
  label: string
  wrap?: boolean
  deletable?: boolean
  showColor?: boolean
  color?: string
  onDelete?: () => void
}

interface DeletableCollapsePanelProps extends CollapsablePanelProps, Omit<DeletableLabelProps, 'label'> { }

const DeletableLabel = styled((props: DeletableLabelProps) => {
  const { className, label, wrap, deletable = false, showColor = false, color, onDelete } = props
  const translate = hooks.useTranslation(defaultMessages)

  const handleDeleteClick = React.useCallback((event: React.MouseEvent<HTMLElement>) => {
    event.preventDefault()
    event.stopPropagation()
    onDelete?.()
  }, [onDelete])

  const handleDeleteKeyDown = React.useCallback((event: React.KeyboardEvent<HTMLElement>) => {
    if (event.key !== 'Enter' && event.key !== ' ') return

    event.preventDefault()
    event.stopPropagation()
    onDelete?.()
  }, [onDelete])

  return <div className={(classNames('deletable-collapse-header', className))}>
    <div className='header-left'>
      {showColor && color && <div className='color-indicator' style={{ backgroundColor: color }} />}
      <div title={label} className={classNames('title', { 'text-truncate': !wrap })}>
        {label}
      </div>
    </div>
    {
      deletable && <Button className='collapse-remove p-0' aria-label={translate('remove')} title={translate('remove')} type='tertiary' icon size='sm' tag='div' role='button' tabIndex={0} onClick={handleDeleteClick} onKeyDown={handleDeleteKeyDown}>
        <MinusCircleOutlined size='m' />
      </Button>
    }
  </div>
})(({ color }) => {
  return {
    display: 'flex',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'space-between',

    'button.collapse-remove': {
      flexShrink: 0,
      height: 'fit-content'
    },

    '> .header-left': {
      flex: 1,
      display: 'flex',
      alignItems: 'center',
      overflow: 'hidden',

      '> .color-indicator': {
        flexShrink: 0,
        width: '16px',
        height: '16px',
        backgroundColor: color,
        marginRight: 'var(--size-spacing-1, 4px)',
        borderRadius: '50%',
      }
    }
  }
})

const StyledCollapsablePanel = styled(CollapsablePanel)`
  .collapse-label {
    max-width: calc(100% - 22px);
  }
`

export const DeletableCollapsePanel = (props: DeletableCollapsePanelProps): React.ReactElement => {
  const { label: propLabel, deletable = false, showColor = false, color, onDelete, wrap, rightIcon = editOutlined, ...others } = props

  const label = <DeletableLabel label={propLabel as string} deletable={deletable} showColor={showColor} color={color} wrap={wrap} onDelete={onDelete} />

  return (<StyledCollapsablePanel rightIcon={rightIcon} label={label} {...others} />)
}
