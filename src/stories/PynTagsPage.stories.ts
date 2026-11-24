import type { Meta, StoryObj } from '@storybook/vue3'
import PynTagsPage from '../components/PynTagsPage.vue'
import { tagsPageBranches, tagsPageTags } from './tags-page-data'

const meta: Meta<typeof PynTagsPage> = {
  title: 'Browse/PynTagsPage',
  component: PynTagsPage,
  args: {
    now: new Date('2026-11-22T12:00:00Z'),
    tags: tagsPageTags,
    branches: tagsPageBranches,
    canCreate: true,
    canDelete: true,
  },
}
export default meta
type Story = StoryObj<typeof PynTagsPage>

export const Default: Story = {}
export const ReadOnly: Story = { args: { canCreate: false, canDelete: false } }
export const Searching: Story = { args: { query: 'v0' } }
export const NoMatches: Story = { args: { query: 'zzz' } }
export const Empty: Story = { args: { tags: [] } }
export const EmptyReadOnly: Story = { args: { tags: [], canCreate: false, canDelete: false } }
export const Loading: Story = { args: { loading: true } }
export const Failed: Story = { args: { error: 'Could not load tags.' } }
export const NewTagDialog: Story = { args: { creating: true } }
export const NewTagFailed: Story = {
  args: { creating: true, dialogError: 'The target does not name a branch or commit.' },
}
export const DeleteConfirm: Story = { args: { deleting: 'v0.1.1' } }
export const Mobile: Story = { parameters: { viewport: { defaultViewport: 'mobile1' } } }
