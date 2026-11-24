import type { Meta, StoryObj } from '@storybook/vue3'
import PynMergeBox from '../components/PynMergeBox.vue'
import { now } from './landing-data'
import {
  closedPull,
  conflictedPull,
  draftPull,
  lockedPull,
  mergedPull,
  openPull,
} from './pull-request-data'

const meta: Meta<typeof PynMergeBox> = {
  title: 'Pull requests/PynMergeBox',
  component: PynMergeBox,
  args: { pull: openPull, me: 'jamie', now },
}
export default meta
type Story = StoryObj<typeof PynMergeBox>

export const ReviewRequested: Story = {}
export const Ready: Story = {
  args: { pull: { ...openPull, review: 'approved', approvals: { approved: 1, required: 1 } } },
}
export const LocksHeldByOthers: Story = { args: { pull: lockedPull } }
export const Conflicts: Story = { args: { pull: conflictedPull } }
export const Merged: Story = { args: { pull: mergedPull } }
export const Closed: Story = { args: { pull: closedPull } }
export const ReadOnlyViewer: Story = { args: { canMerge: false } }
export const Busy: Story = { args: { busy: true } }
export const Draft: Story = { args: { pull: draftPull } }
export const DraftReadOnly: Story = { args: { pull: draftPull, canMerge: false } }
export const OverrideLocks: Story = { args: { pull: lockedPull, canOverrideLocks: true } }
export const OverrideLocksConfirm: Story = {
  args: { pull: lockedPull, canOverrideLocks: true },
  play: ({ canvasElement }) =>
    canvasElement.querySelector<HTMLButtonElement>('[data-merge]')!.click(),
}
export const NoReviewData: Story = {
  args: { pull: { ...openPull, approvals: undefined, threads: undefined } },
}
export const CommentsWithoutThreads: Story = {
  args: { pull: { ...openPull, comments: 3, threads: undefined } },
}
