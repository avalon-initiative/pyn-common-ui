import type { Notice, Passkey, TotpEnrolment, TwoFactorStatus } from '../types/two-factor.types'

export const enrolment: TotpEnrolment = {
  id: 'f1',
  secret: 'JBSWY3DPEHPK3PXPJBSWY3DPEHPK3PXP',
  uri: 'otpauth://totp/Pyn:alice?secret=JBSWY3DPEHPK3PXPJBSWY3DPEHPK3PXP&issuer=Pyn',
}

export const recoveryCodes = [
  'k3m9-x2pq',
  'a7vd-4nre',
  'p0ws-h8cz',
  'u5ty-j1lb',
  'm6fg-q9ox',
  'e2ri-b7ka',
  'z4cn-w3sd',
  'h8ul-y5tv',
  'd1jq-o6mp',
  'n9xe-r0ga',
]

export const passkeys: Passkey[] = [
  {
    id: 'pk1',
    name: 'Laptop',
    created_at: '2026-10-08T09:00:00Z',
    last_used_at: '2026-10-09T14:30:00Z',
    transports: ['internal'],
    sign_count: 12,
    backup_eligible: true,
    backup_state: true,
  },
  {
    id: 'pk2',
    name: 'Security key',
    created_at: '2026-10-01T09:00:00Z',
    last_used_at: null,
    transports: ['usb', 'nfc'],
    sign_count: 0,
    backup_eligible: false,
    backup_state: false,
  },
]

export const status: TwoFactorStatus = {
  enabled: true,
  factors: [{ id: 'f1', kind: 'totp', label: 'Phone', created_at: '2026-10-08T09:00:00Z' }],
  passkeys,
  passkeys_available: true,
  recovery_codes_left: 8,
  required: null,
}

export const emptyStatus: TwoFactorStatus = {
  enabled: false,
  factors: [],
  passkeys: [],
  passkeys_available: true,
  recovery_codes_left: 0,
  required: null,
}

export const notices: Notice[] = [
  {
    id: 'n1',
    kind: 'two_factor_reset',
    detail: 'An administrator reset your second factors.',
    created_at: '2026-10-09T10:00:00Z',
  },
  {
    id: 'n2',
    kind: 'something_new',
    detail: 'The studio moved to a new address.',
    created_at: '2026-10-10T10:00:00Z',
  },
]
