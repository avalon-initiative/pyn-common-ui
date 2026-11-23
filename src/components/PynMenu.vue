<script setup lang="ts">
import { nextTick, onBeforeUnmount, ref, watch } from 'vue'
import styles from '../styles/PynMenu.module.scss'
import type { MenuItem } from '../types/shell.types'

defineProps<{ label: string; items: MenuItem[]; align?: 'start' | 'end' }>()
const emit = defineEmits<{ select: [id: string] }>()

const open = ref(false)
const root = ref<HTMLElement | null>(null)
const trigger = ref<HTMLButtonElement | null>(null)

const entries = () =>
  Array.from(root.value?.querySelectorAll<HTMLElement>('[role^="menuitem"]') ?? [])
const focusAt = (i: number) => {
  const all = entries()
  all[(i + all.length) % all.length]?.focus()
}
async function show(last = false) {
  open.value = true
  await nextTick()
  focusAt(last ? -1 : 0)
}
const close = (refocus: boolean) => {
  open.value = false
  if (refocus) trigger.value?.focus()
}

const away = (e: Event) => {
  if (root.value && !root.value.contains(e.target as Node)) open.value = false
}
const escape = (e: KeyboardEvent) => {
  if (e.key === 'Escape' && !e.defaultPrevented) close(true)
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

function onTriggerKey(e: KeyboardEvent) {
  if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp') return
  e.preventDefault()
  void show(e.key === 'ArrowUp')
}
function onPanelKey(e: KeyboardEvent) {
  const at = entries().indexOf(document.activeElement as HTMLElement)
  const moves: Record<string, () => void> = {
    ArrowDown: () => focusAt(at + 1),
    ArrowUp: () => focusAt(at - 1),
    Home: () => focusAt(0),
    End: () => focusAt(-1),
    Escape: () => close(true),
    Tab: () => close(false),
  }
  const move = moves[e.key]
  if (!move) return
  if (e.key !== 'Tab') e.preventDefault()
  move()
}

function choose(id: string) {
  close(true)
  emit('select', id)
}
</script>

<template>
  <div ref="root" :class="styles.menu">
    <button
      ref="trigger"
      type="button"
      :class="styles.trigger"
      :aria-label="label"
      aria-haspopup="menu"
      :aria-expanded="open"
      @click="open ? close(false) : show()"
      @keydown="onTriggerKey"
    >
      <slot />
    </button>
    <div
      v-if="open"
      :class="[styles.panel, align === 'start' && styles.start]"
      role="menu"
      :aria-label="label"
      @keydown="onPanelKey"
    >
      <slot name="header" />
      <template v-for="item in items" :key="item.id">
        <hr v-if="item.separator" :class="styles.separator" role="separator" />
        <p v-else-if="item.heading" :class="styles.heading" role="presentation">
          {{ item.label }}
        </p>
        <a
          v-else-if="item.href"
          :href="item.href"
          :class="styles.item"
          role="menuitem"
          tabindex="-1"
          :aria-current="item.checked ? 'true' : undefined"
          @click="open = false"
          ><span :class="styles.check">{{ item.checked ? '✓' : '' }}</span
          >{{ item.label }}</a
        >
        <button
          v-else
          type="button"
          :class="styles.item"
          :role="item.checked === undefined ? 'menuitem' : 'menuitemradio'"
          :aria-checked="item.checked"
          tabindex="-1"
          @click="choose(item.id)"
        >
          <span :class="styles.check">{{ item.checked ? '✓' : '' }}</span>{{ item.label }}
        </button>
      </template>
    </div>
  </div>
</template>
