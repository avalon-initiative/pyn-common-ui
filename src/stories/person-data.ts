import type { PublicIdentity } from '../types/profile.types'

const dot =
  'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 8 8"><rect width="8" height="8" fill="%234a7"/></svg>'

export const aliceIdentity: PublicIdentity = {
  user: 'alice',
  display_name: 'Alice Anders',
  avatar_url: dot,
}
export const aliciaIdentity: PublicIdentity = {
  user: 'alicia',
  display_name: 'Alicia Anders',
  avatar_url: dot,
}
export const bobIdentity: PublicIdentity = { user: 'bob', display_name: 'Bob Brandt' }
export const carolIdentity: PublicIdentity = { user: 'carol', display_name: null, avatar_url: null }
