import { React, classNames, hooks, type QueriableDataSource, QueryScope, DataSourceManager } from 'jimu-core'
import { LoadOutlined } from 'jimu-icons/outlined/editor/load'
import { Button, Loading, LoadingType, Tooltip } from 'jimu-ui'
import defaultMessages from '../../../../../../../translations/default'
import { Message } from '../../components'
import { queryFieldUniqueValues } from '../../../../../../../../../src/utils/common'

type CategoryValue = string | number | null

interface CategoryLoaderProps {
  className?: string
  dataSourceId: string
  categoryField: string
  values?: CategoryValue[]
  fetchNullValues?: boolean
  onChange?: (values: CategoryValue[]) => void
}

const NumberPerLoads = 10
const NumberMaxCount = 100

const loadCategoryValues = async (
  dataSource: QueriableDataSource,
  field: string,
  inputValues: Array<string | number>,
  fetchNullValues: boolean,
  count: number = NumberPerLoads
): Promise<{ values: Array<string | number>, hasNull: boolean }> => {
  const uniqueValues = await queryFieldUniqueValues(dataSource, field, 101, QueryScope.InConfigView, fetchNullValues)
  const values: Array<string | number> = []
  let hasNull = false
  let counter = 0
  uniqueValues.some((value) => {
    if (value === null) {
      hasNull = true
      return false
    }
    if (counter === count) return true
    if (value !== undefined && !inputValues.includes(value)) {
      values.push(value)
      counter++
    }
    return false
  })
  return { values, hasNull }
}

const getLoadState = (inputValues: Array<string | number>, values: Array<string | number>): 'loadout' | 'exceed' => {
  const valuesCount = values.length
  if (valuesCount === 0) return 'loadout'
  const inputValuesCount = inputValues.length
  const exceedCount = inputValuesCount + valuesCount - NumberMaxCount
  if (exceedCount >= 0) return 'exceed'
}

export const CategoryLoader = (props: CategoryLoaderProps): React.ReactElement => {
  const { className, dataSourceId, categoryField, values: propValues = [], fetchNullValues = false, onChange } = props
  const translate = hooks.useTranslation(defaultMessages)
  const [version, setVersion] = React.useState(0)
  const [loading, setLoading] = React.useState(false)
  const messageRef = React.useRef('')

  const dataSource = React.useMemo(() => DataSourceManager.getInstance().getDataSource(dataSourceId) as QueriableDataSource, [dataSourceId])

  const handleLoadClick = async () => {
    try {
      setLoading(true)
      const inputNonNullValues = propValues.filter((value): value is string | number => value !== null)
      const { values: nextValues, hasNull } = await loadCategoryValues(dataSource, categoryField, inputNonNullValues, fetchNullValues)
      const hasExistingNull = propValues.includes(null)
      const hasNewNull = hasNull && !hasExistingNull
      const state = getLoadState(inputNonNullValues, nextValues)
      let values: CategoryValue[] = inputNonNullValues.concat(nextValues)
      if (state && !(state === 'loadout' && hasNewNull)) {
        messageRef.current = state === 'loadout' ? translate('categoriesLatest') : translate('manyDistinctValues')
        setVersion(v => v + 1)
      }
      if (state === 'exceed') {
        values = values.slice(0, NumberMaxCount)
      }
      if (hasExistingNull || hasNewNull) {
        values = values.concat(null)
      }
      if (state !== 'loadout' || hasNewNull) {
        onChange?.(values)
      }
      setLoading(false)
    } catch (error) {
      setLoading(false)
      console.error(error)
      messageRef.current = translate('fetchFieldValueFailed')
      setVersion(v => v + 1)
    }
  }

  return (<>
    <Tooltip placement='left' title={translate('loadMoreCategory')} showArrow enterDelay={300}>
      <Button aria-label={translate('loadMoreCategory')} className={classNames('category-loader', className)} size='sm' icon onClick={handleLoadClick}>
        <LoadOutlined size='m' />
      </Button>
    </Tooltip>
    <Message version={version} message={messageRef.current} />
    {loading && <Loading type={LoadingType.Secondary} />}
  </>)
}