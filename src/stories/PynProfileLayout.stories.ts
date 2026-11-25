import type { Meta, StoryObj } from '@storybook/vue3'
import PynButton from '../components/PynButton.vue'
import PynProfileHeader from '../components/PynProfileHeader.vue'
import PynProfileLayout from '../components/PynProfileLayout.vue'
import PynReadme from '../components/PynReadme.vue'
import PynViewError from '../components/PynViewError.vue'
import { activity, orgs, profile, readme, repos, starred } from './profile-data'

const meta: Meta<typeof PynProfileLayout> = {
  title: 'Profile/PynProfileLayout',
  component: PynProfileLayout,
  parameters: { layout: 'fullscreen' },
  args: {
    username: 'alice',
    repos,
    orgs,
    activityEntries: activity,
    now: new Date('2026-11-15T12:00:00Z'),
  },
  render: (args) => ({
    components: { PynProfileLayout, PynProfileHeader, PynReadme, PynButton },
    setup: () => ({ args, profile, readme }),
    template: `
      <div style="padding: 1rem; max-width: 80rem; margin: 0 auto">
        <PynProfileLayout v-bind="args">
          <template #profile>
            <PynProfileHeader v-bind="profile" column>
              <template #actions><PynButton label="Edit profile" variant="secondary" /></template>
            </PynProfileHeader>
          </template>
          <template v-if="!args.current" #readme>
            <PynReadme :readme="readme" owner="alice" name="alice" />
          </template>
          <template v-if="args.current !== 'stars'" #repositoryActions>
            <PynButton label="New" variant="primary" />
          </template>
        </PynProfileLayout>
      </div>`,
  }),
}
export default meta
type Story = StoryObj<typeof PynProfileLayout>

export const Overview: Story = {}
export const RepositoriesTab: Story = { args: { current: 'repositories' } }
export const WithStars: Story = { args: { stars: 2, starredRepos: starred } }
export const StarsTab: Story = { args: { stars: 2, starredRepos: starred, current: 'stars' } }
/** The starred list failed to load: the tab stays, without a count, and the slot shows the error. */
export const StarsLoadError: Story = {
  args: { stars: null, current: 'stars' },
  render: (args) => ({
    components: { PynProfileLayout, PynProfileHeader, PynViewError },
    setup: () => ({ args, profile }),
    template: `
      <div style="padding: 1rem; max-width: 80rem; margin: 0 auto">
        <PynProfileLayout v-bind="args">
          <template #profile><PynProfileHeader v-bind="profile" column /></template>
          <template #starred><PynViewError>Could not load the starred repositories.</PynViewError></template>
        </PynProfileLayout>
      </div>`,
  }),
}
export const OwnProfile: Story = { args: { self: true } }
export const SignedOut: Story = { args: { orgs: [], activityEntries: undefined } }
export const NoRepositories: Story = { args: { repos: [], current: 'repositories' } }
export const Mobile: Story = {
  args: { stars: 2, starredRepos: starred },
  parameters: { viewport: { defaultViewport: 'mobile1' } },
}
