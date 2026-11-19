<script setup lang="ts">
import styles from '../styles/PynNotices.module.scss'
import { noticeTitle } from '../state/two-factor.state'
import { formatDate } from '../utils/datetime'
import type { Notice } from '../types/two-factor.types'

defineProps<{ notices: Notice[]; busy?: boolean }>()
const emit = defineEmits<{ dismiss: [id: string] }>()
</script>

<template>
  <ul v-if="notices.length" :class="styles.list" aria-label="Notices">
    <li v-for="n in notices" :key="n.id" :class="styles.item" role="status">
      <div :class="styles.what">
        <strong v-if="noticeTitle(n.kind)">{{ noticeTitle(n.kind) }}</strong>
        <span>{{ n.detail }}</span>
        <span :class="styles.meta">{{ formatDate(n.created_at) }}</span>
      </div>
      <button type="button" :class="styles.button" :disabled="busy" @click="emit('dismiss', n.id)">
        Dismiss
      </button>
    </li>
  </ul>
</template>
