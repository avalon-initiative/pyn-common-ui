<script setup lang="ts">
import { computed, ref } from 'vue'
import styles from '../styles/PynUsernameChange.module.scss'
import { usernameProblem } from '../state/account-settings.state'
import type { RenameForm } from '../types/account.types'

const props = withDefaults(
  defineProps<{
    current: string
    /** False for an account with no password: it confirms from its signed-in session. */
    hasPassword?: boolean
    /** The account's repositories, whose old addresses redirect after the change. */
    repositories?: string[]
    busy?: boolean
    error?: string
  }>(),
  { hasPassword: true },
)
const emit = defineEmits<{ rename: [RenameForm] }>()

const next = ref('')
const password = ref('')
const understood = ref(false)
const tried = ref(false)

const problem = computed(() => usernameProblem(next.value.trim(), props.current))
const ready = computed(() => understood.value && (!props.hasPassword || password.value !== ''))

function submit() {
  tried.value = true
  if (problem.value || !ready.value || props.busy) return
  emit('rename', {
    username: next.value.trim(),
    ...(props.hasPassword ? { password: password.value } : {}),
  })
}
</script>

<template>
  <form :class="styles.form" novalidate @submit.prevent="submit">
    <h2 :class="styles.heading">Change user name</h2>
    <p :class="styles.note">
      Current name: <strong :class="styles.name">{{ current }}</strong>
    </p>
    <div :class="styles.warning" role="note">
      <p>Before you rename:</p>
      <ul :class="styles.consequences">
        <li>The old name is not reserved. Anyone may take it right away.</li>
        <li>
          Your repositories move to the new name. Each old address keeps working until someone under
          the old name creates a repository with the same name; that repository then wins, and links
          and remotes using the old name reach it.
        </li>
        <li>Update your remotes and links after renaming.</li>
        <li>The old profile address and @mentions of the old name are not redirected.</li>
        <li>
          Sessions, tokens, keys, memberships and held locks follow you. History keeps the name each
          change was written with.
        </li>
      </ul>
      <ul v-if="repositories?.length" :class="styles.repos" aria-label="Repositories that move">
        <li v-for="r in repositories" :key="r">{{ r }}</li>
      </ul>
    </div>
    <label :class="styles.field"
      >New user name
      <input
        v-model="next"
        :class="styles.input"
        autocomplete="off"
        autocapitalize="none"
        spellcheck="false"
        required
        :disabled="busy"
      />
    </label>
    <label v-if="hasPassword" :class="styles.field"
      >Confirm with your password
      <input
        v-model="password"
        :class="styles.input"
        type="password"
        autocomplete="current-password"
        required
        :disabled="busy"
      />
    </label>
    <label :class="styles.check">
      <input v-model="understood" type="checkbox" :disabled="busy" />
      I understand what changes
    </label>
    <p v-if="tried && problem" :class="styles.error" role="alert">{{ problem }}</p>
    <p v-else-if="error" :class="styles.error" role="alert">{{ error }}</p>
    <button type="submit" :class="styles.button" :disabled="busy || !ready">
      {{ busy ? 'Renaming…' : 'Change user name' }}
    </button>
  </form>
</template>
