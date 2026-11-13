<script setup lang="ts">
import { computed } from 'vue'
import styles from '../styles/PynVersionFooter.module.scss'
import { versionMismatch } from '../utils/version'

const props = defineProps<{
  webVersion: string
  serverVersion?: string
  webRevision?: string
  serverRevision?: string
}>()

const label = (v: string) => (v.startsWith('v') ? v : `v${v}`)
const mismatch = computed(() => versionMismatch(props.webVersion, props.serverVersion ?? ''))
const title = computed(() =>
  [
    props.webRevision && `web ${props.webRevision}`,
    props.serverRevision && `server ${props.serverRevision}`,
  ]
    .filter(Boolean)
    .join(' · '),
)
</script>

<template>
  <footer
    :class="[styles.footer, mismatch && styles.mismatch]"
    :title="title || undefined"
    :data-mismatch="mismatch"
  >
    <span>web {{ label(webVersion) }}</span>
    <span aria-hidden="true">·</span>
    <span>server {{ serverVersion ? label(serverVersion) : 'unknown' }}</span>
    <strong v-if="mismatch" role="status" :class="styles.flag">version mismatch</strong>
  </footer>
</template>
