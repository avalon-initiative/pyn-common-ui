import type { BranchOption } from '../types/branch.types'

/** The branch the picker shows: the one in view, else the default (or first) branch. */
export function pickerBranch(branch: string | undefined, branches: BranchOption[]): string {
  if (branch) return branch
  return (branches.find((b) => b.isDefault) ?? branches[0])?.name ?? ''
}
