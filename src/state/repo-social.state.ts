import type { ForkLink, SocialButton } from '../types/repo-social.types'
import type { MenuItem } from '../types/shell.types'

export const FORK_CREATE = 'create'

/** Items of the Fork caret menu: existing forks, "Create a new fork", then the button's own items. */
export function forkMenu(
  fork: SocialButton,
  forks: ForkLink[],
  empty = 'This repository has no forks yet.',
): MenuItem[] {
  const list: MenuItem[] = forks.length
    ? forks.map((f) => ({
        id: `fork:${f.owner}/${f.name}`,
        label: `${f.owner}/${f.name}`,
        href: f.href ?? `/${encodeURIComponent(f.owner)}/${encodeURIComponent(f.name)}`,
        icon: 'fork',
      }))
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
