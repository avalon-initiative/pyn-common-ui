<script setup lang="ts">
import PynIcon from './PynIcon.vue'
import styles from '../styles/PynRepoNotFound.module.scss'

defineProps<{
  /** Text of the second link; shown only with `backHref`. */
  backLabel?: string
  backHref?: string
}>()
</script>

<template>
  <section :class="styles.box" role="alert">
    <PynIcon name="search" :class="styles.icon" />
    <h2 :class="styles.heading">Page not found</h2>
    <p :class="styles.note">There is nothing here, or your account may not see it.</p>
    <div :class="styles.actions">
      <a href="/" :class="styles.link">Back to your repositories</a>
      <a v-if="backHref" :href="backHref" :class="styles.extra" data-back>{{
        backLabel ?? 'Go back'
      }}</a>
      <span v-if="$slots.actions" :class="styles.slotted"><slot name="actions" /></span>
    </div>
  </section>
</template>
