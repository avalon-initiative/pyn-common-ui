<script setup lang="ts">
import { computed, ref } from 'vue'
import PynConfirmDialog from './PynConfirmDialog.vue'
import PynIcon from './PynIcon.vue'
import PynLockBadge from './PynLockBadge.vue'
import PynMenu from './PynMenu.vue'
import styles from '../styles/PynMergeBox.module.scss'
import {
  MERGE_METHODS,
  isDraft,
  mergeBlockers,
  mergeStatus,
  pullLocksByOthers,
  segmentFill,
} from '../state/pull-request.state'
import type { PullMergeMethod, PullRequest } from '../types/pull-request.types'

const props = withDefaults(
  defineProps<{
    pull: PullRequest
    /** The signed-in user; their own locks do not block the merge. */
    me?: string
    now?: Date
    /** Hides the merge button, for a viewer who may not merge. */
    canMerge?: boolean
    /** Offers "Ready for review" on a draft; defaults to `canMerge`. */
    canMarkReady?: boolean
    /** Lets the merge go over other people's locks, after a confirm; the locks stay listed. */
    canOverrideLocks?: boolean
    busy?: boolean
    error?: string
  }>(),
  { canMerge: true, canMarkReady: undefined },
)
const method = defineModel<PullMergeMethod>('method', { default: 'allow' })
const emit = defineEmits<{ merge: [method: PullMergeMethod]; ready: [] }>()

const status = computed(() =>
  mergeStatus(props.pull, props.me, { overrideLocks: props.canOverrideLocks }),
)
const blockers = computed(() =>
  mergeBlockers(props.pull, props.me).filter((b) => !(b === 'locks' && props.canOverrideLocks)),
)
const blocked = computed(() => blockers.value.length > 0)
const others = computed(() => pullLocksByOthers(props.pull.locks, props.me))
const draft = computed(() => isDraft(props.pull))
const canReady = computed(() => props.canMarkReady ?? props.canMerge)
const overriding = computed(() => props.canOverrideLocks && others.value.length > 0)
const confirming = ref(false)
function merge() {
  if (overriding.value) confirming.value = true
  else emit('merge', method.value)
}
function confirmMerge() {
  confirming.value = false
  emit('merge', method.value)
}
const open = computed(() => props.pull.state === 'open')
const current = computed(() => MERGE_METHODS.find((m) => m.id === method.value)!)
const menu = computed(() =>
  MERGE_METHODS.map((m) => ({ id: m.id, label: m.label, checked: m.id === method.value })),
)
const ICON = {
  success: 'check-circle',
  attention: 'lock',
  danger: 'alert',
  neutral: 'info',
  merged: 'merge',
}
const approvals = computed(() => props.pull.approvals)
const threads = computed(() => props.pull.threads)
</script>

<template>
  <section :class="styles.box" :data-tone="status.tone" aria-label="Merge">
    <div :class="styles.head">
      <span :class="styles.icon" aria-hidden="true"><PynIcon :name="ICON[status.tone]" /></span>
      <div :class="styles.status">
        <h2 :class="styles.title" data-status>{{ status.title }}</h2>
        <p :class="styles.text">{{ status.text }}</p>
      </div>
      <div v-if="open && draft && canReady" :class="styles.actions">
        <button
          type="button"
          :class="styles.ready"
          :disabled="busy"
          data-ready
          @click="emit('ready')"
        >
          Ready for review
        </button>
      </div>
      <div v-else-if="open && !draft && canMerge" :class="styles.actions">
        <span :class="[styles.split, overriding && styles.override]">
          <button
            type="button"
            :class="styles.merge"
            :disabled="blocked || busy"
            :title="
              overriding ? 'Merge although other people hold locks on changed paths' : current.hint
            "
            :data-override="overriding || undefined"
            data-merge
            @click="merge"
          >
            <PynIcon v-if="overriding" name="lock-open" />
            {{ busy ? 'Merging…' : overriding ? 'Merge over locks' : current.label }}
          </button>
          <PynMenu
            :class="styles.methods"
            label="Merge method"
            :items="menu"
            align="end"
            fixed
            @select="method = $event as PullMergeMethod"
          >
            <PynIcon name="chevron" />
          </PynMenu>
        </span>
      </div>
    </div>
    <p v-if="error" :class="styles.error" role="alert">{{ error }}</p>
    <ul v-if="open && pull.conflicts?.length" :class="styles.list" aria-label="Conflicted paths">
      <li v-for="c in pull.conflicts" :key="c.path" :class="styles.row" data-conflict>
        <PynIcon name="alert" :class="styles.mark" />
        <span :class="styles.path">{{ c.path }}</span>
        <span :class="styles.kind">{{ c.kind.replace('_', ' ') }}</span>
      </li>
    </ul>
    <section v-if="open && others.length" :class="styles.locks" data-locks aria-label="Locks">
      <h3 :class="styles.heading">Locked by others</h3>
      <p v-if="overriding && canMerge" :class="styles.warning" data-override-warning>
        <PynIcon name="alert" :class="styles.warningIcon" />
        You may merge over these locks. Whoever holds them may still be editing these files, and
        their next check-in can conflict with this merge.
      </p>
      <ul :class="styles.list">
        <li v-for="l in others" :key="l.path" :class="styles.row" data-lock>
          <PynIcon name="file" :class="styles.mark" />
          <span :class="styles.path">{{ l.path }}</span>
          <PynLockBadge :lock="l" :me="me" :now="now" />
        </li>
      </ul>
    </section>
    <div v-if="open" :class="styles.segments">
      <div :class="styles.segment" data-segment="checks">
        <h3 :class="styles.heading">Checks</h3>
        <span :class="styles.bar" data-empty />
        <p :class="styles.note">Not supported yet</p>
      </div>
      <div :class="styles.segment" data-segment="comments">
        <h3 :class="styles.heading">
          Comments<span v-if="threads" :class="styles.note">
            {{ threads.resolved }} / {{ threads.total }} resolved</span
          >
        </h3>
        <span :class="styles.bar" :data-empty="!threads?.total || undefined"
          ><span :style="{ width: `${segmentFill(threads?.resolved ?? 0, threads?.total ?? 0)}%` }"
        /></span>
        <p v-if="!threads" :class="styles.note">Not supported yet</p>
      </div>
      <div :class="styles.segment" data-segment="approvals">
        <h3 :class="styles.heading">
          Approvals<span v-if="approvals" :class="styles.note">
            {{ Math.max(approvals.required - approvals.approved, 0) }} pending</span
          >
        </h3>
        <span :class="styles.bar" :data-empty="!approvals?.required || undefined"
          ><span
            :style="{
              width: `${segmentFill(approvals?.approved ?? 0, approvals?.required ?? 0)}%`,
            }"
        /></span>
        <p v-if="!approvals" :class="styles.note">Not supported yet</p>
      </div>
    </div>
    <PynConfirmDialog
      :open="confirming"
      title="Merge over locks?"
      confirm-label="Merge over locks"
      danger
      @close="confirming = false"
      @confirm="confirmMerge"
    >
      <p :class="styles.confirmText">
        {{ others.length }} changed {{ others.length === 1 ? 'path is' : 'paths are' }} locked by
        someone else. The merge goes ahead over their locks.
      </p>
    </PynConfirmDialog>
  </section>
</template>
