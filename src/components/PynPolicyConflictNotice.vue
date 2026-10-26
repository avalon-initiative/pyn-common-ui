<script setup lang="ts">
import styles from '../styles/PynPolicyConflictNotice.module.scss'
import type { PolicyNoticeKind, PolicyProblem } from '../types/policy.types'

defineProps<{
  kind: PolicyNoticeKind
  holder?: string
  problems?: PolicyProblem[]
  message?: string
  busy?: boolean
}>()
const emit = defineEmits<{
  takeLock: []
  reload: []
  discard: []
  retry: []
  dismiss: []
}>()

const TITLES: Record<PolicyNoticeKind, string> = {
  lock_required: 'Lock required',
  lock_held: 'Locked by someone else',
  stale_base: 'Policy changed since you opened it',
  invalid_rules: 'Invalid rules',
  error: 'Could not save',
}
</script>

<template>
  <div
    :class="[
      styles.notice,
      kind === 'lock_required' || kind === 'stale_base' ? styles.warn : styles.danger,
    ]"
    role="alert"
    aria-live="assertive"
  >
    <h3 :class="styles.title">{{ TITLES[kind] }}</h3>
    <p v-if="kind === 'lock_required'" :class="styles.text">
      The policy file is exclusive. Take its lock to save your changes.
    </p>
    <p v-else-if="kind === 'lock_held'" :class="styles.text">
      <strong>{{ holder }}</strong> holds the lock on the policy file, so your changes cannot be
      saved.
    </p>
    <p v-else-if="kind === 'stale_base'" :class="styles.text">
      A newer revision was checked in. Reload it, which replaces your edits, or keep editing.
    </p>
    <template v-else-if="kind === 'invalid_rules'">
      <p :class="styles.text">The policy was not saved because of these problems.</p>
      <ul :class="styles.problems">
        <li v-for="(p, i) in problems ?? []" :key="i">
          <code v-if="p.line !== undefined" :class="styles.line">Line {{ p.line }}</code>
          {{ p.message }}
        </li>
      </ul>
    </template>
    <p v-else :class="styles.text">{{ message || 'Something went wrong. Try again.' }}</p>

    <div :class="styles.actions">
      <button
        v-if="kind === 'lock_required'"
        type="button"
        :class="styles.primary"
        :disabled="busy"
        @click="emit('takeLock')"
      >
        Take lock
      </button>
      <button
        v-if="kind === 'stale_base' || kind === 'lock_held'"
        type="button"
        :class="styles.primary"
        :disabled="busy"
        @click="emit('reload')"
      >
        Reload latest
      </button>
      <button
        v-if="kind === 'error'"
        type="button"
        :class="styles.primary"
        :disabled="busy"
        @click="emit('retry')"
      >
        Try again
      </button>
      <button
        v-if="kind === 'lock_required' || kind === 'lock_held'"
        type="button"
        :class="styles.button"
        :disabled="busy"
        @click="emit('discard')"
      >
        Discard changes
      </button>
      <button
        v-if="kind === 'stale_base' || kind === 'invalid_rules' || kind === 'error'"
        type="button"
        :class="styles.button"
        @click="emit('dismiss')"
      >
        Keep editing
      </button>
    </div>
  </div>
</template>
