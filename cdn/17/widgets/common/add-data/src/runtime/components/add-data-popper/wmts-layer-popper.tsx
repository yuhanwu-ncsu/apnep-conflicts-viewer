/** @jsx jsx */
import { React, jsx, css, classNames, loadArcGISJSAPIModule } from 'jimu-core'
import { Popper, PanelHeader, TextInput, Loading, LoadingType, Button, Tooltip, Radio, Label, Dropdown, DropdownButton, DropdownMenu, DropdownItem } from 'jimu-ui'
import { SearchOutlined } from 'jimu-icons/outlined/editor/search'
import type { WmtsSelectionOptions } from '../../wmts-utils'

const { useState, useMemo, useRef, useEffect, useCallback } = React

const WMTS_POPPER_DEFAULT_SIZE = { width: 240, height: 600 }

interface WmtsTileMatrixSetInfo {
  id: string
  title?: string
}

interface WmtsSublayerInfo {
  id: string
  title?: string
  tileMatrixSets: WmtsTileMatrixSetInfo[]
}

export interface WmtsLayerPopperProps {
  open: boolean
  url: string
  reference: React.RefObject<HTMLElement>
  translate: (id: string, values?: any) => string
  onConfirm: (options: WmtsSelectionOptions) => void
  onClose: () => void
  onError: (message: string) => void
  failedToFetchMessage: string
}

