import type { Meta, StoryObj } from '@storybook/vue3'
import { ref } from 'vue'
import PynPolicyConflictNotice from '../components/PynPolicyConflictNotice.vue'
import PynPolicyEditor from '../components/PynPolicyEditor.vue'

const toml = `[[rule]]
path = "**"
mode = "shared"

[[rule]]
path = "assets/**/*.psd"
mode = "exclusive"
`

const meta: Meta<typeof PynPolicyEditor> = {
  title: 'Policy/PynPolicyEditor',
  component: PynPolicyEditor,
  args: { text: toml, headRevision: 42 },
  render: (args) => ({
    components: { PynPolicyEditor },
    setup: () => ({ args, text: ref(args.text) }),
    template: '<PynPolicyEditor v-bind="args" v-model:text="text" />',
  }),
}
export default meta
type Story = StoryObj<typeof PynPolicyEditor>

export const Clean: Story = {}
export const Dirty: Story = { args: { dirty: true } }
export const Saving: Story = { args: { dirty: true, saving: true } }
export const ReadOnly: Story = { args: { readonly: true } }
export const Disabled: Story = { args: { disabled: true } }
export const InvalidLines: Story = { args: { dirty: true, problemLines: [6] } }
export const WithNotice: Story = {
  args: { dirty: true },
  render: (args) => ({
    components: { PynPolicyEditor, PynPolicyConflictNotice },
    setup: () => ({ args, text: ref(args.text) }),
    template: `<PynPolicyEditor v-bind="args" v-model:text="text">
      <template #notice><PynPolicyConflictNotice kind="lock_held" holder="wendy" /></template>
    </PynPolicyEditor>`,
  }),
}
