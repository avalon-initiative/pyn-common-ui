<script setup lang="ts">
import { reactive, ref } from 'vue'
import PynPerson from './PynPerson.vue'
import styles from '../styles/PynOrgMembers.module.scss'
import { canRemove, ORG_ROLES } from '../state/org.state'
import { useReveal } from '../state/reveal.state'
import type { NewOrgMember, OrgMember, OrgRole } from '../types/org.types'

defineProps<{
  members: OrgMember[]
  self: string
  /** Owners change roles, remove people and add accounts. */
  owner: boolean
  busy?: boolean
  error?: string
  /** A polite status message, such as a confirmation after an invitation is sent. */
  notice?: string
}>()
const emit = defineEmits<{
  setRole: [{ user: string; role: OrgRole }]
  remove: [user: string]
  add: [NewOrgMember]
  cancel: []
}>()
/** Add form open; Add member shows while closed. The app closes it after a success. */
const adding = defineModel<boolean>('adding', { default: false })

const form = reactive<NewOrgMember>({ user: '', role: 'member' })
const confirming = ref('')
const field = ref<HTMLInputElement | null>(null)
const button = ref<HTMLButtonElement | null>(null)
useReveal(adding, field, button, () => {
  form.user = ''
  form.role = 'member'
})

function add() {
  emit('add', { user: form.user.trim(), role: form.role })
}
function cancel() {
  adding.value = false
  emit('cancel')
}

function remove() {
  emit('remove', confirming.value)
  confirming.value = ''
}

const change = (user: string, e: Event) =>
  emit('setRole', { user, role: (e.target as HTMLSelectElement).value as OrgRole })
</script>

<template>
  <section :class="styles.page">
    <ul v-if="members.length" :class="styles.list">
      <li v-for="m in members" :key="m.user" :class="styles.item">
        <strong><PynPerson :name="m.user" :identity="m.identity" /></strong>
        <form v-if="confirming === m.user" :class="styles.confirm" @submit.prevent="remove">
          <span :class="styles.note"
            >{{ m.user === self ? 'Leaving' : 'Removing' }} also drops direct roles on the
            organization's repositories.</span
          >
          <button type="submit" :class="styles.danger" :disabled="busy">
            {{ m.user === self ? 'Leave' : `Remove ${m.user}` }}
          </button>
          <button type="button" :class="styles.quiet" @click="confirming = ''">Cancel</button>
        </form>
        <span v-else :class="styles.actions">
          <select
            v-if="owner"
            :class="styles.input"
            :value="m.role"
            :aria-label="`Role of ${m.user}`"
            :disabled="busy"
            @change="change(m.user, $event)"
          >
            <option v-for="r in ORG_ROLES" :key="r" :value="r">{{ r }}</option>
          </select>
          <span v-else :class="styles.pill" data-role>{{ m.role }}</span>
          <button
            v-if="canRemove(m, self, owner)"
            type="button"
            :class="styles.danger"
            :disabled="busy"
            @click="confirming = m.user"
          >
            {{ m.user === self ? 'Leave' : 'Remove' }}
          </button>
        </span>
      </li>
    </ul>
    <p v-else :class="styles.empty">No members.</p>
    <p v-if="notice" :class="styles.notice" role="status">{{ notice }}</p>
    <p v-if="error && !(owner && adding)" :class="styles.error" role="alert">{{ error }}</p>

    <form v-if="owner && adding" :class="styles.form" @submit.prevent="add">
      <h3 :class="styles.subheading">Add an existing account</h3>
      <label :class="styles.field"
        >User name
        <input
          ref="field"
          v-model="form.user"
          :class="styles.input"
          required
          autocapitalize="none"
        />
      </label>
      <label :class="styles.field"
        >Role
        <select v-model="form.role" :class="styles.input">
          <option v-for="r in ORG_ROLES" :key="r" :value="r">{{ r }}</option>
        </select>
      </label>
      <p v-if="error" :class="styles.error" role="alert">{{ error }}</p>
      <div :class="styles.formActions">
        <button type="submit" :class="styles.primary" :disabled="busy">Add</button>
        <button type="button" :class="styles.quiet" @click="cancel">Cancel</button>
      </div>
    </form>
    <button
      v-else-if="owner"
      ref="button"
      type="button"
      :class="styles.primary"
      @click="adding = true"
    >
      Add member
    </button>
  </section>
</template>
