import type { Meta, StoryObj } from '@storybook/vue3'
import PynAccessSessionList from '../components/PynAccessSessionList.vue'
import { accessSessions } from './access-session-data'

const meta: Meta<typeof PynAccessSessionList> = {
  title: 'Admin/PynAccessSessionList',
  component: PynAccessSessionList,
  args: { sessions: accessSessions },
}
export default meta
type Story = StoryObj<typeof PynAccessSessionList>

export const WithSessions: Story = {}
export const Empty: Story = { args: { sessions: [] } }
export const JustStarted: Story = {
  args: { started: { secret: 'pyn_as_7c1d9e04b2f64a', info: accessSessions[0] } },
}
export const Refused: Story = { args: { error: 'the session already ended' } }
