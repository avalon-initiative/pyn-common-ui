<script setup lang="ts">
import PynDialog from './PynDialog.vue'
import styles from '../styles/PynConfirmDialog.module.scss'

withDefaults(
  defineProps<{
    open: boolean
    title: string
    confirmLabel?: string
    cancelLabel?: string
    /** Styles the confirm button as destructive. */
    danger?: boolean
    /** Disables the confirm button until a prerequisite is met. */
    confirmDisabled?: boolean
    busy?: boolean
    error?: string
  }>(),
  { confirmLabel: 'Confirm', cancelLabel: 'Cancel' },
)
const emit = defineEmits<{ confirm: []; close: [] }>()
</script>

<template>
  <PynDialog :open="open" :title="title" size="sm" @close="emit('close')">
    <div :class="styles.body"><slot /></div>
    <p v-if="error" :class="styles.error" role="alert">{{ error }}</p>
    <template #footer>
      <button type="button" :class="styles.cancel" :disabled="busy" @click="emit('close')">
        {{ cancelLabel }}
      </button>
      <button
        type="button"
        :class="danger ? styles.danger : styles.confirm"
        :disabled="busy || confirmDisabled"
        @click="emit('confirm')"
      >
        {{ confirmLabel }}
      </button>
    </template>
  </PynDialog>
</template>
