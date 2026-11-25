import type { Meta, StoryObj } from '@storybook/vue3'
import PynAvatarUpload from '../components/PynAvatarUpload.vue'

const meta: Meta<typeof PynAvatarUpload> = {
  title: 'Shell/PynAvatarUpload',
  component: PynAvatarUpload,
  args: { name: 'alice' },
}
export default meta
type Story = StoryObj<typeof PynAvatarUpload>

export const Initial: Story = {}
export const WithImage: Story = {
  args: {
    src: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 8 8"><rect width="8" height="8" fill="%236a8caf"/></svg>',
  },
}
export const Fallback: Story = {
  args: {
    noun: 'icon',
    fallbackSrc:
      'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 8 8"><rect width="8" height="8" fill="%234a7"/></svg>',
    alt: 'Repository icon',
  },
}
export const Uploading: Story = {
  args: {
    src: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 8 8"><rect width="8" height="8" fill="%236a8caf"/></svg>',
    busy: true,
  },
}
export const Failed: Story = { args: { error: 'The image is too large.' } }
export const Disabled: Story = {
  args: {
    src: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 8 8"><rect width="8" height="8" fill="%236a8caf"/></svg>',
    disabled: true,
  },
}
