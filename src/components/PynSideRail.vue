<script setup lang="ts">
import { computed, nextTick, ref } from 'vue'
import PynAvatar from './PynAvatar.vue'
import PynIcon from './PynIcon.vue'
import PynMenu from './PynMenu.vue'
import styles from '../styles/PynSideRail.module.scss'
import { orgPath } from '../state/org.state'
import { repoIconSrc, repoPath, repoSlug } from '../state/repo.state'
import { filterRepos } from '../state/shell.state'
import type { NavItem } from '../state/shell.state'
import type { MenuItem } from '../types/shell.types'
import type { OrgRef } from '../types/org.types'
import type { RailRepo } from '../types/repo.types'

const props = withDefaults(
  defineProps<{
    /** Username of the personal account. */
    account: string
    displayName?: string | null
    avatarUrl?: string | null
    /** The account the rail shows; an organization name, or empty for the personal account. */
    currentOrg?: string
    orgs?: OrgRef[]
    items: NavItem[]
    current: string
    repos: RailRepo[]
    currentRepo?: string
    /** Repositories listed before "Show more". */
    maxRepos?: number
    createOrgHref?: string
    personalHref?: string
    /** Drops the account block, for a drawer whose top bar already has the owner switcher. */
    hideAccount?: boolean
  }>(),
  { maxRepos: 10, createOrgHref: '/_/orgs/new', personalHref: '/' },
)

const title = computed(() => props.currentOrg || props.displayName || props.account)
const subtitle = computed(() => (props.currentOrg ? 'Organization' : 'Personal account'))

const switchItems = computed<MenuItem[]>(() => [
  {
    id: 'personal',
    label: props.account,
    href: props.personalHref,
    checked: !props.currentOrg,
  },
  ...(props.orgs ?? []).map((o) => ({
    id: `org:${o.name}`,
    label: o.name,
    href: orgPath(o.name),
    checked: o.name === props.currentOrg,
  })),
  { id: 'sep', label: '', separator: true },
  { id: 'create', label: 'Create organization', href: props.createOrgHref },
])

const filtering = ref(false)
const query = ref('')
const expanded = ref(false)
const input = ref<HTMLInputElement | null>(null)

async function toggleFilter() {
  filtering.value = !filtering.value
  if (!filtering.value) return void (query.value = '')
  await nextTick()
  input.value?.focus()
}

const matches = computed(() => filterRepos(props.repos, query.value))
const shown = computed(() =>
  (query.value.trim() || expanded.value
    ? matches.value
    : matches.value.slice(0, props.maxRepos)
  ).map((repo) => ({
    repo,
    slug: repoSlug(repo),
    icon: repoIconSrc(repo.iconUrl, repo.ownerAvatarUrl),
  })),
)
const canExpand = computed(
  () => !query.value.trim() && !expanded.value && props.repos.length > props.maxRepos,
)

const hasBadge = (item: NavItem) =>
  item.badge !== undefined && item.badge !== '' && item.badge !== 0
</script>

<template>
  <nav :class="styles.rail" aria-label="Main">
    <div v-if="!hideAccount" :class="styles.account">
      <PynAvatar
        :username="currentOrg || account"
        :name="currentOrg ? null : displayName"
        :src="currentOrg ? null : avatarUrl"
        size="md"
      />
      <span :class="styles.who">
        <span :class="styles.name" :title="title">{{ title }}</span>
        <span :class="styles.sub">{{ subtitle }}</span>
      </span>
      <PynMenu label="Switch account" align="start" fixed :items="switchItems">
        <PynIcon name="chevron" />
        <template #header><p :class="styles.menuTitle">Go to organization dashboard</p></template>
      </PynMenu>
    </div>
    <ul :class="styles.list">
      <li v-for="item in items" :key="item.id">
        <a
          :href="item.href"
          :class="styles.link"
          :aria-current="item.id === current ? 'page' : undefined"
        >
          <PynIcon v-if="item.icon" :name="item.icon" />{{ item.label
          }}<template v-if="hasBadge(item)">
            <span :class="styles.badge" aria-hidden="true">{{ item.badge }}</span>
            <span :class="styles.hidden">{{ item.badge }} pending</span>
          </template>
        </a>
      </li>
    </ul>
    <section :class="styles.top" aria-labelledby="pyn-rail-repos">
      <div :class="styles.topHead">
        <h2 id="pyn-rail-repos" :class="styles.heading">Top repositories</h2>
        <button
          type="button"
          :class="styles.iconButton"
          :aria-label="filtering ? 'Close repository filter' : 'Filter repositories'"
          :aria-expanded="filtering"
          @click="toggleFilter"
        >
          <PynIcon :name="filtering ? 'close' : 'search'" />
        </button>
      </div>
      <input
        v-if="filtering"
        ref="input"
        v-model="query"
        type="text"
        :class="styles.filter"
        placeholder="Find a repository…"
        aria-label="Filter repositories"
        @keydown.esc.stop="toggleFilter"
      />
      <ul v-if="shown.length" :class="styles.list">
        <li v-for="{ repo, slug, icon } in shown" :key="slug">
          <a
            :href="repoPath(repo)"
            :class="styles.link"
            :aria-current="slug === currentRepo ? 'true' : undefined"
          >
            <PynAvatar
              v-if="icon !== undefined"
              :username="repo.owner"
              :src="icon"
              size="xs"
              aria-hidden="true"
              data-repo-icon
            />
            <PynIcon v-else name="repo" />
            <span :class="styles.repo" :title="slug">{{ slug }}</span>
          </a>
        </li>
      </ul>
      <p v-else :class="styles.empty">{{ repos.length ? 'No matches.' : 'None yet.' }}</p>
      <button v-if="canExpand" type="button" :class="styles.more" @click="expanded = true">
        Show more
      </button>
    </section>
  </nav>
</template>
