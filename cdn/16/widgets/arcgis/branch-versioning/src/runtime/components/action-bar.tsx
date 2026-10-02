/** @jsx jsx */
import { React, jsx, hooks } from 'jimu-core'
import { DisplayType, DockedPosition, LayoutType, MessageType, type IMConfig } from '../../config'
import { useBranchVersioningActions, useBranchVersioningState } from '../context/state/branch-versioning-context'
import type { VersionIdentifier } from 'esri/versionManagement/support/jsonTypes'
import { buildMessage } from '../utils/utils'
import { getDiscardActionStyle } from '../lib/style'
import defaultMessages from '../translations/default'
import 'calcite-components'

export interface ActionBarProps {
  config: IMConfig
  className?: string
  floating?: boolean
}

export const ActionBar = (props: ActionBarProps) => {
  const { config, className, floating = false } = props
  const toolbarConfig = config.editToolBar

  // Get state from context
  const state = useBranchVersioningState()
  const actions = useBranchVersioningActions()
  const getI18nMessage = hooks.useTranslation(defaultMessages)

  // Determine if text labels should be shown based on layout for reconcile and post actions
  const showText = React.useMemo(() => {
    return toolbarConfig?.layoutType === LayoutType.HORIZONTAL
  }, [toolbarConfig])

  // Determine if save, undo, redo, and discard action groups should be rendered
  const showStartGroup = React.useMemo(() => {
    return toolbarConfig?.undoEnabled || toolbarConfig?.redoEnabled || toolbarConfig?.saveEnabled || toolbarConfig?.discardEnabled
  }, [toolbarConfig])

  // Determine if reconcile and post action group should be rendered
  const showEndGroup = React.useMemo(() => {
    return toolbarConfig?.reconcileEnabled || toolbarConfig?.postEnabled
  }, [toolbarConfig])

  // Display date last reconciled for all non-default versions
  const getReconcileTooltip = React.useCallback((): string => {
    let tooltip = ''
    state.versioningStates.forEach((vs) => {
      if (!vs.isDefault) {
        if (tooltip.length > 0) {
          tooltip += '\n'
        }
        const name = (vs.currentVersion as VersionIdentifier).name
        const date = vs.currentVersionInfo.reconcileDate ? new Date(vs.currentVersionInfo.reconcileDate) : null
        tooltip = getI18nMessage('reconcileTooltip', { versionName: name, date: date ? date.toLocaleString() : 'N/A' })
      }
    })
    return tooltip
  }, [state, getI18nMessage])

  // Determine tooltip placement based on toolbar position
  const getToolTipPosition = React.useCallback((): 'top' | 'bottom' | 'left' | 'right' | 'auto' => {
    if (toolbarConfig.displayType === DisplayType.FLOATING) {
      return 'auto'
    }
    switch (toolbarConfig?.dockedPosition) {
      case DockedPosition.BOTTOM:
        return 'top'
      case DockedPosition.TOP:
        return 'bottom'
      case DockedPosition.LEFT:
        return 'right'
      case DockedPosition.RIGHT:
        return 'left'
    }
  }, [toolbarConfig])

  // Handle save action. Show confirmation dialog if enabled
  const handleSave = React.useCallback(() => {
    if (state.showSaveDialog) {
      actions.setMessage(buildMessage(
        getI18nMessage('saveLabel'),
        getI18nMessage('confirmSaveEdits'),
        MessageType.SAVE
      ))
    } else {
      actions.save()
    }
  }, [state.showSaveDialog, actions, getI18nMessage])

  // Handle discard action. Show confirmation dialog if enabled
  const handleDiscard = React.useCallback(() => {
    if (state.showDiscardDialog) {
      actions.setMessage(buildMessage(
        getI18nMessage('discardLabel'),
        getI18nMessage('confirmDiscardEdits'),
        MessageType.DISCARD
      ))
    } else {
      actions.discard()
    }
  }, [state.showDiscardDialog, actions, getI18nMessage])

  // Determine if the action button should be disabled based on the current state
  const getIsDisabled = React.useCallback((id: string): boolean => {
    switch (id) {
      case "save-action":
        return !state.canSave
      case "discard-action":
        return !state.canDiscard
      case "undo-action":
        return !state.canUndo
      case "redo-action":
        return !state.canRedo
      case "reconcile-action":
        return !state.canReconcile || state.isReconciling
      case "post-action":
        return !state.canPost || state.isPosting
      default:
        return false
    }
  }, [state])

  // Render a tooltip for the given action
  const renderTooltip = (id: string, message: string) => {
    return (
      <calcite-tooltip
        reference-element={id}
        placement={getToolTipPosition()}
        style={{ '--calcite-tooltip-max-size-x': 'none' } as React.CSSProperties}
      >
        <span style={{ whiteSpace: 'pre' }}>{message}</span>
      </calcite-tooltip>
    )
  }

  // Render a single action button
  const renderAction = (id: string, icon: string, label: string, onClick: () => void) => {
    const isDisabled = getIsDisabled(id)
    const cssStyle = id === 'discard-action' && !isDisabled ? getDiscardActionStyle() : undefined
    const indicator = id === 'save-action' && !isDisabled && state.isEditing
    const displayText = id === 'reconcile-action' || id === 'post-action' ? showText : false
    const isLoading = id === 'reconcile-action' ? state.isReconciling : id === 'post-action' ? state.isPosting : undefined
    return (
      <calcite-action
        id={id}
        icon={icon as any}
        scale={toolbarConfig?.scale || "m"}
        text={label}
        label={label}
        text-enabled={displayText}
        disabled={isDisabled}
        loading={isLoading}
        indicator={indicator}
        css={cssStyle}
        onClick={onClick}
      />
    )
  }

  return (
    <calcite-action-bar
      className={className}
      expand-disabled={true}
      expanded={false}
      layout={toolbarConfig.layoutType}
      floating={floating}
      scale={toolbarConfig.scale || 'm'}
      slot="action-bar"
    >
      {/* Save, undo, redo, and discard actions group */}
      {showStartGroup && (
        <calcite-action-group>
          {toolbarConfig.undoEnabled && (
            renderAction("undo-action", "undo", getI18nMessage('undoLabel'), actions.undo)
          )}
          {toolbarConfig.redoEnabled && (
            renderAction("redo-action", "redo", getI18nMessage('redoLabel'), actions.redo)
          )}
          {toolbarConfig.discardEnabled && (
            renderAction("discard-action", "trash", getI18nMessage('discardLabel'), handleDiscard)
          )}
          {toolbarConfig.saveEnabled && (
            renderAction("save-action", "save", getI18nMessage('saveLabel'), handleSave)
          )}
        </calcite-action-group>
      )}

      {/* Reconcile and post actions group */}
      {showEndGroup && (
        <calcite-action-group slot='actions-end'>
          {toolbarConfig.reconcileEnabled && (
            renderAction("reconcile-action", "refresh", getI18nMessage('reconcileLabel'), actions.reconcile)
          )}
          {toolbarConfig.postEnabled && (
            renderAction("post-action", "upload", getI18nMessage('postLabel'), actions.post)
          )}
        </calcite-action-group>
      )}

      {/* Tooltips for actions */}
      {toolbarConfig.undoEnabled && state.canUndo && (renderTooltip("undo-action", getI18nMessage('undoTooltip')))}
      {toolbarConfig.redoEnabled && state.canRedo && (renderTooltip("redo-action", getI18nMessage('redoTooltip')))}
      {toolbarConfig.discardEnabled && state.isEditing && (renderTooltip("discard-action", getI18nMessage('discardTooltip')))}
      {toolbarConfig.saveEnabled && state.isEditing && (renderTooltip("save-action", getI18nMessage('saveTooltip')))}
      {toolbarConfig.postEnabled && state.canPost && (renderTooltip("post-action", getI18nMessage('postTooltip')))}
      {toolbarConfig.reconcileEnabled && state.canReconcile && (renderTooltip("reconcile-action", getReconcileTooltip()))}
      {toolbarConfig.postEnabled && state.canPost && (renderTooltip("post-action", getI18nMessage('postTooltip')))}
    </calcite-action-bar>
  )
}
