<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref } from 'vue'
import PynAvatar from './PynAvatar.vue'
import PynDrawer from './PynDrawer.vue'
import PynGlobalSearch from './PynGlobalSearch.vue'
import type { SearchResult } from '../types/search.types'
import PynIcon from './PynIcon.vue'
import PynMenu from './PynMenu.vue'
import PynNotificationsBell from './PynNotificationsBell.vue'
import styles from '../styles/PynTopBar.module.scss'
import { matchRepos } from '../state/shell.state'
import { themeChoices } from '../state/theme.state'
import {
  MAIN_ID,
  countText,
  defaultHrefs,
  locksText,
  ownerItems,
  withoutNamed,
} from '../state/top-bar.state'
import type { ThemeChoice } from '../state/theme.state'
import type { MenuItem } from '../types/shell.types'
import type { BellEntry, OwnerOption, TopBarHrefs, TopBarLink } from '../types/top-bar.types'

const props = withDefaults(
  defineProps<{
    user?: string
    /** Shown beside the account name and used for the avatar initials. */
    displayName?: string | null
    avatarUrl?: string | null
    /** Repository slugs offered while typing; Enter on a match emits `open`. */
    repos?: string[]
    /** Grouped dropdown under the search field; the app loads them on `input`. */
    searchResults?: SearchResult[]
    theme: ThemeChoice
    /** Public variant: brand, search, theme and a sign-in link. */
    signedOut?: boolean
    signInHref?: string
    admin?: boolean
    extraAccount?: MenuItem[]
    /** Extra destinations for the navigation drawer, after Explore, People and Organizations. */
    extraLinks?: TopBarLink[]
    /** The person's account and organizations, listed in the owner switcher. */
    owners?: OwnerOption[]
    /** Owner shown in the switcher; defaults to `user`. */
    currentOwner?: string
    /** Repository name shown after the owner as `owner / repo`, on repository pages. */
    repo?: string
    /** Locks the person holds; the pill is hidden at zero. */
    locksHeld?: number
    /** True when one of those locks expires within the hour. */
    locksExpiring?: boolean
    /** Pending invitations and notices; the bell stays and opens a placeholder panel, its count hides at zero. */
    notifications?: number
    /** Notices and invitations listed in the bell panel; their number replaces `notifications`. */
    notificationEntries?: BellEntry[]
    /** Reference time for the entries' relative times; defaults to the current time. */
    now?: Date
    /** Overrides for the link destinations. */
    hrefs?: Partial<TopBarHrefs>
    /** Set false to leave the search box off (signed-out pages without public browsing). */
    showSearch?: boolean
    /** Id of the main content the skip link jumps to. */
    mainId?: string
  }>(),
  { showSearch: true, mainId: MAIN_ID },
)
const emit = defineEmits<{
  open: [slug: string]
  input: [text: string]
  search: [text: string]
  selectResult: [result: SearchResult]
  theme: [ThemeChoice]
  signOut: []
  account: [id: string]
  shortcuts: []
  dismissNotification: [id: string]
  acceptNotification: [id: string]
  declineNotification: [id: string]
}>()

const links = computed(() => ({ ...defaultHrefs(props.user), ...props.hrefs }))
const owner = computed(() => props.currentOwner ?? props.user ?? '')
const locks = computed(() => countText(props.locksHeld))

