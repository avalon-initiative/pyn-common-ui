<script setup lang="ts">
import { useId } from 'vue'
import styles from '../styles/PynSettingsSection.module.scss'

defineProps<{
  title: string
  /** Help text under the title. */
  description?: string
  /** Red border and title, for irreversible actions. */
  danger?: boolean
  /** Renders the default slot bare, without the bordered card of rows. */
  plain?: boolean
}>()

const id = useId()
</script>

<template>
  <section :class="[styles.section, danger && styles.danger]" :aria-labelledby="id">
    <div v-if="$slots.actions" :class="styles.head">
      <h3 :id="id" :class="styles.title">{{ title }}</h3>
      <div :class="styles.actions"><slot name="actions" /></div>
    </div>
    <h3 v-else :id="id" :class="styles.title">{{ title }}</h3>
    <p v-if="description" :class="styles.description">{{ description }}</p>
    <div :class="plain ? styles.plain : styles.rows"><slot /></div>
  </section>
</template>
