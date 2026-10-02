import { React, JimuFieldType, type ImmutableArray, type ImmutableObject, hooks } from 'jimu-core'
import { TextInput, defaultMessages as jimuMessages } from 'jimu-ui'
import { ThemeColorPicker } from 'jimu-ui/basic/color-picker'
import { SettingRow } from 'jimu-ui/advanced/setting-components'
import { colorUtils, styled, getTheme2 } from 'jimu-theme'
import type { ISimpleFillSymbol, ISimpleLineSymbol } from 'jimu-ui/advanced/chart'
import { FillSymbolSetting, LineSymbolSetting } from '../../../../components'
import { ColorsSelector } from '../../components'
import { DeletableCollapsePanel } from '../../../../../../components'
import defaultMessages from '../../../../../../../translations/default'
import { CategoryType, type ChartRenderer, type WebChartSeries } from '../../../../../../../../config'
import { getDefaultSeriesOutlineColor } from '../../../../../../../../utils/default'
import { CategoryLoader } from './category-loader'
import { CategoryAdder } from './category-adder'
import { buildByGroupItems, buildChartRenderer, getUndefinedCategoryItem, isNullCategoryItem, isUndefinedCategoryItem, sortCategoryValues, type CategoryStyleItem, type CategoryValue } from './single-bar-style-utils'
import type { ValidityResult } from 'jimu-ui'

interface SingleBarByCategoryPanelProps {
  chartRenderer?: ChartRenderer
  categoryField?: string
  fieldType?: JimuFieldType
  categoryType: CategoryType
  dataSourceId?: string
  defaultFillColor?: string
  defaultFillSymbol: ImmutableObject<ISimpleFillSymbol>
  fetchNullValues: boolean
  categoryStyleItems: CategoryStyleItem[]
  presetSeriesColors: Array<{ label: string, value: string, color: string }>
  rendererOutline: ImmutableObject<ISimpleLineSymbol>
  series: ImmutableArray<WebChartSeries>
  onSingleStyleChange?: (propSeries: ImmutableArray<WebChartSeries>, props: { colorMatch: boolean, chartRenderer?: ChartRenderer }) => void
}

const Divider = styled.div`
  width: 100%;
  height: 1px;
  background-color: var(--ref-palette-neutral-700);
`

const ByCategoryRoot = styled.div`
  flex: 1;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  overflow: hidden;
  > .body {
    width: 100%;
    overflow-y: auto;
  }
  > .footer {
    width: calc(100% + 28px);
    margin: 12px -12px -8px -16px;
    border-top: 1px solid #6a6a6a;
    > div {
      display: flex;
      width: 100%;
      justify-content: space-between;
      .colors-selector {
        width: 80%;
      }
    }
  }
`

