<script setup lang="ts">
import styles from '../styles/PynProfileLayout.module.scss'
import PynRepoList from './PynRepoList.vue'
import PynActivity from './PynActivity.vue'
import PynPageColumns from './PynPageColumns.vue'
import { orgPath } from '../state/org.state'
import type { OrgInfo } from '../types/org.types'
import type { RepoInfo } from '../types/repo.types'
import type { ActivityEntry } from '../types/tree.types'

defineProps<{
  /** Shown in the default repositories section; the `repositories` slot replaces it. */
  repos?: RepoInfo[]
  /** Organizations shared with the viewer; the section is hidden when empty. */
  orgs?: OrgInfo[]
  /** Recent activity; the section is hidden when omitted. */
  activityEntries?: ActivityEntry[]
  now?: Date
}>()
</script>

<template>
  <div :class="styles.layout">
    <slot name="header" />
    <PynPageColumns>
      <section :class="styles.main" aria-labelledby="profile-repos-title">
        <h2 id="profile-repos-title" :class="styles.title">Repositories</h2>
        <slot name="repositories">
          <PynRepoList :repos="repos ?? []" empty="No repositories to show." />
        </slot>
      </section>
      <template #side>
        <section v-if="$slots.organizations || orgs?.length" aria-labelledby="profile-orgs-title">
          <h2 id="profile-orgs-title" :class="styles.title">Organizations</h2>
          <slot name="organizations">
            <ul :class="styles.orgs">
              <li v-for="org in orgs" :key="org.id">
                <a :href="orgPath(org.name)" :class="styles.org">{{ org.name }}</a>
                <span v-if="org.role" :class="styles.pill" data-role>{{ org.role }}</span>
              </li>
            </ul>
          </slot>
        </section>
        <slot name="activity">
          <PynActivity v-if="activityEntries" :entries="activityEntries" :now="now" />
        </slot>
      </template>
    </PynPageColumns>
  </div>
</template>
