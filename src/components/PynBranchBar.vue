<script setup lang="ts">
import PynBranchPicker from './PynBranchPicker.vue'
import PynIcon from './PynIcon.vue'
import styles from '../styles/PynBranchBar.module.scss'
import { formatDateTime } from '../utils/datetime'
import { formatAgo } from '../utils/ago'
import type { BranchOption } from '../types/branch.types'

defineProps<{
  branch: string
  /** Branches for the selector; without them the branch shows as a static label. */
  branches?: BranchOption[]
  branchesLoading?: boolean
  branchesError?: string
  /** Where "View all branches" in the selector panel and the branches link go. */
  branchesHref?: string
  /** Shown in the branches link; the number's space is held while it is unknown. */
  branchCount?: number
  /** Shows the tags entry: a link with `tagCount` when `tagsHref` is given, otherwise a not-supported placeholder. */
  showTags?: boolean
  tagCount?: number
  tagsHref?: string
  /** Shows the Go to file button, which emits `goToFile`. */
  goToFile?: boolean
  files?: number
  updatedAt?: string | null
  now?: Date
}>()
defineEmits<{ select: [name: string]; goToFile: [] }>()
</script>

<template>
  <div :class="styles.bar">
    <PynBranchPicker
      v-if="branches"
      :branches="branches"
      :current="branch"
      :loading="branchesLoading"
      :error="branchesError"
      :all-href="branchesHref"
      :now="now"
      @select="$emit('select', $event)"
    />
    <span v-else :class="styles.branch"
      ><PynIcon name="branch" :class="styles.icon" />{{ branch }}</span
    >
    <a v-if="branchesHref" :href="branchesHref" :class="styles.branches" data-branches-link>
      <PynIcon name="branch" :class="styles.icon" />
      <strong :class="styles.count">{{ branchCount ?? '' }}</strong>
      {{ branchCount === 1 ? 'Branch' : 'Branches' }}
    </a>
    <template v-if="showTags">
      <a v-if="tagsHref" :href="tagsHref" :class="styles.branches" data-tags-link>
        <PynIcon name="tag" :class="styles.icon" />
        <strong :class="styles.count">{{ tagCount ?? '' }}</strong>
        {{ tagCount === 1 ? 'Tag' : 'Tags' }}
      </a>
      <span
        v-else
        :class="[styles.branches, styles.unsupported]"
        title="Tags are not supported yet"
        data-tags-unsupported
      >
        <PynIcon name="tag" :class="styles.icon" />
        <strong :class="styles.count" aria-hidden="true">&ndash;</strong>
        Tags
        <span :class="styles.soon">Not supported yet</span>
      </span>
    </template>
    <div :class="$slots.default ? styles.path : styles.spacer"><slot /></div>
    <template v-if="files !== undefined">
      <span :class="styles.meta">{{ files }} {{ files === 1 ? 'file' : 'files' }}</span>
      <span v-if="updatedAt" :class="styles.meta" :title="formatDateTime(updatedAt)"
        >Last revision {{ formatAgo(updatedAt, now ?? new Date()) }}</span
      >
      <span v-else :class="styles.meta">No revisions yet</span>
    </template>
    <button v-if="goToFile" type="button" :class="styles.goto" @click="$emit('goToFile')">
      <PynIcon name="search" :class="styles.icon" />Go to file
    </button>
    <div v-if="$slots.actions" :class="styles.actions"><slot name="actions" /></div>
  </div>
</template>
