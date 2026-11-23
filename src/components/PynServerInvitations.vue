<script setup lang="ts">
import { computed, reactive, ref, useId } from 'vue'
import styles from '../styles/PynServerInvitations.module.scss'
import { formatDate } from '../utils/datetime'
import {
  canRevoke,
  EXPIRY_DEFAULT_DAYS,
  EXPIRY_MAX_DAYS,
  EXPIRY_MIN_DAYS,
  grantLabel,
  invitationStatusLabel,
  rolesFor,
  targetKey,
  validExpiry,
} from '../state/server-invitation.state'
import PynEmptyState from './PynEmptyState.vue'
import PynSecretReveal from './PynSecretReveal.vue'
import type {
  InvitationGrantRole,
  InvitationGrantTarget,
  ServerInvitation,
  ServerInvitationCreate,
} from '../types/server-invitation.types'

const props = defineProps<{
  invitations: ServerInvitation[]
  /** The code just created; the server shows it only once. */
  created?: string
  /** True when the server emailed the new code. */
  emailed?: boolean
  /** The server address shown beside the register command. */
  serverUrl?: string
  targets?: InvitationGrantTarget[]
  roles?: InvitationGrantRole[]
  busy?: boolean
  error?: string
}>()
const emit = defineEmits<{ create: [ServerInvitationCreate]; revoke: [string]; dismiss: [] }>()

const id = useId()
const form = reactive({ email: '', days: EXPIRY_DEFAULT_DAYS, target: '', role: '' })
const tried = ref(false)

const target = computed(() => props.targets?.find((t) => targetKey(t) === form.target))
const roleChoices = computed(() =>
  target.value ? rolesFor(props.roles ?? [], target.value.kind) : [],
)
const daysProblem = computed(() =>
  tried.value && !validExpiry(Number(form.days))
    ? `Use a whole number from ${EXPIRY_MIN_DAYS} to ${EXPIRY_MAX_DAYS}.`
    : null,
)
const roleProblem = computed(() =>
  tried.value && target.value && !form.role ? 'Choose a role.' : null,
)

function pickTarget() {
  form.role = roleChoices.value[0]?.value ?? ''
}

function create() {
  tried.value = true
  if (!validExpiry(Number(form.days)) || (target.value && !form.role)) return
  const out: ServerInvitationCreate = { expires_in_days: Number(form.days) }
  if (form.email.trim()) out.email = form.email.trim()
  if (target.value)
    out.grant = {
      [target.value.kind]: target.value.name,
      role: form.role,
    }
  emit('create', out)
}

function state(i: ServerInvitation): string {
  if (i.status === 'used') return `used${i.used_by ? ` by ${i.used_by}` : ''}`
  if (i.status === 'revoked') return 'revoked'
  return `${i.status === 'expired' ? 'expired' : 'expires'} ${formatDate(i.expires_at)}`
}
</script>

<template>
  <section :class="styles.page">
    <PynSecretReveal
      v-if="created"
      :secret="created"
      message="Copy this invitation code now. It is shown once."
      @dismiss="emit('dismiss')"
    >
      <template v-if="emailed">The code was also emailed. </template>Give it to the person, who
      registers with <code>pyn register &lt;name&gt; --invite {{ created }}</code
      ><template v-if="serverUrl"> against {{ serverUrl }}</template
      >, or enters it in the sign-up form.
    </PynSecretReveal>

    <form :class="styles.form" novalidate @submit.prevent="create">
      <h3 :class="styles.subheading">New invitation</h3>
      <label :class="styles.field"
        >Email (optional)
        <input
          v-model="form.email"
          :class="styles.input"
          type="email"
          autocapitalize="none"
          :disabled="busy"
        />
        <span :class="styles.hint"
          >Used to email the code and to tell invitations apart in the list.</span
        >
      </label>
      <label :class="styles.field"
        >Valid for (days)
        <input
          v-model="form.days"
          :class="styles.input"
          type="number"
          :min="EXPIRY_MIN_DAYS"
          :max="EXPIRY_MAX_DAYS"
          required
          :disabled="busy"
          :aria-invalid="daysProblem ? 'true' : undefined"
          :aria-describedby="daysProblem ? `${id}-days` : undefined"
        />
        <span v-if="daysProblem" :id="`${id}-days`" :class="styles.message">{{ daysProblem }}</span>
      </label>
      <template v-if="targets?.length">
        <label :class="styles.field"
          >Grant access to (optional)
          <select v-model="form.target" :class="styles.input" :disabled="busy" @change="pickTarget">
            <option value="">No role</option>
            <option v-for="t in targets" :key="targetKey(t)" :value="targetKey(t)">
              {{ t.name }} ({{ t.kind }})
            </option>
          </select>
        </label>
        <label v-if="target" :class="styles.field"
          >Role
          <select
            v-model="form.role"
            :class="styles.input"
            :disabled="busy"
            :aria-invalid="roleProblem ? 'true' : undefined"
          >
            <option v-for="r in roleChoices" :key="r.value" :value="r.value">
              {{ r.label ?? r.value }}
            </option>
          </select>
          <span v-if="roleProblem" :class="styles.message">{{ roleProblem }}</span>
        </label>
      </template>
      <p v-if="error" :class="styles.error" role="alert">{{ error }}</p>
      <button type="submit" :class="styles.primary" :disabled="busy">Create invitation</button>
    </form>

    <ul v-if="invitations.length" :class="styles.list" aria-label="Invitations">
      <li v-for="i in invitations" :key="i.id" :class="styles.item">
        <div :class="styles.what">
          <span>
            <strong>{{ i.email ?? 'No email' }}</strong>
            <span :class="styles.pill" :data-status="i.status">{{
              invitationStatusLabel(i.status)
            }}</span>
          </span>
          <span :class="styles.meta"
            >{{ grantLabel(i.grant) }} · by {{ i.created_by }} · {{ state(i) }}</span
          >
        </div>
        <button
          v-if="canRevoke(i)"
          type="button"
          :class="styles.danger"
          :disabled="busy"
          :aria-label="`Revoke invitation ${i.email ?? i.id}`"
          @click="emit('revoke', i.id)"
        >
          Revoke
        </button>
      </li>
    </ul>
    <PynEmptyState
      v-else
      compact
      :heading-level="3"
      title="No invitations"
      description="Invitations you create appear here."
    />
  </section>
</template>
