<script setup lang="ts">
import { ref } from 'vue'
import styles from '../styles/PynSecretReveal.module.scss'
import { copyText } from '../utils/copy'

const props = withDefaults(defineProps<{ secret: string; message?: string }>(), {
  message: 'Copy this signing secret now. It is shown once.',
})
const emit = defineEmits<{ dismiss: [] }>()

const copied = ref(false)
const copyFailed = ref(false)

async function copy() {
  copied.value = await copyText(props.secret)
  copyFailed.value = !copied.value
}
</script>

<template>
  <div :class="styles.secret" role="status">
    <strong>{{ message }}</strong>
    <p v-if="$slots.default" :class="styles.note"><slot /></p>
    <code :class="styles.code">{{ secret }}</code>
    <p v-if="copyFailed" :class="styles.error" role="status">Could not copy</p>
    <div :class="styles.actions">
      <button type="button" :class="styles.button" @click="copy">
        {{ copied ? 'Copied' : 'Copy' }}
      </button>
      <button type="button" :class="styles.button" @click="emit('dismiss')">Done</button>
    </div>
  </div>
</template>
