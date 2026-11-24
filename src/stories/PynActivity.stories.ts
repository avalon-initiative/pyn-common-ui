import type { Meta, StoryObj } from '@storybook/vue3'
import PynActivity from '../components/PynActivity.vue'
import { now, summary } from './landing-data'
import { aliciaIdentity } from './person-data'

const meta: Meta<typeof PynActivity> = {
  title: 'Browse/PynActivity',
  component: PynActivity,
  args: { entries: summary.activity, now },
}
export default meta
type Story = StoryObj<typeof PynActivity>

export const Default: Story = {}
const nine = Array.from({ length: 9 }, (_, i) => ({
  ...summary.activity[i % summary.activity.length]!,
  id: i + 1,
}))

/** Nine entries, five shown by default. */
export const Capped: Story = { args: { entries: nine } }
export const MaxTwo: Story = { args: { entries: nine, max: 2 } }
export const Empty: Story = { args: { entries: [] } }
export const WithIdentities: Story = {
  args: {
    entries: summary.activity.map((e, i) =>
      i === 0 ? { ...e, actor_public: aliciaIdentity, actor_current: 'alicia' } : e,
    ),
  },
}
