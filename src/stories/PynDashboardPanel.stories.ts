import type { Meta, StoryObj } from '@storybook/vue3'
import PynDashboardPanel from '../components/PynDashboardPanel.vue'

const meta: Meta<typeof PynDashboardPanel> = {
  title: 'Dashboard/PynDashboardPanel',
  component: PynDashboardPanel,
  args: { heading: 'Locks held', viewAllHref: '/_/locks', filterable: true },
  render: (args) => ({
    components: { PynDashboardPanel },
    setup: () => ({ args }),
    template:
      '<PynDashboardPanel v-bind="args"><ul><li style="padding:.75rem 1rem">First row</li><li style="padding:.75rem 1rem">Second row</li></ul></PynDashboardPanel>',
  }),
}
export default meta
type Story = StoryObj<typeof PynDashboardPanel>

export const Default: Story = {}
export const Loading: Story = { args: { loading: true } }
export const Failed: Story = { args: { error: 'Could not load this panel.', retryable: true } }
