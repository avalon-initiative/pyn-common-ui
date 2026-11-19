<script setup lang="ts">
import { ref } from 'vue'
import styles from '../styles/PynTotpEnrolment.module.scss'
import PynQrCode from './PynQrCode.vue'
import type { TotpEnrolment } from '../types/two-factor.types'

const props = defineProps<{
  enrolment: TotpEnrolment
  busy?: boolean
  error?: string
}>()
const emit = defineEmits<{ confirm: [code: string]; cancel: [] }>()

const code = ref('')
const copied = ref(false)

function groups(secret: string): string {
  return secret.replace(/(.{4})(?=.)/g, '$1 ')
}

async function copy() {
  try {
    await navigator.clipboard.writeText(props.enrolment.secret)
    copied.value = true
  } catch {
    copied.value = false
  }
}

function send() {
  const digits = code.value.replace(/\s/g, '')
  if (digits && !props.busy) emit('confirm', digits)
}
</script>

<template>
  <form :class="styles.form" @submit.prevent="send">
    <h2 :class="styles.heading">Set up an authenticator app</h2>
    <p :class="styles.note">
      Scan the code with an authenticator app, or type the key in by hand. Then enter the six-digit
      code the app shows.
    </p>
    <PynQrCode :value="enrolment.uri" label="Authenticator app QR code" />
    <div :class="styles.manual">
      <span :class="styles.note">Can't scan? Enter this key</span>
      <code :class="styles.secret">{{ groups(enrolment.secret) }}</code>
      <button type="button" :class="styles.button" @click="copy">
        {{ copied ? 'Copied' : 'Copy key' }}
      </button>
    </div>
    <label :class="styles.field"
      >Code from the app
      <input
        v-model="code"
        :class="styles.input"
        inputmode="numeric"
        autocomplete="one-time-code"
        maxlength="8"
        required
        :disabled="busy"
      />
    </label>
    <p v-if="error" :class="styles.error" role="alert">{{ error }}</p>
    <div :class="styles.actions">
      <button type="submit" :class="styles.primary" :disabled="busy">
        {{ busy ? 'Confirming…' : 'Confirm' }}
      </button>
      <button type="button" :class="styles.button" :disabled="busy" @click="emit('cancel')">
        Cancel
      </button>
    </div>
  </form>
</template>
