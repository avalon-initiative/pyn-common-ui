import { repoPath } from './repo.state'
import type { Revision } from '../types/repo.types'
import type { ActivityEntry, Crumb, TreeEntry } from '../types/tree.types'

type Repo = { owner: string; name: string }

export const encodeSegments = (path: string) => path.split('/').map(encodeURIComponent).join('/')

/** The app route of a folder; the root is the repository's Code tab. */
export function treePath(r: Repo, path: string, branch?: string): string {
  const clean = path.replace(/^\/+|\/+$/g, '')
  return clean ? repoPath(r, `tree/${encodeSegments(clean)}`, branch) : repoPath(r, '', branch)
}

/** The repository name, then one crumb per folder; the last is the current location. */
export function breadcrumbs(r: Repo, path: string, branch?: string): Crumb[] {
  const parts = path.split('/').filter(Boolean)
  const crumbs: Crumb[] = [
    { label: r.name, href: parts.length ? treePath(r, '', branch) : undefined },
  ]
  parts.forEach((label, i) => {
    const last = i === parts.length - 1
    crumbs.push({
      label,
      href: last ? undefined : treePath(r, parts.slice(0, i + 1).join('/'), branch),
    })
  })
  return crumbs
}

/** The folder a route's `path` param names, always without slashes at the ends. */
export function folderParam(param: string | string[] | undefined): string {
  const raw = Array.isArray(param) ? param.join('/') : (param ?? '')
  return raw.replace(/^\/+|\/+$/g, '')
}

const VERBS: Record<string, string> = {
  checkout: 'locked',
  release: 'released',
  checkin: 'checked in',
  restore: 'restored',
  force_unlock: 'force-unlocked',
}

export const activityVerb = (e: ActivityEntry) => VERBS[e.action] ?? e.action

/** Folders before files, each group keeping the server's order. */
export const foldersFirst = (entries: TreeEntry[]): TreeEntry[] => [
  ...entries.filter((e) => e.kind === 'folder'),
  ...entries.filter((e) => e.kind !== 'folder'),
]

/** The newest last change among the entries. */
export function latestChange(entries: TreeEntry[]): Revision | null {
  let best: Revision | null = null
  for (const e of entries) {
    const c = e.last_change
    if (c && (!best || c.created_at > best.created_at)) best = c
  }
  return best
}

export interface TreeRow {
  entry: TreeEntry
  depth: number
}

const parentPath = (path: string) => path.split('/').slice(0, -1).join('/')

/** Folders along a path from the root, e.g. "a/b/c.ts" gives ["a", "a/b"]. */
export function ancestorFolders(path: string): string[] {
  const parts = path.split('/').filter(Boolean).slice(0, -1)
  return parts.map((_, i) => parts.slice(0, i + 1).join('/'))
}

/** Flat entries (every loaded path) as depth-first rows, descending only into expanded folders. */
export function treeRows(entries: TreeEntry[], expanded: string[]): TreeRow[] {
  const open = new Set(expanded)
  const children = new Map<string, TreeEntry[]>()
  for (const e of entries) {
    const parent = parentPath(e.path)
    children.set(parent, [...(children.get(parent) ?? []), e])
  }
  const rows: TreeRow[] = []
  const walk = (parent: string, depth: number) => {
    for (const entry of foldersFirst(children.get(parent) ?? [])) {
      rows.push({ entry, depth })
      if (entry.kind === 'folder' && open.has(entry.path)) walk(entry.path, depth + 1)
    }
  }
  walk('', 0)
  return rows
}

/** Files whose path contains the query, case-insensitively, in the given order. */
export function matchFiles(entries: TreeEntry[], query: string, limit = 50): TreeEntry[] {
  const q = query.trim().toLowerCase()
  if (!q) return []
  return entries
    .filter((e) => e.kind === 'file' && e.path.toLowerCase().includes(q))
    .slice(0, limit)
}
