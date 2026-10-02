import type { extensionSpec, IMAppConfig } from 'jimu-core'
import { defaultMessages as jimuUIMessage } from 'jimu-ui'
import defaultMessage from '../setting/translations/default'
import type { IMConfig } from '../config'

const messages = Object.assign({}, jimuUIMessage, defaultMessage)

export default class BuilderOperations implements extensionSpec.BuilderOperationsExtension {
  id = 'chart-builder-operation'
  widgetId: string

  getTranslationKey (appConfig: IMAppConfig): Promise<extensionSpec.TranslationKey[]> {
    const keys: extensionSpec.TranslationKey[] = []

    const chartConfig = appConfig.widgets[this.widgetId].config as IMConfig

    if (chartConfig) {
      // title
      if (chartConfig.webChart?.title?.content?.text) {
        keys.push({
          keyType: 'value',
          key: `widgets.${this.widgetId}.config.webChart.title.content.text`,
          label: {
            key: 'chartTitle',
            enLabel: messages.chartTitle
          },
          valueType: 'text'
        })
      }

      // description
      if (chartConfig.webChart?.footer?.content?.text) {
        keys.push({
          keyType: 'value',
          key: `widgets.${this.widgetId}.config.webChart.footer.content.text`,
          label: {
            key: 'chartDescription',
            enLabel: messages.chartDescription
          },
          valueType: 'text'
        })
      }

      // legend title
      if (chartConfig.webChart?.legend?.title?.content?.text) {
        keys.push({
          keyType: 'value',
          key: `widgets.${this.widgetId}.config.webChart.legend.title.content.text`,
          label: {
            key: 'legendTitle',
            enLabel: messages.legendTitle
          },
          valueType: 'text'
        })
      }

      if (chartConfig.webChart?.axes) {
        const axes = chartConfig.webChart?.axes
        // x axis
        if (axes[0]?.title?.content?.text) {
          const xAxisGroupKey = `widgets.${this.widgetId}.config.webChart.axes[0]`
          const xAxisGroup: extensionSpec.TranslationKey = {
            keyType: 'group',
            key: xAxisGroupKey,
            label: messages.xAxis
          }
          const xAxisLabel: extensionSpec.TranslationKey = {
            keyType: 'value',
            key: `widgets.${this.widgetId}.config.webChart.axes[0].title.content.text`,
            groupKey: xAxisGroupKey,
            label: {
              key: 'axisTitle',
              enLabel: messages.axisTitle
            },
            valueType: 'text'
          }
          keys.push(xAxisGroup, xAxisLabel)
        }

        if (axes[1]) {
          // y axis
          if (axes[1].title?.content?.text) {
            const yAxisGroupKey = `widgets.${this.widgetId}.config.webChart.axes[1]`
            const yAxisGroup: extensionSpec.TranslationKey = {
              keyType: 'group',
              key: yAxisGroupKey,
              label: messages.yAxis
            }
            const yAxisLabel: extensionSpec.TranslationKey = {
              keyType: 'value',
              key: `widgets.${this.widgetId}.config.webChart.axes[1].title.content.text`,
              groupKey: yAxisGroupKey,
              label: {
                key: 'axisTitle',
                enLabel: messages.axisTitle
              },
              valueType: 'text'
            }
            keys.push(yAxisGroup, yAxisLabel)
          }

          // auxiliary guide
          if (axes[1].guides) {
            axes[1].guides.forEach((guide, i) => {
              const guideGroupKey = `widgets.${this.widgetId}.config.webChart.axes[1].guides[${i}]`
              keys.push({
                keyType: 'group',
                key: guideGroupKey,
                label: guide.name
              })
              keys.push({
                keyType: 'value',
                key: `widgets.${this.widgetId}.config.webChart.axes[1].guides[${i}].label.text`,
                groupKey: guideGroupKey,
                label: messages.label,
                valueType: 'text'
              })
            })
          }
        }
      }

      // no data message
      if (chartConfig.messages?.noDataMessage) {
        keys.push({
          keyType: 'value',
          key: `widgets.${this.widgetId}.config.messages.noDataMessage`,
          label: {
            key: 'customizeNoDataMessage',
            enLabel: messages.customizeNoDataMessage
          },
          valueType: 'text'
        })
      }
    }

    return Promise.resolve(keys)
  }
}