<script setup lang="ts">
import { computed } from 'vue'
import PynDiffView from './PynDiffView.vue'
import PynEmptyState from './PynEmptyState.vue'
import PynMergeBox from './PynMergeBox.vue'
import PynPageColumns from './PynPageColumns.vue'
import PynPullCommits from './PynPullCommits.vue'
import PynPullRequestBar from './PynPullRequestBar.vue'
import PynPullRequestHeader from './PynPullRequestHeader.vue'
import PynPullSide from './PynPullSide.vue'
import PynPullTimeline from './PynPullTimeline.vue'
import PynTabs from './PynTabs.vue'
import styles from '../styles/PynPullRequestPage.module.scss'
import { pullTabs } from '../state/pull-request.state'
import type { DiffExpand, DiffFile, DiffLayout } from '../types/diff.types'
import type {
  PullCommit,
  PullEvent,
  PullMergeMethod,
  PullRequest,
  PullTab,
} from '../types/pull-request.types'

const props = withDefaults(
  defineProps<{
    pull: PullRequest
    tab?: PullTab
    /** The pull request's own path, e.g. `/acme/game/pulls/12`; the tabs append to it. */
    basePath: string
    owner: string
    name: string
    me?: string
    now?: Date
    commits?: PullCommit[]
    /** Comments and state changes after the description. */
    events?: PullEvent[]
    files?: DiffFile[]
    viewed?: string[]
    filesLoading?: boolean
    filesError?: string
    editable?: boolean
    canMerge?: boolean
    canManage?: boolean
    merging?: boolean
    mergeError?: string
  }>(),
  { tab: 'overview', canMerge: true },
)
const method = defineModel<PullMergeMethod>('method', { default: 'allow' })
const layout = defineModel<DiffLayout>('layout', { default: 'unified' })
const filter = defineModel<string>('filter', { default: '' })
const emit = defineEmits<{
  merge: [method: PullMergeMethod]
  close: []
  reopen: []
  editTitle: []
  expand: [DiffExpand]
  'update:viewed': [paths: string[]]
}>()

const tabs = computed(() => pullTabs(props.pull, props.basePath, props.tab))
const timeline = computed<PullEvent[]>(() => [
  {
    id: 'description',
    kind: 'comment',
    actor: props.pull.author,
    at: props.pull.opened_at,
    body: props.pull.body,
  },
  ...(props.events ?? []),
])
</script>

<template>
  <div :class="styles.page" :data-state="pull.state">
    <PynPullRequestBar :number="pull.number" :title="pull.title" :state="pull.state">
      <slot name="bar-actions" />
    </PynPullRequestBar>
    <div :class="styles.head">
      <PynPullRequestHeader
        :pull="pull"
        :now="now"
        :editable="editable"
        @edit-title="emit('editTitle')"
      />
      <PynTabs :items="tabs" label="Pull request" />
    </div>
    <div :class="styles.content">
      <PynPageColumns v-if="tab === 'overview'" side-label="Pull request details">
        <div :class="styles.main">
          <PynMergeBox
            v-model:method="method"
            :pull="pull"
            :me="me"
            :now="now"
            :can-merge="canMerge"
            :busy="merging"
            :error="mergeError"
            @merge="emit('merge', $event)"
          />
          <PynPullTimeline :events="timeline" :owner="owner" :name="name" :now="now" />
          <slot name="comment" />
        </div>
        <template #side>
          <PynPullSide
            :pull="pull"
            :can-manage="canManage"
            @close="emit('close')"
            @reopen="emit('reopen')"
          />
          <slot name="side" />
        </template>
      </PynPageColumns>
      <PynPullCommits v-else-if="tab === 'commits'" :commits="commits ?? []" :now="now" />
      <PynEmptyState
        v-else-if="tab === 'checks'"
        kind="unsupported"
        icon="check-circle"
        title="Checks are not supported yet"
        description="Commit statuses and checks are not available in pyn yet."
      />
      <PynDiffView
        v-else
        v-model:layout="layout"
        v-model:filter="filter"
        :files="files ?? []"
        :viewed="viewed"
        :me="me"
        :now="now"
        :loading="filesLoading"
        :error="filesError"
        @update:viewed="emit('update:viewed', $event)"
        @expand="emit('expand', $event)"
      >
        <template #toolbar><slot name="files-toolbar" /></template>
      </PynDiffView>
    </div>
  </div>
</template>
