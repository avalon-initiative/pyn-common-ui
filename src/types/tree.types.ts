export type TreeMode = 'shared' | 'exclusive' | 'mixed'

export interface Crumb {
  label: string
  /** Absent on the current location. */
  href?: string
}
