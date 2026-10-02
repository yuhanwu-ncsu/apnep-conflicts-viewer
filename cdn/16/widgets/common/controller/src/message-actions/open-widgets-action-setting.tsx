import { React, type ActionSettingProps, Immutable, hooks, defaultMessages as jimuCoreMessages, MessageType, type UseDataSource, DataSourceTypes, dataSourceUtils } from 'jimu-core'
import { Label, Radio, defaultMessages as jimuUIMessages } from 'jimu-ui'
import { SettingSection, SettingRow, MessageActionDataSelector } from 'jimu-ui/advanced/setting-components'
import { DataSourceSelector } from 'jimu-ui/advanced/data-source-selector'
import type { IMActionConfig } from '../config'
import defaultMessages from '../setting/translations/default'
import SelectWidgets from './components/select-widgets'

const dsTypes = Immutable([
  DataSourceTypes.FeatureLayer,
  DataSourceTypes.SceneLayer,
  DataSourceTypes.BuildingComponentSubLayer,
  DataSourceTypes.ImageryLayer,
  DataSourceTypes.OrientedImageryLayer,
  DataSourceTypes.SubtypeGroupLayer,
  DataSourceTypes.SubtypeSublayer
])

export default function OpenWidgetsActionSetting (props: ActionSettingProps<IMActionConfig>) {
  const { actionId, widgetId, messageWidgetId, messageType, dataSourceId, onSettingChange } = props
  const config = props.config

  const showTriggerData = [MessageType.DataRecordsSelectionChange].includes(messageType)
  const shouldFixTriggerData = showTriggerData && !!dataSourceId
  const fixedUseDataSources = React.useMemo(() => {
    if (!dataSourceId) return null
    return Immutable([dataSourceUtils.getUseDataSourceByDataSourceId(dataSourceId)])
  }, [dataSourceId])

  const translate = hooks.useTranslation(defaultMessages, jimuCoreMessages, jimuUIMessages)

  const [useCustomData, setUseCustomData] = React.useState(config.useDataSources?.length > 0)
  const handleUseCustomData = React.useCallback((isUseCustomData: boolean) => {
    setUseCustomData(isUseCustomData)
    if (!isUseCustomData) {
      onSettingChange({
        actionId,
        config: config.set('useDataSources', [])
      })
    }
  }, [actionId, config, onSettingChange])

  const handleChangeData = React.useCallback((useDataSources: UseDataSource[]) => {
    onSettingChange({
      actionId,
      config: config.set('useDataSources', useDataSources)
    })
  }, [actionId, config, onSettingChange])

  React.useEffect(() => {
    if (!shouldFixTriggerData || !fixedUseDataSources?.[0]) return

    const fixedUseDs = fixedUseDataSources[0]
    const currentUseDss = config.useDataSources || []
    const currentUseDs = currentUseDss[0]
    const isFixed = currentUseDss.length === 1 && currentUseDs?.dataSourceId === fixedUseDs.dataSourceId

    if (isFixed) return

    onSettingChange({
      actionId,
      config: config.set('useDataSources', fixedUseDataSources.asMutable({ deep: true }))
    })
  }, [actionId, config, fixedUseDataSources, onSettingChange, shouldFixTriggerData])

  const handleChangeWidgets = React.useCallback((widgetIds: string[]) => {
    onSettingChange({
      actionId,
      config: config.set('widgetIds', widgetIds)
    })
  }, [actionId, config, onSettingChange])

  return <div>
    {showTriggerData && <SettingSection title={translate('messageAction_TriggerData')}>
      {shouldFixTriggerData && <SettingRow flow='wrap'>
        <DataSourceSelector
          types={dsTypes}
          useDataSources={fixedUseDataSources}
          fromDsIds={dataSourceId ? Immutable([dataSourceId]) : undefined}
          disableDataSourceList
          mustUseDataSource
          isMultiple
          isMultipleDataView
          hideAddDataButton
          hideDataView
          hideTypeDropdown
          enableToSelectOutputDsFromSelf
          disableSelection={() => true}
          disableRemove={() => true}
        />
      </SettingRow>}
      {!shouldFixTriggerData && <>
        <SettingRow>
          <Label>
            <Radio className='mr-2' checked={!useCustomData} onChange={() => { handleUseCustomData(false) }} />
            { translate('allDataWithoutCount') }
          </Label>
        </SettingRow>
        <SettingRow>
          <Label className='d-flex align-items-center label-line-height'>
            <Radio className='mr-2' checked={useCustomData} onChange={() => { handleUseCustomData(true) }} />
            { translate('custom') }
          </Label>
        </SettingRow>
        {useCustomData && <SettingRow flow='wrap'>
          <MessageActionDataSelector
            messageWidgetId={messageWidgetId}
            messageType={messageType}
            types={dsTypes}
            useDataSources={config.useDataSources}
            onChange={handleChangeData}
          />
        </SettingRow>}
      </>}
    </SettingSection>}
    <SettingSection>
      <SettingRow label={translate('messageAction_openWidget')} flow='wrap'>
        <SelectWidgets
          widgetId={widgetId}
          selectedWidgetIds={config.widgetIds}
          onChange={handleChangeWidgets}
        />
      </SettingRow>
    </SettingSection>
  </div>
}
