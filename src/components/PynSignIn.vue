<script setup lang="ts">
import { computed, ref, useId, watch } from 'vue'
import styles from '../styles/PynSignIn.module.scss'
import PynAccountNotice from './PynAccountNotice.vue'
import PynDismissButton from './PynDismissButton.vue'
import { AUTO_DISMISS_MS, useAutoDismiss } from '../state/auto-dismiss.state'
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
    /** The name as it will be stored; shown as a preview hint in register mode. */
    nameCanonical?: string
    initialUsername?: string
    /** Shows a "Remember me" checkbox (v-model:remember) that keeps the user name. */
    rememberOption?: boolean
    /** Shows a "Stay signed in" checkbox (v-model:stay-signed-in) under the password. */
    staySignedInOption?: boolean
    /** Milliseconds before the error fades; 0 keeps it until it is closed. */
    errorAutoDismissMs?: number
    /** Keeps the error until it is closed, for errors that need action. */
    errorPersistent?: boolean
  }>(),
  { passwordSignIn: true, errorAutoDismissMs: AUTO_DISMISS_MS },
)
const remember = defineModel<boolean>('remember', { default: false })
const staySignedIn = defineModel<boolean>('staySignedIn', { default: false })

const emit = defineEmits<{
  signIn: [SignInForm]
  register: [RegisterForm]
  resend: [string]
  dismiss: []
  dismissError: []
  nameInput: [name: string]
  passkey: []
}>()

const nameMessageId = useId()
const confirmMessageId = useId()
const canonicalId = useId()

type View = 'sign-in' | 'register'
const view = ref<View>('sign-in')
const adminForm = ref(false)
const showForm = computed(() => props.passwordSignIn || adminForm.value)
const shownError = computed(
  () => props.error || (props.callbackError ? signInErrorMessage(props.callbackError) : ''),
)
const errorFade = useAutoDismiss({
  delay: () => (props.errorPersistent ? 0 : props.errorAutoDismissMs),
  onDismiss: () => emit('dismissError'),
})
watch([shownError, () => props.busy], () => errorFade.restart())
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

const showCanonical = computed(() => view.value === 'register' && !!props.nameCanonical)
const nameDescribedBy = computed(
  () =>
    [props.nameMessage ? nameMessageId : '', showCanonical.value ? canonicalId : '']
      .filter(Boolean)
      .join(' ') || undefined,
)
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
  if (view.value === 'sign-in') {
    const form: SignInForm = { username: username.value, password: password.value }
    if (props.rememberOption) form.remember = remember.value
    if (props.staySignedInOption) form.staySignedIn = staySignedIn.value
    emit('signIn', form)
  } else {
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
  <div v-else :class="styles.page">
    <span :class="styles.mark" aria-hidden="true">PYN</span>
    <h2 :class="styles.title">{{ title }}</h2>

    <div
      v-if="shownError && errorFade.phase.value !== 'gone'"
      :class="[styles.error, errorFade.phase.value === 'fading' && styles.fading]"
      role="alert"
      v-on="errorFade.handlers"
    >
      <span>{{ shownError }}</span>
      <PynDismissButton @click="errorFade.close" />
    </div>

    <form :class="styles.card" @submit.prevent="submit">
      <template v-if="showForm">
        <label :class="styles.field"
          >User name
          <input
            v-model.trim="username"
            :class="styles.input"
            autocomplete="username"
            required
            :aria-describedby="nameDescribedBy"
            :aria-invalid="nameMessage ? 'true' : undefined"
            @input="emit('nameInput', username)"
          />
          <span v-if="showCanonical" :id="canonicalId" :class="styles.hint" data-canonical
            >Will be created as: {{ nameCanonical }}</span
          >
          <span v-if="nameMessage" :id="nameMessageId" :class="styles.message">{{
            nameMessage
          }}</span>
        </label>
        <label v-if="view === 'sign-in' && rememberOption" :class="styles.check"
          ><input v-model="remember" type="checkbox" data-remember />Remember me</label
        >
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
        <label v-if="view === 'sign-in' && staySignedInOption" :class="styles.check"
          ><input v-model="staySignedIn" type="checkbox" data-stay-signed-in />Stay signed in</label
        >
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
    </form>

    <p v-if="!showForm" :class="styles.aside">
      <button type="button" :class="styles.link" @click="adminForm = true">
        Administrator sign-in
      </button>
    </p>

    <p v-if="showForm && (view === 'register' || canRegister)" :class="styles.aside">
      <span v-if="view === 'sign-in' && canRegister" :class="styles.asideText">New here?</span>
      <span v-else-if="view === 'register'" :class="styles.asideText">Already registered?</span>
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
  </div>
</template>
