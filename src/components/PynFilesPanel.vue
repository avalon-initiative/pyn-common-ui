<script setup lang="ts">
import { computed, ref } from 'vue'
import PynBranchPicker from './PynBranchPicker.vue'
import PynFileTree from './PynFileTree.vue'
import PynIcon from './PynIcon.vue'
import styles from '../styles/PynFilesPanel.module.scss'
import { blobPath } from '../state/blob.state'
import { pickerBranch } from '../state/branch-picker.state'
import { matchFiles } from '../state/tree.state'
import type { BranchOption } from '../types/branch.types'
import type { RefKind, TagOption } from '../types/tag.types'
import type { TreeEntry } from '../types/tree.types'

const props = withDefaults(
  defineProps<{
    entries: TreeEntry[]
    owner: string
    name: string
    expanded?: string[]
    current?: string
    loading?: string[]
    branch?: string
    branches?: BranchOption[]
    branchesLoading?: boolean
    branchesError?: string
    branchesHref?: string
    /** Tags for the picker's Tags tab; omitted keeps the not-supported state there. */
    tags?: TagOption[]
    tagsLoading?: boolean
    tagsError?: string
    /** Where "View all tags" in the picker goes. */
    tagsHref?: string
    /** Whether the ref in view is a branch or a tag; omitted is a branch. */
    currentKind?: RefKind
    creatable?: boolean
    /** Adds a New branch button beside the picker; it emits `newBranch`. */
    newBranchButton?: boolean
    /** Shrinks the panel to its toggle; omitted starts open, or closed on a narrow screen. */
    collapsed?: boolean
    now?: Date
  }>(),
  { collapsed: undefined },
)
const emit = defineEmits<{
  toggle: [path: string]
  selectBranch: [name: string, kind: RefKind]
  createBranch: [name: string]
  newBranch: []
  search: [query: string]
  open: [path: string]
  'update:collapsed': [value: boolean]
}>()

const narrow = typeof matchMedia === 'function' && matchMedia('(max-width: 40rem)').matches
const local = ref(narrow)
const shut = computed(() => props.collapsed ?? local.value)
const query = ref('')
const goto = ref<HTMLInputElement | null>(null)
const pickerName = computed(() => pickerBranch(props.branch, props.branches ?? []))
const found = computed(() => matchFiles(props.entries, query.value))

function flip() {
  local.value = !shut.value
  emit('update:collapsed', local.value)
}

function typed(e: Event) {
  query.value = (e.target as HTMLInputElement).value
  emit('search', query.value.trim())
}

function enter() {
  const first = found.value[0]
  if (first) emit('open', first.path)
}
</script>

<template>
  <nav :class="styles.panel" :data-collapsed="shut || undefined" aria-label="Files">
    <div :class="styles.head">
      <button
        type="button"
        :class="styles.toggle"
        :aria-expanded="!shut"
        :aria-label="shut ? 'Expand file tree' : 'Collapse file tree'"
        :title="shut ? 'Expand file tree' : 'Collapse file tree'"
        @click="flip"
      >
        <PynIcon name="sidebar" />
      </button>
      <h2 v-if="!shut" :class="styles.title">Files</h2>
    </div>
    <div v-if="!shut" :class="styles.body">
      <PynBranchPicker
        v-if="branches && pickerName"
        :branches="branches"
        :current="pickerName"
        :loading="branchesLoading"
        :error="branchesError"
        :all-href="branchesHref"
        :tags="tags"
        :tags-loading="tagsLoading"
        :tags-error="tagsError"
        :tags-href="tagsHref"
        :current-kind="currentKind"
        :creatable="creatable"
        :new-branch-button="newBranchButton"
        search-button
        :now="now"
        @select="(name, kind) => emit('selectBranch', name, kind)"
        @create="emit('createBranch', $event)"
        @new-branch="emit('newBranch')"
        @search="goto?.focus()"
      />
      <label :class="styles.goto">
        <PynIcon name="search" :class="styles.icon" />
        <input
          ref="goto"
          :value="query"
          type="search"
          :class="styles.input"
          placeholder="Go to file"
          aria-label="Go to file"
          autocomplete="off"
          spellcheck="false"
          @input="typed"
          @keydown.enter.prevent="enter"
        />
      </label>
      <ul v-if="query.trim()" :class="styles.results" aria-label="Matching files">
        <li v-for="e in found" :key="e.path">
          <a :href="blobPath({ owner, name }, e.path, branch)" :class="styles.result">
            <PynIcon name="file" :class="styles.icon" />
            <span :class="styles.path">{{ e.path }}</span>
          </a>
        </li>
        <li v-if="!found.length" :class="styles.none">No matching files</li>
      </ul>
      <PynFileTree
        v-else
        :entries="entries"
        :owner="owner"
        :name="name"
        :expanded="expanded"
        :current="current"
        :loading="loading"
        :branch="branch"
        @toggle="emit('toggle', $event)"
      />
    </div>
  </nav>
</template>
