<script setup lang="ts">
import { ref } from 'vue'
import styles from '../styles/PynSecretReveal.module.scss'

const props = withDefaults(defineProps<{ secret: string; message?: string }>(), {
  message: 'Copy this signing secret now. It is shown once.',
})
const emit = defineEmits<{ dismiss: [] }>()

const copied = ref(false)

async function copy() {
  try {
    await navigator.clipboard.writeText(props.secret)
    copied.value = true
  } catch {
    copied.value = false
  }
}
</script>

<template>
  <div :class="styles.secret" role="status">
    <strong>{{ message }}</strong>
    <p v-if="$slots.default" :class="styles.note"><slot /></p>
    <code :class="styles.code">{{ secret }}</code>
    <div :class="styles.actions">
      <button type="button" :class="styles.button" @click="copy">
        {{ copied ? 'Copied' : 'Copy' }}
      </button>
      <button type="button" :class="styles.button" @click="emit('dismiss')">Done</button>
    </div>
  </div>
</template>
