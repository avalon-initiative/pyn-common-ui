<script setup lang="ts">
import styles from '../styles/PynAccountPendingDeletion.module.scss'
import { formatDateTime } from '../utils/datetime'

defineProps<{
  /** When the account is deleted unless restored (ISO timestamp). */
  deadline: string
  user?: string
  busy?: boolean
  error?: string
}>()
const emit = defineEmits<{ restore: [] }>()
</script>

<template>
  <section :class="styles.card">
    <h2 :class="styles.title">This account is scheduled for deletion</h2>
    <p :class="styles.text">
      <template v-if="user"
        >Account <strong>{{ user }}</strong
        >.
      </template>
      It is deleted on {{ formatDateTime(deadline) }}. Restore it before then to keep it.
    </p>
    <p v-if="error" :class="styles.error" role="alert">{{ error }}</p>
    <button type="button" :class="styles.restore" :disabled="busy" @click="emit('restore')">
      Restore account
    </button>
  </section>
</template>
