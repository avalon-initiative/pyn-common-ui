export interface TabItem {
  label: string
  href: string
  /** A number shown as a badge beside the label. */
  count?: number
  /** Read by assistive technology in place of the badge; defaults to "<count> items". */
  countLabel?: string
  current?: boolean
}

export interface SettingsSection {
  id: string
  label: string
  href: string
  /** Consecutive sections with the same group share a heading. */
  group?: string
}

export interface SettingsGroup {
  label?: string
  sections: SettingsSection[]
}
