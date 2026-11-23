<script setup lang="ts">
import { ref } from 'vue'
import PynBreadcrumbs from './PynBreadcrumbs.vue'
import PynIcon from './PynIcon.vue'
import styles from '../styles/PynShell.module.scss'
import { MAIN_ID } from '../state/top-bar.state'
import type { Crumb } from '../types/tree.types'

withDefaults(
  defineProps<{
    /** Deprecated and ignored: the side navigation now shows only when the `side` slot is given. */
    bare?: boolean
    /** Path to the open page, shown above the content; the last item is the current page. */
    breadcrumbs?: Crumb[]
    /** Id of the main content; the top bar's skip link targets it. */
    mainId?: string
  }>(),
  { mainId: MAIN_ID },
)
const open = ref(false)
const closeOnLink = (e: MouseEvent) => {
  if ((e.target as HTMLElement).closest('a')) open.value = false
}
</script>

<template>
  <div :class="[styles.shell, !$slots.side && styles.noSide]">
    <header :class="styles.top">
      <button
        v-if="$slots.side"
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
    <aside v-if="$slots.side" :class="[styles.side, open && styles.open]" @click="closeOnLink">
      <slot name="side" />
    </aside>
    <main :id="mainId" tabindex="-1" :class="styles.main">
      <div v-if="breadcrumbs && breadcrumbs.length > 1" :class="styles.crumbs">
        <PynBreadcrumbs :items="breadcrumbs" />
      </div>
      <div :class="styles.content"><slot /></div>
    </main>
    <div v-if="$slots.footer" :class="styles.footer"><slot name="footer" /></div>
  </div>
</template>
