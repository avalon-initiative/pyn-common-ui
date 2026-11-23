<script setup lang="ts">
import { computed } from 'vue'
import PynIcon from './PynIcon.vue'
import PynMenu from './PynMenu.vue'
import styles from '../styles/PynTabs.module.scss'
import { splitTabs, tabCountLabel } from '../state/tabs.state'
import type { TabItem } from '../types/tabs.types'

const props = defineProps<{
  items: TabItem[]
  /** Accessible name of the navigation. */
  label: string
  /** Most tabs shown before the rest move into a More menu; omitted shows all and scrolls. */
  max?: number
}>()

const split = computed(() => splitTabs(props.items, props.max))
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
  <nav :class="styles.tabs" :aria-label="label">
    <ul :class="[styles.list, split.more.length === 0 && styles.scroll]">
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
  </nav>
</template>
