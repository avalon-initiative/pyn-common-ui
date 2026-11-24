<script setup lang="ts">
import styles from '../styles/PynRepoRow.module.scss'
import { formatAgo } from '../utils/ago'
import { formatDate } from '../utils/datetime'
import { repoPath } from '../state/repo.state'
import type { RepoListItem } from '../types/repo.types'

defineProps<{ repo: RepoListItem; now?: Date }>()
</script>

<template>
  <li :class="styles.item">
    <span :class="styles.title">
      <a :href="repoPath(repo)" :class="styles.link"> {{ repo.owner }}/{{ repo.name }} </a>
      <span :class="styles.pill" data-visibility>{{ repo.visibility }}</span>
      <span v-if="repo.role" :class="styles.pill" data-role>{{ repo.role }}</span>
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
      <span>{{ repo.lease_hours }}h leases</span>
      <span v-if="repo.updated_at" data-updated>
        Updated {{ formatAgo(repo.updated_at, now ?? new Date()) }}
      </span>
      <span v-else>Created {{ formatDate(repo.created_at) }}</span>
    </span>
  </li>
</template>
