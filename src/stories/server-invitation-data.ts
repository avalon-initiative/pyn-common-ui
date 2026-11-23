import type {
  InvitationGrantRole,
  InvitationGrantTarget,
  ServerInvitation,
} from '../types/server-invitation.types'

export const invitations: ServerInvitation[] = [
  {
    id: 'pynv_a1',
    email: 'dana@example.com',
    grant: { repository: 'alice/site', role: 'writer' },
    created_by: 'root',
    created_at: '2026-11-20T09:00:00Z',
    expires_at: '2026-11-27T09:00:00Z',
    status: 'pending',
  },
  {
    id: 'pynv_b2',
    email: null,
    grant: null,
    created_by: 'root',
    created_at: '2026-11-10T09:00:00Z',
    expires_at: '2026-11-17T09:00:00Z',
    status: 'used',
    used_at: '2026-11-12T10:00:00Z',
    used_by: 'erin',
  },
  {
    id: 'pynv_c3',
    email: 'frank@example.com',
    grant: { organization: 'acme', role: 'member' },
    created_by: 'root',
    created_at: '2026-11-05T09:00:00Z',
    expires_at: '2026-11-12T09:00:00Z',
    status: 'revoked',
    revoked_at: '2026-11-06T09:00:00Z',
  },
  {
    id: 'pynv_d4',
    email: null,
    grant: null,
    created_by: 'root',
    created_at: '2026-10-01T09:00:00Z',
    expires_at: '2026-10-08T09:00:00Z',
    status: 'expired',
  },
]

export const targets: InvitationGrantTarget[] = [
  { kind: 'repository', name: 'alice/site' },
  { kind: 'repository', name: 'alice/tools' },
  { kind: 'organization', name: 'acme' },
]

export const roles: InvitationGrantRole[] = [
  { kind: 'repository', value: 'reader' },
  { kind: 'repository', value: 'writer' },
  { kind: 'repository', value: 'maintainer' },
  { kind: 'repository', value: 'admin' },
  { kind: 'organization', value: 'member' },
  { kind: 'organization', value: 'owner' },
]
