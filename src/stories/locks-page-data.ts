import type { LockListItem } from '../types/lock.types'
import { bobIdentity } from './person-data'

export const locksPageNow = new Date('2026-11-22T12:00:00Z')

export const locksPageLocks: LockListItem[] = [
  {
    path: 'Content/Maps/Main.umap',
    owner: 'alice',
    acquired_at: '2026-11-22T09:00:00Z',
    expires_at: '2026-11-22T15:42:00Z',
  },
  {
    path: 'Content/Art/Hero.psd',
    owner: 'bob',
    identity: bobIdentity,
    acquired_at: '2026-11-22T10:00:00Z',
    expires_at: '2026-11-22T12:12:00Z',
  },
  {
    path: 'Content/Audio/Theme.wav',
    owner: 'carol',
    acquired_at: '2026-11-22T08:00:00Z',
    expires_at: '2026-11-22T20:00:00Z',
  },
  {
    path: 'Content/Art/Old/Concept.psd',
    owner: 'bob',
    identity: bobIdentity,
    acquired_at: '2026-11-20T08:00:00Z',
    expires_at: '2026-11-21T08:00:00Z',
  },
]
