import type { Meta, StoryObj } from '@storybook/vue3'
import PynSecretReveal from '../components/PynSecretReveal.vue'
import { failCopy } from './copy-failure'

const meta: Meta<typeof PynSecretReveal> = {
  title: 'Webhooks/PynSecretReveal',
  component: PynSecretReveal,
}
export default meta
type Story = StoryObj<typeof PynSecretReveal>

export const Default: Story = { args: { secret: 'whsec_3f9c1d7a5b2e4c80' } }
export const CopyFailed: Story = {
  args: { secret: 'whsec_3f9c1d7a5b2e4c80' },
  play: ({ canvasElement }) => failCopy(canvasElement, 'Copy'),
}
