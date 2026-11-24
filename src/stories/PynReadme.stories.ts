import type { Meta, StoryObj } from '@storybook/vue3'
import PynReadme from '../components/PynReadme.vue'
import { readmeText } from './file-data'

const meta: Meta<typeof PynReadme> = {
  title: 'File/PynReadme',
  component: PynReadme,
  args: {
    owner: 'acme',
    name: 'castle-quest',
    readme: { name: 'README.md', path: 'README.md', text: readmeText },
  },
}
export default meta
type Story = StoryObj<typeof PynReadme>

export const Markdown: Story = {}
export const PlainText: Story = {
  args: { readme: { name: 'README', path: 'README', text: 'Plain text\nreadme.' } },
}
export const OnBranch: Story = { args: { branch: 'feature/levels' } }

export const WithTabs: Story = {
  args: {
    others: [
      {
        name: 'CONTRIBUTING.md',
        path: 'CONTRIBUTING.md',
        text: '# Contributing\n\nOpen an issue first.',
      },
      { name: 'LICENSE', path: 'LICENSE', text: 'Apache License 2.0' },
    ],
  },
}
