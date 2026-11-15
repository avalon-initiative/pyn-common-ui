import type { Meta, StoryObj } from '@storybook/vue3'
import PynAvatar from '../components/PynAvatar.vue'

const meta: Meta<typeof PynAvatar> = {
  title: 'Profile/PynAvatar',
  component: PynAvatar,
  args: { username: 'alice' },
}
export default meta
type Story = StoryObj<typeof PynAvatar>

const dot =
  'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 8 8"><rect width="8" height="8" fill="%234a7"/></svg>'

export const Initials: Story = {}
export const FromDisplayName: Story = { args: { name: 'Alice Anders' } }
export const Image: Story = { args: { src: dot } }
export const BrokenImage: Story = { args: { src: 'about:blank#missing.png' } }
export const Small: Story = { args: { size: 'sm' } }
export const Large: Story = { args: { size: 'lg' } }
export const ExtraLarge: Story = { args: { size: 'xl' } }
