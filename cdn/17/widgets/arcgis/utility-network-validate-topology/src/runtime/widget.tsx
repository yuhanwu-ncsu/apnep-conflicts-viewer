import 'arcgis-map-components'
import { JimuMapViewComponent, type JimuMapView } from 'jimu-arcgis'
import { hooks, React, type AllWidgetProps } from 'jimu-core'
import { WidgetPlaceholder } from 'jimu-ui'
import widgetIcon from '../../icon.svg'
import type { IMConfig } from '../config'
import defaultMessages from '../setting/translations/default'

const Widget = (props: AllWidgetProps<IMConfig>) => {
  const [view, setView] = React.useState<__esri.MapView>(null)
  const getI18nMessage = hooks.useTranslation(defaultMessages)

  const onActiveViewChange = (activeView: JimuMapView) => {
    if (!activeView) {
      return
    }
    setView(activeView.view as __esri.MapView)
  }

  if (!props.useMapWidgetIds || props.useMapWidgetIds.length === 0) {
    return (
      <WidgetPlaceholder icon={widgetIcon} message={getI18nMessage("_widgetLabel")}/>
    )
  }

  return (
    <div className="jimu-widget">
      <JimuMapViewComponent
        onActiveViewChange={onActiveViewChange}
        useMapWidgetId={props.useMapWidgetIds[0]}
      ></JimuMapViewComponent>
      <arcgis-utility-network-validate-network-topology
        label={props.label}
        extentToValidate={props.config.extentToValidate}
        view={view}
      ></arcgis-utility-network-validate-network-topology>
    </div>
  )
}

export default Widget