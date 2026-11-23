import type { Meta, StoryObj } from '@storybook/vue3'
import PynGlobalSearch from '../components/PynGlobalSearch.vue'

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
