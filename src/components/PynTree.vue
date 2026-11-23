<script setup lang="ts">
import { computed } from 'vue'
import PynIcon from './PynIcon.vue'
import PynLatestChange from './PynLatestChange.vue'
import PynLockBadge from './PynLockBadge.vue'
import PynModeChip from './PynModeChip.vue'
import styles from '../styles/PynTree.module.scss'
import { formatDateTime } from '../utils/datetime'
import { blobPath } from '../state/blob.state'
import { formatAgo } from '../utils/ago'
import { foldersFirst, latestChange, treePath } from '../state/tree.state'
import { repoPath } from '../state/repo.state'
import type { Revision } from '../types/repo.types'
import type { TreeEntry } from '../types/tree.types'

const props = defineProps<{
  entries: TreeEntry[]
  owner: string
  name: string
  me?: string
  now?: Date
  /** Branch the row links keep; omitted is the default branch. */
  branch?: string
  /** The listed folder, for the History link; empty is the root. */
  path?: string
  /** The header's latest change; omitted uses the newest among the entries. */
  latest?: Revision | null
}>()

const rows = computed(() => foldersFirst(props.entries))
const hasLocks = computed(() => props.entries.some((e) => e.lock))
const header = computed(() => props.latest ?? latestChange(props.entries))
const historyHref = computed(() => {
  const r = { owner: props.owner, name: props.name }
  const base = repoPath(r, 'history', props.branch)
  if (!props.path) return base
  return `${base}${base.includes('?') ? '&' : '?'}path=${encodeURIComponent(props.path)}`
})
</script>

<template>
  <div v-if="entries.length" :class="styles.box" :data-locks="hasLocks || undefined">
    <PynLatestChange v-if="header" :change="header" :now="now" :history-href="historyHref" />
    <table :class="styles.table">
      <caption :class="styles.caption">
        Files
      </caption>
      <colgroup>
        <col :class="styles.colName" />
        <col />
        <col :class="styles.colMode" />
        <col v-if="hasLocks" :class="styles.colLock" />
        <col :class="styles.colTime" />
      </colgroup>
      <tbody>
        <tr v-for="e in rows" :key="e.path" :class="styles.row" :data-kind="e.kind">
          <td :class="styles.name">
            <PynIcon :name="e.kind" :class="styles.icon" />
            <a
              :href="(e.kind === 'folder' ? treePath : blobPath)({ owner, name }, e.path, branch)"
              >{{ e.name }}</a
            >
          </td>
          <td :class="styles.message">
            <span v-if="e.last_change" :title="`r${e.last_change.id} by ${e.last_change.author}`">{{
              e.last_change.message || '(no message)'
            }}</span>
            <span v-else>No revision yet</span>
          </td>
          <td :class="styles.mode"><PynModeChip :mode="e.mode" /></td>
          <td v-if="hasLocks" :class="styles.lock">
            <PynLockBadge v-if="e.lock" :lock="e.lock" :me="me" :now="now" />
          </td>
          <td :class="styles.time">
            <time
              v-if="e.last_change"
              :datetime="e.last_change.created_at"
              :title="formatDateTime(e.last_change.created_at)"
              >{{ formatAgo(e.last_change.created_at, now ?? new Date()) }}</time
            >
          </td>
        </tr>
      </tbody>
    </table>
  </div>
  <p v-else :class="styles.empty">This folder is empty.</p>
</template>
