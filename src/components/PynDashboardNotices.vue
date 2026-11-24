<script setup lang="ts">
import { useId } from 'vue'
import PynEmptyState from './PynEmptyState.vue'
import styles from '../styles/PynDashboardNotices.module.scss'
import { formatAgo } from '../utils/ago'
import { formatDateTime } from '../utils/datetime'
import type { InstanceNotice } from '../types/dashboard.types'

withDefaults(
  defineProps<{
    notices: InstanceNotice[]
    heading?: string
    now?: Date
    viewAllHref?: string
    viewAllLabel?: string
    max?: number
  }>(),
  { heading: 'Latest from this instance', viewAllLabel: 'View all', max: 4 },
)
const emit = defineEmits<{ viewAll: [event: MouseEvent] }>()
const id = useId()
</script>

<template>
  <section :class="styles.panel" :aria-labelledby="id">
    <h2 :id="id" :class="styles.heading">{{ heading }}</h2>
    <ol v-if="notices.length" :class="styles.list">
      <li v-for="n in notices.slice(0, max)" :key="n.id" :class="styles.item" data-notice>
        <time :class="styles.time" :datetime="n.at" :title="formatDateTime(n.at)">{{
          formatAgo(n.at, now ?? new Date())
        }}</time>
        <a v-if="n.href" :href="n.href" :class="styles.title">{{ n.title }}</a>
        <span v-else :class="styles.plain">{{ n.title }}</span>
      </li>
    </ol>
    <PynEmptyState
      v-else
      compact
      :heading-level="3"
      title="Nothing new"
      description="Notices from the instance administrators show up here."
    />
    <a
      v-if="viewAllHref"
      :href="viewAllHref"
      :class="styles.viewAll"
      @click="emit('viewAll', $event)"
      >{{ viewAllLabel }} →</a
    >
  </section>
</template>
