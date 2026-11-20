<script setup lang="ts">
import { computed } from 'vue'
import styles from '../styles/PynAccessSessionBanner.module.scss'
import { formatDateTime } from '../utils/datetime'
import { reasonLabel } from '../state/access-session.state'
import type { AccessSessionInfo } from '../types/access-session.types'

const props = defineProps<{ sessions: AccessSessionInfo[] }>()

const active = computed(() => props.sessions.filter((s) => s.state === 'active'))
</script>

<template>
  <div v-if="active.length" :class="styles.banner" role="status">
    <section v-for="s in active" :key="s.id" :class="styles.session">
      <h3 :class="styles.title">An administrator is acting as your account</h3>
      <p :class="styles.text">
        <strong>{{ s.admin }}</strong> started this session. Reason:
        <strong>{{ reasonLabel(s.reason) }}</strong>. It ends {{ formatDateTime(s.expires_at) }} at
        the latest.
      </p>
      <p v-if="s.notes" :class="styles.notes">{{ s.notes }}</p>
    </section>
  </div>
</template>
