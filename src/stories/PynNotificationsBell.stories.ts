import type { Meta, StoryObj } from '@storybook/vue3'
import PynNotificationsBell from '../components/PynNotificationsBell.vue'
import type { BellEntry } from '../types/top-bar.types'

const now = new Date('2026-11-20T12:00:00Z')
const entries: BellEntry[] = [
  {
    id: 'n1',
    title: 'Two-factor authentication was reset by an administrator',
    at: '2026-11-20T09:00:00Z',
    href: '/_/settings/security',
  },
  {
    id: 'i1',
    kind: 'invitation',
    title: 'Invitation to join acme as a member',
    at: '2026-11-19T12:00:00Z',
  },
  { id: 'n2', title: 'Your session on another device ended', at: '2026-11-18T12:00:00Z' },
]

const meta: Meta<typeof PynNotificationsBell> = {
  title: 'Shell/PynNotificationsBell',
  component: PynNotificationsBell,
  parameters: { layout: 'padded', docs: { story: { height: '460px' } } },
  decorators: [
    () => ({ template: '<div style="display:flex;justify-content:flex-end"><story /></div>' }),
  ],
  args: { entries, now },
}
export default meta
type Story = StoryObj<typeof PynNotificationsBell>

const tick = () => new Promise((resolve) => setTimeout(resolve))
const open = async (ctx: { canvasElement: HTMLElement }) => {
  ctx.canvasElement.querySelector<HTMLElement>('button[data-bell]')!.click()
  await tick()
}

/** Closed: the badge counts the entries. */
export const Closed: Story = {}
export const Open: Story = { play: open }
export const NoticeOnly: Story = { args: { entries: [entries[0]!] }, play: open }
export const InvitationBusy: Story = {
  args: { entries: [{ ...entries[1]!, busy: true }] },
  play: open,
}
export const ManyEntries: Story = {
  args: {
    entries: Array.from({ length: 12 }, (_, i) => ({
      id: `m${i}`,
      title: `Notice number ${i + 1}`,
      at: '2026-11-20T11:00:00Z',
    })),
  },
  play: open,
}
export const Empty: Story = { args: { entries: [] }, play: open }
/** Without entries the count and the Work in progress panel behave as before. */
export const CountOnly: Story = {
  args: { entries: undefined, count: 2, href: '/_/invitations' },
  play: open,
}
export const Narrow: Story = {
  parameters: { viewport: { defaultViewport: 'mobile1' } },
  play: open,
}
