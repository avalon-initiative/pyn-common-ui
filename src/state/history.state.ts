import { formatDate } from '../utils/datetime'
import type { Revision } from '../types/repo.types'

export const FILTER_DEBOUNCE_MS = 300

/** Route query for the history tab; path and filter are mutually exclusive. */
export function historyQuery(path: string, filter: string): Record<string, string> {
  if (path) return { path }
  return filter ? { filter } : {}
}

export interface RevisionDay {
  /** "Oct 08 2026" in the browser's timezone. */
  day: string
  revisions: Revision[]
}

/** Consecutive revisions on the same calendar day, in the given order. */
export function groupByDay(revisions: Revision[]): RevisionDay[] {
  const days: RevisionDay[] = []
  for (const rev of revisions) {
    const day = formatDate(rev.created_at)
    const last = days[days.length - 1]
    if (last?.day === day) last.revisions.push(rev)
    else days.push({ day, revisions: [rev] })
  }
  return days
}

export type HistoryRange = 'all' | 'day' | 'week' | 'month' | 'year'

export const HISTORY_RANGES: { value: HistoryRange; label: string }[] = [
  { value: 'all', label: 'All time' },
  { value: 'day', label: 'Last day' },
  { value: 'week', label: 'Last week' },
  { value: 'month', label: 'Last month' },
  { value: 'year', label: 'Last year' },
]
