import { ref } from 'vue'
import type { Meta, StoryObj } from '@storybook/vue3'
import PynCommandPalette from '../components/PynCommandPalette.vue'
import { commandItems, manyItems } from './command-palette-data'

const meta: Meta<typeof PynCommandPalette> = {
  title: 'Primitives/PynCommandPalette',
  component: PynCommandPalette,
}
export default meta
type Story = StoryObj<typeof PynCommandPalette>

const render: Story['render'] = (args) => ({
  components: { PynCommandPalette },
  setup: () => ({ args }),
  template: `<PynCommandPalette v-bind="args" />`,
})

export const Groups: Story = {
  args: { open: true, label: 'Command palette', items: commandItems },
  render,
}

export const Loading: Story = {
  args: { open: true, label: 'Command palette', items: commandItems.slice(0, 2), loading: true },
  render,
}

export const Empty: Story = {
  args: { open: true, label: 'Command palette', items: [], emptyLabel: 'No matching commands' },
  render,
}

export const LongList: Story = {
  args: { open: true, label: 'Command palette', items: manyItems },
  render,
}

export const WithInitialText: Story = {
  args: { open: true, label: 'Command palette', items: commandItems, initialText: 'repo' },
  render,
}

export const OpenedByButton: Story = {
  args: { open: false, label: 'Command palette', items: commandItems },
  render: (args) => ({
    components: { PynCommandPalette },
    setup: () => ({ args, open: ref(false), last: ref('') }),
    template: `<div>
      <button type="button" @click="open = true">Open palette</button>
      <p>Chosen: {{ last }}</p>
      <PynCommandPalette v-bind="args" :open="open" @close="open = false"
        @select="(i) => { last = i.label; open = false }" />
    </div>`,
  }),
}
