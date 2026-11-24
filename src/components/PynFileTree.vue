<script setup lang="ts">
import { computed } from 'vue'
import PynIcon from './PynIcon.vue'
import PynLockIcon from './PynLockIcon.vue'
import styles from '../styles/PynFileTree.module.scss'
import { blobPath } from '../state/blob.state'
import { treeRows } from '../state/tree.state'
import type { TreeEntry } from '../types/tree.types'

const props = defineProps<{
  /** Every loaded path, flat; nesting follows each path. */
  entries: TreeEntry[]
  owner: string
  name: string
  /** Paths of the open folders. */
  expanded?: string[]
  /** The file shown, highlighted in the tree. */
  current?: string
  /** Folders whose children are still loading. */
  loading?: string[]
  /** Branch the file links keep; omitted is the default branch. */
  branch?: string
  /** Replaces the file link, for views that point a file at something other than its blob page. */
  hrefOf?: (path: string) => string
}>()
defineEmits<{ toggle: [path: string] }>()

const rows = computed(() => treeRows(props.entries, props.expanded ?? []))
const isOpen = (path: string) => props.expanded?.includes(path) ?? false
</script>

<template>
  <ul v-if="rows.length" :class="styles.tree" role="tree" aria-label="Files">
    <template v-for="{ entry: e, depth } in rows" :key="e.path">
      <li
        :class="[styles.row, e.path === current && styles.current]"
        role="treeitem"
        :aria-level="depth + 1"
        :aria-expanded="e.kind === 'folder' ? isOpen(e.path) : undefined"
        :aria-current="e.path === current ? 'page' : undefined"
        :data-kind="e.kind"
        :data-mode="e.mode"
        :style="{ '--depth': depth }"
      >
        <button
          v-if="e.kind === 'folder'"
          type="button"
          :class="styles.item"
          @click="$emit('toggle', e.path)"
        >
          <PynIcon name="chevron-right" :class="[styles.chevron, isOpen(e.path) && styles.open]" />
          <PynIcon name="folder" :class="styles.icon" />
          <span :class="styles.label">{{ e.name }}</span>
        </button>
        <a
          v-else
          :class="styles.item"
          :href="hrefOf ? hrefOf(e.path) : blobPath({ owner, name }, e.path, branch)"
        >
          <span :class="styles.chevron" />
          <PynIcon name="file" :class="styles.icon" />
          <span :class="styles.label">{{ e.name }}</span>
          <PynLockIcon
            v-if="e.mode === 'exclusive'"
            :class="[styles.lock, e.lock && styles.held]"
            :open="!e.lock"
          />
          <span v-if="e.mode === 'exclusive'" :class="styles.hidden">{{
            e.lock ? `Locked by ${e.lock.owner}` : 'Exclusive'
          }}</span>
        </a>
      </li>
      <li
        v-if="e.kind === 'folder' && isOpen(e.path) && loading?.includes(e.path)"
        :class="[styles.row, styles.loading]"
        role="none"
        :style="{ '--depth': depth + 1 }"
      >
        Loading…
      </li>
    </template>
  </ul>
</template>
