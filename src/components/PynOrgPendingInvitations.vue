<script setup lang="ts">
import styles from '../styles/PynOrgPendingInvitations.module.scss'
import { formatDate } from '../utils/datetime'
import type { OrgInvitation } from '../types/org.types'

defineProps<{ invitations: OrgInvitation[]; busy?: boolean; error?: string }>()
const emit = defineEmits<{ cancel: [user: string] }>()
</script>

<template>
  <section :class="styles.page">
    <p v-if="error" :class="styles.error" role="alert">{{ error }}</p>
    <table v-if="invitations.length" :class="styles.table">
      <thead>
        <tr>
          <th scope="col">User</th>
          <th scope="col">Role</th>
          <th scope="col">Invited by</th>
          <th scope="col">Expires</th>
          <th scope="col"><span :class="styles.hidden">Actions</span></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="i in invitations" :key="i.user">
          <td>
            <strong>{{ i.user }}</strong>
          </td>
          <td>
            <span :class="styles.pill" data-role>{{ i.role }}</span>
          </td>
          <td>{{ i.invited_by }}</td>
          <td>
            <time :datetime="i.expires_at">{{ formatDate(i.expires_at) }}</time>
          </td>
          <td :class="styles.actions">
            <button
              type="button"
              :class="styles.danger"
              :disabled="busy"
              :aria-label="`Cancel invitation for ${i.user}`"
              @click="emit('cancel', i.user)"
            >
              Cancel
            </button>
          </td>
        </tr>
      </tbody>
    </table>
    <p v-else :class="styles.empty">No pending invitations.</p>
  </section>
</template>
