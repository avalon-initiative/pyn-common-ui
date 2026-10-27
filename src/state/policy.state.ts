import type { PolicyProblem } from '../types/policy.types'

export const ROOT_FOLDER = '(root)'

/** The directory a path sits in, or the root marker for a top-level file. */
export const dirOf = (path: string) =>
  path.includes('/') ? path.slice(0, path.lastIndexOf('/')) : ROOT_FOLDER

/** Every folder that contains a path, at all depths, plus the root marker for top-level files. */
export function folderOptions(paths: string[]): string[] {
  const out = new Set<string>()
  for (const p of paths) {
    const parts = p.split('/').slice(0, -1)
    if (!parts.length) out.add(ROOT_FOLDER)
    parts.forEach((_, i) => out.add(parts.slice(0, i + 1).join('/')))
  }
  return [...out].sort()
}

/** Whether a path is inside `folder` (at any depth); the root marker matches top-level files only. */
export const inFolder = (path: string, folder: string) =>
  folder === ROOT_FOLDER ? !path.includes('/') : path.startsWith(`${folder}/`)

/** Problem messages by 1-based line; several problems on a line are joined. */
export function problemsByLine(problems: PolicyProblem[]): Map<number, string> {
  const out = new Map<number, string>()
  for (const p of problems) {
    if (p.line === undefined) continue
    const prev = out.get(p.line)
    out.set(p.line, prev ? `${prev}; ${p.message}` : p.message)
  }
  return out
}

/** The 1-based line under a vertical offset in a scrolled, padded textarea. */
export const lineAtOffset = (y: number, scrollTop: number, lineHeight: number, padTop: number) =>
  lineHeight > 0 ? Math.floor((y + scrollTop - padTop) / lineHeight) + 1 : 0

/** The 1-based line holding a caret offset. */
export const lineOfCaret = (text: string, caret: number) => text.slice(0, caret).split('\n').length
