import { React, type AllWidgetProps, hooks, css, classNames } from 'jimu-core'
import { type JimuMapView, JimuMapViewComponent } from 'jimu-arcgis'
import { Loading, LoadingType, Paper, WidgetPlaceholder } from 'jimu-ui'
import type { IMConfig } from '../config'
import { MeasureWidget } from './components/measure-widget'
import defaultMessages from './translations/default'
import MeasurementIcon from '../../icon.svg'

const style = css`
  min-width: 270px;
  min-height: 40px;
  overflow: auto;
  .visibility-hidden {
    visibility: hidden;
  }
`

function Widget (props: AllWidgetProps<IMConfig>): React.ReactElement {
  const { id, useMapWidgetIds, context, config } = props
  const {
    enableDistance = true,
    enableArea = true
  } = config

  const useMapWidgetId = useMapWidgetIds?.[0]
  const [jimuMapView, setJimuMapView] = React.useState<JimuMapView>(null)

  const [loading, setLoading] = React.useState(true)
  const handleActiveViewChange = React.useCallback((jimuMapView: JimuMapView) => {
    setJimuMapView(jimuMapView)
    setLoading(!jimuMapView)
  }, [])

  const rootRef = React.useRef<HTMLDivElement>(null)

  const ready = useMapWidgetId && (enableDistance || enableArea)
  const translate = hooks.useTranslation(defaultMessages)

  return <Paper shape='none' className='jimu-widget widget-measurement' css={style}>
    {!ready &&
      <div className='w-100 h-100'>
        <WidgetPlaceholder
          className='w-100 placeholder-wrapper'
          icon={MeasurementIcon}
          name={translate('_widgetLabel')}
        />
      </div>
    }
    {ready && <React.Fragment>
      <div className={classNames('h-100', { 'visibility-hidden': loading })}>
        <MeasureWidget
          id={id}
          useMapWidgetId={useMapWidgetId}
          context={context}
          config={config}
          jimuMapView={jimuMapView}
          rootRef={rootRef}
        />
      </div>
      <JimuMapViewComponent
        useMapWidgetId={useMapWidgetId}
        onActiveViewChange={handleActiveViewChange}
      />
      {useMapWidgetId && loading && <Loading type={LoadingType.Secondary} />}
    </React.Fragment>}
  </Paper>
}

export default Widget
