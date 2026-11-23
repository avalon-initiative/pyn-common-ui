import type { Meta, StoryObj } from '@storybook/vue3'
import PynPageNotFound from '../components/PynPageNotFound.vue'

const meta: Meta<typeof PynPageNotFound> = {
  title: 'Shell/PynPageNotFound',
  component: PynPageNotFound,
}
export default meta

type Story = StoryObj<typeof PynPageNotFound>

export const Default: Story = {}
export const WithBackLink: Story = { args: { backHref: '/alice', backLabel: 'Go to alice' } }
export const WithActions: Story = {
  render: () => ({
    components: { PynPageNotFound },
    template: `<PynPageNotFound><template #actions><a href="/explore">Explore</a></template></PynPageNotFound>`,
  }),
}
