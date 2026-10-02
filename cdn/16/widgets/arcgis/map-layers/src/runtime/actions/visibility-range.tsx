import { React } from 'jimu-core'
import Action from './action'
import type { Widget } from '../widget'
import VisibilityRangeSlider from '../components/visibility-range-slider'
import { RangeOutlined } from 'jimu-icons/outlined/application/range'
import { ACTION_INDEXES } from './constants'

export default class VisibilityRange extends Action {
  constructor (widget: Widget, title: string) {
    super()
    this.id = 'visibility-range'
    this.title = title
    this.className = 'esri-icon-sliders-horizontal'
    this.group = ACTION_INDEXES.VisibilityRange
    this.widget = widget
    this.icon = <RangeOutlined />
  }

  isValid = (layerItem, isTableList): boolean => {
    if (isTableList) {
      return false
    }
    return this.useMapWidget() && this.widget.props.config.visibilityRange
  }

  execute = (layerItem) => {
    const element = <VisibilityRangeSlider widget={this.widget} listItem={layerItem} />
    this.widget.setState({ nativeActionPopper: element })
  }
}
