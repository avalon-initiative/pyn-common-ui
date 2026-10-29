import type { Meta, StoryObj } from '@storybook/vue3'
import PynOwnerFrozenNotice from '../components/PynOwnerFrozenNotice.vue'
import { frozenWithReason, frozenWithoutReason, notFrozen } from './owner-freeze-data'

const meta: Meta<typeof PynOwnerFrozenNotice> = {
  title: 'Account/PynOwnerFrozenNotice',
  component: PynOwnerFrozenNotice,
  args: { freeze: frozenWithReason },
}
export default meta
type Story = StoryObj<typeof PynOwnerFrozenNotice>

export const WithReason: Story = {}
export const WithoutReason: Story = { args: { freeze: frozenWithoutReason } }
export const NotFrozen: Story = { args: { freeze: notFrozen } }
