import { EXPIRING_SOON_MS } from '../utils/lease'
import type { LockListItem, LockRowState, LockView, MyLock } from '../types/lock.types'

/** The state a row is shown in; an expired lease is stale. */
export function lockRowState(l: LockListItem, me: string | undefined, now: Date): LockRowState {
  const left = new Date(l.expires_at).getTime() - now.getTime()
  if (left <= 0) return 'stale'
  if (l.owner === me) return 'mine'
  return left < EXPIRING_SOON_MS ? 'expiring' : 'locked'
}

export const lockRowKey = (l: LockListItem) => `${l.repo ?? ''}:${l.path}`

/** Views that can be computed: Mine needs to know who the viewer is. */
export const lockViews = (me?: string): LockView[] =>
  me ? ['all', 'mine', 'expiring', 'stale'] : ['all', 'expiring', 'stale']

/** Locks of a view, narrowed by a path, holder or repository search. */
export function filterLockRows(
  locks: LockListItem[],
  view: LockView,
  query: string,
  me: string | undefined,
  now: Date,
): LockListItem[] {
  const q = query.trim().toLowerCase()
  const inView = (l: LockListItem) => {
    if (view === 'mine') return l.owner === me
    if (view === 'all') return true
    const left = new Date(l.expires_at).getTime() - now.getTime()
    return view === 'stale' ? left <= 0 : left > 0 && left < EXPIRING_SOON_MS
  }
  return locks.filter(
    (l) => inView(l) && [l.path, l.owner, l.repo ?? ''].some((v) => v.toLowerCase().includes(q)),
  )
}

/** A lock the signed-in user holds, as a row of the locks page. */
export const lockRowFromMine = (l: MyLock, holder: string): LockListItem => ({
  path: l.path,
  owner: holder,
  repo: `${l.owner}/${l.name}`,
  repoHref: `/${l.owner}/${l.name}`,
  acquired_at: l.acquired_at,
  expires_at: l.expires_at,
})
