<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, ref, useId, watch } from 'vue'
import PynIcon from './PynIcon.vue'
import styles from '../styles/PynBranchPicker.module.scss'
import { formatAgo } from '../utils/ago'
import { formatDateTime } from '../utils/datetime'
import type { BranchOption } from '../types/branch.types'

const props = defineProps<{
  branches: BranchOption[]
  current: string
  loading?: boolean
  error?: string
  now?: Date
}>()
const emit = defineEmits<{ select: [name: string] }>()

const id = useId()
const listId = `${id}-list`
const root = ref<HTMLElement | null>(null)
const trigger = ref<HTMLButtonElement | null>(null)
const search = ref<HTMLInputElement | null>(null)
const open = ref(false)
const query = ref('')
const active = ref(0)

const shown = computed(() => {
  const q = query.value.trim().toLowerCase()
  return q ? props.branches.filter((b) => b.name.toLowerCase().includes(q)) : props.branches
})
const ready = computed(() => !props.loading && !props.error)
const activeId = computed(() =>
  ready.value && shown.value[active.value] ? `${id}-opt-${active.value}` : undefined,
)

function close(refocus: boolean) {
  open.value = false
  if (refocus) trigger.value?.focus()
}

async function show() {
  open.value = true
  query.value = ''
  const at = shown.value.findIndex((b) => b.name === props.current)
  active.value = at < 0 ? 0 : at
  await nextTick()
  search.value?.focus()
}

function toggle() {
  if (open.value) close(false)
  else void show()
}

function choose(name: string) {
  close(true)
  emit('select', name)
}

function move(by: number) {
  const n = shown.value.length
  if (n) active.value = (active.value + by + n) % n
}

function key(e: KeyboardEvent) {
  if (e.key === 'ArrowDown') move(1)
  else if (e.key === 'ArrowUp') move(-1)
  else if (e.key === 'Home') active.value = 0
  else if (e.key === 'End') active.value = Math.max(shown.value.length - 1, 0)
  else if (e.key === 'Enter') {
    const b = shown.value[active.value]
    if (ready.value && b) choose(b.name)
  } else if (e.key === 'Escape') close(true)
  else if (e.key === 'Tab') close(false)
  else return
  e.preventDefault()
}

function triggerKey(e: KeyboardEvent) {
  if (e.key === 'ArrowDown' && !open.value) {
    e.preventDefault()
    void show()
  }
}

const away = (e: Event) => {
  if (root.value && !root.value.contains(e.target as Node)) close(false)
}
watch(open, (o) => {
  if (o) document.addEventListener('click', away)
  else document.removeEventListener('click', away)
})
watch(query, () => (active.value = 0))
onBeforeUnmount(() => document.removeEventListener('click', away))
</script>

<template>
  <div ref="root" :class="styles.picker">
    <button
      ref="trigger"
      type="button"
      :class="styles.trigger"
      aria-haspopup="listbox"
      :aria-expanded="open"
      :aria-controls="open ? listId : undefined"
      @click="toggle"
      @keydown="triggerKey"
    >
      <PynIcon name="branch" :class="styles.icon" />
      <span :class="styles.hidden">Branch:</span>
      <span :class="styles.name">{{ current }}</span>
      <PynIcon name="chevron" :class="styles.icon" />
    </button>
    <div v-if="open" :class="styles.panel">
      <input
        ref="search"
        v-model="query"
        :class="styles.search"
        type="text"
        role="combobox"
        aria-label="Find a branch"
        aria-autocomplete="list"
        aria-expanded="true"
        :aria-controls="listId"
        :aria-activedescendant="activeId"
        autocomplete="off"
        placeholder="Find a branch"
        @keydown="key"
      />
      <p v-if="loading" :class="styles.note" role="status">Loading branches…</p>
      <p v-else-if="error" :class="styles.error" role="alert">{{ error }}</p>
      <template v-else>
        <ul :id="listId" :class="styles.list" role="listbox" aria-label="Branches">
          <li
            v-for="(b, i) in shown"
            :id="`${id}-opt-${i}`"
            :key="b.name"
            role="option"
            :aria-selected="b.name === current"
            :class="[
              styles.option,
              i === active && styles.active,
              b.name === current && styles.current,
            ]"
            @click="choose(b.name)"
            @mousemove="active = i"
          >
            <span :class="styles.optionName">{{ b.name }}</span>
            <span v-if="b.isDefault" :class="styles.pill">default</span>
            <span v-if="b.updatedAt" :class="styles.when" :title="formatDateTime(b.updatedAt)">{{
              formatAgo(b.updatedAt, now ?? new Date())
            }}</span>
          </li>
        </ul>
        <p v-if="!shown.length" :class="styles.note" role="status">No matching branches</p>
        <p v-else-if="branches.length === 1" :class="styles.note">Only the default branch exists</p>
      </template>
    </div>
  </div>
</template>
