<script setup lang="ts">
import PynPullStateChip from './PynPullStateChip.vue'
import styles from '../styles/PynPullRequestBar.module.scss'
import type { PullRequestState } from '../types/pull-request.types'

defineProps<{ number: number; title: string; state: PullRequestState; draft?: boolean }>()
</script>

<template>
  <div :class="styles.bar" data-pull-bar>
    <PynPullStateChip :class="styles.chip" :state="state" :draft="draft" />
    <span :class="styles.title"
      ><span :class="styles.number">#{{ number }}</span> {{ title }}</span
    >
    <div v-if="$slots.default" :class="styles.actions"><slot /></div>
  </div>
</template>
