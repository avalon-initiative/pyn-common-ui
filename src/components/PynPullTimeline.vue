<script setup lang="ts">
import PynIcon from './PynIcon.vue'
import PynMarkdown from './PynMarkdown.vue'
import PynPerson from './PynPerson.vue'
import styles from '../styles/PynPullTimeline.module.scss'
import { formatAgo } from '../utils/ago'
import type { PullEvent } from '../types/pull-request.types'

defineProps<{
  events: PullEvent[]
  owner: string
  name: string
  now?: Date
}>()

const VERB = {
  merged: 'merged this pull request',
  closed: 'closed this pull request',
  reopened: 'reopened this pull request',
} as const
const ICON = { merged: 'merge', closed: 'pull-closed', reopened: 'pull-request' } as const
</script>

<template>
  <ol :class="styles.timeline" aria-label="Timeline">
    <li v-for="e in events" :key="e.id" :data-kind="e.kind">
      <article v-if="e.kind === 'comment'" :class="styles.comment">
        <header :class="styles.head">
          <span
            ><strong><PynPerson :name="e.actor.user" :identity="e.actor" /></strong> commented
            {{ formatAgo(e.at, now ?? new Date()) }}</span
          >
        </header>
        <div :class="styles.body">
          <PynMarkdown v-if="e.body?.trim()" :source="e.body" :owner="owner" :name="name" />
          <p v-else :class="styles.none">No description provided.</p>
        </div>
      </article>
      <p v-else :class="styles.event">
        <PynIcon :name="ICON[e.kind]" :class="styles.mark" />
        <span
          ><strong><PynPerson :name="e.actor.user" :identity="e.actor" /></strong>
          {{ VERB[e.kind] }} {{ formatAgo(e.at, now ?? new Date()) }}</span
        >
      </p>
    </li>
  </ol>
</template>
