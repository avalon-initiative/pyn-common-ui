<script setup lang="ts">
import { computed } from 'vue'
import PynAvatar from './PynAvatar.vue'
import PynTabs from './PynTabs.vue'
import styles from '../styles/PynUserHeader.module.scss'
import { orgPath, userTabs } from '../state/org.state'

const props = defineProps<{
  name: string
  self?: boolean
  current?: string
  /** Image shown beside the name; initials without it. */
  avatarUrl?: string | null
}>()

const tabs = computed(() =>
  userTabs(!!props.self).map((t) => ({
    label: t.label,
    href: orgPath(props.name, t.section),
    current: t.section === (props.current ?? ''),
  })),
)
</script>

<template>
  <header :class="styles.header">
    <div :class="styles.identity">
      <PynAvatar :class="styles.avatar" :username="name" :src="avatarUrl" size="lg" />
      <h1 :class="styles.title">{{ name }}</h1>
    </div>
    <PynTabs :items="tabs" label="User" />
  </header>
</template>
