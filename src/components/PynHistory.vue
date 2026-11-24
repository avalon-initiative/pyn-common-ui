<script setup lang="ts">
import { computed, onBeforeUnmount, ref, watch } from 'vue'
import PynBranchPicker from './PynBranchPicker.vue'
import PynIcon from './PynIcon.vue'
import PynPerson from './PynPerson.vue'
import styles from '../styles/PynHistory.module.scss'
import { formatAgo } from '../utils/ago'
import { copyText } from '../utils/copy'
import { formatDateTime } from '../utils/datetime'
import { commitBody, commitSubject } from '../utils/commit-message'
import { pickerBranch } from '../state/branch-picker.state'
import { FILTER_DEBOUNCE_MS, HISTORY_RANGES, groupByDay } from '../state/history.state'
import type { HistoryRange } from '../state/history.state'
import type { BranchOption } from '../types/branch.types'
import type { RefKind, TagOption } from '../types/tag.types'
import type { Revision } from '../types/repo.types'

const props = defineProps<{
  revisions: Revision[]
  filter?: string
  path?: string
  hasMore?: boolean
  loading?: boolean
  busy?: boolean
  error?: string
  /** Heading above the toolbar; omitted shows none. */
  title?: string
  /** Shows the branch picker when `branches` is given; without `branch` it shows the default branch. */
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
  /** Adds a New branch button beside the picker; it emits `newBranch`. */
  newBranchButton?: boolean
  /** Authors offered by the user filter; omitted hides it. */
  users?: string[]
  /** The chosen author; empty is everyone. */
  user?: string
  /** Shows the time range filter. */
  range?: HistoryRange
  /** Where a row's browse link goes; omitted hides the link. */
  browseHref?: (rev: Revision) => string
  /** Ids of revisions that show a Verified badge. */
  verified?: number[]
  now?: Date
}>()
const emit = defineEmits<{
  filter: [string]
  more: []
  clearPath: []
  selectBranch: [name: string, kind: RefKind]
  newBranch: []
  selectUser: [user: string]
  selectRange: [range: HistoryRange]
  copy: [rev: Revision]
}>()

const typed = ref(props.filter ?? '')
const pickerName = computed(() => pickerBranch(props.branch, props.branches ?? []))
const copied = ref<number | null>(null)
let timer: ReturnType<typeof setTimeout> | undefined
let copyTimer: ReturnType<typeof setTimeout> | undefined

watch(typed, (v) => {
  clearTimeout(timer)
  timer = setTimeout(() => emit('filter', v.trim()), FILTER_DEBOUNCE_MS)
})
onBeforeUnmount(() => {
  clearTimeout(timer)
  clearTimeout(copyTimer)
})

async function copy(rev: Revision) {
  if (!(await copyText(`r${rev.id}`))) return
  copied.value = rev.id
  emit('copy', rev)
  clearTimeout(copyTimer)
  copyTimer = setTimeout(() => (copied.value = null), 2000)
}

const pick = (e: Event) => (e.target as HTMLSelectElement).value
</script>

