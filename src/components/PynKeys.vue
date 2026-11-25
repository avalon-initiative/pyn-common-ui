<script setup lang="ts">
import { ref } from 'vue'
import styles from '../styles/PynKeys.module.scss'
import { formatDate } from '../utils/datetime'
import { useReveal } from '../state/reveal.state'
import type { SshKey } from '../types/auth.types'

defineProps<{
  keys: SshKey[]
  busy?: boolean
  error?: string
}>()

const emit = defineEmits<{
  add: [{ key: string; title: string }]
  remove: [string]
  cancel: []
}>()
/** Add form open; New SSH key shows while closed. The app closes it after a success. */
const adding = defineModel<boolean>('adding', { default: false })

const title = ref('')
const key = ref('')
const field = ref<HTMLInputElement | null>(null)
const button = ref<HTMLButtonElement | null>(null)
useReveal(adding, field, button, () => {
  key.value = ''
  title.value = ''
})

function submit() {
  emit('add', { key: key.value.trim(), title: title.value })
}
function cancel() {
  adding.value = false
  emit('cancel')
}
</script>

<template>
  <section :class="styles.page">
    <h2 :class="styles.heading">SSH keys</h2>
    <p :class="styles.note">
      These keys sign you in from the command line, like on GitHub. A key can belong to one account
      only.
    </p>

    <ul v-if="keys.length" :class="styles.list">
      <li v-for="k in keys" :key="k.id" :class="styles.item">
        <div>
          <strong>{{ k.title }}</strong>
          <span :class="styles.meta"> · {{ k.algorithm }}</span>
          <div :class="styles.fingerprint">{{ k.fingerprint }}</div>
          <div :class="styles.meta">
            Added {{ formatDate(k.created_at) }} ·
            {{ k.last_used_at ? `last used ${formatDate(k.last_used_at)}` : 'never used' }}
          </div>
        </div>
        <button type="button" :class="styles.remove" :disabled="busy" @click="emit('remove', k.id)">
          Remove
        </button>
      </li>
    </ul>
    <p v-else :class="styles.empty">No keys yet.</p>

    <p v-if="error && !adding" :class="styles.error" role="alert">{{ error }}</p>
    <form v-if="adding" :class="styles.form" @submit.prevent="submit">
      <h3 :class="styles.subheading">Add a key</h3>
      <label :class="styles.field"
        >Title (optional)
        <input ref="field" v-model="title" :class="styles.input" placeholder="work laptop" />
      </label>
      <label :class="styles.field"
        >Public key
        <textarea
          v-model="key"
          :class="styles.input"
          rows="4"
          placeholder="ssh-ed25519 AAAA..."
          required
        />
      </label>
      <p v-if="error" :class="styles.error" role="alert">{{ error }}</p>
      <div :class="styles.actions">
        <button type="submit" :class="styles.primary" :disabled="busy">Add key</button>
        <button type="button" :class="styles.cancel" @click="cancel">Cancel</button>
      </div>
    </form>
    <button v-else ref="button" type="button" :class="styles.primary" @click="adding = true">
      New SSH key
    </button>
  </section>
</template>
