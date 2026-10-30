import type {
  CreationRule,
  MemberCreation,
  OrgInfo,
  OrgMember,
  OrgRole,
  RuleEffect,
  RuleKind,
  RuleRef,
  RuleScope,
} from '../types/org.types'

export const ORG_ROLES: OrgRole[] = ['member', 'owner']

/** The app route of an organization page; `section` is empty for the profile. */
export function orgPath(name: string, section = ''): string {
  const base = `/${encodeURIComponent(name)}`
  return section ? `${base}/-/${section}` : base
}

export const sortOrgs = (orgs: OrgInfo[]): OrgInfo[] =>
  [...orgs].sort((a, b) => a.name.localeCompare(b.name))

export const isOrgOwner = (org: { role?: OrgRole | null } | null) => org?.role === 'owner'

export interface OrgTab {
  section: string
  label: string
}

/** Tabs the viewer may use; the server enforces the same rules. */
export function orgTabs(role: OrgRole | null | undefined): OrgTab[] {
  const tabs: OrgTab[] = [{ section: '', label: 'Repositories' }]
  if (role)
    tabs.push({ section: 'members', label: 'Members' }, { section: 'teams', label: 'Teams' })
  if (role === 'owner')
    tabs.push(
      { section: 'usage', label: 'Usage' },
      { section: 'audit', label: 'Audit' },
      { section: 'settings', label: 'Settings' },
    )
  return tabs
}

/** Profile tabs; Usage is for the signed-in user on their own profile. */
export function userTabs(self: boolean): OrgTab[] {
  const tabs: OrgTab[] = [{ section: '', label: 'Repositories' }]
  if (self) tabs.push({ section: 'usage', label: 'Usage' })
  return tabs
}

/** Who may own a new repository: the user, then every organization they belong to. */
export function ownerChoices(user: string, orgs: OrgInfo[]): string[] {
  return [user, ...sortOrgs(orgs.filter((o) => o.role)).map((o) => o.name)]
}

/** Owners remove anyone; anyone may remove themselves (leave). */
export function canRemove(m: OrgMember, self: string, viewerIsOwner: boolean): boolean {
  return viewerIsOwner || m.user === self
}

export const MEMBER_CREATION: { value: MemberCreation; label: string }[] = [
  { value: 'none', label: 'Nobody but owners' },
  { value: 'private', label: 'Members: private repositories' },
  { value: 'both', label: 'Members: public and private repositories' },
]

export const RULE_EFFECTS: RuleEffect[] = ['allow', 'deny']
export const RULE_KINDS: RuleKind[] = ['team', 'user', 'role']
export const RULE_SCOPES: RuleScope[] = ['both', 'private', 'public']

export const ruleKey = (r: RuleRef) => `${r.effect}/${r.kind}/${r.subject}`

/** Subjects a new rule may name; owners cannot be denied. */
export function ruleSubjects(
  kind: RuleKind,
  effect: RuleEffect,
  teams: string[],
  members: string[],
): string[] {
  if (kind === 'team') return teams
  if (kind === 'user') return members
  return effect === 'deny' ? ['member'] : ['member', 'owner']
}

/** Whether the rule already exists, so adding it would replace its scope. */
export const hasRule = (rules: CreationRule[], r: RuleRef) =>
  rules.some((x) => ruleKey(x) === ruleKey(r))

/** Organization log actions; `org_member_added` is a direct add, an invitation is `org_member_invited`. */
export const ORG_INVITATION_AUDIT_LABELS: Record<string, string> = {
  org_member_added: 'Member added directly',
  org_member_invited: 'Member invited',
  org_invitation_accepted: 'Invitation accepted',
  org_invitation_declined: 'Invitation declined',
  org_invitation_cancelled: 'Invitation cancelled',
  org_invitation_expired: 'Invitation expired',
}

export const orgAuditLabel = (action: string): string =>
  ORG_INVITATION_AUDIT_LABELS[action] ?? action
