import type { Meta, StoryObj } from '@storybook/vue3'
import PynStorageCapForm from '../components/PynStorageCapForm.vue'

const meta: Meta<typeof PynStorageCapForm> = {
  title: 'Usage/PynStorageCapForm',
  component: PynStorageCapForm,
  args: { cap: 10 * 1024 ** 3 },
}
export default meta
type Story = StoryObj<typeof PynStorageCapForm>

export const WithCap: Story = {}
export const NoCap: Story = { args: { cap: null } }
export const Busy: Story = { args: { busy: true } }
export const WithError: Story = { args: { error: 'Only the owner can change the cap.' } }
export const Readonly: Story = { args: { readonly: true } }
