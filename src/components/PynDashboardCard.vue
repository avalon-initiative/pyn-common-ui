<script setup lang="ts">
import { useId } from 'vue'
import styles from '../styles/PynDashboardCard.module.scss'

withDefaults(
  defineProps<{
    heading: string
    headingLevel?: 2 | 3 | 4
    /** Adds a "See all" link in the header. */
    seeAllHref?: string
    loading?: boolean
    /** Replaces the content and is announced. */
    error?: string
    /** Shows a Try again button with the error. */
    retryable?: boolean
    /** Drops the body padding so a flat list fills the card edge to edge. */
    flush?: boolean
  }>(),
  { headingLevel: 2 },
)
const emit = defineEmits<{ retry: []; seeAll: [event: MouseEvent] }>()
const id = useId()
</script>

<template>
  <section :class="styles.card" :aria-labelledby="id" :aria-busy="loading || undefined">
    <header :class="styles.header">
      <component :is="`h${headingLevel}`" :id="id" :class="styles.heading">{{ heading }}</component>
      <span :class="styles.actions">
        <slot name="actions" />
        <a
          v-if="seeAllHref"
          :href="seeAllHref"
          :class="styles.seeAll"
          @click="emit('seeAll', $event)"
          >See all<span :class="styles.hidden">{{ ` ${heading}` }}</span></a
        >
      </span>
    </header>
    <p v-if="loading" :class="styles.status" role="status">Loading…</p>
    <div v-else-if="error" :class="styles.errorBox">
      <p :class="styles.error" role="alert">{{ error }}</p>
      <button v-if="retryable" type="button" :class="styles.retry" @click="emit('retry')">
        Try again
      </button>
    </div>
    <div v-else :class="styles.body" :data-flush="flush || undefined"><slot /></div>
  </section>
</template>
