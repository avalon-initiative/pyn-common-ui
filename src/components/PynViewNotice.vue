<script setup lang="ts">
import styles from '../styles/PynViewNotice.module.scss'
import PynIcon from './PynIcon.vue'
import PynDismissButton from './PynDismissButton.vue'
import { AUTO_DISMISS_MS, useAutoDismiss } from '../state/auto-dismiss.state'

const props = withDefaults(
  defineProps<{
    tone?: 'warning' | 'info' | 'success' | 'danger'
    title?: string
    /** Adds a close button and fades the notice after `autoDismissMs`. */
    dismissible?: boolean
    /** Milliseconds before the fade; 0 keeps the notice until it is closed. */
    autoDismissMs?: number
    /** Keeps a dismissible notice until it is closed, for messages that need action. */
    persistent?: boolean
  }>(),
  { tone: 'warning', autoDismissMs: AUTO_DISMISS_MS },
)
const emit = defineEmits<{ dismiss: [] }>()

const icons = { warning: 'alert', info: 'info', success: 'check-circle', danger: 'stop' }

const { phase, handlers, close } = useAutoDismiss({
  delay: () => (props.dismissible && !props.persistent ? props.autoDismissMs : 0),
  onDismiss: () => emit('dismiss'),
})
</script>

<template>
  <div
    v-if="phase !== 'gone'"
    :class="[styles.notice, styles[tone], phase === 'fading' && styles.fading]"
    role="status"
    v-on="dismissible ? handlers : {}"
  >
    <PynIcon :name="icons[tone]" :class="styles.icon" />
    <div :class="styles.body">
      <h3 v-if="title" :class="styles.title">{{ title }}</h3>
      <div :class="styles.text"><slot /></div>
    </div>
    <PynDismissButton v-if="dismissible" @click="close" />
  </div>
</template>
