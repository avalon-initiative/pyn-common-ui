import type { Meta, StoryObj } from '@storybook/vue3'
import PynCommandBlock from '../components/PynCommandBlock.vue'

const meta: Meta<typeof PynCommandBlock> = {
  title: 'Browse/PynCommandBlock',
  component: PynCommandBlock,
  args: {
    label: 'commands',
    lines: [
      '# Get a work tree and publish a first commit',
      'pyn clone acme/game',
      'cd game',
      'pyn add .',
      'pyn commit -m "First commit"',
      'pyn push',
    ],
  },
}
export default meta
type Story = StoryObj<typeof PynCommandBlock>

export const Default: Story = {}
export const SingleCommand: Story = { args: { lines: ['pyn clone acme/game'] } }
