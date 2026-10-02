import { React, Immutable, DataSourceManager, QueryScope, type ImmutableArray, type ImmutableObject, type IMFeatureLayerQueryParams, type QueriableDataSource, type UseDataSource, hooks } from 'jimu-core'
import { Label, Radio, defaultMessages as jimuMessages } from 'jimu-ui'
import { SettingRow } from 'jimu-ui/advanced/setting-components'
import type { ISimpleFillSymbol } from 'jimu-ui/advanced/chart'
import { FillSymbolSetting } from '../../../../components'
import { AnchoredSidePanel } from '../../../../../../components'
import defaultMessages from '../../../../../../../translations/default'
import { CategoryType, type ChartRenderer, type WebChartSeries } from '../../../../../../../../config'
import { getCategoryType, getFieldType, queryFieldUniqueValues } from '../../../../../../../../utils/common'
import { getFillSymbol, SeriesColors } from '../../../../../../../../utils/default'
import SingleBarByCategoryPanel from './single-bar-by-category-panel'
import { applyNullItemColorForRenderer, buildByFieldItems, buildByGroupItems, buildUndefinedCategoryItem, getDefaultOutline, getDefaultRendererOutline, getRendererOutline, sortCategoryValues, type CategoryStyleItem } from './single-bar-style-utils'
import StyleSourceSelector from '../shared/style-source-selector'
import { buildChartRenderer } from './single-bar-style-utils'

type CategoryColorMode = 'singleColor' | 'byCategory'

interface SingleBarSeriesStyleProps {
  defaultFillColor?: string
  series: ImmutableArray<WebChartSeries>
  query?: IMFeatureLayerQueryParams
  useDataSources?: ImmutableArray<UseDataSource>
  colorMatch: boolean
  colorMatchAllowed?: boolean
  chartRenderer?: ChartRenderer
  onSingleStyleChange?: (propSeries: ImmutableArray<WebChartSeries>, props: { colorMatch: boolean, chartRenderer?: ChartRenderer }) => void
}

const presetSeriesColors = SeriesColors.map((color) => ({
  label: color,
  value: color,
  color
}))

const DefaultCategoryCount = 50

