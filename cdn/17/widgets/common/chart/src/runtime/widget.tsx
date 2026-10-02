import { React, type AllWidgetProps } from 'jimu-core'
import { versionManager } from '../version-manager'
import { DefaultOptions } from '../constants'
import { ChartRuntimeStateProvider } from './state'
import type { IMConfig, TemplateType } from '../config'
import { getChartOrSeriesType } from '../utils/common'
import { getDefaultTools } from '../utils/default'
import Chart from './chart'
import { Paper } from 'jimu-ui'

const Widget = (props: AllWidgetProps<IMConfig>): React.ReactElement => {
  const { outputDataSources, useDataSources, config, id, enableDataAction, onInitDragHandler } = props

  const webChart = config?.webChart
  const seriesType = getChartOrSeriesType(config?.webChart?.series)
  const tools = config?.tools ?? getDefaultTools(seriesType)
  const options = config?.options ?? DefaultOptions
  const messages = config?.messages
  const defaultTemplateType = config?._templateType
  const templateType = config?.template as TemplateType

  return (
    <Paper variant='flat' shape='none' transparent={true} className='jimu-widget widget-chart'>
      <ChartRuntimeStateProvider>
        <Chart
          widgetId={id}
          tools={tools}
          messages={messages}
          options={options}
          webChart={webChart}
          useDataSource={useDataSources?.[0]}
          enableDataAction={enableDataAction}
          onInitDragHandler={onInitDragHandler}
          defaultTemplateType={defaultTemplateType}
          templateType={templateType}
          outputDataSourceId={outputDataSources?.[0]}
        />
      </ChartRuntimeStateProvider>
    </Paper>
  )
}

Widget.versionManager = versionManager

export default Widget
