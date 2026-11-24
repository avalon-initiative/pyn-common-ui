<script setup lang="ts">
import { computed } from 'vue'
import PynSettingsLayout from './PynSettingsLayout.vue'
import { repoSettingsPath } from '../state/repo.state'
import type { RepoTab } from '../state/repo.state'

const props = defineProps<{
  owner: string
  name: string
  /** Sub-pages from `repoSettingsNav`. */
  items: RepoTab[]
  /** Section of the open sub-page. */
  current: string
  title?: string
}>()

const sections = computed(() =>
  props.items.map((i) => ({
    id: i.section,
    label: i.label,
    group: i.group,
    icon: i.icon,
    href: repoSettingsPath({ owner: props.owner, name: props.name }, i.section),
  })),
)
</script>

<template>
  <PynSettingsLayout
    :sections="sections"
    :current="current"
    :title="title"
    label="Repository settings"
  >
    <slot />
  </PynSettingsLayout>
</template>