const SingleBarByCategoryPanel = (props: SingleBarByCategoryPanelProps): React.ReactElement => {
  const {
    chartRenderer,
    categoryField,
    fieldType,
    categoryType,
    dataSourceId,
    defaultFillColor,
    fetchNullValues,
    categoryStyleItems,
    presetSeriesColors,
    rendererOutline,
    series,
    onSingleStyleChange
  } = props
  const appTheme = getTheme2()
  const translate = hooks.useTranslation(defaultMessages, jimuMessages)
  const [itemIndex, setItemIndex] = React.useState<number>(-1)
  const categoryValues = React.useMemo(() => {
    return categoryStyleItems
      .filter((item) => !isUndefinedCategoryItem(item))
      .map((item) => item.value)
  }, [categoryStyleItems])

  const normalCategoryValues = React.useMemo(() => {
    return categoryStyleItems
      .filter((item) => !isNullCategoryItem(item) && !isUndefinedCategoryItem(item))
      .map((item) => item.value)
  }, [categoryStyleItems])

  const emitByCategoryChange = React.useCallback((nextItems: CategoryStyleItem[], nextOutline?: ImmutableObject<ISimpleLineSymbol>) => {
    const renderer = buildChartRenderer(categoryType, categoryField, nextItems, nextOutline)
    onSingleStyleChange?.(series, {
      colorMatch: true,
      chartRenderer: renderer
    })
  }, [categoryField, categoryType, onSingleStyleChange, series])

  const handleOutlineChange = React.useCallback((value: ImmutableObject<ISimpleLineSymbol>): void => {
    emitByCategoryChange(categoryStyleItems, value)
  }, [categoryStyleItems, emitByCategoryChange])

  const handleItemLabelChange = React.useCallback((index: number, label: string): void => {
    const nextItems = categoryStyleItems.map((item, itemIndex) => itemIndex === index ? { ...item, label } : item)
    emitByCategoryChange(nextItems, rendererOutline)
  }, [categoryStyleItems, emitByCategoryChange, rendererOutline])

  const handleItemColorChange = React.useCallback((index: number, color: string): void => {
    const nextItems = categoryStyleItems.map((item, itemIndex) => {
      if (itemIndex !== index) return item
      return {
        ...item,
        fillSymbol: item.fillSymbol.set('color', color || (item.fillSymbol?.color as unknown as string))
      }
    })
    emitByCategoryChange(nextItems, rendererOutline)
  }, [categoryStyleItems, emitByCategoryChange, rendererOutline])

  const handleItemFillSymbolChange = React.useCallback((index: number, value: ImmutableObject<ISimpleFillSymbol>): void => {
    const nextItems = categoryStyleItems.map((item, itemIndex) => itemIndex === index ? { ...item, fillSymbol: value } : item)
    emitByCategoryChange(nextItems)
  }, [categoryStyleItems, emitByCategoryChange])

  const handleDelete = React.useCallback((index: number): void => {
    const item = categoryStyleItems[index]
    if (!item || isNullCategoryItem(item) || isUndefinedCategoryItem(item)) {
      return
    }

    const nextItems = categoryStyleItems.filter((_, itemIndex) => itemIndex !== index)
    emitByCategoryChange(nextItems, categoryType === CategoryType.ByField ? rendererOutline : undefined)
    setItemIndex((currentIndex) => {
      if (currentIndex === index) return -1
      if (currentIndex > index) return currentIndex - 1
      return currentIndex
    })
  }, [categoryStyleItems, categoryType, emitByCategoryChange, rendererOutline])

  const handleCategoryValuesChange = React.useCallback((values: CategoryValue[]): void => {
    const undefinedItem = getUndefinedCategoryItem(categoryStyleItems)
    let nextItems = buildByGroupItems(sortCategoryValues(values), rendererOutline, chartRenderer)
    if (undefinedItem) {
      nextItems = nextItems.concat(undefinedItem)
    }
    emitByCategoryChange(nextItems)
  }, [categoryStyleItems, chartRenderer, emitByCategoryChange, rendererOutline])

  const validity = React.useCallback((value: string): ValidityResult => {
    const nextValue = value.trim()
    if (!nextValue) {
      return {
        valid: false,
        msg: translate('categoryEmpty')
      }
    }

    const existed = fieldType === JimuFieldType.Number
      ? normalCategoryValues.includes(+nextValue)
      : normalCategoryValues.includes(nextValue)

    if (existed) {
      return {
        valid: false,
        msg: translate('categoryExist')
      }
    }

    return { valid: true }
  }, [fieldType, normalCategoryValues, translate])

  const handleCategoryAdded = React.useCallback((value: string | number): void => {
    const nextValue = typeof value === 'number' ? value : value.trim()
    if (nextValue === '' || nextValue == null) return

    const nullItem = categoryStyleItems.find((item) => isNullCategoryItem(item))
    const undefinedItem = getUndefinedCategoryItem(categoryStyleItems)
    const nextNormalValues = normalCategoryValues.concat(nextValue)
    let nextItems = buildByGroupItems(nextNormalValues, rendererOutline, chartRenderer)

    if (nullItem) {
      nextItems = nextItems.concat(nullItem)
    }
    if (undefinedItem) {
      nextItems = nextItems.concat(undefinedItem)
    }

    emitByCategoryChange(nextItems)
    setItemIndex(nextItems.findIndex((item) => item.value === nextValue))
  }, [categoryStyleItems, chartRenderer, emitByCategoryChange, normalCategoryValues, rendererOutline])

  const handleColorsChange = React.useCallback((colors: string[]): void => {
    if (!colors?.length) return

    const nextItems = categoryStyleItems.map((item, index) => {
      const color = colors[index % colors.length] ?? (item.fillSymbol?.color as unknown as string)
      return {
        ...item,
        fillSymbol: item.fillSymbol.set('color', color)
      }
    })

    emitByCategoryChange(nextItems, categoryType === CategoryType.ByField ? rendererOutline : undefined)
  }, [categoryStyleItems, categoryType, emitByCategoryChange, rendererOutline])

  return (
    <ByCategoryRoot>
      <div className='body'>
        {categoryType === CategoryType.ByField && <SettingRow level={3} label={translate('outline')} flow='wrap' className='mt-3'>
          <LineSymbolSetting
            type='border'
            outlineColorPicker={true}
            defaultColor={getDefaultSeriesOutlineColor('barSeries')}
            value={rendererOutline}
            onChange={handleOutlineChange}
          />
        </SettingRow>}
        <div className='mt-3' role='group' aria-label={translate('byCategory')}>
          {categoryStyleItems.map((item, index) => {
            const itemLabel = item.label || `${item.value}`
            const nullItem = isNullCategoryItem(item)
            const undefinedItem = isUndefinedCategoryItem(item)
            const specialItem = nullItem || undefinedItem
            const deletable = categoryType === CategoryType.ByGroup && !nullItem && !undefinedItem
            const previousItem = index > 0 ? categoryStyleItems[index - 1] : null
            const previousSpecialItem = previousItem ? isNullCategoryItem(previousItem) || isUndefinedCategoryItem(previousItem) : false
            const seriesColor = item.fillSymbol?.color as unknown as string
            const color = colorUtils.parseThemeVariable(seriesColor, appTheme)

            return (
              <React.Fragment key={`${item.value}-${index}`}>
                {specialItem && !previousSpecialItem && <Divider className='my-4' />}
                <DeletableCollapsePanel
                  className={index === 0 ? '' : 'mt-2'}
                  level={3}
                  type='primary'
                  bottomLine={false}
                  label={itemLabel}
                  isOpen={itemIndex === index}
                  deletable={deletable}
                  showColor={true}
                  color={color}
                  onDelete={() => { handleDelete(index) }}
                  onRequestOpen={() => { setItemIndex(index) }}
                  onRequestClose={() => { setItemIndex(-1) }}
                >
                  <div className='pb-2'>
                    {!undefinedItem && <SettingRow level={3} label={translate('label')} flow='no-wrap' className='mt-3'>
                      <TextInput
                        size='sm'
                        aria-label={`${translate('label')} ${itemLabel}`}
                        className='w-75 wrapper-overflow-hidden'
                        defaultValue={itemLabel}
                        onAcceptValue={(value) => { handleItemLabelChange(index, value) }}
                      />
                    </SettingRow>}
                    {categoryType === CategoryType.ByField && <SettingRow level={3} label={translate('color')} flow='no-wrap' className='mt-3'>
                      <ThemeColorPicker
                        specificTheme={appTheme}
                        aria-label={itemLabel}
                        presetColors={presetSeriesColors}
                        disableReset
                        value={item.fillSymbol?.color as unknown as string}
                        onChange={(value) => { handleItemColorChange(index, value) }}
                      />
                    </SettingRow>}
                    {categoryType !== CategoryType.ByField && <SettingRow level={3} label={translate('symbol')} flow='wrap' className='mt-3'>
                      <FillSymbolSetting
                        defaultFillColor={defaultFillColor}
                        defaultLineColor={(item.fillSymbol?.outline?.color as unknown as string) || getDefaultSeriesOutlineColor('barSeries')}
                        presetFillColors={presetSeriesColors}
                        value={item.fillSymbol}
                        onChange={(value) => { handleItemFillSymbolChange(index, value) }}
                      />
                    </SettingRow>}
                  </div>
                </DeletableCollapsePanel>
              </React.Fragment>
            )
          })}
        </div>
        {categoryType === CategoryType.ByGroup && <CategoryAdder
          className='mt-2'
          fieldType={fieldType}
          validity={validity}
          onChange={handleCategoryAdded}
        />}
      </div>
      <div className='footer'>
        <div className='px-4'>
          {categoryType === CategoryType.ByGroup && dataSourceId && categoryField && <CategoryLoader
            className='my-2'
            dataSourceId={dataSourceId}
            categoryField={categoryField}
            values={categoryValues}
            fetchNullValues={fetchNullValues}
            onChange={handleCategoryValuesChange}
          />}
          <ColorsSelector
            label={translate('applySeriesColorsTip')}
            className='my-2'
            onChange={handleColorsChange}
          />
        </div>
      </div>
    </ByCategoryRoot>
  )
}

export default SingleBarByCategoryPanel