<script setup lang="ts">
import styles from '../styles/PynOwnerFrozenNotice.module.scss'
import type { OwnerFreeze } from '../types/org.types'
import { formatDateTime } from '../utils/datetime'

defineProps<{ freeze: OwnerFreeze }>()
</script>

<template>
  <section v-if="freeze.frozen" :class="styles.notice" role="status">
    <h2 :class="styles.title">
      {{ freeze.kind === 'org' ? 'Organization' : 'User' }}
      <strong>{{ freeze.owner }}</strong> is frozen
    </h2>
    <p :class="styles.text">Writes are refused while the freeze lasts. Reading continues.</p>
    <p v-if="freeze.reason" :class="styles.reason">{{ freeze.reason }}</p>
    <p v-if="freeze.frozen_at" :class="styles.meta">
      Frozen
      <time :datetime="freeze.frozen_at">{{ formatDateTime(freeze.frozen_at) }}</time>
    </p>
  </section>
</template>
