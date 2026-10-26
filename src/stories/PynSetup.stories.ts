import type { Meta, StoryObj } from '@storybook/vue3'
import PynSetup from '../components/PynSetup.vue'

const meta: Meta<typeof PynSetup> = {
  title: 'Account/PynSetup',
  component: PynSetup,
  args: { registration: 'closed', publicUrl: 'http://localhost:7878' },
}
export default meta
type Story = StoryObj<typeof PynSetup>

export const Welcome: Story = {}
export const WrongToken: Story = { args: { error: 'the setup token is not valid' } }
export const RateLimited: Story = { args: { error: 'too many attempts; try again in 15 minutes' } }
export const Finished: Story = { args: { done: true } }

const tick = () => new Promise((resolve) => setTimeout(resolve))

async function type(root: HTMLElement, value: string) {
  const input = root.querySelector('input')!
  input.value = value
  input.dispatchEvent(new Event('input', { bubbles: true }))
  await tick()
}

async function submit(root: HTMLElement) {
  root.querySelector('form')!.dispatchEvent(new Event('submit', { cancelable: true }))
  await tick()
}

export const InvalidAdminName: Story = {
  args: { nameMessage: 'That user name is already taken.' },
  play: async ({ canvasElement }) => {
    await submit(canvasElement)
    await type(canvasElement, 'token')
    await submit(canvasElement)
  },
}
