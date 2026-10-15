export interface TokenInfo {
  id: string;
  user: string;
  name: string;
  repos: string[];
  permissions: string[];
  created_at: string;
  expires_at?: string | null;
  last_used_at?: string | null;
  revoked_at?: string | null;
}

export interface CreatedToken {
  info: TokenInfo;
  token: string;
}

export interface TokenForm {
  name: string;
  repos: string[];
  permissions: string[];
  expires_at: string | null;
}
