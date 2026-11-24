<script setup lang="ts">
import { computed } from 'vue'
import PynIcon from './PynIcon.vue'
import styles from '../styles/PynPullStateChip.module.scss'
import { PULL_STATE_LABEL, isDraft } from '../state/pull-request.state'
import type { PullRequestState } from '../types/pull-request.types'

const props = defineProps<{
  state: PullRequestState
  /** Shows an open pull request as a draft. */
  draft?: boolean
}>()
const ICON = { open: 'pull-request', merged: 'merge', closed: 'pull-closed' } as const
const shown = computed(() => (isDraft(props) ? 'draft' : props.state))
</script>

<template>
  <span :class="[styles.chip, styles[shown]]" :data-state="state" :data-draft="draft || undefined">
    <template v-if="shown === 'draft'"><PynIcon name="pull-draft" />Draft</template>
    <template v-else><PynIcon :name="ICON[state]" />{{ PULL_STATE_LABEL[state] }}</template>
  </span>
</template>
