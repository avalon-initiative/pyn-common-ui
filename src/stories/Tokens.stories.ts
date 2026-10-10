import { h } from 'vue'
import type { Meta, StoryObj } from '@storybook/vue3'

const colors = [
  'bg', 'surface', 'surface-raised', 'border', 'hover', 'selected', 'text', 'text-muted', 'accent', 'on-accent',
  'available', 'available-bg', 'locked', 'locked-bg', 'mine', 'mine-bg', 'danger', 'danger-bg',
  'syntax-keyword', 'syntax-string', 'syntax-comment', 'syntax-number', 'syntax-name',
]
const spaces = [1, 2, 3, 4, 6, 8]
const sizes = ['xs', 'sm', 'base', 'md', 'lg', 'xl']

const meta: Meta = { title: 'Foundation/Tokens' }
export default meta

type Story = StoryObj

const row = 'display:flex;align-items:center;gap:var(--pyn-space-3);margin-bottom:var(--pyn-space-2)'

export const Colors: Story = {
  render: () =>
    h(
      'div',
      colors.map((name) =>
        h('div', { style: row }, [
          h('span', {
            style: `width:3rem;height:1.5rem;border:1px solid var(--pyn-border);border-radius:var(--pyn-radius);background:var(--pyn-${name})`,
          }),
          h('code', `--pyn-${name}`),
        ]),
      ),
    ),
}

export const Spacing: Story = {
  render: () =>
    h(
      'div',
      spaces.map((n) =>
        h('div', { style: row }, [
          h('span', { style: `height:0.75rem;background:var(--pyn-accent);width:var(--pyn-space-${n})` }),
          h('code', `--pyn-space-${n}`),
        ]),
      ),
    ),
}

export const Typography: Story = {
  render: () =>
    h(
      'div',
      sizes.map((s) => h('p', { style: `margin:0 0 var(--pyn-space-2);font-size:var(--pyn-text-${s})` }, `--pyn-text-${s}: Merge what can be merged, lock what shouldn't be.`)),
    ),
}
