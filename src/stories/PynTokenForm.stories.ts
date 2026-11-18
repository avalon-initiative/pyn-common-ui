import type { Meta, StoryObj } from '@storybook/vue3'
import PynTokenForm from '../components/PynTokenForm.vue'
import { tokenNow, tokenOwners, tokenRepos } from './token-data'

const meta: Meta<typeof PynTokenForm> = {
  title: 'Account/PynTokenForm',
  component: PynTokenForm,
  args: { owners: tokenOwners, repos: tokenRepos, now: tokenNow },
}
export default meta
type Story = StoryObj<typeof PynTokenForm>

export const Default: Story = {}
export const Busy: Story = { args: { busy: true } }
export const Refused: Story = { args: { error: 'not_org_owner: you are not an owner of acme' } }
export const OneOwner: Story = { args: { owners: [tokenOwners[0]] } }
