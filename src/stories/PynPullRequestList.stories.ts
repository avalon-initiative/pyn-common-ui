import type { Meta, StoryObj } from '@storybook/vue3'
import PynPullRequestList from '../components/PynPullRequestList.vue'
import { now } from './landing-data'
import { pullList } from './pull-request-data'
import type { NavGroup } from '../types/shell.types'

const navGroups: NavGroup[] = [
  {
    id: 'views',
    items: [
      { id: 'all', label: 'All pull requests', href: '#all', icon: 'pull-request' },
      { id: 'mine', label: 'Created by me', href: '#mine', icon: 'user' },
      { id: 'review', label: 'Review requests', href: '#review', icon: 'eye', badge: 2 },
    ],
  },
]

const open = pullList.filter((p) => p.state === 'open')

const meta: Meta<typeof PynPullRequestList> = {
  title: 'Pull requests/PynPullRequestList',
  component: PynPullRequestList,
  parameters: { layout: 'padded' },
  args: {
    pulls: open,
    count: open.length,
    counts: { open: 3, closed: 2 },
    status: 'open',
    now,
    navGroups,
    navCurrent: 'all',
    newHref: '/acme/castle-quest/pulls/new',
  },
}
export default meta
type Story = StoryObj<typeof PynPullRequestList>

export const Open: Story = {}
export const Closed: Story = {
  args: {
    status: 'closed',
    pulls: pullList.filter((p) => p.state !== 'open'),
    count: 2,
  },
}
export const WithLocksHeldByOthers: Story = {
  args: { pulls: pullList.filter((p) => p.locked), count: 1 },
}
export const Searching: Story = {
  args: { query: 'is:open author:sam', pulls: [], count: 0, filtered: true },
}
export const Empty: Story = {
  args: { pulls: [], count: 0, counts: { open: 0, closed: 0 } },
}
export const WithoutSubNav: Story = { args: { navGroups: undefined } }
export const Loading: Story = { args: { loading: true } }
export const Failed: Story = { args: { error: 'Could not load pull requests.' } }
export const Paged: Story = { args: { count: 75, page: 2, pageSize: 30 } }
export const Narrow: Story = {
  decorators: [() => ({ template: '<div style="width: 22rem"><story /></div>' })],
}
