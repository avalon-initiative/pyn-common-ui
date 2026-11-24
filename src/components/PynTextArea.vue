<script setup lang="ts">
import { computed, ref, useId } from 'vue'
import styles from '../styles/PynTextArea.module.scss'
import { fieldDescribedBy, showsCounter } from '../state/text-field.state'
import type { TextFieldProps } from '../types/text-field.types'

const props = withDefaults(defineProps<TextFieldProps & { rows?: number }>(), {
  rows: 5,
  counter: undefined,
})
const value = defineModel<string>({ default: '' })
const emit = defineEmits<{ submit: [] }>()

const auto = useId()
const id = computed(() => props.id ?? auto)
const counted = computed(() => showsCounter(props.maxlength, props.counter))
const over = computed(() => props.maxlength !== undefined && value.value.length > props.maxlength)
const describedBy = computed(() =>
  fieldDescribedBy(id.value, { help: props.help, error: props.error, counter: counted.value }),
)
const area = ref<HTMLTextAreaElement | null>(null)
defineExpose({ focus: () => area.value?.focus() })
</script>

<template>
  <div :class="styles.field">
    <label :for="id" :class="[styles.label, hideLabel && styles.hidden]"
      >{{ label }}<span v-if="optional" :class="styles.optional"> (optional)</span></label
    >
    <textarea
      :id="id"
      ref="area"
      v-model="value"
      :class="[styles.input, mono && styles.mono]"
      :rows="rows"
      :name="name"
      :placeholder="placeholder"
      :autocomplete="autocomplete"
      :maxlength="maxlength"
      :disabled="disabled"
      :required="required"
      :aria-invalid="!!error || over || undefined"
      :aria-describedby="describedBy"
      @keydown.enter.ctrl.prevent="emit('submit')"
      @keydown.enter.meta.prevent="emit('submit')"
    />
    <div v-if="help || error || counted" :class="styles.foot">
      <div :class="styles.notes">
        <p v-if="error" :id="`${id}-error`" :class="styles.error" role="alert">{{ error }}</p>
        <p v-if="help" :id="`${id}-help`" :class="styles.help">{{ help }}</p>
      </div>
      <span
        v-if="counted"
        :id="`${id}-count`"
        :class="styles.counter"
        :data-over="over || undefined"
        data-counter
        >{{ value.length }} / {{ maxlength }}</span
      >
    </div>
  </div>
</template>
