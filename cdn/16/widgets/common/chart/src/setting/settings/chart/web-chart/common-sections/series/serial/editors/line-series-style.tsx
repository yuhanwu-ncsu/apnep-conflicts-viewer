import { React, type ImmutableObject, classNames, hooks } from 'jimu-core'
import { TextInput, defaultMessages as jimuMessages, Switch } from 'jimu-ui'
import defaultMessages from '../../../../../../../translations/default'
import { SettingRow } from 'jimu-ui/advanced/setting-components'
import { LineSymbolSetting, MarkSymbolSetting } from '../../../../components'
import type { WebChartSeries } from '../../../../../../../../config'
import { SeriesColors } from '../../../../../../../../utils/default'
import { convertSerialSeriesRenderType, type SerialSeriesRenderType } from '../../../../../../../../utils/common'
import type { WebChartLineChartSeries, ISimpleLineSymbol, ISimpleMarkerSymbol } from 'jimu-ui/advanced/chart'
import SerieTypeSelector from './serie-type-selector'

interface LineSeriesStyleProps {
  className?: string
  markSizeVisible?: boolean
  labelVisibility?: boolean
  labelLevel?: 1 | 2 | 3
  defaultFillColor: string
  defaultLineColor: string
  serie: ImmutableObject<WebChartSeries>
  hideTypeSelector?: boolean
  onChange?: (serie: ImmutableObject<WebChartSeries>) => void
}

const presetSeriesColors = SeriesColors.map((color) => ({
  label: color,
  value: color,
  color: color
}))

export const LineSeriesStyle = (props: LineSeriesStyleProps): React.ReactElement => {
  const { className, labelVisibility = true, markSizeVisible = true, labelLevel = 3, serie, defaultFillColor, defaultLineColor, hideTypeSelector = false, onChange } = props
  const markerVisible = (serie as ImmutableObject<WebChartLineChartSeries>)?.markerVisible ?? false
  const translate = hooks.useTranslation(defaultMessages, jimuMessages)

  const handleLabelChange = (value: string): void => {
    onChange?.(serie.set('name', value))
  }

  const handleLineSymbolChange = (
    value: ImmutableObject<ISimpleLineSymbol>
  ): void => {
    onChange?.(serie.set('lineSymbol', value))
  }

  const handleMarkerVisibleChange = (evt): void => {
    const visible = evt.target.checked
    onChange?.(serie.set('markerVisible', visible))
  }

  const handleMarkerSymbolChange = (
    value: ImmutableObject<ISimpleMarkerSymbol>
  ): void => {
    onChange?.(serie.set('markerSymbol', value))
  }

  const handleSerieTypeChange = (renderType: SerialSeriesRenderType): void => {
    onChange?.(convertSerialSeriesRenderType(serie, renderType, defaultFillColor, defaultLineColor))
  }

  return (
    <div className={classNames('line-series-style w-100', className)}>
      {!hideTypeSelector && <SettingRow level={labelLevel} label={translate('renderAs')} flow='no-wrap'>
        <SerieTypeSelector
          serie={serie}
          onChange={handleSerieTypeChange}
        />
      </SettingRow>}
      {labelVisibility && <SettingRow level={labelLevel} label={translate('label')} flow='no-wrap' className='mt-3'>
        <TextInput
          size='sm'
          aria-label={translate('label')}
          className='w-50 wrapper-overflow-hidden'
          defaultValue={serie?.name ?? ''}
          onAcceptValue={handleLabelChange}
        />
      </SettingRow>}
      <SettingRow level={labelLevel} label={translate('line')} flow='wrap' className='mt-3'>
        <LineSymbolSetting
          type='line'
          defaultColor={defaultFillColor}
          presetColors={presetSeriesColors}
          value={(serie as any).lineSymbol}
          onChange={handleLineSymbolChange}
        />
      </SettingRow>
      <SettingRow level={labelLevel} tag='label' label={translate('valuePoint')} className='mt-3'>
        <Switch
          checked={markerVisible}
          onChange={handleMarkerVisibleChange}
        />
      </SettingRow>
      {
        markerVisible && <MarkSymbolSetting
          className='mt-2'
          markSizeVisible={markSizeVisible}
          aria-label={translate('valuePoint')}
          defaultFillColor={defaultFillColor}
          defaultLineColor={defaultLineColor}
          presetFillColors={presetSeriesColors}
          presetLineColors={presetSeriesColors}
          value={(serie as any)?.markerSymbol}
          onChange={handleMarkerSymbolChange}
        />
      }
    </div>
  )
}