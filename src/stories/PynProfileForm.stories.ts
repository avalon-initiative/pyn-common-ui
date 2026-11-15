import type { Meta, StoryObj } from '@storybook/vue3'
import PynProfileForm from '../components/PynProfileForm.vue'

const meta: Meta<typeof PynProfileForm> = {
  title: 'Shell/PynProfileForm',
  component: PynProfileForm,
  args: {
    user: 'alice',
    profile: {
      display_name: 'Alice Liddell',
      bio: 'Level designer.\nLocks the maps, merges the rest.',
      location: 'Oxford',
      company: 'Wonderland Games',
      links: ['https://example.com', 'https://example.com/alice'],
    },
  },
}
export default meta
type Story = StoryObj<typeof PynProfileForm>

export const Default: Story = {}
export const Empty: Story = { args: { profile: {} } }
export const WithAvatar: Story = {
  args: {
    avatarUrl:
      'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 8 8"><rect width="8" height="8" fill="%236a8caf"/></svg>',
  },
}
export const Saved: Story = { args: { success: 'Profile saved.' } }
export const Saving: Story = { args: { busy: true } }
export const SaveFailed: Story = { args: { error: 'Could not save the profile.' } }
export const AvatarFailed: Story = { args: { avatarError: 'The image is too large.' } }
