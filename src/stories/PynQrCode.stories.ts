import type { Meta, StoryObj } from '@storybook/vue3'
import PynQrCode from '../components/PynQrCode.vue'
import { enrolment } from './two-factor-data'

const meta: Meta<typeof PynQrCode> = { title: 'Account/PynQrCode', component: PynQrCode }
export default meta
type Story = StoryObj<typeof PynQrCode>

export const Default: Story = { args: { value: enrolment.uri } }