const SingleBarSeriesStyle = (props: SingleBarSeriesStyleProps): React.ReactElement => {
  const { defaultFillColor, series: propSeries, query, useDataSources, colorMatch, colorMatchAllowed, chartRenderer, onSingleStyleChange } = props
  const translate = hooks.useTranslation(defaultMessages, jimuMessages)
  const serie = propSeries?.[0] as ImmutableObject<WebChartSeries>
  const dataSourceId = useDataSources?.[0]?.dataSourceId
  const dataSource = React.useMemo(() => DataSourceManager.getInstance().getDataSource(dataSourceId) as QueriableDataSource, [dataSourceId])
  const categoryType = getCategoryType(query)
  const categoryField = query?.groupByFieldsForStatistics?.[0]
  const categoryFieldType = React.useMemo(() => getFieldType(categoryField, dataSourceId), [categoryField, dataSourceId])
  const numericFields = React.useMemo<string[]>(() => {
    const fields = query?.outStatistics?.map((item) => item?.onStatisticField).filter((field) => !!field) ?? []
    return [...fields] as string[]
  }, [query])
  const fillSymbol = ((serie as any)?.fillSymbol ?? Immutable(getFillSymbol(defaultFillColor, 0))) as ImmutableObject<ISimpleFillSymbol>
  const seriesOutline = React.useMemo(() => getDefaultOutline(serie, defaultFillColor), [defaultFillColor, serie])
  const defaultRendererOutline = React.useMemo(() => getDefaultRendererOutline(defaultFillColor), [defaultFillColor])
  const rendererOutline = React.useMemo(() => getRendererOutline(chartRenderer, defaultRendererOutline), [chartRenderer, defaultRendererOutline])
  const styleSourceValue = colorMatch && !chartRenderer
  const colorMode: CategoryColorMode = colorMatch && chartRenderer ? 'byCategory' : 'singleColor'
  const fetchNullValues = serie?.query?.fetchNullValues ?? false
  const byCategoryItems = React.useMemo(() => {
    if (categoryType === CategoryType.ByField) {
      return buildByFieldItems(numericFields, rendererOutline, chartRenderer)
    }

    if (chartRenderer?.type === 'uniqueValue') {
      const values = chartRenderer.uniqueValueInfos?.map((item) => item?.value).filter((value) => value !== undefined) ?? []
      return buildByGroupItems(sortCategoryValues(values), rendererOutline, chartRenderer)
    }

    return [] as CategoryStyleItem[]
  }, [categoryType, chartRenderer, numericFields, rendererOutline])

  const replaceSerie = React.useCallback((nextSerie: ImmutableObject<WebChartSeries>): ImmutableArray<WebChartSeries> => {
    return propSeries?.map((currentSerie, index) => {
      return (index === 0 ? nextSerie : currentSerie) as any
    }) as ImmutableArray<WebChartSeries>
  }, [propSeries])

  const emitStyleChange = React.useCallback((nextSerie: ImmutableObject<WebChartSeries>, nextColorMatch: boolean, nextChartRenderer?: ChartRenderer): void => {
    onSingleStyleChange?.(replaceSerie(nextSerie), {
      colorMatch: nextColorMatch,
      chartRenderer: nextChartRenderer
    })
  }, [onSingleStyleChange, replaceSerie])

  const loadByGroupItems = React.useCallback(async (): Promise<CategoryStyleItem[]> => {
    if (categoryType !== CategoryType.ByGroup || !dataSource || !categoryField) return
    try {
      const values = await queryFieldUniqueValues(dataSource, categoryField, DefaultCategoryCount, QueryScope.InConfigView, fetchNullValues)
      return buildByGroupItems(sortCategoryValues(values), rendererOutline, chartRenderer)
    } catch (error) {
      console.error(error)
    }
  }, [categoryField, categoryType, chartRenderer, dataSource, fetchNullValues, rendererOutline])

  const handleSourceChange = (value: boolean): void => {
    onSingleStyleChange?.(propSeries, {
      colorMatch: value,
      chartRenderer: undefined
    })
  }

  const handleFillSymbolChange = (value: ImmutableObject<ISimpleFillSymbol>): void => {
    const nextSerie = serie.set('fillSymbol', value)
    emitStyleChange(nextSerie, false, undefined)
  }

  const handleModeChange = (mode: CategoryColorMode): void => {
    if (mode === 'singleColor') {
      onSingleStyleChange?.(propSeries, {
        colorMatch: false,
        chartRenderer: undefined
      })
      return
    }

    if (categoryType === CategoryType.ByField) {
      const nextItems = buildByFieldItems(numericFields, rendererOutline, chartRenderer)
      onSingleStyleChange?.(propSeries, {
        colorMatch: true,
        chartRenderer: buildChartRenderer(categoryType, categoryField, nextItems, rendererOutline)
      })
      return
    }

    void loadByGroupItems().then((nextItems) => {
      if (nextItems?.length) {
        const undefinedItem = buildUndefinedCategoryItem(chartRenderer, rendererOutline, fillSymbol)
        onSingleStyleChange?.(propSeries, {
          colorMatch: true,
          chartRenderer: buildChartRenderer(categoryType, categoryField, applyNullItemColorForRenderer(nextItems.concat(undefinedItem)))
        })
      }
    })
  }

  return (
    <StyleSourceSelector
      value={styleSourceValue}
      onChange={handleSourceChange}
      colorMatchAllowed={colorMatchAllowed}
      className='mt-3'
    >
      {!styleSourceValue && <AnchoredSidePanel
        level={3}
        title={translate('seriesStyle')}
        className='mt-0'
      >
        <div className='pl-4 pr-3 pb-2 w-100 h-100 d-flex flex-column' role='group' aria-label={translate('seriesStyle')}>
          <SettingRow role='radiogroup' flow='wrap'>
            <div className='d-flex justify-content-between w-100 align-items-center'>
              <Label title={translate('singleColor')} className='d-flex align-items-center text-truncate hint-default title3 mt-1 mb-1'>
                <Radio
                  name='single-bar-color-mode'
                  className='mr-2'
                  aria-label={translate('singleColor')}
                  checked={colorMode === 'singleColor'}
                  onChange={() => { handleModeChange('singleColor') }}
                />
                {translate('singleColor')}
              </Label>
            </div>
            <div className='d-flex justify-content-between w-100 align-items-center'>
              <Label title={translate('byCategory')} className='d-flex align-items-center text-truncate hint-default title3 mt-1 mb-1'>
                <Radio
                  name='single-bar-color-mode'
                  className='mr-2'
                  aria-label={translate('byCategory')}
                  checked={colorMode === 'byCategory'}
                  onChange={() => { handleModeChange('byCategory') }}
                />
                {translate('byCategory')}
              </Label>
            </div>
          </SettingRow>

          {colorMode === 'singleColor' && <SettingRow level={3} label={translate('symbol')} flow='wrap' className='mt-3'>
            <FillSymbolSetting
              defaultFillColor={defaultFillColor}
              defaultLineColor={seriesOutline?.color as unknown as string}
              presetFillColors={presetSeriesColors}
              value={fillSymbol}
              onChange={handleFillSymbolChange}
            />
          </SettingRow>}

          {colorMode === 'byCategory' && <SingleBarByCategoryPanel
            chartRenderer={chartRenderer}
            categoryField={categoryField}
            fieldType={categoryFieldType}
            categoryType={categoryType}
            dataSourceId={dataSourceId}
            defaultFillColor={defaultFillColor}
            defaultFillSymbol={fillSymbol}
            fetchNullValues={fetchNullValues}
            categoryStyleItems={byCategoryItems}
            presetSeriesColors={presetSeriesColors}
            rendererOutline={rendererOutline}
            series={propSeries}
            onSingleStyleChange={onSingleStyleChange}
          />}
        </div>
      </AnchoredSidePanel>}
    </StyleSourceSelector>
  )
}

export default SingleBarSeriesStyle