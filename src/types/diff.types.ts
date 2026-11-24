import type { LockInfo, Mode } from './lock.types'

// Provisional: the server has no text-diff or pull request endpoints yet (pyn#696); these follow
// the reference layout and may change when the contract lands.

export type DiffLineKind = 'context' | 'add' | 'delete'

export interface DiffLine {
  kind: DiffLineKind
  /** Line number in the old file; absent on an added line. */
  oldNo?: number | null
  /** Line number in the new file; absent on a deleted line. */
  newNo?: number | null
  text: string
  /** Changed character ranges `[start, end)` inside `text`; computed from the paired line when absent. */
  marks?: [number, number][]
}

export interface DiffHunk {
  /** The `@@ -a,b +c,d @@ section` line. */
  header: string
  lines: DiffLine[]
  /** Unchanged lines hidden above the hunk that can still be loaded. */
  hiddenBefore?: number
  /** Unchanged lines hidden below the last hunk of the file. */
  hiddenAfter?: number
}

export type DiffFileStatus = 'added' | 'modified' | 'deleted' | 'renamed'

export interface DiffFile {
  path: string
  /** The previous path of a renamed file. */
  oldPath?: string | null
  status: DiffFileStatus
  additions: number
  deletions: number
  binary?: boolean
  /** Hunks omitted because the diff is too large to show inline. */
  tooLarge?: boolean
  /** The path's collaboration mode; exclusive paths show their lock state. */
  mode?: Mode
  /** The live lock on the path; one held by someone else blocks a merge. */
  lock?: LockInfo | null
  hunks: DiffHunk[]
}

export type DiffLayout = 'unified' | 'split'

export type ExpandDirection = 'up' | 'down' | 'all'

export interface DiffExpand {
  path: string
  hunk: number
  direction: ExpandDirection
  /** The gap before `hunk` (its header's controls) or after it (the control after the last hunk). */
  position: 'before' | 'after'
}

/** A side-by-side row; a side is null where the other side has the only line. */
export interface SplitRow {
  left: DiffLine | null
  right: DiffLine | null
}

export interface TextSegment {
  text: string
  marked: boolean
}
