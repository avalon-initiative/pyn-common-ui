import type { Meta, StoryObj } from '@storybook/vue3'
import PynPeopleSearch from '../components/PynPeopleSearch.vue'

const meta: Meta<typeof PynPeopleSearch> = {
  title: 'Profile/PynPeopleSearch',
  component: PynPeopleSearch,
}
export default meta
type Story = StoryObj<typeof PynPeopleSearch>

export const Default: Story = {}
export const Busy: Story = { args: { busy: true } }
