<script setup lang="ts">
import { computed } from 'vue'
import styles from '../styles/PynDiffStat.module.scss'
import { statSquares } from '../state/diff.state'

const props = defineProps<{
  additions: number
  deletions: number
  /** Hides the proportion squares. */
  plain?: boolean
}>()

const squares = computed(() => statSquares(props.additions, props.deletions))
</script>

<template>
  <span :class="styles.stat" :title="`${additions} additions, ${deletions} deletions`">
    <span :class="styles.add">+{{ additions }}</span>
    <span :class="styles.delete">&minus;{{ deletions }}</span>
    <span v-if="!plain" :class="styles.squares" aria-hidden="true">
      <span v-for="(s, i) in squares" :key="i" :class="styles[s]" />
    </span>
  </span>
</template>
