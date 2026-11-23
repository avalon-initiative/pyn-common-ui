<script setup lang="ts">
import { computed } from 'vue'
import PynIcon from './PynIcon.vue'
import styles from '../styles/PynUpdateNotice.module.scss'

const props = defineProps<{
  current: string
  latest?: string
  prerelease?: boolean
  url?: string
}>()
const emit = defineEmits<{ dismiss: [] }>()

const safeUrl = computed(() => (props.url && /^https?:\/\//i.test(props.url) ? props.url : null))
</script>

<template>
  <section v-if="latest" :class="styles.notice" role="status" data-banner>
    <PynIcon name="info" :class="styles.icon" />
    <div :class="styles.body">
      <p :class="styles.text">
        <strong>A newer release is available:</strong>
        <span :class="styles.versions">{{ current }} to {{ latest }}</span>
        <span v-if="prerelease" :class="styles.tag">pre-release</span>
      </p>
      <a
        v-if="safeUrl"
        :class="styles.link"
        :href="safeUrl"
        target="_blank"
        rel="noopener noreferrer"
      >
        Release notes
      </a>
    </div>
    <button
      type="button"
      :class="styles.dismiss"
      aria-label="Dismiss update notice"
      @click="emit('dismiss')"
    >
      Dismiss
    </button>
  </section>
</template>
