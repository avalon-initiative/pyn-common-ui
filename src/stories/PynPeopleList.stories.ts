import type { Meta, StoryObj } from '@storybook/vue3'
import PynPeopleList from '../components/PynPeopleList.vue'
import { aliceIdentity, bobIdentity, carolIdentity } from './person-data'

const meta: Meta<typeof PynPeopleList> = {
  title: 'Profile/PynPeopleList',
  component: PynPeopleList,
  args: {
    people: [
      {
        identity: aliceIdentity,
        bio: 'Level designer.',
        company: 'Studio',
        location: 'Oslo',
        links: ['https://alice.example'],
      },
      { identity: bobIdentity, bio: null, links: [] },
      { identity: carolIdentity },
    ],
  },
}
export default meta
type Story = StoryObj<typeof PynPeopleList>

export const Default: Story = {}
export const MorePages: Story = { args: { more: true } }
export const Busy: Story = { args: { more: true, busy: true } }
export const Empty: Story = { args: { people: [], empty: 'Nobody matches that search.' } }
