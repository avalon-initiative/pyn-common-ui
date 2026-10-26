export type PolicyNoticeKind =
  'lock_required' | 'lock_held' | 'stale_base' | 'invalid_rules' | 'error'

/** One problem found in the policy text; `line` is 1-based and absent when not tied to a line. */
export interface PolicyProblem {
  line?: number
  message: string
}
