<script setup lang="ts">
import { ref } from 'vue'
import PynIcon from './PynIcon.vue'
import styles from '../styles/PynShell.module.scss'

defineProps<{
  /** Renders without the side navigation, keeping the top bar. */
  bare?: boolean
}>()
const open = ref(false)
const closeOnLink = (e: MouseEvent) => {
  if ((e.target as HTMLElement).closest('a')) open.value = false
}
</script>

<template>
  <div :class="[styles.shell, bare && styles.bare]">
    <header :class="styles.top">
      <button
        v-if="!bare"
        type="button"
        :class="styles.toggle"
        aria-label="Toggle navigation"
        :aria-expanded="open"
        @click="open = !open"
      >
        <PynIcon name="menu" />
      </button>
      <slot name="top" />
    </header>
    <aside v-if="!bare" :class="[styles.side, open && styles.open]" @click="closeOnLink">
      <slot name="side" />
    </aside>
    <main :class="styles.main">
      <div :class="styles.content"><slot /></div>
    </main>
    <div v-if="$slots.footer" :class="styles.footer"><slot name="footer" /></div>
  </div>
</template>
