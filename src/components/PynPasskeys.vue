<script setup lang="ts">
import { ref } from 'vue'
import styles from '../styles/PynPasskeys.module.scss'
import { formatDate } from '../utils/datetime'
import type { Passkey } from '../types/two-factor.types'

defineProps<{
  passkeys: Passkey[]
  available?: boolean
  busy?: boolean
  error?: string
}>()
const emit = defineEmits<{
  add: []
  rename: [{ id: string; name: string }]
  remove: [string]
}>()

const editing = ref<string | null>(null)
const draft = ref('')

function edit(key: Passkey) {
  editing.value = key.id
  draft.value = key.name
}

function save(id: string) {
  const name = draft.value.trim()
  if (name) emit('rename', { id, name })
  editing.value = null
}

function backup(key: Passkey): string {
  if (key.backup_state) return 'Synced'
  return key.backup_eligible ? 'Can be synced' : 'This device only'
}
</script>

<template>
  <section :class="styles.page">
    <h2 :class="styles.heading">Passkeys and security keys</h2>
    <p :class="styles.note">
      A passkey signs you in with your device or a security key, and counts as a second step.
    </p>

    <ul v-if="passkeys.length" :class="styles.list">
      <li v-for="k in passkeys" :key="k.id" :class="styles.item">
        <form v-if="editing === k.id" :class="styles.rename" @submit.prevent="save(k.id)">
          <input v-model="draft" :class="styles.input" aria-label="Passkey name" required />
          <button type="submit" :class="styles.button" :disabled="busy">Save</button>
          <button type="button" :class="styles.button" @click="editing = null">Cancel</button>
        </form>
        <template v-else>
          <div>
            <strong>{{ k.name }}</strong>
            <span :class="styles.meta"> · {{ backup(k) }}</span>
            <div :class="styles.meta">
              Added {{ formatDate(k.created_at) }} ·
              {{ k.last_used_at ? `last used ${formatDate(k.last_used_at)}` : 'never used' }}
            </div>
            <div v-if="k.transports.length" :class="styles.meta">
              Connects by {{ k.transports.join(', ') }}
            </div>
          </div>
          <div :class="styles.actions">
            <button type="button" :class="styles.button" :disabled="busy" @click="edit(k)">
              Rename
            </button>
            <button
              type="button"
              :class="styles.remove"
              :disabled="busy"
              @click="emit('remove', k.id)"
            >
              Remove
            </button>
          </div>
        </template>
      </li>
    </ul>
    <p v-else-if="available" :class="styles.empty">No passkeys yet.</p>

    <p v-if="!available" :class="styles.unavailable" role="note">
      This server can't register passkeys. An administrator has to set a public address and enable
      them first.
    </p>
    <p v-if="error" :class="styles.error" role="alert">{{ error }}</p>
    <button
      type="button"
      :class="styles.primary"
      :disabled="busy || !available"
      @click="emit('add')"
    >
      Add a passkey
    </button>
  </section>
</template>
