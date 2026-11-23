<script setup lang="ts">
import { computed } from 'vue'
import PynIcon from './PynIcon.vue'
import styles from '../styles/PynRepoBranches.module.scss'
import { aheadBehind, railBranches } from '../state/tabs.state'
import { formatAgo } from '../utils/ago'
import type { BranchSummary } from '../types/branch.types'

const props = defineProps<{
  branches?: BranchSummary[]
  /** Shown first even when `branches` omits it. */
  defaultBranch?: string
  /** Where "View all" goes; the link is omitted without it. */
  href?: string
  now?: Date
}>()

const shown = computed(() => railBranches(props.branches ?? [], props.defaultBranch))
</script>

<template>
  <section :class="styles.card" aria-labelledby="branches-title">
    <div :class="styles.head">
      <h2 id="branches-title" :class="styles.title">Branches</h2>
      <a v-if="href" :href="href" :class="styles.more">View all</a>
    </div>
    <ul v-if="shown.length" :class="styles.list">
      <li v-for="b in shown" :key="b.name" :class="styles.item">
        <PynIcon name="branch" :class="styles.icon" />
        <span :class="styles.name">{{ b.name }}</span>
        <span v-if="b.isDefault" :class="styles.badge" data-default>default</span>
        <span v-if="aheadBehind(b)" :class="styles.meta" data-ahead-behind>{{
          aheadBehind(b)
        }}</span>
        <span v-else-if="b.updatedAt" :class="styles.meta">{{
          formatAgo(b.updatedAt, now ?? new Date())
        }}</span>
      </li>
    </ul>
  </section>
</template>
