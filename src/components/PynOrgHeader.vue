<script setup lang="ts">
import { computed } from 'vue'
import PynAvatar from './PynAvatar.vue'
import PynTabs from './PynTabs.vue'
import styles from '../styles/PynOrgHeader.module.scss'
import { formatDate } from '../utils/datetime'
import { orgPath, orgTabs } from '../state/org.state'
import { isWebLink, linkLabel } from '../state/profile.state'
import type { OrgRole } from '../types/org.types'

const props = defineProps<{
  name: string
  createdAt: string
  role?: OrgRole | null
  current?: string
  /** Shown beside the name; the name is shown alone without it. */
  displayName?: string | null
  description?: string | null
  avatarUrl?: string | null
  /** Only an http(s) URL is shown, as an external link. */
  url?: string | null
}>()

const tabs = computed(() =>
  orgTabs(props.role).map((t) => ({
    label: t.label,
    href: orgPath(props.name, t.section),
    current: t.section === (props.current ?? ''),
  })),
)
</script>

<template>
  <header :class="styles.header">
    <div :class="styles.identity">
      <PynAvatar
        :class="styles.avatar"
        :username="name"
        :name="displayName"
        :src="avatarUrl"
        size="lg"
      />
      <div :class="styles.body">
        <h1 :class="styles.title">
          <template v-if="displayName">
            {{ displayName }}
            <span :class="styles.handle">{{ name }}</span>
          </template>
          <template v-else>{{ name }}</template>
          <span :class="styles.chip" data-kind>organization</span>
        </h1>
        <p v-if="description" :class="styles.description" data-description>{{ description }}</p>
        <p :class="styles.meta">
          created {{ formatDate(createdAt)
          }}<template v-if="role"> · your role: {{ role }}</template
          ><template v-if="url && isWebLink(url)">
            ·
            <a :href="url" rel="nofollow noopener noreferrer" target="_blank" data-link>{{
              linkLabel(url)
            }}</a></template
          >
        </p>
      </div>
      <div v-if="$slots.actions" :class="styles.actions"><slot name="actions" /></div>
    </div>
    <PynTabs :items="tabs" label="Organization" />
  </header>
</template>
