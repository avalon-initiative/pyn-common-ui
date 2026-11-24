import type {
  CreationRule,
  MemberCreation,
  OrgInfo,
  OrgMember,
  OrgRole,
  ReadOnlyChoice,
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
  /** Heading shared by consecutive items in a grouped settings navigation. */
  group?: string
  /** PynIcon name shown beside the label in a grouped settings navigation. */
  icon?: string
}

/** Tabs the viewer may use; the server enforces the same rules. */
export function orgTabs(role: OrgRole | null | undefined): OrgTab[] {
  const tabs: OrgTab[] = [
    { section: '', label: 'Overview' },
    { section: 'repositories', label: 'Repositories' },
  ]
  if (role) tabs.push({ section: 'teams', label: 'Teams' }, { section: 'members', label: 'People' })
  if (role === 'owner')
    tabs.push(
      { section: 'usage', label: 'Usage' },
      { section: 'audit', label: 'Audit' },
      { section: 'settings', label: 'Settings' },
    )
  return tabs
}

/** Organization settings sub-pages the viewer may open; `settings` is General. Owners only. */
export function orgSettingsNav(role: OrgRole | null | undefined): OrgTab[] {
  if (role !== 'owner') return []
  return [
    { section: 'settings', label: 'General', icon: 'settings' },
    { section: 'members', label: 'Members', group: 'Access', icon: 'user' },
    { section: 'teams', label: 'Teams', group: 'Access', icon: 'users' },
    { section: 'policy', label: 'Repository policy', group: 'Access', icon: 'shield' },
    { section: 'usage', label: 'Usage', group: 'Storage and audit', icon: 'database' },
    { section: 'audit', label: 'Audit log', group: 'Storage and audit', icon: 'list' },
  ]
}

/** The route of an organization settings sub-page; General is `-/settings`. */
export function orgSettingsPath(name: string, section: string): string {
  return orgPath(name, section === 'settings' ? 'settings' : `settings/${section}`)
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

export const READ_ONLY_CHOICES: { value: ReadOnlyChoice; label: string }[] = [
  { value: 'default', label: 'Not set (on)' },
  { value: 'on', label: 'On' },
  { value: 'off', label: 'Off' },
]

export const readOnlyChoice = (v?: boolean | null): ReadOnlyChoice =>
  v == null ? 'default' : v ? 'on' : 'off'

export const readOnlyValue = (c: ReadOnlyChoice): boolean | null =>
  c === 'default' ? null : c === 'on'
