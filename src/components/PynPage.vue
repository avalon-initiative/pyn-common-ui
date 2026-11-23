<script setup lang="ts">
import styles from '../styles/PynPage.module.scss'

defineProps<{
  /** Drops the maximum width (code view, policy editor); the gutters stay. */
  wide?: boolean
}>()
</script>

<template>
  <div :class="[styles.page, wide && styles.wide]" :data-wide="wide || undefined">
    <slot />
  </div>
</template>
