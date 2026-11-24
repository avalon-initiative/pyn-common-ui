import type { Meta, StoryObj } from '@storybook/vue3'
import PynCloneMenu from '../components/PynCloneMenu.vue'

const meta: Meta<typeof PynCloneMenu> = {
  title: 'Shell/PynCloneMenu',
  component: PynCloneMenu,
  args: { httpsUrl: 'https://pyn.example.com/acme/game.pyn', command: 'pyn clone acme/game' },
  render: (args) => ({
    components: { PynCloneMenu },
    setup: () => ({ args }),
    template:
      '<div style="min-height: 18rem; display: flex; justify-content: flex-end"><PynCloneMenu v-bind="args" /></div>',
  }),
  play: ({ canvasElement }) => canvasElement.querySelector('button')?.click(),
}
export default meta
type Story = StoryObj<typeof PynCloneMenu>

export const Default: Story = {}
export const WithSsh: Story = { args: { sshUrl: 'ssh://git@pyn.example.com/acme/game.pyn' } }
export const SshAndDownload: Story = {
  args: {
    sshUrl: 'ssh://git@pyn.example.com/acme/game.pyn',
    sshCommand: 'pyn clone ssh://git@pyn.example.com/acme/game.pyn',
    downloadZip: true,
  },
}
export const Neutral: Story = { args: { variant: 'default', label: 'Clone' } }
