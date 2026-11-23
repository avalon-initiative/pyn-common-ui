import type { Meta, StoryObj } from '@storybook/vue3'
import PynPolicyView from '../components/PynPolicyView.vue'

const meta: Meta<typeof PynPolicyView> = {
  title: 'Settings/PynPolicyView',
  component: PynPolicyView,
  args: {
    mode: 'shared',
    editHref: '/alice/game/settings/policy',
    rules: [
      { pattern: 'Content/**/*.uasset', mode: 'exclusive', comment: 'Binary assets cannot merge' },
      { pattern: '*.psd', mode: 'exclusive' },
      { pattern: 'docs/**', mode: 'shared', comment: 'Plain text' },
    ],
  },
}
export default meta
type Story = StoryObj<typeof PynPolicyView>

export const Default: Story = {}
export const WithMatch: Story = { args: { path: 'art/hero.psd', matched: 1 } }
export const MatchedByPattern: Story = {
  args: { path: 'Content/Levels/L1.uasset', matched: 'Content/**/*.uasset' },
}
export const NoMatchingRule: Story = { args: { path: 'README.md' } }
export const NoRules: Story = { args: { rules: [] } }
export const NoRulesExclusive: Story = { args: { rules: [], mode: 'exclusive' } }
export const ReadOnlyWithoutEditLink: Story = { args: { editHref: undefined } }
export const Loading: Story = { args: { loading: true } }
export const Failed: Story = { args: { error: 'Could not load the policy.' } }
export const Narrow: Story = {
  args: { path: 'art/hero.psd', matched: 1 },
  parameters: { viewport: { defaultViewport: 'mobile1' } },
}
