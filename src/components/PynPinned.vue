<script setup lang="ts">
import PynEmptyState from './PynEmptyState.vue'
import styles from '../styles/PynPinned.module.scss'

withDefaults(defineProps<{ title?: string }>(), { title: 'Pinned' })
</script>

<template>
  <section :class="styles.pinned" aria-labelledby="pinned-title">
    <h2 id="pinned-title" :class="styles.title">{{ title }}</h2>
    <slot>
      <PynEmptyState
        compact
        kind="unsupported"
        icon="repo"
        title="Pinned repositories"
        description="Pinning repositories is not supported in pyn yet."
        :class="styles.state"
        data-pinned-unsupported
      />
    </slot>
  </section>
</template>
