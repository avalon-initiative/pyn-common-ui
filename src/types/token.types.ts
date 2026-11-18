export type TokenLevel = 'read' | 'write' | 'admin'
export type TokenOwnerKind = 'account' | 'org'
export type TokenAccessMode = 'public' | 'all' | 'selected'
export type TokenScope = 'repository' | 'org' | 'account'

export interface TokenPermission {
  resource: string
  level: TokenLevel
}

export interface RepositoryAccess {
  mode: TokenAccessMode
  repos?: string[]
}

export interface TokenInfo {
  id: string
  user: string
  name: string
  description?: string | null
  owner: string
  repository_access: RepositoryAccess
  permissions: TokenPermission[]
  sign_in: boolean
  created_at: string
  expires_at?: string | null
  last_used_at?: string | null
  revoked_at?: string | null
}

export interface CreatedToken {
  info: TokenInfo
  token: string
}

/** Body of `POST /v1/tokens`: without `expires_at` and `never` the token lasts 30 days. */
export interface TokenForm {
  name: string
  description?: string
  owner: string
  expires_at?: string
  never?: boolean
  repository_access: RepositoryAccess
  permissions: TokenPermission[]
}

export interface TokenOwnerOption {
  name: string
  kind: TokenOwnerKind
}

export interface TokenResource {
  resource: string
  label: string
  description: string
  scope: TokenScope
  levels: TokenLevel[]
}

export interface TokenExpiryChoice {
  value: string
  label: string
  days?: number
}
