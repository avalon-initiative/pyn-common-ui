<script setup lang="ts">
import { computed } from 'vue'
import PynEmptyState from './PynEmptyState.vue'
import PynIcon from './PynIcon.vue'
import PynLoading from './PynLoading.vue'
import styles from '../styles/PynBranchList.module.scss'
import { branchCounts } from '../state/branch-list.state'
import { formatAgo } from '../utils/ago'
import type { BranchListItem } from '../types/branch.types'

const props = defineProps<{
  branches: BranchListItem[]
  loading?: boolean
  error?: string
  /** Marks the branch with this name as the default one when its row does not. */
  defaultBranch?: string
  now?: Date
}>()

const isDefault = (b: BranchListItem) => b.isDefault || b.name === props.defaultBranch
const rows = computed(() => props.branches.map((b) => ({ ...b, isDefault: isDefault(b) })))
</script>

<template>
  <section :class="styles.list" aria-label="Branches">
    <PynLoading v-if="loading" label="Loading branches" variant="block" />
    <p v-else-if="error" :class="styles.error" role="alert">{{ error }}</p>
    <PynEmptyState
      v-else-if="!rows.length"
      title="No branches"
      description="Branches appear here once the repository has history."
      :heading-level="3"
      compact
    />
    <ul v-else :class="styles.rows">
      <li
        v-for="b in rows"
        :key="b.name"
        :class="styles.row"
        :data-default="b.isDefault || undefined"
      >
        <PynIcon name="branch" :class="styles.icon" />
        <a v-if="b.href" :href="b.href" :class="styles.name" :title="b.name">{{ b.name }}</a>
        <span v-else :class="styles.name" :title="b.name">{{ b.name }}</span>
        <span v-if="b.isDefault" :class="styles.badge" data-default-marker>default</span>
        <span v-if="branchCounts(b)" :class="styles.meta" data-ahead-behind>{{
          branchCounts(b)
        }}</span>
        <span v-if="b.updatedAt" :class="styles.meta" data-updated>{{
          `Updated ${formatAgo(b.updatedAt, now ?? new Date())}`
        }}</span>
        <a v-if="b.compareHref" :href="b.compareHref" :class="styles.compare" data-compare
          >Compare<span :class="styles.hidden"> {{ b.name }}</span></a
        >
      </li>
    </ul>
  </section>
</template>
