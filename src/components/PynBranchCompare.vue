<script setup lang="ts">
import { computed } from 'vue'
import styles from '../styles/PynBranchCompare.module.scss'
import { pluralize } from '../utils/plural'
import type { BranchChange, BranchChangeKind, BranchCompareStatus } from '../types/branch.types'

const props = defineProps<{
  base: string
  head: string
  status: BranchCompareStatus
  ahead: number
  behind: number
  countsCapped?: boolean
  maxCommits?: number
  changes?: BranchChange[]
  truncated?: boolean
  loading?: boolean
  error?: string
}>()

defineEmits<{ select: [path: string] }>()

const markers: Record<BranchChangeKind, { letter: string; label: string }> = {
  added: { letter: 'A', label: 'Added' },
  modified: { letter: 'M', label: 'Modified' },
  deleted: { letter: 'D', label: 'Deleted' },
}

// A capped count reads "<max>+"; without maxCommits the count itself is the floor.
function count(n: number): string {
  const capped = props.countsCapped && (props.maxCommits === undefined || n >= props.maxCommits)
  return capped ? `${props.maxCommits ?? n}+` : String(n)
}

function commits(n: number): string {
  const plural = n !== 1 || (props.countsCapped && count(n).endsWith('+'))
  return `${count(n)} ${plural ? 'commits' : 'commit'}`
}

const sentence = computed(() => {
  const identical = props.status === 'identical' || (props.ahead === 0 && props.behind === 0)
  if (identical) return `Up to date with ${props.base}`
  if (props.status === 'ahead') return `${commits(props.ahead)} ahead of ${props.base}`
  if (props.status === 'behind') return `${commits(props.behind)} behind ${props.base}`
  return `${commits(props.ahead)} ahead, ${count(props.behind)} behind ${props.base}`
})
</script>

<template>
  <div :class="styles.compare">
    <p v-if="loading" :class="styles.status" role="status">Comparing with {{ base }}…</p>
    <p v-else-if="error" :class="styles.error" role="alert">{{ error }}</p>
    <template v-else>
      <p :class="styles.sentence">{{ sentence }}</p>
      <details v-if="changes && changes.length > 0" :class="styles.changes">
        <summary :class="styles.toggle">
          {{ pluralize(changes.length, 'changed path') }}
        </summary>
        <ul :class="styles.list" :aria-label="`Changed paths on ${head}`">
          <li v-for="change in changes" :key="change.path" :class="styles.item">
            <span :class="[styles.marker, styles[change.kind]]" aria-hidden="true">{{
              markers[change.kind].letter
            }}</span>
            <span :class="styles.hidden">{{ markers[change.kind].label }}</span>
            <button type="button" :class="styles.path" @click="$emit('select', change.path)">
              {{ change.path }}
            </button>
          </li>
        </ul>
        <p v-if="truncated" :class="styles.note">
          Showing the first {{ pluralize(changes.length, 'changed path') }}
        </p>
      </details>
    </template>
  </div>
</template>
