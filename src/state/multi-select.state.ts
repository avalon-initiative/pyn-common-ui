import type { MultiSelectOption } from '../types/multi-select.types'

export function filterOptions(options: MultiSelectOption[], query: string): MultiSelectOption[] {
  const q = query.trim().toLowerCase()
  if (!q) return options
  return options.filter(
    (o) => o.label.toLowerCase().includes(q) || (o.description ?? '').toLowerCase().includes(q),
  )
}

export function toggleValue(chosen: string[], value: string): string[] {
  return chosen.includes(value) ? chosen.filter((v) => v !== value) : [...chosen, value]
}

export function labelOf(options: MultiSelectOption[], value: string): string {
  return options.find((o) => o.value === value)?.label ?? value
}