<template>
  <section :class="styles.page">
    <h2 v-if="title" :class="styles.title">{{ title }}</h2>
    <div v-if="(pickerName && branches) || users || range" :class="styles.toolbar">
      <PynBranchPicker
        v-if="pickerName && branches"
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
        :new-branch-button="newBranchButton"
        :now="now"
        @select="(name, kind) => emit('selectBranch', name, kind)"
        @new-branch="emit('newBranch')"
      />
      <span :class="styles.filters">
        <label v-if="users" :class="styles.select">
          <PynIcon name="users" :class="styles.selectIcon" />
          <select
            :value="user ?? ''"
            aria-label="Filter by user"
            @change="emit('selectUser', pick($event))"
          >
            <option value="">All users</option>
            <option v-for="u in users" :key="u" :value="u">{{ u }}</option>
          </select>
        </label>
        <label v-if="range" :class="styles.select">
          <PynIcon name="calendar" :class="styles.selectIcon" />
          <select
            :value="range"
            aria-label="Filter by time range"
            @change="emit('selectRange', pick($event) as HistoryRange)"
          >
            <option v-for="r in HISTORY_RANGES" :key="r.value" :value="r.value">
              {{ r.label }}
            </option>
          </select>
        </label>
      </span>
    </div>
    <div v-if="path" :class="styles.scope">
      <span
        >History of <code :class="styles.path">{{ path }}</code></span
      >
      <button type="button" :class="styles.button" @click="emit('clearPath')">
        All repository history
      </button>
    </div>
    <div v-else :class="styles.search">
      <input
        v-model="typed"
        type="search"
        :class="styles.input"
        placeholder="Filter by path, e.g. *.ts"
        aria-label="Filter by path pattern"
        spellcheck="false"
      />
      <p :class="styles.hint">
        Glob over paths, for example <code>*.ts</code> or <code>Content/*.uasset</code>. A trailing
        <code>/</code> matches a folder.
      </p>
    </div>
    <p v-if="error" :class="styles.error" role="alert">{{ error }}</p>
    <p v-if="loading && !revisions.length" :class="styles.empty">Loading history…</p>
    <div v-else-if="revisions.length" :class="styles.timeline">
      <section v-for="group in groupByDay(revisions)" :key="group.day" :class="styles.day">
        <h3 :class="styles.dayTitle">
          <PynIcon name="commit" :class="styles.dayIcon" />Changes on {{ group.day }}
        </h3>
        <ul :class="styles.list">
          <li v-for="rev in group.revisions" :key="`${rev.id}:${rev.path}`" :class="styles.item">
            <div :class="styles.main">
              <div :class="styles.message">{{ commitSubject(rev.message) }}</div>
              <details v-if="commitBody(rev.message)" :class="styles.body">
                <summary :class="styles.bodyToggle">Description</summary>
                <pre :class="styles.bodyText">{{ commitBody(rev.message) }}</pre>
              </details>
              <div :class="styles.meta">
                <PynPerson
                  :name="rev.author"
                  :current="rev.author_current"
                  :identity="rev.author_public"
                />
                authored
                <time :datetime="rev.created_at" :title="formatDateTime(rev.created_at)">{{
                  formatAgo(rev.created_at, now ?? new Date())
                }}</time>
                <span :class="styles.path">{{ rev.path }}</span>
                <span v-if="rev.restored_from != null" :class="styles.pill"
                  >restored from r{{ rev.restored_from }}</span
                >
              </div>
            </div>
            <div :class="styles.actions">
              <span v-if="verified?.includes(rev.id)" :class="styles.verified" data-verified
                >Verified</span
              >
              <code :class="styles.rev" :title="`Revision ${rev.id}`">r{{ rev.id }}</code>
              <button
                type="button"
                :class="styles.icon"
                :aria-label="`Copy r${rev.id}`"
                :title="copied === rev.id ? 'Copied' : 'Copy revision'"
                @click="copy(rev)"
              >
                <PynIcon :name="copied === rev.id ? 'check' : 'copy'" />
              </button>
              <a
                v-if="browseHref"
                :href="browseHref(rev)"
                :class="styles.icon"
                :aria-label="`Browse the repository at r${rev.id}`"
                title="Browse the repository at this revision"
              >
                <PynIcon name="code" />
              </a>
            </div>
          </li>
        </ul>
      </section>
    </div>
    <p v-else-if="!error" :class="styles.empty">
      {{ path ? `No revisions of ${path}.` : filter ? 'No revisions match.' : 'No revisions yet.' }}
    </p>
    <button
      v-if="hasMore"
      type="button"
      :class="styles.button"
      :disabled="busy"
      @click="emit('more')"
    >
      Load more
    </button>
  </section>
</template>
