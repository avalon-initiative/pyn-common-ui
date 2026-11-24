<script setup lang="ts">
import styles from '../styles/PynSettingsRow.module.scss'

defineProps<{
  title: string
  help?: string
  /** `id` of the control, making the title its label. */
  labelFor?: string
}>()
</script>

<template>
  <div :class="styles.row">
    <div :class="styles.text">
      <component :is="labelFor ? 'label' : 'span'" :for="labelFor" :class="styles.title">{{
        title
      }}</component>
      <span v-if="help" :class="styles.help">{{ help }}</span>
    </div>
    <div :class="styles.control"><slot /></div>
  </div>
</template>
