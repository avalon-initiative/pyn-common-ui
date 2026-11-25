import type { Meta, StoryObj } from '@storybook/vue3'
import PynForkForm from '../components/PynForkForm.vue'

const meta: Meta<typeof PynForkForm> = {
  title: 'Repositories/PynForkForm',
  component: PynForkForm,
  args: {
    source: { owner: 'studio', name: 'game' },
    owner: 'alice',
    owners: ['alice', 'modding-club'],
    defaultBranch: 'main',
    nameCanonical: 'game',
  },
}
export default meta
type Story = StoryObj<typeof PynForkForm>

export const Default: Story = {}
export const SingleOwner: Story = { args: { owners: undefined, defaultBranch: undefined } }
export const Busy: Story = { args: { busy: true } }
export const WithError: Story = {
  args: { error: 'Fork limit reached: this account may hold at most 10 forks.' },
}
