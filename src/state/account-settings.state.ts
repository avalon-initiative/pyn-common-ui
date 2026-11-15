import type { ProfileValues } from '../types/account.types'

export const PROFILE_LIMITS = { name: 64, bio: 160, location: 64, company: 64, links: 5 }
export const AVATAR_TYPES = ['image/png', 'image/jpeg', 'image/webp']
export const AVATAR_MAX_BYTES = 1024 * 1024

/** The profile as the server expects it: trimmed, blanks dropped, links one per line. */
export function cleanProfile(f: {
  display_name: string
  bio: string
  location: string
  company: string
  links: string
}): ProfileValues {
  const clean = (s: string) => s.trim()
  return {
    display_name: clean(f.display_name),
    bio: clean(f.bio),
    location: clean(f.location),
    company: clean(f.company),
    links: f.links
      .split('\n')
      .map(clean)
      .filter((l) => l !== ''),
  }
}

function isWebUrl(s: string): boolean {
  try {
    const u = new URL(s)
    return u.protocol === 'http:' || u.protocol === 'https:'
  } catch {
    return false
  }
}

/** The first problem with a profile, or '' when it can be saved. */
export function profileProblem(p: ProfileValues): string {
  const L = PROFILE_LIMITS
  if ((p.display_name ?? '').length > L.name) return `The name is at most ${L.name} characters.`
  if ((p.bio ?? '').length > L.bio) return `The bio is at most ${L.bio} characters.`
  if ((p.location ?? '').length > L.location)
    return `The location is at most ${L.location} characters.`
  if ((p.company ?? '').length > L.company) return `The company is at most ${L.company} characters.`
  const links = p.links ?? []
  if (links.length > L.links) return `At most ${L.links} links.`
  const bad = links.find((l) => !isWebUrl(l))
  if (bad) return `"${bad}" is not an http or https address.`
  return ''
}

/** The reason an image cannot be an avatar, or '' when it can. */
export function avatarProblem(f: { type: string; size: number }): string {
  if (!AVATAR_TYPES.includes(f.type)) return 'The avatar must be a PNG, JPEG or WebP image.'
  if (f.size > AVATAR_MAX_BYTES) return 'The avatar must be at most 1 MiB.'
  if (f.size === 0) return 'The image is empty.'
  return ''
}

/** The first problem with a new user name, or '' when it can be submitted. */
export function usernameProblem(next: string, current: string): string {
  if (!/^[a-z0-9_-]{2,39}$/.test(next)) return 'Use 2 to 39 lowercase letters, digits, "-" or "_".'
  if (next === current) return 'That is already your user name.'
  return ''
}
