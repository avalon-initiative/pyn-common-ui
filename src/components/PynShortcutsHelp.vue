<script setup lang="ts">
import { nextTick, onBeforeUnmount, ref, useId, watch } from 'vue'
import styles from '../styles/PynShortcutsHelp.module.scss'
import { trapTarget } from '../state/drawer.state'
import { lockBodyScroll } from '../utils/scroll-lock'
import type { ShortcutGroup } from '../types/command-palette.types'

const props = defineProps<{
  open: boolean
  groups: ShortcutGroup[]
  /** The dialog's accessible name and visible heading. */
  label: string
}>()
const emit = defineEmits<{ close: [] }>()

const titleId = useId()
const panel = ref<HTMLElement>()
let opener: HTMLElement | null = null
let release: (() => void) | null = null

watch(
  () => props.open,
  async (open) => {
    if (open) {
      opener = document.activeElement instanceof HTMLElement ? document.activeElement : null
      release ??= lockBodyScroll()
      await nextTick()
      panel.value?.focus()
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

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape') {
    e.stopPropagation()
    emit('close')
  } else if (e.key === 'Tab' && panel.value) {
    const next = trapTarget(panel.value, document.activeElement, e.shiftKey)
    if (next) {
      e.preventDefault()
      next.focus()
    }
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
      <div
        ref="panel"
        :class="styles.panel"
        role="dialog"
        aria-modal="true"
        :aria-labelledby="titleId"
        tabindex="-1"
      >
        <header :class="styles.header">
          <h2 :id="titleId" :class="styles.title">{{ label }}</h2>
          <button type="button" :class="styles.close" aria-label="Close" @click="emit('close')">
            ×
          </button>
        </header>
        <div :class="styles.body">
          <section v-for="g in groups" :key="g.title" :class="styles.group">
            <h3 :class="styles.groupTitle">{{ g.title }}</h3>
            <dl :class="styles.list">
              <div v-for="s in g.shortcuts" :key="s.label" :class="styles.row">
                <dt :class="styles.name">{{ s.label }}</dt>
                <dd :class="styles.keys">
                  <template v-for="(k, i) in s.keys" :key="i">
                    <span v-if="i > 0" :class="styles.then" aria-hidden="true">then</span>
                    <kbd :class="styles.kbd">{{ k }}</kbd>
                  </template>
                </dd>
              </div>
            </dl>
          </section>
        </div>
      </div>
    </div>
  </Transition>
</template>
