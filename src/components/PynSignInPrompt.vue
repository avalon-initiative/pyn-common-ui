<script setup lang="ts">
import { useId } from 'vue'
import styles from '../styles/PynSignInPrompt.module.scss'

withDefaults(
  defineProps<{
    message: string
    signInHref: string
    registerHref?: string
    headingLevel?: 1 | 2 | 3 | 4 | 5 | 6
  }>(),
  { headingLevel: 2 },
)
const emit = defineEmits<{ signIn: [event: MouseEvent] }>()
const id = useId()
</script>

<template>
  <section :class="styles.prompt" :aria-labelledby="id" role="region">
    <div :class="styles.text">
      <component :is="`h${headingLevel}`" :id="id" :class="styles.title"
        >Sign in to continue</component
      >
      <p :class="styles.message">{{ message }}</p>
    </div>
    <div :class="styles.actions">
      <a :href="signInHref" :class="styles.primary" data-sign-in @click="emit('signIn', $event)"
        >Sign in</a
      >
      <a v-if="registerHref" :href="registerHref" :class="styles.secondary" data-register
        >Create an account</a
      >
    </div>
  </section>
</template>
