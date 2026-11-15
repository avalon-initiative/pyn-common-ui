import type { Meta, StoryObj } from '@storybook/vue3'
import PynAccountDelete from '../components/PynAccountDelete.vue'

const meta: Meta<typeof PynAccountDelete> = {
  title: 'Shell/PynAccountDelete',
  component: PynAccountDelete,
  args: { recoveryDays: 30 },
}
export default meta
type Story = StoryObj<typeof PynAccountDelete>

export const Password: Story = {}
export const ExternalSignIn: Story = { args: { external: true } }
export const Blocked: Story = {
  args: { blockers: { repos: ['alice/game', 'alice/tools'], orgs: ['studio'] } },
}
export const WrongPassword: Story = { args: { error: 'The password is incorrect.' } }
export const Busy: Story = { args: { busy: true } }
