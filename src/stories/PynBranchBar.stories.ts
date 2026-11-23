import type { Meta, StoryObj } from '@storybook/vue3'
import PynBranchBar from '../components/PynBranchBar.vue'
import PynBreadcrumb from '../components/PynBreadcrumb.vue'
import PynCloneMenu from '../components/PynCloneMenu.vue'

const meta: Meta<typeof PynBranchBar> = {
  title: 'Browse/PynBranchBar',
  component: PynBranchBar,
  args: {
    branch: 'main',
    files: 128,
    updatedAt: '2026-10-08T10:00:00Z',
    now: new Date('2026-10-08T12:00:00Z'),
  },
}
export default meta
type Story = StoryObj<typeof PynBranchBar>

export const Default: Story = {}
export const Empty: Story = { args: { files: 0, updatedAt: null } }

export const Toolbar: Story = {
  args: {
    files: undefined,
    updatedAt: undefined,
    branchesHref: '/studio/game/branches',
    branchCount: 3,
    branches: [
      { name: 'main', isDefault: true, updatedAt: '2026-10-08T10:00:00Z' },
      { name: 'feature/rig-update', updatedAt: '2026-10-05T09:30:00Z' },
    ],
  },
  render: (args) => ({
    components: { PynBranchBar, PynBreadcrumb, PynCloneMenu },
    setup: () => ({ args, crumbs: [{ label: 'game', href: '/studio/game' }, { label: 'assets' }] }),
    template: `<div style="min-height: 18rem"><PynBranchBar v-bind="args">
      <PynBreadcrumb :crumbs="crumbs" />
      <template #actions><PynCloneMenu https-url="https://pyn.example.com/studio/game.pyn" command="pyn clone studio/game" /></template>
    </PynBranchBar></div>`,
  }),
}
export const CountPending: Story = {
  args: { ...Toolbar.args, branchCount: undefined },
  render: Toolbar.render,
}
