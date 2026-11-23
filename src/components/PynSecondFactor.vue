<script setup lang="ts">
import { computed, ref } from 'vue'
import styles from '../styles/PynSecondFactor.module.scss'
import type { SecondFactorForm, SecondFactorKind } from '../types/two-factor.types'

withDefaults(
  defineProps<{
    passkeys?: boolean
    busy?: boolean
    error?: string
    /** One line shown with the recovery option. */
    recoveryHint?: string
    /** Optional closing line, for example who can help when no factor is available. */
    helpHint?: string
  }>(),
  {
    recoveryHint: 'Recovery codes were shown once when two-step verification was turned on.',
  },
)
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
  <div :class="styles.page">
    <span :class="styles.mark" aria-hidden="true">PYN</span>
    <h2 :class="styles.title">Two-step verification</h2>
    <p v-if="error" :class="styles.error" role="alert">{{ error }}</p>
    <form :class="styles.card" @submit.prevent="send">
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
      <button type="submit" :class="styles.primary" :disabled="busy">
        {{ busy ? 'Verifying…' : 'Verify' }}
      </button>
      <section :class="styles.alternatives" aria-labelledby="pyn-second-factor-other">
        <h3 id="pyn-second-factor-other" :class="styles.heading">Other ways to verify</h3>
        <ul :class="styles.options">
          <li v-if="recovery" :class="styles.option">
            <button type="button" :class="styles.choice" :disabled="busy" @click="toggle">
              Use an authenticator code
            </button>
          </li>
          <li v-if="passkeys" :class="styles.option">
            <button type="button" :class="styles.choice" :disabled="busy" @click="emit('passkey')">
              Use a passkey
            </button>
          </li>
          <li v-if="!recovery" :class="styles.option">
            <button type="button" :class="styles.choice" :disabled="busy" @click="toggle">
              Use a recovery code
            </button>
            <p :class="styles.hint" data-recovery-hint>{{ recoveryHint }}</p>
          </li>
        </ul>
      </section>
      <p v-if="helpHint" :class="styles.hint" data-help-hint>{{ helpHint }}</p>
    </form>
    <p :class="styles.aside">
      <button type="button" :class="styles.link" @click="emit('cancel')">Back to sign in</button>
    </p>
  </div>
</template>
