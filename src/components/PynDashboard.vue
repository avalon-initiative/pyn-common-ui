<script setup lang="ts">
import styles from '../styles/PynDashboard.module.scss'
</script>

<template>
  <div :class="styles.dashboard">
    <header v-if="$slots.header" :class="styles.header"><slot name="header" /></header>
    <div :class="styles.main"><slot name="main" /></div>
    <aside v-if="$slots.side" :class="styles.side"><slot name="side" /></aside>
  </div>
</template>
