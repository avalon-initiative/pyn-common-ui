import { ref } from 'vue'
import type { Meta, StoryObj } from '@storybook/vue3'
import PynMultiSelect from '../components/PynMultiSelect.vue'
import { multiSelectLong, multiSelectOptions } from './multi-select-data'

const meta: Meta<typeof PynMultiSelect> = {
  title: 'Primitives/PynMultiSelect',
  component: PynMultiSelect,
  args: {
    options: multiSelectOptions,
    modelValue: [],
    label: 'Roles',
    placeholder: 'Add a role',
    filterPlaceholder: 'Filter roles',
    emptyLabel: 'No roles chosen',
    noResultsLabel: 'No roles match',
  },
  render: (args) => ({
    components: { PynMultiSelect },
    setup: () => ({ args, chosen: ref([...args.modelValue]) }),
    template: `<div style="max-width: 28rem; min-height: 22rem"><PynMultiSelect v-bind="args" v-model="chosen" /></div>`,
  }),
}
export default meta
type Story = StoryObj<typeof PynMultiSelect>

export const Empty: Story = {}
export const SomeChosen: Story = { args: { modelValue: ['read', 'write'] } }
export const ManyChosen: Story = {
  args: { modelValue: multiSelectOptions.map((o) => o.value) },
}
export const LongLabelsAndDescriptions: Story = {
  args: { options: multiSelectLong, modelValue: [multiSelectLong[0]!.value] },
}
export const Disabled: Story = { args: { modelValue: ['read'], disabled: true } }
export const InAForm: Story = {
  render: (args) => ({
    components: { PynMultiSelect },
    setup: () => ({ args, chosen: ref(['read']), name: ref('') }),
    template: `<form style="display: flex; flex-direction: column; gap: 1rem; max-width: 28rem; min-height: 24rem" @submit.prevent>
      <label style="display: flex; flex-direction: column; gap: 0.25rem">Team name<input v-model="name" /></label>
      <PynMultiSelect v-bind="args" id="roles-field" v-model="chosen" />
      <button type="submit">Save</button>
    </form>`,
  }),
}
