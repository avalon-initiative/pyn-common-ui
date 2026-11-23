import type { Meta, StoryObj } from '@storybook/vue3'
import PynViewNotice from '../components/PynViewNotice.vue'
import { singleAdminNotice } from './notice-data'

const meta: Meta<typeof PynViewNotice> = {
  title: 'Layout/PynViewNotice',
  component: PynViewNotice,
  args: { title: singleAdminNotice.title },
  render: (args) => ({
    components: { PynViewNotice },
    setup: () => ({ args, body: singleAdminNotice.body }),
    template: '<PynViewNotice v-bind="args"><span v-html="body" /></PynViewNotice>',
  }),
}
export default meta
type Story = StoryObj<typeof PynViewNotice>

export const Warning: Story = {}
export const Info: Story = { args: { tone: 'info', title: 'Invitations are on' } }
export const Success: Story = { args: { tone: 'success', title: 'Invitation sent' } }
export const Danger: Story = { args: { tone: 'danger', title: 'Sign-in is disabled' } }
export const WithoutTitle: Story = { args: { title: undefined } }
export const Dismissible: Story = { args: { dismissible: true } }
export const DismissibleStays: Story = { args: { dismissible: true, persistent: true } }
