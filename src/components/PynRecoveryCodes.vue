<script setup lang="ts">
import { ref } from 'vue'
import styles from '../styles/PynRecoveryCodes.module.scss'
import { copyText } from '../utils/copy'
import { downloadText } from '../utils/download'

const props = withDefaults(defineProps<{ codes: string[]; filename?: string }>(), {
  filename: 'pyn-recovery-codes.txt',
})
const emit = defineEmits<{ saved: [] }>()

const copied = ref(false)
const copyFailed = ref(false)

async function copy() {
  copied.value = await copyText(props.codes.join('\n'))
  copyFailed.value = !copied.value
}
</script>

<template>
  <section :class="styles.card" role="status">
    <h2 :class="styles.heading">Save your recovery codes</h2>
    <p :class="styles.note">
      Each code signs you in once if you lose your authenticator app. They are shown only now, so
      keep them somewhere safe.
    </p>
    <ul :class="styles.codes">
      <li v-for="code in codes" :key="code" :class="styles.code">{{ code }}</li>
    </ul>
    <p v-if="copyFailed" :class="styles.error" role="status">Could not copy</p>
    <div :class="styles.actions">
      <button type="button" :class="styles.button" @click="copy">
        {{ copied ? 'Copied' : 'Copy' }}
      </button>
      <button
        type="button"
        :class="styles.button"
        @click="downloadText(filename, codes.join('\n') + '\n')"
      >
        Download
      </button>
      <button type="button" :class="styles.primary" @click="emit('saved')">I saved them</button>
    </div>
  </section>
</template>
