import type { Meta, StoryObj } from '@storybook/vue3'
import PynFileTree from '../components/PynFileTree.vue'
import { treeEntries } from './file-data'

const meta: Meta<typeof PynFileTree> = {
  title: 'File/PynFileTree',
  component: PynFileTree,
  parameters: { layout: 'padded' },
  args: {
    owner: 'acme',
    name: 'castle-quest',
    entries: treeEntries,
    expanded: ['Source', 'Content'],
    current: 'Source/useCount.ts',
  },
}
export default meta
type Story = StoryObj<typeof PynFileTree>

export const Open: Story = {}
export const Collapsed: Story = { args: { expanded: [] } }
export const LoadingFolder: Story = { args: { expanded: ['Content', 'docs'], loading: ['docs'] } }
export const OnBranch: Story = { args: { branch: 'feature/levels' } }
