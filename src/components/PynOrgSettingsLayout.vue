<script setup lang="ts">
import PynSettingsLayout from './PynSettingsLayout.vue'
import type { SettingsSection } from '../types/tabs.types'

defineProps<{
  sections: SettingsSection[]
  current: string
  title?: string
}>()
</script>

<template>
  <PynSettingsLayout
    :sections="sections"
    :current="current"
    :title="title"
    label="Organization settings"
  >
    <slot />
  </PynSettingsLayout>
</template>
