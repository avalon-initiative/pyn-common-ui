<script setup lang="ts">
import { computed } from 'vue'
import styles from '../styles/PynProfileLayout.module.scss'
import PynRepoList from './PynRepoList.vue'
import PynActivity from './PynActivity.vue'
import PynPageColumns from './PynPageColumns.vue'
import PynPinned from './PynPinned.vue'
import PynTabs from './PynTabs.vue'
import { orgPath } from '../state/org.state'
import { profileTabs } from '../state/profile.state'
import type { ProfileView } from '../state/profile.state'
import type { OrgInfo } from '../types/org.types'
import type { RepoListItem } from '../types/repo.types'
import type { ActivityEntry } from '../types/tree.types'

const props = defineProps<{
  /** Shows the tab bar (Overview, Repositories, Stars, Usage) for this account. */
  username?: string
  /** The open tab; empty is Overview. */
  current?: ProfileView
  /** Adds the Usage tab, for the viewer's own profile. */
  self?: boolean
  /** Adds the Stars tab with this count; the tab is hidden without it. */
  stars?: number
  /** Rows of the Stars tab; the `starred` slot replaces them. */
  starredRepos?: RepoListItem[]
  /** Shown in the repositories lists; the `repositories` slot replaces them. */
  repos?: RepoListItem[]
  /** Organizations shared with the viewer; the section is hidden when empty. */
  orgs?: OrgInfo[]
  /** Recent activity; the section is hidden when omitted. */
  activityEntries?: ActivityEntry[]
  now?: Date
}>()

const tabs = computed(() =>
  props.username
    ? profileTabs(props.username, {
        current: props.current,
        repos: props.repos?.length,
        stars: props.stars,
        self: props.self,
      })
    : [],
)
const overview = computed(() => !props.current)
</script>

<template>
  <div :class="styles.layout">
    <PynTabs v-if="tabs.length" :items="tabs" label="Profile" />
    <PynPageColumns start :sticky="false" side-label="Profile">
      <slot>
        <div :class="styles.main">
          <slot v-if="current === 'stars'" name="starred">
            <PynRepoList
              boxed
              :repos="starredRepos ?? []"
              :now="now"
              empty="No starred repositories."
            />
          </slot>
          <template v-else>
            <template v-if="overview">
              <slot name="readme" />
              <PynPinned><slot name="pinned" /></PynPinned>
            </template>
            <section :class="styles.section" aria-labelledby="profile-repos-title">
              <h2 id="profile-repos-title" :class="overview ? styles.title : styles.hidden">
                Repositories
              </h2>
              <slot name="repositories">
                <PynRepoList boxed :repos="repos ?? []" :now="now" empty="No repositories to show.">
                  <template v-if="$slots.repositoryActions" #actions>
                    <slot name="repositoryActions" />
                  </template>
                </PynRepoList>
              </slot>
            </section>
          </template>
        </div>
      </slot>
      <template #side>
        <slot name="profile" />
        <section v-if="$slots.organizations || orgs?.length" aria-labelledby="profile-orgs-title">
          <h2 id="profile-orgs-title" :class="styles.sideTitle">Organizations</h2>
          <slot name="organizations">
            <ul :class="styles.orgs">
              <li v-for="org in orgs" :key="org.id">
                <a :href="orgPath(org.name)" :class="styles.org">{{ org.name }}</a>
                <span v-if="org.role" :class="styles.pill" data-role>{{ org.role }}</span>
              </li>
            </ul>
          </slot>
        </section>
        <div v-if="$slots.activity || activityEntries" :class="styles.panel">
          <slot name="activity">
            <PynActivity v-if="activityEntries" :entries="activityEntries" :now="now" />
          </slot>
        </div>
      </template>
    </PynPageColumns>
  </div>
</template>
