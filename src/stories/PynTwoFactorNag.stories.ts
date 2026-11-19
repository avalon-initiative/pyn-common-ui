import type { Meta, StoryObj } from '@storybook/vue3'
import PynTwoFactorNag from '../components/PynTwoFactorNag.vue'

const meta: Meta<typeof PynTwoFactorNag> = {
  title: 'Account/PynTwoFactorNag',
  component: PynTwoFactorNag,
  args: {
    href: '/_/settings/security',
    required: { by: 'server', deadline: '2026-12-01T00:00:00Z', enforced: false },
  },
}
export default meta
type Story = StoryObj<typeof PynTwoFactorNag>

export const BeforeDeadline: Story = {}
export const Enforced: Story = {
  args: { required: { by: 'server', deadline: '2026-11-01T00:00:00Z', enforced: true } },
}
export const Organization: Story = {
  args: {
    required: {
      by: 'organization',
      organization: 'acme',
      deadline: '2026-12-01T00:00:00Z',
      enforced: false,
    },
  },
}
