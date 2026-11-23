import type { Meta, StoryObj } from '@storybook/vue3'
import PynMenu from '../components/PynMenu.vue'

const meta: Meta<typeof PynMenu> = {
  title: 'Shell/PynMenu',
  component: PynMenu,
  render: (args) => ({
    components: { PynMenu },
    setup: () => ({ args }),
    template: '<div style="min-height: 14rem"><PynMenu v-bind="args">Menu</PynMenu></div>',
  }),
}
export default meta
const tick = () => new Promise((resolve) => setTimeout(resolve))
const open = async (ctx: { canvasElement: HTMLElement }) => {
  ctx.canvasElement.querySelector<HTMLElement>('button[aria-haspopup]')!.click()
  await tick()
}
type Story = StoryObj<typeof PynMenu>

export const Links: Story = {
  args: { label: 'Create', items: [{ id: 'new', label: 'New repository', href: '/_/new' }] },
}
export const Choices: Story = {
  args: {
    label: 'Theme',
    items: [
      { id: 'light', label: 'Light', checked: false },
      { id: 'dark', label: 'Dark', checked: true },
    ],
  },
}

export const LinksOpen: Story = {
  args: {
    label: 'Create',
    align: 'start',
    items: [
      { id: 'h', label: 'Create', heading: true },
      { id: 'repo', label: 'New repository', href: '/_/new' },
      { id: 'org', label: 'New organization', href: '/_/orgs/new' },
      { id: 's', label: '', separator: true },
      { id: 'imp', label: 'Import repository', href: '/_/import' },
    ],
  },
  play: open,
}

export const ChoicesOpen: Story = {
  args: { ...Choices.args, label: 'Theme' },
  play: open,
}

export const WithHeaderAndFooter: Story = {
  args: { label: 'Account', items: [{ id: 'p', label: 'Your profile', href: '/alice' }] },
  render: (args) => ({
    components: { PynMenu },
    setup: () => ({ args }),
    template: `<div style="min-height: 14rem"><PynMenu v-bind="args">Menu
      <template #header><p style="margin:0;padding:8px 16px">Signed in as <strong>alice</strong></p></template>
      <template #footer>Footer note</template></PynMenu></div>`,
  }),
  play: open,
}
