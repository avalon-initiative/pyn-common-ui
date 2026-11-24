import type { Meta, StoryObj } from '@storybook/vue3'
import PynHistory from '../components/PynHistory.vue'
import { aliciaIdentity } from './person-data'
import { pickerTags } from './tags-page-data'

const meta: Meta<typeof PynHistory> = {
  title: 'Repository/PynHistory',
  component: PynHistory,
  args: { now: new Date('2026-10-09T12:00:00Z') },
}
export default meta
type Story = StoryObj<typeof PynHistory>

const revisions = [
  {
    id: 5,
    path: 'Content/Maps/Main.umap',
    author: 'alice',
    message: 'Restore r1',
    created_at: '2026-10-08T11:00:00Z',
    restored_from: 1,
  },
  {
    id: 4,
    path: 'Content/Textures/Wall.uasset',
    author: 'bob',
    message: 'Retouch the wall texture',
    created_at: '2026-10-08T09:30:00Z',
  },
  {
    id: 3,
    path: 'Source/Game.ts',
    author: 'alice',
    message: 'Spawn the player at the gate',
    created_at: '2026-10-07T16:20:00Z',
  },
  {
    id: 2,
    path: 'Content/Maps/Main.umap',
    author: 'bob',
    message: 'Add lighting',
    created_at: '2026-10-07T10:00:00Z',
  },
  {
    id: 1,
    path: 'Content/Maps/Main.umap',
    author: 'alice',
    message: 'First pass',
    created_at: '2026-10-06T09:00:00Z',
  },
]

export const WithBody: Story = {
  args: {
    revisions: [
      {
        ...revisions[1],
        message:
          'Retouch the wall texture\n\nThe old tiling showed a seam at the corner.\nRegenerated mips as well.\n',
      },
      revisions[2],
    ],
  },
}

export const Repository: Story = { args: { revisions, hasMore: true } }
export const Filtered: Story = {
  args: { revisions: revisions.filter((r) => r.path.endsWith('.uasset')), filter: '*.uasset' },
}
export const OneFile: Story = {
  args: { revisions: revisions.slice(3), path: 'Content/Maps/Main.umap' },
}
export const Loading: Story = { args: { revisions: [], loading: true } }
export const Empty: Story = { args: { revisions: [] } }
export const NoMatch: Story = { args: { revisions: [], filter: '*.xyz' } }
export const BadPattern: Story = {
  args: { revisions, filter: '[', error: 'invalid pattern: unclosed character class' },
}

export const WithIdentities: Story = {
  args: {
    revisions: revisions.map((r, i) =>
      i === 0 ? { ...r, author_public: aliciaIdentity, author_current: 'alicia' } : r,
    ),
  },
}

export const Timeline: Story = {
  args: {
    revisions,
    title: 'History',
    branch: 'main',
    branches: [
      { name: 'main', isDefault: true, updatedAt: '2026-10-08T10:00:00Z' },
      { name: 'feature/levels', updatedAt: '2026-10-05T09:30:00Z' },
    ],
    branchesHref: '/acme/castle-quest/branches',
    users: ['alice', 'bob'],
    user: '',
    range: 'all',
    browseHref: (rev) => `/acme/castle-quest/blob/${rev.path}?revision=${rev.id}`,
  },
}
export const TimelineFiltered: Story = {
  args: {
    ...Timeline.args,
    revisions: revisions.filter((r) => r.author === 'bob'),
    user: 'bob',
    range: 'week',
  },
}
export const WithVerified: Story = { args: { ...Timeline.args, verified: [4, 3] } }
export const TimelineOneFile: Story = {
  args: { ...Timeline.args, revisions: revisions.slice(3), path: 'Content/Maps/Main.umap' },
}
export const OnDefaultBranch: Story = {
  args: { ...Timeline.args, branch: undefined, newBranchButton: true },
}
export const TimelineWithTags: Story = {
  args: { ...Timeline.args, tags: pickerTags, tagsHref: '/acme/castle-quest/tags' },
}
export const TimelineOnATag: Story = {
  args: { ...TimelineWithTags.args, branch: 'v0.1.1', currentKind: 'tag' },
}
