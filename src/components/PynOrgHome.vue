<script setup lang="ts">
import { computed } from 'vue'
import PynAvatar from './PynAvatar.vue'
import PynPageColumns from './PynPageColumns.vue'
import PynPinned from './PynPinned.vue'
import PynRepoList from './PynRepoList.vue'
import styles from '../styles/PynOrgHome.module.scss'
import type { PersonEntry } from '../types/profile.types'
import type { RepoListItem } from '../types/repo.types'

const props = withDefaults(
  defineProps<{
    repos?: RepoListItem[]
    /** People shown as avatars in the right rail; the section is hidden without any. */
    people?: PersonEntry[]
    /** Most avatars shown before the "View all" link. */
    maxPeople?: number
    /** Target of the "View all" link in the People section. */
    peopleHref?: string
    /** Builds each person's profile link from the account name. */
    href?: (user: string) => string
    /** Rail sections shown only when given. */
    languages?: string[]
    topics?: string[]
    now?: Date
  }>(),
  { maxPeople: 12, href: (user: string) => `/${user}` },
)

const shownPeople = computed(() => (props.people ?? []).slice(0, props.maxPeople))
</script>

<template>
  <PynPageColumns side-label="About the organization">
    <div :class="styles.main">
      <slot name="readme" />
      <PynPinned><slot name="pinned" /></PynPinned>
      <section :class="styles.section" aria-labelledby="org-repos-title">
        <h2 id="org-repos-title" :class="styles.title">Repositories</h2>
        <slot name="repositories">
          <PynRepoList boxed :repos="repos ?? []" :now="now" empty="No repositories to show.">
            <template v-if="$slots.repositoryActions" #actions>
              <slot name="repositoryActions" />
            </template>
          </PynRepoList>
        </slot>
      </section>
    </div>
    <template #side>
      <section v-if="shownPeople.length" aria-labelledby="org-people-title" data-people>
        <h2 id="org-people-title" :class="styles.title">People</h2>
        <ul :class="styles.people">
          <li v-for="p in shownPeople" :key="p.identity.user">
            <a
              :href="href(p.identity.user)"
              :title="p.identity.display_name || p.identity.user"
              :aria-label="p.identity.display_name || p.identity.user"
            >
              <PynAvatar
                :username="p.identity.user"
                :name="p.identity.display_name"
                :src="p.identity.avatar_url"
                size="md"
              />
            </a>
          </li>
        </ul>
        <a v-if="peopleHref" :href="peopleHref" :class="styles.more" data-people-all>
          View all people
        </a>
      </section>
      <section v-if="languages?.length" aria-labelledby="org-languages-title" data-languages>
        <h2 id="org-languages-title" :class="styles.title">Top languages</h2>
        <ul :class="styles.languages">
          <li v-for="l in languages" :key="l" :class="styles.language">
            <span :class="styles.dot" aria-hidden="true" />{{ l }}
          </li>
        </ul>
      </section>
      <section v-if="topics?.length" aria-labelledby="org-topics-title" data-topics>
        <h2 id="org-topics-title" :class="styles.title">Most used topics</h2>
        <ul :class="styles.topics">
          <li v-for="t in topics" :key="t" :class="styles.topic">{{ t }}</li>
        </ul>
      </section>
      <slot name="side" />
    </template>
  </PynPageColumns>
</template>
