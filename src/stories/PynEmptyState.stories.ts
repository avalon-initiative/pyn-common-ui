import type { Meta, StoryObj } from '@storybook/vue3'
import PynEmptyState from '../components/PynEmptyState.vue'
import PynIcon from '../components/PynIcon.vue'

const meta: Meta<typeof PynEmptyState> = {
  title: 'Primitives/PynEmptyState',
  component: PynEmptyState,
  args: {
    title: 'No repositories yet',
    description:
      'Create a repository to start tracking files and locking the ones that cannot be merged.',
  },
}
export default meta
type Story = StoryObj<typeof PynEmptyState>

export const TextOnly: Story = {}
export const WithPrimaryAction: Story = {
  args: { primaryLabel: 'New repository', primaryHref: '/_/new' },
}
export const WithBothActions: Story = {
  args: {
    primaryLabel: 'New repository',
    primaryHref: '/_/new',
    secondaryLabel: 'Read the guide',
    secondaryHref: '/docs',
  },
}
export const EventActions: Story = {
  args: { primaryLabel: 'Add a person', secondaryLabel: 'Learn more' },
}
export const WithCommands: Story = {
  args: {
    title: 'This repository is empty',
    description: 'Create a new repository on the command line:',
    commands: ['pyn init', 'pyn add .', 'pyn commit -m "First commit"', 'pyn push'],
  },
}
export const WithIcon: Story = {
  args: { primaryLabel: 'New repository', primaryHref: '/_/new' },
  render: (args) => ({
    components: { PynEmptyState, PynIcon },
    setup: () => ({ args }),
    template: `<PynEmptyState v-bind="args"><template #icon><PynIcon name="repo" /></template></PynEmptyState>`,
  }),
}
export const Bordered: Story = {
  args: { primaryLabel: 'New repository', primaryHref: '/_/new' },
  render: (args) => ({
    components: { PynEmptyState, PynIcon },
    setup: () => ({ args }),
    template: `<div style="max-width: 48rem"><PynEmptyState v-bind="args"><template #icon><PynIcon name="repo" /></template></PynEmptyState></div>`,
  }),
}
export const InACard: Story = {
  args: { primaryLabel: 'New repository', primaryHref: '/_/new' },
  render: (args) => ({
    components: { PynEmptyState },
    setup: () => ({ args }),
    template: `<div style="max-width: 32rem; border: 1px solid var(--pyn-border); border-radius: var(--pyn-radius); background: var(--pyn-surface)"><PynEmptyState v-bind="args" /></div>`,
  }),
}
export const CompactInAList: Story = {
  args: {
    compact: true,
    headingLevel: 3,
    title: 'No locks held',
    description: 'Files you check out show up here.',
  },
  render: (args) => ({
    components: { PynEmptyState },
    setup: () => ({ args }),
    template: `<ul style="max-width: 32rem; margin: 0; padding: 0; list-style: none; border: 1px solid var(--pyn-border); border-radius: var(--pyn-radius)"><li><PynEmptyState v-bind="args" /></li></ul>`,
  }),
}

const kindStory = (kind: 'empty' | 'unsupported' | 'wip'): Story => ({
  args: { kind, title: undefined, description: undefined },
})
export const KindEmpty: Story = kindStory('empty')
export const KindUnsupported: Story = kindStory('unsupported')
export const KindWorkInProgress: Story = kindStory('wip')
export const KindOverridden: Story = {
  args: {
    kind: 'wip',
    title: 'Notifications are coming',
    description: 'Mentions and lock requests will be listed here.',
    icon: 'bell',
  },
}
export const KindWithAction: Story = {
  args: {
    kind: 'empty',
    title: undefined,
    description: undefined,
    primaryLabel: 'New repository',
    primaryHref: '/_/new',
  },
}
export const KindInAPanel: Story = {
  args: { kind: 'unsupported', title: 'Tags are not supported yet', description: undefined },
  render: (args) => ({
    components: { PynEmptyState },
    setup: () => ({ args }),
    template: `<div style="max-width: 64rem"><PynEmptyState v-bind="args" /></div>`,
  }),
}
