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
export const WithViewAll: Story = {
  args: { allHref: '/acme/castle-quest/branches' },
  play: ({ canvasElement }) => open(canvasElement),
}
export const TagsTab: Story = {
  args: { allHref: '/acme/castle-quest/branches' },
  play: async ({ canvasElement }) => {
    await open(canvasElement)
    canvasElement.querySelector<HTMLButtonElement>('[data-tab=tags]')!.click()
    await tick()
  },
}
const tags = [
  { name: 'v0.2.0', createdAt: '2026-10-07T09:00:00Z' },
  { name: 'v0.1.1', createdAt: '2026-09-02T12:00:00Z' },
  { name: 'v0.1.0', createdAt: '2026-08-28T12:00:00Z' },
]
async function openTags(root: HTMLElement) {
  await open(root)
  root.querySelector<HTMLButtonElement>('[data-tab=tags]')!.click()
  await tick()
}
export const WithTags: Story = {
  args: { tags, allHref: '/acme/castle-quest/branches', tagsHref: '/acme/castle-quest/tags' },
  play: ({ canvasElement }) => openTags(canvasElement),
}
export const OnATag: Story = {
  args: { ...WithTags.args, current: 'v0.1.1', currentKind: 'tag' },
  play: ({ canvasElement }) => open(canvasElement),
}
export const NoTags: Story = {
  args: { tags: [], tagsHref: '/acme/castle-quest/tags' },
  play: ({ canvasElement }) => openTags(canvasElement),
}
export const TagsLoading: Story = {
  args: { tags: [], tagsLoading: true },
  play: ({ canvasElement }) => openTags(canvasElement),
}
export const Creatable: Story = {
  args: { creatable: true, allHref: '/acme/castle-quest/branches' },
  play: async ({ canvasElement }) => {
    await open(canvasElement)
    const input = canvasElement.querySelector('input')!
    input.value = 'feature/new-level'
    input.dispatchEvent(new Event('input'))
    await tick()
  },
}
export const OnAnotherBranch: Story = {
  args: { current: 'feature/rig-update' },
  play: ({ canvasElement }) => open(canvasElement),
}
export const LongBranchName: Story = {
  args: { current: 'feature/a-very-long-branch-name-that-keeps-going-and-going' },
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

const toolbar = (args: object) => ({
  components: { PynBranchBar, PynBranchPicker },
  setup: () => ({ args }),
  template: `<div style="display: flex; align-items: center; gap: 1rem">
    <PynBranchPicker v-bind="args" />
    <span data-neighbour>128 files</span>
  </div>`,
})

export const InToolbar: Story = { render: toolbar }
export const InToolbarLongName: Story = {
  args: { current: 'feature/a-very-long-branch-name-that-keeps-going-and-going' },
  render: toolbar,
}
export const WithButtons: Story = {
  args: { newBranchButton: true, searchButton: true },
}
