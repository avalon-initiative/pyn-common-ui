import type { Meta, StoryObj } from '@storybook/vue3'
import PynRepoIconUpload from '../components/PynRepoIconUpload.vue'

const meta: Meta<typeof PynRepoIconUpload> = {
  title: 'Repositories/PynRepoIconUpload',
  component: PynRepoIconUpload,
  args: { owner: 'studio' },
}
export default meta
type Story = StoryObj<typeof PynRepoIconUpload>

export const OwnerInitial: Story = {}
export const OwnerAvatar: Story = {
  args: {
    ownerAvatarUrl:
      'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 8 8"><rect width="8" height="8" fill="%234a7"/></svg>',
  },
}
export const WithIcon: Story = {
  args: {
    iconUrl:
      'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 8 8"><rect width="8" height="8" fill="%23c84"/></svg>',
    ownerAvatarUrl:
      'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 8 8"><rect width="8" height="8" fill="%234a7"/></svg>',
  },
}
export const Uploading: Story = {
  args: {
    iconUrl:
      'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 8 8"><rect width="8" height="8" fill="%23c84"/></svg>',
    busy: true,
  },
}
export const Failed: Story = { args: { error: 'The icon must be at most 1 MiB.' } }
export const ReadOnly: Story = {
  args: {
    iconUrl:
      'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 8 8"><rect width="8" height="8" fill="%23c84"/></svg>',
    readonly: true,
  },
}
