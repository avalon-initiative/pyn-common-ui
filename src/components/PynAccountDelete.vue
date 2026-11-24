<script setup lang="ts">
import { computed, ref, inject } from 'vue'
import styles from '../styles/PynAccountDelete.module.scss'
import { DANGER_ZONE } from '../state/settings-section.state'
import type { AccountDeleteBlockers } from '../types/auth.types'

const props = defineProps<{
  /** The account signs in externally and has no password to confirm with. */
  external?: boolean
  blockers?: AccountDeleteBlockers
  /** Days the account can be restored before it is deleted. */
  recoveryDays?: number
  busy?: boolean
  error?: string
}>()
const bare = inject(DANGER_ZONE, undefined)
const emit = defineEmits<{ remove: [password?: string] }>()

const password = ref('')
const blocked = computed(() => !!(props.blockers?.repos.length || props.blockers?.orgs.length))
const ready = computed(() => !blocked.value && (props.external || password.value !== ''))

function submit() {
  if (ready.value && !props.busy) emit('remove', props.external ? undefined : password.value)
}
</script>

<template>
  <form :class="styles.form" :data-bare="bare || undefined" @submit.prevent="submit">
    <h3 :class="styles.heading">Delete this account</h3>
    <p :class="styles.note">
      The account is disabled and deleted after
      {{ recoveryDays ? `${recoveryDays} days` : 'the recovery window' }}; sign in before then to
      restore it. Its keys, tokens and memberships are removed. History keeps your name on past
      commits and the audit log.
    </p>
    <div v-if="blocked" :class="styles.blockers" role="alert">
      <p>Transfer or delete what this account owns first.</p>
      <ul v-if="blockers?.repos.length" :class="styles.blockerList" aria-label="Owned repositories">
        <li v-for="r in blockers.repos" :key="r">{{ r }}</li>
      </ul>
      <ul v-if="blockers?.orgs.length" :class="styles.blockerList" aria-label="Owned organizations">
        <li v-for="o in blockers.orgs" :key="o">{{ o }}</li>
      </ul>
    </div>
    <p v-if="external" :class="styles.note">
      This account signs in through an external provider, so no password is needed.
    </p>
    <label v-else :class="styles.field"
      >Confirm with your password
      <input
        v-model="password"
        type="password"
        autocomplete="current-password"
        :class="styles.input"
        :disabled="busy"
      />
    </label>
    <p v-if="error" :class="styles.error" role="alert">{{ error }}</p>
    <button type="submit" :class="styles.danger" :disabled="busy || !ready">Delete account</button>
  </form>
</template>
