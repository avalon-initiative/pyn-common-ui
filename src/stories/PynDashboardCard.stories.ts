import type { Meta, StoryObj } from '@storybook/vue3'
import PynDashboardCard from '../components/PynDashboardCard.vue'

const meta: Meta<typeof PynDashboardCard> = {
  title: 'Dashboard/PynDashboardCard',
  component: PynDashboardCard,
  args: { heading: 'Repositories' },
  render: (args) => ({
    components: { PynDashboardCard },
    setup: () => ({ args }),
    template: '<PynDashboardCard v-bind="args"><p>Card content goes here.</p></PynDashboardCard>',
  }),
}
export default meta
type Story = StoryObj<typeof PynDashboardCard>

export const Default: Story = {}
export const WithSeeAll: Story = { args: { seeAllHref: '/_/repos' } }
export const Flush: Story = { args: { flush: true } }
export const Loading: Story = { args: { loading: true } }
export const Failed: Story = { args: { error: 'Could not load this card.' } }
export const FailedRetryable: Story = {
  args: { error: 'Could not load this card.', retryable: true },
}
