<script setup lang="ts">
import styles from '../styles/PynRepoShell.module.scss'
import { repoPath } from '../state/repo.state'
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
}>()

function isCurrent(section: string): boolean {
  const c = props.current ?? ''
  return section === '' ? c === '' : c === section || c.startsWith(`${section}/`)
}
</script>

<template>
  <div :class="styles.shell">
    <header :class="styles.header">
      <div :class="styles.top">
        <h1 :class="styles.title">
          <nav aria-label="Repository path">
            <a :href="ownerHref ?? `/${encodeURIComponent(owner)}`" :class="styles.owner">{{
              owner
            }}</a>
            <span :class="styles.sep" aria-hidden="true">/</span>
            <a :href="repoPath({ owner, name })" :class="styles.name">{{ name }}</a>
          </nav>
          <span :class="styles.badge" data-visibility>{{
            visibility === 'public' ? 'Public' : 'Private'
          }}</span>
        </h1>
        <div v-if="$slots.actions" :class="styles.actions"><slot name="actions" /></div>
      </div>
      <nav v-if="tabs" :class="styles.tabs" aria-label="Repository">
        <a
          v-for="tab in tabs"
          :key="tab.section"
          :href="repoPath({ owner, name }, tab.section)"
          :class="styles.tab"
          :aria-current="isCurrent(tab.section) ? 'page' : undefined"
        >
          {{ tab.label }}
          <span v-if="tab.count !== undefined" :class="styles.count" data-count>{{
            tab.count
          }}</span>
        </a>
      </nav>
    </header>
    <div :class="styles.body"><slot /></div>
  </div>
</template>
