<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import PynCommentForm from './PynCommentForm.vue'
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
    /** Adds edit buttons to the title and the description; they emit `saveTitle` and `saveBody`. */
    editable?: boolean
    titleSaving?: boolean
    titleError?: string
    bodySaving?: boolean
    bodyError?: string
    canMerge?: boolean
    /** Offers "Ready for review" on a draft; defaults to `canMerge`. */
    canMarkReady?: boolean
    /** Lets the merge go over other people's locks after a confirm. */
    canOverrideLocks?: boolean
    canManage?: boolean
    merging?: boolean
    mergeError?: string
  }>(),
  { tab: 'overview', canMerge: true, canMarkReady: undefined },
)
const method = defineModel<PullMergeMethod>('method', { default: 'allow' })
const layout = defineModel<DiffLayout>('layout', { default: 'unified' })
const filter = defineModel<string>('filter', { default: '' })
const emit = defineEmits<{
  merge: [method: PullMergeMethod]
  ready: []
  close: []
  reopen: []
  editTitle: []
  saveTitle: [title: string]
  saveBody: [body: string]
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

// The editor closes on Cancel, on an unchanged Save, or when the saved description arrives.
const editingBody = ref(false)
const bodyDraft = ref('')
function editBody() {
  bodyDraft.value = props.pull.body
  editingBody.value = true
}
function saveBody(body: string) {
  if (body === props.pull.body) editingBody.value = false
  else emit('saveBody', body)
}
watch(
  () => props.pull.body,
  () => (editingBody.value = false),
)

// The bar shows once the header has scrolled under the sticky line.
const anchor = ref<HTMLElement | null>(null)
const header = ref<HTMLElement | null>(null)
const stuck = ref(false)
function measure() {
  if (!anchor.value || !header.value) return
  stuck.value =
    header.value.getBoundingClientRect().bottom <= anchor.value.getBoundingClientRect().top
}
const scrollOptions = { capture: true, passive: true }
onMounted(() => {
  window.addEventListener('scroll', measure, scrollOptions)
  window.addEventListener('resize', measure, scrollOptions)
  measure()
})
onBeforeUnmount(() => {
  window.removeEventListener('scroll', measure, scrollOptions)
  window.removeEventListener('resize', measure, scrollOptions)
})
</script>

<template>
  <div :class="styles.page" :data-state="pull.state" :data-draft="pull.draft || undefined">
    <div ref="anchor" :class="styles.sticky">
      <PynPullRequestBar
        v-show="stuck"
        :class="styles.bar"
        :number="pull.number"
        :title="pull.title"
        :state="pull.state"
        :draft="pull.draft"
      >
        <slot name="bar-actions" />
      </PynPullRequestBar>
    </div>
    <div :class="styles.head">
      <div v-if="$slots.notices" :class="styles.notices"><slot name="notices" /></div>
      <div ref="header">
        <PynPullRequestHeader
          :pull="pull"
          :now="now"
          :editable="editable"
          :title-saving="titleSaving"
          :title-error="titleError"
          @edit-title="emit('editTitle')"
          @save-title="emit('saveTitle', $event)"
        />
      </div>
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
            :can-mark-ready="canMarkReady"
            :can-override-locks="canOverrideLocks"
            :busy="merging"
            :error="mergeError"
            @merge="emit('merge', $event)"
            @ready="emit('ready')"
          />
          <PynPullTimeline
            :events="timeline"
            :owner="owner"
            :name="name"
            :now="now"
            :editable-ids="editable ? ['description'] : undefined"
            :editing-id="editingBody ? 'description' : undefined"
            @edit="editBody"
          >
            <template #editor>
              <PynCommentForm
                v-model="bodyDraft"
                label="Description"
                placeholder="Add a description"
                submit-label="Save"
                :rows="8"
                allow-empty
                cancelable
                :busy="bodySaving"
                :error="bodyError"
                @submit="saveBody"
                @cancel="editingBody = false"
              />
            </template>
          </PynPullTimeline>
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
