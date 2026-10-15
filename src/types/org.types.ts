export type OrgRole = 'member' | 'owner'

/** The identity of an organization, as far as navigation needs it. */
export interface OrgRef {
  name: string
}
