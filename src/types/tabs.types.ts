export interface TabItem {
  label: string
  href: string
  /** A number shown as a badge beside the label. */
  count?: number
  /** Read by assistive technology in place of the badge; defaults to "<count> items". */
  countLabel?: string
  current?: boolean
  /** PynIcon name; icons show only when every tab has one. */
  icon?: string
  /** Holds the space of a count pill while the count is unknown, so the tab does not resize. */
  reserveCount?: boolean
}

export interface SettingsSection {
  id: string
  label: string
  href: string
  /** Consecutive sections with the same group share a heading. */
  group?: string
  /** PynIcon name shown before the label. */
  icon?: string
}

export interface SettingsGroup {
  label?: string
  sections: SettingsSection[]
}