export const WmtsLayerPopper = (props: WmtsLayerPopperProps) => {
  const { open, url, reference, translate, onConfirm, onClose, onError, failedToFetchMessage } = props
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [sublayers, setSublayers] = useState<WmtsSublayerInfo[]>([])
  const [searchText, setSearchText] = useState<string>('')
  const [selectedSublayerId, setSelectedSublayerId] = useState<string>(null)
  const [selectedTileMatrixSetId, setSelectedTileMatrixSetId] = useState<string>(null)
  const lastUrlRef = useRef<string>(null)
  const [referenceSize, setReferenceSize] = useState(WMTS_POPPER_DEFAULT_SIZE)

  const fetchWmtsSublayers = useCallback(async (serviceUrl: string) => {
    setIsLoading(true)
    try {
      const WMTSLayer = await loadArcGISJSAPIModule('esri/layers/WMTSLayer') as typeof __esri.WMTSLayer
      const layer = new WMTSLayer({ url: serviceUrl })
      await layer.load()
      const nextSublayers = (layer.sublayers?.toArray() || [])
        .filter((sublayer) => sublayer?.id != null)
        .map((sublayer) => ({
          id: sublayer.id,
          title: (sublayer as any).title,
          tileMatrixSets: ((sublayer as any).tileMatrixSets?.toArray?.() || [])
            .filter((tileMatrixSet) => !!tileMatrixSet?.id)
            .map((tileMatrixSet) => ({
              id: `${tileMatrixSet.id}`,
              title: tileMatrixSet.title
            }))
        }))
        .filter((sublayer) => sublayer.tileMatrixSets.length > 0)

      if (!nextSublayers.length) {
        throw new Error('NoSublayers')
      }

      const defaultSublayerId = nextSublayers.length === 1 ? nextSublayers[0].id : null
      const defaultTileMatrixSetId = nextSublayers[0].tileMatrixSets[0]?.id || null
      setSublayers(nextSublayers)
      setSelectedSublayerId(defaultSublayerId)
      setSelectedTileMatrixSetId(defaultTileMatrixSetId)
      lastUrlRef.current = serviceUrl
    } catch (err) {
      onError(failedToFetchMessage)
      onClose()
    } finally {
      setIsLoading(false)
    }
  }, [failedToFetchMessage, onClose, onError])

  useEffect(() => {
    if (!open || !url) {
      return
    }
    setSearchText('')
    if (url !== lastUrlRef.current) {
      setSublayers([])
      setSelectedSublayerId(null)
      setSelectedTileMatrixSetId(null)
      void fetchWmtsSublayers(url)
    }
  }, [open, url, fetchWmtsSublayers])

  const updateReferenceSize = useCallback(() => {
    const node = reference?.current
    if (!node) {
      return
    }
    const rect = node.getBoundingClientRect()
    if (rect?.width && rect?.height) {
      setReferenceSize({
        width: Math.round(rect.width),
        height: Math.round(rect.height)
      })
    }
  }, [reference])

  useEffect(() => {
    if (!open) {
      return
    }
    updateReferenceSize()
    if (!reference?.current || typeof ResizeObserver === 'undefined') {
      return
    }
    const observer = new ResizeObserver(() => { updateReferenceSize() })
    observer.observe(reference.current)
    return () => {
      observer.disconnect()
    }
  }, [open, reference, updateReferenceSize])

  const filteredSublayers = useMemo(() => {
    const keyword = searchText.trim().toLowerCase()
    if (!keyword) {
      return sublayers
    }
    return sublayers.filter((sublayer) => {
      const title = sublayer.title?.toLowerCase() || ''
      return title.includes(keyword) || sublayer.id.includes(keyword)
    })
  }, [sublayers, searchText])

  const selectedSublayer = useMemo(() => {
    return sublayers.find((sublayer) => sublayer.id === selectedSublayerId) || null
  }, [selectedSublayerId, sublayers])

  const tileMatrixSetSourceSublayer = useMemo(() => {
    return selectedSublayer || sublayers[0] || null
  }, [selectedSublayer, sublayers])

  useEffect(() => {
    if (!tileMatrixSetSourceSublayer) {
      setSelectedTileMatrixSetId(null)
      return
    }
    const tileMatrixSetExists = tileMatrixSetSourceSublayer.tileMatrixSets.some((tileMatrixSet) => tileMatrixSet.id === selectedTileMatrixSetId)
    if (tileMatrixSetExists) {
      return
    }
    setSelectedTileMatrixSetId(tileMatrixSetSourceSublayer.tileMatrixSets[0]?.id || null)
  }, [tileMatrixSetSourceSublayer, selectedTileMatrixSetId])

  const selectedTileMatrixSet = useMemo(() => {
    return tileMatrixSetSourceSublayer?.tileMatrixSets.find((tileMatrixSet) => tileMatrixSet.id === selectedTileMatrixSetId) || null
  }, [tileMatrixSetSourceSublayer, selectedTileMatrixSetId])

  const handleConfirm = () => {
    if (!selectedSublayer || !selectedTileMatrixSetId) {
      return
    }
    onConfirm({
      wmtsLayerId: selectedSublayer.id,
      wmtsTileMatrixSetId: selectedTileMatrixSetId,
      sourceLabel: selectedSublayer.title || selectedSublayer.id
    })
  }

  if (!open) {
    return null
  }

  return (
    <Popper
      open={open}
      toggle={onClose}
      reference={reference}
      placement='top-start'
      offsetOptions={[0, -referenceSize.height]}
      css={wmtsPopperStyle}
      autoFocus={false}
      trapFocus={false}
      forceLatestFocusElements>
      <div className='wmts-layer-popper' style={{ width: referenceSize.width, height: referenceSize.height }}>
        <PanelHeader title={translate('addLayer')} className='p-4' showClose={false} level={1} />
        <div className='wmts-layer-content'>
          <div className='url-input-label'>
            {translate('selectLayerToAdd')}
          </div>
          <TextInput
            className='wmts-layer-search'
            allowClear
            prefix={<SearchOutlined size='s' />}
            value={searchText}
            onChange={(evt) => { setSearchText(evt.target.value) }}
            placeholder={translate('SearchLabel')}
          />
          <div className='wmts-layer-list' role='radiogroup' aria-label={translate('selectLayerToAdd')}>
            {
              isLoading && <div className='wmts-layer-loading'>
                <Loading className='wmts-layer-loading-spinner' type={LoadingType.Donut} width={24} height={24} />
              </div>
            }
            {
              !isLoading && filteredSublayers.length === 0 &&
              <div className='wmts-layer-empty'>{translate('noAvailableLayers')}</div>
            }
            {
              !isLoading && filteredSublayers.map((sublayer) => {
                const label = sublayer.title || sublayer.id
                const selected = sublayer.id === selectedSublayerId
                return (
                  <Tooltip key={sublayer.id} title={label} enterDelay={1000} enterNextDelay={1000}>
                    <Label className={classNames('wmts-layer-item', { selected })}>
                      <Radio
                        style={{ cursor: 'pointer' }}
                        name='wmts-sublayer'
                        className='mr-2'
                        checked={selected}
                        onChange={() => { setSelectedSublayerId(sublayer.id) }}
                      />
                      <span className='wmts-layer-item-label'>{label}</span>
                    </Label>
                  </Tooltip>
                )
              })
            }
          </div>

          <div className='url-input-label mt-3'>
            {translate('selectTileMatrixSet')}
          </div>
          <Dropdown menuRole='listbox' activeIcon className='w-100' aria-label={translate('selectTileMatrixSet')}>
            <DropdownButton size='sm' className='text-left'>
              {selectedTileMatrixSet?.title || selectedTileMatrixSet?.id || ''}
            </DropdownButton>
            <DropdownMenu>
              {
                tileMatrixSetSourceSublayer?.tileMatrixSets.map((tileMatrixSet) => {
                  const label = tileMatrixSet.title || tileMatrixSet.id
                  return (
                    <DropdownItem
                      key={tileMatrixSet.id}
                      active={tileMatrixSet.id === selectedTileMatrixSetId}
                      onClick={() => { setSelectedTileMatrixSetId(tileMatrixSet.id) }}>
                      {label}
                    </DropdownItem>
                  )
                })
              }
            </DropdownMenu>
          </Dropdown>

          <div className='wmts-layer-actions'>
            <Button type='primary' className='w-100 mb-2' disabled={!selectedSublayer || !selectedTileMatrixSetId} onClick={handleConfirm}>
              {translate('ok')}
            </Button>
            <Button className='w-100' onClick={onClose}>
              {translate('cancel')}
            </Button>
          </div>
        </div>
      </div>
    </Popper>
  )
}

