<script setup lang="ts">
import { computed } from 'vue'
import PynEmptyState from './PynEmptyState.vue'
import PynIcon from './PynIcon.vue'
import PynPerson from './PynPerson.vue'
import styles from '../styles/PynPullCommits.module.scss'
import { commitDays, shortId } from '../state/pull-request.state'
import { formatAgo } from '../utils/ago'
import { copyText } from '../utils/copy'
import type { PullCommit } from '../types/pull-request.types'

const props = defineProps<{ commits: PullCommit[]; now?: Date }>()
const emit = defineEmits<{ copy: [id: string] }>()

const days = computed(() => commitDays(props.commits))

async function copy(id: string) {
  if (await copyText(id)) emit('copy', id)
}
</script>

<template>
  <div :class="styles.commits">
    <PynEmptyState
      v-if="!commits.length"
      compact
      kind="empty"
      icon="commit"
      title="No commits"
      description="This pull request has no commits."
    />
    <section v-for="d in days" :key="d.day" :class="styles.day" data-day>
      <h3 :class="styles.heading"><PynIcon name="commit" />Commits on {{ d.day }}</h3>
      <ul :class="styles.list">
        <li v-for="c in d.commits" :key="c.id" :class="styles.row" data-commit>
          <div :class="styles.main">
            <a v-if="c.href" :href="c.href" :class="styles.message">{{ c.message }}</a>
            <span v-else :class="styles.message">{{ c.message }}</span>
            <span :class="styles.by">
              <PynPerson :name="c.author.user" :identity="c.author" /> committed
              {{ formatAgo(c.committed_at, now ?? new Date()) }}
            </span>
          </div>
          <code :class="styles.id">{{ shortId(c.id) }}</code>
          <button
            type="button"
            :class="styles.copy"
            aria-label="Copy commit id"
            title="Copy commit id"
            @click="copy(c.id)"
          >
            <PynIcon name="copy" />
          </button>
        </li>
      </ul>
    </section>
  </div>
</template>
