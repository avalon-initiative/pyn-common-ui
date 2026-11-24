import type { Preview } from '@storybook/vue3'
import '../src/styles/tokens.css'
import '../src/styles/global.css'
import '@fontsource-variable/geist/wght.css'
import '@fontsource-variable/geist-mono/wght.css'
import '@fontsource-variable/pixelify-sans/wght.css'
import { applyTheme } from '../src/state/theme.state'
import type { ThemeChoice } from '../src/state/theme.state'
import { fontSets } from '../src/state/font-set.state'

const preview: Preview = {
  parameters: { layout: 'padded' },
  globalTypes: {
    theme: {
      description: 'Color theme',
      toolbar: {
        title: 'Theme',
        icon: 'circlehollow',
        dynamicTitle: true,
        items: [
          { value: 'system', title: 'System' },
          { value: 'light', title: 'Light' },
          { value: 'dark', title: 'Dark' },
        ],
      },
    },
    fontSet: {
      description: 'Font set',
      toolbar: {
        title: 'Font set',
        icon: 'paintbrush',
        dynamicTitle: true,
        items: fontSets.map((f) => ({ value: f.id, title: f.label })),
      },
    },
  },
  initialGlobals: { theme: 'system', fontSet: 'default' },
  decorators: [
    (story, context) => {
      applyTheme(context.globals.theme as ThemeChoice)
      document.documentElement.dataset.pynFontSet = context.globals.fontSet as string
      return story()
    },
  ],
}
export default preview
