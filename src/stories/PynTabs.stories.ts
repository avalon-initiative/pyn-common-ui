import type { Meta, StoryObj } from '@storybook/vue3'
import PynTabs from '../components/PynTabs.vue'

const items = [
  { label: 'Code', href: '/studio/game', current: true },
  { label: 'Locks', href: '/studio/game/locks', count: 3, countLabel: '3 locked' },
  { label: 'History', href: '/studio/game/history' },
  { label: 'Audit', href: '/studio/game/audit' },
  { label: 'Insights', href: '/studio/game/insights' },
  { label: 'Settings', href: '/studio/game/settings' },
]

const meta: Meta<typeof PynTabs> = {
  title: 'Shell/PynTabs',
  component: PynTabs,
  args: { items, label: 'Repository' },
}
export default meta
type Story = StoryObj<typeof PynTabs>

export const Default: Story = {}
export const MoreMenu: Story = { args: { max: 4 } }
export const CurrentInMore: Story = {
  args: {
    max: 4,
    items: items.map((t) => ({ ...t, current: t.label === 'Settings' })),
  },
}
