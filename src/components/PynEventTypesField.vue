<script setup lang="ts">
import { computed, ref, useId } from 'vue'
import styles from '../styles/PynEventTypesField.module.scss'
import { eventTypesText, parseEventTypes } from '../state/webhook.state'
import { unknownEventTypes, withUnknownTypes } from '../state/event-types.state'
import PynMultiSelect from './PynMultiSelect.vue'
import type { MultiSelectOption } from '../types/multi-select.types'

const props = defineProps<{
  modelValue: string[]
  /** The server's event types; without it (or when it failed to load) a textarea is shown. */
  options?: MultiSelectOption[]
  loading?: boolean
  error?: string
  /** Types already stored on the subscription; those missing from `options` are kept and marked unknown. */
  stored?: string[]
}>()
const emit = defineEmits<{ 'update:modelValue': [value: string[]] }>()

const id = useId()
const text = ref(eventTypesText(props.modelValue))
const picking = computed(() => !!props.options && !props.error)
const unknown = computed(() =>
  props.options && props.stored ? unknownEventTypes(props.stored, props.options) : [],
)
const choices = computed(() => withUnknownTypes(props.options ?? [], unknown.value))

function typed(e: Event) {
  text.value = (e.target as HTMLTextAreaElement).value
  emit('update:modelValue', parseEventTypes(text.value))
}
</script>

<template>
  <p v-if="loading" :class="styles.hint" role="status">Loading event types…</p>
  <template v-else>
    <p v-if="error" :class="styles.error" role="alert">{{ error }}</p>
    <div v-if="picking" :class="styles.field">
      <PynMultiSelect
        :id="`${id}-events`"
        label="Event types"
        :options="choices"
        :model-value="modelValue"
        placeholder="Choose event types"
        filter-placeholder="Filter event types"
        empty-label="None chosen: all events"
        @update:model-value="emit('update:modelValue', $event)"
      />
      <span v-if="unknown.length" :class="styles.hint"
        >The server no longer lists {{ unknown.join(', ') }}. Remove it to stop subscribing.</span
      >
    </div>
    <label v-else :class="styles.field"
      >Event types (one per line, empty for all)
      <textarea :value="text" :class="styles.input" rows="3" @input="typed" />
    </label>
  </template>
</template>
