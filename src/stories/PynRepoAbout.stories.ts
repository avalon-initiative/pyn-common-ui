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
    languages: [
      { name: 'C++', bytes: 812000 },
      { name: 'C#', bytes: 96000 },
      { name: 'HLSL', bytes: 31000 },
      { name: 'Python', bytes: 9000 },
      { name: 'Shell', bytes: 2000 },
    ],
  },
}
export const ManyLanguages: Story = {
  args: {
    topics: [],
    languages: [
      { name: 'Rust', bytes: 978000 },
      { name: 'Shell', bytes: 19000 },
      { name: 'TypeScript', bytes: 1200 },
      { name: 'Vue', bytes: 900 },
      { name: 'SCSS', bytes: 400 },
      { name: 'Makefile', bytes: 300 },
      { name: 'Dockerfile', bytes: 200 },
    ],
  },
}
export const CountsOnly: Story = { args: { topics: [], stars: 0, watching: 0, forks: 0 } }
