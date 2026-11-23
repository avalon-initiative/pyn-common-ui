import { ref } from 'vue'
import type { Meta, StoryObj } from '@storybook/vue3'
import PynDrawer from '../components/PynDrawer.vue'
import PynWebhookDetail from '../components/PynWebhookDetail.vue'
import PynWebhooks from '../components/PynWebhooks.vue'
import { deliveries, eventTypeOptions, webhooks } from './webhook-data'

const meta: Meta<typeof PynWebhookDetail> = {
  title: 'Repository/PynWebhookDetail',
  component: PynWebhookDetail,
}
export default meta
type Story = StoryObj<typeof PynWebhookDetail>

const base = { webhook: webhooks[0], deliveries, canRedeliver: true }
const edit = ({ canvasElement }: { canvasElement: HTMLElement }) =>
  [...canvasElement.querySelectorAll('button')]
    .find((b) => b.textContent?.trim() === 'Edit')
    ?.click()

export const Default: Story = { args: base }
export const EditWithEventTypes: Story = {
  args: { ...base, eventTypeOptions },
  play: edit,
}
export const UnknownStoredType: Story = {
  args: {
    ...base,
    webhook: { ...webhooks[0], event_types: ['lock.acquired', 'repo.archived'] },
    eventTypeOptions,
  },
  play: edit,
}
export const Rotating: Story = { args: { ...base, webhook: webhooks[1] } }
export const SecretRevealed: Story = { args: { ...base, secret: 'whsec_3f9c1d7a5b2e4c80' } }
export const Busy: Story = { args: { ...base, busy: true } }
export const Failed: Story = { args: { ...base, error: 'could not save the webhook' } }
export const NoDeliveries: Story = { args: { ...base, deliveries: [] } }

export const InDrawer: Story = {
  render: () => ({
    components: { PynWebhooks, PynDrawer, PynWebhookDetail },
    setup: () => {
      const selectedId = ref<string>()
      return { webhooks, deliveries, selectedId }
    },
    template: `<div>
      <PynWebhooks :webhooks="webhooks" :selected-id="selectedId" @select="selectedId = $event" />
      <PynDrawer :open="!!selectedId" title="Webhook" @close="selectedId = undefined">
        <PynWebhookDetail
          v-if="selectedId"
          :webhook="webhooks.find((w) => w.id === selectedId)!"
          :deliveries="deliveries"
          can-redeliver
        />
      </PynDrawer>
    </div>`,
  }),
}
