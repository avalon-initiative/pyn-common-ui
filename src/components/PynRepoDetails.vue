<script setup lang="ts">
import PynIcon from './PynIcon.vue'
import styles from '../styles/PynRepoDetails.module.scss'
import { formatDate, formatDateTime } from '../utils/datetime'
import { formatAgo } from '../utils/ago'
import { pluralize, pluralWord } from '../utils/plural'
import type { Visibility } from '../types/repo.types'

defineProps<{
  owner: string
  visibility: Visibility
  leaseHours: number
  createdAt: string
  updatedAt?: string | null
  files: number
  exclusiveFiles: number
  sharedFiles: number
  now?: Date
}>()
</script>

<template>
  <section :class="styles.card" aria-labelledby="details-title">
    <h2 id="details-title" :class="styles.hidden">Repository details</h2>
    <ul :class="styles.list">
      <li><PynIcon name="user" /><strong>Owner</strong> {{ owner }}</li>
      <li :class="styles.cap">
        <PynIcon name="eye" /><strong>{{ visibility }}</strong>
      </li>
      <li>
        <PynIcon name="file" /><strong>{{ files }}</strong> {{ pluralWord(files, 'file') }}
      </li>
      <li>
        <PynIcon name="lock" /><strong>{{ exclusiveFiles }}</strong> exclusive
      </li>
      <li>
        <PynIcon name="repo" /><strong>{{ sharedFiles }}</strong> shared
      </li>
      <li>
        <PynIcon name="key" /><strong>{{ pluralize(leaseHours, 'hour') }}</strong> lease
      </li>
      <li :title="updatedAt ? formatDateTime(updatedAt) : undefined">
        <PynIcon name="history" />Last revision
        <strong>{{ updatedAt ? formatAgo(updatedAt, now ?? new Date()) : 'none yet' }}</strong>
      </li>
      <li>
        <PynIcon name="list" />Created <strong>{{ formatDate(createdAt) }}</strong>
      </li>
    </ul>
  </section>
</template>
