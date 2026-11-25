import type { Meta, StoryObj } from '@storybook/vue3'
import PynTabs from '../components/PynTabs.vue'

const items = [
  { label: 'Code', href: '/studio/game', current: true, icon: 'code' },
  { label: 'Locks', href: '/studio/game/locks', count: 3, countLabel: '3 locked', icon: 'lock' },
  { label: 'History', href: '/studio/game/history', icon: 'history' },
  { label: 'Audit', href: '/studio/game/audit', icon: 'file' },
  { label: 'Insights', href: '/studio/game/insights', icon: 'insights' },
  { label: 'Settings', href: '/studio/game/settings', icon: 'settings' },
]

const meta: Meta<typeof PynTabs> = {
  title: 'Shell/PynTabs',
  component: PynTabs,
  args: { items, label: 'Repository' },
}
export default meta
type Story = StoryObj<typeof PynTabs>

const narrow: Story['render'] = (args) => ({
  components: { PynTabs },
  setup: () => ({ args }),
  template: `<div style="width: 22rem"><PynTabs v-bind="args" /></div>`,
})

export const Default: Story = {}
export const MoreMenu: Story = { render: narrow }
export const CurrentInMore: Story = {
  args: { items: items.map((t) => ({ ...t, current: t.label === 'Settings' })) },
  render: narrow,
}
export const WithoutIcons: Story = {
  args: { items: items.map((t) => ({ ...t, icon: undefined })) },
}
export const ReservedCount: Story = {
  args: {
    items: items.map((t) =>
      t.label === 'Locks' ? { ...t, count: undefined, reserveCount: true } : t,
    ),
  },
}

/** Drag the handle: tabs move into More only once they no longer fit. */
export const Resizable: Story = {
  render: (args) => ({
    components: { PynTabs },
    setup: () => ({ args }),
    template: `<div style="width: 40rem; max-width: 100%; min-width: 8rem; padding-right: 0.5rem; overflow: hidden; resize: horizontal; border-right: 1px dashed currentColor"><PynTabs v-bind="args" /></div>`,
  }),
}
