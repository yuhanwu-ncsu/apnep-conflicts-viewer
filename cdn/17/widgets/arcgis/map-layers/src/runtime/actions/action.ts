import type { Widget } from '../widget'
import type { AnyListItem } from '../types'

export default class Action {
  id: string = 'id'
  title: string = 'title'
  className: string = 'esri-icon'
  iconName?: string = null
  group: number = 0
  widget: Widget = null
  icon?: React.JSX.Element = null

  useMapWidget (): boolean {
    return this.widget.props.config.useMapWidget
  }

  isValid = (layerItem: AnyListItem, isTableList: boolean = false): boolean => false
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  execute = (layerItem: AnyListItem): void | React.JSX.Element => {}
}
