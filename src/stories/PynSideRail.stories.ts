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
/** For the navigation drawer, where the top bar already switches owner. */
export const WithoutAccountSwitcher: Story = { args: { hideAccount: true } }
export const FewRepositories: Story = { args: { repos: repos.slice(0, 3) } }
export const NoRepositories: Story = { args: { repos: [], orgs: [] } }

const square = (fill: string) =>
  `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 8 8"><rect width="8" height="8" fill="%23${fill}"/></svg>`

/** Repository icon, else the owner's avatar, else initials; entries without either keep the glyph. */
export const WithRepositoryIcons: Story = {
  args: {
    repos: [
      { owner: 'alice', name: 'pyn', iconUrl: square('c84'), ownerAvatarUrl: square('4a7') },
      { owner: 'alice', name: 'pyn-web', iconUrl: null, ownerAvatarUrl: square('4a7') },
      { owner: 'studio', name: 'worldzero', iconUrl: null, ownerAvatarUrl: null },
      { owner: 'alice', name: 'nova' },
    ],
  },
}
