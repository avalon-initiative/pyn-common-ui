import type { Meta, StoryObj } from '@storybook/vue3'
import PynRepoDelete from '../components/PynRepoDelete.vue'
import PynRepoVisibility from '../components/PynRepoVisibility.vue'
import PynSettingsSection from '../components/PynSettingsSection.vue'

const meta: Meta<typeof PynRepoVisibility> = {
  title: 'Repositories/PynRepoVisibility',
  component: PynRepoVisibility,
  args: { slug: 'studio/game', visibility: 'private' },
}
export default meta
type Story = StoryObj<typeof PynRepoVisibility>

const open = async ({ canvasElement }: { canvasElement: HTMLElement }) => {
  canvasElement.querySelector<HTMLButtonElement>('[data-visibility-change] button')!.click()
  await new Promise((resolve) => setTimeout(resolve))
}

export const Private: Story = {}
export const Public: Story = { args: { visibility: 'public' } }
export const MakePublicDialog: Story = { play: open }
export const MakePrivateDialog: Story = { args: { visibility: 'public' }, play: open }
export const Refused: Story = {
  args: { error: 'Members may not create public repositories in studio.' },
}
export const ReadOnly: Story = { args: { readonly: true } }

/** The repository settings Danger zone: change visibility, then delete. */
export const DangerZone: Story = {
  render: (args) => ({
    components: { PynRepoDelete, PynRepoVisibility, PynSettingsSection },
    setup: () => ({ args }),
    template: `<PynSettingsSection title="Danger zone" danger plain>
      <PynRepoVisibility v-bind="args" />
      <PynRepoDelete :slug="args.slug" />
    </PynSettingsSection>`,
  }),
}
