<script setup lang="ts">
import { computed } from 'vue'
import PynSettingsLayout from './PynSettingsLayout.vue'
import type { NavItem } from '../state/shell.state'

const props = withDefaults(
  defineProps<{
    items: Pick<NavItem, 'id' | 'label' | 'href'>[]
    current: string
    title?: string
  }>(),
  { title: 'Server administration' },
)

const sections = computed(() => props.items.map((i) => ({ ...i })))
</script>

<template>
  <PynSettingsLayout
    :sections="sections"
    :current="current"
    :title="title"
    label="Server administration"
    variant="admin"
  >
    <template v-if="$slots.actions" #actions><slot name="actions" /></template>
    <slot />
  </PynSettingsLayout>
</template>
