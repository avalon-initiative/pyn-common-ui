<script setup lang="ts">
import { nextTick, onBeforeUnmount, ref, useId, watch } from 'vue'
import styles from '../styles/PynDrawer.module.scss'
import { trapTarget } from '../state/drawer.state'

const props = withDefaults(defineProps<{ open: boolean; title: string; width?: string }>(), {
  width: '32rem',
})
const emit = defineEmits<{ close: [] }>()

const titleId = useId()
const panel = ref<HTMLElement>()
let opener: HTMLElement | null = null
let previousOverflow: string | null = null

function lockScroll() {
  if (previousOverflow !== null) return
  previousOverflow = document.body.style.overflow
  document.body.style.overflow = 'hidden'
}

function unlockScroll() {
  if (previousOverflow === null) return
  document.body.style.overflow = previousOverflow
  previousOverflow = null
}

watch(
  () => props.open,
  async (open) => {
    if (open) {
      opener = document.activeElement instanceof HTMLElement ? document.activeElement : null
      lockScroll()
      await nextTick()
      panel.value?.focus()
    } else {
      unlockScroll()
      const target = opener
      opener = null
      await nextTick()
      target?.focus()
    }
  },
  { immediate: true },
)

onBeforeUnmount(unlockScroll)

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
      <aside
        ref="panel"
        :class="styles.panel"
        :style="{ '--pyn-drawer-width': width }"
        role="dialog"
        aria-modal="true"
        :aria-labelledby="titleId"
        tabindex="-1"
      >
        <header :class="styles.header">
          <h2 :id="titleId" :class="styles.title">{{ title }}</h2>
          <button type="button" :class="styles.close" aria-label="Close" @click="emit('close')">
            ×
          </button>
        </header>
        <div :class="styles.body"><slot /></div>
        <footer v-if="$slots.footer" :class="styles.footer"><slot name="footer" /></footer>
      </aside>
    </div>
  </Transition>
</template>
