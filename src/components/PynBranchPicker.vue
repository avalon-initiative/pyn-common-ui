<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, ref, useId, watch } from 'vue'
import PynEmptyState from './PynEmptyState.vue'
import PynIcon from './PynIcon.vue'
import styles from '../styles/PynBranchPicker.module.scss'
import { formatAgo } from '../utils/ago'
import { formatDateTime } from '../utils/datetime'
import type { BranchOption } from '../types/branch.types'
import type { RefKind, TagOption } from '../types/tag.types'

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
  /** Lists tags in the Tags tab; omitted keeps the not-supported state there. */
  tags?: TagOption[]
  tagsLoading?: boolean
  tagsError?: string
  /** Adds a "View all tags" link at the foot of the Tags tab. */
  tagsHref?: string
  /** Whether `current` names a branch or a tag. */
  currentKind?: RefKind
  /** Visible text before the name, such as `base:`; replaces the hidden "Branch:" prefix. */
  prefix?: string
  now?: Date
}>()
const emit = defineEmits<{
  select: [name: string, kind: RefKind]
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

const onTags = computed(() => tab.value === 'tags')
const kind = computed<RefKind>(() => (onTags.value ? 'tag' : 'branch'))
const currentKind = computed<RefKind>(() => props.currentKind ?? 'branch')
const isCurrent = (name: string) => name === props.current && kind.value === currentKind.value
const shown = computed<(BranchOption | TagOption)[]>(() => {
  const list = onTags.value ? (props.tags ?? []) : props.branches
  const q = query.value.trim().toLowerCase()
  return q ? list.filter((b) => b.name.toLowerCase().includes(q)) : list
})
const ready = computed(() =>
  onTags.value
    ? !!props.tags && !props.tagsLoading && !props.tagsError
    : !props.loading && !props.error,
)
const typed = computed(() => query.value.trim())
const canCreate = computed(
  () =>
    !!props.creatable &&
    !onTags.value &&
    ready.value &&
    !!typed.value &&
    !props.branches.some((b) => b.name === typed.value),
)
const count = computed(() => shown.value.length + (canCreate.value ? 1 : 0))
const filterLabel = computed(() =>
  onTags.value ? 'Find a tag' : props.creatable ? 'Find or create a branch' : 'Find a branch',
)
const filterPlaceholder = computed(() =>
  onTags.value ? 'Find a tag…' : props.creatable ? 'Find or create a branch…' : 'Filter branches',
)
const when = (b: BranchOption | TagOption) =>
  'updatedAt' in b ? b.updatedAt : 'createdAt' in b ? b.createdAt : undefined
const activeId = computed(() =>
  ready.value && active.value < count.value ? `${id}-opt-${active.value}` : undefined,
)

function close(refocus: boolean) {
  open.value = false
  if (refocus) trigger.value?.focus()
}

async function show() {
  open.value = true
  tab.value = currentKind.value === 'tag' && props.tags ? 'tags' : 'branches'
  query.value = ''
  const at = shown.value.findIndex((b) => isCurrent(b.name))
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
  emit('select', name, kind.value)
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
watch(query, () => (active.value = 0))
watch(tab, () => {
  const at = shown.value.findIndex((b) => isCurrent(b.name))
  active.value = at < 0 ? 0 : at
})
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
        <PynIcon :name="currentKind === 'tag' ? 'tag' : 'branch'" :class="styles.icon" />
        <span v-if="prefix" :class="styles.prefix">{{ prefix }}</span>
        <span v-else :class="styles.hidden">{{ currentKind === 'tag' ? 'Tag:' : 'Branch:' }}</span>
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
            :aria-label="filterLabel"
            aria-autocomplete="list"
            aria-expanded="true"
            :aria-controls="listId"
            :aria-activedescendant="activeId"
            autocomplete="off"
            :placeholder="filterPlaceholder"
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
          v-if="onTags && !tags"
          kind="unsupported"
          title="Tags are not supported yet"
          description="Tags are not available in pyn yet."
          compact
          :heading-level="4"
        />
        <p v-else-if="onTags ? tagsLoading : loading" :class="styles.note" role="status">
          {{ onTags ? 'Loading tags…' : 'Loading branches…' }}
        </p>
        <p v-else-if="onTags ? tagsError : error" :class="styles.error" role="alert">
          {{ onTags ? tagsError : error }}
        </p>
        <template v-else>
          <ul
            :id="listId"
            :class="styles.list"
            role="listbox"
            :aria-label="onTags ? 'Tags' : 'Branches'"
          >
            <li
              v-for="(b, i) in shown"
              :id="`${id}-opt-${i}`"
              :key="b.name"
              role="option"
              :aria-selected="isCurrent(b.name)"
              :class="[
                styles.option,
                i === active && styles.active,
                isCurrent(b.name) && styles.current,
              ]"
              @click="choose(b.name)"
              @mousemove="active = i"
            >
              <PynIcon v-if="isCurrent(b.name)" name="check" :class="styles.check" />
              <span v-else :class="styles.check" />
              <span :class="styles.optionName">{{ b.name }}</span>
              <span v-if="'isDefault' in b && b.isDefault" :class="styles.pill">default</span>
              <span v-if="when(b)" :class="styles.when" :title="formatDateTime(when(b)!)">{{
                formatAgo(when(b)!, now ?? new Date())
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
          <p v-else-if="onTags && !tags?.length" :class="styles.note" role="status">No tags yet</p>
          <p v-else-if="!shown.length" :class="styles.note" role="status">
            {{ onTags ? 'No matching tags' : 'No matching branches' }}
          </p>
          <p v-else-if="!onTags && branches.length === 1" :class="styles.note">
            Only the default branch exists
          </p>
        </template>
        <a v-if="onTags && tags && tagsHref" :href="tagsHref" :class="styles.all" data-all-tags
          >View all tags</a
        >
        <a v-else-if="(!onTags || !tags) && allHref" :href="allHref" :class="styles.all"
          >View all branches</a
        >
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
