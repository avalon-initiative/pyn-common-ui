<script setup lang="ts">
import styles from '../styles/PynPageColumns.module.scss'

withDefaults(
  defineProps<{
    /** Keeps the side column in view while the main column scrolls (from 1012px up). */
    sticky?: boolean
    /** Accessible name of the side column. */
    sideLabel?: string
  }>(),
  { sticky: true },
)
</script>

<template>
  <div :class="[styles.columns, !$slots.side && styles.single]">
    <div :class="styles.main"><slot /></div>
    <aside
      v-if="$slots.side"
      :class="[styles.side, sticky && styles.sticky]"
      :aria-label="sideLabel"
    >
      <slot name="side" />
    </aside>
  </div>
</template>
