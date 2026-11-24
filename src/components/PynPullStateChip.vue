<script setup lang="ts">
import PynIcon from './PynIcon.vue'
import styles from '../styles/PynPullStateChip.module.scss'
import { PULL_STATE_LABEL } from '../state/pull-request.state'
import type { PullRequestState } from '../types/pull-request.types'

defineProps<{ state: PullRequestState }>()
const ICON = { open: 'pull-request', merged: 'merge', closed: 'pull-closed' } as const
</script>

<template>
  <span :class="[styles.chip, styles[state]]" :data-state="state">
    <PynIcon :name="ICON[state]" />{{ PULL_STATE_LABEL[state] }}
  </span>
</template>
