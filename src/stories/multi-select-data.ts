import type { MultiSelectOption } from '../types/multi-select.types'

export const multiSelectOptions: MultiSelectOption[] = [
  { value: 'read', label: 'Read', description: 'See files and history' },
  { value: 'write', label: 'Write', description: 'Push commits to shared paths' },
  { value: 'lock', label: 'Lock', description: 'Check out exclusive files' },
  { value: 'admin', label: 'Admin', description: 'Manage members and settings' },
  { value: 'audit', label: 'Audit' },
  { value: 'webhooks', label: 'Webhooks', description: 'Create and edit webhooks' },
]

export const multiSelectLong: MultiSelectOption[] = [
  {
    value: 'a',
    label: 'A role with a very long name that has to wrap instead of overflowing its container',
    description:
      'A long description that explains in detail what the role allows, so that it wraps across several lines on a narrow screen without breaking the layout.',
  },
  { value: 'b', label: 'Short', description: 'Short description' },
  { value: 'c', label: 'Averyveryveryverylongwordwithoutanyspacesatalltotestoverflowwrapping' },
]
