import type { Meta, StoryObj } from '@storybook/vue3'
import PynFileView from '../components/PynFileView.vue'
import { codeText, fileEntry, imageSrc, lockedEntry, readmeText, treeEntries } from './file-data'
import { now } from './landing-data'

const meta: Meta<typeof PynFileView> = {
  title: 'File/PynFileView',
  component: PynFileView,
  parameters: { layout: 'fullscreen' },
  args: {
    owner: 'acme',
    name: 'castle-quest',
    path: fileEntry.path,
    entry: fileEntry,
    me: 'jamie',
    now,
    body: { kind: 'code', text: codeText, language: 'typescript' },
  },
}
export default meta
type Story = StoryObj<typeof PynFileView>

export const Code: Story = {}
export const WithPolicyNote: Story = {
  args: {
    path: lockedEntry.path,
    entry: lockedEntry,
    body: { kind: 'binary' },
    note: 'Exclusive: matches rule "**/*.umap"',
  },
}
export const LinkedLines: Story = { args: { lines: { start: 2, end: 4 } } }
export const Markdown: Story = {
  args: { path: 'Source/Notes.md', body: { kind: 'markdown', text: readmeText } },
}
export const Image: Story = {
  args: { path: 'Source/logo.svg', body: { kind: 'image', src: imageSrc } },
}
export const Binary: Story = {
  args: { path: lockedEntry.path, entry: lockedEntry, body: { kind: 'binary' } },
}
export const TooLarge: Story = { args: { body: { kind: 'large' } } }
export const Empty: Story = { args: { body: { kind: 'empty' } } }
export const Loading: Story = { args: { body: null } }
export const Missing: Story = { args: { entry: null, missing: true, path: 'Source/gone.ts' } }
export const OnBranch: Story = {
  args: {
    branch: 'feature/levels',
    path: 'Source/Notes.md',
    body: { kind: 'markdown', text: readmeText },
  },
}

const panel = {
  tree: treeEntries,
  expanded: ['Source', 'Content'],
  branch: 'main',
  branches: [
    { name: 'main', isDefault: true, updatedAt: '2026-10-08T10:00:00Z' },
    { name: 'feature/levels', updatedAt: '2026-10-05T09:30:00Z' },
  ],
  branchesHref: '/acme/castle-quest/branches',
}

export const WithFilesPanel: Story = { args: panel }
export const PanelCollapsed: Story = { args: { ...panel, collapsed: true } }
export const PanelWithLockedFile: Story = {
  args: {
    ...panel,
    path: 'Content/Level02.umap',
    entry: { ...lockedEntry, path: 'Content/Level02.umap', name: 'Level02.umap' },
    body: { kind: 'binary' },
    creatable: true,
  },
}
