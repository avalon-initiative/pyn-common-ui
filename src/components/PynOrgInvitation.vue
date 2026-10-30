<script setup lang="ts">
import styles from '../styles/PynOrgInvitation.module.scss'
import { formatDate } from '../utils/datetime'
import type { OrgInvitation } from '../types/org.types'

defineProps<{ invitation: OrgInvitation; busy?: boolean }>()
const emit = defineEmits<{ accept: [org: string]; decline: [org: string] }>()
</script>

<template>
  <article :class="styles.card" :aria-label="`Invitation to ${invitation.org}`">
    <div :class="styles.who">
      <strong data-org>{{ invitation.org }}</strong>
      <span :class="styles.pill" data-role>{{ invitation.role }}</span>
      <span :class="styles.meta">
        invited by <span data-invited-by>{{ invitation.invited_by }}</span
        >, expires
        <time data-expires :datetime="invitation.expires_at">{{
          formatDate(invitation.expires_at)
        }}</time>
      </span>
    </div>
    <span :class="styles.actions">
      <button
        type="button"
        :class="styles.primary"
        :disabled="busy"
        :aria-label="`Accept invitation to ${invitation.org}`"
        @click="emit('accept', invitation.org)"
      >
        Accept
      </button>
      <button
        type="button"
        :class="styles.quiet"
        :disabled="busy"
        :aria-label="`Decline invitation to ${invitation.org}`"
        @click="emit('decline', invitation.org)"
      >
        Decline
      </button>
    </span>
  </article>
</template>
