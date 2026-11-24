import type { Meta, StoryObj } from '@storybook/vue3'
import PynFilesPanel from '../components/PynFilesPanel.vue'
import { treeEntries } from './file-data'

const meta: Meta<typeof PynFilesPanel> = {
  title: 'File/PynFilesPanel',
  component: PynFilesPanel,
  parameters: { layout: 'padded' },
  decorators: [() => ({ template: '<div style="width: 20rem"><story /></div>' })],
  args: {
    owner: 'acme',
    name: 'castle-quest',
    entries: treeEntries,
    expanded: ['Source'],
    current: 'Source/useCount.ts',
    branch: 'main',
    branches: [
      { name: 'main', isDefault: true },
      { name: 'feature/levels', updatedAt: '2026-10-05T09:30:00Z' },
    ],
    branchesHref: '/acme/castle-quest/branches',
    collapsed: false,
  },
}
export default meta
type Story = StoryObj<typeof PynFilesPanel>

export const Default: Story = { args: { collapsed: false } }
export const Collapsed: Story = { args: { collapsed: true } }
export const WithoutBranches: Story = { args: { branches: undefined } }
export const OnDefaultBranch: Story = { args: { branch: undefined } }
export const WithBranchButtons: Story = { args: { newBranchButton: true } }
