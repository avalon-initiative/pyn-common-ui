import type { BranchSummary } from '../types/branch.types'

/** Where the server stops counting ahead and behind commits. */
export const BRANCH_COUNT_CAP = 1000

/** A count of ahead or behind commits; "1000+" when capped at `BRANCH_COUNT_CAP`. */
export const branchCount = (n: number, capped?: boolean): string =>
  capped && n >= BRANCH_COUNT_CAP ? `${BRANCH_COUNT_CAP}+` : String(n)

/** "N ahead, M behind" from the counts that are given, zero included; empty when neither is. */
export function branchCounts(b: Pick<BranchSummary, 'ahead' | 'behind' | 'countsCapped'>): string {
  const parts: string[] = []
  if (b.ahead !== undefined) parts.push(`${branchCount(b.ahead, b.countsCapped)} ahead`)
  if (b.behind !== undefined) parts.push(`${branchCount(b.behind, b.countsCapped)} behind`)
  return parts.join(', ')
}
