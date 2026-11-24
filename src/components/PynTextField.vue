<script setup lang="ts">
import { computed, ref, useId } from 'vue'
import styles from '../styles/PynTextField.module.scss'
import { fieldDescribedBy, showsCounter } from '../state/text-field.state'
import type { TextFieldProps } from '../types/text-field.types'

const props = withDefaults(
  defineProps<TextFieldProps & { type?: 'text' | 'email' | 'url' | 'search' | 'password' }>(),
  { type: 'text', counter: undefined },
)
const value = defineModel<string>({ default: '' })

const auto = useId()
const id = computed(() => props.id ?? auto)
const counted = computed(() => showsCounter(props.maxlength, props.counter))
const over = computed(() => props.maxlength !== undefined && value.value.length > props.maxlength)
const describedBy = computed(() =>
  fieldDescribedBy(id.value, { help: props.help, error: props.error, counter: counted.value }),
)
const input = ref<HTMLInputElement | null>(null)
defineExpose({ focus: () => input.value?.focus() })
</script>

<template>
  <div :class="styles.field">
    <label :for="id" :class="[styles.label, hideLabel && styles.hidden]"
      >{{ label }}<span v-if="optional" :class="styles.optional"> (optional)</span></label
    >
    <input
      :id="id"
      ref="input"
      v-model="value"
      :class="[styles.input, mono && styles.mono]"
      :type="type"
      :name="name"
      :placeholder="placeholder"
      :autocomplete="autocomplete"
      :maxlength="maxlength"
      :disabled="disabled"
      :required="required"
      :aria-invalid="!!error || over || undefined"
      :aria-describedby="describedBy"
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
