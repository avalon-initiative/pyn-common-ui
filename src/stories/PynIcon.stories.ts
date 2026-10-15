import type { Meta, StoryObj } from '@storybook/vue3'
import PynIcon from '../components/PynIcon.vue'

const names = [
  'home', 'repo', 'settings', 'search', 'plus', 'chevron', 'menu', 'key', 'folder', 'file',
  'branch', 'lock', 'user',
]

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
