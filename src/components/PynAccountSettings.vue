<script setup lang="ts">
import { computed } from 'vue'
import PynSettingsLayout from './PynSettingsLayout.vue'
import type { NavItem } from '../state/shell.state'

const props = defineProps<{
  items: Pick<NavItem, 'id' | 'label' | 'href'>[]
  current: string
  title?: string
}>()

const sections = computed(() => props.items.map((i) => ({ ...i })))
</script>

<template>
  <PynSettingsLayout
    :sections="sections"
    :current="current"
    :title="title"
    label="Account settings"
  >
    <slot />
  </PynSettingsLayout>
</template>
