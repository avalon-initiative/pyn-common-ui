<script setup lang="ts">
import styles from '../styles/PynRepoList.module.scss'
import { repoPath, repoSlug } from '../state/repo.state'
import type { RepoInfo } from '../types/repo.types'

/** `empty` replaces the empty message; an empty string or the `empty` slot replaces it entirely. */
defineProps<{ repos: RepoInfo[]; empty?: string }>()
</script>

<template>
  <ul v-if="repos.length" :class="styles.list">
    <li v-for="repo in repos" :key="repoSlug(repo)" :class="styles.item">
      <a :href="repoPath(repo)" :class="styles.link">
        <span :class="styles.owner">{{ repo.owner }}/</span>{{ repo.name }}
      </a>
      <span :class="styles.meta">
        <span :class="styles.pill">{{ repo.visibility }}</span>
        <span v-if="repo.role" :class="styles.pill" data-role>{{ repo.role }}</span>
        <span>{{ repo.lease_hours }}h leases</span>
      </span>
    </li>
  </ul>
  <slot v-else name="empty">
    <p v-if="empty === undefined" :class="styles.empty">
      You are not in any repository yet. <a href="/_/new">Create one</a>.
    </p>
    <p v-else-if="empty" :class="styles.empty">{{ empty }}</p>
  </slot>
</template>
