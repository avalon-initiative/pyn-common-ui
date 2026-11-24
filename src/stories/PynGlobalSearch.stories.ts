import type { Meta, StoryObj } from '@storybook/vue3'
import PynGlobalSearch from '../components/PynGlobalSearch.vue'
import { searchResults } from './global-search-data'

const meta: Meta<typeof PynGlobalSearch> = {
  title: 'Shell/PynGlobalSearch',
  component: PynGlobalSearch,
}
export default meta
type Story = StoryObj<typeof PynGlobalSearch>

export const Default: Story = {}
export const WithRepositorySuggestions: Story = {
  args: { options: ['alice/castle-quest', 'studio/core-engine'] },
}
export const GroupedResults: Story = {
  args: { results: searchResults },
  render: (args) => ({
    components: { PynGlobalSearch },
    setup: () => ({ args }),
    template: `<div style="min-height: 22rem"><PynGlobalSearch v-bind="args" /></div>`,
  }),
  play: async ({ canvasElement }) => {
    const input = canvasElement.querySelector('input')!
    input.focus()
    input.value = 'co'
    input.dispatchEvent(new Event('input', { bubbles: true }))
  },
}
export const OwnersOnly: Story = {
  args: { results: searchResults.filter((r) => r.kind === 'owner') },
  play: GroupedResults.play,
}
