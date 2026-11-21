<script setup lang="ts">
import styles from '../styles/PynRepoNav.module.scss'
import { BRANCH_SECTIONS, repoPath } from '../state/repo.state'
import type { RepoTab } from '../state/repo.state'

defineProps<{
  owner: string
  name: string
  tabs: RepoTab[]
  current: string
  /** Branch the Code and History tabs keep; omitted is the default branch. */
  branch?: string
}>()
</script>

<template>
  <nav :class="styles.nav" aria-label="Repository">
    <a
      v-for="tab in tabs"
      :key="tab.section"
      :href="
        repoPath(
          { owner, name },
          tab.section,
          BRANCH_SECTIONS.has(tab.section) ? branch : undefined,
        )
      "
      :class="styles.tab"
      :aria-current="tab.section === current ? 'page' : undefined"
      >{{ tab.label }}</a
    >
  </nav>
</template>
