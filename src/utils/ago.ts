import { formatDate } from './datetime'

const UNITS: [string, number][] = [
  ['day', 86_400_000],
  ['hour', 3_600_000],
  ['minute', 60_000],
]

/** "2 hours ago", "just now"; absolute date beyond a month. */
export function formatAgo(iso: string, now: Date): string {
  const ms = now.getTime() - new Date(iso).getTime()
  if (ms < 60_000) return 'just now'
  if (ms >= 30 * 86_400_000) return formatDate(iso)
  for (const [unit, size] of UNITS) {
    if (ms >= size) {
      const n = Math.floor(ms / size)
      return `${n} ${unit}${n === 1 ? '' : 's'} ago`
    }
  }
  return 'just now'
}
