<script setup lang="ts">
import { nextTick, onBeforeUnmount, ref, useId, watch } from 'vue'
import PynIcon from './PynIcon.vue'
import styles from '../styles/PynDialog.module.scss'
import { trapTarget } from '../state/drawer.state'
import { lockBodyScroll } from '../utils/scroll-lock'

const props = withDefaults(
  defineProps<{
    open: boolean
    title: string
    /** Panel width: 20rem, 30rem or 40rem. Below 40rem the dialog is a bottom sheet. */
    size?: 'sm' | 'md' | 'lg'
  }>(),
  { size: 'md' },
)
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
        :class="[styles.panel, styles[size]]"
        role="dialog"
        aria-modal="true"
        :aria-labelledby="titleId"
        tabindex="-1"
      >
        <header :class="styles.header">
          <h2 :id="titleId" :class="styles.title">{{ title }}</h2>
          <button type="button" :class="styles.close" aria-label="Close" @click="emit('close')">
            <PynIcon name="close" />
          </button>
        </header>
        <div :class="styles.body"><slot /></div>
        <footer v-if="$slots.footer" :class="styles.footer"><slot name="footer" /></footer>
      </div>
    </div>
  </Transition>
</template>
