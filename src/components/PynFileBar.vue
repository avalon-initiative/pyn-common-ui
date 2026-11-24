<script setup lang="ts">
import { onBeforeUnmount, ref } from 'vue'
import PynIcon from './PynIcon.vue'
import PynLatestChange from './PynLatestChange.vue'
import PynLockBadge from './PynLockBadge.vue'
import PynModeChip from './PynModeChip.vue'
import styles from '../styles/PynFileBar.module.scss'
import { baseName, contentUrl, historyLink } from '../state/blob.state'
import { copyText } from '../utils/copy'
import type { TreeEntry } from '../types/tree.types'

const props = defineProps<{
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
  /** The file's text; shows a Copy button that copies it. */
  text?: string
}>()

const emit = defineEmits<{ lock: []; copy: [text: string] }>()

const copied = ref(false)
const failed = ref(false)
let timer: ReturnType<typeof setTimeout> | undefined

async function copy() {
  const ok = await copyText(props.text ?? '')
  failed.value = !ok
  copied.value = ok
  clearTimeout(timer)
  if (ok) {
    emit('copy', props.text ?? '')
    timer = setTimeout(() => (copied.value = false), 2000)
  }
}
onBeforeUnmount(() => clearTimeout(timer))
</script>

<template>
  <div :class="styles.bar" :data-embedded="embedded || undefined">
    <PynLatestChange
      v-if="entry.last_change"
      :change="entry.last_change"
      :now="now"
      :history-href="historyLink({ owner, name }, entry.path, branch)"
    />
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
        <button
          v-if="text !== undefined"
          type="button"
          :class="[styles.action, styles.icon]"
          aria-label="Copy file contents"
          :title="copied ? 'Copied' : 'Copy file contents'"
          @click="copy"
        >
          <PynIcon :name="copied ? 'check' : 'copy'" />
        </button>
        <a
          v-if="entry.last_change"
          :href="contentUrl({ owner, name }, entry.path, undefined, branch)"
          :download="baseName(entry.path)"
          :class="[styles.action, styles.icon]"
          aria-label="Download"
          title="Download"
        >
          <PynIcon name="download" />
        </a>
        <button
          v-if="lockable && entry.mode === 'exclusive' && !entry.lock"
          type="button"
          :class="styles.action"
          @click="$emit('lock')"
        >
          Lock
        </button>
        <span :class="styles.hidden" role="status">{{
          failed ? 'Could not copy' : copied ? 'Copied' : ''
        }}</span>
      </span>
    </div>
  </div>
</template>
