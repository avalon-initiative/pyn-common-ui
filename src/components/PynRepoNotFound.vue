<script setup lang="ts">
import PynIcon from './PynIcon.vue'
import styles from '../styles/PynRepoNotFound.module.scss'

defineProps<{ slug: string }>()
</script>

<template>
  <section :class="styles.box" role="alert">
    <PynIcon name="repo" :class="styles.icon" />
    <h2 :class="styles.heading">Repository not found</h2>
    <p :class="styles.note">
      There is no <code>{{ slug }}</code>, or your account has no role in it. Private repositories
      do not reveal that they exist.
    </p>
    <div :class="styles.actions">
      <a href="/" :class="styles.link">Back to your repositories</a>
    </div>
  </section>
</template>
