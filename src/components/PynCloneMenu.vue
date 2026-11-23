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
    label?: string
    /** `primary` is the filled call-to-action; `default` the neutral button. */
    variant?: 'primary' | 'default'
  }>(),
  { label: 'Clone', variant: 'primary' },
)
const emit = defineEmits<{ copy: [kind: CloneKind] }>()

const open = ref(false)
const copied = ref<CloneKind | null>(null)
const failed = ref(false)
const root = ref<HTMLElement | null>(null)
const trigger = ref<HTMLButtonElement | null>(null)

const rows = computed(() => [
  { kind: 'https' as const, title: 'HTTPS', value: props.httpsUrl },
  ...(props.sshUrl ? [{ kind: 'ssh' as const, title: 'SSH', value: props.sshUrl }] : []),
  { kind: 'command' as const, title: 'pyn', value: props.command },
])

async function show() {
  open.value = true
  await nextTick()
  root.value?.querySelector<HTMLElement>('input')?.focus()
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
    <div v-if="open" :class="styles.panel" role="dialog" :aria-label="label" @focusout="leave">
      <div v-for="row in rows" :key="row.kind" :class="styles.row">
        <label :class="styles.title" :for="`pyn-clone-${row.kind}`">{{ row.title }}</label>
        <div :class="styles.field">
          <input
            :id="`pyn-clone-${row.kind}`"
            :class="styles.input"
            :value="row.value"
            readonly
            @focus="($event.target as HTMLInputElement).select()"
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
      <p v-if="failed" :class="styles.error" role="status">Could not copy</p>
    </div>
  </div>
</template>
