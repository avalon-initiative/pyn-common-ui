<script setup lang="ts">
import styles from '../styles/PynTeamList.module.scss'
import { formatDate } from '../utils/datetime'
import { teamPath } from '../state/team.state'
import { pluralize } from '../utils/plural'
import type { TeamInfo } from '../types/team.types'

defineProps<{ org: string; teams: TeamInfo[] }>()
</script>

<template>
  <ul v-if="teams.length" :class="styles.list">
    <li v-for="t in teams" :key="t.id" :class="styles.item" data-team>
      <span :class="styles.who">
        <a :href="teamPath(org, t.slug)" :class="styles.link">{{ t.name }}</a>
        <span v-if="t.name !== t.slug" :class="styles.slug">{{ t.slug }}</span>
        <span v-if="t.description" :class="styles.description">{{ t.description }}</span>
      </span>
      <span :class="styles.meta">
        <span data-members>{{ pluralize(t.members.length, 'member') }}</span>
        <span data-repos>{{ pluralize(t.repos.length, 'repository', 'repositories') }}</span>
        <span>created {{ formatDate(t.created_at) }}</span>
      </span>
    </li>
  </ul>
  <p v-else :class="styles.empty">This organization has no teams yet.</p>
</template>
