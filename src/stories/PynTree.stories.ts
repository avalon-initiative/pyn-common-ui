import type { Meta, StoryObj } from '@storybook/vue3'
import PynTree from '../components/PynTree.vue'
import { now, rootEntries } from './landing-data'

const meta: Meta<typeof PynTree> = {
  title: 'Browse/PynTree',
  component: PynTree,
  args: { owner: 'acme', name: 'castle-quest', me: 'jamie', now },
}
export default meta
type Story = StoryObj<typeof PynTree>

export const Root: Story = { args: { entries: rootEntries } }
export const Empty: Story = { args: { entries: [] } }
export const OnBranch: Story = { args: { entries: rootEntries, branch: 'feature/levels' } }
export const NoLocks: Story = { args: { entries: rootEntries.slice(0, 5) } }
export const LongNames: Story = {
  args: {
    entries: [
      {
        ...rootEntries[3],
        name: 'A_Very_Long_File_Name_That_Keeps_Going_Past_The_Name_Column.uproject',
        last_change: {
          ...rootEntries[3].last_change!,
          message:
            'Rework the project settings so that the nightly build picks up the new plugin set and the long commit subject gets cut',
        },
      },
      ...rootEntries.slice(0, 2),
    ],
  },
}
