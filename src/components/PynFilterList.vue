<script setup lang="ts">
import { computed } from 'vue'
import PynEmptyState from './PynEmptyState.vue'
import type { PynEmptyStateKind } from './PynEmptyState.vue'
import PynIcon from './PynIcon.vue'
import PynLoading from './PynLoading.vue'
import styles from '../styles/PynFilterList.module.scss'
import { rowCountText, pageCount, pageWindow, rangeText } from '../state/filter-list.state'
import type { FilterListControl } from '../types/filter-list.types'

const props = withDefaults(
  defineProps<{
    /** Total number of rows across every page. */
    count: number
    /** Singular and plural of the row name, for the count header. */
    noun?: string
    plural?: string
    /** Selects beside the search field; each emits `control`. */
    controls?: FilterListControl[]
    searchLabel?: string
    placeholder?: string
    /** 1-based current page; the footer shows when there is more than one page. */
    page?: number
    pageSize?: number
    loading?: boolean
    error?: string
    /** Treat an empty list as the result of a search or filter; defaults to a non-empty query. */
    filtered?: boolean
    /** Props of the empty state for a list with nothing in it. */
    emptyKind?: PynEmptyStateKind
    emptyTitle?: string
    emptyDescription?: string
    /** Accessible name of the list. */
    label?: string
    /** `inside` puts the count, selects and search in one row inside the box, under the `tabs` slot. */
    bar?: 'above' | 'inside'
  }>(),
  {
    bar: 'above',
    noun: 'result',
    page: 1,
    pageSize: 30,
    searchLabel: 'Search',
    emptyKind: 'empty',
    filtered: undefined,
  },
)
const query = defineModel<string>('query', { default: '' })
const emit = defineEmits<{
  control: [id: string, value: string]
  'update:page': [page: number]
}>()

const pages = computed(() => pageCount(props.count, props.pageSize))
const numbers = computed(() => pageWindow(props.page, pages.value))
const isFiltered = computed(() => props.filtered ?? query.value.trim() !== '')
const inside = computed(() => props.bar === 'inside')
const heading = computed(() => rowCountText(props.count, props.noun, props.plural))
const go = (p: number) => {
  if (p >= 1 && p <= pages.value && p !== props.page) emit('update:page', p)
}
</script>

<template>
  <section :class="[styles.list, inside && styles.inside]">
    <div v-if="$slots.tabs && inside" :class="styles.tabs"><slot name="tabs" /></div>
    <div :class="styles.bar" :data-count="inside ? '' : undefined">
      <span v-if="inside" :class="styles.heading" aria-live="polite">{{ heading }}</span>
      <div :class="styles.search" role="search">
        <PynIcon name="search" :class="styles.icon" />
        <input
          v-model="query"
          type="search"
          :class="styles.input"
          :placeholder="placeholder ?? `${searchLabel}…`"
          :aria-label="searchLabel"
        />
      </div>
      <select
        v-for="c in controls"
        :key="c.id"
        :class="styles.control"
        :aria-label="c.label"
        :value="c.value"
        @change="emit('control', c.id, ($event.target as HTMLSelectElement).value)"
      >
        <option v-for="o in c.options" :key="o.value" :value="o.value">{{ o.label }}</option>
      </select>
      <div v-if="$slots.actions" :class="styles.actions"><slot name="actions" /></div>
    </div>
    <div :class="styles.box">
      <div
        v-if="!inside || $slots.header"
        :class="styles.header"
        :data-count="inside ? undefined : ''"
      >
        <span :class="styles.lead">
          <slot name="lead" />
          <span v-if="!inside" :class="styles.heading" aria-live="polite">{{ heading }}</span>
        </span>
        <div v-if="$slots.header" :class="styles.tools"><slot name="header" /></div>
      </div>
      <PynLoading v-if="loading" variant="block" :class="styles.state" />
      <p v-else-if="error" :class="styles.error" role="alert">{{ error }}</p>
      <ul v-else-if="count > 0" :class="styles.rows" :aria-label="label">
        <slot />
      </ul>
      <slot v-else name="empty">
        <PynEmptyState
          v-if="isFiltered"
          compact
          kind="empty"
          icon="search"
          title="No matches"
          description="Nothing matches the current search or filters."
          data-no-match
        />
        <PynEmptyState
          v-else
          compact
          :kind="emptyKind"
          :title="emptyTitle"
          :description="emptyDescription"
        />
      </slot>
      <nav v-if="pages > 1 && !loading" :class="styles.footer" aria-label="Pagination">
        <span :class="styles.range" data-range>{{ rangeText(count, page, pageSize) }}</span>
        <ul :class="styles.pages">
          <li>
            <button
              type="button"
              :class="styles.page"
              :disabled="page <= 1"
              data-prev
              @click="go(page - 1)"
            >
              Previous
            </button>
          </li>
          <li v-for="(p, i) in numbers" :key="i">
            <span v-if="p === null" :class="styles.gap" aria-hidden="true">…</span>
            <button
              v-else
              type="button"
              :class="styles.page"
              :aria-current="p === page ? 'page' : undefined"
              :aria-label="`Page ${p}`"
              @click="go(p)"
            >
              {{ p }}
            </button>
          </li>
          <li>
            <button
              type="button"
              :class="styles.page"
              :disabled="page >= pages"
              data-next
              @click="go(page + 1)"
            >
              Next
            </button>
          </li>
        </ul>
      </nav>
    </div>
  </section>
</template>
