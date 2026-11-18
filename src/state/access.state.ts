import type { AccessMode } from '../types/access.types'

export const ACCESS_LABELS: Record<AccessMode, string> = { private: 'Private', public: 'Public' }

export const ACCESS_EFFECTS: Record<AccessMode, string[]> = {
  private: [
    'Nothing is visible to someone who is signed out, apart from the sign-in and sign-up pages.',
  ],
  public: [
    'Public repositories, profiles and the people directory become visible to someone who is signed out.',
    'Requests that are signed out are rate limited.',
  ],
}

export const otherMode = (mode: AccessMode): AccessMode =>
  mode === 'public' ? 'private' : 'public'
