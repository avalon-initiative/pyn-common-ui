import type { Meta, StoryObj } from '@storybook/vue3'
import PynSecurityNotice from '../components/PynSecurityNotice.vue'

const meta: Meta<typeof PynSecurityNotice> = {
  title: 'Account/PynSecurityNotice',
  component: PynSecurityNotice,
  args: {
    message: 'Your account has no second factor. Add one to protect your locks and repositories.',
    actionLabel: 'Set up two-factor authentication',
    actionHref: '/_/settings/security',
  },
}
export default meta
type Story = StoryObj<typeof PynSecurityNotice>

export const Recommended: Story = {}
export const Dismissible: Story = { args: { dismissible: true } }
export const Required: Story = {
  args: {
    required: true,
    message: 'This server requires two-factor authentication.',
    deadline: 'Required from 1 December 2026',
  },
}
export const RequiredByOrganization: Story = {
  args: {
    required: true,
    dismissible: true,
    message: 'The organization acme requires two-factor authentication.',
    deadline: 'Enforced now',
  },
}
export const Compact: Story = { args: { compact: true, dismissible: true } }
export const CompactRequired: Story = {
  args: { compact: true, required: true, message: 'Two-factor is required.', deadline: 'by 1 Dec' },
}
export const EventAction: Story = { args: { actionHref: undefined } }
export const NoAction: Story = { args: { actionLabel: undefined, actionHref: undefined } }
export const NarrowCard: Story = {
  render: (args) => ({
    components: { PynSecurityNotice },
    setup: () => ({ args }),
    template: `<div style="max-width: 20rem"><PynSecurityNotice v-bind="args" dismissible /></div>`,
  }),
}
