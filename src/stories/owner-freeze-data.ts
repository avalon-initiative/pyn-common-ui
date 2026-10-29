import type { OwnerFreeze } from '../types/org.types'

export const frozenWithReason: OwnerFreeze = {
  owner: 'acme',
  owner_id: '7c1f0d52-3b8e-4f0a-9a52-2d6f1e8b4c11',
  kind: 'organization',
  frozen: true,
  frozen_at: '2026-06-09T14:05:00Z',
  reason: 'Billing review in progress.',
}

export const frozenWithoutReason: OwnerFreeze = {
  ...frozenWithReason,
  owner: 'wendy',
  kind: 'user',
  reason: null,
}

export const notFrozen: OwnerFreeze = {
  ...frozenWithReason,
  frozen: false,
  frozen_at: null,
  reason: null,
}
