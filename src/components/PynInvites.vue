<script setup lang="ts">
import { ref } from 'vue'
import styles from '../styles/PynInvites.module.scss'
import { formatDate } from '../utils/datetime'
import { useReveal } from '../state/reveal.state'
import type { InviteInfo } from '../types/repo.types'

const props = defineProps<{
  invites: InviteInfo[]
  roles: string[]
  /** The code of the invitation just created; the server shows it only once. */
  code?: string
  busy?: boolean
  /** Disables every control that writes; reading stays visible. */
  readonly?: boolean
  error?: string
}>()
const emit = defineEmits<{
  create: [{ role: string; hours: number }]
  revoke: [string]
  cancel: []
}>()
/** Create form open; New invitation shows while closed. The app closes it after a success. */
const adding = defineModel<boolean>('adding', { default: false })

const role = ref(props.roles[0] ?? 'reader')
const hours = ref(72)
const field = ref<HTMLSelectElement | null>(null)
const button = ref<HTMLButtonElement | null>(null)
useReveal(adding, field, button, () => {
  role.value = props.roles[0] ?? 'reader'
  hours.value = 72
})

function create() {
  if (!props.readonly) emit('create', { role: role.value, hours: Number(hours.value) })
}

function cancel() {
  adding.value = false
  emit('cancel')
}

function state(i: InviteInfo): string {
  if (i.revoked_at) return 'revoked'
  if (i.used_by) return `used by ${i.used_by}`
  return `expires ${formatDate(i.expires_at)}`
}
</script>

<template>
  <section :class="styles.page">
    <p v-if="code" :class="styles.code" role="status">
      Invitation code (shown once): <code>{{ code }}</code>
    </p>
    <ul v-if="invites.length" :class="styles.list">
      <li v-for="i in invites" :key="i.id" :class="styles.item">
        <div>
          <strong>{{ i.role }}</strong>
          <div :class="styles.meta">by {{ i.created_by }} · {{ state(i) }}</div>
        </div>
        <button
          v-if="!readonly && !i.revoked_at && !i.used_by"
          type="button"
          :class="styles.danger"
          :disabled="busy"
          @click="emit('revoke', i.id)"
        >
          Revoke
        </button>
      </li>
    </ul>
    <p v-else :class="styles.empty" data-empty>No invitations.</p>

    <p v-if="error && !adding" :class="styles.error" role="alert">{{ error }}</p>
    <form v-if="adding && !readonly" :class="styles.form" @submit.prevent="create">
      <h3 :class="styles.subheading">New invitation</h3>
      <div :class="styles.row">
        <label :class="styles.field"
          >Role
          <select ref="field" v-model="role" :class="styles.input">
            <option v-for="r in roles" :key="r" :value="r">{{ r }}</option>
          </select>
        </label>
        <label :class="styles.field"
          >Valid for (hours)
          <input v-model="hours" :class="styles.input" type="number" min="1" required />
        </label>
      </div>
      <p v-if="error" :class="styles.error" role="alert">{{ error }}</p>
      <div :class="styles.actions">
        <button type="submit" :class="styles.primary" :disabled="busy">Create invitation</button>
        <button type="button" :class="styles.cancel" @click="cancel">Cancel</button>
      </div>
    </form>
    <button
      v-else
      ref="button"
      type="button"
      :class="styles.primary"
      :disabled="readonly"
      @click="adding = true"
    >
      New invitation
    </button>
  </section>
</template>
