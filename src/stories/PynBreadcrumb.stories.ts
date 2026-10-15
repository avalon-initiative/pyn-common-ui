import type { Meta, StoryObj } from '@storybook/vue3'
import PynBreadcrumb from '../components/PynBreadcrumb.vue'

const meta: Meta<typeof PynBreadcrumb> = { title: 'Browse/PynBreadcrumb', component: PynBreadcrumb }
export default meta
type Story = StoryObj<typeof PynBreadcrumb>

export const Root: Story = { args: { crumbs: [{ label: 'acme/castle-quest' }] } }
export const Nested: Story = {
  args: {
    crumbs: [
      { label: 'acme/castle-quest', href: '/acme/castle-quest' },
      { label: 'Content', href: '/acme/castle-quest/tree/Content' },
      { label: 'Levels', href: '/acme/castle-quest/tree/Content/Levels' },
      { label: 'Dungeon' },
    ],
  },
}
