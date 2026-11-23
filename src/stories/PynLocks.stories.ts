import type { Meta, StoryObj } from '@storybook/vue3'
import PynLocks from '../components/PynLocks.vue'
import { bobIdentity } from './person-data'

const meta: Meta<typeof PynLocks> = {
  title: 'Repository/PynLocks',
  component: PynLocks,
}
export default meta
type Story = StoryObj<typeof PynLocks>

const now = new Date('2026-10-08T12:00:00Z')
const locks = [
  {
    path: 'Content/Maps/Main.umap',
    owner: 'bob',
    acquired_at: '2026-10-08T09:00:00Z',
    expires_at: '2026-10-08T15:42:00Z',
  },
  {
    path: 'Content/Art/Hero.psd',
    owner: 'carol',
    acquired_at: '2026-10-08T10:00:00Z',
    expires_at: '2026-10-08T12:12:00Z',
  },
]

export const Locked: Story = { args: { locks, now } }
export const WithForceUnlock: Story = { args: { locks, now, canForce: true } }
export const None: Story = { args: { locks: [], now } }

export const WithIdentities: Story = {
  args: { locks: locks.map((l, i) => (i === 0 ? { ...l, identity: bobIdentity } : l)), now },
}

export const LongPaths: Story = {
  args: {
    canForce: true,
    now,
    locks: [
      { ...locks[0], path: 'Content/Characters/Heroes/Knight/Animations/Knight_Idle_01.uasset' },
      { ...locks[1], path: 'Content/Enemies/Boss.uasset' },
    ],
  },
}
