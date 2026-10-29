import type { UsageLevel } from '../types/usage.types'

export const WARN_RATIO = 0.8

export const CAP_UNITS = [
  { label: 'B', factor: 1 },
  { label: 'KB', factor: 1024 },
  { label: 'MB', factor: 1024 ** 2 },
  { label: 'GB', factor: 1024 ** 3 },
  { label: 'TB', factor: 1024 ** 4 },
] as const

/** Share of the limit used, 0 to 100; null when unlimited. */
export function usagePercent(used: number, limit: number | null): number | null {
  if (limit === null) return null
  if (limit <= 0) return 100
  return Math.min(100, (used / limit) * 100)
}

/** Warning from 80% of the limit, danger at or over it. */
export function usageLevel(used: number, limit: number | null): UsageLevel {
  if (limit === null) return 'ok'
  if (used >= limit) return 'danger'
  return used >= limit * WARN_RATIO ? 'warning' : 'ok'
}

/** The largest unit that divides the cap exactly, so the form shows it losslessly. */
export function splitCap(bytes: number | null): { value: string; unit: string } {
  if (bytes === null) return { value: '', unit: 'GB' }
  const unit = [...CAP_UNITS].reverse().find((u) => bytes % u.factor === 0 && bytes >= u.factor)
  const u = unit ?? CAP_UNITS[0]
  return { value: String(bytes / u.factor), unit: u.label }
}

/** Bytes for a value and unit, or null when not a whole, non-negative, safe number. */
export function capToBytes(value: string | number, unit: string): number | null {
  const factor = CAP_UNITS.find((u) => u.label === unit)?.factor
  if (!factor || String(value).trim() === '') return null
  const bytes = Math.round(Number(value) * factor)
  return Number.isSafeInteger(bytes) && bytes >= 0 ? bytes : null
}
