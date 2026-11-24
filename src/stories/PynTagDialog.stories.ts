import type { Meta, StoryObj } from '@storybook/vue3'
import PynTagDialog from '../components/PynTagDialog.vue'
import { tagsPageBranches, tagsPageTags } from './tags-page-data'

const meta: Meta<typeof PynTagDialog> = {
  title: 'Browse/PynTagDialog',
  component: PynTagDialog,
  args: { open: true, mode: 'create', branches: tagsPageBranches, tags: tagsPageTags },
}
export default meta
type Story = StoryObj<typeof PynTagDialog>

export const Create: Story = {}
export const FromBranch: Story = { args: { from: 'level-3-rework' } }
export const Busy: Story = { args: { busy: true } }
export const Failed: Story = { args: { error: 'A tag with this name already exists.' } }
export const Delete: Story = { args: { mode: 'delete', name: 'v0.1.1' } }
