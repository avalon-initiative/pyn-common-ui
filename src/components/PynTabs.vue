<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import PynIcon from './PynIcon.vue'
import PynMenu from './PynMenu.vue'
import styles from '../styles/PynTabs.module.scss'
import { fitTabs, splitTabs, tabCountLabel } from '../state/tabs.state'
import type { TabItem } from '../types/tabs.types'

const props = defineProps<{
  items: TabItem[]
  /** Accessible name of the navigation. */
  label: string
  /** Most tabs shown; the rest move into a More menu. Tabs that do not fit the container width move there regardless. */
  max?: number
}>()

const nav = ref<HTMLElement>()
const probe = ref<HTMLElement>()
const measured = ref<{ widths: number[]; more: number; gap: number; avail: number }>()

function measure() {
  const list = probe.value
  const box = nav.value
  if (!list || !box || !box.clientWidth) return
  const lis = Array.from(list.children) as HTMLElement[]
  const moreLi = lis.pop()
  if (lis.length !== props.items.length || !moreLi) return
  measured.value = {
    widths: lis.map((li) => li.getBoundingClientRect().width),
    more: moreLi.getBoundingClientRect().width,
    gap: parseFloat(getComputedStyle(list).columnGap) || 0,
    avail: box.clientWidth,
  }
}

let observer: ResizeObserver | undefined
onMounted(() => {
  measure()
  if (typeof ResizeObserver === 'undefined') return
  observer = new ResizeObserver(measure)
  if (nav.value) observer.observe(nav.value)
  if (probe.value) observer.observe(probe.value)
})
onBeforeUnmount(() => observer?.disconnect())
watch(
  () => props.items.map((t) => `${t.label}|${t.count}|${t.reserveCount}`).join(),
  () => nextTick(measure),
)

const split = computed(() => {
  const m = measured.value
  if (!m || m.widths.length !== props.items.length) return splitTabs(props.items, props.max)
  return fitTabs(props.items, m.widths, m.avail, m.more, m.gap, props.max)
})
const icons = computed(() => props.items.length > 0 && props.items.every((t) => t.icon))
const menuItems = computed(() =>
  split.value.more.map((t) => ({
    id: t.href,
    label: t.count === undefined ? t.label : `${t.label} (${t.count})`,
    href: t.href,
  })),
)
</script>

<template>
  <nav ref="nav" :class="styles.tabs" :aria-label="label">
    <ul :class="styles.list">
      <li
        v-for="item in split.shown"
        :key="item.href"
        :class="[styles.item, item.current && styles.active]"
      >
        <a :href="item.href" :class="styles.tab" :aria-current="item.current ? 'page' : undefined">
          <PynIcon v-if="icons" :name="item.icon!" :class="styles.icon" />
          <span :class="styles.label" :data-text="item.label">{{ item.label }}</span>
          <template v-if="item.count !== undefined">
            <span :class="styles.count" data-count aria-hidden="true">{{ item.count }}</span>
            <span :class="styles.hidden">{{ tabCountLabel(item) }}</span>
          </template>
          <span
            v-else-if="item.reserveCount"
            :class="[styles.count, styles.reserved]"
            aria-hidden="true"
          />
        </a>
      </li>
      <li v-if="split.more.length" :class="[styles.item, styles.more]" data-more>
        <PynMenu label="More" :items="menuItems" align="end"
          >More<PynIcon name="chevron" :class="styles.icon"
        /></PynMenu>
      </li>
    </ul>
    <ul ref="probe" :class="[styles.list, styles.probe]" aria-hidden="true" data-probe>
      <li v-for="item in items" :key="item.href" :class="styles.item">
        <span :class="styles.tab">
          <span v-if="icons" :class="styles.probeIcon" />
          <span :class="styles.label" :data-text="item.label">{{ item.label }}</span>
          <span v-if="item.count !== undefined || item.reserveCount" :class="styles.count">{{
            item.count ?? 0
          }}</span>
        </span>
      </li>
      <li :class="[styles.item, styles.more]">
        <span :class="styles.moreProbe">More<span :class="styles.probeIcon" /></span>
      </li>
    </ul>
  </nav>
</template>
