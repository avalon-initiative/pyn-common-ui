<script setup lang="ts">
import styles from '../styles/PynViewHeader.module.scss'

defineProps<{ title: string }>()
</script>

<template>
  <header :class="styles.header">
    <h1 :class="styles.title">{{ title }}</h1>
    <span v-if="$slots.default" :class="styles.actions"><slot /></span>
  </header>
</template>
