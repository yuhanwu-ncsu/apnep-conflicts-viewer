import { type ImmutableObject, React, classNames } from 'jimu-core'
import { DeletableCollapsePanel } from '../../../../../../components'
import type { WebChartSeries } from '../../../../../../../../config'
import { BarSeriesStyle } from './bar-series-style'
import { LineSeriesStyle } from './line-series-style'
import { DefaultSeriesOutlineColor } from '../../../../../../../../utils/default'
import { colorUtils, styled, useTheme2 } from 'jimu-theme'
interface SeriesItemProps {
  className?: string
  value: ImmutableObject<WebChartSeries>
  onChange?: (value: ImmutableObject<WebChartSeries>) => void
  isOpen: boolean
  defaultColor?: string
  deletable?: boolean
  markSizeVisible?: boolean
  headerVisibility?: boolean
  labelVisibility?: boolean
  dividerVisibility?: boolean
  labelLevel?: 1 | 2 | 3
  showSeriesColor?: boolean
  seriesColor?: string
  hideSeriesTypeSelector?: boolean
  onDelete?: (splitValue: string) => void
  onRequestOpen?: () => void
  onRequestClose?: () => void
}

const Divider = styled.div`
  width: 100%;
  height: 1px;
  background-color: var(--ref-palette-neutral-700);
`

export const SeriesItem = (props: SeriesItemProps): React.ReactElement => {
  const {
    className,
    headerVisibility = false,
    labelVisibility = true,
    markSizeVisible = true,
    dividerVisibility = false,
    labelLevel = 3,
    deletable = false,
    isOpen,
    value,
    defaultColor,
    showSeriesColor = false,
    seriesColor,
    hideSeriesTypeSelector = false,
    onChange,
    onDelete,
    onRequestOpen,
    onRequestClose
  } = props

  const theme = useTheme2()
  const color = React.useMemo(() => {
    return colorUtils.parseThemeVariable(seriesColor, theme)
  }, [seriesColor, theme])

  const type = value.type

  const handleDeleteClick = () => {
    onDelete?.(value.id)
  }

  const SeriesStyle = <>{
    type === 'barSeries' && (
      <BarSeriesStyle
        className={classNames('pb-2', { 'mt-4': headerVisibility }, { 'mt-2': !headerVisibility })}
        labelVisibility={labelVisibility}
        labelLevel={labelLevel}
        defaultFillColor={defaultColor}
        defaultLineColor={DefaultSeriesOutlineColor}
        serie={value}
        hideTypeSelector={hideSeriesTypeSelector}
        onChange={onChange}
      />
    )
  }
    {
      type === 'lineSeries' && (
        <LineSeriesStyle
          className={classNames('pb-2', { 'mt-4': headerVisibility }, { 'mt-2': !headerVisibility })}
          labelVisibility={labelVisibility}
          labelLevel={labelLevel}
          markSizeVisible={markSizeVisible}
          defaultFillColor={defaultColor}
          defaultLineColor={defaultColor}
          serie={value}
          hideTypeSelector={hideSeriesTypeSelector}
          onChange={onChange}
        />
      )
    }
  </>

  return (
    <>
      {
        dividerVisibility && <Divider className='my-4' />
      }
      {
        !headerVisibility && SeriesStyle
      }
      {headerVisibility && <DeletableCollapsePanel
        className={classNames('series-style-item-series-item', className)}
        level={1}
        type='primary'
        bottomLine={false}
        label={value.name}
        isOpen={isOpen}
        deletable={deletable}
        showColor={showSeriesColor}
        color={color}
        onDelete={handleDeleteClick}
        onRequestOpen={onRequestOpen}
        onRequestClose={onRequestClose}
      >
        {SeriesStyle}
      </DeletableCollapsePanel>}
    </>
  )
}