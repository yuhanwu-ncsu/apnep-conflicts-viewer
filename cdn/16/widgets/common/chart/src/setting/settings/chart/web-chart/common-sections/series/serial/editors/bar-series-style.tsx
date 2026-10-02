import { React, type ImmutableObject, classNames, hooks } from 'jimu-core'
import { TextInput, defaultMessages as jimuMessages } from 'jimu-ui'
import defaultMessages from '../../../../../../../translations/default'
import { SettingRow } from 'jimu-ui/advanced/setting-components'
import { FillSymbolSetting } from '../../../../components'
import type { WebChartSeries } from '../../../../../../../../config'
import { SeriesColors } from '../../../../../../../../utils/default'
import { convertSerialSeriesRenderType, type SerialSeriesRenderType } from '../../../../../../../../utils/common'
import type { ISimpleFillSymbol } from 'jimu-ui/advanced/chart'
import SerieTypeSelector from './serie-type-selector'

interface BarSeriesStyleProps {
  className?: string
  labelVisibility?: boolean
  defaultFillColor: string
  defaultLineColor: string
  labelLevel?: 1 | 2 | 3
  serie: ImmutableObject<WebChartSeries>
  hideTypeSelector?: boolean
  onChange?: (serie: ImmutableObject<WebChartSeries>) => void
}

const presetSeriesColors = SeriesColors.map((color) => ({
  label: color,
  value: color,
  color: color
}))

export const BarSeriesStyle = (props: BarSeriesStyleProps): React.ReactElement => {
  const { className, labelVisibility = false, labelLevel = 3, serie, defaultFillColor, defaultLineColor, hideTypeSelector = false, onChange } = props
  const translate = hooks.useTranslation(defaultMessages, jimuMessages)

  const handleLabelChange = (value: string): void => {
    onChange?.(serie.set('name', value))
  }

  const handleFillSymbolChange = (
    value: ImmutableObject<ISimpleFillSymbol>
  ): void => {
    onChange?.(serie.set('fillSymbol', value))
  }

  const handleSerieTypeChange = (renderType: SerialSeriesRenderType): void => {
    onChange?.(convertSerialSeriesRenderType(serie, renderType, defaultFillColor, defaultLineColor))
  }

  return (
    <div className={classNames('bar-series-style w-100', className)}>
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
      <SettingRow level={labelLevel} label={translate('symbol')} flow='wrap' className='mt-3'>
        <FillSymbolSetting
          defaultFillColor={defaultFillColor}
          defaultLineColor={defaultLineColor}
          presetFillColors={presetSeriesColors}
          value={(serie as any)?.fillSymbol}
          onChange={handleFillSymbolChange}
        />
      </SettingRow>
    </div>
  )
}