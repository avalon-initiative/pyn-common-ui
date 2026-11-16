<script setup lang="ts">
import styles from '../styles/PynViewNotice.module.scss'

withDefaults(defineProps<{ tone?: 'warning' | 'info'; title?: string }>(), { tone: 'warning' })
</script>

<template>
  <div :class="[styles.notice, tone === 'info' ? styles.info : styles.warning]" role="status">
    <h3 v-if="title" :class="styles.title">{{ title }}</h3>
    <div :class="styles.text"><slot /></div>
  </div>
</template>
