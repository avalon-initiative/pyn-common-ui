<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, ref, useId, watch } from 'vue'
import PynIcon from './PynIcon.vue'
import styles from '../styles/PynCommandPalette.module.scss'
import {
  filterCommands,
  groupCommands,
  moveActive,
  resultsText,
} from '../state/command-palette.state'
import { lockBodyScroll } from '../utils/scroll-lock'
import type { CommandItem } from '../types/command-palette.types'

const props = defineProps<{
  open: boolean
  items: CommandItem[]
  /** The dialog's accessible name. */
  label: string
  loading?: boolean
  placeholder?: string
  emptyLabel?: string
  /** Show the items as given instead of filtering them by the typed text, for results the app loads itself. */
  unfiltered?: boolean
  /** Text the field holds each time the palette opens, for a search submitted elsewhere. */
  initialText?: string
}>()
const emit = defineEmits<{ close: []; select: [item: CommandItem]; input: [text: string] }>()

const uid = useId()
const listId = `${uid}-list`
const text = ref('')
const active = ref(0)
const field = ref<HTMLInputElement>()
const list = ref<HTMLElement>()
let opener: HTMLElement | null = null
let release: (() => void) | null = null

const results = computed(() =>
  props.unfiltered ? props.items : filterCommands(props.items, text.value),
)
const groups = computed(() => groupCommands(results.value))
const flat = computed(() => groups.value.flatMap((g) => g.items))
const empty = computed(() => props.emptyLabel ?? 'No results')
const status = computed(() => resultsText(flat.value.length, !!props.loading, empty.value))
const optionId = (i: number) => `${uid}-opt-${i}`
const activeId = computed(() =>
  active.value >= 0 && flat.value.length ? optionId(active.value) : undefined,
)
const indexOf = (item: CommandItem) => flat.value.indexOf(item)

watch(
  () => props.open,
  async (open) => {
    if (open) {
      opener = document.activeElement instanceof HTMLElement ? document.activeElement : null
      release ??= lockBodyScroll()
      text.value = props.initialText ?? ''
      active.value = 0
      if (text.value) emit('input', text.value)
      await nextTick()
      field.value?.focus()
    } else {
      release?.()
      release = null
      const target = opener
      opener = null
      await nextTick()
      target?.focus()
    }
  },
  { immediate: true },
)
onBeforeUnmount(() => release?.())

watch(
  () => flat.value.length,
  (n) => {
    if (active.value >= n) active.value = n - 1
    if (active.value < 0 && n) active.value = 0
  },
)

function onInput() {
  active.value = 0
  emit('input', text.value)
}

async function reveal() {
  await nextTick()
  const el = list.value?.querySelector<HTMLElement>(`[id="${activeId.value}"]`)
  el?.scrollIntoView?.({ block: 'nearest' })
}

function choose(item: CommandItem) {
  emit('select', item)
}

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape') {
    e.stopPropagation()
    emit('close')
  } else if (e.key === 'Tab') {
    e.preventDefault()
    field.value?.focus()
  } else if (['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(e.key)) {
    e.preventDefault()
    active.value = moveActive(active.value, flat.value.length, e.key)
    reveal()
  } else if (e.key === 'Enter' && !e.isComposing) {
    e.preventDefault()
    const el = activeId.value
      ? list.value?.querySelector<HTMLElement>(`[id="${activeId.value}"]`)
      : null
    el?.click()
  }
}
</script>

<template>
  <Transition
    :enter-active-class="styles.active"
    :leave-active-class="styles.active"
    :enter-from-class="styles.hidden"
    :leave-to-class="styles.hidden"
  >
    <div v-if="open" :class="styles.root" @keydown="onKeydown">
      <div :class="styles.backdrop" data-test="backdrop" @click="emit('close')" />
      <div :class="styles.panel" role="dialog" aria-modal="true" :aria-label="label">
        <div :class="styles.search">
          <PynIcon name="search" :class="styles.icon" />
          <input
            ref="field"
            v-model="text"
            type="text"
            role="combobox"
            :class="styles.input"
            :placeholder="placeholder ?? 'Type a command or search…'"
            :aria-label="label"
            aria-expanded="true"
            aria-autocomplete="list"
            aria-haspopup="listbox"
            :aria-controls="listId"
            :aria-activedescendant="activeId"
            autocomplete="off"
            spellcheck="false"
            @input="onInput"
          />
        </div>
        <div
          :id="listId"
          ref="list"
          role="listbox"
          :aria-label="label"
          :aria-busy="loading ? 'true' : undefined"
          :class="styles.list"
        >
          <div
            v-for="(g, gi) in groups"
            :key="g.group"
            role="group"
            :aria-labelledby="`${uid}-g${gi}`"
          >
            <div :id="`${uid}-g${gi}`" :class="styles.heading">{{ g.group }}</div>
            <component
              :is="item.href ? 'a' : 'div'"
              v-for="item in g.items"
              :id="optionId(indexOf(item))"
              :key="item.id"
              role="option"
              :href="item.href"
              tabindex="-1"
              :aria-selected="indexOf(item) === active ? 'true' : 'false'"
              :class="[styles.option, indexOf(item) === active && styles.active_option]"
              @click="choose(item)"
              @mousemove="active = indexOf(item)"
            >
              <span :class="styles.optionLabel">{{ item.label }}</span>
              <span v-if="item.hint" :class="styles.hintText">{{ item.hint }}</span>
            </component>
          </div>
          <p v-if="loading" :class="styles.note">Loading…</p>
          <p v-else-if="!flat.length" :class="styles.note">{{ empty }}</p>
        </div>
        <div role="status" aria-live="polite" :class="styles.live">{{ status }}</div>
      </div>
    </div>
  </Transition>
</template>
