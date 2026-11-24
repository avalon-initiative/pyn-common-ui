import type { Meta, StoryObj } from '@storybook/vue3'
import PynTopBar from '../components/PynTopBar.vue'
import PynSideRail from '../components/PynSideRail.vue'
import { owners } from './dashboard-data'
import { searchResults } from './global-search-data'

const meta: Meta<typeof PynTopBar> = {
  title: 'Shell/PynTopBar',
  component: PynTopBar,
  parameters: { layout: 'fullscreen' },
  args: {
    user: 'alice',
    repos: ['alice/game', 'alice/tools'],
    theme: 'system',
    owners,
    locksHeld: 2,
    notifications: 3,
  },
}
export default meta
type Story = StoryObj<typeof PynTopBar>

const tick = () => new Promise((resolve) => setTimeout(resolve))
const openMenu = (label: string) => async (ctx: { canvasElement: HTMLElement }) => {
  ctx.canvasElement.querySelector<HTMLElement>(`button[aria-label^="${label}"]`)!.click()
  await tick()
}
const openBell = async (ctx: { canvasElement: HTMLElement }) => {
  ctx.canvasElement.querySelector<HTMLElement>('button[data-bell]')!.click()
  await tick()
}
const narrow = {
  viewport: { defaultViewport: 'mobile1' },
}

export const Default: Story = {}
export const Administrator: Story = { args: { admin: true } }
export const SignedOut: Story = { args: { signedOut: true, user: undefined } }
export const SignedOutWithoutSearch: Story = {
  args: { signedOut: true, user: undefined, showSearch: false },
}
export const ZeroCounts: Story = { args: { locksHeld: 0, notifications: 0 } }
export const LargeCounts: Story = { args: { locksHeld: 150, notifications: 240 } }
export const LocksExpiring: Story = { args: { locksHeld: 3, locksExpiring: true } }
export const LongNames: Story = {
  args: {
    user: 'a-very-long-username-indeed',
    displayName: 'Alexandria Montgomery-Featherstonehaugh',
    currentOwner: 'the-extraordinarily-long-organization-name',
    owners: [
      { name: 'a-very-long-username-indeed', kind: 'user' },
      { name: 'the-extraordinarily-long-organization-name', kind: 'org' },
    ],
  },
}
export const WithProfile: Story = { args: { displayName: 'Alice Anders' } }
export const ExtraAccountEntries: Story = {
  args: {
    extraAccount: [
      { id: 'support', label: 'Contact support' },
      { id: 'docs', label: 'Documentation', href: '/docs' },
    ],
  },
  play: openMenu('Account menu'),
}
export const InOrganization: Story = { args: { currentOwner: 'studio' } }
export const OwnerMenuOpen: Story = { play: openMenu('Switch owner') }
export const CreateMenuOpen: Story = { play: openMenu('Create') }
export const NavigationDrawerWithExtraContent: Story = {
  render: (args) => ({
    components: { PynTopBar },
    setup: () => ({ args }),
    template:
      '<PynTopBar v-bind="args"><template #drawer><p>Top repositories go here</p></template></PynTopBar>',
  }),
  play: openMenu('Open navigation'),
}
/** The rail drops its own account switcher: the top bar already has the owner switcher. */
export const NavigationDrawerWithRepositories: Story = {
  render: (args) => ({
    components: { PynTopBar, PynSideRail },
    setup: () => ({
      args,
      repos: ['game', 'tools', 'castle-quest'].map((name) => ({ owner: 'alice', name })),
    }),
    template: `<PynTopBar v-bind="args"><template #drawer><PynSideRail hide-account account="alice" :items="[{ id: 'home', label: 'Home', href: '/', icon: 'home' }]" current="home" :repos="repos" /></template></PynTopBar>`,
  }),
  play: openMenu('Open navigation'),
}
export const NarrowDrawerWithRepositories: Story = {
  ...NavigationDrawerWithRepositories,
  parameters: narrow,
}
export const AccountMenuOpen: Story = { args: { admin: true }, play: openMenu('Account menu') }
export const Narrow: Story = { parameters: narrow }
export const RepositoryPage: Story = { args: { currentOwner: 'studio', repo: 'castle-quest' } }
export const NarrowRepositoryPage: Story = {
  parameters: narrow,
  args: { currentOwner: 'studio', repo: 'castle-quest' },
}
export const BellOpen: Story = { play: openBell }
const bellEntries = [
  { id: 'n1', title: 'Two-factor authentication was reset', at: '2026-11-20T09:00:00Z' },
  {
    id: 'i1',
    kind: 'invitation' as const,
    title: 'Invitation to join acme',
    at: '2026-11-19T12:00:00Z',
  },
]
export const BellWithEntries: Story = {
  args: { notificationEntries: bellEntries, now: new Date('2026-11-20T12:00:00Z') },
  play: openBell,
}
export const NarrowBellWithEntries: Story = {
  args: { notificationEntries: bellEntries, now: new Date('2026-11-20T12:00:00Z') },
  parameters: narrow,
  play: openBell,
}
export const NarrowBellOpen: Story = { parameters: narrow, play: openBell }
export const NavigationDrawerOpen: Story = { play: openMenu('Open navigation') }
export const NarrowMenuOpen: Story = { parameters: narrow, play: openMenu('Open navigation') }
export const NarrowSearchOpen: Story = {
  parameters: narrow,
  play: openMenu('Search'),
}
export const NarrowSearchResults: Story = {
  args: { searchResults },
  parameters: narrow,
  play: async (ctx) => {
    await openMenu('Search')(ctx)
    const input = ctx.canvasElement.querySelector('input')!
    input.focus()
    input.value = 'co'
    input.dispatchEvent(new Event('input', { bubbles: true }))
    await tick()
  },
}
export const NarrowSignedOut: Story = {
  parameters: narrow,
  args: { signedOut: true, user: undefined },
  play: openMenu('Open navigation'),
}
export const SignedOutExploreOverride: Story = {
  args: { signedOut: true, user: undefined, hrefs: { explore: '/public' } },
}
export const NamedDestinations: Story = {
  args: { hrefs: { people: '/directory/people', orgs: '/directory/orgs' } },
  play: openMenu('Account menu'),
}
export const DuplicateExtraAccountShownOnce: Story = {
  args: {
    extraAccount: [
      { id: 'people', label: 'People', href: '/_/people' },
      { id: 'docs', label: 'Documentation', href: '/docs' },
    ],
  },
  play: openMenu('Account menu'),
}
export const NarrowExtraLinks: Story = {
  parameters: narrow,
  args: { extraLinks: [{ id: 'docs', label: 'Documentation', href: '/docs' }] },
  play: openMenu('Open navigation'),
}
