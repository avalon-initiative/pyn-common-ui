<script setup lang="ts">
import { computed } from 'vue'
import PynAvatar from './PynAvatar.vue'
import PynPerson from './PynPerson.vue'
import styles from '../styles/PynActivity.module.scss'
import { formatDateTime } from '../utils/datetime'
import { formatAgo } from '../utils/ago'
import { activityVerb } from '../state/tree.state'
import type { ActivityEntry } from '../types/tree.types'

const props = withDefaults(
  defineProps<{
    entries: ActivityEntry[]
    /** Most entries listed. */
    max?: number
    now?: Date
  }>(),
  { max: 5 },
)
const shown = computed(() => props.entries.slice(0, Math.max(0, props.max)))
</script>

<template>
  <section :class="styles.card" aria-labelledby="activity-title">
    <h2 id="activity-title" :class="styles.title">Recent activity</h2>
    <ul v-if="entries.length" :class="styles.list">
      <li v-for="e in shown" :key="e.id" :class="styles.item">
        <PynAvatar
          v-if="e.actor_public"
          :username="e.actor_current || e.actor"
          :name="e.actor_public.display_name"
          :src="e.actor_public.avatar_url"
          size="sm"
        />
        <span v-else :class="styles.avatar" aria-hidden="true">{{
          e.actor.slice(0, 1).toUpperCase()
        }}</span>
        <div>
          <p :class="styles.text">
            <strong
              ><PynPerson
                :name="e.actor"
                :current="e.actor_current"
                :identity="e.actor_public"
                :avatar="false"
            /></strong>
            {{ activityVerb(e) }}
            <span v-if="e.path" :class="styles.path">{{ e.path }}</span>
          </p>
          <time :class="styles.time" :datetime="e.at" :title="formatDateTime(e.at)">{{
            formatAgo(e.at, now ?? new Date())
          }}</time>
        </div>
      </li>
    </ul>
    <p v-else :class="styles.empty">No activity yet.</p>
  </section>
</template>
