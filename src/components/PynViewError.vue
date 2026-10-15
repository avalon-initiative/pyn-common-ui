<script setup lang="ts">
import styles from '../styles/PynViewError.module.scss'
</script>

<template>
  <p :class="styles.error" role="alert"><slot /></p>
</template>
