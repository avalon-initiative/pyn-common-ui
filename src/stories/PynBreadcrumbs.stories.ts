import type { Meta, StoryObj } from '@storybook/vue3'
import PynBreadcrumbs from '../components/PynBreadcrumbs.vue'
import PynRepoShell from '../components/PynRepoShell.vue'
import PynShell from '../components/PynShell.vue'
import PynTopBar from '../components/PynTopBar.vue'
import { repoShellTabs } from '../state/repo.state'

const meta: Meta<typeof PynBreadcrumbs> = {
  title: 'Shell/PynBreadcrumbs',
  component: PynBreadcrumbs,
}
export default meta
type Story = StoryObj<typeof PynBreadcrumbs>

const short = [
  { label: 'Home', href: '/' },
  { label: 'Account settings', href: '/_/settings' },
  { label: 'SSH keys' },
]
const long = [
  { label: 'Home', href: '/' },
  { label: 'acme', href: '/acme' },
  { label: 'castle-quest', href: '/acme/castle-quest' },
  { label: 'Code', href: '/acme/castle-quest' },
  { label: 'Config', href: '/acme/castle-quest/tree/Config' },
  { label: 'DefaultGame.ini' },
]

export const ShortTrail: Story = { args: { items: short } }
export const LongTrail: Story = { args: { items: long } }
/** Narrow viewport: the ellipsis control reveals the hidden items. */
export const Collapsed: Story = {
  args: { items: long },
  parameters: { viewport: { defaultViewport: 'mobile1' } },
}
export const SingleItemRendersNothing: Story = { args: { items: [{ label: 'Home' }] } }

export const InRepositoryShell: StoryObj = {
  parameters: { layout: 'fullscreen' },
  render: () => ({
    components: { PynShell, PynTopBar, PynRepoShell },
    setup: () => ({
      tabs: repoShellTabs(['read'], false),
      trail: long.slice(0, 4).concat([{ label: 'Locks' }]),
    }),
    template: `
      <PynShell bare :breadcrumbs="trail">
        <template #top><PynTopBar user="alice" theme="system" /></template>
        <PynRepoShell owner="acme" name="castle-quest" visibility="private" :tabs="tabs" current="locks"><p>Page content</p></PynRepoShell>
      </PynShell>`,
  }),
}