const wmtsPopperStyle = css`
  z-index: 2;
  background: none;
  border: none;
  box-shadow: none;
  overflow: visible;

  .wmts-layer-popper {
    color: var(--sys-color-surface-overlay-text);
    display: flex;
    flex-direction: column;
    background: var(--sys-color-surface-overlay);
    border-width: 1px;
    border-style: solid;
    border-color: var(--sys-color-divider-secondary);
    border-radius: var(--sys-shape-2);
    box-shadow: var(--sys-shadow-2);

    .panel-header {
      .title {
        color: var(--sys-color-surface-overlay-text);
      }

      .jimu-btn {
        color: var(--sys-color-action-text);
      }
    }

    .url-input-label {
      font-size: 13px;
      font-weight: 500;
      margin-bottom: 8px;
      color: var(--sys-color-surface-overlay-text);
    }
  }

  .wmts-layer-content {
    display: flex;
    flex-direction: column;
    flex: 1 1 auto;
    padding: 0 16px 16px 16px;

    .wmts-layer-search {
      .input-wrapper {
        border-bottom: none;
        border-bottom-left-radius: 0px;
        border-bottom-right-radius: 0px;
      }
    }
  }

  .wmts-layer-list {
    border: 1px solid var(--sys-color-divider-primary);
    border-radius: var(--sys-shape-1);
    border-top-left-radius: 0;
    border-top-right-radius: 0;
    max-height: 130px;
    overflow-y: auto;
    margin-bottom: 4px;
    position: relative;
  }

  .dropdown {
    width: 100%;
    margin-bottom: 4px;
  }

  .wmts-layer-item {
    width: 100%;
    display: flex;
    align-items: center;
    padding: 8px 10px;
    color: inherit;
    text-align: left;
    cursor: pointer;
    margin-bottom: 0;

    &:hover {
      background: var(--sys-color-state-hover);
    }

    &.selected {
      background: var(--sys-color-state-primary-hover);
    }
  }

  .wmts-layer-item-label {
    flex: 1 1 auto;
    min-width: 0;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .wmts-layer-loading,
  .wmts-layer-empty {
    min-height: 72px;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 12px;
    color: var(--sys-color-surface-overlay-text);
  }

  .wmts-layer-actions {
    margin-top: auto;
    padding-top: 12px;
  }
`
