import { type DataSource, DataSourceManager, hooks, Immutable, type IMUseDataSource, JimuFieldType, React } from 'jimu-core'
import { defaultMessages as jimuUIMessages, Loading, LoadingType } from 'jimu-ui'
import { DataSourceSelector, FieldSelector } from 'jimu-ui/advanced/data-source-selector'
import { SettingRow, SettingSection } from 'jimu-ui/advanced/setting-components'
import { getFirstDateField, SUPPORTED_LAYER_TYPES } from '../../utils/utils'
import defaultMessages from './../translations/default'

const LAYER_TYPES = Immutable(SUPPORTED_LAYER_TYPES)
const FIELD_TYPES = Immutable([JimuFieldType.Date, JimuFieldType.DateOnly])

interface SourceLayerConfigProps {
  // show ds selector when add data by data
  addDataByData: boolean
  useDataSource: IMUseDataSource
  onDataSourceChange?: (allSelectedDs: any[]) => void
  // set fields from the selected ds
  dataSource: DataSource
  startField: string
  endField: string
  onFieldsChange: (startField: string, endField: string) => void
}

export const SourceLayerConfig = (props: SourceLayerConfigProps) => {
  const { addDataByData = false, useDataSource, dataSource, startField, endField, onDataSourceChange, onFieldsChange } = props
  const dsManager = DataSourceManager.getInstance()
  const i18n = hooks.useTranslation(defaultMessages, jimuUIMessages)

  const onStartFieldChange = (allSelectedFields: any[]) => {
    onFieldsChange(allSelectedFields[0]?.jimuName || null, endField)
  }

  const onEndFieldChange = (allSelectedFields: any[]) => {
    onFieldsChange(startField, allSelectedFields[0]?.jimuName || null)
  }

  const hideDs = (dsJson) => {
    const ds = dsManager?.getDataSource(dsJson.id)
    return !getFirstDateField(ds)
  }

  // data mode: hide selection view. (TODO: the fields need to be saved to useDataSource when selection ds is supported.)
  // map mode: hide all views.
  const hideDataView = (dsJson) => {
    return !addDataByData || dsJson.id === 'selection'
  }

  const useDs = React.useMemo(() => {
    return useDataSource ? Immutable([useDataSource]) : Immutable([])
  }, [useDataSource])

  // Only fields with the same date type as the `startField` will be displayed as options for the `endField`.
  const hiddenFields = React.useMemo(() => {
    if (!dataSource || !startField) {
      return null
    }
    const fields = dataSource.getSchema().fields
    const fieldList = Object.keys(fields)
    const startFieldObj = fields[fieldList.find(fName => fields[fName].jimuName === startField)]
    const hiddenFields = fieldList.filter(fName => fields[fName].type !== startFieldObj.type)
    return Immutable(hiddenFields)
  }, [dataSource, startField])

  if (!addDataByData && !useDataSource) {
    return <Loading type={LoadingType.Secondary} useAriaLive />
  }

  return (
    <React.Fragment>
      <SettingSection title={i18n('data')}>
        <SettingRow>
          <DataSourceSelector
            types={LAYER_TYPES}
            useDataSources={useDs}
            mustUseDataSource
            hideDataView={hideDataView}
            hideDs={hideDs}
            closeDataSourceListOnChange={true}
            disableRemove={() => true}
            onChange={onDataSourceChange}
            disableDataSourceList={!addDataByData}
          />
        </SettingRow>
      </SettingSection>
      {
        dataSource && <SettingSection title={i18n('fields')}>
          <SettingRow label={i18n('start')} />
          <SettingRow className='mt-2'>
            <FieldSelector
              aria-label={i18n('start')}
              types={FIELD_TYPES}
              dataSources={[dataSource]}
              selectedFields={Immutable([startField])}
              isDataSourceDropDownHidden
              useDropdown
              onChange={(allSelectedFields) => { onStartFieldChange(allSelectedFields) }}
            />
          </SettingRow>
          <SettingRow label={i18n('end')} />
          <SettingRow className='mt-2'>
            <FieldSelector
              aria-label={i18n('end')}
              types={FIELD_TYPES}
              noSelectionItem={{ name: '-' }} // TODO: it can be empty
              dataSources={[dataSource]}
              hiddenFields={hiddenFields}
              selectedFields={Immutable([endField])}
              isDataSourceDropDownHidden
              useDropdown
              onChange={(allSelectedFields) => { onEndFieldChange(allSelectedFields) }}
            />
          </SettingRow>

        </SettingSection>
      }
    </React.Fragment>
  )
}