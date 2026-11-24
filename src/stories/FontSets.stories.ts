import type { Meta, StoryObj } from '@storybook/vue3'
import PynIcon from '../components/PynIcon.vue'
import { fontSets } from '../state/font-set.state'

const meta: Meta = { title: 'Foundations/Font sets' }
export default meta
type Story = StoryObj

// Each block scopes data-pyn-font-set, so all three sets show side by side.
export const Sets: Story = {
  render: () => ({
    components: { PynIcon },
    setup: () => ({ fontSets }),
    template: `
      <div style="display: grid; gap: 1.5rem; grid-template-columns: repeat(auto-fit, minmax(18rem, 1fr))">
        <section v-for="s in fontSets" :key="s.id" :data-pyn-font-set="s.id"
          style="border: 1px solid var(--pyn-border); border-radius: var(--pyn-radius); padding: 1rem; background: var(--pyn-bg); color: var(--pyn-text)">
          <p style="margin: 0; color: var(--pyn-text-muted)">{{ s.label }}</p>
          <h2 style="margin: 0.5rem 0">Merge what can be merged</h2>
          <h3 style="margin: 0.5rem 0">fi fl ff ffi ffl: Create your first repository, a fluffy office</h3>
          <p>Lock what shouldn't be. The quick brown fox jumps over the lazy dog, 0123456789.</p>
          <pre style="font-family: var(--pyn-font-mono); margin: 0">pyn checkout art/hero.psd</pre>
          <p style="font-size: 1.5rem"><PynIcon name="lock" /> <PynIcon name="branch" /> <PynIcon name="commit" /></p>
        </section>
      </div>`,
  }),
}

// One story per set: the toolbar's font set global is pinned, so every page shows the set.
const pinned = (fontSet: string): Story => ({
  globals: { fontSet },
  render: () => ({
    template: `
      <div>
        <h1>Castle Quest</h1>
        <h2>Exclusive files</h2>
        <h3>fi fl ff: Create your first repository</h3>
        <p>Body text in the {{ '${fontSet}' }} set, with <code style="font-family: var(--pyn-font-mono)">pyn lock Content/Hero.uasset</code> inline.</p>
      </div>`,
  }),
})
export const DefaultSet: Story = pinned('default')
export const ArcadeSet: Story = pinned('arcade')
export const SystemSet: Story = pinned('system')
