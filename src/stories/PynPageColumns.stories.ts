import type { Meta, StoryObj } from '@storybook/vue3'
import PynPage from '../components/PynPage.vue'
import PynPageColumns from '../components/PynPageColumns.vue'

const meta: Meta<typeof PynPageColumns> = {
  title: 'Shell/PynPageColumns',
  component: PynPageColumns,
  parameters: { layout: 'fullscreen' },
  render: (args) => ({
    components: { PynPage, PynPageColumns },
    setup: () => ({ args }),
    template: `
      <PynPage>
        <PynPageColumns v-bind="args">
          <p v-for="n in 12" :key="n">Main column paragraph {{ n }}.</p>
          <template #side>
            <section><h3>About</h3><p>Side block with a title.</p></section>
            <section><h3>Locks</h3><p>Another block under a rule.</p></section>
          </template>
        </PynPageColumns>
      </PynPage>`,
  }),
}
export default meta
type Story = StoryObj<typeof PynPageColumns>

export const Default: Story = { args: { sideLabel: 'Summary' } }
export const NotSticky: Story = { args: { sticky: false, sideLabel: 'Summary' } }
