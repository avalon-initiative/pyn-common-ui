import type { AccountInfo } from '../types/admin.types'

export const accounts: AccountInfo[] = [
  {
    id: 'user-root',
    user: 'root',
    email: 'root@example.com',
    email_verified: true,
    status: 'active',
    admin: true,
    created_at: '2026-09-01T08:00:00Z',
  },
  {
    id: 'user-bob',
    user: 'bob',
    email: 'bob@example.com',
    email_verified: true,
    status: 'pending_approval',
    admin: false,
    created_at: '2026-10-07T09:30:00Z',
  },
  {
    id: 'user-carol',
    user: 'carol',
    email: 'carol@example.com',
    email_verified: false,
    status: 'pending_verification',
    admin: false,
    created_at: '2026-10-08T10:15:00Z',
  },
  {
    id: 'user-dave',
    user: 'dave',
    email: null,
    email_verified: false,
    status: 'disabled',
    disabled_at: '2026-10-05T14:00:00Z',
    disabled_reason: 'Left the studio',
    admin: false,
    created_at: '2026-09-20T12:00:00Z',
  },
]
