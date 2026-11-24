<script setup lang="ts">
import { computed, ref, useId, watch } from 'vue'
import PynAvatar from './PynAvatar.vue'
import PynIcon from './PynIcon.vue'
import styles from '../styles/PynGlobalSearch.module.scss'
import { groupSearchResults, searchHint, searchResultsText } from '../state/global-search.state'
import { moveActive } from '../state/command-palette.state'
import type { SearchResult } from '../types/search.types'

const props = defineProps<{
  options?: string[]
  placeholder?: string
  /** Owners, repositories and suggestions shown in a grouped dropdown under the field while it has text. */
  results?: SearchResult[]
}>()
const emit = defineEmits<{
  input: [text: string]
  search: [text: string]
  select: [result: SearchResult]
}>()

const uid = useId()
const text = ref('')
const field = ref<HTMLInputElement | null>(null)
const panel = ref<HTMLElement | null>(null)
const focused = ref(false)
const dismissed = ref(false)
const active = ref(-1)
defineExpose({ focus: () => field.value?.focus() })

const groups = computed(() => groupSearchResults(props.results ?? []))
const flat = computed(() => groups.value.flatMap((g) => g.items))
const open = computed(
  () => focused.value && !dismissed.value && text.value.trim() !== '' && flat.value.length > 0,
)
const optionId = (i: number) => `${uid}-opt-${i}`
const activeId = computed(() =>
  open.value && active.value >= 0 ? optionId(active.value) : undefined,
)
const indexOf = (r: SearchResult) => flat.value.indexOf(r)

watch(flat, () => (active.value = -1))

function onInput() {
  dismissed.value = false
  active.value = -1
  emit('input', text.value)
}
function submit() {
  emit('search', text.value.trim())
}
function onKeydown(e: KeyboardEvent) {
  if (!open.value) {
    if (e.key === 'ArrowDown' && flat.value.length) dismissed.value = false
    return
  }
  if (e.key === 'Escape') {
    dismissed.value = true
  } else if (['ArrowDown', 'ArrowUp'].includes(e.key)) {
    e.preventDefault()
    active.value = moveActive(active.value, flat.value.length, e.key)
  } else if (e.key === 'Enter' && active.value >= 0 && !e.isComposing) {
    e.preventDefault()
    panel.value?.querySelector<HTMLElement>(`[id="${activeId.value}"]`)?.click()
  }
}
function choose(r: SearchResult) {
  dismissed.value = true
  emit('select', r)
}
</script>

<template>
  <form
    :class="styles.search"
    role="search"
    @submit.prevent="submit"
    @focusin="focused = true"
    @focusout="focused = false"
  >
    <PynIcon name="search" :class="styles.icon" />
    <input
      ref="field"
      v-model="text"
      type="search"
      :class="styles.input"
      :placeholder="placeholder ?? 'Search or jump to…'"
      aria-label="Search or jump to"
      aria-keyshortcuts="/"
      autocomplete="off"
      :role="results ? 'combobox' : undefined"
      :aria-expanded="results ? open : undefined"
      :aria-controls="results ? `${uid}-list` : undefined"
      :aria-activedescendant="activeId"
      :aria-autocomplete="results ? 'list' : undefined"
      :list="options?.length && !results ? 'pyn-global-search-options' : undefined"
      @input="onInput"
      @keydown="onKeydown"
    />
    <kbd v-if="!text" :class="styles.hint" aria-hidden="true">/</kbd>
    <datalist v-if="options?.length && !results" id="pyn-global-search-options">
      <option v-for="o in options" :key="o" :value="o" />
    </datalist>
    <div
      v-if="results"
      v-show="open"
      :id="`${uid}-list`"
      ref="panel"
      role="listbox"
      aria-label="Search results"
      :class="styles.panel"
      @mousedown.prevent
    >
      <div v-for="(g, gi) in groups" :key="g.kind" role="group" :aria-labelledby="`${uid}-g${gi}`">
        <div :id="`${uid}-g${gi}`" :class="styles.heading" data-group>{{ g.title }}</div>
        <a
          v-for="r in g.items"
          :id="optionId(indexOf(r))"
          :key="r.id"
          role="option"
          :href="r.href"
          tabindex="-1"
          :aria-selected="indexOf(r) === active ? 'true' : 'false'"
          :class="[styles.option, indexOf(r) === active && styles.current]"
          @click="choose(r)"
          @mousemove="active = indexOf(r)"
        >
          <PynAvatar
            v-if="r.kind === 'owner'"
            :username="r.label"
            :src="r.avatarUrl"
            size="sm"
            :class="styles.lead"
          />
          <PynIcon
            v-else
            :name="r.kind === 'repository' ? 'repo' : 'search'"
            :class="styles.lead"
          />
          <span :class="styles.label">{{ r.label }}</span>
          <span v-if="searchHint(r)" :class="styles.optionHint">{{ searchHint(r) }}</span>
        </a>
      </div>
      <div role="status" aria-live="polite" :class="styles.live">
        {{ searchResultsText(flat.length) }}
      </div>
    </div>
  </form>
</template>
