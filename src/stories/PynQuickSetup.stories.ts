import type { Meta, StoryObj } from '@storybook/vue3'
import PynQuickSetup from '../components/PynQuickSetup.vue'

const meta: Meta<typeof PynQuickSetup> = {
  title: 'Browse/PynQuickSetup',
  component: PynQuickSetup,
  args: {
    name: 'game',
    command: 'pyn clone acme/game',
    httpsUrl: 'https://pyn.example.com/acme/game.pyn',
  },
}
export default meta
type Story = StoryObj<typeof PynQuickSetup>

export const Default: Story = {}
export const SshNotSupported: Story = {
  play: ({ canvasElement }) =>
    canvasElement.querySelectorAll<HTMLButtonElement>('[role=tab]')[1]?.click(),
}
export const WithSshAddress: Story = {
  args: { sshUrl: 'ssh://git@pyn.example.com/acme/game.pyn' },
  play: SshNotSupported.play,
}
export const WithoutAddress: Story = { args: { httpsUrl: undefined } }
