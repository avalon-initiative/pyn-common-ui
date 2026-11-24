import type { Meta, StoryObj } from '@storybook/vue3'
import PynLockedFiles from '../components/PynLockedFiles.vue'
import { now, summary } from './landing-data'

const meta: Meta<typeof PynLockedFiles> = {
  title: 'Browse/PynLockedFiles',
  component: PynLockedFiles,
  args: { owner: 'acme', name: 'castle-quest', locks: summary.locks, me: 'jamie', now },
}
export default meta
type Story = StoryObj<typeof PynLockedFiles>

export const Default: Story = {}
export const None: Story = { args: { locks: [] } }
export const NextToExpire: Story = {
  args: {
    locks: Array.from({ length: 8 }, (_, i) => ({
      ...summary.locks[0]!,
      path: `Content/Maps/Level${i + 1}.umap`,
      expires_at: new Date(now.getTime() + (8 - i) * 45 * 60_000).toISOString(),
    })),
  },
}
