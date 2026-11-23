import type { Meta, StoryObj } from '@storybook/vue3'
import PynSignInPrompt from '../components/PynSignInPrompt.vue'

const meta: Meta<typeof PynSignInPrompt> = {
  title: 'Account/PynSignInPrompt',
  component: PynSignInPrompt,
  args: {
    message: 'You need an account to watch this repository or check out files.',
    signInHref: '/_/sign-in?next=/alice/game',
  },
}
export default meta
type Story = StoryObj<typeof PynSignInPrompt>

export const Default: Story = {}
export const WithRegister: Story = { args: { registerHref: '/_/register' } }
export const Narrow: Story = {
  args: { registerHref: '/_/register' },
  parameters: { viewport: { defaultViewport: 'mobile1' } },
}
