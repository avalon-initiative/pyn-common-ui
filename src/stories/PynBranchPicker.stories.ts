import type { Meta, StoryObj } from '@storybook/vue3'
import PynBranchBar from '../components/PynBranchBar.vue'
import PynBranchPicker from '../components/PynBranchPicker.vue'

const meta: Meta<typeof PynBranchPicker> = {
  title: 'Browse/PynBranchPicker',
  component: PynBranchPicker,
  args: {
    current: 'main',
    now: new Date('2026-10-08T12:00:00Z'),
    branches: [
      { name: 'main', isDefault: true, updatedAt: '2026-10-08T10:00:00Z' },
      { name: 'feature/rig-update', updatedAt: '2026-10-05T09:30:00Z' },
      { name: 'release/1.0', updatedAt: '2026-09-20T16:00:00Z' },
      { name: 'wip/no-commits-yet', updatedAt: null },
    ],
  },
}
export default meta
type Story = StoryObj<typeof PynBranchPicker>

const tick = () => new Promise((resolve) => setTimeout(resolve))

async function open(root: HTMLElement) {
  root.querySelector('button')!.click()
  await tick()
}

export const Closed: Story = {}
export const Open: Story = { play: ({ canvasElement }) => open(canvasElement) }
export const OnAnotherBranch: Story = {
  args: { current: 'feature/rig-update' },
  play: ({ canvasElement }) => open(canvasElement),
}
export const Loading: Story = {
  args: { loading: true },
  play: ({ canvasElement }) => open(canvasElement),
}
export const Failed: Story = {
  args: { error: 'Could not load the branches.' },
  play: ({ canvasElement }) => open(canvasElement),
}
export const OnlyDefault: Story = {
  args: { branches: [{ name: 'main', isDefault: true, updatedAt: '2026-10-08T10:00:00Z' }] },
  play: ({ canvasElement }) => open(canvasElement),
}

export const WithBranchBar: Story = {
  render: (args) => ({
    components: { PynBranchBar, PynBranchPicker },
    setup: () => ({ args }),
    template: `<div style="display: flex; flex-direction: column; gap: 1rem; min-height: 22rem">
      <PynBranchPicker v-bind="args" />
      <PynBranchBar :branch="args.current" :files="128" updated-at="2026-10-08T10:00:00Z" :now="args.now" />
    </div>`,
  }),
}
