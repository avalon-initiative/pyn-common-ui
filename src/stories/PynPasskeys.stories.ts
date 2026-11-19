import type { Meta, StoryObj } from '@storybook/vue3'
import PynPasskeys from '../components/PynPasskeys.vue'
import { passkeys } from './two-factor-data'

const meta: Meta<typeof PynPasskeys> = { title: 'Account/PynPasskeys', component: PynPasskeys }
export default meta
type Story = StoryObj<typeof PynPasskeys>

export const WithPasskeys: Story = { args: { passkeys, available: true } }
export const NoPasskeys: Story = { args: { passkeys: [], available: true } }
export const NotOffered: Story = { args: { passkeys: [], available: false } }
