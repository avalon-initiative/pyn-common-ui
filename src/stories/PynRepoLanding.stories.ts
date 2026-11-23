import type { Meta, StoryObj } from '@storybook/vue3'
import PynRepoLanding from '../components/PynRepoLanding.vue'
import { readmeText } from './file-data'
import { folderListing, now, repo, rootListing, summary } from './landing-data'

const meta: Meta<typeof PynRepoLanding> = {
  title: 'Browse/PynRepoLanding',
  component: PynRepoLanding,
  parameters: { layout: 'fullscreen' },
  args: { repo, path: '', listing: rootListing, summary, me: 'jamie', now },
}
export default meta
type Story = StoryObj<typeof PynRepoLanding>

/** The repository root: file table and right rail. */
export const Root: Story = {}
export const Folder: Story = { args: { path: 'Content/Levels', listing: folderListing } }
export const EmptyRepository: Story = {
  args: {
    listing: { path: '', entries: [] },
    summary: {
      ...summary,
      files: 0,
      exclusive_files: 0,
      shared_files: 0,
      updated_at: null,
      locks: [],
      activity: [],
    },
  },
}
export const MissingFolder: Story = { args: { path: 'Content/Gone', listing: null, missing: true } }
export const Loading: Story = { args: { listing: null, summary: null } }
export const WithReadme: Story = {
  args: { readme: { name: 'README.md', path: 'README.md', text: readmeText } },
}
export const OnBranch: Story = {
  args: { branch: 'feature/levels', path: 'Content/Levels', listing: folderListing },
}
export const WithBranches: Story = {
  args: {
    branches: [
      { name: 'main', isDefault: true },
      { name: 'feature/levels', ahead: 4, behind: 1 },
      { name: 'fix/lighting', ahead: 2 },
      { name: 'old/prototype', updatedAt: '2026-08-01T10:00:00Z' },
    ],
    branchesHref: '/studio/game/branches',
  },
}
export const BranchesLinkOnly: Story = { args: { branchesHref: '/studio/game/branches' } }
export const WithAbout: Story = {
  args: {
    about: {
      description: 'An action game about a haunted castle.',
      website: 'https://castle-quest.example.com',
      topics: ['unreal', 'game'],
    },
    cloneCommand: 'pyn clone acme/castle-quest',
  },
}
