<script setup lang="ts">
import { computed, ref } from 'vue'
import PynDiffFile from './PynDiffFile.vue'
import PynEmptyState from './PynEmptyState.vue'
import PynFileTree from './PynFileTree.vue'
import PynIcon from './PynIcon.vue'
import PynLoading from './PynLoading.vue'
import styles from '../styles/PynDiffView.module.scss'
import {
  diffAnchor,
  diffTotals,
  diffTreeEntries,
  filterDiffFiles,
  viewedText,
} from '../state/diff.state'
import type { DiffExpand, DiffFile, DiffLayout } from '../types/diff.types'

const props = defineProps<{
  files: DiffFile[]
  /** Paths marked viewed; a viewed file collapses. */
  viewed?: string[]
  me?: string
  now?: Date
  loading?: boolean
  error?: string
}>()
const layout = defineModel<DiffLayout>('layout', { default: 'unified' })
const filter = defineModel<string>('filter', { default: '' })
const emit = defineEmits<{ 'update:viewed': [paths: string[]]; expand: [DiffExpand] }>()

const narrow = typeof matchMedia === 'function' && matchMedia('(max-width: 40rem)').matches
const treeShut = ref(narrow)
const collapsed = ref<string[]>([])
const closedFolders = ref<string[]>([])

const shown = computed(() => filterDiffFiles(props.files, filter.value))
const entries = computed(() => diffTreeEntries(shown.value))
const expanded = computed(() =>
  entries.value
    .filter((e) => e.kind === 'folder' && !closedFolders.value.includes(e.path))
    .map((e) => e.path),
)
const totals = computed(() => diffTotals(props.files))
const viewedCount = computed(() => props.files.filter((f) => props.viewed?.includes(f.path)).length)
const isViewed = (path: string) => props.viewed?.includes(path) ?? false
const isCollapsed = (path: string) => collapsed.value.includes(path) || isViewed(path)

function setCollapsed(path: string, value: boolean) {
  collapsed.value = value
    ? [...collapsed.value.filter((p) => p !== path), path]
    : collapsed.value.filter((p) => p !== path)
}

function setViewed(path: string, value: boolean) {
  const rest = (props.viewed ?? []).filter((p) => p !== path)
  setCollapsed(path, value)
  emit('update:viewed', value ? [...rest, path] : rest)
}

function toggleFolder(path: string) {
  closedFolders.value = closedFolders.value.includes(path)
    ? closedFolders.value.filter((p) => p !== path)
    : [...closedFolders.value, path]
}
</script>

<template>
  <div :class="styles.view" :data-tree-shut="treeShut || undefined">
    <nav v-if="!treeShut" :class="styles.tree" aria-label="Changed files">
      <label :class="styles.filter">
        <PynIcon name="search" :class="styles.icon" />
        <input
          v-model="filter"
          type="search"
          :class="styles.input"
          placeholder="Filter files…"
          aria-label="Filter files"
          autocomplete="off"
          spellcheck="false"
        />
      </label>
      <PynFileTree
        v-if="entries.length"
        owner=""
        name=""
        :entries="entries"
        :expanded="expanded"
        :hrefOf="(path) => `#${diffAnchor(path)}`"
        @toggle="toggleFolder"
      />
      <p v-else :class="styles.none">No matching files</p>
    </nav>
    <div :class="styles.main">
      <div :class="styles.bar">
        <button
          type="button"
          :class="styles.toggle"
          :aria-expanded="!treeShut"
          :aria-label="treeShut ? 'Show file tree' : 'Hide file tree'"
          :title="treeShut ? 'Show file tree' : 'Hide file tree'"
          @click="treeShut = !treeShut"
        >
          <PynIcon name="sidebar" />
        </button>
        <slot name="toolbar" />
        <span :class="styles.layout" role="group" aria-label="Diff layout">
          <button
            type="button"
            :aria-pressed="layout === 'unified'"
            data-layout="unified"
            @click="layout = 'unified'"
          >
            <PynIcon name="rows" />Unified
          </button>
          <button
            type="button"
            :aria-pressed="layout === 'split'"
            data-layout="split"
            @click="layout = 'split'"
          >
            <PynIcon name="columns" />Split
          </button>
        </span>
        <span :class="styles.progress" data-viewed-count>{{
          viewedText(viewedCount, totals.files)
        }}</span>
      </div>
      <PynLoading v-if="loading" variant="block" />
      <p v-else-if="error" :class="styles.error" role="alert">{{ error }}</p>
      <PynEmptyState
        v-else-if="!files.length"
        kind="empty"
        icon="file-diff"
        title="No changes"
        description="There are no file changes to show."
      />
      <PynEmptyState
        v-else-if="!shown.length"
        compact
        kind="empty"
        icon="search"
        title="No matches"
        description="No changed file matches the filter."
      />
      <div v-else :class="styles.files">
        <PynDiffFile
          v-for="f in shown"
          :key="f.path"
          :file="f"
          :layout="layout"
          :viewed="isViewed(f.path)"
          :collapsed="isCollapsed(f.path)"
          :me="me"
          :now="now"
          @update:collapsed="setCollapsed(f.path, $event)"
          @update:viewed="setViewed(f.path, $event)"
          @expand="emit('expand', $event)"
        />
      </div>
    </div>
  </div>
</template>
