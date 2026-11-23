<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, ref, useId, watch } from 'vue'
import PynIcon from './PynIcon.vue'
import styles from '../styles/PynMultiSelect.module.scss'
import { filterOptions, labelOf, toggleValue } from '../state/multi-select.state'
import type { MultiSelectOption } from '../types/multi-select.types'

const props = withDefaults(
  defineProps<{
    options: MultiSelectOption[]
    modelValue: string[]
    label?: string
    id?: string
    placeholder?: string
    filterPlaceholder?: string
    emptyLabel?: string
    noResultsLabel?: string
    disabled?: boolean
  }>(),
  {
    placeholder: 'Choose',
    filterPlaceholder: 'Filter',
    emptyLabel: 'Nothing chosen',
    noResultsLabel: 'No matches',
  },
)
const emit = defineEmits<{ 'update:modelValue': [value: string[]] }>()

const uid = useId()
const triggerId = computed(() => props.id ?? `${uid}-trigger`)
const labelId = `${uid}-label`
const listId = `${uid}-list`
const root = ref<HTMLElement | null>(null)
const trigger = ref<HTMLButtonElement | null>(null)
const filter = ref<HTMLInputElement | null>(null)
const list = ref<HTMLElement | null>(null)
const open = ref(false)
const query = ref('')
const active = ref(0)
const announcement = ref('')

const shown = computed(() => filterOptions(props.options, query.value))
const activeId = computed(() =>
  shown.value[active.value] ? `${uid}-opt-${active.value}` : undefined,
)

function say(text: string) {
  announcement.value = text
}

function commit(next: string[], message: string) {
  emit('update:modelValue', next)
  say(message)
}

function choose(value: string) {
  const adding = !props.modelValue.includes(value)
  const name = labelOf(props.options, value)
  commit(toggleValue(props.modelValue, value), adding ? `Added ${name}` : `Removed ${name}`)
}

function remove(value: string) {
  if (props.disabled) return
  commit(
    props.modelValue.filter((v) => v !== value),
    `Removed ${labelOf(props.options, value)}`,
  )
}

async function show() {
  if (props.disabled) return
  open.value = true
  query.value = ''
  active.value = 0
  await nextTick()
  filter.value?.focus()
}

function close(refocus: boolean) {
  open.value = false
  if (refocus) trigger.value?.focus()
}

function toggle() {
  if (open.value) close(false)
  else void show()
}

function move(by: number) {
  const n = shown.value.length
  if (!n) return
  active.value = (active.value + by + n) % n
  void nextTick(() => {
    list.value?.querySelector(`[id="${activeId.value}"]`)?.scrollIntoView?.({ block: 'nearest' })
  })
}

function filterKey(e: KeyboardEvent) {
  if (e.key === 'ArrowDown') move(1)
  else if (e.key === 'ArrowUp') move(-1)
  else if (e.key === 'Home') active.value = 0
  else if (e.key === 'End') active.value = Math.max(shown.value.length - 1, 0)
  else if (e.key === 'Enter') {
    const o = shown.value[active.value]
    if (o) choose(o.value)
  } else if (e.key === 'Escape') close(true)
  else if (e.key === 'Tab') close(false)
  else if (e.key === 'Backspace' && query.value === '') {
    const last = props.modelValue[props.modelValue.length - 1]
    if (last !== undefined) remove(last)
  } else return
  e.preventDefault()
}

function triggerKey(e: KeyboardEvent) {
  if (!open.value && (e.key === 'ArrowDown' || e.key === 'Enter')) {
    e.preventDefault()
    void show()
  }
}

const away = (e: Event) => {
  if (root.value && !e.composedPath().includes(root.value)) close(false)
}
watch(open, (o) => {
  if (o) document.addEventListener('mousedown', away)
  else document.removeEventListener('mousedown', away)
})
watch(query, () => (active.value = 0))
onBeforeUnmount(() => document.removeEventListener('mousedown', away))
</script>

<template>
  <div ref="root" :class="styles.root">
    <label v-if="label" :id="labelId" :for="triggerId" :class="styles.label">{{ label }}</label>
    <div :class="[styles.control, disabled && styles.disabled]">
      <ul v-if="modelValue.length" :class="styles.chips" aria-label="Chosen">
        <li v-for="v in modelValue" :key="v" :class="styles.chip" data-test="chip">
          <span :class="styles.chipLabel">{{ labelOf(options, v) }}</span>
          <button
            type="button"
            :class="styles.remove"
            :aria-label="`Remove ${labelOf(options, v)}`"
            :disabled="disabled"
            @click="remove(v)"
          >
            ×
          </button>
        </li>
      </ul>
      <span v-else :class="styles.empty">{{ emptyLabel }}</span>
      <button
        :id="triggerId"
        ref="trigger"
        type="button"
        role="combobox"
        :class="styles.trigger"
        aria-haspopup="listbox"
        :aria-expanded="open"
        :aria-controls="open ? listId : undefined"
        :aria-labelledby="label ? labelId : undefined"
        :aria-label="label ? undefined : placeholder"
        :disabled="disabled"
        @click="toggle"
        @keydown="triggerKey"
      >
        <span :class="styles.triggerText">{{ placeholder }}</span>
        <PynIcon name="chevron" />
      </button>
    </div>
    <div v-if="open" :class="styles.panel">
      <input
        ref="filter"
        v-model="query"
        :class="styles.filter"
        type="text"
        role="searchbox"
        :aria-label="filterPlaceholder"
        :aria-controls="listId"
        :aria-activedescendant="activeId"
        autocomplete="off"
        :placeholder="filterPlaceholder"
        @keydown="filterKey"
      />
      <ul
        :id="listId"
        ref="list"
        :class="styles.list"
        role="listbox"
        aria-multiselectable="true"
        :aria-label="label ?? placeholder"
      >
        <li
          v-for="(o, i) in shown"
          :id="`${uid}-opt-${i}`"
          :key="o.value"
          role="option"
          :aria-selected="modelValue.includes(o.value)"
          :class="[
            styles.option,
            i === active && styles.active,
            modelValue.includes(o.value) && styles.chosen,
          ]"
          @mousedown.prevent
          @click="choose(o.value)"
          @mousemove="active = i"
        >
          <span :class="styles.mark" aria-hidden="true">{{
            modelValue.includes(o.value) ? '✓' : ''
          }}</span>
          <span :class="styles.optionText">
            <span :class="styles.optionLabel">{{ o.label }}</span>
            <span v-if="o.description" :class="styles.optionDescription">{{ o.description }}</span>
          </span>
        </li>
      </ul>
      <p v-if="!shown.length" :class="styles.none">{{ noResultsLabel }}</p>
    </div>
    <p :class="styles.hidden" role="status" aria-live="polite">{{ announcement }}</p>
  </div>
</template>
