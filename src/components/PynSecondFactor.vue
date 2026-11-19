<script setup lang="ts">
import { computed, ref } from 'vue'
import styles from '../styles/PynSecondFactor.module.scss'
import type { SecondFactorForm, SecondFactorKind } from '../types/two-factor.types'

defineProps<{
  passkeys?: boolean
  busy?: boolean
  error?: string
}>()
const emit = defineEmits<{ submit: [SecondFactorForm]; passkey: []; cancel: [] }>()

const kind = ref<SecondFactorKind>('totp')
const code = ref('')
const recovery = computed(() => kind.value === 'recovery')

function toggle() {
  kind.value = recovery.value ? 'totp' : 'recovery'
  code.value = ''
}

function send() {
  const value = code.value.trim()
  if (value) emit('submit', { kind: kind.value, code: value })
}
</script>

<template>
  <form :class="styles.card" @submit.prevent="send">
    <h2 :class="styles.title">Two-step verification</h2>
    <p :class="styles.note">
      {{
        recovery
          ? 'Enter one of your recovery codes. Each works once.'
          : 'Enter the six-digit code from your authenticator app.'
      }}
    </p>
    <label :class="styles.field"
      >{{ recovery ? 'Recovery code' : 'Authentication code' }}
      <input
        v-model="code"
        :class="styles.input"
        :inputmode="recovery ? 'text' : 'numeric'"
        :autocomplete="recovery ? 'off' : 'one-time-code'"
        required
        :disabled="busy"
      />
    </label>
    <p v-if="error" :class="styles.error" role="alert">{{ error }}</p>
    <button type="submit" :class="styles.primary" :disabled="busy">
      {{ busy ? 'Verifying…' : 'Verify' }}
    </button>
    <button
      v-if="passkeys"
      type="button"
      :class="styles.secondary"
      :disabled="busy"
      @click="emit('passkey')"
    >
      Use a passkey
    </button>
    <p :class="styles.links">
      <button type="button" :class="styles.link" @click="toggle">
        {{ recovery ? 'Use an authenticator code' : 'Use a recovery code' }}
      </button>
      <button type="button" :class="styles.link" @click="emit('cancel')">Back to sign in</button>
    </p>
  </form>
</template>
