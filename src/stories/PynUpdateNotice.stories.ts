import type { Meta, StoryObj } from '@storybook/vue3'
import PynUpdateNotice from '../components/PynUpdateNotice.vue'

const meta: Meta<typeof PynUpdateNotice> = {
  title: 'Admin/PynUpdateNotice',
  component: PynUpdateNotice,
  args: {
    current: '0.1.2-alpha',
    latest: '0.1.3-alpha',
    url: 'https://github.com/avalon-initiative/pyn/releases/tag/v0.1.3-alpha',
  },
}
export default meta
type Story = StoryObj<typeof PynUpdateNotice>

export const Stable: Story = {}
export const Prerelease: Story = { args: { prerelease: true } }
export const NoUrl: Story = { args: { url: undefined } }
export const Dismissed: Story = {
  args: { onDismiss: () => undefined },
  play: ({ canvasElement }) => {
    canvasElement.querySelector('button')?.click()
  },
}
