import type { Meta, StoryObj } from '@storybook/vue3'
import PynSideRail from '../components/PynSideRail.vue'

const repos = [
  'avalon-protocol',
  'pyn',
  'entitlemap-frontend',
  'eqoa-frontiers',
  'pipe-deck',
  'pyn-web',
  'entitlemap-backend',
  'pyn-common-ui',
  'worldzero',
  'nova',
  'avalon-sdks',
  'metrigauge',
].map((name) => ({ owner: 'alice', name }))

const meta: Meta<typeof PynSideRail> = {
  title: 'Shell/PynSideRail',
  component: PynSideRail,
  args: {
    account: 'alice',
    items: [{ id: 'home', label: 'Home', href: '/', icon: 'home' }],
    current: 'home',
    orgs: [{ name: 'studio' }, { name: 'tools-guild' }],
    repos,
  },
}
export default meta
type Story = StoryObj<typeof PynSideRail>

export const Default: Story = {}
export const WithProfile: Story = { args: { displayName: 'Alice Anders' } }
export const OrganizationAccount: Story = { args: { currentOrg: 'studio' } }
export const InRepository: Story = { args: { current: '', currentRepo: 'alice/pyn-web' } }
export const FewRepositories: Story = { args: { repos: repos.slice(0, 3) } }
export const NoRepositories: Story = { args: { repos: [], orgs: [] } }
