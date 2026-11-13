<script setup lang="ts">
import styles from '../styles/PynAccountSettings.module.scss'
import { repoSettingsPath } from '../state/repo.state'
import type { RepoTab } from '../state/repo.state'

defineProps<{
  owner: string
  name: string
  /** Sub-pages from `repoSettingsNav`. */
  items: RepoTab[]
  /** Section of the open sub-page. */
  current: string
}>()
</script>

<template>
  <div :class="styles.layout">
    <nav :class="styles.nav" aria-label="Repository settings">
      <a
        v-for="item in items"
        :key="item.section"
        :href="repoSettingsPath({ owner, name }, item.section)"
        :class="styles.link"
        :aria-current="item.section === current ? 'page' : undefined"
        >{{ item.label }}</a
      >
    </nav>
    <div :class="styles.body"><slot /></div>
  </div>
</template>
