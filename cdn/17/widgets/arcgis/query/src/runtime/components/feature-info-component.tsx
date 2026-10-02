import { React, css, type DataSource, hooks, classNames, dataSourceUtils } from 'jimu-core'
import { DownFilled } from 'jimu-icons/filled/directional/down'
import { RightFilled } from 'jimu-icons/filled/directional/right'
import { Button } from 'jimu-ui'
import 'arcgis-map-components'

interface Props {
  dataSource: DataSource
  graphic: __esri.Graphic
  popupTemplate: __esri.PopupTemplate
  defaultPopupTemplate: __esri.PopupTemplate
  togglable?: boolean
  expandByDefault?: boolean
}

const style = css`
  border: 1px solid var(--sys-color-divider-secondary);

  &.expanded {
    .header { border-block-end-width: 1px; }
    .jimu-btn {
      align-self: flex-start;
      margin-top: 8px;
    }
  }

  arcgis-feature {
    --calcite-spacing-md-plus: 6px;
    --calcite-panel-heading-text-color: var(--sys-color-surface-paper-text);
    --calcite-font-size-0: 0.875rem;
    --calcite-color-foreground-1: var(--sys-color-surface-paper);
    --calcite-color-foreground-2: var(--sys-color-surface-overlay);
  }
`
export function Feature (props: Props) {
  const { graphic, popupTemplate, defaultPopupTemplate, dataSource, togglable, expandByDefault } = props
  const featureContainerRef = React.useRef<HTMLDivElement>(null)
  const featureRef = React.useRef<any>(null)
  const [showContent, setShowContent] = React.useState<boolean>(!togglable || expandByDefault)

  const translate = hooks.useTranslation()

  const createFeature = React.useEffectEvent(() => {
    const layer = graphic.layer as __esri.FeatureLayer
    if (popupTemplate) {
      graphic.popupTemplate = popupTemplate
    } else if (layer) {
      // set popupTemplate with layer's popupTemplate or defaultPopupTemplate
      graphic.popupTemplate = layer.popupTemplate ?? defaultPopupTemplate
    } else {
      graphic.popupTemplate = defaultPopupTemplate
    }
    if (layer && !layer.popupTemplate) {
      layer.popupTemplate = popupTemplate || defaultPopupTemplate
    }
    const timeZone = dataSourceUtils.getTimezoneAPIFromRuntime((dataSource as any)?.getTimezone())
    const originDS = dataSource.getOriginDataSources()
    const rootDataSource = originDS?.[0]?.getRootDataSource()
    const map = (rootDataSource as any)?.map || null
    featureRef.current = document.createElement('arcgis-feature')
    featureContainerRef.current.appendChild(featureRef.current)

    const setGraphic = () => {
      featureRef.current.visible = true
      featureRef.current.graphic = graphic
      featureRef.current.defaultPopupTemplateEnabled = true
      featureRef.current.spatialReference = (dataSource as any)?.layer?.spatialReference || null
      featureRef.current.map = map
      featureRef.current.timeZone = timeZone
      // set elements content visibility
      const expanded = togglable ? showContent : true
      featureRef.current.hideActionBar = true
      featureRef.current.hideCloseButton = true
      featureRef.current.hideHeading = false
      featureRef.current.hideContent = false
      featureRef.current.hideLastEditedInfo = true
      featureRef.current.hideAttachmentsContent = !expanded
      featureRef.current.hideCustomContent = !expanded
      featureRef.current.hideExpressionContent = !expanded
      featureRef.current.hideFieldsContent = !expanded
      featureRef.current.hideMediaContent = !expanded
      featureRef.current.hideTextContent = !expanded
    }

    if (map) {
      map.load().finally(() => {
        setGraphic()
      })
    } else {
      setGraphic()
    }
  })

  const destroyFeature = React.useEffectEvent(() => {
    if (featureRef.current) {
      featureRef.current.destroy()
    }
  })

  React.useEffect(() => {
    createFeature()
    return destroyFeature
  }, [])

  React.useEffect(() => {
    if (featureRef.current) {
      destroyFeature()
      createFeature()
    }
  }, [popupTemplate, defaultPopupTemplate, graphic, showContent])

  return (
    <div className={classNames('feature-info-component d-flex align-items-center px-2', { expanded: showContent })} css={style}>
      {togglable && (
        <Button
          aria-label={translate(showContent ? 'collapse' : 'expand')}
          className='p-0 jimu-outline-inside flex-shrink-0'
          variant='text'
          color='inherit'
          icon
          size='sm'
          onClick={() => { setShowContent(!showContent) }}
        >
          {showContent ? <DownFilled size='s'/> : <RightFilled size='s' autoFlip/>}
        </Button>
      )}
      <div className='flex-grow-1' ref={featureContainerRef} />
    </div>
  )
}
