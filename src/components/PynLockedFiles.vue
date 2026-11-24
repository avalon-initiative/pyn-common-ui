<script setup lang="ts">
import { computed } from 'vue'
import PynLockBadge from './PynLockBadge.vue'
import PynIcon from './PynIcon.vue'
import styles from '../styles/PynLockedFiles.module.scss'
import { repoPath } from '../state/repo.state'
import type { LockInfo } from '../types/lock.types'

const props = withDefaults(
  defineProps<{
    locks: LockInfo[]
    owner: string
    name: string
    me?: string
    now?: Date
    /** Locks listed, soonest to expire first; the rest are behind View all. */
    max?: number
  }>(),
  { max: 5 },
)
const shown = computed(() =>
  [...props.locks].sort((a, b) => a.expires_at.localeCompare(b.expires_at)).slice(0, props.max),
)
</script>

<template>
  <section :class="styles.card" aria-labelledby="locked-title">
    <div :class="styles.head">
      <h2 id="locked-title" :class="styles.title">Locked files</h2>
      <a :href="repoPath({ owner, name }, 'locks')" :class="styles.more"
        >View all<template v-if="locks.length > shown.length"> ({{ locks.length }})</template></a
      >
    </div>
    <ul v-if="shown.length" :class="styles.list" aria-label="Next locks to expire">
      <li v-for="lock in shown" :key="lock.path" :class="styles.item">
        <PynIcon name="file" :class="styles.icon" />
        <span :class="styles.path">{{ lock.path }}</span>
        <PynLockBadge :lock="lock" :me="me" :now="now" />
      </li>
    </ul>
    <p v-else :class="styles.empty">No files are locked.</p>
  </section>
</template>
