import type { Meta, StoryObj } from '@storybook/vue3'
import PynViewError from '../components/PynViewError.vue'

const meta: Meta<typeof PynViewError> = {
  title: 'Layout/PynViewError',
  component: PynViewError,
}
export default meta

export const Default: StoryObj<typeof PynViewError> = {
  render: () => ({
    components: { PynViewError },
    template: '<PynViewError>Could not load the repositories.</PynViewError>',
  }),
}
