<script setup lang="ts">
import { computed } from 'vue'
import styles from '../styles/PynAccessSessionHistory.module.scss'
import { newestFirst } from '../state/access-session.state'
import type { AccessSessionInfo } from '../types/access-session.types'
import PynAccessSessionItem from './PynAccessSessionItem.vue'

const props = defineProps<{ sessions: AccessSessionInfo[] }>()

const ordered = computed(() => newestFirst(props.sessions))
</script>

<template>
  <section :class="styles.page">
    <h2 :class="styles.heading">Administrator access</h2>
    <ul v-if="ordered.length" :class="styles.list">
      <PynAccessSessionItem v-for="s in ordered" :key="s.id" :session="s" />
    </ul>
    <p v-else :class="styles.empty">No administrator has acted as this account.</p>
  </section>
</template>
