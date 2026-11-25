import type { Meta, StoryObj } from '@storybook/vue3'
import PynTeamForm from '../components/PynTeamForm.vue'
import { teams } from './org-data'

const meta: Meta<typeof PynTeamForm> = {
  title: 'Organizations/PynTeamForm',
  component: PynTeamForm,
}
export default meta
type Story = StoryObj<typeof PynTeamForm>

/** New team until pressed; the form then asks for the name and previews the slug. */
export const Create: Story = {}
export const CreateOpen: Story = { args: { adding: true } }
export const Exists: Story = {
  args: { adding: true, error: 'A team with the slug level-design already exists.' },
}
export const Edit: Story = { args: { team: teams[0] } }
