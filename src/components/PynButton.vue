<script setup lang="ts">
// No <style> blocks and no non-trivial logic here: styles live in src/styles/,
// types in src/types/.
import styles from '../styles/PynButton.module.scss'
import type { PynButtonProps } from '../types/PynButton.types'

withDefaults(defineProps<PynButtonProps>(), {
  variant: 'primary',
})
</script>

<template>
  <button type="button" :class="[styles.pynButton, styles[variant]]" :disabled="disabled">{{ label }}</button>
</template>
