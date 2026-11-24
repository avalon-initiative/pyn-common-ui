<script setup lang="ts">
import { computed, ref } from 'vue'
import PynDashboardPanel from './PynDashboardPanel.vue'
import PynEmptyState from './PynEmptyState.vue'
import PynLockIcon from './PynLockIcon.vue'
import rows from '../styles/PynDashboardRows.module.scss'
import { expiringLocks, filterLocks } from '../state/dashboard-panels.state'
import { blobPath } from '../state/blob.state'
import { repoPath, repoSlug } from '../state/repo.state'
import { EXPIRING_SOON_MS, formatLease } from '../utils/lease'
import type { MyLock } from '../types/lock.types'

const props = withDefaults(
  defineProps<{
    locks: MyLock[]
    /** `held` lists every lock; `expiring` only those ending within `withinMs`. */
    kind?: 'held' | 'expiring'
    withinMs?: number
    now?: Date
    viewAllHref?: string
    /** Locks listed before the rest are behind View all. */
    max?: number
    loading?: boolean
    error?: string
  }>(),
  { kind: 'held', withinMs: 2 * 60 * 60 * 1000, max: 5, viewAllHref: '/_/locks' },
)
const emit = defineEmits<{ retry: []; viewAll: [event: MouseEvent] }>()

const query = ref('')
const clock = computed(() => props.now ?? new Date())
const base = computed(() =>
  props.kind === 'expiring'
    ? expiringLocks(props.locks, clock.value, props.withinMs)
    : [...props.locks].sort((a, b) => a.expires_at.localeCompare(b.expires_at)),
)
const matches = computed(() => filterLocks(base.value, query.value))
const shown = computed(() => matches.value.slice(0, props.max))
const soon = (l: MyLock) =>
  new Date(l.expires_at).getTime() - clock.value.getTime() < EXPIRING_SOON_MS
const heading = computed(() => (props.kind === 'expiring' ? 'Locks about to expire' : 'Locks held'))
</script>

<template>
  <PynDashboardPanel
    v-model:query="query"
    :heading="heading"
    :view-all-href="viewAllHref"
    filterable
    filter-label="Filter locks"
    :loading="loading"
    :error="error"
    retryable
    @retry="emit('retry')"
    @view-all="emit('viewAll', $event)"
  >
    <ul v-if="shown.length">
      <li v-for="l in shown" :key="`${repoSlug(l)}:${l.path}`" :class="rows.row" data-lock>
        <span :class="rows.icon"><PynLockIcon /></span>
        <span :class="rows.body">
          <a :href="blobPath(l, l.path)" :class="rows.title">{{ l.path }}</a>
          <span :class="rows.meta">
            <a :href="repoPath(l)" :class="rows.repo">{{ repoSlug(l) }}</a> ·
            <span :class="soon(l) && rows.soon">{{ formatLease(l.expires_at, clock) }} left</span>
          </span>
        </span>
      </li>
    </ul>
    <PynEmptyState
      v-else
      compact
      :heading-level="3"
      :title="
        query.trim()
          ? 'No matching locks'
          : kind === 'expiring'
            ? 'No locks about to expire'
            : 'You hold no locks'
      "
      :description="
        query.trim()
          ? undefined
          : kind === 'expiring'
            ? 'Locks with little time left show up here.'
            : 'Files you check out show up here until you release them.'
      "
    />
    <a v-if="matches.length > shown.length" :href="viewAllHref" :class="rows.more"
      >{{ matches.length - shown.length }} more</a
    >
  </PynDashboardPanel>
</template>
