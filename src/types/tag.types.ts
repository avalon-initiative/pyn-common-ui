/** What a picker selection names. */
export type RefKind = 'branch' | 'tag'

/** A tag in the branch picker. */
export interface TagOption {
  name: string
  createdAt?: string | null
}

/** A row of the tags page; mirrors the server's `Tag` plus optional links. */
export interface TagItem extends TagOption {
  commit: string
  message?: string | null
  createdAt: string
  createdBy: string
  committedAt?: string | null
  href?: string
  commitHref?: string
  /** Display name and avatar of `createdBy`, when known. */
  creator?: { name?: string | null; avatarUrl?: string | null }
}

/** The New tag dialog's result; `target` is a branch name or a commit id. */
export interface NewTag {
  name: string
  target: string
  message?: string
}
