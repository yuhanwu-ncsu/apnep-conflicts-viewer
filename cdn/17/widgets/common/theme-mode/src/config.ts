import type { ImmutableObject } from 'jimu-core'

export interface ThemeModeConfig {
  iconSize: number
  iconColor: string
}

export type IMConfig = ImmutableObject<ThemeModeConfig>
