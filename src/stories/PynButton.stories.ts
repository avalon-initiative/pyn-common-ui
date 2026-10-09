import type { Meta, StoryObj } from '@storybook/vue3'
import PynButton from '../components/PynButton.vue'

const meta: Meta<typeof PynButton> = {
  title: 'Pyn/Button',
  component: PynButton,
  args: { label: 'Check out' },
}
export default meta

type Story = StoryObj<typeof PynButton>

export const Primary: Story = { args: { variant: 'primary' } }
export const Secondary: Story = { args: { variant: 'secondary' } }
export const Danger: Story = { args: { variant: 'danger', label: 'Release lock' } }
export const Disabled: Story = { args: { disabled: true } }
