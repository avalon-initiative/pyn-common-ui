<script setup lang="ts">
import PynAvatar from './PynAvatar.vue'
import PynIcon from './PynIcon.vue'
import PynPerson from './PynPerson.vue'
import styles from '../styles/PynLatestChange.module.scss'
import { formatDateTime } from '../utils/datetime'
import { formatAgo } from '../utils/ago'
import type { Revision } from '../types/repo.types'

defineProps<{
  change: Revision
  now?: Date
  /** The History link; omitted hides it. */
  historyHref?: string
}>()
</script>

<template>
  <div :class="styles.row">
    <PynAvatar
      :username="change.author_current || change.author"
      :name="change.author_public?.display_name"
      :src="change.author_public?.avatar_url"
      size="sm"
    />
    <span :class="styles.author"
      ><PynPerson
        :name="change.author"
        :current="change.author_current"
        :identity="change.author_public"
        :avatar="false"
    /></span>
    <span :class="styles.message">{{ change.message || '(no message)' }}</span>
    <span :class="styles.rev" :title="`Revision ${change.id}`">r{{ change.id }}</span>
    <time
      :class="styles.time"
      :datetime="change.created_at"
      :title="formatDateTime(change.created_at)"
      >{{ formatAgo(change.created_at, now ?? new Date()) }}</time
    >
    <a v-if="historyHref" :href="historyHref" :class="styles.history">
      <PynIcon name="history" />History
    </a>
  </div>
</template>
