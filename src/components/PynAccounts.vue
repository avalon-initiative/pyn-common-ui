<script setup lang="ts">
import { ref } from 'vue'
import styles from '../styles/PynAccounts.module.scss'
import { formatDateTime } from '../utils/datetime'
import { accountActions, disabledNote, STATUS_FILTERS, statusLabel } from '../state/admin.state'
import type {
  AccountInfo,
  AdminAccountStatus,
  DeleteAccountRequest,
  DisableRequest,
} from '../types/admin.types'

defineProps<{
  accounts: AccountInfo[]
  status: AdminAccountStatus | ''
  self: string
  busy?: boolean
  error?: string
}>()
const emit = defineEmits<{
  status: [AdminAccountStatus | '']
  approve: [user: string]
  enable: [user: string]
  disable: [DisableRequest]
  delete: [DeleteAccountRequest]
}>()

const confirming = ref('')
const deleting = ref('')
const reason = ref('')
const immediately = ref(false)

function ask(user: string) {
  confirming.value = user
  deleting.value = ''
  reason.value = ''
}

function askDelete(user: string) {
  deleting.value = user
  confirming.value = ''
  reason.value = ''
  immediately.value = false
}

function remove() {
  if (!reason.value.trim()) return
  emit('delete', {
    user: deleting.value,
    reason: reason.value.trim(),
    immediately: immediately.value,
  })
  deleting.value = ''
}

function disable() {
  emit('disable', { user: confirming.value, reason: reason.value })
  confirming.value = ''
}

const pick = (e: Event) =>
  emit('status', (e.target as HTMLSelectElement).value as AdminAccountStatus | '')
</script>

<template>
  <section :class="styles.page">
    <label :class="styles.field"
      >Show
      <select :class="styles.input" :value="status" :disabled="busy" @change="pick">
        <option v-for="f in STATUS_FILTERS" :key="f.id" :value="f.id">
          {{ f.label }}
        </option>
      </select>
    </label>
    <p v-if="error" :class="styles.error" role="alert">{{ error }}</p>
    <ul v-if="accounts.length" :class="styles.list">
      <li v-for="a in accounts" :key="a.user" :class="styles.item">
        <div :class="styles.what">
          <span>
            <strong>{{ a.user }}</strong>
            <span v-if="a.admin" :class="styles.pill">admin</span>
            <span :class="styles.pill" :data-status="a.status">{{ statusLabel(a.status) }}</span>
          </span>
          <span :class="styles.meta"
            >{{ a.email ?? 'No email'
            }}<template v-if="a.email && !a.email_verified"> (unverified)</template> · joined
            {{ formatDateTime(a.created_at) }}</span
          >
          <span v-if="a.status === 'disabled'" :class="styles.meta">{{ disabledNote(a) }}</span>
        </div>
        <form v-if="confirming === a.user" :class="styles.confirm" @submit.prevent="disable">
          <input
            v-model="reason"
            :class="styles.input"
            placeholder="Reason (optional)"
            :aria-label="`Reason for disabling ${a.user}`"
          />
          <button type="submit" :class="styles.danger" :disabled="busy">
            Disable {{ a.user }}
          </button>
          <button type="button" :class="styles.quiet" @click="confirming = ''">Cancel</button>
        </form>
        <form v-else-if="deleting === a.user" :class="styles.confirm" @submit.prevent="remove">
          <input
            v-model="reason"
            :class="styles.input"
            placeholder="Reason (required)"
            :aria-label="`Reason for deleting ${a.user}`"
          />
          <label :class="styles.check"
            ><input v-model="immediately" type="checkbox" /> Delete immediately</label
          >
          <button type="submit" :class="styles.danger" :disabled="busy || !reason.trim()">
            Delete {{ a.user }}
          </button>
          <button type="button" :class="styles.quiet" @click="deleting = ''">Cancel</button>
        </form>
        <div v-else :class="styles.actions">
          <template v-for="action in accountActions(a, self)" :key="action">
            <button
              v-if="action === 'approve'"
              type="button"
              :class="styles.quiet"
              :disabled="busy"
              @click="emit('approve', a.user)"
            >
              Approve
            </button>
            <button
              v-else-if="action === 'enable'"
              type="button"
              :class="styles.quiet"
              :disabled="busy"
              @click="emit('enable', a.user)"
            >
              Enable
            </button>
            <button
              v-else-if="action === 'delete'"
              type="button"
              :class="styles.danger"
              :disabled="busy"
              @click="askDelete(a.user)"
            >
              Delete
            </button>
            <button
              v-else
              type="button"
              :class="styles.danger"
              :disabled="busy"
              @click="ask(a.user)"
            >
              Disable
            </button>
          </template>
        </div>
      </li>
    </ul>
    <p v-else :class="styles.empty">No accounts match.</p>
  </section>
</template>
