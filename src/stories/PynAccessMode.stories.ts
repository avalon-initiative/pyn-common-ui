import type { Meta, StoryObj } from '@storybook/vue3'
import PynAccessMode from '../components/PynAccessMode.vue'
import type { AccessCheckItem } from '../types/access.types'

const meta: Meta<typeof PynAccessMode> = {
  title: 'Admin/PynAccessMode',
  component: PynAccessMode,
}
export default meta
type Story = StoryObj<typeof PynAccessMode>

const checklist: AccessCheckItem[] = [
  { id: 'url', label: 'Public address and HTTPS', status: 'ok', detail: 'https://pyn.example.com' },
  {
    id: 'registration',
    label: 'Registration mode and sign-up protections',
    status: 'todo',
    detail: 'Registration is open without email verification.',
    href: '/_/admin/accounts',
  },
  { id: 'limits', label: 'Rate limits', status: 'unknown' },
]

export const Private: Story = { args: { mode: 'private', checklist } }
export const Public: Story = { args: { mode: 'public', checklist } }
export const Busy: Story = { args: { mode: 'private', checklist, busy: true } }
export const Failed: Story = {
  args: { mode: 'private', checklist, error: 'Only a server administrator can do that.' },
}
