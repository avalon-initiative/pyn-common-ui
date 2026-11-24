<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, ref, useId, watch } from 'vue'
import PynEmptyState from './PynEmptyState.vue'
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
  /** Adds a "View all branches" link at the foot of the panel. */
  allHref?: string
  /** Offers a "Create branch" row for a typed name no branch has; it emits `create`. */
  creatable?: boolean
  /** Adds a plus button beside the picker that emits `newBranch`. */
  newBranchButton?: boolean
  /** Adds a search button beside the picker that emits `search`. */
  searchButton?: boolean
  now?: Date
}>()
const emit = defineEmits<{
  select: [name: string]
  create: [name: string]
  newBranch: []
  search: []
}>()

const id = useId()
const listId = `${id}-list`
const root = ref<HTMLElement | null>(null)
const trigger = ref<HTMLButtonElement | null>(null)
const search = ref<HTMLInputElement | null>(null)
const open = ref(false)
const query = ref('')
const active = ref(0)
const tab = ref<'branches' | 'tags'>('branches')

const shown = computed(() => {
  const q = query.value.trim().toLowerCase()
  return q ? props.branches.filter((b) => b.name.toLowerCase().includes(q)) : props.branches
})
const ready = computed(() => !props.loading && !props.error && tab.value === 'branches')
const typed = computed(() => query.value.trim())
const canCreate = computed(
  () =>
    !!props.creatable &&
    ready.value &&
    !!typed.value &&
    !props.branches.some((b) => b.name === typed.value),
)
const count = computed(() => shown.value.length + (canCreate.value ? 1 : 0))
const activeId = computed(() =>
  ready.value && active.value < count.value ? `${id}-opt-${active.value}` : undefined,
)

function close(refocus: boolean) {
  open.value = false
  if (refocus) trigger.value?.focus()
}

async function show() {
  open.value = true
  tab.value = 'branches'
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

function create() {
  const name = typed.value
  close(true)
  emit('create', name)
}

function move(by: number) {
  const n = count.value
  if (n) active.value = (active.value + by + n) % n
}

function key(e: KeyboardEvent) {
  if (e.key === 'ArrowDown') move(1)
  else if (e.key === 'ArrowUp') move(-1)
  else if (e.key === 'Home') active.value = 0
  else if (e.key === 'End') active.value = Math.max(count.value - 1, 0)
  else if (e.key === 'Enter') {
    const b = shown.value[active.value]
    if (!ready.value) return
    if (b) choose(b.name)
    else if (canCreate.value) create()
  } else if (e.key === 'Escape') close(true)
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
function leave(e: FocusEvent) {
  const next = e.relatedTarget as Node | null
  if (next && root.value && !root.value.contains(next)) close(false)
}
// Keeps focus in the filter so a press on an option cannot trigger the focusout close.
function hold(e: MouseEvent) {
  if (!(e.target instanceof HTMLInputElement)) e.preventDefault()
}
watch(open, (o) => {
  if (o) document.addEventListener('click', away)
  else document.removeEventListener('click', away)
})
watch([query, tab], () => (active.value = 0))
onBeforeUnmount(() => document.removeEventListener('click', away))
</script>

<template>
  <div :class="styles.wrap">
    <div ref="root" :class="styles.picker" @focusout="leave">
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
        <span :class="styles.name" :title="current">{{ current }}</span>
        <PynIcon name="chevron" :class="styles.icon" />
      </button>
      <div
        v-if="open"
        :class="styles.panel"
        role="group"
        :aria-labelledby="`${id}-title`"
        @mousedown="hold"
      >
        <div :class="styles.head">
          <h3 :id="`${id}-title`" :class="styles.title">Switch branches/tags</h3>
          <button
            type="button"
            :class="styles.close"
            aria-label="Close"
            tabindex="-1"
            @click="close(true)"
          >
            <PynIcon name="close" />
          </button>
        </div>
        <div :class="styles.filter">
          <input
            ref="search"
            v-model="query"
            :class="styles.search"
            type="text"
            role="combobox"
            :aria-label="creatable ? 'Find or create a branch' : 'Find a branch'"
            aria-autocomplete="list"
            aria-expanded="true"
            :aria-controls="listId"
            :aria-activedescendant="activeId"
            autocomplete="off"
            :placeholder="creatable ? 'Find or create a branch…' : 'Filter branches'"
            @keydown="key"
          />
        </div>
        <div :class="styles.tabs" role="tablist" aria-label="Refs">
          <button
            v-for="t in ['branches', 'tags'] as const"
            :key="t"
            type="button"
            role="tab"
            :class="[styles.tab, tab === t && styles.tabCurrent]"
            :aria-selected="tab === t"
            :data-tab="t"
            @click="tab = t"
          >
            {{ t === 'branches' ? 'Branches' : 'Tags' }}
          </button>
        </div>
        <PynEmptyState
          v-if="tab === 'tags'"
          kind="unsupported"
          title="Tags are not supported yet"
          description="Tags are not available in pyn yet."
          compact
          :heading-level="4"
        />
        <p v-else-if="loading" :class="styles.note" role="status">Loading branches…</p>
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
              <PynIcon v-if="b.name === current" name="check" :class="styles.check" />
              <span v-else :class="styles.check" />
              <span :class="styles.optionName">{{ b.name }}</span>
              <span v-if="b.isDefault" :class="styles.pill">default</span>
              <span v-if="b.updatedAt" :class="styles.when" :title="formatDateTime(b.updatedAt)">{{
                formatAgo(b.updatedAt, now ?? new Date())
              }}</span>
            </li>
          </ul>
          <button
            v-if="canCreate"
            :id="`${id}-opt-${shown.length}`"
            type="button"
            :class="[styles.create, active === shown.length && styles.active]"
            data-create
            @click="create"
            @mousemove="active = shown.length"
          >
            <PynIcon name="plus" :class="styles.check" />
            <span :class="styles.optionName"
              >Create branch <strong>{{ typed }}</strong> from {{ current }}</span
            >
          </button>
          <p v-else-if="!shown.length" :class="styles.note" role="status">No matching branches</p>
          <p v-else-if="branches.length === 1" :class="styles.note">
            Only the default branch exists
          </p>
        </template>
        <a v-if="allHref" :href="allHref" :class="styles.all">View all branches</a>
      </div>
    </div>
    <button
      v-if="newBranchButton"
      type="button"
      :class="styles.tool"
      aria-label="New branch"
      title="New branch"
      @click="emit('newBranch')"
    >
      <PynIcon name="plus" />
    </button>
    <button
      v-if="searchButton"
      type="button"
      :class="styles.tool"
      aria-label="Search files"
      title="Search files"
      @click="emit('search')"
    >
      <PynIcon name="search" />
    </button>
  </div>
</template>
