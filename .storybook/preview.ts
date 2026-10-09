import type { Preview } from '@storybook/vue3'
import '../src/styles/tokens.css'
import '../src/styles/global.css'

const preview: Preview = {
  parameters: {
    backgrounds: { default: 'pyn', options: { pyn: { name: 'pyn', value: '#0b0f16' } } },
  },
  initialGlobals: { backgrounds: { value: 'pyn' } },
}
export default preview
