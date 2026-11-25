<script setup lang="ts">
import { computed, ref } from 'vue'
import styles from '../styles/PynEmailAddresses.module.scss'
import { formatDate } from '../utils/datetime'
import { useReveal } from '../state/reveal.state'
import type { AccountEmail } from '../types/account.types'

const props = withDefaults(
  defineProps<{
    emails: AccountEmail[]
    /** Most addresses an account may hold. */
    max?: number
    busy?: boolean
    error?: string
    /** An address a fresh verification link was just sent to. */
    sent?: string
  }>(),
  { max: 10 },
)
const emit = defineEmits<{
  add: [string]
  resend: [string]
  primary: [string]
  remove: [string]
  cancel: []
}>()
/** Add form open; Add email address shows while closed. The app closes it after a success. */
const adding = defineModel<boolean>('adding', { default: false })

const address = ref('')
const full = computed(() => props.emails.length >= props.max)
const field = ref<HTMLInputElement | null>(null)
const button = ref<HTMLButtonElement | null>(null)
useReveal(adding, field, button, () => (address.value = ''))

function add() {
  const value = address.value.trim()
  if (!value || full.value || props.busy) return
  emit('add', value)
}
function cancel() {
  adding.value = false
  emit('cancel')
}
</script>

<template>
  <section :class="styles.page">
    <h2 :class="styles.heading">Email addresses</h2>
    <p :class="styles.note">
      Only you see these. The primary address is the one the server uses for the account; a new
      address stays pending until you open the link mailed to it.
    </p>

    <ul v-if="emails.length" :class="styles.list" aria-label="Email addresses">
      <li v-for="e in emails" :key="e.address" :class="styles.item">
        <div>
          <strong :class="styles.address">{{ e.address }}</strong>
          <span v-if="e.primary" :class="styles.pill">Primary</span>
          <span v-if="e.verified" :class="styles.pill">Verified</span>
          <span v-else :class="[styles.pill, styles.pending]">Pending</span>
          <div :class="styles.meta">
            Added {{ formatDate(e.added_at) }}
            <template v-if="!e.verified && sent === e.address"> · link sent</template>
          </div>
        </div>
        <div :class="styles.actions">
          <button
            v-if="!e.verified"
            type="button"
            :class="styles.action"
            :disabled="busy"
            @click="emit('resend', e.address)"
          >
            Resend link
          </button>
          <button
            v-if="e.verified && !e.primary"
            type="button"
            :class="styles.action"
            :disabled="busy"
            @click="emit('primary', e.address)"
          >
            Make primary
          </button>
          <button
            type="button"
            :class="styles.remove"
            :disabled="busy"
            :aria-label="`Remove ${e.address}`"
            @click="emit('remove', e.address)"
          >
            Remove
          </button>
        </div>
      </li>
    </ul>
    <p v-else :class="styles.note">No addresses yet.</p>

    <p v-if="full" :class="styles.note">An account holds at most {{ max }} addresses.</p>
    <p v-if="error && !(adding && !full)" :class="styles.error" role="alert">{{ error }}</p>
    <form v-if="adding && !full" :class="styles.form" @submit.prevent="add">
      <label :class="styles.field"
        >Add an address
        <input
          ref="field"
          v-model="address"
          :class="styles.input"
          type="email"
          autocomplete="email"
          required
          :disabled="busy"
        />
      </label>
      <p v-if="error" :class="styles.error" role="alert">{{ error }}</p>
      <div :class="styles.actions">
        <button type="submit" :class="styles.button" :disabled="busy">Add address</button>
        <button type="button" :class="styles.cancel" @click="cancel">Cancel</button>
      </div>
    </form>
    <button
      v-else
      ref="button"
      type="button"
      :class="styles.button"
      :disabled="full"
      @click="adding = true"
    >
      Add email address
    </button>
  </section>
</template>
