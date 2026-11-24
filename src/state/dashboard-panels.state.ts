import { repoSlug } from './repo.state'
import { activityVerb } from './tree.state'
import type { RepoActivityEntry } from '../types/dashboard.types'
import type { MyLock } from '../types/lock.types'

const includes = (text: string, q: string) => text.toLowerCase().includes(q)

/** Locks whose lease ends within `withinMs` of `now`, soonest first; expired ones are dropped. */
export function expiringLocks(locks: MyLock[], now: Date, withinMs: number): MyLock[] {
  const t = now.getTime()
  return locks
    .filter((l) => {
      const left = new Date(l.expires_at).getTime() - t
      return left > 0 && left <= withinMs
    })
    .sort((a, b) => a.expires_at.localeCompare(b.expires_at))
}

export const filterLocks = (locks: MyLock[], query: string): MyLock[] => {
  const q = query.trim().toLowerCase()
  return q ? locks.filter((l) => includes(l.path, q) || includes(repoSlug(l), q)) : locks
}

export const filterActivity = (
  entries: RepoActivityEntry[],
  query: string,
): RepoActivityEntry[] => {
  const q = query.trim().toLowerCase()
  return q
    ? entries.filter(
        (e) =>
          includes(e.actor, q) ||
          includes(repoSlug(e), q) ||
          includes(e.path ?? '', q) ||
          includes(activityVerb(e), q),
      )
    : entries
}
