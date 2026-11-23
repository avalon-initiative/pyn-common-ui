<script setup lang="ts">
import { computed } from 'vue'
import styles from '../styles/PynRepoAbout.module.scss'

const props = defineProps<{
  description?: string | null
  website?: string | null
  topics?: string[]
}>()

const filled = computed(
  () => !!(props.description?.trim() || props.website?.trim() || props.topics?.length),
)
</script>

<template>
  <section v-if="filled" :class="styles.about" aria-labelledby="about-title">
    <h2 id="about-title" :class="styles.title">About</h2>
    <p v-if="description?.trim()" :class="styles.description">{{ description }}</p>
    <a v-if="website?.trim()" :href="website" :class="styles.website" rel="noopener">{{
      website
    }}</a>
    <ul v-if="topics?.length" :class="styles.topics">
      <li v-for="t in topics" :key="t" :class="styles.topic">{{ t }}</li>
    </ul>
  </section>
</template>
