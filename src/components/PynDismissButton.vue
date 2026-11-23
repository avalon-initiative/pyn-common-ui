<script setup lang="ts">
import PynIcon from './PynIcon.vue'
import styles from '../styles/PynDismissButton.module.scss'

withDefaults(defineProps<{ label?: string }>(), { label: 'Dismiss message' })
defineEmits<{ click: [] }>()
</script>

<template>
  <button type="button" :class="styles.button" :aria-label="label" @click="$emit('click')">
    <PynIcon name="close" />
  </button>
</template>
