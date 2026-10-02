import { React, type DataSource } from 'jimu-core'
import type { AllWidgetSettingProps } from 'jimu-for-builder'
import type { IMConfig } from '../config'
import FilterDataSource from './components/filter-ds'
import { Placeholder } from './components/placeholder'
import { Source } from './components/source'
import { Styles } from './components/styles'
import { Options } from './components/options'

interface State {
  dataSources: { [dsId: string]: DataSource }
}

export default class Setting extends React.PureComponent<AllWidgetSettingProps<IMConfig>, State> {
  constructor (props) {
    super(props)
    this.state = { dataSources: {} }
  }

  onCreateDataSourceCreatedOrFailed = (dataSourceId: string, dataSource: DataSource) => {
    this.setState((state: State) => {
      const newDataSources = Object.assign({}, state.dataSources)
      newDataSources[dataSourceId] = dataSource
      return {
        dataSources: newDataSources
      }
    })
  }

  hidePlaceholder = () => {
    const { useDataSources, useMapWidgetIds } = this.props
    return useDataSources?.length > 0 || useMapWidgetIds?.length > 0
  }

  /**
   * Some rules:
   * 1. Data source change will not affect styles and options to default values.
   * 2. Show placeholder section when no data source is selected, including no single layer or no Map widget.
   */

  render () {
    const { id, config, useDataSources, useMapWidgetIds, onSettingChange } = this.props
    const { mapViewConfigList, addSourceByData = !window.isExpressBuilder } = config
    const showPlaceholder = !this.hidePlaceholder()

    return (
      <div className='jimu-widget-setting widget-date-filter d-flex flex-column' >
        {
          useDataSources?.map((useDs, index) => {
            return (
              <FilterDataSource
                key={index}
                useDataSource={useDs}
                onCreateDataSourceCreatedOrFailed={this.onCreateDataSourceCreatedOrFailed}
              />
            )
          })
        }
        <Source
          widgetId={id}
          config={config}
          hideBottomBorder={showPlaceholder}
          addSourceByData={addSourceByData}
          dataSources={this.state.dataSources}
          useMapWidgetIds={useMapWidgetIds}
          mapViewConfigList={mapViewConfigList}
          onSettingChange={this.props.onSettingChange}
        />
        {
          showPlaceholder ? <Placeholder addSourceByData={addSourceByData} />
            : <React.Fragment>
              <Styles
                widgetId={id}
                config={config}
                onSettingChange={onSettingChange}
              />
              <Options
                widgetId={id}
                config={config}
                onSettingChange={onSettingChange}
              />
            </React.Fragment>
        }
      </div>
    )
  }
}
