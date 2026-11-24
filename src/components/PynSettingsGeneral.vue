<script setup lang="ts">
import styles from '../styles/PynSettingsGeneral.module.scss'

defineProps<{
  /** Heading above the `picture` slot. */
  pictureTitle?: string
}>()
</script>

<template>
  <div :class="[styles.general, $slots.picture && styles.withPicture]">
    <div :class="styles.fields"><slot /></div>
    <aside v-if="$slots.picture" :class="styles.picture">
      <h4 v-if="pictureTitle" :class="styles.pictureTitle">{{ pictureTitle }}</h4>
      <slot name="picture" />
    </aside>
  </div>
</template>
