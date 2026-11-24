import type { Meta, StoryObj } from '@storybook/vue3'
import PynProfileHeader from '../components/PynProfileHeader.vue'
import { profile } from './profile-data'

const meta: Meta<typeof PynProfileHeader> = {
  title: 'Profile/PynProfileHeader',
  component: PynProfileHeader,
  args: {
    username: profile.username,
    displayName: profile.displayName,
    bio: profile.bio,
    location: profile.location,
    company: profile.company,
    links: profile.links,
    createdAt: profile.createdAt,
  },
}
export default meta
type Story = StoryObj<typeof PynProfileHeader>

export const Full: Story = {}
export const UsernameOnly: Story = {
  args: {
    displayName: null,
    bio: null,
    location: null,
    company: null,
    links: [],
  },
}
export const WithActions: Story = {
  render: (args) => ({
    components: { PynProfileHeader },
    setup: () => ({ args }),
    template:
      '<PynProfileHeader v-bind="args"><template #actions><button>Edit profile</button></template></PynProfileHeader>',
  }),
}
export const Column: Story = {
  args: { column: true },
  render: (args) => ({
    components: { PynProfileHeader },
    setup: () => ({ args }),
    template:
      '<div style="max-width: 18.5rem"><PynProfileHeader v-bind="args"><template #actions><button>Edit profile</button></template></PynProfileHeader></div>',
  }),
}
