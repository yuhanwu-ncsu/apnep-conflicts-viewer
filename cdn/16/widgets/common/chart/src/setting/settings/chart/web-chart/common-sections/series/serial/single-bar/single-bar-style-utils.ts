import { Immutable, type ImmutableObject } from 'jimu-core'
import type { ISimpleFillSymbol, ISimpleLineSymbol } from 'jimu-ui/advanced/chart'
import { CategoryType, type ChartRenderer, type WebChartSeries } from '../../../../../../../../config'
import { SingleSeriesOtherCategoryName, SingleSeriesOtherCategoryValue } from '../../../../../../../../constants'
import { DefaultSplitByOtherSeriesColor, getDefaultSeriesOutlineColor, getFillSymbol, SeriesColors } from '../../../../../../../../utils/default'

export type CategoryValue = string | number | null

export interface CategoryStyleItem {
  value: CategoryValue
  label: string
  fillSymbol: ImmutableObject<ISimpleFillSymbol>
}

export const UndefinedCategoryValue = SingleSeriesOtherCategoryValue as CategoryValue

export const toMutable = <T,>(value: T): T => {
  return (value as any)?.asMutable ? (value as any).asMutable({ deep: true }) : value
}

export const getDefaultOutline = (serie: ImmutableObject<WebChartSeries>, defaultFillColor: string): ImmutableObject<ISimpleLineSymbol> => {
  const outline = (serie as any)?.fillSymbol?.outline
  if (outline) {
    return outline as ImmutableObject<ISimpleLineSymbol>
  }

  const fillSymbol = getFillSymbol(defaultFillColor, 0, getDefaultSeriesOutlineColor('barSeries'))
  return Immutable(fillSymbol.outline) as ImmutableObject<ISimpleLineSymbol>
}

export const getDefaultRendererOutline = (defaultFillColor: string): ImmutableObject<ISimpleLineSymbol> => {
  const fillSymbol = getFillSymbol(defaultFillColor, 0, getDefaultSeriesOutlineColor('barSeries'))
  return Immutable(fillSymbol.outline) as ImmutableObject<ISimpleLineSymbol>
}

export const createCategoryFillSymbol = (color: string, outline: ImmutableObject<ISimpleLineSymbol>): ImmutableObject<ISimpleFillSymbol> => {
  const fillSymbol = getFillSymbol(color, outline?.width ?? 0, outline?.color as unknown as string)
  fillSymbol.outline = toMutable(outline as any)
  return Immutable(fillSymbol) as ImmutableObject<ISimpleFillSymbol>
}

export const getRendererOutline = (renderer: ChartRenderer, fallback: ImmutableObject<ISimpleLineSymbol>): ImmutableObject<ISimpleLineSymbol> => {
  const outline = renderer?.type === 'pieChart' ? renderer?.outline : null
  return Immutable(outline ?? toMutable(fallback)) as ImmutableObject<ISimpleLineSymbol>
}

export const buildByFieldItems = (
  fields: string[],
  outline: ImmutableObject<ISimpleLineSymbol>,
  renderer?: ChartRenderer
): CategoryStyleItem[] => {
  const attributes = renderer?.type === 'pieChart' ? renderer?.attributes ?? [] : []
  return fields.map((field, index) => {
    const attribute = attributes.find((item) => item?.field === field)
    const color = attribute?.color ?? SeriesColors[index % SeriesColors.length]
    return {
      value: field,
      label: attribute?.label ?? field,
      fillSymbol: createCategoryFillSymbol(color, outline)
    }
  })
}

export const buildByGroupItems = (
  values: CategoryValue[],
  outline: ImmutableObject<ISimpleLineSymbol>,
  renderer?: ChartRenderer
): CategoryStyleItem[] => {
  const uniqueValueInfos = renderer?.type === 'uniqueValue' ? renderer?.uniqueValueInfos ?? [] : []
  return values.map((value, index) => {
    const info = uniqueValueInfos.find((item) => item?.value === value)
    const color = info?.symbol?.color ?? SeriesColors[index % SeriesColors.length]
    return {
      value,
      label: info?.label ?? `${value}`,
      fillSymbol: Immutable(info?.symbol ?? createCategoryFillSymbol(color, outline)) as ImmutableObject<ISimpleFillSymbol>
    }
  })
}

