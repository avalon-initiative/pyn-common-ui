<script setup lang="ts">
import styles from '../styles/PynViewSummary.module.scss'
</script>

<template>
  <p :class="styles.summary"><slot /></p>
</template>
