<script setup lang="ts">
import styles from '../styles/PynLoading.module.scss'

withDefaults(defineProps<{ label?: string; variant?: 'inline' | 'block' | 'compact' }>(), {
  label: 'Loading',
  variant: 'inline',
})
</script>

<template>
  <div
    :class="[styles.loading, styles[variant]]"
    role="status"
    aria-live="polite"
    :data-variant="variant"
  >
    <span v-if="variant === 'block'" :class="styles.lines" aria-hidden="true">
      <span :class="styles.line" /><span :class="styles.line" /><span :class="styles.line" />
    </span>
    <span v-else :class="styles.spinner" aria-hidden="true" />
    <span :class="styles.label">{{ label }}</span>
  </div>
</template>
