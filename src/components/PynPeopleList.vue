<script setup lang="ts">
import styles from '../styles/PynPeopleList.module.scss'
import PynAvatar from './PynAvatar.vue'
import PynButton from './PynButton.vue'
import { isWebLink, linkLabel } from '../state/profile.state'
import type { PersonEntry } from '../types/profile.types'

withDefaults(
  defineProps<{
    people: PersonEntry[]
    /** Builds each entry's profile link from its account name. */
    href?: (user: string) => string
    /** Shows the "Load more" button, for when the server returned a next page. */
    more?: boolean
    busy?: boolean
    /** Message shown when there are no people. */
    empty?: string
  }>(),
  { href: (user: string) => `/${user}` },
)
const emit = defineEmits<{ more: [] }>()
</script>

<template>
  <div>
    <ul v-if="people.length" :class="styles.list">
      <li v-for="p in people" :key="p.identity.user" :class="styles.item" data-person>
        <PynAvatar
          :username="p.identity.user"
          :name="p.identity.display_name"
          :src="p.identity.avatar_url"
          size="lg"
        />
        <div :class="styles.body">
          <a :href="href(p.identity.user)" :class="styles.link">
            <span v-if="p.identity.display_name" :class="styles.display">{{
              p.identity.display_name
            }}</span>
            <span :class="styles.username">{{ p.identity.user }}</span>
          </a>
          <p v-if="p.bio" :class="styles.bio">{{ p.bio }}</p>
          <ul :class="styles.facts" aria-label="Details">
            <li v-if="p.company" data-company>{{ p.company }}</li>
            <li v-if="p.location" data-location>{{ p.location }}</li>
            <template v-for="url in p.links ?? []" :key="url">
              <li v-if="isWebLink(url)" data-link>
                <a :href="url" rel="nofollow noopener noreferrer" target="_blank">{{
                  linkLabel(url)
                }}</a>
              </li>
            </template>
          </ul>
        </div>
      </li>
    </ul>
    <p v-else :class="styles.empty" data-empty>{{ empty ?? 'No people found.' }}</p>
    <div v-if="more" :class="styles.more">
      <slot name="more" :busy="busy">
        <PynButton
          :label="busy ? 'Loading…' : 'Load more'"
          variant="secondary"
          :disabled="busy"
          @click="emit('more')"
        />
      </slot>
    </div>
  </div>
</template>
