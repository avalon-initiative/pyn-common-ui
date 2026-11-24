import type { Meta, StoryObj } from '@storybook/vue3'
import PynRepoSocial from '../components/PynRepoSocial.vue'

const star = [
  { id: 'lists', label: 'Add to a list' },
  { id: 'unstar', label: 'Remove star' },
]
const watch = [
  { id: 'all', label: 'All activity', checked: true },
  { id: 'ignore', label: 'Ignore', checked: false },
]

const meta: Meta<typeof PynRepoSocial> = {
  title: 'Repository/PynRepoSocial',
  component: PynRepoSocial,
  args: { watch: { count: 0, menu: watch }, fork: { count: 1 }, star: { count: 3, menu: star } },
  render: (args) => ({
    components: { PynRepoSocial },
    setup: () => ({ args }),
    template: '<div style="min-height: 12rem"><PynRepoSocial v-bind="args" /></div>',
  }),
}
export default meta
type Story = StoryObj<typeof PynRepoSocial>

export const Default: Story = {}
export const Active: Story = {
  args: { watch: { count: 1, active: true, menu: watch }, star: { count: 4, active: true } },
}
export const OnlyStar: Story = { args: { watch: undefined, fork: undefined } }
export const Disabled: Story = { args: { fork: { count: 1, disabled: true } } }
