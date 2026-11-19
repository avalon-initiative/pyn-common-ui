<script setup lang="ts">
import { computed } from 'vue'
import styles from '../styles/PynQrCode.module.scss'
import { qrMatrix } from '../utils/qr'

const props = withDefaults(defineProps<{ value: string; label?: string }>(), {
  label: 'QR code',
})

const matrix = computed(() => qrMatrix(props.value))
const size = computed(() => (matrix.value?.length ?? 0) + 8)
const path = computed(() =>
  (matrix.value ?? [])
    .flatMap((row, y) => row.map((dark, x) => (dark ? `M${x + 4} ${y + 4}h1v1h-1z` : '')))
    .join(''),
)
</script>

<template>
  <svg
    v-if="matrix"
    :class="styles.qr"
    :viewBox="`0 0 ${size} ${size}`"
    role="img"
    :aria-label="label"
    shape-rendering="crispEdges"
  >
    <rect :width="size" :height="size" fill="#fff" />
    <path :d="path" fill="#000" />
  </svg>
</template>
