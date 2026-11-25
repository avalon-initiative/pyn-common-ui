<script setup lang="ts">
import PynButton from './PynButton.vue'
import PynEmptyState from './PynEmptyState.vue'
import PynLoading from './PynLoading.vue'
import PynRepoRow from './PynRepoRow.vue'
import PynRepoSocial from './PynRepoSocial.vue'
import styles from '../styles/PynWatchedRepos.module.scss'
import { repoSlug } from '../state/repo.state'
import { UNWATCH, isWatchLevel, watchedButton } from '../state/repo-social.state'
import type { RepoRef } from '../types/repo.types'
import type { WatchedRepoItem, WatchLevel } from '../types/repo-social.types'

defineProps<{
  repos: WatchedRepoItem[]
  loading?: boolean
  error?: string
  /** Shows "Load more", for when the server has a next page. */
  hasMore?: boolean
  /** Disables "Load more" while the next page loads. */
  busy?: boolean
  /** Text of the empty state. */
  empty?: string
  /** Reference time for "Updated … ago". */
  now?: Date
}>()
const emit = defineEmits<{
  level: [repo: RepoRef, level: WatchLevel]
  unwatch: [repo: RepoRef]
  more: []
}>()

const refOf = (w: WatchedRepoItem): RepoRef => ({ owner: w.repo.owner, name: w.repo.name })

/** The button toggles: watching stops, ignoring starts watching all activity. */
function press(w: WatchedRepoItem) {
  if (w.busy) return
  if (w.level === 'ignore') emit('level', refOf(w), 'all')
  else emit('unwatch', refOf(w))
}

function pick(w: WatchedRepoItem, id: string) {
  if (w.busy) return
  if (id === UNWATCH) emit('unwatch', refOf(w))
  else if (isWatchLevel(id) && id !== w.level) emit('level', refOf(w), id)
}

const label = (w: WatchedRepoItem) => `Watch ${repoSlug(w.repo)}`
</script>

<template>
  <section :class="styles.wrap" aria-label="Watched repositories">
    <PynLoading
      v-if="loading && !repos.length"
      label="Loading watched repositories"
      variant="block"
    />
    <p v-else-if="error && !repos.length" :class="styles.error" role="alert">{{ error }}</p>
    <PynEmptyState
      v-else-if="!repos.length"
      title="Not watching any repositories"
      :description="
        empty ?? 'Watch a repository to hear about its activity. Repositories you watch show here.'
      "
      icon="eye"
      :heading-level="3"
      compact
    />
    <template v-else>
      <p v-if="error" :class="styles.error" role="alert">{{ error }}</p>
      <ul :class="styles.list">
        <PynRepoRow
          v-for="w in repos"
          :key="repoSlug(w.repo)"
          :repo="w.repo"
          :now="now"
          :data-level="w.level"
        >
          <template #actions>
            <PynRepoSocial
              :watch="watchedButton(w)"
              :aria-label="label(w)"
              @press="press(w)"
              @menu="(_kind, id) => pick(w, id)"
            />
          </template>
        </PynRepoRow>
      </ul>
      <div v-if="hasMore" :class="styles.more">
        <PynButton
          :label="busy ? 'Loading…' : 'Load more'"
          variant="secondary"
          :disabled="busy"
          @click="emit('more')"
        />
      </div>
    </template>
  </section>
</template>
