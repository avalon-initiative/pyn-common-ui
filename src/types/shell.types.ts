import type { NavItem } from '../state/shell.state'

export interface MenuItem {
  id: string
  label: string
  /** Internal link; without it the item is a button that emits its id. */
  href?: string
  /** Marks the current option of a choice item. */
  checked?: boolean
  separator?: boolean
  /** A non-interactive group label inside the menu. */
  heading?: boolean
}

/** A titled run of side navigation items; the heading is omitted for an untitled group. */
export interface NavGroup {
  id: string
  heading?: string
  items: NavItem[]
}
