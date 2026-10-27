import type { Meta, StoryObj } from '@storybook/vue3'
import PynSideNav from '../components/PynSideNav.vue'
import { mainNav, navItems } from '../state/shell.state'

const meta: Meta<typeof PynSideNav> = {
  title: 'Shell/PynSideNav',
  component: PynSideNav,
  args: {
    account: 'alice',
    items: mainNav,
    current: 'home',
    repos: [
      { owner: 'alice', name: 'castle-quest' },
      { owner: 'alice', name: 'core-engine' },
      { owner: 'alice', name: 'shared-assets' },
    ],
  },
}
export default meta
type Story = StoryObj<typeof PynSideNav>

export const Default: Story = {}
export const InRepository: Story = { args: { current: '', currentRepo: 'alice/castle-quest' } }
export const WithOrganizations: Story = {
  args: { orgs: [{ name: 'studio' }, { name: 'tools-guild' }], currentOrg: 'studio', current: '' },
}
export const NoRepositories: Story = { args: { repos: [] } }
export const Administrator: Story = { args: { items: navItems(true), current: 'accounts' } }
export const ExtraNavigation: Story = {
  args: {
    extraNav: [
      { id: 'billing', label: 'Billing', href: '/_/billing', icon: 'lock' },
      { id: 'docs', label: 'Documentation', href: '/_/docs' },
    ],
  },
}
