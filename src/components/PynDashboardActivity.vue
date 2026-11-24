<script setup lang="ts">
import { computed, ref } from 'vue'
import PynAvatar from './PynAvatar.vue'
import PynDashboardPanel from './PynDashboardPanel.vue'
import PynEmptyState from './PynEmptyState.vue'
import rows from '../styles/PynDashboardRows.module.scss'
import { filterActivity } from '../state/dashboard-panels.state'
import { blobPath } from '../state/blob.state'
import { repoPath, repoSlug } from '../state/repo.state'
import { activityVerb } from '../state/tree.state'
import { formatDateTime } from '../utils/datetime'
import { formatAgo } from '../utils/ago'
import type { RepoActivityEntry } from '../types/dashboard.types'

const props = withDefaults(
  defineProps<{
    entries: RepoActivityEntry[]
    now?: Date
    viewAllHref?: string
    max?: number
    loading?: boolean
    error?: string
  }>(),
  { max: 8 },
)
const emit = defineEmits<{ retry: []; viewAll: [event: MouseEvent] }>()

const query = ref('')
const matches = computed(() => filterActivity(props.entries, query.value))
const shown = computed(() => matches.value.slice(0, props.max))
</script>

<template>
  <PynDashboardPanel
    v-model:query="query"
    heading="Recent repository activity"
    :view-all-href="viewAllHref"
    filterable
    filter-label="Filter activity"
    :loading="loading"
    :error="error"
    retryable
    @retry="emit('retry')"
    @view-all="emit('viewAll', $event)"
  >
    <ul v-if="shown.length">
      <li v-for="e in shown" :key="`${repoSlug(e)}:${e.id}`" :class="rows.row" data-activity>
        <PynAvatar
          :username="e.actor_current || e.actor"
          :name="e.actor_public?.display_name"
          :src="e.actor_public?.avatar_url"
          size="sm"
        />
        <span :class="rows.body">
          <span>
            <strong>{{ e.actor_current || e.actor }}</strong> {{ activityVerb(e) }}
            <a v-if="e.path" :href="blobPath(e, e.path)" :class="rows.title">{{ e.path }}</a>
          </span>
          <span :class="rows.meta">
            <a :href="repoPath(e)" :class="rows.repo">{{ repoSlug(e) }}</a> ·
            <time :datetime="e.at" :title="formatDateTime(e.at)">{{
              formatAgo(e.at, now ?? new Date())
            }}</time>
          </span>
        </span>
      </li>
    </ul>
    <PynEmptyState
      v-else
      compact
      :heading-level="3"
      :title="query.trim() ? 'No matching activity' : 'No activity yet'"
      :description="query.trim() ? undefined : 'Checkouts, check-ins and releases show up here.'"
    />
  </PynDashboardPanel>
</template>
