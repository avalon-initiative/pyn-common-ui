<script setup lang="ts">
import styles from '../styles/PynUserHeader.module.scss'
import { orgPath, userTabs } from '../state/org.state'

defineProps<{ name: string; self?: boolean; current?: string }>()
</script>

<template>
  <header :class="styles.header">
    <h1 :class="styles.title">{{ name }}</h1>
    <nav :class="styles.nav" aria-label="User">
      <a
        v-for="tab in userTabs(!!self)"
        :key="tab.section"
        :href="orgPath(name, tab.section)"
        :class="styles.tab"
        :aria-current="tab.section === (current ?? '') ? 'page' : undefined"
        >{{ tab.label }}</a
      >
    </nav>
  </header>
</template>
