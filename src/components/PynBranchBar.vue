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
  files?: number
  updatedAt?: string | null
  now?: Date
}>()
defineEmits<{ select: [name: string] }>()
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
    <div :class="$slots.default ? styles.path : styles.spacer"><slot /></div>
    <template v-if="files !== undefined">
      <span :class="styles.meta">{{ files }} {{ files === 1 ? 'file' : 'files' }}</span>
      <span v-if="updatedAt" :class="styles.meta" :title="formatDateTime(updatedAt)"
        >Last revision {{ formatAgo(updatedAt, now ?? new Date()) }}</span
      >
      <span v-else :class="styles.meta">No revisions yet</span>
    </template>
    <div v-if="$slots.actions" :class="styles.actions"><slot name="actions" /></div>
  </div>
</template>
