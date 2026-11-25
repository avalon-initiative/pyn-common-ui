<script setup lang="ts">
import { nextTick, onBeforeUnmount, ref, watch } from 'vue'
import PynAvatar from './PynAvatar.vue'
import PynIcon from './PynIcon.vue'
import styles from '../styles/PynMenu.module.scss'
import type { MenuItem } from '../types/shell.types'

const props = defineProps<{
  label: string
  items: MenuItem[]
  align?: 'start' | 'end'
  /** Positions the panel against the viewport so a scrolling ancestor cannot clip it. */
  fixed?: boolean
}>()
const emit = defineEmits<{ select: [id: string] }>()

const open = ref(false)
const root = ref<HTMLElement | null>(null)
const trigger = ref<HTMLButtonElement | null>(null)
const panel = ref<HTMLElement | null>(null)
const fixedAt = ref<{ top: string; left: string; maxWidth: string } | null>(null)

const entries = () =>
  Array.from(root.value?.querySelectorAll<HTMLElement>('[role^="menuitem"]') ?? [])
const focusAt = (i: number) => {
  const all = entries()
  all[(i + all.length) % all.length]?.focus()
}
const EDGE = 8
async function show(last = false) {
  const box = trigger.value?.getBoundingClientRect()
  fixedAt.value =
    props.fixed && box
      ? {
          top: `${box.bottom + 4}px`,
          left: `${EDGE}px`,
          maxWidth: `${Math.max(window.innerWidth - 2 * EDGE, 160)}px`,
        }
      : null
  open.value = true
  await nextTick()
  if (props.fixed && box) place(box)
  focusAt(last ? -1 : 0)
}
/** Aligns the panel to its trigger, then flips or clamps it inside the viewport. */
function place(box: DOMRect) {
  const rect = panel.value?.getBoundingClientRect()
  if (!rect || !fixedAt.value) return
  const left = props.align === 'start' ? box.left : box.right - rect.width
  const top =
    box.bottom + 4 + rect.height > window.innerHeight - EDGE
      ? box.top - 4 - rect.height
      : box.bottom + 4
  fixedAt.value = {
    ...fixedAt.value,
    left: `${Math.max(EDGE, Math.min(left, window.innerWidth - rect.width - EDGE))}px`,
    top: `${Math.max(EDGE, top)}px`,
  }
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
      ref="panel"
      :class="[styles.panel, align === 'start' && styles.start, fixedAt && styles.fixed]"
      :style="fixedAt ?? undefined"
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
        <p v-else-if="item.note" :class="styles.note" role="presentation" data-note>
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
          ><span :class="styles.check"
            ><PynAvatar
              v-if="item.avatar"
              :username="item.avatar.name"
              :src="item.avatar.src"
              size="xs"
            /><PynIcon v-else-if="item.icon" :name="item.icon" /><template v-else>{{
              item.checked ? '✓' : ''
            }}</template></span
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
          <span :class="styles.check"
            ><PynAvatar
              v-if="item.avatar"
              :username="item.avatar.name"
              :src="item.avatar.src"
              size="xs"
            /><PynIcon v-else-if="item.icon" :name="item.icon" /><template v-else>{{
              item.checked ? '✓' : ''
            }}</template></span
          >{{ item.label }}
        </button>
      </template>
      <div v-if="$slots.footer" :class="styles.footer"><slot name="footer" /></div>
    </div>
  </div>
</template>
