import type { Meta, StoryObj } from '@storybook/vue3'
import PynDiffView from '../components/PynDiffView.vue'
import { diffFiles, lockedBinary } from './diff-data'
import { now } from './landing-data'

const meta: Meta<typeof PynDiffView> = {
  title: 'Diff/PynDiffView',
  component: PynDiffView,
  parameters: { layout: 'padded' },
  args: { files: diffFiles, me: 'jamie', now, viewed: [], layout: 'unified' },
}
export default meta
type Story = StoryObj<typeof PynDiffView>

export const Unified: Story = {}
export const Split: Story = { args: { layout: 'split' } }
export const WithViewedFiles: Story = { args: { viewed: ['Cargo.lock', 'docs/levels.md'] } }
export const LockHeldByOther: Story = { args: { files: [lockedBinary('sam')] } }
export const LockHeldByMe: Story = { args: { files: [lockedBinary('jamie')] } }
export const Filtered: Story = { args: { filter: 'source' } }
export const NoMatches: Story = { args: { filter: 'zzz' } }
export const Empty: Story = { args: { files: [] } }
export const Loading: Story = { args: { loading: true } }
export const Failed: Story = { args: { error: 'Could not load the changes.' } }
export const Narrow: Story = {
  parameters: { viewport: { defaultViewport: 'mobile1' } },
  decorators: [() => ({ template: '<div style="width: 22rem"><story /></div>' })],
}
