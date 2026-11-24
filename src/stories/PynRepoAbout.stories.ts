import type { Meta, StoryObj } from '@storybook/vue3'
import PynRepoAbout from '../components/PynRepoAbout.vue'

const meta: Meta<typeof PynRepoAbout> = {
  title: 'Browse/PynRepoAbout',
  component: PynRepoAbout,
  args: { description: 'An action game about a haunted castle.' },
}
export default meta
type Story = StoryObj<typeof PynRepoAbout>

/** Topics are not supported yet, so the placeholder shows. */
export const Default: Story = {}
export const Empty: Story = { args: { description: null } }
export const Full: Story = {
  args: {
    website: 'https://castle-quest.example.com',
    topics: ['unreal', 'game', 'locking'],
    stars: 12,
    watching: 3,
    forks: 1,
  },
}
export const CountsOnly: Story = { args: { topics: [], stars: 0, watching: 0, forks: 0 } }
