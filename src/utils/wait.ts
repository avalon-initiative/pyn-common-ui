import { pluralize } from './plural'

/** A Retry-After in seconds as words, rounded up so the wait is never understated. */
export function formatWait(seconds: number | undefined): string {
  if (seconds === undefined || !(seconds > 0)) return 'a moment'
  if (seconds < 60) return pluralize(Math.ceil(seconds), 'second')
  if (seconds < 3600) return pluralize(Math.ceil(seconds / 60), 'minute')
  return pluralize(Math.ceil(seconds / 3600), 'hour')
}
