import type { Meta, StoryObj } from '@storybook/vue3'
import PynSubNav from '../components/PynSubNav.vue'

const meta: Meta<typeof PynSubNav> = {
  title: 'Shell/PynSubNav',
  component: PynSubNav,
  args: {
    label: 'Repositories',
    current: 'mine',
    groups: [
      {
        id: 'lists',
        items: [
          {
            id: 'contrib',
            label: 'My contributions',
            href: '/_/repos?tab=contributions',
            icon: 'user',
          },
          { id: 'mine', label: 'My repositories', href: '/_/repos', icon: 'repo' },
          { id: 'locks', label: 'My locks', href: '/_/locks', icon: 'lock', badge: 2 },
        ],
      },
      {
        id: 'account',
        heading: 'Account',
        items: [
          { id: 'orgs', label: 'Organizations', href: '/_/orgs', icon: 'user' },
          { id: 'settings', label: 'Settings', href: '/_/settings', icon: 'settings' },
        ],
      },
    ],
  },
}
export default meta
type Story = StoryObj<typeof PynSubNav>

export const Default: Story = {}
export const SingleGroup: Story = {
  args: {
    groups: [
      { id: 'one', heading: 'Settings', items: [{ id: 'a', label: 'Password', href: '/_/a' }] },
    ],
    current: 'a',
  },
}
export const WithFooter: Story = {
  render: (args) => ({
    components: { PynSubNav },
    setup: () => ({ args }),
    template: '<PynSubNav v-bind="args"><template #footer>Collapse sidebar</template></PynSubNav>',
  }),
}
