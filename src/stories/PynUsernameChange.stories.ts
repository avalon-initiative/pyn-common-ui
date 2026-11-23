import type { Meta, StoryObj } from '@storybook/vue3'
import PynUsernameChange from '../components/PynUsernameChange.vue'

const meta: Meta<typeof PynUsernameChange> = {
  title: 'Shell/PynUsernameChange',
  component: PynUsernameChange,
  args: { current: 'alice', repositories: ['alice/game', 'alice/tools'] },
}
export default meta
type Story = StoryObj<typeof PynUsernameChange>

export const Default: Story = {}
export const NoPassword: Story = { args: { hasPassword: false } }
export const NameTaken: Story = { args: { error: 'That name is taken.' } }
export const WrongPassword: Story = { args: { error: 'The password is incorrect.' } }
export const Busy: Story = { args: { busy: true } }
export const WithPreview: Story = { args: { nameCanonical: 'alice-b' } }
