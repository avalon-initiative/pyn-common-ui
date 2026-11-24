import type { Meta, StoryObj } from '@storybook/vue3'
import PynCommentForm from '../components/PynCommentForm.vue'
import PynPullRequestPage from '../components/PynPullRequestPage.vue'
import { diffFiles } from './diff-data'
import { now } from './landing-data'
import {
  closedPull,
  conflictedPull,
  draftPull,
  emptyPull,
  filesWithLock,
  lockedPull,
  mergedEvents,
  mergedPull,
  openPull,
  pullCommits,
  pullEvents,
} from './pull-request-data'

const meta: Meta<typeof PynPullRequestPage> = {
  title: 'Pull requests/PynPullRequestPage',
  component: PynPullRequestPage,
  parameters: { layout: 'padded' },
  decorators: [
    () => ({ template: '<div style="padding-top: var(--pyn-topbar-height)"><story /></div>' }),
  ],
  args: {
    pull: openPull,
    basePath: '/acme/castle-quest/pulls/42',
    owner: 'acme',
    name: 'castle-quest',
    me: 'jamie',
    now,
    commits: pullCommits,
    events: pullEvents,
    files: diffFiles,
    viewed: [],
    editable: true,
    canManage: true,
  },
}
export default meta
type Story = StoryObj<typeof PynPullRequestPage>

export const Open: Story = {}
export const Merged: Story = {
  args: { pull: mergedPull, events: mergedEvents, basePath: '/acme/castle-quest/pulls/42' },
}
export const Closed: Story = { args: { pull: closedPull } }
export const LocksHeldByOthers: Story = { args: { pull: lockedPull } }
export const Conflicted: Story = { args: { pull: conflictedPull } }
export const Merging: Story = { args: { merging: true } }
export const MergeFailed: Story = {
  args: { mergeError: 'The target branch moved; refresh and try again.' },
}
export const Empty: Story = {
  args: {
    pull: emptyPull,
    events: [],
    commits: [],
    files: [],
    basePath: '/acme/castle-quest/pulls/43',
  },
}
export const CommitsTab: Story = { args: { tab: 'commits' } }
export const ChecksTab: Story = { args: { tab: 'checks' } }
export const FilesChangedTab: Story = {
  args: { tab: 'files', pull: lockedPull, files: filesWithLock },
}
export const Narrow: Story = {
  decorators: [
    () => ({
      template: '<div style="width: 22rem; padding-top: var(--pyn-topbar-height)"><story /></div>',
    }),
  ],
}
export const Draft: Story = {
  args: { pull: draftPull },
  render: (args) => ({
    components: { PynPullRequestPage },
    setup: () => ({ args }),
    template: `<PynPullRequestPage v-bind="args">
      <template #notices>
        <div style="padding: var(--pyn-space-3) var(--pyn-space-4); border: 1px solid var(--pyn-border); border-radius: var(--pyn-radius)">
          This pull request is a draft and cannot be merged until it is marked ready for review.
        </div>
      </template>
    </PynPullRequestPage>`,
  }),
}
export const OverrideLocks: Story = { args: { pull: lockedPull, canOverrideLocks: true } }
export const EditingDescription: Story = {
  play: ({ canvasElement }) =>
    canvasElement.querySelector<HTMLButtonElement>('[data-kind=comment] [data-edit]')!.click(),
}
export const WithCommentForm: Story = {
  render: (args) => ({
    components: { PynPullRequestPage, PynCommentForm },
    setup: () => ({ args }),
    template: `<PynPullRequestPage v-bind="args">
      <template #comment><PynCommentForm can-close /></template>
    </PynPullRequestPage>`,
  }),
}
export const ScrolledBar: Story = {
  decorators: [
    () => ({
      template:
        '<div style="padding-top: var(--pyn-topbar-height); min-height: 300vh"><story /></div>',
    }),
  ],
  play: async () => {
    window.scrollTo(0, 400)
    await new Promise((resolve) => setTimeout(resolve, 50))
  },
}
