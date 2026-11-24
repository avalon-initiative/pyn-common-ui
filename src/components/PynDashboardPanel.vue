<script setup lang="ts">
import { nextTick, ref, useId } from 'vue'
import PynIcon from './PynIcon.vue'
import styles from '../styles/PynDashboardPanel.module.scss'

withDefaults(
  defineProps<{
    heading: string
    headingLevel?: 2 | 3 | 4
    viewAllHref?: string
    /** Shows a filter button that reveals a text field; the text is the `query` model. */
    filterable?: boolean
    filterLabel?: string
    loading?: boolean
    /** Replaces the rows and is announced. */
    error?: string
    retryable?: boolean
  }>(),
  { headingLevel: 2, filterLabel: 'Filter' },
)
const query = defineModel<string>('query', { default: '' })
const emit = defineEmits<{ retry: []; viewAll: [event: MouseEvent] }>()

const id = useId()
const filtering = ref(false)
const input = ref<HTMLInputElement | null>(null)

async function toggle() {
  filtering.value = !filtering.value
  if (!filtering.value) return void (query.value = '')
  await nextTick()
  input.value?.focus()
}
</script>

<template>
  <section :class="styles.panel" :aria-labelledby="id" :aria-busy="loading || undefined">
    <header :class="styles.head">
      <component :is="`h${headingLevel}`" :id="id" :class="styles.heading">{{ heading }}</component>
      <span :class="styles.actions">
        <slot name="actions" />
        <a
          v-if="viewAllHref"
          :href="viewAllHref"
          :class="styles.viewAll"
          @click="emit('viewAll', $event)"
          >View all<span :class="styles.hidden">{{ ` ${heading}` }}</span></a
        >
        <button
          v-if="filterable"
          type="button"
          :class="styles.iconButton"
          :aria-label="filtering ? `Close ${filterLabel.toLowerCase()}` : filterLabel"
          :aria-expanded="filtering"
          @click="toggle"
        >
          <PynIcon :name="filtering ? 'close' : 'filter'" />
        </button>
      </span>
    </header>
    <input
      v-if="filterable && filtering"
      ref="input"
      v-model="query"
      type="text"
      :class="styles.filter"
      :aria-label="filterLabel"
      placeholder="Filter…"
      @keydown.esc.stop="toggle"
    />
    <p v-if="loading" :class="styles.status" role="status">Loading…</p>
    <div v-else-if="error" :class="styles.errorBox">
      <p :class="styles.error" role="alert">{{ error }}</p>
      <button v-if="retryable" type="button" :class="styles.retry" @click="emit('retry')">
        Try again
      </button>
    </div>
    <div v-else :class="styles.card"><slot /></div>
  </section>
</template>
