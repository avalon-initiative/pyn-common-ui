import type { BranchListItem } from '../types/branch.types'

/** "N ahead, M behind" from the counts that are given, zero included; empty when neither is. */
export function branchCounts(b: Pick<BranchListItem, 'ahead' | 'behind'>): string {
  const parts: string[] = []
  if (b.ahead !== undefined) parts.push(`${b.ahead} ahead`)
  if (b.behind !== undefined) parts.push(`${b.behind} behind`)
  return parts.join(', ')
}
