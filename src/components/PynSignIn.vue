<script setup lang="ts">
import { computed, ref, useId, watch } from 'vue'
import styles from '../styles/PynSignIn.module.scss'
import PynAccountNotice from './PynAccountNotice.vue'
import { NO_EMAIL_NOTE, externalSignInUrl, signInErrorMessage } from '../state/account.state'
import type {
  BlockedStatus,
  ExternalProvider,
  RegisterForm,
  RegistrationMode,
  SignInForm,
} from '../types/auth.types'

const props = withDefaults(
  defineProps<{
    registration: RegistrationMode | null
    external?: ExternalProvider | null
    passwordSignIn?: boolean
    passkeys?: boolean
    returnTo?: string
    callbackError?: string
    emailVerification?: boolean
    /** Replaces the default note shown when the server sends no confirmation email. */
    noEmailNote?: string
    notice?: { status: BlockedStatus; user?: string } | null
    resent?: boolean
    busy?: boolean
    error?: string
    nameMessage?: string
    initialUsername?: string
  }>(),
  { passwordSignIn: true },
)

const emit = defineEmits<{
  signIn: [SignInForm]
  register: [RegisterForm]
  resend: [string]
  dismiss: []
  nameInput: [name: string]
  passkey: []
}>()

const nameMessageId = useId()
const confirmMessageId = useId()

type View = 'sign-in' | 'register'
const view = ref<View>('sign-in')
const adminForm = ref(false)
const showForm = computed(() => props.passwordSignIn || adminForm.value)
const shownError = computed(
  () => props.error || (props.callbackError ? signInErrorMessage(props.callbackError) : ''),
)
const username = ref(props.initialUsername ?? '')
watch(
  () => props.initialUsername,
  (name) => {
    if (name && !username.value) username.value = name
  },
)
const password = ref('')
const confirm = ref('')
const invite = ref('')
const email = ref('')

const canRegister = computed(() => props.registration === 'open' || props.registration === 'invite')
const needsEmail = computed(() => props.registration === 'open' && !!props.emailVerification)
const showNoEmailNote = computed(
  () =>
    view.value === 'register' && props.registration === 'open' && props.emailVerification === false,
)
const needsInvite = computed(() => props.registration === 'invite')
const mismatch = computed(() => view.value === 'register' && password.value !== confirm.value)
const showMismatch = computed(() => mismatch.value && confirm.value !== '')
const title = computed(() => ({ 'sign-in': 'Sign in', register: 'Create an account' })[view.value])

function submit() {
  if (mismatch.value) return
  if (view.value === 'sign-in')
    emit('signIn', { username: username.value, password: password.value })
  else {
    emit('register', {
      username: username.value,
      password: password.value,
      email: needsEmail.value ? email.value : undefined,
      invite: invite.value.trim() || undefined,
    })
  }
}
</script>

<template>
  <PynAccountNotice
    v-if="notice"
    :status="notice.status"
    :user="notice.user"
    :busy="busy"
    :sent="resent"
    :error="error"
    :email-verification="emailVerification"
    :no-email-note="noEmailNote"
    @resend="(address) => emit('resend', address)"
    @back="emit('dismiss')"
  />
  <form v-else :class="styles.card" @submit.prevent="submit">
    <h2 :class="styles.title">{{ title }}</h2>

    <template v-if="showForm">
      <label :class="styles.field"
        >User name
        <input
          v-model.trim="username"
          :class="styles.input"
          autocomplete="username"
          required
          :aria-describedby="nameMessage ? nameMessageId : undefined"
          :aria-invalid="nameMessage ? 'true' : undefined"
          @input="emit('nameInput', username)"
        />
        <span v-if="nameMessage" :id="nameMessageId" :class="styles.message">{{
          nameMessage
        }}</span>
      </label>
      <label :class="styles.field"
        >Password
        <input
          v-model="password"
          :class="styles.input"
          type="password"
          :autocomplete="view === 'register' ? 'new-password' : 'current-password'"
          required
        />
      </label>
      <label v-if="view === 'register'" :class="styles.field"
        >Confirm password
        <input
          v-model="confirm"
          :class="styles.input"
          type="password"
          autocomplete="new-password"
          required
          :aria-describedby="showMismatch ? confirmMessageId : undefined"
          :aria-invalid="showMismatch ? 'true' : undefined"
        />
        <span v-if="showMismatch" :id="confirmMessageId" :class="styles.message" role="alert"
          >The passwords do not match.</span
        >
      </label>
      <label v-if="view === 'register' && needsEmail" :class="styles.field"
        >Email address
        <input
          v-model.trim="email"
          :class="styles.input"
          type="email"
          autocomplete="email"
          required
        />
      </label>
      <label v-if="view === 'register' && needsInvite" :class="styles.field"
        >Invitation code
        <input v-model.trim="invite" :class="styles.input" autocomplete="off" required />
      </label>
    </template>

    <p v-if="showNoEmailNote" :class="styles.note" data-no-email>
      {{ noEmailNote ?? NO_EMAIL_NOTE }}
    </p>

    <p v-if="shownError" :class="styles.error" role="alert">{{ shownError }}</p>

    <button v-if="showForm" type="submit" :class="styles.primary" :disabled="busy || mismatch">
      {{ title }}
    </button>

    <button
      v-if="passkeys && view === 'sign-in'"
      type="button"
      :class="styles.provider"
      :disabled="busy"
      @click="emit('passkey')"
    >
      Sign in with a passkey
    </button>
    <a
      v-if="external"
      :class="styles.provider"
      :href="externalSignInUrl(external.sign_in_url, returnTo)"
      >Sign in with {{ external.name }}</a
    >
    <button v-if="!showForm" type="button" :class="styles.link" @click="adminForm = true">
      Administrator sign-in
    </button>

    <p v-if="showForm" :class="styles.links">
      <button
        v-if="view !== 'sign-in'"
        type="button"
        :class="styles.link"
        @click="view = 'sign-in'"
      >
        Sign in
      </button>
      <button
        v-if="view !== 'register' && canRegister"
        type="button"
        :class="styles.link"
        @click="view = 'register'"
      >
        {{ needsInvite ? 'I have an invitation' : 'Create an account' }}
      </button>
    </p>
  </form>
</template>
