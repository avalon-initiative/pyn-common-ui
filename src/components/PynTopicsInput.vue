<script setup lang="ts">
import { computed, ref, useId } from 'vue'
import PynIcon from './PynIcon.vue'
import styles from '../styles/PynTopicsInput.module.scss'
import { MAX_TOPICS, MAX_TOPIC_LENGTH, addTopics, splitTopics } from '../state/topics.state'

const props = withDefaults(
  defineProps<{
    label?: string
    hideLabel?: boolean
    help?: string
    /** An error from outside, such as the server's; shown before the input's own. */
    error?: string
    optional?: boolean
    disabled?: boolean
    max?: number
    maxLength?: number
    placeholder?: string
    id?: string
  }>(),
  { label: 'Topics', max: MAX_TOPICS, maxLength: MAX_TOPIC_LENGTH, placeholder: 'Add a topic' },
)
const topics = defineModel<string[]>({ default: () => [] })

const auto = useId()
const id = computed(() => props.id ?? auto)
const draft = ref('')
const own = ref('')
const shown = computed(() => props.error || own.value)
const input = ref<HTMLInputElement | null>(null)

/** Adds the typed text; false while text that cannot be added remains. */
function commit(): boolean {
  const r = addTopics(topics.value, splitTopics(draft.value), props.max, props.maxLength)
  if (r.topics.length !== topics.value.length) topics.value = r.topics
  draft.value = r.rest.join(' ')
  own.value = r.error ?? ''
  return !r.rest.length
}

function remove(i: number) {
  topics.value = topics.value.filter((_, at) => at !== i)
  own.value = ''
  input.value?.focus()
}

function onKey(e: KeyboardEvent) {
  if ((e.key === 'Enter' || e.key === ',' || e.key === ' ') && draft.value.trim()) {
    e.preventDefault()
    commit()
  } else if (e.key === 'Enter' || e.key === ',') {
    e.preventDefault()
  } else if (e.key === 'Backspace' && !draft.value && topics.value.length) {
    topics.value = topics.value.slice(0, -1)
    own.value = ''
  }
}

function onInput() {
  if (/[\s,]/.test(draft.value)) commit()
  else own.value = ''
}

defineExpose({ commit, focus: () => input.value?.focus() })
</script>

<template>
  <div :class="styles.field">
    <label :for="id" :class="[styles.label, hideLabel && styles.hidden]"
      >{{ label }}<span v-if="optional" :class="styles.optional"> (optional)</span></label
    >
    <div
      :class="[styles.box, disabled && styles.disabled]"
      :data-invalid="shown ? true : undefined"
      @click.self="input?.focus()"
    >
      <ul v-if="topics.length" :class="styles.chips" aria-label="Topics added">
        <li v-for="(t, i) in topics" :key="t" :class="styles.chip" data-topic>
          {{ t }}
          <button
            type="button"
            :class="styles.remove"
            :aria-label="`Remove ${t}`"
            :disabled="disabled"
            @click="remove(i)"
          >
            <PynIcon name="close" />
          </button>
        </li>
      </ul>
      <input
        :id="id"
        ref="input"
        v-model="draft"
        :class="styles.input"
        :placeholder="topics.length >= max ? '' : placeholder"
        :disabled="disabled || topics.length >= max"
        autocapitalize="none"
        autocomplete="off"
        spellcheck="false"
        :aria-invalid="shown ? true : undefined"
        :aria-describedby="[shown && `${id}-error`, `${id}-help`].filter(Boolean).join(' ')"
        @keydown="onKey"
        @input="onInput"
        @blur="draft.trim() && commit()"
      />
    </div>
    <div :class="styles.foot">
      <div :class="styles.notes">
        <p v-if="shown" :id="`${id}-error`" :class="styles.error" role="alert">{{ shown }}</p>
        <p :id="`${id}-help`" :class="styles.help">
          {{ help ?? 'Separate topics with spaces, commas or Enter.' }}
        </p>
      </div>
      <span :class="styles.counter" data-counter>{{ topics.length }} / {{ max }}</span>
    </div>
  </div>
</template>
