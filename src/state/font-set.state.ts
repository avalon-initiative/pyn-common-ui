export type FontSet = 'default' | 'arcade' | 'system'

export const fontSets: { id: FontSet; label: string }[] = [
  { id: 'default', label: 'Default (Geist)' },
  { id: 'arcade', label: 'Arcade (Pixelify Sans headings)' },
  { id: 'system', label: 'System' },
]
