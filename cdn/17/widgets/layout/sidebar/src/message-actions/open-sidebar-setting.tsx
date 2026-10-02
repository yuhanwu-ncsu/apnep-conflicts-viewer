/** @jsx jsx */
import {
  React, jsx, type ActionSettingProps, Immutable, type UseDataSource, MessageType,
  DataSourceTypes,
  dataSourceUtils
} from 'jimu-core'
import { withTheme } from 'jimu-theme'
import type { ActionConfig } from './types'
import { SettingSection, SettingRow, MessageActionDataSelector } from 'jimu-ui/advanced/setting-components'
import { DataSourceSelector } from 'jimu-ui/advanced/data-source-selector'
import { Label, Radio, Checkbox } from 'jimu-ui'

interface State {
  useCustomData: boolean
}

const dsTypes = Immutable([
  DataSourceTypes.FeatureLayer,
  DataSourceTypes.SceneLayer,
  DataSourceTypes.BuildingComponentSubLayer,
  DataSourceTypes.ImageryLayer,
  DataSourceTypes.OrientedImageryLayer,
  DataSourceTypes.SubtypeGroupLayer,
  DataSourceTypes.SubtypeSublayer
])

class _OpenSidebarSetting extends React.PureComponent<ActionSettingProps<ActionConfig>, State> {
  constructor (props: ActionSettingProps<ActionConfig>) {
    super(props)
    this.state = {
      useCustomData: this.props.config?.useDataSources?.length > 0
    }
  }

  handleDataChange = (useDataSources: UseDataSource[]) => {
    this.props.onSettingChange({
      actionId: this.props.actionId,
      config: { useDataSources: useDataSources?.length > 0 ? useDataSources : [] }
    })
  }

  handleAutoCloseChange = (evt, checked) => {
    this.props.onSettingChange({
      actionId: this.props.actionId,
      config: {
        ...(this.props.config || {}),
        autoCloseWhenNoSelection: checked
      }
    })
  }

  useAllData = () => {
    this.setState({ useCustomData: false })
    this.handleDataChange([])
  }

  render () {
    if (this.props.messageType !== MessageType.DataRecordsSelectionChange) {
      return null
    }

    const { messageWidgetId, config, dataSourceId } = this.props

    const dsSelectorSourceData = Immutable([dataSourceUtils.getUseDataSourceByDataSourceId(dataSourceId)])
    const autoCloseWhenNoSelection = config?.autoCloseWhenNoSelection || false
    const isUsedInDsSetting = dataSourceId != null
    return (
      <SettingSection className='border-0' title={this.props.intl.formatMessage({ id: 'messageAction_TriggerData' })}>
        {!isUsedInDsSetting && (
          <SettingRow>
            <div>
              <div>
                <Label check centric>
                  <Radio
                    name='useAllData'
                    style={{ cursor: 'pointer' }}
                    value='all'
                    className='mr-2'
                    checked={!this.state.useCustomData}
                    onClick={this.useAllData}
                  />
                  {this.props.intl.formatMessage({ id: 'allDataWithoutCount' })}
                </Label>
              </div>
              <div className='mt-2'>
                <Label check centric>
                  <Radio
                    name='useCustomData'
                    style={{ cursor: 'pointer' }}
                    value='custom'
                    className='mr-2'
                    checked={this.state.useCustomData}
                    onClick={() => { this.setState({ useCustomData: true }) }}
                  />
                  {this.props.intl.formatMessage({ id: 'custom' })}
                </Label>
              </div>
            </div>
          </SettingRow>
        )}
        {(this.state.useCustomData || isUsedInDsSetting) && (
          <SettingRow flow='wrap'>
            {!isUsedInDsSetting && (
              <MessageActionDataSelector
                messageWidgetId={messageWidgetId}
                messageType={MessageType.DataRecordsSelectionChange}
                useDataSources={Immutable(config?.useDataSources ?? [])}
                types={dsTypes}
                onChange={this.handleDataChange}
              />
            )}
            {isUsedInDsSetting && (
              <DataSourceSelector
                types={dsTypes}
                fromDsIds={Immutable([dataSourceId])}
                useDataSources={dsSelectorSourceData}
                disableDataSourceList={isUsedInDsSetting}
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
            )}
          </SettingRow>
        )}
        <SettingRow>
          <Label centric>
            <Checkbox
              aria-label={this.props.intl.formatMessage({ id: 'closeSidebarWhenSelectionIsEmpty' })}
              checked={autoCloseWhenNoSelection}
              onChange={this.handleAutoCloseChange}
            />
            <span className='ml-2'>{this.props.intl.formatMessage({ id: 'closeSidebarWhenSelectionIsEmpty' })}</span>
          </Label>
        </SettingRow>
      </SettingSection>
    )
  }
}

export default withTheme(_OpenSidebarSetting)
