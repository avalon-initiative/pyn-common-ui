<script setup lang="ts">
import { computed, ref, useId, watch } from 'vue'
import PynSubNav from './PynSubNav.vue'
import styles from '../styles/PynSettingsLayout.module.scss'
import { groupSections } from '../state/tabs.state'
import type { NavGroup } from '../types/shell.types'
import type { SettingsSection } from '../types/tabs.types'

const props = defineProps<{
  sections: SettingsSection[]
  /** `id` of the open section. */
  current: string
  /** Accessible name of the navigation. */
  label: string
  /** Heading above the layout. */
  title?: string
  /** A banded header, for server administration. */
  variant?: 'admin'
}>()

const navId = useId()
const open = ref(false)
const groups = computed<NavGroup[]>(() =>
  groupSections(props.sections).map((g, i) => ({
    id: `g${i}`,
    heading: g.label,
    items: g.sections,
  })),
)
const currentLabel = computed(() => props.sections.find((s) => s.id === props.current)?.label ?? '')
watch(
  () => props.current,
  () => (open.value = false),
)
</script>

<template>
  <div :class="[styles.layout, variant === 'admin' && styles.admin]">
    <header v-if="variant === 'admin' && (title || $slots.actions)" :class="styles.head" data-head>
      <h2 v-if="title" :class="styles.title">{{ title }}</h2>
      <div v-if="$slots.actions" :class="styles.actions"><slot name="actions" /></div>
    </header>
    <div :class="styles.columns">
      <div :class="styles.side">
        <button
          type="button"
          :class="styles.toggle"
          :aria-expanded="open"
          :aria-controls="navId"
          @click="open = !open"
        >
          {{ currentLabel || label }}
        </button>
        <div :id="navId" :class="styles.nav" :data-open="open ? '' : undefined">
          <PynSubNav :groups="groups" :current="current" :label="label" />
        </div>
      </div>
      <div :class="styles.body">
        <header
          v-if="variant !== 'admin' && (title || $slots.actions)"
          :class="styles.head"
          data-head
        >
          <h2 v-if="title" :class="styles.title">{{ title }}</h2>
          <div v-if="$slots.actions" :class="styles.actions"><slot name="actions" /></div>
        </header>
        <slot />
      </div>
    </div>
  </div>
</template>
