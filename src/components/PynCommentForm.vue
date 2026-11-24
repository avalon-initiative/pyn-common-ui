<script setup lang="ts">
import { computed, ref, useId } from 'vue'
import PynIcon from './PynIcon.vue'
import PynTextArea from './PynTextArea.vue'
import styles from '../styles/PynCommentForm.module.scss'

const props = withDefaults(
  defineProps<{
    label?: string
    placeholder?: string
    help?: string
    submitLabel?: string
    rows?: number
    maxlength?: number
    busy?: boolean
    error?: string
    disabled?: boolean
    /** Allows submitting an empty text, for editing a description. */
    allowEmpty?: boolean
    /** Adds a Close button that emits `close` with the text, which may be empty. */
    canClose?: boolean
    /** Adds a Cancel button that emits `cancel`. */
    cancelable?: boolean
    /** A heading above the form, such as "Add a comment". */
    heading?: string
    /** Frames the text area and its help in a bordered card. */
    card?: boolean
  }>(),
  {
    label: 'Comment',
    placeholder: 'Leave a comment',
    help: 'Markdown is supported.',
    submitLabel: 'Comment',
    rows: 5,
  },
)
const body = defineModel<string>({ default: '' })
const emit = defineEmits<{ submit: [body: string]; close: [body: string]; cancel: [] }>()

const empty = computed(() => !body.value.trim())
const canSubmit = computed(
  () => !props.busy && !props.disabled && (props.allowEmpty || !empty.value),
)
const headingId = useId()
const area = ref<InstanceType<typeof PynTextArea> | null>(null)
defineExpose({ focus: () => area.value?.focus() })

function submit() {
  if (canSubmit.value) emit('submit', body.value)
}
</script>

<template>
  <form
    :class="styles.form"
    :aria-labelledby="heading ? headingId : undefined"
    data-comment-form
    @submit.prevent="submit"
  >
    <h2 v-if="heading" :id="headingId" :class="styles.heading">{{ heading }}</h2>
    <div :class="card ? styles.card : styles.plain" :data-card="card || undefined">
      <PynTextArea
        ref="area"
        v-model="body"
        :label="label"
        hide-label
        :placeholder="placeholder"
        :help="help"
        :rows="rows"
        :maxlength="maxlength"
        :disabled="disabled || busy"
        @submit="submit"
      />
    </div>
    <p v-if="error" :class="styles.error" role="alert">{{ error }}</p>
    <div :class="styles.actions">
      <button
        v-if="cancelable"
        type="button"
        :class="styles.button"
        :disabled="busy"
        data-cancel
        @click="emit('cancel')"
      >
        Cancel
      </button>
      <button
        v-if="canClose"
        type="button"
        :class="styles.button"
        :disabled="busy || disabled"
        data-close
        @click="emit('close', body)"
      >
        <PynIcon name="pull-closed" :class="styles.closeIcon" />
        {{ empty ? 'Close pull request' : 'Close with comment' }}
      </button>
      <button type="submit" :class="styles.submit" :disabled="!canSubmit" data-submit>
        {{ submitLabel }}
      </button>
    </div>
  </form>
</template>
