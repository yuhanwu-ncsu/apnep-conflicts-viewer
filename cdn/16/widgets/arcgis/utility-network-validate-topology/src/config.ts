import type { ImmutableObject } from 'jimu-core'

export interface Config {
  extentToValidate: "current" | "entire"
}

export type IMConfig = ImmutableObject<Config>
