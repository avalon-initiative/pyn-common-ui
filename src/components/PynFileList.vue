<script setup lang="ts">
import { computed } from 'vue'
import PynIcon from './PynIcon.vue'
import PynLockBadge from './PynLockBadge.vue'
import PynModeChip from './PynModeChip.vue'
import styles from '../styles/PynFileList.module.scss'
import { splitPath } from '../state/files.state'
import type { FileRow } from '../types/lock.types'

const props = defineProps<{
  rows: FileRow[]
  me?: string
  now?: Date
}>()

const hasLocks = computed(() => props.rows.some((r) => r.mode === 'exclusive'))
</script>

<template>
  <ul v-if="rows.length" :class="styles.list" :data-locks="hasLocks || undefined">
    <li v-for="row in rows" :key="row.path" :class="styles.row">
      <PynIcon name="file" :class="styles.icon" />
      <span :class="styles.path"
        ><span :class="styles.dir">{{ splitPath(row.path).dir }}</span
        ><wbr /><span :class="styles.name">{{ splitPath(row.path).name }}</span></span
      >
      <span :class="styles.meta">{{ row.revision != null ? `r${row.revision}` : '' }}</span>
      <span :class="styles.mode"><PynModeChip :mode="row.mode" /></span>
      <span v-if="hasLocks" :class="styles.lock"
        ><PynLockBadge v-if="row.mode === 'exclusive'" :lock="row.lock" :me="me" :now="now"
      /></span>
    </li>
  </ul>
  <p v-else :class="styles.empty">No files.</p>
</template>
