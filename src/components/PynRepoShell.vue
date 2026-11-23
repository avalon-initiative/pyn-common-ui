<script setup lang="ts">
import { computed } from 'vue'
import PynIcon from './PynIcon.vue'
import PynTabs from './PynTabs.vue'
import styles from '../styles/PynRepoShell.module.scss'
import { BRANCH_SECTIONS, TAB_ICONS, repoPath } from '../state/repo.state'
import type { RepoShellTab } from '../state/repo.state'
import type { Visibility } from '../types/repo.types'

const props = defineProps<{
  owner: string
  name: string
  visibility: Visibility
  /** Omitted when the viewer has no access, which hides the tab bar. */
  tabs?: RepoShellTab[]
  /** Section of the open page; a tab is current for its section and everything under it. */
  current?: string
  /** Where the owner crumb links; defaults to `/<owner>`. */
  ownerHref?: string
  /** Branch the repository link and the Code and History tabs keep; omitted is the default branch. */
  branch?: string
  /** Drops the owner and name path, for pages that already show it (breadcrumbs). */
  hidePath?: boolean
  /** Exclusive files locked now; the lock strip shows when it is above 0 and the Locks tab gets this count unless it has its own. */
  lockedCount?: number
  /** Names of the accounts holding locks; the first few show in the lock strip. */
  lockHolders?: string[]
  /** Most tabs shown before the rest move into a More menu. */
  maxTabs?: number
  /** While the lock count loads, reserves the lock strip and the Locks tab count so the page does not shift. */
  lockPending?: boolean
}>()

const HOLDERS_SHOWN = 3

function isCurrent(section: string): boolean {
  const c = props.current ?? ''
  return section === '' ? c === '' : c === section || c.startsWith(`${section}/`)
}

const tabItems = computed(() =>
  (props.tabs ?? []).map((tab) => {
    const count =
      tab.count ?? (tab.section === 'locks' && props.lockedCount ? props.lockedCount : undefined)
    return {
      label: tab.label,
      href: repoPath(
        { owner: props.owner, name: props.name },
        tab.section,
        BRANCH_SECTIONS.has(tab.section) ? props.branch : undefined,
      ),
      count,
      countLabel: tab.countLabel ?? (tab.section === 'locks' ? `${count} locked` : undefined),
      current: isCurrent(tab.section),
      icon: tab.icon ?? TAB_ICONS[tab.section],
      reserveCount: tab.section === 'locks' && props.lockPending,
    }
  }),
)
const holders = computed(() => (props.lockHolders ?? []).slice(0, HOLDERS_SHOWN))
const otherHolders = computed(() => (props.lockHolders ?? []).length - holders.value.length)
</script>

<template>
  <div :class="styles.shell">
    <header :class="styles.header">
      <div :class="styles.top">
        <component :is="hidePath ? 'div' : 'h1'" :class="styles.title">
          <nav v-if="!hidePath" :class="styles.path" aria-label="Repository path">
            <PynIcon name="repo" :class="styles.repoIcon" />
            <a :href="ownerHref ?? `/${encodeURIComponent(owner)}`" :class="styles.owner">{{
              owner
            }}</a>
            <span :class="styles.sep" aria-hidden="true">/</span>
            <a :href="repoPath({ owner, name }, '', branch)" :class="styles.name">{{ name }}</a>
          </nav>
          <span :class="styles.badge" data-visibility>{{
            visibility === 'public' ? 'Public' : 'Private'
          }}</span>
        </component>
        <div
          v-if="$slots.watch || $slots.fork || $slots.star || $slots.actions"
          :class="styles.actions"
        >
          <slot name="watch" />
          <slot name="fork" />
          <slot name="star" />
          <slot name="actions" />
        </div>
      </div>
      <PynTabs v-if="tabs" :items="tabItems" label="Repository" :max="maxTabs" />
    </header>
    <p v-if="lockedCount" :class="styles.strip" data-lock-strip>
      <PynIcon name="lock" :class="styles.stripIcon" />
      <span :class="styles.stripText"
        >{{ lockedCount }} exclusive {{ lockedCount === 1 ? 'file' : 'files' }} locked now<template
          v-if="holders.length"
        >
          by {{ holders.join(', ')
          }}<template v-if="otherHolders > 0"> and {{ otherHolders }} more</template></template
        ></span
      >
      <a :href="repoPath({ owner, name }, 'locks')" :class="styles.stripLink">View locks</a>
    </p>
    <p
      v-else-if="lockPending"
      :class="[styles.strip, styles.pending]"
      aria-hidden="true"
      data-lock-pending
    >
      &nbsp;
    </p>
    <div :class="styles.body"><slot /></div>
  </div>
</template>
