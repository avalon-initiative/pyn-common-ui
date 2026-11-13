import type { Meta, StoryObj } from '@storybook/vue3'
import PynVersionFooter from '../components/PynVersionFooter.vue'

const meta: Meta<typeof PynVersionFooter> = {
  title: 'Shell/PynVersionFooter',
  component: PynVersionFooter,
}
export default meta
type Story = StoryObj<typeof PynVersionFooter>

export const Matching: Story = { args: { webVersion: '0.1.2', serverVersion: '0.1.2' } }
export const WithRevisions: Story = {
  args: {
    webVersion: '0.1.2',
    serverVersion: '0.1.2',
    webRevision: '9e60ad5',
    serverRevision: 'b41c0de',
  },
}
export const Mismatch: Story = { args: { webVersion: '0.1.2', serverVersion: '0.2.0' } }
export const ServerUnknown: Story = { args: { webVersion: '0.1.2' } }
