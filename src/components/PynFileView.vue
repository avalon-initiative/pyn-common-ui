<script setup lang="ts">
import { onBeforeUnmount, ref } from 'vue'
import PynBreadcrumb from './PynBreadcrumb.vue'
import PynCodeView from './PynCodeView.vue'
import PynFileBar from './PynFileBar.vue'
import PynFilesPanel from './PynFilesPanel.vue'
import PynIcon from './PynIcon.vue'
import PynMarkdown from './PynMarkdown.vue'
import styles from '../styles/PynFileView.module.scss'
import { baseName, fileCrumbs, parentOf, textStats } from '../state/blob.state'
import { treePath } from '../state/tree.state'
import { copyText } from '../utils/copy'
import type { BranchOption } from '../types/branch.types'
import type { LineRange } from '../types/code.types'
import type { FileBody } from '../types/blob.types'
import type { TreeEntry } from '../types/tree.types'

const props = withDefaults(
  defineProps<{
    owner: string
    name: string
    path: string
    entry?: TreeEntry | null
    /** Null while the content loads. */
    body?: FileBody | null
    /** No file at this path (or it is a folder). */
    missing?: boolean
    me?: string
    now?: Date
    /** Highlighted line range of a code file. */
    lines?: LineRange | null
    /** Branch the links keep; omitted is the default branch. */
    branch?: string
    /** Shows the Lock action on an unlocked exclusive file. */
    lockable?: boolean
    /** Policy rule line in the file header, e.g. "Exclusive: matches rule ..."; the `note` slot overrides it. */
    note?: string
    /** Every loaded path, flat; shows the Files panel beside the file. */
    tree?: TreeEntry[]
    /** Paths of the open folders in the panel. */
    expanded?: string[]
    /** Folders of the panel whose children are loading. */
    treeLoading?: string[]
    branches?: BranchOption[]
    branchesLoading?: boolean
    branchesError?: string
    /** Where "View all branches" in the picker goes. */
    branchesHref?: string
    /** Offers creating a branch from the picker. */
    creatable?: boolean
    /** Adds a New branch button beside the picker; it emits `newBranch`. */
    newBranchButton?: boolean
    /** The panel's collapsed state; omitted lets it keep its own. */
    collapsed?: boolean
  }>(),
  { collapsed: undefined },
)

const emit = defineEmits<{
  selectLines: [range: LineRange]
  lock: []
  toggleFolder: [path: string]
  selectBranch: [name: string]
  createBranch: [name: string]
  newBranch: []
  search: [query: string]
  open: [path: string]
  'update:collapsed': [value: boolean]
}>()

const copied = ref(false)
let timer: ReturnType<typeof setTimeout> | undefined

async function copyPath() {
  copied.value = await copyText(props.path)
  clearTimeout(timer)
  timer = setTimeout(() => (copied.value = false), 2000)
}
onBeforeUnmount(() => clearTimeout(timer))
</script>

<template>
  <div :class="styles.layout" :data-panel="tree ? '' : undefined">
    <PynFilesPanel
      v-if="tree"
      :entries="tree"
      :owner="owner"
      :name="name"
      :expanded="expanded"
      :current="path"
      :loading="treeLoading"
      :branch="branch"
      :branches="branches"
      :branches-loading="branchesLoading"
      :branches-error="branchesError"
      :branches-href="branchesHref"
      :creatable="creatable"
      :new-branch-button="newBranchButton"
      :collapsed="collapsed"
      :now="now"
      @toggle="emit('toggleFolder', $event)"
      @select-branch="emit('selectBranch', $event)"
      @create-branch="emit('createBranch', $event)"
      @new-branch="emit('newBranch')"
      @search="emit('search', $event)"
      @open="emit('open', $event)"
      @update:collapsed="emit('update:collapsed', $event)"
    />
    <div :class="styles.view">
      <div :class="styles.header">
        <PynBreadcrumb :crumbs="fileCrumbs({ owner, name }, path, branch)" />
        <button
          type="button"
          :class="styles.copy"
          aria-label="Copy path"
          :title="copied ? 'Copied' : 'Copy path'"
          @click="copyPath"
        >
          <PynIcon :name="copied ? 'check' : 'copy'" />
        </button>
      </div>
      <div v-if="missing" :class="styles.notice" role="alert">
        <p>
          There is no file <code>/{{ path }}</code> in this repository.
        </p>
        <a :href="treePath({ owner, name }, parentOf(path), branch)">Back to the folder</a>
      </div>
      <template v-else-if="entry">
        <div :class="styles.box">
          <PynFileBar
            :entry="entry"
            :owner="owner"
            :name="name"
            :me="me"
            :now="now"
            :branch="branch"
            :lockable="lockable"
            :stats="
              body?.kind === 'code' || body?.kind === 'markdown' ? textStats(body.text) : undefined
            "
            :note="note"
            :text="body?.kind === 'code' || body?.kind === 'markdown' ? body.text : undefined"
            embedded
            @lock="$emit('lock')"
          >
            <template v-if="$slots.note" #note><slot name="note" /></template>
          </PynFileBar>
          <p v-if="!body" :class="styles.inner">Loading...</p>
          <div v-else-if="body.kind === 'markdown'" :class="styles.panel">
            <PynMarkdown
              :source="body.text"
              :owner="owner"
              :name="name"
              :dir="parentOf(path)"
              :branch="branch"
            />
          </div>
          <PynCodeView
            v-else-if="body.kind === 'code'"
            :text="body.text"
            :language="body.language"
            :range="lines"
            embedded
            @select="$emit('selectLines', $event)"
          />
          <div v-else-if="body.kind === 'image'" :class="[styles.panel, styles.image]">
            <img :src="body.src" :alt="baseName(path)" />
          </div>
          <p v-else-if="body.kind === 'empty'" :class="styles.inner">This file is empty.</p>
          <p v-else-if="body.kind === 'none'" :class="styles.inner">
            This file is locked but has no revision yet.
          </p>
          <p v-else-if="body.kind === 'large'" :class="styles.inner">
            This file is too large to display. Download it to read it.
          </p>
          <p v-else :class="styles.inner">This is a binary file. Download it to open it.</p>
        </div>
      </template>
    </div>
  </div>
</template>
