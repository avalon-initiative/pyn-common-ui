<script setup lang="ts">
import PynIcon from './PynIcon.vue'
import styles from '../styles/PynSubNav.module.scss'
import type { NavItem } from '../state/shell.state'
import type { NavGroup } from '../types/shell.types'

withDefaults(defineProps<{ groups: NavGroup[]; current: string; label?: string }>(), {
  label: 'Section',
})

const hasBadge = (item: NavItem) =>
  item.badge !== undefined && item.badge !== '' && item.badge !== 0
</script>

<template>
  <nav :class="styles.sub" :aria-label="label">
    <section v-for="group in groups" :key="group.id" :class="styles.group">
      <h2 v-if="group.heading" :class="styles.heading">{{ group.heading }}</h2>
      <ul :class="styles.list">
        <li v-for="item in group.items" :key="item.id">
          <a
            :href="item.href"
            :class="styles.link"
            :aria-current="item.id === current ? 'page' : undefined"
          >
            <PynIcon v-if="item.icon" :name="item.icon" />{{ item.label
            }}<template v-if="hasBadge(item)">
              <span :class="styles.badge" aria-hidden="true">{{ item.badge }}</span>
              <span :class="styles.hidden">{{ item.badge }} pending</span>
            </template>
          </a>
        </li>
      </ul>
    </section>
    <div v-if="$slots.footer" :class="styles.footer"><slot name="footer" /></div>
  </nav>
</template>