const themeItems = computed<MenuItem[]>(() =>
  themeChoices.map((t) => ({
    id: `theme:${t.id}`,
    label: `${t.label} theme`,
    checked: props.theme === t.id,
  })),
)
const create = computed<MenuItem[]>(() => [
  { id: 'new-repo', label: 'New repository', href: links.value.newRepo },
  { id: 'new-org', label: 'New organization', href: links.value.newOrg },
])
const switcher = computed(() => ownerItems(props.owners ?? [], owner.value, links.value.newOrg))
const directory = computed<MenuItem[]>(() => [
  { id: 'people', label: 'People', href: links.value.people },
  { id: 'orgs', label: 'Organizations', href: links.value.orgs },
])
const exploreItem = computed<MenuItem>(() => ({
  id: 'explore',
  label: 'Explore',
  href: links.value.explore,
}))
const named = computed<MenuItem[]>(() => [
  { id: 'profile', label: 'Profile', href: links.value.profile },
  { id: 'repositories', label: 'Repositories', href: links.value.repositories },
  { id: 'settings', label: 'Settings', href: links.value.settings },
])
const account = computed<MenuItem[]>(() => [
  named.value[0]!,
  named.value[1]!,
  { id: 'organizations', label: 'Organizations', href: links.value.orgs },
  { id: 'people', label: 'People', href: links.value.people },
  { id: 'sep-settings', label: '', separator: true },
  named.value[2]!,
  ...(props.admin
    ? [{ id: 'admin', label: 'Server administration', href: links.value.admin }]
    : []),
  ...withoutNamed(props.extraAccount ?? [], [...directory.value, ...named.value]),
  { id: 'shortcuts', label: 'Keyboard shortcuts' },
  { id: 'sep-theme', label: '', separator: true },
  ...themeItems.value,
  { id: 'sep-out', label: '', separator: true },
  { id: 'sign-out', label: 'Sign out' },
])
const drawerItems = computed<MenuItem[]>(() => {
  const items: MenuItem[] = [{ id: 'home', label: 'Dashboard', href: links.value.home }]
  if (props.signedOut) {
    return [
      ...items,
      exploreItem.value,
      { id: 'sign-in', label: 'Sign in', href: props.signInHref ?? '/_/sign-in' },
      { id: 'sep', label: '', separator: true },
      ...themeItems.value,
    ]
  }
  return [
    ...items,
    { id: 'repositories', label: 'Repositories', href: links.value.repositories },
    { id: 'locks', label: 'Your locks', href: links.value.locks },
    { id: 'sep-browse', label: '', separator: true },
    exploreItem.value,
    ...directory.value,
    ...withoutNamed(props.extraLinks ?? [], [...directory.value, exploreItem.value]),
    { id: 'sep-new', label: '', separator: true },
    ...create.value,
    ...(props.owners?.length
      ? [{ id: 'sep-owners', label: '', separator: true }, ...switcher.value]
      : []),
    { id: 'sep-shortcuts', label: '', separator: true },
    { id: 'shortcuts', label: 'Keyboard shortcuts' },
  ]
})

const drawer = ref(false)
function drawerClick(e: MouseEvent) {
  if ((e.target as HTMLElement).closest('a')) drawer.value = false
}
function drawerPick(id: string) {
  drawer.value = false
  pick(id)
}

function pick(id: string) {
  if (id === 'sign-out') emit('signOut')
  else if (id === 'shortcuts') emit('shortcuts')
  else if (id.startsWith('theme:')) emit('theme', id.slice(6) as ThemeChoice)
  else if (props.extraAccount?.some((i) => i.id === id)) emit('account', id)
}

function submit(text: string) {
  const hit = props.repos ? matchRepos(props.repos, text) : []
  const exact = props.repos?.find((r) => r === text)
  if (exact ?? hit[0]) emit('open', (exact ?? hit[0])!)
  else emit('search', text)
}

const searching = ref(false)
const box = ref<InstanceType<typeof PynGlobalSearch> | null>(null)
const searchButton = ref<HTMLButtonElement | null>(null)
async function startSearch() {
  searching.value = true
  await nextTick()
  box.value?.focus()
}
function closeSearch() {
  searching.value = false
  searchButton.value?.focus()
}
function leaveSearch(e: FocusEvent) {
  if (!(e.currentTarget as HTMLElement).contains(e.relatedTarget as Node)) searching.value = false
}

function slash(e: KeyboardEvent) {
  if (e.key !== '/' || e.ctrlKey || e.metaKey || e.altKey || !props.showSearch) return
  const t = e.target as HTMLElement | null
  if (t?.closest('input, textarea, select, [contenteditable]')) return
  e.preventDefault()
  void startSearch()
}
onMounted(() => document.addEventListener('keydown', slash))
onBeforeUnmount(() => document.removeEventListener('keydown', slash))
</script>

