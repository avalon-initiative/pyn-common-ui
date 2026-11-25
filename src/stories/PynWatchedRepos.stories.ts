import type { Meta, StoryObj } from '@storybook/vue3'
import PynWatchedRepos from '../components/PynWatchedRepos.vue'
import { watched, watchingNow } from './watching-data'

const meta: Meta<typeof PynWatchedRepos> = {
  title: 'Repositories/PynWatchedRepos',
  component: PynWatchedRepos,
  args: { repos: watched, now: watchingNow },
}
export default meta
type Story = StoryObj<typeof PynWatchedRepos>

export const Levels: Story = {}
export const MorePages: Story = { args: { hasMore: true } }
export const LoadingMore: Story = { args: { hasMore: true, busy: true } }
export const Changing: Story = {
  args: { repos: watched.map((w, i) => (i === 1 ? { ...w, busy: true } : w)) },
}
export const Loading: Story = { args: { repos: [], loading: true } }
export const Empty: Story = { args: { repos: [] } }
export const Failed: Story = {
  args: { repos: [], error: 'The watched repositories could not be loaded.' },
}
