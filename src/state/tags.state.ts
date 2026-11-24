import type { TagItem, TagOption } from '../types/tag.types'

const COMMIT = /^[0-9a-f]{4,64}$/i
const BAD_CHARS = /[\s~^:?*[\\]/

/** Why `name` cannot be a new tag, or '' when it can; follows the server's ref rules. */
export function tagNameProblem(name: string, tags: TagOption[]): string {
  const n = name.trim()
  if (!n) return ''
  if (BAD_CHARS.test(n)) return 'Spaces and ~ ^ : ? * [ \\ are not allowed.'
  if (n.includes('..')) return 'Two dots in a row are not allowed.'
  if (n.startsWith('/') || n.endsWith('/') || n.endsWith('.')) return 'Not a valid tag name.'
  if (tags.some((t) => t.name === n)) return 'A tag with this name already exists.'
  return ''
}

/** A commit id or an abbreviation of at least 4 hex digits. */
export function isCommitId(id: string): boolean {
  return COMMIT.test(id.trim())
}

/** The first 7 characters of a commit id. */
export function shortCommit(id: string): string {
  return id.slice(0, 7)
}

/** Tags whose name or message contains `query`, case-insensitively. */
export function filterTags(tags: TagItem[], query: string): TagItem[] {
  const q = query.trim().toLowerCase()
  if (!q) return tags
  return tags.filter(
    (t) => t.name.toLowerCase().includes(q) || (t.message ?? '').toLowerCase().includes(q),
  )
}