export const buildUndefinedCategoryItem = (
  renderer: ChartRenderer,
  outline: ImmutableObject<ISimpleLineSymbol>,
  fallbackFillSymbol?: ImmutableObject<ISimpleFillSymbol>
): CategoryStyleItem => {
  const fallbackSymbol = fallbackFillSymbol ?? createCategoryFillSymbol(DefaultSplitByOtherSeriesColor, outline)
  const undefinedInfo = renderer?.type === 'uniqueValue'
    ? renderer?.uniqueValueInfos?.find((item) => item?.value === UndefinedCategoryValue)
    : null
  let fillSymbol = undefinedInfo?.symbol
    ? Immutable(undefinedInfo.symbol) as ImmutableObject<ISimpleFillSymbol>
    : fallbackSymbol
  fillSymbol = fillSymbol.set('color', DefaultSplitByOtherSeriesColor)

  return {
    value: UndefinedCategoryValue,
    label: SingleSeriesOtherCategoryName,
    fillSymbol
  }
}

export const sortCategoryValues = (values: CategoryValue[]): CategoryValue[] => {
  const normalValues: Array<string | number> = []
  let hasNull = false
  let hasUndefined = false

  values.forEach((value) => {
    if (value === null) {
      hasNull = true
      return
    }

    if (value === UndefinedCategoryValue) {
      hasUndefined = true
      return
    }

    if (!normalValues.includes(value)) {
      normalValues.push(value)
    }
  })

  const result: CategoryValue[] = [...normalValues]
  if (hasNull) {
    result.push(null)
  }
  if (hasUndefined) {
    result.push(UndefinedCategoryValue)
  }
  return result
}

export const isNullCategoryItem = (item: CategoryStyleItem): boolean => item.value === null

export const isUndefinedCategoryItem = (item: CategoryStyleItem): boolean => item.value === UndefinedCategoryValue

export const applyNullItemColorForRenderer = (items: CategoryStyleItem[]): CategoryStyleItem[] => {
  return items.map((item) => {
    if (!isNullCategoryItem(item) && !isUndefinedCategoryItem(item)) {
      return item
    }

    return {
      ...item,
      fillSymbol: item.fillSymbol.set('color', DefaultSplitByOtherSeriesColor)
    }
  })
}

export const getUndefinedCategoryItem = (items: CategoryStyleItem[]): CategoryStyleItem | undefined => {
  return items.find((item) => isUndefinedCategoryItem(item))
}

export const buildChartRenderer = (
  categoryType: CategoryType,
  categoryField: string,
  items: CategoryStyleItem[],
  outline?: ImmutableObject<ISimpleLineSymbol>
): ChartRenderer => {
  if (categoryType === CategoryType.ByField) {
    return {
      type: 'pieChart',
      outline: toMutable(outline),
      attributes: items.map((item) => ({
        field: item.value,
        label: item.label,
        color: toMutable(item.fillSymbol?.color)
      }))
    }
  }

  const undefinedItem = getUndefinedCategoryItem(items)
  const uniqueValueInfos = items.map((item) => ({
    value: item.value,
    label: item.label,
    symbol: toMutable(item.fillSymbol)
  }))

  if (undefinedItem && !uniqueValueInfos.find((item) => item.value === UndefinedCategoryValue)) {
    uniqueValueInfos.push({
      value: undefinedItem.value,
      label: undefinedItem.label,
      symbol: toMutable(undefinedItem.fillSymbol)
    })
  }

  return {
    type: 'uniqueValue',
    field1: categoryField,
    uniqueValueInfos
  }
}