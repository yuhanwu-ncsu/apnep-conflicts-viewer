import type { extensionSpec, IMAppConfig, ImmutableObject } from 'jimu-core'
import { type CustomToolConfig, ToolType, type IMConfig } from '../config'
import { getDisplayedCustomToolName } from '../utils/shared-utils'

export default class BuilderOperations implements extensionSpec.BuilderOperationsExtension {
  id = 'analysis-builder-operation'
  widgetId: string

  getTranslationKey (appConfig: IMAppConfig): Promise<extensionSpec.TranslationKey[]> {
    const toolList = (appConfig.widgets[this.widgetId].config as IMConfig).toolList
    const hasCustomWebTool = toolList.some((tool) => tool.type === ToolType.Custom)
    const keys: extensionSpec.TranslationKey[] = []
    if (hasCustomWebTool) {
      toolList.forEach((tool, index) => {
        if (tool.type === ToolType.Custom) {
          const toolDisplayName = getDisplayedCustomToolName(tool, appConfig.utilities)
          // add a group for each tool
          const groupId = `widgets.${this.widgetId}.${index}`
          keys.push({
            keyType: 'group',
            key: groupId,
            label: toolDisplayName
          })

          keys.push({
            keyType: 'value',
            key: `widgets.${this.widgetId}.config.toolList[${index}].config.option.toolDisplayName`,
            defaultValue: toolDisplayName,
            groupKey: groupId,
            label: {
              key: 'nameForTool',
              enLabel: `Name for "${toolDisplayName}"`,
              values: {
                toolName: toolDisplayName
              }
            },
            valueType: 'text'
          })

          const params = (tool.config as ImmutableObject<CustomToolConfig>).toolInfo.parameters
          params.forEach((param, paramIndex) => {
            keys.push({
              keyType: 'value',
              key: `widgets.${this.widgetId}.config.toolList[${index}].config.toolInfo.parameters[${paramIndex}].displayName`,
              groupKey: groupId,
              label: {
                key: 'labelForParam',
                enLabel: `Label for "${param.name}"`,
                values: {
                  paramName: param.name
                }
              },
              valueType: 'text'
            })
          })
        }
      })
    }

    return Promise.resolve(keys)
  }
}