<template>
  <div :class="styles.bar">
    <a :href="`#${mainId}`" :class="styles.skip" data-skip>Skip to content</a>
    <button
      type="button"
      :class="[styles.iconButton, styles.menuButton]"
      aria-label="Open navigation"
      aria-haspopup="dialog"
      :aria-expanded="drawer"
      data-menu-button
      @click="drawer = true"
    >
      <PynIcon name="menu" />
    </button>
    <a :href="links.home" :class="[styles.brand, repo && styles.compactBrand]">PYN</a>
    <div v-if="!signedOut && owner" :class="[styles.crumb, !repo && styles.wideOnly]">
      <PynMenu :label="`Switch owner, ${owner}`" :items="switcher" align="start">
        <span :class="styles.owner" :title="owner" data-owner>{{ owner }}</span>
        <PynIcon name="chevron" :class="styles.chevron" />
      </PynMenu>
      <template v-if="repo">
        <span :class="styles.slash" aria-hidden="true">/</span>
        <a
          :href="`/${owner}/${repo}`"
          :class="styles.repoName"
          :title="repo"
          aria-current="page"
          data-repo
          >{{ repo }}</a
        >
      </template>
    </div>
    <div
      v-if="showSearch"
      :class="[styles.searchWrap, searching && styles.searching]"
      @focusout="leaveSearch"
    >
      <PynGlobalSearch
        ref="box"
        :options="repos"
        :results="searchResults"
        @input="emit('input', $event)"
        @search="submit"
        @select="emit('selectResult', $event)"
        @keydown.esc="closeSearch"
      />
    </div>
    <button
      v-if="showSearch"
      ref="searchButton"
      type="button"
      :class="[styles.iconButton, styles.searchButton]"
      aria-label="Search"
      :aria-expanded="searching"
      @click="startSearch"
    >
      <PynIcon name="search" />
    </button>
    <span v-if="!showSearch" :class="styles.spacer" />
    <a :href="links.explore" :class="[styles.exploreLink, styles.wideOnly]" data-explore>Explore</a>
    <template v-if="signedOut">
      <PynMenu label="Theme" :items="themeItems" :class="styles.wideOnly" @select="pick"
        >Theme<PynIcon name="chevron" :class="styles.chevron"
      /></PynMenu>
      <a :href="signInHref ?? '/_/sign-in'" :class="styles.signIn" data-sign-in>Sign in</a>
    </template>
    <template v-else>
      <PynMenu label="Create" :items="create">
        <PynIcon name="plus" /><PynIcon name="chevron" :class="[styles.chevron, styles.wideOnly]" />
      </PynMenu>
      <a
        v-if="locks"
        :href="links.locks"
        :class="styles.pill"
        :data-expiring="locksExpiring || undefined"
        data-locks
      >
        <PynIcon name="lock" />
        <span aria-hidden="true">{{ locks }}</span>
        <span :class="styles.hidden">{{ locksText(locksHeld ?? 0, locksExpiring) }}</span>
      </a>
      <PynNotificationsBell
        :count="notifications"
        :entries="notificationEntries"
        :now="now"
        :href="links.notifications"
        @dismiss="emit('dismissNotification', $event)"
        @accept="emit('acceptNotification', $event)"
        @decline="emit('declineNotification', $event)"
      />
      <PynMenu label="Account menu" :items="account" @select="pick">
        <template #header>
          <p :class="styles.who">
            Signed in as
            <strong v-if="displayName">{{ displayName }} ({{ user }})</strong>
            <strong v-else>{{ user }}</strong>
          </p>
        </template>
        <PynAvatar
          v-if="displayName || avatarUrl"
          :username="user ?? ''"
          :name="displayName"
          :src="avatarUrl"
        />
        <span v-else :class="styles.avatar">{{ (user ?? '').slice(0, 1).toUpperCase() }}</span>
      </PynMenu>
    </template>
    <PynDrawer :open="drawer" title="PYN" side="start" width="20rem" @close="drawer = false">
      <nav :class="styles.drawerNav" aria-label="Main" @click="drawerClick">
        <template v-for="item in drawerItems" :key="item.id">
          <hr v-if="item.separator" :class="styles.drawerRule" />
          <p v-else-if="item.heading" :class="styles.drawerHeading">{{ item.label }}</p>
          <a v-else-if="item.href" :href="item.href" :class="styles.drawerItem">
            <span v-if="item.checked !== undefined" :class="styles.drawerCheck">{{
              item.checked ? '✓' : ''
            }}</span>{{ item.label }}
          </a>
          <button v-else type="button" :class="styles.drawerItem" @click.stop="drawerPick(item.id)">
            <span v-if="item.checked !== undefined" :class="styles.drawerCheck">{{
              item.checked ? '✓' : ''
            }}</span>{{ item.label }}
          </button>
        </template>
      </nav>
      <div v-if="$slots.drawer" :class="styles.drawerExtra" @click="drawerClick">
        <slot name="drawer" />
      </div>
    </PynDrawer>
  </div>
</template>
