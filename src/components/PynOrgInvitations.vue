<script setup lang="ts">
import styles from '../styles/PynOrgInvitations.module.scss'
import PynOrgInvitation from './PynOrgInvitation.vue'
import type { OrgInvitation } from '../types/org.types'

defineProps<{
  invitations: OrgInvitation[]
  /** The organization whose invitation is being answered; its buttons are disabled. */
  busyOrg?: string
  error?: string
}>()
const emit = defineEmits<{ accept: [org: string]; decline: [org: string] }>()
</script>

<template>
  <section :class="styles.page">
    <p v-if="error" :class="styles.error" role="alert">{{ error }}</p>
    <ul v-if="invitations.length" :class="styles.list">
      <li v-for="i in invitations" :key="i.org">
        <PynOrgInvitation
          :invitation="i"
          :busy="busyOrg === i.org"
          @accept="emit('accept', $event)"
          @decline="emit('decline', $event)"
        />
      </li>
    </ul>
    <p v-else :class="styles.empty">No pending invitations.</p>
  </section>
</template>
