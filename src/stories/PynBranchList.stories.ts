import type { Meta, StoryObj } from '@storybook/vue3'
import PynBranchList from '../components/PynBranchList.vue'

const now = new Date('2026-11-22T12:00:00Z')
const meta: Meta<typeof PynBranchList> = {
  title: 'Browse/PynBranchList',
  component: PynBranchList,
  args: {
    now,
    branches: [
      { name: 'main', isDefault: true, updatedAt: '2026-11-22T10:00:00Z', href: '/alice/game' },
      {
        name: 'level-3-rework',
        ahead: 4,
        behind: 1,
        updatedAt: '2026-11-20T09:00:00Z',
        href: '/alice/game/tree/level-3-rework',
        compareHref: '/alice/game/compare/main...level-3-rework',
      },
      {
        name: 'audio-pass',
        ahead: 0,
        behind: 12,
        updatedAt: '2026-10-01T09:00:00Z',
        href: '/alice/game/tree/audio-pass',
        compareHref: '/alice/game/compare/main...audio-pass',
      },
    ],
  },
}
export default meta
type Story = StoryObj<typeof PynBranchList>

export const Default: Story = {}
export const DefaultByName: Story = {
  args: {
    defaultBranch: 'trunk',
    branches: [{ name: 'trunk' }, { name: 'topic', ahead: 1, behind: 0 }],
  },
}
export const Empty: Story = { args: { branches: [] } }
export const Loading: Story = { args: { loading: true } }
export const Failed: Story = { args: { error: 'Could not load branches.' } }
export const LongNames: Story = {
  args: {
    branches: [
      {
        name: 'feature/an-extraordinarily-long-branch-name-that-keeps-going-and-going',
        ahead: 2,
        behind: 3,
        updatedAt: '2026-11-21T09:00:00Z',
        href: '#',
        compareHref: '#',
      },
    ],
  },
  parameters: { viewport: { defaultViewport: 'mobile1' } },
}
