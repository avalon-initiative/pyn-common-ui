import { ref } from 'vue'
import type { Meta, StoryObj } from '@storybook/vue3'
import PynShortcutsHelp from '../components/PynShortcutsHelp.vue'
import { shortcutGroups } from './command-palette-data'

const meta: Meta<typeof PynShortcutsHelp> = {
  title: 'Primitives/PynShortcutsHelp',
  component: PynShortcutsHelp,
}
export default meta
type Story = StoryObj<typeof PynShortcutsHelp>

export const Open: Story = {
  args: { open: true, label: 'Keyboard shortcuts', groups: shortcutGroups },
  render: (args) => ({
    components: { PynShortcutsHelp },
    setup: () => ({ args }),
    template: `<PynShortcutsHelp v-bind="args" />`,
  }),
}

export const OpenedByButton: Story = {
  args: { open: false, label: 'Keyboard shortcuts', groups: shortcutGroups },
  render: (args) => ({
    components: { PynShortcutsHelp },
    setup: () => ({ args, open: ref(false) }),
    template: `<div>
      <button type="button" @click="open = true">Shortcuts</button>
      <PynShortcutsHelp v-bind="args" :open="open" @close="open = false" />
    </div>`,
  }),
}
