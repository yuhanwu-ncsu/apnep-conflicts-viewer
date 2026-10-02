import { React, hooks, type IMDataSourceSchema, Immutable, type QueriableDataSource } from 'jimu-core'
import { createRuntimeSplitBySeries, getFieldType, isDataSourceReady, normalizeRuntimeSplitBySeries, normalizeRuntimeUniqueValueChartRenderer, queryFieldUniqueValues } from '../../utils/common'
import WebChart, { type WebChartProps } from './web-chart'
import { getSplitByField } from 'jimu-ui/advanced/chart'
import FeatureLayerDataSourceManager from './data-source'
import { useChartRuntimeState } from '../state'

interface Props extends WebChartProps {
  outputDataSourceId: string
}

const Chart = (props: Props) => {
  const {
    tools,
    options,
    widgetId,
    messages,
    useDataSource,
    outputDataSourceId,
    defaultTemplateType,
    templateType,
    enableDataAction = true,
    webChart: propWebChart,
    onInitDragHandler
  } = props

  const { chart, dataSource, queryVersion } = useChartRuntimeState()
  const dataSourceId = useDataSource?.dataSourceId
  const splitByField = getSplitByField(propWebChart?.dataSource?.query?.where, true)
  const query = propWebChart?.dataSource?.query
  const categoryField = query?.groupByFieldsForStatistics?.[0]
  const fetchNullValues = propWebChart?.series?.[0]?.query?.fetchNullValues ?? false
  const shouldNormalizeUniqueValueRenderer = !splitByField && propWebChart?.series?.length === 1 && propWebChart?.series?.[0]?.type === 'barSeries' && propWebChart?.chartRenderer?.type === 'uniqueValue' && !!categoryField

  const [splitByValues, setSplitByValues] = React.useState<{ [field: string]: Array<string | number | null> }>()
  const [categoryValues, setCategoryValues] = React.useState<{ [field: string]: Array<string | number | null> }>()

  const splitByFieldRef = hooks.useLatest(splitByField)
  const categoryFieldRef = hooks.useLatest(categoryField)

  React.useEffect(() => {
    if (splitByField && isDataSourceReady(dataSource)) {
      const MAX_COUNT = 101
      queryFieldUniqueValues(dataSource as QueriableDataSource, splitByField, MAX_COUNT, undefined, fetchNullValues).then((values) => {
        setSplitByValues({ [splitByField]: values })
      })
    }
  }, [splitByField, queryVersion, dataSource, fetchNullValues])

  React.useEffect(() => {
    if (shouldNormalizeUniqueValueRenderer && categoryField && isDataSourceReady(dataSource)) {
      const MAX_COUNT = 101
      queryFieldUniqueValues(dataSource as QueriableDataSource, categoryField, MAX_COUNT, undefined, fetchNullValues).then((values) => {
        setCategoryValues({ [categoryField]: values })
      })
    }
  }, [categoryField, dataSource, fetchNullValues, queryVersion, shouldNormalizeUniqueValueRenderer])

  const series = React.useMemo(() => {
    if (splitByFieldRef.current && splitByValues?.[splitByFieldRef.current]) {
      const splitByFieldType = getFieldType(splitByFieldRef.current, dataSourceId)
      const seriesValues = createRuntimeSplitBySeries(propWebChart.series, query, splitByFieldType, splitByValues[splitByFieldRef.current])
      return Immutable(seriesValues)
    } else {
      const seriesValues = normalizeRuntimeSplitBySeries(propWebChart?.series)
      return seriesValues
    }
  }, [dataSourceId, splitByFieldRef, splitByValues, propWebChart?.series, query])

  const chartRenderer = React.useMemo(() => {
    if (categoryFieldRef.current && categoryValues?.[categoryFieldRef.current] && propWebChart?.chartRenderer?.type === 'uniqueValue') {
      return Immutable(normalizeRuntimeUniqueValueChartRenderer(propWebChart.chartRenderer, categoryValues[categoryFieldRef.current]))
    }

    return propWebChart?.chartRenderer
  }, [categoryFieldRef, categoryValues, propWebChart?.chartRenderer])

  const handleSchemaChange = (schema: IMDataSourceSchema) => {
    if (!schema) return
    chart?.refresh({ updateData: false, resetAxesBounds: false })
  }

  const webChart = React.useMemo(() => {
    return propWebChart
      ?.set('series', series)
      ?.set('chartRenderer', chartRenderer)
  }, [chartRenderer, propWebChart, series])

  return (<>
    <FeatureLayerDataSourceManager
      widgetId={widgetId}
      webChart={webChart}
      outputDataSourceId={outputDataSourceId}
      useDataSource={useDataSource}
      splitByValues={splitByValues}
      onSchemaChange={handleSchemaChange}
    />
    <WebChart
      widgetId={widgetId}
      tools={tools}
      options={options}
      messages={messages}
      webChart={webChart}
      useDataSource={useDataSource}
      enableDataAction={enableDataAction}
      onInitDragHandler={onInitDragHandler}
      defaultTemplateType={defaultTemplateType}
      templateType={templateType}
    />
  </>)
}

export default Chart
