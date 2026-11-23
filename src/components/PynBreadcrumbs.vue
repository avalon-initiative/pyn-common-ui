<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import crumb from '../styles/PynBreadcrumb.module.scss'
import styles from '../styles/PynBreadcrumbs.module.scss'
import type { Crumb } from '../types/tree.types'

const props = defineProps<{ items: Crumb[] }>()

const root = ref<HTMLElement>()
const open = ref(false)

const last = computed(() => props.items.length - 1)
// Narrow screens keep the first and the last two items; the rest sit behind the ellipsis.
const collapsible = computed(() => props.items.length > 3)
const hidden = (i: number) => collapsible.value && i > 0 && i < last.value - 1

function closeOutside(e: MouseEvent) {
  if (open.value && root.value && !root.value.contains(e.target as Node)) open.value = false
}
function onKey(e: KeyboardEvent) {
  if (e.key !== 'Escape' || !open.value) return
  open.value = false
  root.value?.querySelector<HTMLButtonElement>('[data-more] button')?.focus()
}
onMounted(() => document.addEventListener('click', closeOutside))
onBeforeUnmount(() => document.removeEventListener('click', closeOutside))
</script>

<template>
  <nav
    v-if="items.length > 1"
    ref="root"
    :class="styles.nav"
    aria-label="Breadcrumb"
    @keydown="onKey"
  >
    <ol :class="crumb.list">
      <template v-for="(c, i) in items" :key="i">
        <li
          :class="[crumb.item, hidden(i) && styles.middle, hidden(i) && open && styles.shown]"
          :data-collapsible="hidden(i) ? '' : undefined"
        >
          <a v-if="i < last && c.href" :href="c.href" :class="crumb.link">{{ c.label }}</a>
          <span v-else-if="i < last" :class="crumb.current">{{ c.label }}</span>
          <span v-else :class="crumb.current" aria-current="page">{{ c.label }}</span>
        </li>
        <li v-if="i === 0 && collapsible" :class="[crumb.item, styles.more]" data-more>
          <button
            type="button"
            :class="styles.toggle"
            :aria-expanded="open"
            aria-label="Show full path"
            @click.stop="open = !open"
          >
            …
          </button>
        </li>
      </template>
    </ol>
  </nav>
</template>
