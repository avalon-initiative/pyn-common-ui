import type { Passkey, TotpEnrolment } from '../types/two-factor.types'

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
