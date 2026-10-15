<script setup lang="ts">
import styles from '../styles/PynViewAction.module.scss'

withDefaults(defineProps<{ href: string; primary?: boolean }>(), { primary: false })
</script>

<template>
  <a :href="href" :class="primary ? styles.primary : styles.secondary"><slot /></a>
</template>
