import { React, css, classNames, hooks, type ImmutableObject, type WidgetContext } from 'jimu-core'
import { Button, Icon, Select, defaultMessages as jimuUIMessages } from 'jimu-ui'
import { TrashOutlined } from 'jimu-icons/outlined/editor/trash'
import type { SystemOrAreaUnit, SystemOrLengthUnit } from '@arcgis/core/core/units'
import { type IMConfig, areaUnitList, lengthUnitList, measurementSystemList, type MeasureButton, MeasurementArrangement } from '../../config'
import defaultMessages from '../translations/default'

const lengthUnitOptions = [...measurementSystemList, ...lengthUnitList]
const areaUnitOptions = [...measurementSystemList, ...areaUnitList]

interface MeasureToolsProps {
  config: IMConfig
  context: ImmutableObject<WidgetContext>
  activeButton: MeasureButton['name']
  onSelectTool: (measureButton: MeasureButton) => void
  onChangeDistanceUnit: (unit: SystemOrLengthUnit) => void
  onChangeAreaUnit: (unit: SystemOrAreaUnit) => void
  onClear: () => void
}

const style = css`
&.measure-toolbar {
  height: 40px;
  .measure-tools {
    height: 24px;
    .measure-tool {
      &.active {
        color: var(--sys-color-action-selected-text);
        background-color: var(--sys-color-action-selected);
      }
    }
  }
  .measure-unit-clear {
    height: 24px;
    flex-grow: 1;
    border-left: 1px solid var(--sys-color-divider-secondary);
    .measure-unit {
      flex-grow: 1;
    }
  }
}
`

const MeasureTools = React.forwardRef((props: MeasureToolsProps, ref: React.Ref<HTMLDivElement>): React.ReactElement => {
  const { config, context, activeButton, onSelectTool, onChangeDistanceUnit, onChangeAreaUnit, onClear } = props
  const translate = hooks.useTranslation(jimuUIMessages, defaultMessages)
  const [clearMessage, setClearMessage] = React.useState('')
  const {
    enableDistance = true,
    enableArea = true,
    defaultDistanceUnit = 'metric',
    defaultAreaUnit = 'metric',
    arrangement = MeasurementArrangement.Classic
  } = config
  const [distanceUnit, setDistanceUnit] = React.useState<SystemOrLengthUnit>(defaultDistanceUnit)
  const [areaUnit, setAreaUnit] = React.useState<SystemOrAreaUnit>(defaultAreaUnit)

  React.useEffect(() => {
    setDistanceUnit(defaultDistanceUnit)
    setAreaUnit(defaultAreaUnit)
  }, [defaultDistanceUnit, defaultAreaUnit, arrangement])

  const handleDistanceUnitChange = React.useCallback((evt: React.ChangeEvent<HTMLSelectElement>) => {
    const nextUnit = evt.target.value as SystemOrLengthUnit
    setDistanceUnit(nextUnit)
    onChangeDistanceUnit(nextUnit)
  }, [onChangeDistanceUnit])

  const handleAreaUnitChange = React.useCallback((evt: React.ChangeEvent<HTMLSelectElement>) => {
    const nextUnit = evt.target.value as SystemOrAreaUnit
    setAreaUnit(nextUnit)
    onChangeAreaUnit(nextUnit)
  }, [onChangeAreaUnit])

  const isToolbarArrangement = arrangement === MeasurementArrangement.Toolbar

  const measureButtons: MeasureButton[] = [
    {
      name: 'measureDistance',
      icon: `${context.folderUrl}dist/runtime/assets/measure-distance.svg`,
      enabled: enableDistance
    },
    {
      name: 'measureArea',
      icon: `${context.folderUrl}dist/runtime/assets/measure-area.svg`,
      enabled: enableArea
    }
  ]

  const handleClear = () => {
    onClear()
    setClearMessage(translate('measurementCleared'))
    setTimeout(() => { setClearMessage('') }, 2000)
  }
  return <div ref={ref} className='measure-toolbar d-flex justify-content-between p-2' css={style}>
    <div className='measure-tools d-flex' role='group'>
      {measureButtons.filter(m => m.enabled).map((measureButton) => {
        return (
          <Button
            key={measureButton.name}
            icon
            type='tertiary'
            title={translate(measureButton.name)}
            className={classNames('measure-tool p-0 mr-1', { active: activeButton === measureButton.name })}
            onClick={() => { onSelectTool(measureButton) }}
            aria-label={translate(measureButton.name)}
            aria-pressed={activeButton === measureButton.name}
            aria-describedby={'selectToStart'}
          >
            <Icon className='m-0' icon={measureButton.icon} />
          </Button>
        )
      })}
    </div>
    {isToolbarArrangement && <div className='measure-unit-clear d-flex align-items-center'>
      {activeButton === 'measureDistance' && enableDistance && <Select
        size='sm'
        value={distanceUnit}
        className='measure-unit ml-1'
        onChange={handleDistanceUnitChange}
        aria-label={translate('defaultUnit')}
      >
        {
          lengthUnitOptions.map((lengthUnit) => (
            <option key={lengthUnit.key} value={lengthUnit.value}>{translate(lengthUnit.key)}</option>
          ))
        }
      </Select>}
      {activeButton === 'measureArea' && enableArea && <Select
        size='sm'
        value={areaUnit}
        className='measure-unit ml-1'
        onChange={handleAreaUnitChange}
        aria-label={translate('defaultUnit')}
      >
        {
          areaUnitOptions.map((areaUnit) => (
            <option key={areaUnit.key} value={areaUnit.value}>{translate(areaUnit.key)}</option>
          ))
        }
      </Select>}
      {activeButton === '' && <Select size='sm' value='measureUnit' disabled className='measure-unit ml-1'>
        <option value='measureUnit'>{translate('measureUnit')}</option>
      </Select>}
      <Button
        icon
        type='tertiary'
        className='p-0 ml-1'
        disabled={activeButton === ''}
        onClick={handleClear}
        aria-label={translate('clearMeasurement')}
      >
        <TrashOutlined className='m-0' />
      </Button>
      <div aria-live='polite' className='sr-only'>{clearMessage}</div>
    </div>}
  </div>
})

export default MeasureTools
