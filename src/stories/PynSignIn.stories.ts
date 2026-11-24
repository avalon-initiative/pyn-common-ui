import type { Meta, StoryObj } from '@storybook/vue3'
import PynSignIn from '../components/PynSignIn.vue'

const meta: Meta<typeof PynSignIn> = {
  title: 'Account/PynSignIn',
  component: PynSignIn,
  args: { registration: 'invite' },
}
export default meta
type Story = StoryObj<typeof PynSignIn>

export const InviteOnlyServer: Story = {}
export const OpenServer: Story = { args: { registration: 'open' } }
export const ClosedServer: Story = { args: { registration: 'closed' } }
export const AfterSetup: Story = { args: { registration: 'invite', initialUsername: 'lv' } }
export const WrongPassword: Story = {
  args: { error: 'authentication failed: wrong user name or password' },
}
export const OpenServerWithVerification: Story = {
  args: { registration: 'open', emailVerification: true },
}
export const RateLimited: Story = {
  args: { error: 'Too many attempts. Try again in 12 minutes.' },
}
export const EmailNotVerified: Story = {
  args: {
    registration: 'open',
    emailVerification: true,
    notice: { status: 'pending_verification', user: 'wendy' },
  },
}
export const VerificationResent: Story = {
  args: {
    registration: 'open',
    emailVerification: true,
    notice: { status: 'pending_verification', user: 'wendy' },
    resent: true,
  },
}
export const AwaitingApproval: Story = {
  args: { notice: { status: 'pending_approval', user: 'wendy' } },
}
export const AccountDisabled: Story = {
  args: { notice: { status: 'account_disabled', user: 'wendy' } },
}
export const WithProvider: Story = {
  args: { external: { name: 'Acme SSO', sign_in_url: '/v1/oidc/authorize' } },
}
export const ProviderOnly: Story = {
  args: {
    passwordSignIn: false,
    external: { name: 'Acme SSO', sign_in_url: '/v1/oidc/authorize' },
  },
}
export const ProviderRefusedAccount: Story = {
  args: {
    external: { name: 'Acme SSO', sign_in_url: '/v1/oidc/authorize' },
    callbackError: 'external_account_not_linked',
  },
}
export const InvalidUserName: Story = {
  args: { registration: 'open', nameMessage: 'That user name is not allowed.' },
}

const showRegister = ({ canvasElement }: { canvasElement: HTMLElement }) => {
  const link = [...canvasElement.querySelectorAll('button')].find((b) =>
    /Create an account|I have an invitation/.test(b.textContent ?? ''),
  )
  link?.click()
}
/** Mail can be sent: the email is required. */
export const RegisterEmailRequired: Story = {
  args: { registration: 'open', emailVerification: true },
  play: showRegister,
}
/** No mail can be sent: an optional email with a line on what it is for. */
export const RegisterEmailOptional: Story = {
  args: { registration: 'open', emailVerification: false },
  play: showRegister,
}
export const RegisterInviteOnly: Story = {
  args: { registration: 'invite', emailVerification: false },
  play: showRegister,
}

export const WithPasskeys: Story = { args: { registration: 'open', passkeys: true } }

const tick = () => new Promise((resolve) => setTimeout(resolve))

function type(input: HTMLInputElement, value: string) {
  input.value = value
  input.dispatchEvent(new Event('input', { bubbles: true }))
}

async function register(root: HTMLElement, confirm: string) {
  const create = [...root.querySelectorAll('button')].find(
    (b) => b.textContent?.trim() === 'Create an account',
  )
  create!.click()
  await tick()
  const [, password, again] = root.querySelectorAll('input')
  type(password, 'a long password')
  type(again, confirm)
  await tick()
}

export const RegisterMatching: Story = {
  args: { registration: 'open' },
  play: ({ canvasElement }) => register(canvasElement, 'a long password'),
}
export const RegisterMismatch: Story = {
  args: { registration: 'open' },
  play: ({ canvasElement }) => register(canvasElement, 'a long passw'),
}
export const OpenServerNoEmail: Story = {
  args: { registration: 'open', emailVerification: false },
}
export const NoEmailNoteOverride: Story = {
  args: { registration: 'open', emailVerification: false, noEmailNote: 'No email is sent here.' },
}
export const NoEmailAwaitingApproval: Story = {
  args: {
    registration: 'open',
    emailVerification: false,
    notice: { status: 'pending_approval', user: 'wendy' },
  },
}
export const WithRememberAndStaySignedIn: Story = {
  args: { rememberOption: true, staySignedInOption: true },
}
export const PersistentError: Story = {
  args: { error: 'Sign-in is blocked for this network.', errorPersistent: true },
}
export const RegisterPreview: Story = {
  args: { registration: 'open', nameCanonical: 'new-user' },
  play: ({ canvasElement }) => {
    const link = [...canvasElement.querySelectorAll('button')].find((b) =>
      b.textContent?.includes('Create an account'),
    )
    link?.click()
  },
}
