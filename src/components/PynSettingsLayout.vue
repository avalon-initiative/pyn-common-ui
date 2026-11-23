<script setup lang="ts">
import { computed, ref, useId, watch } from 'vue'
import styles from '../styles/PynSettingsLayout.module.scss'
import { groupSections } from '../state/tabs.state'
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
const groups = computed(() => groupSections(props.sections))
const currentLabel = computed(() => props.sections.find((s) => s.id === props.current)?.label ?? '')
watch(
  () => props.current,
  () => (open.value = false),
)
</script>

<template>
  <div :class="[styles.layout, variant === 'admin' && styles.admin]">
    <header v-if="title || $slots.actions" :class="styles.head" data-head>
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
        <nav :id="navId" :class="styles.nav" :data-open="open ? '' : undefined" :aria-label="label">
          <template v-for="(group, i) in groups" :key="i">
            <p v-if="group.label" :id="`${navId}-g${i}`" :class="styles.group">{{ group.label }}</p>
            <ul :class="styles.list" :aria-labelledby="group.label ? `${navId}-g${i}` : undefined">
              <li v-for="s in group.sections" :key="s.id">
                <a
                  :href="s.href"
                  :class="styles.link"
                  :aria-current="s.id === current ? 'page' : undefined"
                  >{{ s.label }}</a
                >
              </li>
            </ul>
          </template>
        </nav>
      </div>
      <div :class="styles.body"><slot /></div>
    </div>
  </div>
</template>
