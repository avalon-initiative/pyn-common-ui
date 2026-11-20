import type { Meta, StoryObj } from '@storybook/vue3'
import PynAccessSessionHistory from '../components/PynAccessSessionHistory.vue'
import { accessSessions } from './access-session-data'

const meta: Meta<typeof PynAccessSessionHistory> = {
  title: 'Account/PynAccessSessionHistory',
  component: PynAccessSessionHistory,
}
export default meta
type Story = StoryObj<typeof PynAccessSessionHistory>

export const WithSessions: Story = { args: { sessions: accessSessions } }
export const Empty: Story = { args: { sessions: [] } }
