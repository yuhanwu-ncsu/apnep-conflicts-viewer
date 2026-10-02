import type { VersionIdentifier } from 'esri/versionManagement/support/jsonTypes'
import type { ImmutableObject } from 'seamless-immutable'
import { type ControllerPanelJson, FixedPosition } from 'jimu-core'

export enum DockedPosition {
  LEFT = 'panel-start',
  TOP = 'panel-top',
  RIGHT = 'panel-end',
  BOTTOM = 'panel-bottom'
}

export enum VersioningStateEventType {
  CHANGED = "version-changed",
  CREATED = "version-created",
  DELETED = "version-deleted",
  SWITCHED = "version-switched"
}

export enum DisplayType {
  DOCKED = 'docked',
  FLOATING = 'floating'
}

export enum CalciteScale {
  SMALL = 's',
  MEDIUM = 'm',
  LARGE = 'l'
}

export enum LayoutType {
  HORIZONTAL = 'horizontal',
  VERTICAL = 'vertical'
}

export enum ApplyEditType {
  SERVICE = 'service',
  LAYER = 'layer',
  LRS = 'lrs'
}

export enum MessageType {
  NONE = 'none',
  ALERT = 'alert',
  SAVE = 'save',
  DISCARD = 'discard',
  RECONCILE_NO_ERROR = 'reconcile-no-error',
  RECONCILE_ERROR = 'reconcile-error'
}

export enum AlertType {
  BRAND = 'brand',
  DANGER = 'danger',
  INFO = 'info',
  SUCCESS = 'success',
  WARNING = 'warning'
}

export interface MessageParams {
  title: string
  message: string
  type: MessageType
  kind: AlertType
}

export interface VersionInfos {
  default: VersionIdentifier
  serviceName: string;
  versionIdentifiers: VersionIdentifier[]
}

export const DEFAULT_FLOATING_LAYOUT_STYLE: ControllerPanelJson = {
  position: FixedPosition.TopLeft,
  width: '375px',
  height: '75px',
  offsetX: 0,
  offsetY: 0
}

export interface StackItem {
  moment: number | string
  timestamp: Date
  serviceUrl?: string
  layerIds?: number[] // Layer IDs that were affected by this edit
}

export interface EditResult {
  moment?: number
  layerIds?: number[]
}

export interface EditToolBar {
  scale: 's' | 'm' | 'l'
  displayType: DisplayType
  dockedPosition: DockedPosition
  layoutType: LayoutType
  floatingPanelJson: ImmutableObject<ControllerPanelJson>
  saveEnabled: boolean
  discardEnabled: boolean
  undoEnabled: boolean
  redoEnabled: boolean
  reconcileEnabled: boolean
  postEnabled: boolean
  showDialogOnSave: boolean
  showDialogOnDiscard: boolean
}

export interface Config {
  defaultVersions: { [key: string]: VersionIdentifier }
  manageVersionsEnabled: boolean
  editSessionsEnabled: boolean
  editToolBar: EditToolBar
}

export type IMConfig = ImmutableObject<Config>
