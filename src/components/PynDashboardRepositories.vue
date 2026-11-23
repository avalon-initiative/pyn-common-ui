<script setup lang="ts">
import { computed } from 'vue'
import PynDashboardCard from './PynDashboardCard.vue'
import PynEmptyState from './PynEmptyState.vue'
import PynRepoList from './PynRepoList.vue'
import styles from '../styles/PynDashboardRepositories.module.scss'
import type { RepoInfo } from '../types/repo.types'

const props = withDefaults(
  defineProps<{
    repos: RepoInfo[]
    loading?: boolean
    error?: string
    seeAllHref?: string
    createHref?: string
    /** Repositories shown; the rest are behind "See all". */
    max?: number
  }>(),
  { createHref: '/_/new', max: 8 },
)
const emit = defineEmits<{ retry: []; create: [event: MouseEvent] }>()
const shown = computed(() => props.repos.slice(0, props.max))
</script>

<template>
  <PynDashboardCard
    heading="Repositories"
    :see-all-href="repos.length > max ? seeAllHref : undefined"
    :loading="loading"
    :error="error"
    retryable
    @retry="emit('retry')"
  >
    <template #actions>
      <a :href="createHref" :class="styles.create" @click="emit('create', $event)">New</a>
    </template>
    <PynRepoList :repos="shown">
      <template #empty>
        <PynEmptyState
          compact
          :heading-level="3"
          title="Create a repository"
          description="A repository holds your files and decides which of them are locked."
          primary-label="New repository"
          :primary-href="createHref"
          @primary="emit('create', $event)"
        />
      </template>
    </PynRepoList>
  </PynDashboardCard>
</template>
