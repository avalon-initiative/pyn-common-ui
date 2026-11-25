<script setup lang="ts">
import { computed } from 'vue'
import PynAvatar from './PynAvatar.vue'
import PynIcon from './PynIcon.vue'
import styles from '../styles/PynRepoRow.module.scss'
import { formatAgo } from '../utils/ago'
import { formatDate } from '../utils/datetime'
import { repoIconSrc, repoPath } from '../state/repo.state'
import type { RepoListItem } from '../types/repo.types'

const props = defineProps<{ repo: RepoListItem; now?: Date }>()
const icon = computed(() => repoIconSrc(props.repo.icon_url, props.repo.owner_avatar_url))
</script>

<template>
  <li :class="styles.item">
    <span :class="styles.title">
      <PynAvatar
        v-if="icon !== undefined"
        :username="repo.owner"
        :src="icon"
        size="sm"
        :class="styles.icon"
        data-repo-icon
      />
      <a :href="repoPath(repo)" :class="styles.link"> {{ repo.owner }}/{{ repo.name }} </a>
      <span :class="styles.pill" data-visibility>{{ repo.visibility }}</span>
      <span v-if="repo.role" :class="styles.pill" data-role>{{ repo.role }}</span>
      <span v-if="$slots.actions" :class="styles.actions" data-actions
        ><slot name="actions"
      /></span>
    </span>
    <p v-if="repo.description" :class="styles.description" data-description>
      {{ repo.description }}
    </p>
    <ul v-if="repo.topics?.length" :class="styles.topics" aria-label="Topics">
      <li v-for="t in repo.topics" :key="t" :class="styles.topic" data-topic>{{ t }}</li>
    </ul>
    <span :class="styles.meta">
      <span v-if="repo.language" :class="styles.language" data-language>
        <span :class="styles.dot" aria-hidden="true" />{{ repo.language }}
      </span>
      <span v-if="repo.star_count !== undefined" :class="styles.count" data-stars>
        <PynIcon name="star" :class="styles.countIcon" />{{ repo.star_count }}
        <span :class="styles.hidden">{{ repo.star_count === 1 ? 'star' : 'stars' }}</span>
      </span>
      <span v-if="repo.fork_count !== undefined" :class="styles.count" data-forks>
        <PynIcon name="fork" :class="styles.countIcon" />{{ repo.fork_count }}
        <span :class="styles.hidden">{{ repo.fork_count === 1 ? 'fork' : 'forks' }}</span>
      </span>
      <span>{{ repo.lease_hours }}h leases</span>
      <span v-if="repo.updated_at" data-updated>
        Updated {{ formatAgo(repo.updated_at, now ?? new Date()) }}
      </span>
      <span v-else>Created {{ formatDate(repo.created_at) }}</span>
    </span>
  </li>
</template>
