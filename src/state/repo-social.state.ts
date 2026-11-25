import { repoIconSrc } from './repo.state'
import type {
  ForkLink,
  SocialButton,
  WatchedRepoItem,
  WatchLevel,
} from '../types/repo-social.types'
import type { MenuItem } from '../types/shell.types'

export const FORK_CREATE = 'create'
export const UNWATCH = 'unwatch'

export const WATCH_LEVELS: { id: WatchLevel; label: string; state: string }[] = [
  { id: 'all', label: 'All activity', state: 'Watching' },
  { id: 'locks', label: 'Locks only', state: 'Locks only' },
  { id: 'ignore', label: 'Ignore', state: 'Ignoring' },
]

export const isWatchLevel = (id: string): id is WatchLevel => WATCH_LEVELS.some((l) => l.id === id)

/** Watch caret items: the levels with the current one checked, then "Stop watching" while one is set. */
export function watchMenu(level: WatchLevel | null | undefined): MenuItem[] {
  const levels: MenuItem[] = WATCH_LEVELS.map((l) => ({
    id: l.id,
    label: l.label,
    checked: l.id === level,
  }))
  return level
    ? [
        ...levels,
        { id: 'watch-sep', label: '', separator: true },
        { id: UNWATCH, label: 'Stop watching' },
      ]
    : levels
}

/** The Watch button of a watched-list row: labelled with the level, active unless ignoring. */
export const watchedButton = (w: WatchedRepoItem): SocialButton => ({
  active: w.level !== 'ignore',
  text: WATCH_LEVELS.find((l) => l.id === w.level)?.state,
  disabled: w.busy,
  menu: watchMenu(w.level),
})

/** Items of the Fork caret menu: existing forks, "Create a new fork", then the button's own items. */
export function forkMenu(
  fork: SocialButton,
  forks: ForkLink[],
  empty = 'This repository has no forks yet.',
): MenuItem[] {
  const list: MenuItem[] = forks.length
    ? forks.map((f) => {
        const src = repoIconSrc(f.iconUrl, f.ownerAvatarUrl)
        return {
          id: `fork:${f.owner}/${f.name}`,
          label: `${f.owner}/${f.name}`,
          href: f.href ?? `/${encodeURIComponent(f.owner)}/${encodeURIComponent(f.name)}`,
          ...(src !== undefined ? { avatar: { name: f.owner, src } } : { icon: 'fork' }),
        }
      })
    : [{ id: 'forks-empty', label: empty, note: true }]
  const create: MenuItem[] = fork.disabled
    ? []
    : [
        { id: 'forks-sep', label: '', separator: true },
        { id: FORK_CREATE, label: 'Create a new fork', icon: 'plus' },
      ]
  const own: MenuItem[] = fork.menu?.length
    ? [{ id: 'fork-menu-sep', label: '', separator: true }, ...fork.menu]
    : []
  return [
    { id: 'forks-heading', label: 'Existing forks', heading: true },
    ...list,
    ...create,
    ...own,
  ]
}
