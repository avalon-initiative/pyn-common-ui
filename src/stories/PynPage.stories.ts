import type { Meta, StoryObj } from '@storybook/vue3'
import PynPage from '../components/PynPage.vue'

const meta: Meta<typeof PynPage> = {
  title: 'Shell/PynPage',
  component: PynPage,
  parameters: { layout: 'fullscreen' },
  render: (args) => ({
    components: { PynPage },
    setup: () => ({ args }),
    template:
      '<PynPage v-bind="args"><div style="border: 1px solid var(--pyn-border); padding: 1rem">Page content</div></PynPage>',
  }),
}
export default meta
type Story = StoryObj<typeof PynPage>

export const Default: Story = {}
export const Wide: Story = { args: { wide: true } }
