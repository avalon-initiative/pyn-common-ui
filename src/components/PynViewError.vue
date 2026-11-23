<script setup lang="ts">
import styles from '../styles/PynViewError.module.scss'
import PynDismissButton from './PynDismissButton.vue'
import { AUTO_DISMISS_MS, useAutoDismiss } from '../state/auto-dismiss.state'

const props = withDefaults(
  defineProps<{
    /** Adds a close button and fades the message after `autoDismissMs`. */
    dismissible?: boolean
    /** Milliseconds before the fade; 0 keeps the message until it is closed. */
    autoDismissMs?: number
    /** Keeps a dismissible error until it is closed, for errors that need action. */
    persistent?: boolean
  }>(),
  { autoDismissMs: AUTO_DISMISS_MS },
)
const emit = defineEmits<{ dismiss: [] }>()

const { phase, handlers, close } = useAutoDismiss({
  delay: () => (props.dismissible && !props.persistent ? props.autoDismissMs : 0),
  onDismiss: () => emit('dismiss'),
})
</script>

<template>
  <div
    v-if="phase !== 'gone'"
    :class="[styles.error, phase === 'fading' && styles.fading]"
    role="alert"
    v-on="dismissible ? handlers : {}"
  >
    <span :class="styles.text"><slot /></span>
    <PynDismissButton v-if="dismissible" @click="close" />
  </div>
</template>
