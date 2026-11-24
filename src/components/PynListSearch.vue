<script setup lang="ts">
import PynIcon from './PynIcon.vue'
import styles from '../styles/PynListSearch.module.scss'

defineProps<{ label: string; placeholder?: string }>()
const query = defineModel<string>({ default: '' })
</script>

<template>
  <div :class="styles.search" role="search">
    <PynIcon name="search" :class="styles.icon" />
    <input
      v-model="query"
      type="search"
      maxlength="100"
      :class="styles.input"
      :placeholder="placeholder ?? `${label}…`"
      :aria-label="label"
    />
  </div>
</template>
