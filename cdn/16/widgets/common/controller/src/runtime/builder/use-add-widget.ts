import { type LayoutInfo, React, appActions, getAppStore, type LayoutItemConstructorProps, ReactRedux, type IMState } from 'jimu-core'
import { BASE_LAYOUT_NAME } from '../../common/consts'
import { getWidgetChildLayoutJson } from '../common/layout-utils'
import { insertWidgetToLayout } from './utils'
import { isTranslationEditingRestrictedInState } from 'jimu-for-builder'

const useAddWidget = (controllerId: string, afterAddWidget: (layoutInfo: LayoutInfo) => void) => {
  const onItemSelect = React.useCallback(async (item: LayoutItemConstructorProps) => {
    const layout = getWidgetChildLayoutJson(controllerId, BASE_LAYOUT_NAME)
    const insertIndex = layout.order?.length ?? 0
    try {
      const layoutInfo = await insertWidgetToLayout(layout, item, insertIndex)
      if (layoutInfo) {
        afterAddWidget(layoutInfo)
      }
    } catch (e) {
      console.error('Failed to add widget')
    }
  }, [controllerId, afterAddWidget])

  const itemToAdd = ReactRedux.useSelector((state: IMState) => state.widgetsState[controllerId]?.itemToAdd)
  const isTranslationRestricted = ReactRedux.useSelector((state: IMState) => isTranslationEditingRestrictedInState(state, 'controller'))
  React.useEffect(() => {
    if (itemToAdd) {
      if (!isTranslationRestricted) {
        onItemSelect(itemToAdd)
      }
      getAppStore().dispatch(appActions.widgetStatePropChange(controllerId, 'itemToAdd', null))
    }
  }, [controllerId, itemToAdd, isTranslationRestricted, onItemSelect])
}

export default useAddWidget
