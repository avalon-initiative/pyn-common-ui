<script setup lang="ts">
import { computed, ref } from 'vue'
import styles from '../styles/PynTwoFactor.module.scss'
import PynPasswordPrompt from './PynPasswordPrompt.vue'
import { formatDate } from '../utils/datetime'
import type { TwoFactorStatus } from '../types/two-factor.types'

const props = withDefaults(
  defineProps<{
    status: TwoFactorStatus
    busy?: boolean
    error?: string
    hasPassword?: boolean
  }>(),
  { hasPassword: true },
)
const emit = defineEmits<{
  addTotp: [label: string, password?: string]
  remove: [id: string]
  regenerateCodes: []
}>()

const label = ref('')
const asking = ref(false)

// The first factor of any kind needs the current password, for an account that has one.
const needsPassword = computed(() => props.hasPassword && !props.status.enabled)

function add() {
  if (needsPassword.value) asking.value = true
  else emit('addTotp', label.value.trim())
}

function confirm(password: string) {
  emit('addTotp', label.value.trim(), password)
  asking.value = false
  label.value = ''
}
</script>

<template>
  <section :class="styles.page">
    <h2 :class="styles.heading">Authenticator app</h2>
    <p :class="styles.note">
      An authenticator app shows a code that changes every thirty seconds, asked for after your
      password.
    </p>

    <ul v-if="status.factors.length" :class="styles.list">
      <li v-for="f in status.factors" :key="f.id" :class="styles.item">
        <span>
          <strong>{{ f.label || 'Authenticator app' }}</strong>
          <span :class="styles.meta"> · added {{ formatDate(f.created_at) }}</span>
        </span>
        <button
          type="button"
          :class="styles.remove"
          :disabled="busy"
          :aria-label="`Remove ${f.label || 'authenticator app'}`"
          @click="emit('remove', f.id)"
        >
          Remove
        </button>
      </li>
    </ul>
    <p v-else :class="styles.note">No authenticator app yet.</p>

    <PynPasswordPrompt
      v-if="asking"
      title="Confirm your password to add an authenticator app"
      :busy="busy"
      :error="error"
      @submit="confirm"
      @cancel="asking = false"
    />
    <form v-else :class="styles.add" @submit.prevent="add">
      <label :class="styles.field"
        >Name for the app (optional)
        <input v-model="label" :class="styles.input" maxlength="64" :disabled="busy" />
      </label>
      <p v-if="error" :class="styles.error" role="alert">{{ error }}</p>
      <button type="submit" :class="styles.primary" :disabled="busy">
        Add an authenticator app
      </button>
    </form>

    <div v-if="status.enabled" :class="styles.codes">
      <h3 :class="styles.subheading">Recovery codes</h3>
      <p :class="styles.note">
        {{ status.recovery_codes_left }}
        {{ status.recovery_codes_left === 1 ? 'recovery code' : 'recovery codes' }} left. Generating
        new codes replaces the old ones.
      </p>
      <button
        type="button"
        :class="styles.button"
        :disabled="busy"
        @click="emit('regenerateCodes')"
      >
        Generate new codes
      </button>
    </div>
  </section>
</template>
