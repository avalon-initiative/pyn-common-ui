<script setup lang="ts">
import PynIcon from './PynIcon.vue'
import styles from '../styles/PynSecurityNotice.module.scss'

withDefaults(
  defineProps<{
    message: string
    actionLabel?: string
    actionHref?: string
    required?: boolean
    deadline?: string
    dismissible?: boolean
    compact?: boolean
  }>(),
  { required: false, dismissible: false, compact: false },
)
const emit = defineEmits<{ dismiss: []; action: [event: MouseEvent] }>()
</script>

<template>
  <div
    :class="[styles.notice, required ? styles.required : styles.advice, compact && styles.compact]"
    role="status"
    data-banner
  >
    <PynIcon name="lock" :class="styles.icon" />
    <div :class="styles.body">
      <span :class="styles.hidden">{{
        required ? 'Security requirement:' : 'Security notice:'
      }}</span>
      <span :class="styles.message">{{ message }}</span>
      <span v-if="required" :class="styles.badge">Required</span>
      <span v-if="required && deadline" :class="styles.deadline">{{ deadline }}</span>
    </div>
    <slot name="action">
      <a
        v-if="actionLabel && actionHref"
        :href="actionHref"
        :class="styles.action"
        @click="emit('action', $event)"
      >
        {{ actionLabel }}
      </a>
      <button
        v-else-if="actionLabel"
        type="button"
        :class="styles.action"
        @click="emit('action', $event)"
      >
        {{ actionLabel }}
      </button>
    </slot>
    <button
      v-if="dismissible && !required"
      type="button"
      :class="styles.dismiss"
      aria-label="Dismiss"
      @click="emit('dismiss')"
    >
      ×
    </button>
  </div>
</template>
