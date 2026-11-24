<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, ref, watch } from 'vue'
import PynIcon from './PynIcon.vue'
import styles from '../styles/PynCloneMenu.module.scss'
import { copyText } from '../utils/copy'
import type { CloneKind } from '../types/clone-menu.types'

const props = withDefaults(
  defineProps<{
    httpsUrl: string
    command: string
    sshUrl?: string
    /** The pyn command for the SSH tab; defaults to `command`. */
    sshCommand?: string
    /** Adds the Download ZIP row, which emits `download`. */
    downloadZip?: boolean
    label?: string
    /** `primary` is the filled call-to-action; `default` the neutral button. */
    variant?: 'primary' | 'default'
  }>(),
  { label: 'Code', variant: 'primary' },
)
const emit = defineEmits<{ copy: [kind: CloneKind]; download: [] }>()

const open = ref(false)
const copied = ref<CloneKind | null>(null)
const failed = ref(false)
const root = ref<HTMLElement | null>(null)
const trigger = ref<HTMLButtonElement | null>(null)

const tab = ref<'https' | 'ssh'>('https')
const active = computed(() => (props.sshUrl ? tab.value : 'https'))
const rows = computed(() =>
  active.value === 'ssh'
    ? [
        { kind: 'ssh' as const, title: 'SSH', value: props.sshUrl! },
        { kind: 'command' as const, title: 'pyn', value: props.sshCommand ?? props.command },
      ]
    : [
        { kind: 'https' as const, title: 'HTTPS', value: props.httpsUrl },
        { kind: 'command' as const, title: 'pyn', value: props.command },
      ],
)
const tabs = [
  { id: 'https' as const, label: 'HTTPS' },
  { id: 'ssh' as const, label: 'SSH' },
]

function pick(id: 'https' | 'ssh') {
  tab.value = id
  copied.value = null
  failed.value = false
}
function tabKey(e: KeyboardEvent) {
  if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return
  e.preventDefault()
  pick(tab.value === 'https' ? 'ssh' : 'https')
  void nextTick(() =>
    root.value?.querySelector<HTMLElement>('[role=tab][aria-selected=true]')?.focus(),
  )
}
function download() {
  close(true)
  emit('download')
}

async function show() {
  open.value = true
  await nextTick()
  root.value?.querySelector<HTMLInputElement>('input')?.focus({ preventScroll: true })
}
function selectAll(e: FocusEvent) {
  const input = e.target as HTMLInputElement
  input.select()
  input.scrollLeft = 0
}
const close = (refocus: boolean) => {
  open.value = false
  copied.value = null
  failed.value = false
  if (refocus) trigger.value?.focus()
}

async function copy(kind: CloneKind, value: string) {
  const ok = await copyText(value)
  failed.value = !ok
  copied.value = ok ? kind : null
  if (ok) emit('copy', kind)
}

const away = (e: Event) => {
  if (root.value && !root.value.contains(e.target as Node)) close(false)
}
const escape = (e: KeyboardEvent) => {
  if (e.key === 'Escape' && !e.defaultPrevented) close(true)
}
const leave = (e: FocusEvent) => {
  const next = e.relatedTarget as Node | null
  if (next && root.value && !root.value.contains(next)) close(false)
}
const hold = (e: MouseEvent) => {
  if (!(e.target instanceof HTMLInputElement)) e.preventDefault()
}
const stop = () => {
  document.removeEventListener('click', away)
  document.removeEventListener('keydown', escape)
}
watch(open, (o) => {
  if (!o) return stop()
  document.addEventListener('click', away)
  document.addEventListener('keydown', escape)
})
onBeforeUnmount(stop)
</script>

<template>
  <div ref="root" :class="styles.clone">
    <button
      ref="trigger"
      type="button"
      :class="[styles.trigger, variant === 'primary' && styles.primary]"
      aria-haspopup="dialog"
      :aria-expanded="open"
      @click="open ? close(false) : show()"
    >
      <PynIcon name="code" />{{ label }}<PynIcon name="chevron" :class="styles.chevron" />
    </button>
    <div
      v-if="open"
      :class="styles.panel"
      role="dialog"
      :aria-label="label"
      @focusout="leave"
      @mousedown="hold"
    >
      <p :class="styles.heading">Clone</p>
      <div
        v-if="sshUrl"
        :class="styles.tabs"
        role="tablist"
        aria-label="Clone with"
        @keydown="tabKey"
      >
        <button
          v-for="t in tabs"
          :key="t.id"
          type="button"
          role="tab"
          :class="styles.tab"
          :aria-selected="active === t.id"
          :tabindex="active === t.id ? 0 : -1"
          @click="pick(t.id)"
        >
          {{ t.label }}
        </button>
      </div>
      <div v-for="row in rows" :key="row.kind" :class="styles.row">
        <label :class="styles.title" :for="`pyn-clone-${row.kind}`">{{
          row.kind === 'command' ? 'pyn command' : row.title
        }}</label>
        <div :class="styles.field">
          <input
            :id="`pyn-clone-${row.kind}`"
            :class="styles.input"
            :value="row.value"
            readonly
            @focus="selectAll"
          />
          <button
            type="button"
            :class="styles.copy"
            :aria-label="`Copy ${row.title}`"
            @click="copy(row.kind, row.value)"
          >
            {{ copied === row.kind ? 'Copied' : 'Copy' }}
          </button>
        </div>
      </div>
      <button v-if="downloadZip" type="button" :class="styles.download" @click="download">
        <PynIcon name="download" />Download ZIP
      </button>
      <p v-if="failed" :class="styles.error" role="status">Could not copy</p>
    </div>
  </div>
</template>
