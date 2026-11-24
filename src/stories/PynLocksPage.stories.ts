import type { Meta, StoryObj } from '@storybook/vue3'
import PynLocksPage from '../components/PynLocksPage.vue'
import { lockRowFromMine } from '../state/locks-page.state'
import { locksPageLocks, locksPageNow } from './locks-page-data'

const hrefs = {
  all: '/alice/game/locks',
  mine: '/alice/game/locks/mine',
  expiring: '/alice/game/locks/expiring',
  stale: '/alice/game/locks/stale',
}
const meta: Meta<typeof PynLocksPage> = {
  title: 'Repository/PynLocksPage',
  component: PynLocksPage,
  args: { locks: locksPageLocks, now: locksPageNow, me: 'alice', hrefs },
}
export default meta
type Story = StoryObj<typeof PynLocksPage>

export const Default: Story = {}
export const AdminCanForce: Story = { args: { canForce: true } }
export const Mine: Story = { args: { view: 'mine' } }
export const ExpiringSoon: Story = { args: { view: 'expiring' } }
export const Stale: Story = { args: { view: 'stale', canForce: true } }
export const SignedOut: Story = { args: { me: undefined } }
export const Searching: Story = { args: { query: 'art' } }
export const NoMatches: Story = { args: { query: 'zzz' } }
export const Empty: Story = { args: { locks: [] } }
export const Loading: Story = { args: { loading: true } }
export const Failed: Story = { args: { error: 'Could not load locks.' } }
export const ReleaseFailed: Story = {
  args: {
    locks: locksPageLocks.map((l, i) =>
      i === 0 ? { ...l, error: 'The lock changed hands before it could be released.' } : l,
    ),
  },
}
export const Personal: Story = {
  args: {
    title: 'Your locks',
    locks: [
      lockRowFromMine(
        {
          owner: 'studio',
          name: 'game',
          path: 'Content/Maps/Main.umap',
          acquired_at: '2026-11-22T09:00:00Z',
          expires_at: '2026-11-22T15:42:00Z',
        },
        'alice',
      ),
      lockRowFromMine(
        {
          owner: 'studio',
          name: 'trailer',
          path: 'Edit/Cut-3.prproj',
          acquired_at: '2026-11-22T11:00:00Z',
          expires_at: '2026-11-22T12:20:00Z',
        },
        'alice',
      ),
    ],
  },
}
export const PersonalBulk: Story = { args: { ...Personal.args, bulk: true } }
export const BulkInRepository: Story = { args: { bulk: true, canForce: true } }
export const Mobile: Story = {
  args: { canForce: true },
  parameters: { viewport: { defaultViewport: 'mobile1' } },
}
export const PersonalMobile: Story = {
  args: { ...Personal.args, bulk: true },
  parameters: { viewport: { defaultViewport: 'mobile1' } },
}
