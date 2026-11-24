import type { Meta, StoryObj } from '@storybook/vue3'
import PynButton from '../components/PynButton.vue'
import PynOrgHeader from '../components/PynOrgHeader.vue'
import PynOrgHome from '../components/PynOrgHome.vue'
import PynReadme from '../components/PynReadme.vue'
import { people, readme, repos } from './profile-data'

const meta: Meta<typeof PynOrgHome> = {
  title: 'Organizations/PynOrgHome',
  component: PynOrgHome,
  parameters: { layout: 'fullscreen' },
  args: {
    repos,
    people,
    peopleHref: '/studio/-/members',
    now: new Date('2026-11-15T12:00:00Z'),
  },
  render: (args) => ({
    components: { PynOrgHome, PynOrgHeader, PynReadme, PynButton },
    setup: () => ({ args, readme }),
    template: `
      <div style="padding: 1rem; max-width: 80rem; margin: 0 auto">
        <PynOrgHeader
          name="studio"
          display-name="Studio Games"
          description="We make levels, tools and the occasional boss fight."
          created-at="2026-09-02T08:00:00Z"
          role="owner"
          current=""
        />
        <PynOrgHome v-bind="args">
          <template #readme><PynReadme :readme="readme" owner="studio" name=".pyn" /></template>
          <template #repositoryActions><PynButton label="New" variant="primary" /></template>
        </PynOrgHome>
      </div>`,
  }),
}
export default meta
type Story = StoryObj<typeof PynOrgHome>

export const Default: Story = {}
export const WithLanguagesAndTopics: Story = {
  args: { languages: ['Unreal', 'Godot', 'Rust'], topics: ['game-dev', 'levels', 'tools'] },
}
export const NoPeople: Story = { args: { people: [] } }
export const NoRepositories: Story = { args: { repos: [] } }
export const Mobile: Story = {
  args: { languages: ['Unreal'], topics: ['game-dev'] },
  parameters: { viewport: { defaultViewport: 'mobile1' } },
}
