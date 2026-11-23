export interface CommandItem {
  id: string
  label: string
  /** Items with the same group share a heading; groups appear in order of first use. */
  group: string
  /** When set the option renders as a real anchor, so Enter and click navigate. */
  href?: string
  /** Muted text at the end of the row, such as a shortcut or a kind. */
  hint?: string
  /** Extra words the fuzzy match also looks at. */
  keywords?: string[]
}

export interface CommandGroup {
  group: string
  items: CommandItem[]
}

export interface Shortcut {
  /** Keys shown as separate kbd elements, in order. */
  keys: string[]
  label: string
}

export interface ShortcutGroup {
  title: string
  shortcuts: Shortcut[]
}

export interface ShortcutBinding {
  id: string
  /** A key sequence such as ['g', 'h'], ['/'] or ['?'], compared with KeyboardEvent.key. */
  keys: string[]
}

export interface ShortcutMatcher {
  /** Returns the id of the binding the event completes, or null. */
  handle(e: KeyboardEvent): string | null
  reset(): void
}
