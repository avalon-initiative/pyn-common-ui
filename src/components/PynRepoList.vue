<script setup lang="ts">
import { computed, ref } from 'vue'
import styles from '../styles/PynRepoList.module.scss'
import { formatDate } from '../utils/datetime'
import { repoPath, repoSlug } from '../state/repo.state'
import type { RepoInfo } from '../types/repo.types'

/** `empty` replaces the empty message; an empty string or the `empty` slot replaces it entirely. */
const props = defineProps<{
  repos: RepoInfo[]
  empty?: string
  /** Shows a filter field above the list that matches on owner and name. */
  filterable?: boolean
}>()

const query = ref('')
const shown = computed(() => {
  const q = query.value.trim().toLowerCase()
  return q ? props.repos.filter((r) => repoSlug(r).toLowerCase().includes(q)) : props.repos
})
</script>

<template>
  <div v-if="repos.length" :class="styles.wrap">
    <input
      v-if="filterable"
      v-model="query"
      type="search"
      :class="styles.filter"
      placeholder="Find a repository…"
      aria-label="Find a repository"
    />
    <ul v-if="shown.length" :class="styles.list">
      <li v-for="repo in shown" :key="repoSlug(repo)" :class="styles.item">
        <span :class="styles.title">
          <a :href="repoPath(repo)" :class="styles.link"> {{ repo.owner }}/{{ repo.name }} </a>
          <span :class="styles.pill" data-visibility>{{ repo.visibility }}</span>
          <span v-if="repo.role" :class="styles.pill" data-role>{{ repo.role }}</span>
        </span>
        <span :class="styles.meta"
          >{{ repo.lease_hours }}h leases · Created {{ formatDate(repo.created_at) }}</span
        >
      </li>
    </ul>
    <p v-else :class="styles.empty" data-no-match>No repositories match.</p>
  </div>
  <slot v-else name="empty">
    <p v-if="empty === undefined" :class="styles.empty">
      You are not in any repository yet. <a href="/_/new">Create one</a>.
    </p>
    <p v-else-if="empty" :class="styles.empty">{{ empty }}</p>
  </slot>
</template>
