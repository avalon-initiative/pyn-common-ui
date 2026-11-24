<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import PynFilterList from './PynFilterList.vue'
import PynRepoRow from './PynRepoRow.vue'
import styles from '../styles/PynRepoList.module.scss'
import { arrangeRepos, repoSlug } from '../state/repo.state'
import type { RepoListSort, RepoListType } from '../state/repo.state'
import type { RepoListItem } from '../types/repo.types'

/** `empty` replaces the empty message; an empty string or the `empty` slot replaces it entirely. */
const props = withDefaults(
  defineProps<{
    repos: RepoListItem[]
    empty?: string
    /** Shows a filter field above the list that matches on owner and name. */
    filterable?: boolean
    /** Uses the filter-list pattern: count, find field, Type and Sort selects, `actions` slot, paging. */
    boxed?: boolean
    pageSize?: number
    /** Reference time for "Updated … ago". */
    now?: Date
  }>(),
  { pageSize: 30 },
)

const query = ref('')
const type = ref<RepoListType>('all')
const sort = ref<RepoListSort>('updated')
const page = ref(1)

const shown = computed(() => {
  const q = query.value.trim().toLowerCase()
  return q ? props.repos.filter((r) => repoSlug(r).toLowerCase().includes(q)) : props.repos
})
const arranged = computed(() => arrangeRepos(props.repos, query.value, type.value, sort.value))
const paged = computed(() =>
  arranged.value.slice((page.value - 1) * props.pageSize, page.value * props.pageSize),
)
watch([query, type, sort], () => (page.value = 1))

const controls = computed(() => [
  {
    id: 'type',
    label: 'Type',
    value: type.value,
    options: [
      { value: 'all', label: 'Type: All' },
      { value: 'public', label: 'Public' },
      { value: 'private', label: 'Private' },
    ],
  },
  {
    id: 'sort',
    label: 'Sort',
    value: sort.value,
    options: [
      { value: 'updated', label: 'Last updated' },
      { value: 'name', label: 'Name' },
    ],
  },
])
function control(id: string, value: string) {
  if (id === 'type') type.value = value as RepoListType
  else sort.value = value as RepoListSort
}
</script>

<template>
  <PynFilterList
    v-if="boxed"
    v-model:query="query"
    v-model:page="page"
    noun="repository"
    plural="repositories"
    search-label="Find a repository"
    placeholder="Find a repository…"
    label="Repositories"
    :count="arranged.length"
    :page-size="pageSize"
    :controls="controls"
    :filtered="query.trim() !== '' || type !== 'all'"
    :empty-title="repos.length ? undefined : 'No repositories'"
    :empty-description="repos.length ? undefined : (empty ?? 'There are no repositories to show.')"
    @control="control"
  >
    <template v-if="$slots.actions" #actions><slot name="actions" /></template>
    <template v-if="$slots.empty && !repos.length" #empty><slot name="empty" /></template>
    <PynRepoRow v-for="repo in paged" :key="repoSlug(repo)" :repo="repo" :now="now" />
  </PynFilterList>
  <div v-else-if="repos.length" :class="styles.wrap">
    <input
      v-if="filterable"
      v-model="query"
      type="search"
      :class="styles.filter"
      placeholder="Find a repository…"
      aria-label="Find a repository"
    />
    <ul v-if="shown.length" :class="styles.list">
      <PynRepoRow v-for="repo in shown" :key="repoSlug(repo)" :repo="repo" :now="now" />
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
