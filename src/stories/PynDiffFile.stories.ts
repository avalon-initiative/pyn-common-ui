import type { Meta, StoryObj } from '@storybook/vue3'
import PynDiffFile from '../components/PynDiffFile.vue'
import { addedFile, binaryFile, lockedBinary, lockfile, renamedFile, sourceFile } from './diff-data'
import { now } from './landing-data'

const meta: Meta<typeof PynDiffFile> = {
  title: 'Diff/PynDiffFile',
  component: PynDiffFile,
  parameters: { layout: 'padded' },
  args: { file: sourceFile, now, me: 'jamie' },
}
export default meta
type Story = StoryObj<typeof PynDiffFile>

export const Unified: Story = {}
export const Split: Story = { args: { layout: 'split' } }
export const WithExpandControls: Story = { args: { file: lockfile } }
export const Added: Story = { args: { file: addedFile } }
export const Renamed: Story = { args: { file: renamedFile } }
export const Binary: Story = { args: { file: binaryFile } }
export const LockHeldByOther: Story = { args: { file: lockedBinary('sam') } }
export const Viewed: Story = { args: { viewed: true, collapsed: true } }
