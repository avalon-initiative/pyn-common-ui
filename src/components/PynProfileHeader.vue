<script setup lang="ts">
import styles from '../styles/PynProfileHeader.module.scss'
import PynAvatar from './PynAvatar.vue'
import PynIcon from './PynIcon.vue'
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
  /** Stacks the avatar, name, bio, actions and facts for a left column beside the main content. */
  column?: boolean
}>()
</script>

<template>
  <header :class="[styles.header, column && styles.column]">
    <PynAvatar
      :class="styles.avatar"
      :username="username"
      :name="displayName"
      :src="avatarUrl"
      size="lg"
    />
    <div :class="styles.body">
      <h1 :class="styles.title">
        <span v-if="displayName" :class="styles.display">{{ displayName }}</span>
        <span :class="styles.username" :data-only="displayName ? undefined : ''">{{
          username
        }}</span>
      </h1>
      <p v-if="bio" :class="styles.bio">{{ bio }}</p>
      <ul :class="styles.facts" aria-label="Profile details">
        <li v-if="company" data-company><PynIcon v-if="column" name="building" />{{ company }}</li>
        <li v-if="location" data-location>
          <PynIcon v-if="column" name="map-pin" />{{ location }}
        </li>
        <li v-if="createdAt" data-since>
          <PynIcon v-if="column" name="calendar" />Member since
          <time :datetime="createdAt">{{ formatDate(createdAt) }}</time>
        </li>
        <template v-for="url in links ?? []" :key="url">
          <li v-if="isWebLink(url)" data-link>
            <a :href="url" rel="nofollow noopener noreferrer" target="_blank" :class="styles.link"
              ><PynIcon v-if="column" name="link" />{{ linkLabel(url) }}</a
            >
          </li>
        </template>
      </ul>
      <div v-if="$slots.actions" :class="styles.actions"><slot name="actions" /></div>
    </div>
  </header>
</template>
