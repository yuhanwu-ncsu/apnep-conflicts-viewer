import type { IconResult, ImmutableObject } from 'jimu-core'

export interface Config {
  type: 'dropdown' | 'button'
  useIcon: boolean
  icon?: IconResult
}

export type IMConfig = ImmutableObject<Config>
