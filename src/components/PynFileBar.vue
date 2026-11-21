<script setup lang="ts">
import PynLockBadge from './PynLockBadge.vue'
import PynPerson from './PynPerson.vue'
import PynModeChip from './PynModeChip.vue'
import styles from '../styles/PynFileBar.module.scss'
import { baseName, contentUrl, historyLink } from '../state/blob.state'
import { formatDateTime } from '../utils/datetime'
import { formatAgo } from '../utils/ago'
import type { TreeEntry } from '../types/tree.types'

defineProps<{
  entry: TreeEntry
  owner: string
  name: string
  me?: string
  now?: Date
  /** Branch the History and Download links keep; omitted is the default branch. */
  branch?: string
}>()
</script>

<template>
  <div :class="styles.bar">
    <div :class="styles.top">
      <span :class="styles.file">{{ baseName(entry.path) }}</span>
      <PynModeChip :mode="entry.mode" />
      <PynLockBadge v-if="entry.mode === 'exclusive'" :lock="entry.lock" :me="me" :now="now" />
      <span :class="styles.actions">
        <a :href="historyLink({ owner, name }, entry.path, branch)" :class="styles.action"
          >History</a
        >
        <a
          v-if="entry.last_change"
          :href="contentUrl({ owner, name }, entry.path, undefined, branch)"
          :download="baseName(entry.path)"
          :class="styles.action"
          >Download</a
        >
      </span>
    </div>
    <p v-if="entry.last_change" :class="styles.change">
      <span :class="styles.rev" :title="`Revision ${entry.last_change.id}`"
        >r{{ entry.last_change.id }}</span
      >
      <span :class="styles.message">{{ entry.last_change.message || '(no message)' }}</span>
      <span :class="styles.meta">
        <PynPerson
          :name="entry.last_change.author"
          :current="entry.last_change.author_current"
          :identity="entry.last_change.author_public"
        />
        ·
        <span :title="formatDateTime(entry.last_change.created_at)">{{
          formatAgo(entry.last_change.created_at, now ?? new Date())
        }}</span>
      </span>
    </p>
    <p v-else :class="styles.change">
      <span :class="styles.meta">No revision yet</span>
    </p>
  </div>
</template>
