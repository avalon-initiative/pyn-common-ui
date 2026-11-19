<script setup lang="ts">
import { ref } from 'vue'
import styles from '../styles/PynPasswordPrompt.module.scss'

const props = withDefaults(defineProps<{ title?: string; busy?: boolean; error?: string }>(), {
  title: 'Confirm your password',
})
const emit = defineEmits<{ submit: [password: string]; cancel: [] }>()

const password = ref('')

function send() {
  if (password.value && !props.busy) emit('submit', password.value)
}
</script>

<template>
  <form :class="styles.form" @submit.prevent="send">
    <h3 :class="styles.heading">{{ title }}</h3>
    <label :class="styles.field"
      >Current password
      <input
        v-model="password"
        :class="styles.input"
        type="password"
        autocomplete="current-password"
        required
        :disabled="busy"
      />
    </label>
    <p v-if="error" :class="styles.error" role="alert">{{ error }}</p>
    <div :class="styles.actions">
      <button type="submit" :class="styles.primary" :disabled="busy || !password">Continue</button>
      <button type="button" :class="styles.quiet" @click="emit('cancel')">Cancel</button>
    </div>
  </form>
</template>
