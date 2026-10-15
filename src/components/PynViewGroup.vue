<script setup lang="ts">
import styles from '../styles/PynViewGroup.module.scss'

defineProps<{ title: string }>()
</script>

<template>
  <section :class="styles.group">
    <h2 :class="styles.title">{{ title }}</h2>
    <slot />
  </section>
</template>
