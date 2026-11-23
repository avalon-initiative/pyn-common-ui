<script setup lang="ts">
import PynLatestChange from './PynLatestChange.vue'
import PynLockBadge from './PynLockBadge.vue'
import PynModeChip from './PynModeChip.vue'
import styles from '../styles/PynFileBar.module.scss'
import { baseName, contentUrl, historyLink } from '../state/blob.state'
import type { TreeEntry } from '../types/tree.types'

defineProps<{
  entry: TreeEntry
  owner: string
  name: string
  me?: string
  now?: Date
  /** Branch the History and Raw links keep; omitted is the default branch. */
  branch?: string
  /** "9 lines · 188 B"; omitted hides it. */
  stats?: string
  /** Shows the Lock action on an unlocked exclusive file. */
  lockable?: boolean
  /** Drops the box border so a parent can frame it. */
  embedded?: boolean
  /** Policy rule line shown beside the mode chip; the `note` slot overrides it. */
  note?: string
}>()

defineEmits<{ lock: [] }>()
</script>

<template>
  <div :class="styles.bar" :data-embedded="embedded || undefined">
    <PynLatestChange v-if="entry.last_change" :change="entry.last_change" :now="now" />
    <div v-else :class="styles.none">No revision yet</div>
    <div :class="styles.toolbar">
      <span :class="styles.info">
        <PynModeChip :mode="entry.mode" />
        <PynLockBadge v-if="entry.mode === 'exclusive'" :lock="entry.lock" :me="me" :now="now" />
        <span v-if="note || $slots.note" :class="styles.note" data-note
          ><slot name="note">{{ note }}</slot></span
        >
        <span v-if="stats" :class="styles.stats">{{ stats }}</span>
      </span>
      <span :class="styles.actions">
        <a
          v-if="entry.last_change"
          :href="contentUrl({ owner, name }, entry.path, undefined, branch)"
          :class="styles.action"
          >Raw</a
        >
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
        <button
          v-if="lockable && entry.mode === 'exclusive' && !entry.lock"
          type="button"
          :class="styles.action"
          @click="$emit('lock')"
        >
          Lock
        </button>
      </span>
    </div>
  </div>
</template>
