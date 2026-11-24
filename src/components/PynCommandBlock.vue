<script setup lang="ts">
import { computed, onBeforeUnmount, ref } from 'vue'
import PynIcon from './PynIcon.vue'
import styles from '../styles/PynCommandBlock.module.scss'
import { copyText } from '../utils/copy'

const props = defineProps<{
  /** One command per line; a line starting with `#` is a comment and is not copied. */
  lines: string[]
  /** Accessible name of the block; the copy button reads "Copy <label>". */
  label: string
}>()
const emit = defineEmits<{ copy: [text: string] }>()

const copied = ref(false)
const failed = ref(false)
let timer: ReturnType<typeof setTimeout> | undefined

const commands = computed(() => props.lines.filter((l) => !l.trimStart().startsWith('#')))

async function copy() {
  const text = commands.value.join('\n')
  const ok = await copyText(text)
  failed.value = !ok
  copied.value = ok
  clearTimeout(timer)
  if (ok) {
    emit('copy', text)
    timer = setTimeout(() => (copied.value = false), 2000)
  }
}
onBeforeUnmount(() => clearTimeout(timer))
</script>

<template>
  <div :class="styles.block">
    <pre :class="styles.code" :aria-label="label" tabindex="0"><code><template
      v-for="(line, i) in lines"
      :key="i"
    ><span :class="line.trimStart().startsWith('#') ? styles.comment : undefined">{{ line }}</span
><template v-if="i < lines.length - 1">{{ '\n' }}</template></template></code></pre>
    <button
      type="button"
      :class="styles.copy"
      :aria-label="`Copy ${label}`"
      :title="copied ? 'Copied' : 'Copy'"
      @click="copy"
    >
      <PynIcon :name="copied ? 'check' : 'copy'" />
    </button>
    <span :class="styles.status" role="status">{{
      failed ? 'Could not copy' : copied ? 'Copied' : ''
    }}</span>
  </div>
</template>
