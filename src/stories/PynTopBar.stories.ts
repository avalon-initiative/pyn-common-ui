import type { Meta, StoryObj } from '@storybook/vue3'
import PynTopBar from '../components/PynTopBar.vue'
import { owners } from './dashboard-data'

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
export const AccountMenuOpen: Story = { args: { admin: true }, play: openMenu('Account menu') }
export const Narrow: Story = { parameters: narrow }
export const NarrowMenuOpen: Story = { parameters: narrow, play: openMenu('Main menu') }
export const NarrowSearchOpen: Story = {
  parameters: narrow,
  play: openMenu('Search'),
}
export const NarrowSignedOut: Story = {
  parameters: narrow,
  args: { signedOut: true, user: undefined },
  play: openMenu('Main menu'),
}
