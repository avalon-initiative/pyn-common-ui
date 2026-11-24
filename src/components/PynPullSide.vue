<script setup lang="ts">
import PynAvatar from './PynAvatar.vue'
import PynEmptyState from './PynEmptyState.vue'
import PynIcon from './PynIcon.vue'
import styles from '../styles/PynPullSide.module.scss'
import type { PullRequest } from '../types/pull-request.types'

defineProps<{
  pull: PullRequest
  /** Shows Close pull request (open) or Reopen (closed); both emit. */
  canManage?: boolean
}>()
const emit = defineEmits<{ close: []; reopen: [] }>()

const UNSUPPORTED = ['Reviewers', 'Assignees', 'Labels', 'Milestone']
</script>

<template>
  <div :class="styles.side">
    <section :class="styles.section" aria-labelledby="pull-activity">
      <h3 id="pull-activity" :class="styles.heading">Activity</h3>
      <dl :class="styles.counts">
        <div>
          <dt><PynIcon name="comment" />Comments</dt>
          <dd>{{ pull.comments }}</dd>
        </div>
        <div>
          <dt><PynIcon name="commit" />Commits</dt>
          <dd>{{ pull.commits }}</dd>
        </div>
      </dl>
    </section>
    <section
      v-for="title in UNSUPPORTED"
      :key="title"
      :class="styles.section"
      :data-section="title.toLowerCase()"
    >
      <h3 :class="styles.heading">{{ title }}</h3>
      <PynEmptyState inline kind="unsupported" description="" :heading-level="4" />
    </section>
    <section :class="styles.section" data-section="participants">
      <h3 :class="styles.heading">
        {{ pull.participants?.length ?? 0 }}
        {{ pull.participants?.length === 1 ? 'participant' : 'participants' }}
      </h3>
      <ul v-if="pull.participants?.length" :class="styles.people">
        <li v-for="p in pull.participants" :key="p.user">
          <PynAvatar :username="p.user" :name="p.display_name" :src="p.avatar_url" size="sm" />
        </li>
      </ul>
      <p v-else :class="styles.none">No participants</p>
    </section>
    <section v-if="canManage && pull.state !== 'merged'" :class="styles.section">
      <button
        v-if="pull.state === 'open'"
        type="button"
        :class="styles.danger"
        data-close
        @click="emit('close')"
      >
        <PynIcon name="pull-closed" />Close pull request
      </button>
      <button v-else type="button" :class="styles.action" data-reopen @click="emit('reopen')">
        <PynIcon name="pull-request" />Reopen pull request
      </button>
    </section>
  </div>
</template>
