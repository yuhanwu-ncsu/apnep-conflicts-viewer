/** @jsx jsx */
import { React, jsx, getAppStore, SessionManager, hooks, privilegeUtils } from 'jimu-core'
import { Button, AddItemDialog, Loading, LoadingType, enqueueNotification, defaultMessages as jimuUiDefaultMessage } from 'jimu-ui'
import { createItem, createItemInFolder, type IItemAdd } from '@esri/arcgis-rest-portal'
import type { IMPrintResultListItemType, PrintResultListItemType } from '../../config'
import defaultMessage from '../translations/default'
import { SaveOutlined } from 'jimu-icons/outlined/application/save'
import { CloseOutlined } from 'jimu-icons/outlined/editor/close'
import { LaunchOutlined } from 'jimu-icons/outlined/editor/launch'

const { useRef, useState } = React
const SUPPORTED_SAVE_AS_EXTENSIONS = ['pdf', 'png', 'jpg', 'jpeg', 'gif', 'png8', 'png32', 'svg', 'svgz']

interface Props {
  item: PrintResultListItemType | IMPrintResultListItemType
  index?: number
  deleteResultItem?: (index: number) => void
  showRemoveButton?: boolean
  onCanClosePopperChange?: (canClose: boolean) => void
}

const ResultItemAction = (props: Props) => {
  const { item, index, deleteResultItem, showRemoveButton = true, onCanClosePopperChange } = props
  const nls = hooks.useTranslation(defaultMessage, jimuUiDefaultMessage)
  const [isSaveAsDialogOpen, setIsSaveAsDialogOpen] = useState(false)
  const [savedItemId, setSavedItemId] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [canEditInBuilder, setCanEditInBuilder] = useState(false)
  const saveButtonRef = useRef<HTMLButtonElement | null>(null)

  React.useEffect(() => {
    setIsSaveAsDialogOpen(false)
    setSavedItemId(null)
    setIsSaving(false)
    onCanClosePopperChange?.(true)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [item?.url])

  React.useEffect(() => {
    return () => {
      onCanClosePopperChange?.(true)
    }
  }, [onCanClosePopperChange])

  React.useEffect(() => {
    let canceled = false
    const sessionManager = SessionManager.getInstance()

    if (!sessionManager.getMainSession()) {
      setCanEditInBuilder(false)
      return
    }

    privilegeUtils.checkAccess(privilegeUtils.CheckTarget.Builder)
      .then(canEdit => {
        if (!canceled) {
          setCanEditInBuilder(!!canEdit)
        }
      })
      .catch(() => {
        if (!canceled) {
          setCanEditInBuilder(false)
        }
      })

    return () => {
      canceled = true
    }
  }, [])

  const getFileExtensionFromUrl = React.useCallback((url: string): string | null => {
    try {
      const parsedUrl = new URL(url)
      const fileName = parsedUrl.pathname.split('/').pop() || ''
      const extension = fileName.split('.').pop()?.toLowerCase()
      return extension || null
    } catch (error) {
      return null
    }
  }, [])

  const isSupportedSaveAsUrl = React.useCallback((url: string): boolean => {
    const extension = getFileExtensionFromUrl(url)
    return !!extension && SUPPORTED_SAVE_AS_EXTENSIONS.includes(extension)
  }, [getFileExtensionFromUrl])

  const getPortalItemTypeFromUrl = React.useCallback((url: string): string => {
    const extension = getFileExtensionFromUrl(url)
    if (extension === 'pdf') {
      return 'PDF'
    }
    return 'Image'
  }, [getFileExtensionFromUrl])

  const handleSaveAsClick = (event?: React.MouseEvent<HTMLElement>) => {
    event?.stopPropagation()
    setIsSaveAsDialogOpen(true)
    onCanClosePopperChange?.(false)
  }

  const handleSaveAsClose = React.useCallback(() => {
    setIsSaveAsDialogOpen(false)
    onCanClosePopperChange?.(!isSaving)
  }, [isSaving, onCanClosePopperChange])

  const handleDeleteClick = () => {
    if (typeof index === 'number' && deleteResultItem) {
      deleteResultItem(index)
    }
  }

  const getUrlOfItemDetails = (itemId: string) => {
    const portalUrl = getAppStore().getState().portalUrl
    return `${portalUrl}/home/item.html?id=${itemId}`
  }

  const handleSaveAsConfirm = React.useCallback(async (name: string, folderId: string) => {
    if (!item?.url || !isSupportedSaveAsUrl(item.url)) {
      return
    }

    setIsSaving(true)
    onCanClosePopperChange?.(false)

    try {
      const portalUrl = getAppStore().getState().portalUrl
      const sessionManager = SessionManager.getInstance()
      const authentication = sessionManager.getSessionByUrl(portalUrl) || sessionManager.getMainSession()

      if (!authentication) {
        throw new Error('Missing portal authentication session.')
      }

      const portalItem: IItemAdd = {
        title: name,
        type: getPortalItemTypeFromUrl(item.url),
        dataUrl: item.url
      }

      const createdItem = folderId
        ? await createItemInFolder({ item: portalItem, folderId, authentication })
        : await createItem({ item: portalItem, authentication })

      if (createdItem?.id) {
        setSavedItemId(createdItem.id)
      }
    } catch (error) {
      enqueueNotification({
        message: 'Saving error',
        severity: 'error',
        closable: true,
        autoHideDuration: 0
      })
      throw error
    } finally {
      setIsSaving(false)
      onCanClosePopperChange?.(true)
    }
  }, [item?.url, getPortalItemTypeFromUrl, isSupportedSaveAsUrl, onCanClosePopperChange])

  const showSaveActionButton = React.useMemo(() => {
    return !!item?.url && isSupportedSaveAsUrl(item.url) && canEditInBuilder
  }, [item?.url, isSupportedSaveAsUrl, canEditInBuilder])

  const shouldShowRemoveButton = React.useMemo(() => {
    return showRemoveButton && !!item?.url && typeof index === 'number' && !!deleteResultItem
  }, [showRemoveButton, item?.url, index, deleteResultItem])

  return (
    <React.Fragment>
      {showSaveActionButton && (
        <Button
          ref={!savedItemId ? saveButtonRef : undefined}
          className='result-action-button'
          icon
          size='sm'
          type='tertiary'
          tag={savedItemId ? 'a' : 'button'}
          href={savedItemId ? getUrlOfItemDetails(savedItemId) : undefined}
          target={savedItemId ? '_blank' : undefined}
          onClick={savedItemId || isSaving ? undefined : handleSaveAsClick}
          aria-label={savedItemId ? nls('openItem') : nls('saveAs')}
          title={savedItemId ? nls('openItem') : nls('saveAs')}
          disabled={isSaving}
        >
          {isSaving ? <Loading useAriaLive width={16} height={16} type={LoadingType.Donut}/> : savedItemId ? <LaunchOutlined /> : <SaveOutlined />}
        </Button>
      )}
      {shouldShowRemoveButton && (
        <Button
          className='result-action-button'
          icon
          size='sm'
          type='tertiary'
          onClick={handleDeleteClick}
          aria-label={nls('remove')}
          title={nls('remove')}
        >
          <CloseOutlined size='s'/>
        </Button>
      )}
      {showSaveActionButton && isSaveAsDialogOpen && saveButtonRef.current && (
        <AddItemDialog
          defaultName={item?.title}
          headerTitle={nls('savePrint')}
          confirmButtonText={nls('save')}
          reference={saveButtonRef.current}
          onClose={handleSaveAsClose}
          onConfirm={handleSaveAsConfirm}
        />
      )}
    </React.Fragment>
  )
}

export default ResultItemAction