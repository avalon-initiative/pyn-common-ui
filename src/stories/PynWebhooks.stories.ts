import type { Meta, StoryObj } from '@storybook/vue3'
import PynWebhooks from '../components/PynWebhooks.vue'
import { webhooks } from './webhook-data'

const meta: Meta<typeof PynWebhooks> = {
  title: 'Repository/PynWebhooks',
  component: PynWebhooks,
}
export default meta
type Story = StoryObj<typeof PynWebhooks>

export const Default: Story = { args: { webhooks } }
export const Selected: Story = { args: { webhooks, selectedId: webhooks[1].id } }
export const Loading: Story = { args: { webhooks: [], loading: true } }
export const Empty: Story = { args: { webhooks: [] } }
export const Refused: Story = { args: { webhooks: [], error: 'not allowed to view webhooks' } }
