<script setup lang="ts">
import { computed } from 'vue'
import styles from '../styles/PynQuickSetup.module.scss'

const props = defineProps<{
  name: string
  /** The clone command, for example `pyn clone acme/game`. */
  command?: string
}>()

const clone = computed(() => props.command ?? `pyn clone <server>/<owner>/${props.name}`)
const steps = computed(() =>
  [clone.value, `cd ${props.name}`, 'pyn add .', 'pyn commit -m "First commit"', 'pyn push'].join(
    '\n',
  ),
)
</script>

<template>
  <section :class="styles.box" aria-labelledby="quick-setup-title">
    <h2 id="quick-setup-title" :class="styles.title">Quick setup</h2>
    <p :class="styles.text">This repository is empty. Clone it, add your files and push.</p>
    <pre :class="styles.code" aria-label="Commands"><code>{{ steps }}</code></pre>
    <p :class="styles.text">
      Files marked <code>exclusive</code> in <code>.pyn/pyn.toml</code> are locked while one person
      edits them; everything else merges.
    </p>
  </section>
</template>
