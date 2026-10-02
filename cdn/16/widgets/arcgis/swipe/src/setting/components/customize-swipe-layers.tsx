import { React, css, polished, hooks, type ImmutableArray } from 'jimu-core'
import {
  Alert,
  TextInput,
  defaultMessages as jimuUIMessages
} from 'jimu-ui'
import defaultMessages from '../translations/default'
import {
  SettingSection,
  SettingRow,
  MultipleJimuMapConfig,
  type MultipleJimuMapValidateResult
} from 'jimu-ui/advanced/setting-components'
import ChooseSwipeLayers from './choose-swipe-layers'
import type { LayersOption, SwipeStyle } from '../../config'
import { getJimuMapViewId, isWebMap } from '../../utils/utils'

const { useState, useRef, useCallback, useEffect } = React
const STYLE = css`
  .text-container {
    margin-top: 12px;
  }
  .layer-remind {
    color: var(--ref-palette-neutral-1000);
    font-size: ${polished.rem(13)};
  }
`
interface CustomizeSwipeLayersProps {
  useMapWidgetId: string
  onConfigChange: (key: string[], value: any) => void
  swipeMapViewList: { [mapViewId: string]: LayersOption }
  swipeStyle: SwipeStyle
  folderUrl: string
  mapUseDataSources: ImmutableArray<string>
  leadingLayersAlias?: string
  trailingLayersAlias?: string
  detailsVisibility: boolean
}

const CustomizeSwipeLayers = (props: CustomizeSwipeLayersProps) => {
  const translate = hooks.useTranslation(defaultMessages, jimuUIMessages)
  const {
    useMapWidgetId, onConfigChange, swipeMapViewList, swipeStyle,
    mapUseDataSources, leadingLayersAlias, trailingLayersAlias, detailsVisibility
  } = props
  const [dsId, setDsId] = useState(null)
  const [leadingAliasInput, setLeadingAliasInput] = useState(leadingLayersAlias || '')
  const [trailingAliasInput, setTrailingAliasInput] = useState(trailingLayersAlias || '')
  const customizeLayersRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setLeadingAliasInput(leadingLayersAlias || '')
  }, [leadingLayersAlias])

  useEffect(() => {
    setTrailingAliasInput(trailingLayersAlias || '')
  }, [trailingLayersAlias])

  const onListItemBodyClick = (dataSourceId: string) => {
    setDsId(dataSourceId)
  }

  const isDataSourceValid = useCallback((dataSourceId: string): MultipleJimuMapValidateResult => {
    if (isWebMap(dataSourceId)) {
      return {
        isValid: true
      }
    } else {
      return {
        isValid: false,
        invalidMessage: translate('webSceneNotSupported')
      }
    }
  }, [translate])

  const onLeadingLayersAliasChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
    setLeadingAliasInput(evt?.target?.value || '')
  }

  const onTrailingLayersAliasChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
    setTrailingAliasInput(evt?.target?.value || '')
  }

  const onLeadingLayersAliasAccept = (value: string) => {
    onConfigChange(['leadingLayersAlias'], value?.trim() ? value : undefined)
  }

  const onTrailingLayersAliasAccept = (value: string) => {
    onConfigChange(['trailingLayersAlias'], value?.trim() ? value : undefined)
  }

  return (
    <SettingSection
      title={translate('customizeSettings')}
      role='group'
      aria-label={`${translate('customizeSettings')}: ${translate('layerRemind')}`}
      css={STYLE}
    >
      <SettingRow flow='wrap' className='text-container'>
        <span className='w-100 layer-remind'>{translate('layerRemind')}</span>
      </SettingRow>
      <SettingRow>
        <div className='w-100'>
          {(mapUseDataSources?.length === 1 || mapUseDataSources?.length === 2)
            ? <MultipleJimuMapConfig
              mapWidgetId={useMapWidgetId}
              forwardRef={(ref: HTMLDivElement) => {
                customizeLayersRef.current = ref
              }}
              onClick={onListItemBodyClick}
              isDataSourceValid={isDataSourceValid}
              sidePopperContent={
                <ChooseSwipeLayers
                  mapViewId={getJimuMapViewId(useMapWidgetId, dsId)}
                  onConfigChange={onConfigChange}
                  swipeMapViewList={swipeMapViewList}
                  swipeStyle={swipeStyle}
                  folderUrl={props.folderUrl}
                />
              }
            />
            : <Alert
              tabIndex={0}
              className={'warningMsg w-100'}
              open
              text={translate('mapEmpty')}
              type={'warning'}
            />
          }
        </div>
      </SettingRow>
      {detailsVisibility &&
        <React.Fragment>
          <SettingRow flow='wrap' label={translate('leadingLayersAlias')}>
            <TextInput
              className='w-100'
              size='sm'
              value={leadingAliasInput}
              onChange={onLeadingLayersAliasChange}
              onAcceptValue={onLeadingLayersAliasAccept}
              placeholder={translate('leadingLayersAliasPlaceholder')}
              aria-label={translate('leadingLayersAlias')}
            />
          </SettingRow>
          <SettingRow flow='wrap' label={translate('trailingLayersAlias')}>
            <TextInput
              className='w-100'
              size='sm'
              value={trailingAliasInput}
              onChange={onTrailingLayersAliasChange}
              onAcceptValue={onTrailingLayersAliasAccept}
              placeholder={translate('trailingLayersAliasPlaceholder')}
              aria-label={translate('trailingLayersAlias')}
            />
          </SettingRow>
        </React.Fragment>
      }
    </SettingSection>
  )
}

export default CustomizeSwipeLayers
