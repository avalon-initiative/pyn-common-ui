import type { Meta, StoryObj } from '@storybook/vue3'
import PynIcon from '../components/PynIcon.vue'
import { PYN_ICON_PACK } from '../state/icon-pack.state'
import { lucideIcons } from '../utils/icons'
import type { IconPack } from '../types/icon.types'

const names = Object.keys(lucideIcons)

const meta: Meta<typeof PynIcon> = {
  title: 'Shell/PynIcon',
  component: PynIcon,
  args: { name: 'repo' },
  argTypes: { name: { control: 'select', options: names } },
}
export default meta
type Story = StoryObj<typeof PynIcon>

export const Single: Story = {
  render: (args) => ({
    components: { PynIcon },
    setup: () => ({ args }),
    template: '<span style="font-size: 2rem"><PynIcon v-bind="args" /></span>',
  }),
}
export const All: Story = {
  render: () => ({
    components: { PynIcon },
    setup: () => ({ names }),
    template:
      '<div style="display: flex; flex-wrap: wrap; gap: 1rem; font-size: 1.5rem"><PynIcon v-for="n in names" :key="n" :name="n" /></div>',
  }),
}

// A host pack overrides repo (markup string), star (element nodes); the rest stay Lucide.
const hostPack: IconPack = {
  repo: '<rect x="4" y="4" width="16" height="16" rx="3" /><path d="M9 9h6M9 13h6" />',
  star: [['path', { d: 'M12 3l2.5 6 6.5.5-5 4.2 1.6 6.3L12 16.5 6.4 20l1.6-6.3-5-4.2L9.5 9z' }]],
}

export const PackOverride: Story = {
  render: () => ({
    components: { PynIcon },
    provide: { [PYN_ICON_PACK as symbol]: hostPack },
    template:
      '<div style="display: flex; gap: 1rem; font-size: 2rem"><PynIcon name="repo" /><PynIcon name="star" /><PynIcon name="home" /><PynIcon name="branch" /></div>',
  }),
}
