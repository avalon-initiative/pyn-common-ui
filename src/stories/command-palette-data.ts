import type { CommandItem, ShortcutGroup } from '../types/command-palette.types'

export const commandItems: CommandItem[] = [
  { id: 'dash', label: 'Dashboard', group: 'Go to', href: '#/', hint: 'g d', keywords: ['home'] },
  { id: 'repos', label: 'Repositories', group: 'Go to', href: '#/repos', hint: 'g r' },
  { id: 'orgs', label: 'Organizations', group: 'Go to', href: '#/orgs', hint: 'g o' },
  { id: 'people', label: 'People', group: 'Go to', href: '#/people', hint: 'g p' },
  { id: 'r1', label: 'acme/textures', group: 'Repositories', href: '#/acme/textures' },
  { id: 'r2', label: 'acme/level-design', group: 'Repositories', href: '#/acme/level-design' },
  { id: 'r3', label: 'studio/audio-assets', group: 'Repositories', href: '#/studio/audio-assets' },
  { id: 'new', label: 'New repository', group: 'Actions', keywords: ['create'] },
  { id: 'theme', label: 'Switch theme', group: 'Actions', keywords: ['dark', 'light'] },
]

export const manyItems: CommandItem[] = Array.from({ length: 60 }, (_, i) => ({
  id: `file-${i}`,
  label: `assets/textures/rock-${String(i).padStart(2, '0')}.png`,
  group: i < 30 ? 'Files' : 'Recent files',
  hint: i % 3 ? undefined : 'exclusive',
}))

export const shortcutGroups: ShortcutGroup[] = [
  {
    title: 'Site',
    shortcuts: [
      { keys: ['/'], label: 'Focus search' },
      { keys: ['Ctrl', 'K'], label: 'Open the command palette' },
      { keys: ['?'], label: 'Show shortcuts' },
    ],
  },
  {
    title: 'Go to',
    shortcuts: [
      { keys: ['g', 'd'], label: 'Dashboard' },
      { keys: ['g', 'r'], label: 'Repositories' },
      { keys: ['g', 'o'], label: 'Organizations' },
    ],
  },
]
