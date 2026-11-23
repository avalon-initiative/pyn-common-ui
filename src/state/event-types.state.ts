import type { MultiSelectOption } from '../types/multi-select.types'

/** Stored types the server no longer lists. */
export function unknownEventTypes(stored: string[], options: MultiSelectOption[]): string[] {
  const known = new Set(options.map((o) => o.value))
  return stored.filter((t) => !known.has(t))
}

/** The options with each unknown stored type added, labelled so it reads as unknown. */
export function withUnknownTypes(
  options: MultiSelectOption[],
  unknown: string[],
): MultiSelectOption[] {
  return [...unknown.map((t) => ({ value: t, label: `${t} (unknown)` })), ...options]
}
