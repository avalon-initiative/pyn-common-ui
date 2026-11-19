<script setup lang="ts">
import { ref } from 'vue'
import PynIcon from './PynIcon.vue'
import styles from '../styles/PynPeopleSearch.module.scss'

defineProps<{ busy?: boolean; placeholder?: string }>()
const emit = defineEmits<{ search: [q: string] }>()

const query = ref('')

function submit() {
  emit('search', query.value.trim())
}
function clear() {
  query.value = ''
  emit('search', '')
}
</script>

<template>
  <form :class="styles.search" role="search" @submit.prevent="submit">
    <PynIcon name="search" :class="styles.icon" />
    <input
      v-model="query"
      type="search"
      maxlength="64"
      :class="styles.input"
      :placeholder="placeholder ?? 'Search people…'"
      aria-label="Search people"
      :aria-busy="busy"
    />
    <button
      v-if="query"
      type="button"
      :class="styles.clear"
      aria-label="Clear search"
      @click="clear"
    >
      ×
    </button>
  </form>
</template>
