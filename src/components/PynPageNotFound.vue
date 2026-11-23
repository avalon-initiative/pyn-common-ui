<script setup lang="ts">
import styles from '../styles/PynRepoNotFound.module.scss'

defineProps<{
  /** Text of the second link; shown only with `backHref`. */
  backLabel?: string
  backHref?: string
}>()
</script>

<template>
  <section :class="styles.box" role="alert">
    <h2 :class="styles.heading">Page not found</h2>
    <p :class="styles.note">There is nothing here, or your account may not see it.</p>
    <a href="/" :class="styles.link">Back to your repositories</a>
    <a v-if="backHref" :href="backHref" :class="[styles.link, styles.extra]" data-back>{{
      backLabel ?? 'Go back'
    }}</a>
    <span v-if="$slots.actions" :class="styles.extra"><slot name="actions" /></span>
  </section>
</template>
