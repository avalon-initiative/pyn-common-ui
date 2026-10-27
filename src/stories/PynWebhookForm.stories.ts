import { ref } from 'vue'
import type { Meta, StoryObj } from '@storybook/vue3'
import PynDrawer from '../components/PynDrawer.vue'
import PynWebhookForm from '../components/PynWebhookForm.vue'
import PynWebhooks from '../components/PynWebhooks.vue'
import { webhooks } from './webhook-data'

const meta: Meta<typeof PynWebhookForm> = {
  title: 'Repository/PynWebhookForm',
  component: PynWebhookForm,
}
export default meta
type Story = StoryObj<typeof PynWebhookForm>

export const Default: Story = {}
export const Busy: Story = { args: { busy: true } }
export const Failed: Story = {
  args: { error: 'url must use https (this server does not allow http)' },
}
export const SecretRevealed: Story = { args: { secret: 'whsec_3f9c1d7a5b2e4c80' } }

export const InDrawer: Story = {
  render: () => ({
    components: { PynWebhooks, PynDrawer, PynWebhookForm },
    setup: () => {
      const open = ref(false)
      const secret = ref<string>()
      return { webhooks, open, secret }
    },
    template: `<div>
      <PynWebhooks :webhooks="webhooks" @create="open = true" />
      <PynDrawer :open="open" title="New webhook" @close="open = false; secret = undefined">
        <PynWebhookForm
          :secret="secret"
          @submit="secret = 'whsec_3f9c1d7a5b2e4c80'"
          @cancel="open = false"
          @dismiss="open = false; secret = undefined"
        />
      </PynDrawer>
    </div>`,
  }),
}
