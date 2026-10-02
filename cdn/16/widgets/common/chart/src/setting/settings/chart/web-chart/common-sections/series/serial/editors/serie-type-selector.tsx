import { React, hooks, type ImmutableObject } from 'jimu-core'
import { Select } from 'jimu-ui'
import defaultMessages from '../../../../../../../translations/default'
import type { WebChartSeries } from '../../../../../../../../config'
import type { SerialSeriesRenderType } from '../../../../../../../../utils/common'

interface SerieTypeSelectorProps {
  serie: ImmutableObject<WebChartSeries>
  onChange?: (type: SerialSeriesRenderType) => void
}

const SerieTypeSelector = (props: SerieTypeSelectorProps): React.ReactElement => {
  const { serie, onChange } = props
  const { type, lineSmoothed } = serie
  const renderAs = type === 'lineSeries' ? (lineSmoothed ? 'smoothLine' : 'line') : 'column'
  const translate = hooks.useTranslation(defaultMessages)

  const handleSerieTypeChange = (evt: React.MouseEvent<HTMLSelectElement>): void => {
    onChange?.(evt.currentTarget.value as SerialSeriesRenderType)
  }

  return (
    <Select
      size='sm'
      aria-label={translate('renderAs')}
      className='w-50'
      value={renderAs}
      onChange={handleSerieTypeChange}
    >
      <option value={'column'}>
        {translate('renderAsColumn')}
      </option>
      <option value={'line'}>
        {translate('renderAsLine')}
      </option>
      <option value={'smoothLine'}>
        {translate('renderAsSmoothLine')}
      </option>
    </Select>
  )
}

export default SerieTypeSelector