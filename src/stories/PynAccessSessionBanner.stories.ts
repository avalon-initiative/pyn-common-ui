import type { Meta, StoryObj } from '@storybook/vue3'
import PynAccessSessionBanner from '../components/PynAccessSessionBanner.vue'
import { accessSessions } from './access-session-data'

const meta: Meta<typeof PynAccessSessionBanner> = {
  title: 'Account/PynAccessSessionBanner',
  component: PynAccessSessionBanner,
}
export default meta
type Story = StoryObj<typeof PynAccessSessionBanner>

export const Active: Story = { args: { sessions: accessSessions } }
export const NoneActive: Story = { args: { sessions: accessSessions.slice(1) } }
