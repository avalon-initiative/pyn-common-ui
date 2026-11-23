<script setup lang="ts">
import { ref } from 'vue'
import PynIcon from './PynIcon.vue'
import styles from '../styles/PynGlobalSearch.module.scss'

defineProps<{ options?: string[]; placeholder?: string }>()
const emit = defineEmits<{ input: [text: string]; search: [text: string] }>()

const text = ref('')
const field = ref<HTMLInputElement | null>(null)
defineExpose({ focus: () => field.value?.focus() })

function onInput() {
  emit('input', text.value)
}
function submit() {
  emit('search', text.value.trim())
}
</script>

<template>
  <form :class="styles.search" role="search" @submit.prevent="submit">
    <PynIcon name="search" :class="styles.icon" />
    <input
      ref="field"
      v-model="text"
      type="search"
      :class="styles.input"
      :placeholder="placeholder ?? 'Search or jump to…'"
      aria-label="Search or jump to"
      aria-keyshortcuts="/"
      autocomplete="off"
      :list="options?.length ? 'pyn-global-search-options' : undefined"
      @input="onInput"
    />
    <kbd v-if="!text" :class="styles.hint" aria-hidden="true">/</kbd>
    <datalist v-if="options?.length" id="pyn-global-search-options">
      <option v-for="o in options" :key="o" :value="o" />
    </datalist>
  </form>
</template>
