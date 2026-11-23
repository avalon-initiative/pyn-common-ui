import type { Meta, StoryObj } from '@storybook/vue3'
import PynLoading from '../components/PynLoading.vue'

const meta: Meta<typeof PynLoading> = {
  title: 'Primitives/PynLoading',
  component: PynLoading,
}
export default meta
type Story = StoryObj<typeof PynLoading>

export const Inline: Story = {}
export const Compact: Story = { args: { variant: 'compact', label: 'Loading activity' } }
export const Block: Story = { args: { variant: 'block', label: 'Loading files' } }
export const InACard: Story = {
  args: { variant: 'compact' },
  render: (args) => ({
    components: { PynLoading },
    setup: () => ({ args }),
    template: `<div style="max-width: 20rem; padding: 1rem; border: 1px solid var(--pyn-border); border-radius: var(--pyn-radius); background: var(--pyn-surface)"><PynLoading v-bind="args" /></div>`,
  }),
}
export const BlockNarrow: Story = {
  args: { variant: 'block' },
  parameters: { viewport: { defaultViewport: 'mobile1' } },
}
