const UNITS = ['B', 'KB', 'MB', 'GB', 'TB', 'PB']

/** "1.5 GB" (1024-based); whole numbers below 1 KB. */
export function formatBytes(bytes: number): string {
  let value = Math.max(0, bytes)
  let i = 0
  while (value >= 1024 && i < UNITS.length - 1) {
    value /= 1024
    i++
  }
  const text = i === 0 ? String(value) : String(Math.round(value * 10) / 10)
  return `${text} ${UNITS[i]}`
}
