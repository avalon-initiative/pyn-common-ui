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

const openFork = async ({ canvasElement }: { canvasElement: HTMLElement }) => {
  canvasElement.querySelector<HTMLElement>('button[aria-label="Fork options"]')!.click()
  await new Promise((resolve) => setTimeout(resolve))
}
export const ForksOpen: Story = {
  args: {
    fork: { count: 2 },
    forks: [
      { owner: 'bob', name: 'game' },
      { owner: 'modding-club', name: 'game-mods' },
    ],
  },
  play: openFork,
}
export const NoForksOpen: Story = { args: { fork: { count: 0 }, forks: [] }, play: openFork }
export const ForksWithIcons: Story = {
  args: {
    fork: { count: 2 },
    forks: [
      {
        owner: 'bob',
        name: 'game',
        iconUrl:
          'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 8 8"><rect width="8" height="8" fill="%23c84"/></svg>',
      },
      {
        owner: 'modding-club',
        name: 'game-mods',
        iconUrl: null,
        ownerAvatarUrl:
          'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 8 8"><rect width="8" height="8" fill="%234a7"/></svg>',
      },
      { owner: 'sam', name: 'game', iconUrl: null, ownerAvatarUrl: null },
    ],
  },
  play: openFork,
}
