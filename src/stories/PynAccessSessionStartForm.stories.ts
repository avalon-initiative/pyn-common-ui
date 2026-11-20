import type { Meta, StoryObj } from '@storybook/vue3'
import PynAccessSessionStartForm from '../components/PynAccessSessionStartForm.vue'

const meta: Meta<typeof PynAccessSessionStartForm> = {
  title: 'Admin/PynAccessSessionStartForm',
  component: PynAccessSessionStartForm,
  args: { user: 'alice' },
}
export default meta
type Story = StoryObj<typeof PynAccessSessionStartForm>

export const Default: Story = {}
export const Busy: Story = { args: { busy: true } }
export const Refused: Story = {
  args: { error: 'an administrator cannot act as another administrator' },
}
