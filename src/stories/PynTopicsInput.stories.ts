import type { Meta, StoryObj } from '@storybook/vue3'
import { ref } from 'vue'
import PynTopicsInput from '../components/PynTopicsInput.vue'

const meta: Meta<typeof PynTopicsInput> = {
  title: 'Forms/PynTopicsInput',
  component: PynTopicsInput,
  render: (args) => ({
    components: { PynTopicsInput },
    setup: () => ({ args, topics: ref<string[]>(args.modelValue ?? []) }),
    template:
      '<div style="max-width: 40rem"><PynTopicsInput v-bind="args" v-model="topics" /></div>',
  }),
}
export default meta
type Story = StoryObj<typeof PynTopicsInput>

export const Empty: Story = { args: { optional: true } }
export const WithTopics: Story = { args: { modelValue: ['unreal', 'game-development', 'rust'] } }
export const ServerError: Story = {
  args: { modelValue: ['rust'], error: 'invalid topic "c++": 1 to 50 lowercase letters' },
}
export const Full: Story = { args: { modelValue: ['a', 'b', 'c'], max: 3 } }
export const Disabled: Story = { args: { modelValue: ['rust'], disabled: true } }
