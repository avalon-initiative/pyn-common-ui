import type { Meta, StoryObj } from '@storybook/vue3'
import PynPerson from '../components/PynPerson.vue'
import { aliciaIdentity, bobIdentity, carolIdentity } from './person-data'

const meta: Meta<typeof PynPerson> = {
  title: 'Profile/PynPerson',
  component: PynPerson,
  args: { name: 'bob' },
}
export default meta
type Story = StoryObj<typeof PynPerson>

export const NameOnly: Story = {}
export const WithIdentity: Story = { args: { identity: bobIdentity } }
export const WithAvatar: Story = { args: { name: 'alicia', identity: aliciaIdentity } }
export const NoDisplayName: Story = { args: { name: 'carol', identity: carolIdentity } }
export const Renamed: Story = { args: { name: 'alice', current: 'alicia' } }
export const RenamedWithIdentity: Story = {
  args: { name: 'alice', current: 'alicia', identity: aliciaIdentity },
}
export const WithoutAvatar: Story = { args: { identity: bobIdentity, avatar: false } }
