<script setup lang="ts">
import { computed } from 'vue'
import styles from '../styles/PynUsageMeter.module.scss'
import { formatBytes } from '../utils/bytes'
import { usageLevel, usagePercent } from '../state/usage.state'

const props = defineProps<{
  label: string
  used: number
  /** Null is unlimited. */
  limit: number | null
  /** How values read: bytes are formatted, counts are plain numbers. */
  unit?: 'bytes' | 'count'
}>()

const fmt = (n: number) => (props.unit === 'bytes' ? formatBytes(n) : String(n))
const percent = computed(() => usagePercent(props.used, props.limit))
const level = computed(() => usageLevel(props.used, props.limit))
const text = computed(() =>
  props.limit === null
    ? `${fmt(props.used)} used, unlimited`
    : `${fmt(props.used)} of ${fmt(props.limit)}`,
)
</script>

<template>
  <div :class="[styles.meter, styles[level]]" :data-level="level">
    <div :class="styles.head">
      <span :class="styles.label">{{ label }}</span>
      <span :class="styles.value">{{ text }}</span>
    </div>
    <div
      :class="styles.track"
      :role="limit === null ? undefined : 'meter'"
      :aria-label="limit === null ? undefined : label"
      :aria-valuemin="limit === null ? undefined : 0"
      :aria-valuemax="limit === null ? undefined : limit"
      :aria-valuenow="limit === null ? undefined : Math.min(used, limit)"
      :aria-valuetext="limit === null ? undefined : text"
      :aria-hidden="limit === null ? true : undefined"
    >
      <span v-if="percent !== null" :class="styles.fill" :style="{ width: `${percent}%` }" />
    </div>
  </div>
</template>
