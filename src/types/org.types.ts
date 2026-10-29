export type OrgRole = 'member' | 'owner'

/** The identity of an organization, as far as navigation needs it. */
export interface OrgRef {
  name: string
}

export interface OrgMember {
  user: string
  role: OrgRole
}

export interface OrgInfo {
  id: string
  /** ISO 8601 timestamp. */
  created_at: string
  name: string
  /** The viewer's standing; absent when they are not a member. */
  role?: OrgRole | null
}

export interface NewOrgMember {
  user: string
  role: OrgRole
}

export type MemberCreation = 'none' | 'private' | 'both'
export type RuleEffect = 'allow' | 'deny'
export type RuleKind = 'team' | 'user' | 'role'
export type RuleScope = 'public' | 'private' | 'both'

export interface CreationRule {
  effect: RuleEffect
  kind: RuleKind
  scope: RuleScope
  /** The team slug, user name, or organization role (`owner` or `member`). */
  subject: string
}

export interface RepoPolicy {
  member_creation: MemberCreation
  rules: CreationRule[]
}

/** Identifies one rule: a subject holds at most one per effect. */
export type RuleRef = Pick<CreationRule, 'effect' | 'kind' | 'subject'>

export type OwnerKind = 'user' | 'organization'

/** Whether an owner is frozen; writes under it are refused while reads continue. */
export interface OwnerFreeze {
  owner: string
  owner_id: string
  kind: OwnerKind
  frozen: boolean
  /** ISO 8601 timestamp; null while not frozen. */
  frozen_at: string | null
  reason: string | null
}
