import type { Meta, StoryObj } from '@storybook/vue3'
import PynTokens from '../components/PynTokens.vue'
import { tokenList, tokenOwners, tokenRepos } from './token-data'

const meta: Meta<typeof PynTokens> = {
  title: 'Account/PynTokens',
  component: PynTokens,
  args: { owners: tokenOwners, repos: tokenRepos },
}
export default meta
type Story = StoryObj<typeof PynTokens>

export const WithTokens: Story = { args: { tokens: tokenList } }
export const NoTokens: Story = { args: { tokens: [] } }
export const JustCreated: Story = { args: { tokens: tokenList, secret: 'pyn_3f9c0d5b7a1e48d2' } }
export const Refused: Story = { args: { tokens: tokenList, error: 'unknown repository acme/nope' } }
