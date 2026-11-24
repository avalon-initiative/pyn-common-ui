<script setup lang="ts">
import { computed, inject } from 'vue'
import { PYN_ICON_PACK } from '../state/icon-pack.state'
import { iconMarkup, lucideIcons } from '../utils/icons'

const props = defineProps<{ name: string }>()
const pack = inject(PYN_ICON_PACK, {})

const markup = computed(() => iconMarkup(pack[props.name] ?? lucideIcons[props.name]))
</script>

<template>
  <svg
    viewBox="0 0 24 24"
    width="1em"
    height="1em"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
    aria-hidden="true"
  >
    <g v-html="markup" />
  </svg>
</template>
