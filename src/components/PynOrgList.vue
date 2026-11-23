<script setup lang="ts">
import styles from '../styles/PynOrgList.module.scss'
import { formatDate } from '../utils/datetime'
import { orgPath } from '../state/org.state'
import type { OrgInfo } from '../types/org.types'

/** `empty` replaces the empty message; an empty string or the `empty` slot replaces it entirely. */
defineProps<{ orgs: OrgInfo[]; empty?: string }>()
</script>

<template>
  <ul v-if="orgs.length" :class="styles.list">
    <li v-for="org in orgs" :key="org.name" :class="styles.item">
      <span :class="styles.title">
        <a :href="orgPath(org.name)" :class="styles.link">{{ org.name }}</a>
        <span v-if="org.role" :class="styles.pill" data-role>{{ org.role }}</span>
      </span>
      <span :class="styles.meta">Created {{ formatDate(org.created_at) }}</span>
    </li>
  </ul>
  <slot v-else name="empty">
    <p v-if="empty === undefined" :class="styles.empty">
      You are not in any organization yet. <a href="/_/new-org">Create one</a>.
    </p>
    <p v-else-if="empty" :class="styles.empty">{{ empty }}</p>
  </slot>
</template>
