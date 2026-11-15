<script setup lang="ts">
import styles from '../styles/PynProfileHeader.module.scss'
import PynAvatar from './PynAvatar.vue'
import { formatDate } from '../utils/datetime'
import { isWebLink, linkLabel } from '../state/profile.state'

defineProps<{
  username: string
  displayName?: string | null
  avatarUrl?: string | null
  bio?: string | null
  location?: string | null
  company?: string | null
  /** Only http(s) URLs are shown, as external links. */
  links?: string[]
  /** ISO 8601 timestamp of the account's creation. */
  createdAt?: string | null
}>()
</script>

<template>
  <header :class="styles.header">
    <PynAvatar :username="username" :name="displayName" :src="avatarUrl" size="xl" />
    <div :class="styles.body">
      <h1 :class="styles.title">
        <span v-if="displayName" :class="styles.display">{{ displayName }}</span>
        <span :class="styles.username" :data-only="displayName ? undefined : ''">{{
          username
        }}</span>
      </h1>
      <p v-if="bio" :class="styles.bio">{{ bio }}</p>
      <ul :class="styles.facts" aria-label="Profile details">
        <li v-if="company" data-company>{{ company }}</li>
        <li v-if="location" data-location>{{ location }}</li>
        <li v-if="createdAt" data-since>
          Member since <time :datetime="createdAt">{{ formatDate(createdAt) }}</time>
        </li>
        <template v-for="url in links ?? []" :key="url">
          <li v-if="isWebLink(url)" data-link>
            <a
              :href="url"
              rel="nofollow noopener noreferrer"
              target="_blank"
              :class="styles.link"
              >{{ linkLabel(url) }}</a
            >
          </li>
        </template>
      </ul>
      <div v-if="$slots.actions" :class="styles.actions"><slot name="actions" /></div>
    </div>
  </header>
</template>
