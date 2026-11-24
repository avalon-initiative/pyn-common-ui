import { lock } from './landing-data'
import type { DiffFile, DiffHunk, DiffLine } from '../types/diff.types'

/** Compact hunk: ' ctx', '-del' and '+add' lines numbered from the given starts. */
export function hunk(
  header: string,
  oldStart: number,
  newStart: number,
  rows: string[],
  extra: Partial<DiffHunk> = {},
): DiffHunk {
  let o = oldStart
  let n = newStart
  const lines: DiffLine[] = rows.map((r) => {
    const text = r.slice(1)
    if (r[0] === '-') return { kind: 'delete', oldNo: o++, text }
    if (r[0] === '+') return { kind: 'add', newNo: n++, text }
    return { kind: 'context', oldNo: o++, newNo: n++, text }
  })
  return { header, lines, ...extra }
}

const count = (f: DiffFile, kind: DiffLine['kind']) =>
  f.hunks.reduce((s, h) => s + h.lines.filter((l) => l.kind === kind).length, 0)

const file = (f: Omit<DiffFile, 'additions' | 'deletions'>): DiffFile => {
  const d = { ...f, additions: 0, deletions: 0 }
  return { ...d, additions: count(d, 'add'), deletions: count(d, 'delete') }
}

export const lockfile = file({
  path: 'Cargo.lock',
  status: 'modified',
  hunks: [
    hunk(
      '@@ -19,15 +19,15 @@ dependencies = [',
      19,
      19,
      [
        ' ',
        ' [[package]]',
        ' name = "alloc-no-stdlib"',
        '-version = "2.0.4"',
        '+version = "3.0.0"',
        ' source = "registry+https://github.com/rust-lang/crates.io-index"',
        '-checksum = "cc7bb162ec39d46ab1ca8c7bf72e890535becd1751bb45f64c597edb4c8c6b3"',
        '+checksum = "c2fb6cfd47bf496ff64095c20eaba0c201404ee38714d4142fcfa1dc334fcc7a"',
        ' ',
        ' [[package]]',
      ],
      { hiddenBefore: 18 },
    ),
    hunk(
      '@@ -231,7 +231,7 @@ checksum = "82f6aeea286b8eb4dd3431a1be1b59d290ace00f5bfd8e2a159bc2a05e2c1667"',
      231,
      231,
      [
        ' dependencies = [',
        '  "proc-macro2",',
        '  "quote",',
        '- "syn 3.0.4",',
        '+ "syn 3.0.10",',
        ' ]',
        ' ',
        ' [[package]]',
      ],
      { hiddenBefore: 197, hiddenAfter: 64 },
    ),
  ],
})

export const sourceFile = file({
  path: 'Source/Player/useCount.ts',
  status: 'modified',
  hunks: [
    hunk(
      '@@ -1,8 +1,10 @@ export function useCount',
      1,
      1,
      [
        " import { ref } from 'vue'",
        ' ',
        '-export function useCount(start = 0) {',
        '+export function useCount(start = 0, step = 1) {',
        '   const count = ref(start)',
        '-  const inc = () => count.value++',
        '+  const inc = () => (count.value += step)',
        '+  const reset = () => (count.value = start)',
        '+  ',
        '   return { count, inc }',
        ' }',
      ],
      { hiddenAfter: 12 },
    ),
  ],
})

export const addedFile = file({
  path: 'docs/levels.md',
  status: 'added',
  hunks: [hunk('@@ -0,0 +1,3 @@', 0, 1, ['+# Levels', '+', '+Level01 is the tutorial.'])],
})

export const deletedFile = file({
  path: 'Source/Old/legacy.ts',
  status: 'deleted',
  hunks: [hunk('@@ -1,2 +0,0 @@', 1, 0, ['-export const legacy = true', '-'])],
})

export const renamedFile = file({
  path: 'Source/Player/counter.ts',
  oldPath: 'Source/Player/count.ts',
  status: 'renamed',
  hunks: [],
})

export const binaryFile = file({
  path: 'Content/Levels/Level01.umap',
  status: 'modified',
  binary: true,
  mode: 'exclusive',
  hunks: [],
})

export const lockedBinary = (owner = 'sam'): DiffFile => ({
  ...binaryFile,
  lock: lock('Content/Levels/Level01.umap', owner, 90),
})

export const diffFiles: DiffFile[] = [
  lockfile,
  sourceFile,
  addedFile,
  deletedFile,
  renamedFile,
  lockedBinary(),
]
